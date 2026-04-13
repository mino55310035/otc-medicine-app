'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export default function ProfilePage() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user)
        setDisplayName(data.user.user_metadata?.display_name || '')
      }
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName.trim() },
    })

    if (error) {
      setMessage({ type: 'error', text: '保存に失敗しました。もう一度お試しください。' })
    } else {
      setMessage({ type: 'success', text: 'プロフィールを更新しました。' })
    }
    setSaving(false)
  }

  if (!user) return null

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold text-white">プロフィール設定</h2>

      <form onSubmit={handleSave} className="space-y-6">
        {/* メールアドレス（変更不可） */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">
            メールアドレス
          </label>
          <p className="rounded-xl bg-white/3 border border-white/6 px-4 py-3 text-sm text-zinc-500">
            {user.email}
          </p>
        </div>

        {/* 表示名 */}
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-zinc-400 mb-1.5">
            表示名
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="例：田中太郎"
            className="w-full rounded-xl bg-white/3 border border-white/6 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none input-glow"
          />
        </div>

        {/* 認証方法 */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">
            認証方法
          </label>
          <p className="rounded-xl bg-white/3 border border-white/6 px-4 py-3 text-sm text-zinc-500">
            {user.app_metadata?.provider === 'google' ? 'Google' : 'メール + パスワード'}
          </p>
        </div>

        {/* アカウント作成日 */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">
            アカウント作成日
          </label>
          <p className="rounded-xl bg-white/3 border border-white/6 px-4 py-3 text-sm text-zinc-500">
            {new Date(user.created_at).toLocaleDateString('ja-JP')}
          </p>
        </div>

        {message && (
          <p className={`text-sm ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
            {message.text}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="flex-1 rounded-xl card-gradient py-3.5 text-sm font-semibold text-zinc-400 hover:text-zinc-200 transition-all duration-200"
          >
            戻る
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-xl btn-glow py-3.5 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? '保存中...' : '保存する'}
          </button>
        </div>
      </form>
    </div>
  )
}
