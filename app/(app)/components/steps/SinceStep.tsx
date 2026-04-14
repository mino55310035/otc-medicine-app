const SINCE_OPTIONS = [
  '今日',
  '昨日から',
  '2〜3日前から',
  '1週間くらい前から',
  'それ以上前から',
];

type Props = {
  since: string;
  onSelect: (value: string) => void;
};

export default function SinceStep({ since, onSelect }: Props) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-white">
        いつ頃から症状がありますか？
      </h2>
      <div className="flex flex-col gap-2">
        {SINCE_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`rounded-xl px-4 py-3.5 text-sm text-left border transition-all duration-200 ${
              since === option
                ? 'bg-linear-to-r from-blue-500/15 to-indigo-500/10 text-white border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.1)]'
                : 'bg-white/3 text-zinc-400 border-white/6 hover:border-indigo-500/30 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
