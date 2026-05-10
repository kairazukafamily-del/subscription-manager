export type Currency = 'JPY' | 'USD';
export type ServiceStatus = 'active' | 'paused';
export type SortKey = 'name' | 'amount' | 'billingDay';
export type SortOrder = 'asc' | 'desc';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  billingDay: number;
  category: string;
  status: ServiceStatus;
  notifyDaysBefore: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface ExchangeRateCache {
  rate: number;
  cachedAt: string;
}

export interface RateInfo {
  rate: number;
  cachedAt: string | null;
  error: string | null;
}
