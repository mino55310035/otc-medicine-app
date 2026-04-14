'use client';

import { useActionState } from 'react';
import { login, signInWithGoogle } from './actions';
import Link from 'next/link';

export default function LoginPage() {
  const [loginState, loginAction, loginPending] = useActionState(login, null);

  return (
    <div className="min-h-screen auth-gradient-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Branding */}
        <div className="text-center space-y-4">
          <div className="inline-flex">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              OTC医薬品 提案ツール
            </h1>
            <p className="text-sm text-zinc-500 mt-2">
              ログインして利用を開始する
            </p>
          </div>
        </div>

        {/* Google ログイン */}
        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-white py-3 text-sm font-semibold text-gray-900 hover:bg-zinc-100 transition-all duration-200 shadow-lg shadow-white/5"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Googleでログイン
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-xs text-zinc-600">または</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* メール + パスワード ログイン */}
        <form action={loginAction} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-400 mb-1.5"
            >
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl bg-white/3 border border-white/6 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none input-glow"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-400 mb-1.5"
            >
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full rounded-xl bg-white/3 border border-white/6 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none input-glow"
              placeholder="••••••••"
            />
          </div>

          {loginState?.error && (
            <p className="text-sm text-red-400">{loginState.error}</p>
          )}

          <button
            type="submit"
            disabled={loginPending}
            className="w-full rounded-xl btn-glow py-3 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginPending ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500">
          アカウントをお持ちでない方は
          <Link
            href="/signup"
            className="text-blue-400 hover:text-blue-300 ml-1 transition-colors"
          >
            新規登録
          </Link>
        </p>
      </div>
    </div>
  );
}
