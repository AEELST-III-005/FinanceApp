import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency } from '../../utils/format';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1a1f2e] border border-gray-800 p-3 rounded-lg shadow-2xl backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-1">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: data.color }} 
          />
          <span className="text-gray-300 text-sm font-medium">{data.name}</span>
        </div>
        <p className="text-white font-bold text-lg">
          {formatCurrency(data.value)}
        </p>
        <p className="text-gray-500 text-xs mt-1">
          {((data.value / data.total) * 100).toFixed(1)}% do total
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomizedLegend = (props) => {
  const { payload } = props;
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full shrink-0" 
            style={{ backgroundColor: entry.color }} 
          />
          <span className="text-xs text-gray-400 truncate max-w-[100px]">
            {entry.value}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default function DashboardCategoryBars({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#121827] border border-gray-800 rounded-xl p-6 h-[400px] flex items-center justify-center shadow-sm">
        <p className="text-gray-500 font-medium">Nenhum dado de categoria disponível.</p>
      </div>
    );
  }

  const totalExpenses = data.reduce((sum, item) => sum + (parseFloat(item.total_amount) || 0), 0);

  const chartData = data.map(item => ({
    name: item.category_name,
    value: parseFloat(item.total_amount) || 0,
    color: item.color || '#3b82f6',
    total: totalExpenses
  }));

  return (
    <div className="bg-[#121827] border border-gray-800 rounded-xl p-6 shadow-sm h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Gastos por Categoria</h3>
        <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-md">Este mês</span>
      </div>
      
      <div className="flex-1 w-full min-h-0 flex flex-col items-center justify-center">
        <div className="w-full h-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                content={renderCustomizedLegend}
                verticalAlign="bottom"
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mb-8">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Total</p>
            <p className="text-lg font-bold text-white leading-tight">
              {formatCurrency(totalExpenses).split(',')[0]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

