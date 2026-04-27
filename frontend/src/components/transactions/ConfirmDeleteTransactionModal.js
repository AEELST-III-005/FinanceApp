export default function ConfirmDeleteTransactionModal({
  transaction,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}) {
  if (!isOpen || !transaction) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-[#111827] p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white">Excluir lancamento</h3>
        <p className="mt-2 text-sm text-gray-300">
          Deseja realmente excluir <span className="font-semibold">{transaction.title}</span>?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-md border border-gray-600 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirm(transaction.id)}
            disabled={isDeleting}
            className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400 disabled:opacity-50"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
}
