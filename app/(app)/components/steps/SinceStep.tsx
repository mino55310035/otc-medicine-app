const SINCE_OPTIONS = ['今日', '昨日から', '2〜3日前から', '1週間くらい前から', 'それ以上前から']

type Props = {
  since: string
  onSelect: (value: string) => void
}

export default function SinceStep({ since, onSelect }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">
        いつ頃から症状がありますか？
      </h2>
      <div className="flex flex-col gap-2">
        {SINCE_OPTIONS.map(option => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
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
  )
}
