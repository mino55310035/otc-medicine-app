'use client'

import { useState } from 'react'

type SymptomCategory = {
  label: string
  symptoms: string[]
}

const SYMPTOM_CATEGORIES: SymptomCategory[] = [
  {
    label: '痛み',
    symptoms: ['頭痛', '生理痛', '腰痛', '肩こり', '関節痛', '筋肉痛', '歯痛'],
  },
  {
    label: '風邪・発熱',
    symptoms: ['発熱', 'のどの痛み', '咳', '鼻水', '鼻づまり', 'たん', '悪寒'],
  },
  {
    label: '胃腸',
    symptoms: ['胃痛', '胃もたれ', '下痢', '便秘', '吐き気', '食欲不振', '腹部膨満感'],
  },
  {
    label: '目・耳・口',
    symptoms: ['目のかゆみ', '目の疲れ', '口内炎', '耳痛'],
  },
  {
    label: 'アレルギー',
    symptoms: ['くしゃみ', '花粉症', '蕁麻疹', '皮膚のかゆみ'],
  },
  {
    label: 'その他',
    symptoms: ['倦怠感', '不眠', '手足のしびれ'],
  },
]

const ALL_SYMPTOMS = SYMPTOM_CATEGORIES.flatMap(c => c.symptoms)

type Props = {
  symptoms: string[]
  customSymptom: string
  onToggle: (symptom: string) => void
  onCustomChange: (value: string) => void
  onAddCustom: () => void
}

export default function SymptomStep({
  symptoms,
  customSymptom,
  onToggle,
  onCustomChange,
  onAddCustom,
}: Props) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set())

  function toggleCategory(label: string) {
    setOpenCategories(prev => {
      const next = new Set(prev)
      if (next.has(label)) {
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">
        どんな症状がありますか？
      </h2>

      <div className="space-y-2">
        {SYMPTOM_CATEGORIES.map(category => {
          const isOpen = openCategories.has(category.label)
          const selectedCount = category.symptoms.filter(s => symptoms.includes(s)).length

          return (
            <div key={category.label} className="rounded-xl border border-white/6 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleCategory(category.label)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white/3 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-medium text-zinc-200">{category.label}</span>
                  {selectedCount > 0 && (
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                      {selectedCount}
                    </span>
                  )}
                </div>
                <svg
                  className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {isOpen && (
                <div className="px-4 py-3 flex flex-wrap gap-2">
                  {category.symptoms.map(symptom => (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => onToggle(symptom)}
                      className={`rounded-full px-4 py-2 text-sm border transition-all duration-200 ${
                        symptoms.includes(symptom)
                          ? 'pill-selected text-white border-transparent'
                          : 'bg-white/3 text-zinc-400 border-white/6 hover:border-indigo-500/40 hover:text-zinc-200 hover:bg-white/5'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 自由入力 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customSymptom}
          onChange={e => onCustomChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onAddCustom()
            }
          }}
          placeholder="その他の症状を入力"
          className="flex-1 rounded-lg bg-white/3 border border-white/6 px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none input-glow"
        />
        <button
          type="button"
          onClick={onAddCustom}
          className="rounded-lg bg-white/3 px-4 py-2.5 text-sm text-zinc-400 border border-white/6 hover:bg-white/6 hover:text-zinc-200 transition-all duration-200"
        >
          追加
        </button>
      </div>

      {/* 自由入力で追加した症状 */}
      {symptoms.filter(s => !ALL_SYMPTOMS.includes(s)).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {symptoms.filter(s => !ALL_SYMPTOMS.includes(s)).map(s => (
            <span
              key={s}
              className="inline-flex items-center gap-1 rounded-full pill-selected text-white px-3 py-1.5 text-sm"
            >
              {s}
              <button type="button" onClick={() => onToggle(s)} className="hover:text-blue-200 ml-0.5">
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
