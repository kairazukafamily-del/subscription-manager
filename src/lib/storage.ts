import type { Category, ExchangeRateCache, Subscription } from '@/types';

export interface ExportData {
  version: 1;
  exportedAt: string;
  subscriptions: Subscription[];
  categories: Category[];
}

const KEYS = {
  subscriptions: 'subsc_v1_subscriptions',
  categories: 'subsc_v1_categories',
  exchangeRate: 'subsc_v1_exchange_rate',
  notifyChecked: 'subsc_v1_notify_checked',
} as const;

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'entertainment', name: 'エンタメ' },
  { id: 'music', name: '音楽' },
  { id: 'software', name: 'ソフトウェア' },
  { id: 'cloud', name: 'クラウド' },
  { id: 'news', name: 'ニュース' },
  { id: 'other', name: 'その他' },
];

export function getSubscriptions(): Subscription[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.subscriptions) ?? '[]');
  } catch {
    return [];
  }
}

export function saveSubscriptions(subs: Subscription[]): void {
  localStorage.setItem(KEYS.subscriptions, JSON.stringify(subs));
}

export function getCategories(): Category[] {
  try {
    const raw = localStorage.getItem(KEYS.categories);
    if (!raw) return DEFAULT_CATEGORIES;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(cats: Category[]): void {
  localStorage.setItem(KEYS.categories, JSON.stringify(cats));
}

export function getCachedRate(): ExchangeRateCache | null {
  try {
    const raw = localStorage.getItem(KEYS.exchangeRate);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCachedRate(cache: ExchangeRateCache): void {
  localStorage.setItem(KEYS.exchangeRate, JSON.stringify(cache));
}

export function getLastNotifyDate(): string | null {
  return localStorage.getItem(KEYS.notifyChecked);
}

export function saveLastNotifyDate(date: string): void {
  localStorage.setItem(KEYS.notifyChecked, date);
}

export function exportData(): void {
  const data: ExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    subscriptions: getSubscriptions(),
    categories: getCategories(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `subscriptions-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseImport(json: string): ExportData | null {
  try {
    const data = JSON.parse(json);
    if (data.version !== 1) return null;
    if (!Array.isArray(data.subscriptions)) return null;
    if (!Array.isArray(data.categories)) return null;
    return data as ExportData;
  } catch {
    return null;
  }
}
