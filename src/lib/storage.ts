import type { Category, ExchangeRateCache, Subscription } from '@/types';

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
