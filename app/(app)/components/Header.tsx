'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { useSidebar } from './SidebarContext';

export default function Header() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const { open, toggle } = useSidebar();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <header className="sticky top-0 z-50 header-bar">
      <div
        className={`px-6 py-3.5 flex items-center justify-between transition-[margin] duration-300 ease-in-out ${open ? 'ml-60' : 'ml-0'}`}
      >
        {/* Toggle button */}
        <button
          onClick={toggle}
          className="rounded-lg p-2 text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-all duration-200"
          aria-label={open ? 'サイドバーを閉じる' : 'サイドバーを開く'}
        >
          {open ? (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            </svg>
          )}
        </button>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user && (
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-all duration-200 truncate max-w-[200px]"
            >
              <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-medium text-blue-400">
                  {(user.user_metadata?.display_name ||
                    user.email ||
                    '?')[0].toUpperCase()}
                </span>
              </div>
              <span className="truncate">
                {user.user_metadata?.display_name
                  ? `${user.user_metadata.display_name}さん`
                  : user.email}
              </span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="rounded-lg border border-white/6 bg-white/3 px-3.5 py-1.5 text-sm text-zinc-500 hover:bg-white/6 hover:text-zinc-300 hover:border-white/10 transition-all duration-200"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
}
