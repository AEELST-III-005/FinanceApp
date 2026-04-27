import TransactionForm from '../components/transactions/TransactionForm';
import TransactionsList from '../components/transactions/TransactionsList';
import ConfirmDeleteTransactionModal from '../components/transactions/ConfirmDeleteTransactionModal';
import useTransactionsCrud from '../hooks/useTransactionsCrud';

export default function TransactionsPage() {
  const {
    transactions,
    isLoading,
    isSubmitting,
    isDeleting,
    error,
    successMessage,
    editingTransaction,
    deletingTransaction,
    handleSaveTransaction,
    handleDeleteTransaction,
    startEdit,
    cancelEdit,
    openDeleteModal,
    closeDeleteModal,
  } = useTransactionsCrud();

  return (
    <section className="min-h-screen text-white">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Lancamentos</h1>
        <p className="text-sm text-gray-400">{transactions.length} lancamento(s) cadastrado(s)</p>
      </header>

      {(error || successMessage) && (
        <div className="mb-6 space-y-2">
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-[#121827] p-6">
          <TransactionForm
            editingTransaction={editingTransaction}
            isSubmitting={isSubmitting}
            onSave={handleSaveTransaction}
            onCancelEdit={cancelEdit}
          />
        </div>

        <div className="rounded-xl border border-gray-800 bg-[#121827] p-6">
          <h2 className="mb-4 text-lg font-semibold">Seus lancamentos</h2>
          <TransactionsList
            transactions={transactions}
            isLoading={isLoading}
            editingTransaction={editingTransaction}
            onEdit={startEdit}
            onDelete={openDeleteModal}
          />
        </div>
      </div>

      <ConfirmDeleteTransactionModal
        transaction={deletingTransaction}
        isOpen={Boolean(deletingTransaction)}
        isDeleting={isDeleting}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteTransaction}
      />
    </section>
  );
}
