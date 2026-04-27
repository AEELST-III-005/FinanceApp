import { Link } from 'react-router-dom';
import { useState } from 'react';
import useTransactionsList from '../hooks/useTransactionsList';
import TransactionsFilterBar from '../components/transactions/TransactionsFilterBar';
import TransactionsListTable from '../components/transactions/TransactionsListTable';
import ConfirmDeleteTransactionModal from '../components/transactions/ConfirmDeleteTransactionModal';

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0));
}

export default function TransactionsListPage() {
  const {
    filteredTransactions,
    categories,
    isLoading,
    isDeleting,
    error,
    successMessage,
    filters,
    totalExpenses,
    applyFilters,
    clearFilters,
    handleDeleteTransaction,
  } = useTransactionsList();
  const [deletingTransaction, setDeletingTransaction] = useState(null);

  return (
    <section className="min-h-screen text-white">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Lancamentos</h1>
          <p className="text-sm text-gray-400">{filteredTransactions.length} registro(s) encontrado(s)</p>
        </div>
        <Link
          to="/transactions/new"
          className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
        >
          + Novo
        </Link>
      </header>

      {(error || successMessage) && (
        <div className="mb-4 space-y-2">
          {error && (
            <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}
          {successMessage && (
            <p className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              {successMessage}
            </p>
          )}
        </div>
      )}

      <div className="mb-5">
        <TransactionsFilterBar
          filters={filters}
          categories={categories}
          onApply={applyFilters}
          onClear={clearFilters}
        />
      </div>

      <p className="mb-4 text-sm text-gray-300">
        Total despesas: <span className="font-semibold text-red-300">{formatCurrency(totalExpenses)}</span>
      </p>

      <TransactionsListTable
        transactions={filteredTransactions}
        isLoading={isLoading}
        isDeleting={isDeleting}
        onDelete={setDeletingTransaction}
      />

      <ConfirmDeleteTransactionModal
        transaction={deletingTransaction}
        isOpen={Boolean(deletingTransaction)}
        isDeleting={isDeleting}
        onClose={() => !isDeleting && setDeletingTransaction(null)}
        onConfirm={async (id) => {
          await handleDeleteTransaction(id);
          setDeletingTransaction(null);
        }}
      />
    </section>
  );
}
