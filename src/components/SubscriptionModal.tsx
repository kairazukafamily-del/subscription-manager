'use client';

import { useEffect, useRef, useState } from 'react';
import type { Category, Currency, ServiceStatus, Subscription } from '@/types';

interface Props {
  editing: Subscription | null;
  categories: Category[];
  onSave: (sub: Subscription) => void;
  onAddCategory: (cat: Category) => void;
  onClose: () => void;
}

interface FormState {
  name: string;
  amount: string;
  currency: Currency;
  billingDay: string;
  category: string;
  status: ServiceStatus;
  notifyDaysBefore: string;
}

const NOTIFY_OPTIONS = [
  { value: '0', label: '通知なし' },
  { value: '1', label: '1日前' },
  { value: '3', label: '3日前' },
  { value: '5', label: '5日前' },
  { value: '7', label: '7日前' },
  { value: '14', label: '14日前' },
  { value: '30', label: '30日前' },
];

const NEW_CATEGORY_VALUE = '__new__';

function emptyForm(categories: Category[]): FormState {
  return {
    name: '', amount: '', currency: 'JPY', billingDay: '',
    category: categories[0]?.id ?? '', status: 'active', notifyDaysBefore: '0',
  };
}

export function SubscriptionModal({ editing, categories, onSave, onAddCategory, onClose }: Props) {
  const [form, setForm] = useState<FormState>(() =>
    editing
      ? {
          name: editing.name, amount: String(editing.amount), currency: editing.currency,
          billingDay: String(editing.billingDay), category: editing.category,
          status: editing.status, notifyDaysBefore: String(editing.notifyDaysBefore),
        }
      : emptyForm(categories)
  );
  const [newCatName, setNewCatName] = useState('');
  const [showNewCat, setShowNewCat] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = '必須';
    const amt = Number(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) e.amount = '0より大きい数値を入力';
    const day = Number(form.billingDay);
    if (!form.billingDay || isNaN(day) || day < 1 || day > 31 || !Number.isInteger(day)) e.billingDay = '1〜31の整数';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSave({
      id: editing?.id ?? crypto.randomUUID(),
      name: form.name.trim(), amount: Number(form.amount), currency: form.currency,
      billingDay: Number(form.billingDay), category: form.category,
      status: form.status, notifyDaysBefore: Number(form.notifyDaysBefore),
      createdAt: editing?.createdAt ?? new Date().toISOString(),
    });
  }

  function handleCategoryChange(value: string) {
    if (value === NEW_CATEGORY_VALUE) { setShowNewCat(true); return; }
    setForm((f) => ({ ...f, category: value }));
    setShowNewCat(false);
  }

  function handleAddCategory() {
    const name = newCatName.trim();
    if (!name) return;
    const id = crypto.randomUUID();
    onAddCategory({ id, name });
    setForm((f) => ({ ...f, category: id }));
    setNewCatName('');
    setShowNewCat(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(58,55,52,0.3)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#f7f5f2] w-full max-w-sm mx-4 p-8 rounded-sm">
        <p className="text-xs tracking-widest text-[#aaa49e] mb-6">
          {editing ? 'サービスを編集' : 'サービスを追加'}
        </p>

        <div className="flex flex-col gap-5">
          <Field label="サービス名" error={errors.name}>
            <input ref={nameRef} type="text" value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full bg-transparent border-b border-[#e8e5e1] py-1 text-sm text-[#3a3734] font-light outline-none focus:border-[#7a7572] transition-colors" />
          </Field>

          <div className="flex gap-4">
            <Field label="金額" error={errors.amount} className="flex-1">
              <input type="number" min="0" step="any" value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className="w-full bg-transparent border-b border-[#e8e5e1] py-1 text-sm text-[#3a3734] font-light outline-none focus:border-[#7a7572] transition-colors" />
            </Field>
            <Field label="通貨">
              <div className="flex gap-3 py-1">
                {(['JPY', 'USD'] as Currency[]).map((c) => (
                  <button key={c} type="button" onClick={() => setForm((f) => ({ ...f, currency: c }))}
                    className={`text-sm font-light tracking-wide transition-colors ${form.currency === c ? 'text-[#3a3734] border-b border-[#3a3734]' : 'text-[#aaa49e]'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <Field label="請求日（毎月）" error={errors.billingDay}>
            <div className="flex items-center gap-1">
              <input type="number" min="1" max="31" value={form.billingDay}
                onChange={(e) => setForm((f) => ({ ...f, billingDay: e.target.value }))}
                className="w-16 bg-transparent border-b border-[#e8e5e1] py-1 text-sm text-[#3a3734] font-light outline-none focus:border-[#7a7572] transition-colors text-center" />
              <span className="text-sm text-[#aaa49e]">日</span>
            </div>
          </Field>

          <Field label="分類">
            <select value={showNewCat ? NEW_CATEGORY_VALUE : form.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full bg-transparent border-b border-[#e8e5e1] py-1 text-sm text-[#3a3734] font-light outline-none focus:border-[#7a7572] transition-colors">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              <option value={NEW_CATEGORY_VALUE}>＋ 新しく追加</option>
            </select>
            {showNewCat && (
              <div className="flex gap-2 mt-2">
                <input type="text" value={newCatName} onChange={(e) => setNewCatName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddCategory(); }}
                  placeholder="名前を入力"
                  className="flex-1 bg-transparent border-b border-[#e8e5e1] py-1 text-sm text-[#3a3734] font-light outline-none focus:border-[#7a7572] transition-colors"
                  autoFocus />
                <button type="button" onClick={handleAddCategory}
                  className="text-xs text-[#6a6560] hover:text-[#3a3734] transition-colors">追加</button>
              </div>
            )}
          </Field>

          <Field label="状態">
            <div className="flex gap-4 py-1">
              {([['active', 'アクティブ'], ['paused', '停止中']] as [ServiceStatus, string][]).map(([val, label]) => (
                <button key={val} type="button" onClick={() => setForm((f) => ({ ...f, status: val }))}
                  className={`text-sm font-light tracking-wide transition-colors ${form.status === val ? 'text-[#3a3734] border-b border-[#3a3734]' : 'text-[#aaa49e]'}`}>
                  {label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="通知">
            <select value={form.notifyDaysBefore}
              onChange={(e) => setForm((f) => ({ ...f, notifyDaysBefore: e.target.value }))}
              className="w-full bg-transparent border-b border-[#e8e5e1] py-1 text-sm text-[#3a3734] font-light outline-none focus:border-[#7a7572] transition-colors">
              {NOTIFY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
        </div>

        <div className="flex justify-between mt-8">
          <button type="button" onClick={onClose}
            className="text-sm text-[#aaa49e] hover:text-[#7a7572] transition-colors font-light tracking-wide">
            キャンセル
          </button>
          <button type="button" onClick={handleSubmit}
            className="text-sm text-[#3a3734] hover:text-[#6a6560] transition-colors font-light tracking-wide">
            {editing ? '保存' : '追加'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, className = '', children }: {
  label: string; error?: string; className?: string; children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <p className="text-xs tracking-widest text-[#aaa49e] mb-1">{label}</p>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
