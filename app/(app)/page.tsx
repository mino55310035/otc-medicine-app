import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <h2 className="text-2xl font-bold text-white tracking-tight">
        OTC医薬品 提案ツール
      </h2>
      <p className="text-sm text-zinc-500 text-center max-w-sm">
        お客様のヒアリング情報をもとに、適切なOTC医薬品をAIが提案します
      </p>
      <Link
        href="/hearing"
        className="rounded-xl bg-blue-500 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-400 transition-colors"
      >
        新しい相談をはじめる
      </Link>
    </div>
  )
}
