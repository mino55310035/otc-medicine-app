import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import type { HearingInput, Medicine } from '@/lib/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export async function POST(req: Request) {
  try {
    const hearing: HearingInput = await req.json()

    // 禁忌・飲み合わせに引っかかる薬を除外
    const excludeIds: string[] = []

    if (hearing.current_medicines.length > 0) {
      const { data: interactions } = await supabase
        .from('interactions')
        .select('medicine_id')
        .in('interacting_with', hearing.current_medicines)

      interactions?.forEach(i => excludeIds.push(i.medicine_id))
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

    // 関連する薬を取得
    let query = supabase
      .from('medicines')
      .select('*')

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
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}