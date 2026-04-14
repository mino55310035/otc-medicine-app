'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import type { Medicine, MedicineCategory } from '@/lib/types';

const CATEGORIES: (MedicineCategory | 'すべて')[] = [
  'すべて',
  '鎮痛・解熱',
  '風邪薬',
  '胃腸薬',
  '鼻炎薬',
  'その他',
];

export default function MedicinesPage() {
  const supabase = createClient();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<MedicineCategory | 'すべて'>(
    'すべて',
  );
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMedicines() {
      const { data } = await supabase
        .from('medicines')
        .select('*')
        .order('name');
      setMedicines(data || []);
      setLoading(false);
    }
    fetchMedicines();
  }, []);

  const filtered = medicines.filter((m) => {
    if (category !== 'すべて' && m.category !== category) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.name_kana?.toLowerCase().includes(q) ||
        m.manufacturer?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-2 text-zinc-500">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm">読み込み中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white">医薬品一覧</h2>

      {/* 検索 */}
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="薬品名・メーカーで検索"
          className="w-full rounded-xl bg-white/3 border border-white/6 pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none input-glow"
        />
      </div>

      {/* カテゴリフィルター */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm border transition-all duration-200 ${
              category === cat
                ? 'pill-selected text-white border-transparent'
                : 'bg-white/3 text-zinc-400 border-white/6 hover:border-indigo-500/40 hover:text-zinc-200'
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
        {filtered.map((med) => (
          <div
            key={med.id}
            className="rounded-xl card-gradient overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() =>
                setExpandedId(expandedId === med.id ? null : med.id)
              }
              className="w-full px-5 py-3.5 flex items-center justify-between text-left"
            >
              <div>
                <p className="text-sm font-medium text-white">{med.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {med.category && <span className="mr-3">{med.category}</span>}
                  {med.manufacturer}
                </p>
              </div>
              <span
                className={`text-zinc-600 text-xs transition-transform duration-200 ${expandedId === med.id ? 'rotate-180' : ''}`}
              >
                ▼
              </span>
            </button>
            {expandedId === med.id && med.document_text && (
              <div className="px-5 pb-4 border-t border-white/6 pt-3">
                <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {med.document_text}
                </p>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-zinc-500 text-center py-8">
            該当する医薬品が見つかりません
          </p>
        )}
      </div>
    </div>
  );
}
