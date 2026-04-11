type Props = {
  medicines: string[]
  input: string
  onInputChange: (value: string) => void
  onAdd: () => void
  onRemove: (medicine: string) => void
}

export default function MedicineStep({
  medicines,
  input,
  onInputChange,
  onAdd,
  onRemove,
}: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">
        現在、服用中のお薬はありますか？
      </h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onAdd()
            }
          }}
          placeholder="薬の名前を入力"
          className="flex-1 rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50"
          autoFocus
        />
        <button
          type="button"
          onClick={onAdd}
          className="rounded-lg bg-white/5 px-4 py-3 text-sm text-zinc-400 border border-white/10 hover:bg-white/10 hover:text-zinc-200 transition-colors"
        >
          追加
        </button>
      </div>
      {medicines.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {medicines.map(med => (
            <span
              key={med}
              className="inline-flex items-center gap-1 rounded-full bg-blue-500 text-white px-3 py-1.5 text-sm"
            >
              {med}
              <button
                type="button"
                onClick={() => onRemove(med)}
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
  )
}
