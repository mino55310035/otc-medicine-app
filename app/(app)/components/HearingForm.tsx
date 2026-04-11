'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import type { AgeGroup, HearingInput } from '@/lib/types'
import SymptomStep from './steps/SymptomStep'
import SinceStep from './steps/SinceStep'
import MedicineStep from './steps/MedicineStep'
import AllergyStep from './steps/AllergyStep'
import ProfileStep from './steps/ProfileStep'
import ConfirmStep from './steps/ConfirmStep'

const TOTAL_STEPS = 6

export default function HearingForm() {
  const router = useRouter()
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

  function addMedicine() {
    const trimmed = medicineInput.trim()
    if (trimmed && !currentMedicines.includes(trimmed)) {
      setCurrentMedicines(prev => [...prev, trimmed])
      setMedicineInput('')
    }
  }

  function addAllergy() {
    const trimmed = allergyInput.trim()
    if (trimmed && !allergies.includes(trimmed)) {
      setAllergies(prev => [...prev, trimmed])
      setAllergyInput('')
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

  if (result) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-6">
          <h2 className="text-lg font-semibold text-emerald-400 mb-4">提案結果</h2>
          <div className="prose prose-invert prose-sm max-w-none
            prose-headings:text-emerald-300 prose-h2:text-base prose-h2:mt-6 prose-h2:mb-3 prose-h2:border-b prose-h2:border-emerald-500/20 prose-h2:pb-2
            prose-h3:text-sm prose-h3:mt-4 prose-h3:mb-2 prose-h3:text-zinc-200
            prose-p:text-zinc-300 prose-p:leading-relaxed
            prose-strong:text-emerald-300 prose-strong:font-semibold
            prose-li:text-zinc-300 prose-li:leading-relaxed prose-ul:my-2 prose-li:my-0.5
            prose-li:marker:text-emerald-500/60
            prose-hr:border-emerald-500/20
          ">
            <ReactMarkdown>{result}</ReactMarkdown>
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-8">
        {/* パルスアニメーション付きアイコン */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
          <div className="relative w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
        </div>

        {/* テキスト */}
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-zinc-200">AIが最適な薬を分析中です</p>
          <p className="text-xs text-zinc-500">症状や体質に合わせて提案を作成しています</p>
        </div>

        {/* ドットアニメーション */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    )
  }

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

      {step === 1 && (
        <SymptomStep
          symptoms={symptoms}
          customSymptom={customSymptom}
          onToggle={toggleSymptom}
          onCustomChange={setCustomSymptom}
          onAddCustom={addCustomSymptom}
        />
      )}
      {step === 2 && <SinceStep since={since} onSelect={setSince} />}
      {step === 3 && (
        <MedicineStep
          medicines={currentMedicines}
          input={medicineInput}
          onInputChange={setMedicineInput}
          onAdd={addMedicine}
          onRemove={med => setCurrentMedicines(prev => prev.filter(m => m !== med))}
        />
      )}
      {step === 4 && (
        <AllergyStep
          allergies={allergies}
          input={allergyInput}
          onInputChange={setAllergyInput}
          onAdd={addAllergy}
          onRemove={a => setAllergies(prev => prev.filter(x => x !== a))}
        />
      )}
      {step === 5 && (
        <ProfileStep
          ageGroup={ageGroup}
          hasAsthma={hasAsthma}
          isPregnant={isPregnant}
          onAgeChange={setAgeGroup}
          onAsthmaChange={setHasAsthma}
          onPregnantChange={setIsPregnant}
        />
      )}
      {step === 6 && (
        <ConfirmStep
          symptoms={symptoms}
          since={since}
          currentMedicines={currentMedicines}
          allergies={allergies}
          ageGroup={ageGroup}
          hasAsthma={hasAsthma}
          isPregnant={isPregnant}
        />
      )}

      {/* ナビゲーションボタン */}
      <div className="flex gap-3 pt-2">
        {step === 1 ? (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('入力内容が破棄されます。相談を中止しますか？')) {
                router.push('/')
              }
            }}
            className="flex-1 rounded-xl bg-white/5 border border-white/10 py-3 text-sm font-semibold text-zinc-400 hover:bg-white/10 hover:text-zinc-200 transition-colors"
          >
            中止
          </button>
        ) : (
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
