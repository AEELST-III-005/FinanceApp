import { formatCurrency } from '../../utils/format';

export default function DashboardCategoryBars({ data }) {
  if (!data || data.length === 0) return (
    <div className="bg-[#121827] border border-gray-800 rounded-xl p-6 h-64 flex items-center justify-center shadow-sm">
      <p className="text-gray-500">Nenhum dado de categoria disponível.</p>
    </div>
  );

  const maxAmount = Math.max(...data.map(c => Number(c.total_amount) || 0));

  return (
    <div className="bg-[#121827] border border-gray-800 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-6">Por categoria</h3>
      <div className="space-y-5">
        {data.map((category, index) => {
          const percentage = maxAmount > 0 ? ((category.total_amount || 0) / maxAmount) * 100 : 0;
          return (
            <div key={index}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300 font-medium">{category.category_name}</span>
                <span className="text-gray-400">{formatCurrency(category.total_amount)}</span>
              </div>
              <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: category.color || '#3b82f6'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
