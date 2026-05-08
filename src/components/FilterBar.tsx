import type { Category, ServiceStatus } from '@/types';

type StatusFilter = ServiceStatus | 'all';

interface Props {
  statusFilter: StatusFilter;
  categoryFilter: string;
  categories: Category[];
  onStatusChange: (s: StatusFilter) => void;
  onCategoryChange: (c: string) => void;
  onManageCategories: () => void;
}

const STATUS_LABELS: Record<StatusFilter, string> = {
  all: 'すべて',
  active: 'アクティブ',
  paused: '停止中',
};

export function FilterBar({ statusFilter, categoryFilter, categories, onStatusChange, onCategoryChange, onManageCategories }: Props) {
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
    </div>
  );
}
