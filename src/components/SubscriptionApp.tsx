'use client';

import { useEffect, useState } from 'react';
import type { Category, RateInfo, ServiceStatus, SortKey, SortOrder, Subscription } from '@/types';
import {
  getCategories,
  getSubscriptions,
  saveCategories,
  saveSubscriptions,
} from '@/lib/storage';
import { getUsdJpyRate, toJpy } from '@/lib/exchange';
import { checkAndNotify, requestPermission } from '@/lib/notifications';
import { Dashboard } from './Dashboard';
import { FilterBar } from './FilterBar';
import { SubscriptionList } from './SubscriptionList';
import { SubscriptionModal } from './SubscriptionModal';
import { CategoryModal } from './CategoryModal';

type StatusFilter = ServiceStatus | 'all';

export function SubscriptionApp() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [rateInfo, setRateInfo] = useState<RateInfo>({ rate: 0, cachedAt: null, error: null });
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [modal, setModal] = useState<{ open: boolean; editing: Subscription | null }>({
    open: false,
    editing: null,
  });
  const [notifyDenied, setNotifyDenied] = useState(false);
  const [rateLoading, setRateLoading] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  useEffect(() => {
    const subs = getSubscriptions();
    const cats = getCategories();
    setSubscriptions(subs);
    setCategories(cats);

    fetchRate();

    requestPermission().then((perm) => {
      if (perm === 'denied') {
        setNotifyDenied(true);
      } else if (perm === 'granted') {
        checkAndNotify(subs);
      }
    });
  }, []);

  async function fetchRate(forceRefresh = false) {
    setRateLoading(true);
    try {
      const info = await getUsdJpyRate(forceRefresh);
      setRateInfo(info);
    } finally {
      setRateLoading(false);
    }
  }

  function persist(subs: Subscription[]) {
    setSubscriptions(subs);
    saveSubscriptions(subs);
  }

  function handleSave(sub: Subscription) {
    const exists = subscriptions.some((s) => s.id === sub.id);
    const updated = exists
      ? subscriptions.map((s) => (s.id === sub.id ? sub : s))
      : [...subscriptions, sub];
    persist(updated);
    setModal({ open: false, editing: null });
  }

  function handleDelete(id: string) {
    persist(subscriptions.filter((s) => s.id !== id));
  }

  function handleAddCategory(cat: Category) {
    const updated = [...categories, cat];
    setCategories(updated);
    saveCategories(updated);
  }

  function handleSaveCategories(cats: Category[]) {
    setCategories(cats);
    saveCategories(cats);
  }

  const filtered = subscriptions.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'name') {
      cmp = a.name.localeCompare(b.name, 'ja');
    } else if (sortKey === 'amount') {
      cmp = toJpy(a.amount, a.currency, rateInfo.rate) - toJpy(b.amount, b.currency, rateInfo.rate);
    } else {
      cmp = a.billingDay - b.billingDay;
    }
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  const totalJpy = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + toJpy(s.amount, s.currency, rateInfo.rate), 0);

  const activeCount = subscriptions.filter((s) => s.status === 'active').length;

  return (
    <div className="min-h-screen bg-[#f7f5f2]">
      {notifyDenied && (
        <div className="text-center py-2 bg-[#eceae6] text-xs text-[#7a7572] tracking-wide">
          通知が拒否されています。ブラウザの設定から許可してください。
        </div>
      )}

      <main className="max-w-lg mx-auto px-6 py-16">
        <div className="flex items-baseline justify-between mb-12">
          <h1 className="text-xs tracking-widest text-[#c0bbb6] font-light">subscriptions</h1>
          <button
            onClick={() => setModal({ open: true, editing: null })}
            className="text-[10px] tracking-wide text-[#c0bbb6] hover:text-[#aaa49e] transition-colors font-light"
          >
            ＋ 追加
          </button>
        </div>

        <Dashboard totalJpy={totalJpy} activeCount={activeCount} rateInfo={rateInfo} rateLoading={rateLoading} onRefreshRate={() => fetchRate(true)} />

        <FilterBar
          statusFilter={statusFilter}
          categoryFilter={categoryFilter}
          categories={categories}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onStatusChange={setStatusFilter}
          onCategoryChange={setCategoryFilter}
          onManageCategories={() => setCategoryModalOpen(true)}
          onSortKeyChange={setSortKey}
          onSortOrderToggle={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
        />

        <SubscriptionList
          subscriptions={sorted}
          categories={categories}
          rateInfo={rateInfo}
          onEdit={(sub) => setModal({ open: true, editing: sub })}
          onDelete={handleDelete}
        />
      </main>

      {modal.open && (
        <SubscriptionModal
          editing={modal.editing}
          categories={categories}
          onSave={handleSave}
          onAddCategory={handleAddCategory}
          onClose={() => setModal({ open: false, editing: null })}
        />
      )}

      {categoryModalOpen && (
        <CategoryModal
          categories={categories}
          subscriptions={subscriptions}
          onSave={handleSaveCategories}
          onClose={() => setCategoryModalOpen(false)}
        />
      )}
    </div>
  );
}
