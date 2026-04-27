import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import TransactionCategoryPill from './TransactionCategoryPill';
import TransactionTypePill from './TransactionTypePill';

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return '--';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

export default function TransactionTableRow({ transaction, onDelete, isDeleting }) {
  const isExpense = transaction.transactionType === 'expense';

  return (
    <tr className="border-b border-gray-800 last:border-b-0">
      <td className="px-4 py-3 text-sm text-gray-300">{formatDate(transaction.transactionDate)}</td>
      <td className="px-4 py-3">
        <p className="text-sm font-semibold text-white">{transaction.title}</p>
        <p className="text-xs text-gray-400">{transaction.description || 'Sem observacoes'}</p>
      </td>
      <td className="px-4 py-3">
        <TransactionCategoryPill categoryName={transaction.categoryName} />
      </td>
      <td className="px-4 py-3">
        <TransactionTypePill type={transaction.transactionType} />
      </td>
      <td className={`px-4 py-3 text-sm font-semibold ${isExpense ? 'text-red-300' : 'text-emerald-300'}`}>
        {isExpense ? '-' : '+'} {formatCurrency(transaction.amount)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Link
            to={`/transactions/${transaction.id}`}
            className="inline-flex items-center gap-1 rounded-md border border-gray-700 px-2 py-1 text-xs text-gray-200 hover:border-blue-400 hover:text-blue-300"
          >
            <Pencil size={14} />
            Editar
          </Link>
          <button
            type="button"
            onClick={() => onDelete(transaction)}
            disabled={isDeleting}
            className="inline-flex items-center gap-1 rounded-md border border-gray-700 px-2 py-1 text-xs text-gray-200 hover:border-red-400 hover:text-red-300 disabled:opacity-60"
          >
            <Trash2 size={14} />
            Excluir
          </button>
        </div>
      </td>
    </tr>
  );
}
