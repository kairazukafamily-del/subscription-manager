import { NextResponse } from 'next/server';

export async function GET() {
  // Primary: frankfurter.app
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=JPY', {
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ rate: data.rates.JPY });
    }
  } catch {}

  // Fallback: CDN-based currency API
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
      { signal: controller.signal }
    );
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ rate: data.usd.jpy });
    }
  } catch {}

  return NextResponse.json({ error: 'failed' }, { status: 500 });
}
