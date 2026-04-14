import type { AgeGroup } from '@/lib/types';

const AGE_OPTIONS: AgeGroup[] = ['小児', '成人', '高齢者'];

type Props = {
  ageGroup: AgeGroup;
  hasAsthma: boolean;
  isPregnant: boolean;
  onAgeChange: (age: AgeGroup) => void;
  onAsthmaChange: (value: boolean) => void;
  onPregnantChange: (value: boolean) => void;
};

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
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          お客様について教えてください
        </h2>
        <div className="space-y-2.5">
          <p className="text-sm font-medium text-zinc-400">年齢層</p>
          <div className="flex gap-3">
            {AGE_OPTIONS.map((age) => (
              <button
                key={age}
                type="button"
                onClick={() => onAgeChange(age)}
                className={`flex-1 rounded-xl py-3.5 text-sm font-medium border transition-all duration-200 ${
                  ageGroup === age
                    ? 'bg-linear-to-r from-blue-500/15 to-indigo-500/10 text-white border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.1)]'
                    : 'bg-white/3 text-zinc-400 border-white/6 hover:border-indigo-500/30 hover:text-zinc-200'
                }`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <label
          className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
            hasAsthma
              ? 'border-indigo-500/30 bg-linear-to-r from-blue-500/10 to-indigo-500/5 shadow-[0_0_12px_rgba(99,102,241,0.08)]'
              : 'border-white/6 bg-white/3 hover:border-white/10 hover:bg-white/5'
          }`}
        >
          <input
            type="checkbox"
            checked={hasAsthma}
            onChange={(e) => onAsthmaChange(e.target.checked)}
            className="h-5 w-5 accent-blue-500"
          />
          <span className="text-sm text-zinc-300">喘息がある</span>
        </label>
        <label
          className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
            isPregnant
              ? 'border-indigo-500/30 bg-linear-to-r from-blue-500/10 to-indigo-500/5 shadow-[0_0_12px_rgba(99,102,241,0.08)]'
              : 'border-white/6 bg-white/3 hover:border-white/10 hover:bg-white/5'
          }`}
        >
          <input
            type="checkbox"
            checked={isPregnant}
            onChange={(e) => onPregnantChange(e.target.checked)}
            className="h-5 w-5 accent-blue-500"
          />
          <span className="text-sm text-zinc-300">妊娠の可能性がある</span>
        </label>
      </div>
    </div>
  );
}
