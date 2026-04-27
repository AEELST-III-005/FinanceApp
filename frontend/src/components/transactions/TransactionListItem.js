import { Pencil, Trash2 } from 'lucide-react';

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return '--';
  return new Intl.DateTimeFormat('pt-BR').format(new Date(value));
}

export default function TransactionListItem({ transaction, isEditing, onEdit, onDelete }) {
  const isExpense = transaction.transactionType === 'expense';

  return (
    <article
      className={`rounded-lg border p-4 transition-colors ${
        isEditing ? 'border-blue-500/50 bg-blue-500/5' : 'border-gray-800 bg-[#0b0f19]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">{transaction.title}</h3>
          <p className="mt-1 text-xs text-gray-400">{transaction.description || 'Sem observacoes'}</p>
        </div>

        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            isExpense ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
          }`}
        >
          {isExpense ? 'Despesa' : 'Receita'}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div>
          <p className={`text-sm font-semibold ${isExpense ? 'text-red-300' : 'text-emerald-300'}`}>
            {isExpense ? '-' : '+'} {formatCurrency(transaction.amount)}
          </p>
          <p className="text-xs text-gray-500">
            {formatDate(transaction.transactionDate)} - {transaction.categoryName || 'Sem categoria'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(transaction)}
            className="rounded-md border border-gray-700 p-2 text-gray-300 hover:border-blue-400 hover:text-blue-300"
            aria-label="Editar lancamento"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(transaction)}
            className="rounded-md border border-gray-700 p-2 text-gray-300 hover:border-red-400 hover:text-red-300"
            aria-label="Excluir lancamento"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
