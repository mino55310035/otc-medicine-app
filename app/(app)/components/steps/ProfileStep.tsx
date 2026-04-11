import type { AgeGroup } from '@/lib/types'

const AGE_OPTIONS: AgeGroup[] = ['小児', '成人', '高齢者']

type Props = {
  ageGroup: AgeGroup
  hasAsthma: boolean
  isPregnant: boolean
  onAgeChange: (age: AgeGroup) => void
  onAsthmaChange: (value: boolean) => void
  onPregnantChange: (value: boolean) => void
}

export default function ProfileStep({
  ageGroup,
  hasAsthma,
  isPregnant,
  onAgeChange,
  onAsthmaChange,
  onPregnantChange,
}: Props) {
  return (
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
                onClick={() => onAgeChange(age)}
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
            onChange={e => onAsthmaChange(e.target.checked)}
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
            onChange={e => onPregnantChange(e.target.checked)}
            className="h-5 w-5 accent-blue-500"
          />
          <span className="text-sm text-zinc-300">妊娠の可能性がある</span>
        </label>
      </div>
    </div>
  )
}
