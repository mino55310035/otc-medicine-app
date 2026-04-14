import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      {/* Icon */}
      <div className="animate-float">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-2xl" />
          <div className="relative w-20 h-20 rounded-2xl bg-linear-to-br from-blue-500/10 to-indigo-500/10 border border-white/10 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
          OTC医薬品 提案ツール
        </h2>
        <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
          お客様のヒアリング情報をもとに、
          <br />
          適切なOTC医薬品をAIが提案します
        </p>
      </div>

      {/* CTA */}
      <Link
        href="/hearing"
        className="btn-glow rounded-xl px-10 py-3.5 text-sm font-semibold text-white"
      >
        新しい相談をはじめる
      </Link>

      {/* Subtle decorative elements */}
      <div className="flex items-center gap-6 pt-4">
        <div className="flex items-center gap-2 text-zinc-700">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
            />
          </svg>
          <span className="text-xs">安全性重視</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-700">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
            />
          </svg>
          <span className="text-xs">AI分析</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-700">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <span className="text-xs">即時提案</span>
        </div>
      </div>
    </div>
  );
}
