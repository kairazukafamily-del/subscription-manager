'use client';

import { useState } from 'react';
import type { Category, Subscription } from '@/types';

interface Props {
  categories: Category[];
  subscriptions: Subscription[];
  onSave: (cats: Category[]) => void;
  onClose: () => void;
}

export function CategoryModal({ categories, subscriptions, onSave, onClose }: Props) {
  const [cats, setCats] = useState<Category[]>(categories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [newName, setNewName] = useState('');

  function usageCount(catId: string) {
    return subscriptions.filter((s) => s.category === catId).length;
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditingName(cat.name);
  }

  function commitEdit() {
    if (!editingId) return;
    const name = editingName.trim();
    if (!name) { setEditingId(null); return; }
    setCats((prev) => prev.map((c) => (c.id === editingId ? { ...c, name } : c)));
    setEditingId(null);
  }

  function handleDelete(id: string) {
    if (usageCount(id) > 0) return;
    setCats((prev) => prev.filter((c) => c.id !== id));
  }

  function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    setCats((prev) => [...prev, { id: crypto.randomUUID(), name }]);
    setNewName('');
  }

  function handleSave() {
    onSave(cats);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(58,55,52,0.3)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#f7f5f2] w-full max-w-sm mx-4 p-8 rounded-sm">
        <p className="text-xs tracking-widest text-[#aaa49e] mb-6">カテゴリ管理</p>

        <div className="flex flex-col divide-y divide-[#e8e5e1]">
          {cats.map((cat) => {
            const inUse = usageCount(cat.id) > 0;
            return (
              <div key={cat.id} className="flex items-center justify-between py-3">
                {editingId === cat.id ? (
                  <input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingId(null); }}
                    className="flex-1 bg-transparent border-b border-[#7a7572] text-sm text-[#3a3734] font-light outline-none mr-4"
                  />
                ) : (
                  <button
                    onClick={() => startEdit(cat)}
                    className="flex-1 text-left text-sm text-[#3a3734] font-light hover:text-[#7a7572] transition-colors"
                  >
                    {cat.name}
                  </button>
                )}
                <div className="flex items-center gap-3 ml-2">
                  {inUse && (
                    <span className="text-[10px] text-[#aaa49e] tracking-wide">{usageCount(cat.id)}件</span>
                  )}
                  <button
                    onClick={() => handleDelete(cat.id)}
                    disabled={inUse}
                    className={`text-xs transition-colors ${inUse ? 'text-[#e8e5e1] cursor-default' : 'text-[#aaa49e] hover:text-[#7a7572]'}`}
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#e8e5e1]">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            placeholder="新しいカテゴリ名"
            className="flex-1 bg-transparent border-b border-[#e8e5e1] py-1 text-sm text-[#3a3734] font-light outline-none focus:border-[#7a7572] transition-colors placeholder:text-[#c0bbb6]"
          />
          <button
            onClick={handleAdd}
            className="text-xs text-[#6a6560] hover:text-[#3a3734] transition-colors font-light tracking-wide"
          >
            追加
          </button>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={onClose}
            className="text-sm text-[#aaa49e] hover:text-[#7a7572] transition-colors font-light tracking-wide"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="text-sm text-[#3a3734] hover:text-[#6a6560] transition-colors font-light tracking-wide"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
