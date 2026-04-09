import HearingForm from './components/HearingForm'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-2xl px-4 py-5">
          <h1 className="text-xl font-bold text-white tracking-tight">
            OTC医薬品 提案ツール
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            ヒアリング情報を入力すると、適切な医薬品を提案します
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <HearingForm />
      </main>
    </div>
  )
}
