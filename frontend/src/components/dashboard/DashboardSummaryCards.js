import { ArrowUpCircle, ArrowDownCircle, Wallet, Calendar } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

export default function DashboardSummaryCards({ summary }) {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-[#121827] border border-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-400 font-medium">Receitas</h3>
          <ArrowUpCircle className="text-emerald-500" size={24} />
        </div>
        <p className="text-2xl font-bold text-white">{formatCurrency(summary.total_incomes)}</p>
      </div>

      <div className="bg-[#121827] border border-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-400 font-medium">Despesas</h3>
          <ArrowDownCircle className="text-red-500" size={24} />
        </div>
        <p className="text-2xl font-bold text-white">{formatCurrency(summary.total_expenses)}</p>
      </div>

      <div className="bg-[#121827] border border-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-400 font-medium">Saldo</h3>
          <Wallet className="text-blue-500" size={24} />
        </div>
        <p className="text-2xl font-bold text-white">{formatCurrency(summary.current_balance)}</p>
      </div>

      <div className="bg-[#121827] border border-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-400 font-medium">Despesas no período</h3>
          <Calendar className="text-purple-500" size={24} />
        </div>
        <p className="text-2xl font-bold text-white">{formatCurrency(summary.period_expenses)}</p>
      </div>
    </div>
  );
}
