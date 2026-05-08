import type { RateInfo } from '@/types';
import { formatCachedAt } from '@/lib/exchange';

interface Props {
  totalJpy: number;
  activeCount: number;
  rateInfo: RateInfo;
  rateLoading: boolean;
  onRefreshRate: () => void;
}

export function Dashboard({ totalJpy, activeCount, rateInfo, rateLoading, onRefreshRate }: Props) {
  return (
    <div className="mb-10">
      <div className="mb-8">
        <p className="text-xs tracking-widest text-[#aaa49e] mb-1">月間合計</p>
        <p className="text-4xl font-light tracking-tight text-[#3a3734]">
          ¥ {totalJpy.toLocaleString()}
        </p>
      </div>

      <div className="flex gap-8 text-sm">
        <div>
          <p className="text-[#aaa49e] text-xs tracking-widest mb-0.5">アクティブ</p>
          <p className="text-[#3a3734] font-light">{activeCount}件</p>
        </div>
        <div>
          <p className="text-[#aaa49e] text-xs tracking-widest mb-0.5">USD/JPY</p>
          {rateLoading ? (
            <p className="text-[#aaa49e] font-light text-sm">取得中…</p>
          ) : rateInfo.error && !rateInfo.cachedAt ? (
            <div className="flex items-center gap-2">
              <p className="text-[#aaa49e] font-light text-xs">取得できません</p>
              <button
                onClick={onRefreshRate}
                className="text-[10px] text-[#aaa49e] hover:text-[#7a7572] transition-colors tracking-wide"
              >
                再試行
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-[#3a3734] font-light">
                {rateInfo.rate > 0 ? `¥${rateInfo.rate.toFixed(2)}` : '—'}
                {rateInfo.cachedAt && (
                  <span className="text-[#aaa49e] text-xs ml-2">{formatCachedAt(rateInfo.cachedAt)}</span>
                )}
                {rateInfo.error && (
                  <span className="text-[#aaa49e] text-xs ml-1">（キャッシュ）</span>
                )}
              </p>
              {rateInfo.rate > 0 && (
                <button
                  onClick={onRefreshRate}
                  className="text-[10px] text-[#c0bbb6] hover:text-[#aaa49e] transition-colors"
                  title="更新"
                >
                  ↻
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
