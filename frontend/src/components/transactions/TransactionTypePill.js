export default function TransactionTypePill({ type }) {
  const isExpense = type === 'expense';

  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
        isExpense ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
      }`}
    >
      {isExpense ? 'Despesa' : 'Receita'}
    </span>
  );
}
