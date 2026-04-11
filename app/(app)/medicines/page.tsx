'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { Medicine, MedicineCategory } from '@/lib/types'

const CATEGORIES: (MedicineCategory | 'すべて')[] = ['すべて', '鎮痛・解熱', '風邪薬', '胃腸薬', '鼻炎薬', 'その他']

export default function MedicinesPage() {
  const supabase = createClient()
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<MedicineCategory | 'すべて'>('すべて')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMedicines() {
      const { data } = await supabase.from('medicines').select('*').order('name')
      setMedicines(data || [])
      setLoading(false)
    }
    fetchMedicines()
  }, [])

  const filtered = medicines.filter(m => {
    if (category !== 'すべて' && m.category !== category) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        m.name.toLowerCase().includes(q) ||
        m.name_kana?.toLowerCase().includes(q) ||
        m.manufacturer?.toLowerCase().includes(q)
      )
    }
    return true
  })

  if (loading) {
    return <p className="text-sm text-zinc-500">読み込み中...</p>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white">医薬品一覧</h2>

      {/* 検索 */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="薬品名・メーカーで検索"
        className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50"
      />

      {/* カテゴリフィルター */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm border transition-colors ${
              category === cat
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white/5 text-zinc-400 border-white/10 hover:border-blue-500/50 hover:text-zinc-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 件数 */}
      <p className="text-xs text-zinc-600">{filtered.length}件</p>

      {/* 一覧 */}
      <div className="space-y-2">
        {filtered.map(med => (
          <div
            key={med.id}
            className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"
          >
            <button
              onClick={() => setExpandedId(expandedId === med.id ? null : med.id)}
              className="w-full px-4 py-3 flex items-center justify-between text-left"
            >
              <div>
                <p className="text-sm font-medium text-white">{med.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {med.category && <span className="mr-3">{med.category}</span>}
                  {med.manufacturer}
                </p>
              </div>
              <span className="text-zinc-600 text-xs">
                {expandedId === med.id ? '▲' : '▼'}
              </span>
            </button>
            {expandedId === med.id && med.document_text && (
              <div className="px-4 pb-4 border-t border-white/10 pt-3">
                <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {med.document_text}
                </p>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-zinc-500 text-center py-8">該当する医薬品が見つかりません</p>
        )}
      </div>
    </div>
  )
}
