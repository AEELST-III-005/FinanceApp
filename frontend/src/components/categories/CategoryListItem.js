export default function CategoryListItem({
  category,
  onEdit,
  onDelete,
  isEditing,
}) {
  return (
    <button
      type="button"
      onClick={() => onEdit(category)}
      className={`w-full rounded-lg border p-4 text-left transition ${
        isEditing
          ? 'border-blue-400 bg-blue-500/10'
          : 'border-gray-700 bg-[#0b0f19] hover:border-gray-500'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="h-10 w-10 rounded-lg grid place-content-center text-lg border border-gray-700"
            style={{ backgroundColor: `${category.color || '#5C62F9'}33` }}
          >
            {category.icon || '💰'}
          </span>

          <div className="min-w-0">
            <p className="font-medium truncate">{category.name}</p>
            <p className="text-xs text-gray-400">
              {category.transactionCount || 0} lancamento(s)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {category.type && (
            <span className="rounded-full bg-gray-700 px-2 py-1 text-xs text-gray-200">
              {category.type === 'income' ? 'Entrada' : 'Saida'}
            </span>
          )}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(category);
            }}
            className="rounded-md border border-red-500/40 bg-red-500/10 px-2 py-1 text-xs text-red-300 hover:bg-red-500/20"
          >
            Excluir
          </button>
        </div>
      </div>
    </button>
  );
}
