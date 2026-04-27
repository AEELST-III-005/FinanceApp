import EmptyTransactionsState from './EmptyTransactionsState';
import TransactionListItem from './TransactionListItem';

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((id) => (
        <div
          key={id}
          className="h-24 rounded-lg border border-gray-800 bg-[#0b0f19] animate-pulse"
        />
      ))}
    </div>
  );
}

export default function TransactionsList({
  transactions,
  isLoading,
  editingTransaction,
  onEdit,
  onDelete,
}) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!transactions.length) {
    return <EmptyTransactionsState />;
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <TransactionListItem
          key={transaction.id}
          transaction={transaction}
          isEditing={editingTransaction?.id === transaction.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
