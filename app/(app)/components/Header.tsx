'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="mx-auto max-w-2xl px-4 py-4 flex items-center justify-between">
        <div />
        <div className="flex items-center gap-4">
          {user && (
            <Link
              href="/profile"
              className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors truncate max-w-[200px]"
            >
              {user.user_metadata?.display_name
                ? `${user.user_metadata.display_name}さん`
                : user.email}
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm text-zinc-400 hover:bg-white/10 hover:text-zinc-200 transition-colors"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  )
}
