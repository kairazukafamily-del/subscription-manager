import type { Subscription } from '@/types';
import { getLastNotifyDate, saveLastNotifyDate } from './storage';

export async function requestPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission !== 'default') return Notification.permission;
  return await Notification.requestPermission();
}

export function checkAndNotify(subscriptions: Subscription[]): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  if (getLastNotifyDate() === todayStr) return;
  saveLastNotifyDate(todayStr);

  const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

  for (const sub of subscriptions) {
    if (sub.status !== 'active' || sub.notifyDaysBefore === 0) continue;

    const nextBilling = nextBillingDate(today, sub.billingDay);
    const daysUntil = Math.round((nextBilling.getTime() - todayTime) / 86400000);

    if (daysUntil === sub.notifyDaysBefore) {
      new Notification(`${sub.name} の請求まであと${sub.notifyDaysBefore}日`, {
        body: `毎月${sub.billingDay}日に請求されます`,
        tag: `subsc-${sub.id}-${todayStr}`,
      });
    }
  }
}

function nextBillingDate(today: Date, billingDay: number): Date {
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayDay = today.getDate();

  const candidate = clampedDate(year, month, billingDay);
  if (candidate.getDate() >= todayDay) return candidate;
  return clampedDate(year, month + 1, billingDay);
}

function clampedDate(year: number, month: number, day: number): Date {
  const last = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(day, last));
}
