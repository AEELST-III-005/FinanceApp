export default function DashboardHistoryChart({ data }) {
  if (!data || data.length === 0) return (
    <div className="bg-[#121827] border border-gray-800 rounded-xl p-6 h-64 flex items-center justify-center shadow-sm">
      <p className="text-gray-500">Nenhum dado disponível.</p>
    </div>
  );

  const maxAmount = Math.max(
    ...data.map(d => Math.max(Number(d.incomes) || 0, Number(d.expenses) || 0))
  );

  return (
    <div className="bg-[#121827] border border-gray-800 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-6">Últimos 6 meses</h3>
      <div className="flex items-end justify-between h-48 gap-2">
        {data.map((item, index) => {
          const incomeHeight = maxAmount > 0 ? ((item.incomes || 0) / maxAmount) * 100 : 0;
          const expenseHeight = maxAmount > 0 ? ((item.expenses || 0) / maxAmount) * 100 : 0;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1 gap-2">
              <div className="flex items-end gap-1 w-full h-full justify-center group relative">
                <div 
                  className="w-full max-w-[16px] bg-emerald-500 rounded-t-sm hover:opacity-80 transition-opacity"
                  style={{ height: `${Math.max(incomeHeight, 2)}%` }}
                  title={`Receitas: R$ ${Number(item.incomes || 0).toFixed(2)}`}
                />
                <div 
                  className="w-full max-w-[16px] bg-red-500 rounded-t-sm hover:opacity-80 transition-opacity"
                  style={{ height: `${Math.max(expenseHeight, 2)}%` }}
                  title={`Despesas: R$ ${Number(item.expenses || 0).toFixed(2)}`}
                />
              </div>
              <span className="text-xs text-gray-500 font-medium">{item.month}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-gray-400">Receitas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-gray-400">Despesas</span>
        </div>
      </div>
    </div>
  );
}
