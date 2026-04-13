import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { HearingInput, Medicine } from '@/lib/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const hearing: HearingInput = await req.json()

    // 禁忌・飲み合わせに引っかかる薬を除外
    const excludeIds: string[] = []
    const cautionIds: string[] = []

    if (hearing.current_medicines.length > 0) {
      // ユーザー入力を医療用医薬品テーブルで照合し、成分名も取得
      const { data: matchedPrescriptions } = await supabase
        .from('prescription_medicines')
        .select('id, name, prescription_ingredients(name)')
        .in('name', hearing.current_medicines)

      // 照合できた薬名 + その成分名を合わせてチェック対象にする
      const checkNames = [...hearing.current_medicines]
      matchedPrescriptions?.forEach(pm => {
        const ingredients = pm.prescription_ingredients as { name: string }[]
        ingredients?.forEach(i => {
          if (!checkNames.includes(i.name)) checkNames.push(i.name)
        })
      })

      // OTCの飲み合わせテーブルで照合
      const { data: interactions } = await supabase
        .from('interactions')
        .select('medicine_id, description, type')
        .in('interacting_with', checkNames)

      interactions?.forEach(i => {
        if (i.type === 'banned') {
          excludeIds.push(i.medicine_id)
        } else {
          cautionIds.push(i.medicine_id)
        }
      })
    }

    if (hearing.has_asthma || hearing.is_pregnant) {
      const conditions = []
      if (hearing.has_asthma) conditions.push('アスピリン喘息')
      if (hearing.is_pregnant) conditions.push('妊娠中')

      const { data: banned } = await supabase
        .from('contraindications')
        .select('medicine_id')
        .eq('type', 'banned')
        .in('condition', conditions)

      banned?.forEach(b => excludeIds.push(b.medicine_id))
    }

    // 症状からOTCカテゴリを特定
    const symptomToCategory: Record<string, string[]> = {
      '頭痛': ['鎮痛・解熱'],
      '生理痛': ['鎮痛・解熱'],
      '腰痛': ['鎮痛・解熱'],
      '肩こり': ['鎮痛・解熱', 'その他'],
      '関節痛': ['鎮痛・解熱'],
      '筋肉痛': ['鎮痛・解熱', 'その他'],
      '歯痛': ['鎮痛・解熱'],
      '発熱': ['鎮痛・解熱', '風邪薬'],
      'のどの痛み': ['風邪薬'],
      '咳': ['風邪薬'],
      '鼻水': ['風邪薬', '鼻炎薬'],
      '鼻づまり': ['風邪薬', '鼻炎薬'],
      'たん': ['風邪薬'],
      '悪寒': ['風邪薬'],
      '胃痛': ['胃腸薬'],
      '胃もたれ': ['胃腸薬'],
      '下痢': ['胃腸薬'],
      '便秘': ['胃腸薬'],
      '吐き気': ['胃腸薬'],
      '食欲不振': ['胃腸薬'],
      '腹部膨満感': ['胃腸薬'],
      '目のかゆみ': ['鼻炎薬'],
      '目の疲れ': ['その他'],
      '口内炎': ['その他'],
      '耳痛': ['鎮痛・解熱'],
      'くしゃみ': ['鼻炎薬'],
      '花粉症': ['鼻炎薬'],
      '蕁麻疹': ['鼻炎薬'],
      '皮膚のかゆみ': ['鼻炎薬'],
      '倦怠感': ['風邪薬', 'その他'],
      '不眠': ['その他'],
      '手足のしびれ': ['その他'],
    }

    const matchedCategories = new Set<string>()
    hearing.symptoms.forEach(s => {
      const categories = symptomToCategory[s]
      if (categories) categories.forEach(c => matchedCategories.add(c))
    })

    // 関連する薬を取得
    let query = supabase
      .from('medicines')
      .select('*')

    // 選択式の症状がある場合はカテゴリで絞り込む
    if (matchedCategories.size > 0) {
      query = query.in('category', Array.from(matchedCategories))
    }

    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`)
    }

    const { data: medicines, error } = await query
    if (error) throw error

    // 添付文書テキストをまとめてClaudeに渡す
    const documents = (medicines as Medicine[])
      .filter(m => m.document_text)
      .map(m => `【${m.name}】\n${m.document_text}`)
      .join('\n\n')

    const prompt = `
あなたは登録販売者のアシスタントです。
以下のお客様情報と添付文書データをもとに、適切な薬を提案してください。

【お客様情報】
症状：${hearing.symptoms.join('、')}
発症時期：${hearing.since ?? '不明'}
服用中の薬：${hearing.current_medicines.join('、') || 'なし'}
アレルギー：${hearing.allergies.join('、') || 'なし'}
喘息：${hearing.has_asthma ? 'あり' : 'なし'}
年齢層：${hearing.age_group}
妊娠の可能性：${hearing.is_pregnant ? 'あり' : 'なし'}

【参考データ（添付文書より）】
${documents}

上記をもとに以下の形式で回答してください。
- おすすめの薬（1〜3個）
- それぞれの推薦理由
- 注意事項
`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    })

    const result = message.content[0].type === 'text'
      ? message.content[0].text
      : ''

    return NextResponse.json({ result })
} catch (e) {
    console.error('suggest API error:', e)

    const errorMessage = e instanceof Error ? e.message : String(e)

    if (errorMessage.includes('credit') || errorMessage.includes('balance')) {
      return NextResponse.json(
        { error: 'AI機能が一時的に利用できません。管理者にお問い合わせください。' },
        { status: 503 }
      )
    }

    if (errorMessage.includes('rate') || errorMessage.includes('429')) {
      return NextResponse.json(
        { error: 'リクエストが集中しています。しばらく待ってから再度お試しください。' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: '提案の生成中にエラーが発生しました。しばらく待ってから再度お試しください。' },
      { status: 500 }
    )
  }
}