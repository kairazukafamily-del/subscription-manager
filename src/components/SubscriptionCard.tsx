import type { Category, RateInfo, Subscription } from '@/types';
import { toJpy } from '@/lib/exchange';

interface Props {
  sub: Subscription;
  categories: Category[];
  rateInfo: RateInfo;
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
}

const STATUS_LABEL: Record<Subscription['status'], string> = {
  active: 'アクティブ',
  paused: '停止中',
};

const STATUS_COLOR: Record<Subscription['status'], string> = {
  active: 'text-[#7a7572]',
  paused: 'text-[#aaa49e]',
};

export function SubscriptionCard({ sub, categories, rateInfo, onEdit, onDelete }: Props) {
  const categoryName = categories.find((c) => c.id === sub.category)?.name ?? sub.category;
  const jpyAmount = toJpy(sub.amount, sub.currency, rateInfo.rate);

  return (
    <div
      className={`py-5 border-b border-[#e8e5e1] cursor-pointer group ${sub.status === 'paused' ? 'opacity-50' : ''}`}
      onClick={() => onEdit(sub)}
    >
      <div className="flex items-baseline justify-between">
        <span className="text-[#3a3734] font-light tracking-wide">{sub.name}</span>
        <span className="text-[#3a3734] font-light tabular-nums">¥ {jpyAmount.toLocaleString()}</span>
      </div>

      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-2 text-xs text-[#aaa49e] tracking-wide">
          <span>{categoryName}</span>
          <span>·</span>
          <span>毎月{sub.billingDay}日</span>
          {sub.currency === 'USD' && rateInfo.rate > 0 && (
            <>
              <span>·</span>
              <span>${sub.amount} × ¥ {rateInfo.rate.toFixed(0)}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs ${STATUS_COLOR[sub.status]}`}>{STATUS_LABEL[sub.status]}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(sub.id); }}
            className="text-xs text-[#aaa49e] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#7a7572]"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
