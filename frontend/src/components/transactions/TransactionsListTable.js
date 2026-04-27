import TransactionTableRow from './TransactionTableRow';

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-gray-700 bg-[#0b0f19] px-4 py-8 text-center">
      <p className="text-sm text-gray-400">Nenhum lancamento encontrado para os filtros aplicados.</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((id) => (
        <div key={id} className="h-12 animate-pulse rounded-md bg-[#0b0f19]" />
      ))}
    </div>
  );
}

export default function TransactionsListTable({ transactions, isLoading, isDeleting, onDelete }) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!transactions.length) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800">
      <table className="min-w-full bg-[#121827]">
        <thead>
          <tr className="border-b border-gray-800 bg-[#0f1523] text-left text-xs uppercase tracking-wide text-gray-400">
            <th className="px-4 py-3">Data</th>
            <th className="px-4 py-3">Descricao</th>
            <th className="px-4 py-3">Categoria</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Valor</th>
            <th className="px-4 py-3">Acoes</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <TransactionTableRow
              key={transaction.id}
              transaction={transaction}
              isDeleting={isDeleting}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
