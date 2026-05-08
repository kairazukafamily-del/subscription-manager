import type { Category, RateInfo, Subscription } from '@/types';
import { SubscriptionCard } from './SubscriptionCard';

interface Props {
  subscriptions: Subscription[];
  categories: Category[];
  rateInfo: RateInfo;
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
}

export function SubscriptionList({ subscriptions, categories, rateInfo, onEdit, onDelete }: Props) {
  if (subscriptions.length === 0) {
    return (
      <p className="text-[#c0bbb6] text-sm tracking-widest py-8 text-center font-light">
        サービスがありません
      </p>
    );
  }

  return (
    <div>
      {subscriptions.map((sub) => (
        <SubscriptionCard
          key={sub.id}
          sub={sub}
          categories={categories}
          rateInfo={rateInfo}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
