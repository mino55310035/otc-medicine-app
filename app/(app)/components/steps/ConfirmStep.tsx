type Props = {
  symptoms: string[]
  since: string
  currentMedicines: string[]
  allergies: string[]
  ageGroup: string
  hasAsthma: boolean
  isPregnant: boolean
}

export default function ConfirmStep({
  symptoms,
  since,
  currentMedicines,
  allergies,
  ageGroup,
  hasAsthma,
  isPregnant,
}: Props) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-white">入力内容の確認</h2>
      <div className="rounded-2xl card-gradient divide-y divide-white/6 overflow-hidden">
        <Row label="症状" value={symptoms.join('、')} />
        <Row label="発症時期" value={since || '未入力'} />
        <Row label="服用中の薬" value={currentMedicines.length > 0 ? currentMedicines.join('、') : 'なし'} />
        <Row label="アレルギー" value={allergies.length > 0 ? allergies.join('、') : 'なし'} />
        <Row label="年齢層" value={ageGroup} />
        <Row label="喘息" value={hasAsthma ? 'あり' : 'なし'} />
        <Row label="妊娠の可能性" value={isPregnant ? 'あり' : 'なし'} />
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between px-5 py-3.5">
      <span className="text-sm text-zinc-500">{label}</span>
      <span className="text-sm font-medium text-zinc-200">{value}</span>
    </div>
  )
}
