import { formatCurrency } from '../../utils/format';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function DashboardRecentTransactions({ transactions }) {
  if (!transactions || transactions.length === 0) return (
    <div className="bg-[#121827] border border-gray-800 rounded-xl p-6 text-center shadow-sm">
      <p className="text-gray-500 mb-4">Nenhum lançamento recente.</p>
      <Link to="/transactions/new" className="text-blue-500 hover:text-blue-400 text-sm font-medium">
        Criar primeiro lançamento
      </Link>
    </div>
  );

  return (
    <div className="bg-[#121827] border border-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Últimos lançamentos</h3>
        <Link to="/transactions" className="text-sm text-blue-500 hover:text-blue-400 font-medium">
          Ver todos
        </Link>
      </div>
      <div className="space-y-3">
        {transactions.map(tx => {
          const isIncome = tx.transaction_type === 'income';
          return (
            <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-gray-800/50 rounded-lg transition-colors border border-transparent hover:border-gray-800/80">
              <div className="flex items-center gap-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: tx.category_color ? `${tx.category_color}20` : '#1f2937' }}
                >
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tx.category_color || '#9ca3af' }} />
                </div>
                <div>
                  <p className="font-medium text-gray-200">{tx.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {tx.category_name} • {new Date(tx.transaction_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${isIncome ? 'text-emerald-400' : 'text-gray-300'}`}>
                  {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
                {isIncome ? (
                  <ArrowUpRight className="text-emerald-400" size={16} />
                ) : (
                  <ArrowDownRight className="text-gray-500" size={16} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
