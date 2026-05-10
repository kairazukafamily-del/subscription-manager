import type { Category, ServiceStatus, SortKey, SortOrder } from '@/types';

type StatusFilter = ServiceStatus | 'all';

interface Props {
  statusFilter: StatusFilter;
  categoryFilter: string;
  categories: Category[];
  sortKey: SortKey;
  sortOrder: SortOrder;
  onStatusChange: (s: StatusFilter) => void;
  onCategoryChange: (c: string) => void;
  onManageCategories: () => void;
  onSortKeyChange: (k: SortKey) => void;
  onSortOrderToggle: () => void;
}

const STATUS_LABELS: Record<StatusFilter, string> = {
  all: 'すべて',
  active: 'アクティブ',
  paused: '停止中',
};

const SORT_KEY_LABELS: Record<SortKey, string> = {
  name: '名前',
  amount: '金額',
  billingDay: '請求日',
};

export function FilterBar({ statusFilter, categoryFilter, categories, sortKey, sortOrder, onStatusChange, onCategoryChange, onManageCategories, onSortKeyChange, onSortOrderToggle }: Props) {
  return (
    <div className="flex flex-col gap-3 mb-8">
      <div className="flex gap-10 text-sm">
        {(['all', 'active', 'paused'] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => onStatusChange(s)}
            className={`tracking-wide transition-colors ${
              statusFilter === s
                ? 'text-[#3a3734] border-b border-[#3a3734]'
                : 'text-[#aaa49e] hover:text-[#7a7572]'
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="text-sm text-[#7a7572] bg-transparent border-none outline-none cursor-pointer w-fit"
        >
          <option value="all">すべて</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button
          onClick={onManageCategories}
          className="text-[10px] text-[#c0bbb6] hover:text-[#aaa49e] transition-colors tracking-wide"
        >
          編集
        </button>
      </div>

      <div className="flex items-center gap-4 text-[10px]">
{(['name', 'amount', 'billingDay'] as SortKey[]).map((k) => (
          <button
            key={k}
            onClick={() => onSortKeyChange(k)}
            className={`tracking-wide transition-colors ${
              sortKey === k
                ? 'text-[#3a3734] border-b border-[#3a3734]'
                : 'text-[#aaa49e] hover:text-[#7a7572]'
            }`}
          >
            {SORT_KEY_LABELS[k]}
          </button>
        ))}
        <button
          onClick={onSortOrderToggle}
          className="text-xs text-[#7a7572] hover:text-[#3a3734] transition-colors ml-1"
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>
    </div>
  );
}
