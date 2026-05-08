import type { Currency, RateInfo } from '@/types';
import { getCachedRate, saveCachedRate } from './storage';

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export async function getUsdJpyRate(forceRefresh = false): Promise<RateInfo> {
  const cached = getCachedRate();

  if (!forceRefresh && cached) {
    const age = Date.now() - new Date(cached.cachedAt).getTime();
    if (age < CACHE_TTL_MS) {
      return { rate: cached.rate, cachedAt: cached.cachedAt, error: null };
    }
  }

  try {
    const res = await fetch('/api/rate', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (data.error) throw new Error(data.error);

    const rate: number = data.rate;
    const cachedAt = new Date().toISOString();

    saveCachedRate({ rate, cachedAt });
    return { rate, cachedAt, error: null };
  } catch {
    if (cached) {
      return { rate: cached.rate, cachedAt: cached.cachedAt, error: '取得失敗（キャッシュ値を使用中）' };
    }
    return { rate: 0, cachedAt: null, error: '為替レートを取得できません' };
  }
}

export function toJpy(amount: number, currency: Currency, rate: number): number {
  if (currency === 'JPY') return amount;
  return Math.floor(amount * rate);
}

export function formatCachedAt(isoString: string | null): string {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'たった今';
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  return `${Math.floor(hours / 24)}日前`;
}
