export default function ConfirmDeleteModal({
  category,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}) {
  if (!isOpen || !category) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-content-center p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-700 bg-[#121827] p-6">
        <h3 className="text-lg font-semibold">Excluir categoria</h3>
        <p className="text-sm text-gray-300 mt-2">
          Tem certeza que deseja excluir a categoria <strong>{category.name}</strong>? Esta acao
          pode impactar lancamentos relacionados.
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
            onClick={() => onConfirm(category.id)}
            disabled={isDeleting}
            className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200 hover:bg-red-500/20 disabled:opacity-50"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
}
