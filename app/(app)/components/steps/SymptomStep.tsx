const SYMPTOM_OPTIONS = [
  '頭痛', '発熱', '鼻水', '鼻づまり', '咳', 'のどの痛み',
  '胃痛', '胃もたれ', '下痢', '便秘', '吐き気',
  '腰痛', '肩こり', '筋肉痛', '関節痛', '生理痛',
]

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
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">
        どんな症状がありますか？
      </h2>
      <div className="flex flex-wrap gap-2">
        {SYMPTOM_OPTIONS.map(symptom => (
          <button
            key={symptom}
            type="button"
            onClick={() => onToggle(symptom)}
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
          onChange={e => onCustomChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onAddCustom()
            }
          }}
          placeholder="その他の症状を入力"
          className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50"
        />
        <button
          type="button"
          onClick={onAddCustom}
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
              <button type="button" onClick={() => onToggle(s)} className="hover:text-blue-200">
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
