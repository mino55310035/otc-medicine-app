'use client'

import { useState } from 'react'
import type { AgeGroup, HearingInput } from '@/lib/types'

const SYMPTOM_OPTIONS = [
  '頭痛', '発熱', '鼻水', '鼻づまり', '咳', 'のどの痛み',
  '胃痛', '胃もたれ', '下痢', '便秘', '吐き気',
  '腰痛', '肩こり', '筋肉痛', '関節痛', '生理痛',
]

const AGE_OPTIONS: AgeGroup[] = ['小児', '成人', '高齢者']

const SINCE_OPTIONS = ['今日', '昨日から', '2〜3日前から', '1週間くらい前から', 'それ以上前から']

const TOTAL_STEPS = 6

export default function HearingForm() {
  const [step, setStep] = useState(1)

  const [symptoms, setSymptoms] = useState<string[]>([])
  const [customSymptom, setCustomSymptom] = useState('')
  const [since, setSince] = useState('')
  const [currentMedicines, setCurrentMedicines] = useState<string[]>([])
  const [medicineInput, setMedicineInput] = useState('')
  const [allergies, setAllergies] = useState<string[]>([])
  const [allergyInput, setAllergyInput] = useState('')
  const [hasAsthma, setHasAsthma] = useState(false)
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('成人')
  const [isPregnant, setIsPregnant] = useState(false)

  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function toggleSymptom(symptom: string) {
    setSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }

  function addCustomSymptom() {
    const trimmed = customSymptom.trim()
    if (trimmed && !symptoms.includes(trimmed)) {
      setSymptoms(prev => [...prev, trimmed])
      setCustomSymptom('')
    }
  }

  function canGoNext(): boolean {
    if (step === 1) return symptoms.length > 0
    return true
  }

  function next() {
    if (canGoNext() && step < TOTAL_STEPS) setStep(step + 1)
  }

  function back() {
    if (step > 1) setStep(step - 1)
  }

  async function handleSubmit() {
    setError('')
    setResult('')

    const hearing: HearingInput = {
      symptoms,
      since: since || null,
      current_medicines: currentMedicines,
      allergies,
      has_asthma: hasAsthma,
      age_group: ageGroup,
      is_pregnant: isPregnant,
    }

    setLoading(true)
    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hearing),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '提案の取得に失敗しました')
      setResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setStep(1)
    setSymptoms([])
    setCustomSymptom('')
    setSince('')
    setCurrentMedicines([])
    setMedicineInput('')
    setAllergies([])
    setAllergyInput('')
    setHasAsthma(false)
    setAgeGroup('成人')
    setIsPregnant(false)
    setResult('')
    setError('')
  }

  // 結果画面
  if (result) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-6">
          <h2 className="text-lg font-semibold text-emerald-400 mb-4">提案結果</h2>
          <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
            {result}
          </div>
        </div>
        <button
          onClick={reset}
          className="w-full rounded-xl bg-white/5 border border-white/10 py-3 text-sm font-semibold text-zinc-400 hover:bg-white/10 hover:text-zinc-200 transition-colors"
        >
          新しい相談をはじめる
        </button>
      </div>
    )
  }

  // エラー画面
  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-6">
          <p className="text-sm text-red-400">{error}</p>
        </div>
        <button
          onClick={() => { setError(''); setStep(TOTAL_STEPS) }}
          className="w-full rounded-xl bg-white/5 border border-white/10 py-3 text-sm font-semibold text-zinc-400 hover:bg-white/10 hover:text-zinc-200 transition-colors"
        >
          戻って修正する
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* プログレスバー */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < step ? 'bg-blue-500' : 'bg-white/10'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-zinc-600 text-right">{step} / {TOTAL_STEPS}</p>

      {/* ステップ1: 症状 */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">
            どんな症状がありますか？
          </h2>
          <div className="flex flex-wrap gap-2">
            {SYMPTOM_OPTIONS.map(symptom => (
              <button
                key={symptom}
                type="button"
                onClick={() => toggleSymptom(symptom)}
                className={`rounded-full px-4 py-2 text-sm border transition-colors ${
                  symptoms.includes(symptom)
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white/5 text-zinc-400 border-white/10 hover:border-blue-500/50 hover:text-zinc-200'
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customSymptom}
              onChange={e => setCustomSymptom(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addCustomSymptom()
                }
              }}
              placeholder="その他の症状を入力"
              className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50"
            />
            <button
              type="button"
              onClick={addCustomSymptom}
              className="rounded-lg bg-white/5 px-4 py-2 text-sm text-zinc-400 border border-white/10 hover:bg-white/10 hover:text-zinc-200 transition-colors"
            >
              追加
            </button>
          </div>
          {symptoms.filter(s => !SYMPTOM_OPTIONS.includes(s)).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {symptoms.filter(s => !SYMPTOM_OPTIONS.includes(s)).map(s => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-500 text-white px-3 py-1.5 text-sm"
                >
                  {s}
                  <button type="button" onClick={() => toggleSymptom(s)} className="hover:text-blue-200">
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ステップ2: 発症時期 */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">
            いつ頃から症状がありますか？
          </h2>
          <div className="flex flex-col gap-2">
            {SINCE_OPTIONS.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setSince(option)}
                className={`rounded-lg px-4 py-3 text-sm text-left border transition-colors ${
                  since === option
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white/5 text-zinc-400 border-white/10 hover:border-blue-500/50 hover:text-zinc-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ステップ3: 服用中の薬 */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">
            現在、服用中のお薬はありますか？
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={medicineInput}
              onChange={e => setMedicineInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const trimmed = medicineInput.trim()
                  if (trimmed && !currentMedicines.includes(trimmed)) {
                    setCurrentMedicines(prev => [...prev, trimmed])
                    setMedicineInput('')
                  }
                }
              }}
              placeholder="薬の名前を入力"
              className="flex-1 rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50"
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                const trimmed = medicineInput.trim()
                if (trimmed && !currentMedicines.includes(trimmed)) {
                  setCurrentMedicines(prev => [...prev, trimmed])
                  setMedicineInput('')
                }
              }}
              className="rounded-lg bg-white/5 px-4 py-3 text-sm text-zinc-400 border border-white/10 hover:bg-white/10 hover:text-zinc-200 transition-colors"
            >
              追加
            </button>
          </div>
          {currentMedicines.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {currentMedicines.map(med => (
                <span
                  key={med}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-500 text-white px-3 py-1.5 text-sm"
                >
                  {med}
                  <button
                    type="button"
                    onClick={() => setCurrentMedicines(prev => prev.filter(m => m !== med))}
                    className="hover:text-blue-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-zinc-600">なければそのまま次へ進んでください</p>
        </div>
      )}

      {/* ステップ4: アレルギー */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">
            薬のアレルギーはありますか？
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={allergyInput}
              onChange={e => setAllergyInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const trimmed = allergyInput.trim()
                  if (trimmed && !allergies.includes(trimmed)) {
                    setAllergies(prev => [...prev, trimmed])
                    setAllergyInput('')
                  }
                }
              }}
              placeholder="アレルギーのある薬や成分を入力"
              className="flex-1 rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50"
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                const trimmed = allergyInput.trim()
                if (trimmed && !allergies.includes(trimmed)) {
                  setAllergies(prev => [...prev, trimmed])
                  setAllergyInput('')
                }
              }}
              className="rounded-lg bg-white/5 px-4 py-3 text-sm text-zinc-400 border border-white/10 hover:bg-white/10 hover:text-zinc-200 transition-colors"
            >
              追加
            </button>
          </div>
          {allergies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allergies.map(a => (
                <span
                  key={a}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-500 text-white px-3 py-1.5 text-sm"
                >
                  {a}
                  <button
                    type="button"
                    onClick={() => setAllergies(prev => prev.filter(x => x !== a))}
                    className="hover:text-blue-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-zinc-600">なければそのまま次へ進んでください</p>
        </div>
      )}

      {/* ステップ5: 年齢層・喘息・妊娠 */}
      {step === 5 && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-white">
              お客様について教えてください
            </h2>
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-400">年齢層</p>
              <div className="flex gap-3">
                {AGE_OPTIONS.map(age => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => setAgeGroup(age)}
                    className={`flex-1 rounded-lg py-3 text-sm font-medium border transition-colors ${
                      ageGroup === age
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white/5 text-zinc-400 border-white/10 hover:border-blue-500/50 hover:text-zinc-200'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <label className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
              hasAsthma ? 'border-blue-500/50 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}>
              <input
                type="checkbox"
                checked={hasAsthma}
                onChange={e => setHasAsthma(e.target.checked)}
                className="h-5 w-5 accent-blue-500"
              />
              <span className="text-sm text-zinc-300">喘息がある</span>
            </label>
            <label className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
              isPregnant ? 'border-blue-500/50 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}>
              <input
                type="checkbox"
                checked={isPregnant}
                onChange={e => setIsPregnant(e.target.checked)}
                className="h-5 w-5 accent-blue-500"
              />
              <span className="text-sm text-zinc-300">妊娠の可能性がある</span>
            </label>
          </div>
        </div>
      )}

      {/* ステップ6: 確認 */}
      {step === 6 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">入力内容の確認</h2>
          <div className="rounded-2xl bg-white/5 border border-white/10 divide-y divide-white/10">
            <ConfirmRow label="症状" value={symptoms.join('、')} />
            <ConfirmRow label="発症時期" value={since || '未入力'} />
            <ConfirmRow label="服用中の薬" value={currentMedicines.length > 0 ? currentMedicines.join('、') : 'なし'} />
            <ConfirmRow label="アレルギー" value={allergies.length > 0 ? allergies.join('、') : 'なし'} />
            <ConfirmRow label="年齢層" value={ageGroup} />
            <ConfirmRow label="喘息" value={hasAsthma ? 'あり' : 'なし'} />
            <ConfirmRow label="妊娠の可能性" value={isPregnant ? 'あり' : 'なし'} />
          </div>
        </div>
      )}

      {/* ナビゲーションボタン */}
      <div className="flex gap-3 pt-2">
        {step > 1 && (
          <button
            type="button"
            onClick={back}
            className="flex-1 rounded-xl bg-white/5 border border-white/10 py-3 text-sm font-semibold text-zinc-400 hover:bg-white/10 hover:text-zinc-200 transition-colors"
          >
            戻る
          </button>
        )}
        {step < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={next}
            disabled={!canGoNext()}
            className="flex-1 rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white hover:bg-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            次へ
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '提案を生成中...' : 'この内容で提案してもらう'}
          </button>
        )}
      </div>
    </div>
  )
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between px-4 py-3">
      <span className="text-sm text-zinc-500">{label}</span>
      <span className="text-sm font-medium text-zinc-200">{value}</span>
    </div>
  )
}
