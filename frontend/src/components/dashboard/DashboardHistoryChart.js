import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1f2e] border border-gray-800 p-3 rounded-lg shadow-2xl backdrop-blur-sm">
        <p className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">{label}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-gray-300 text-sm">Receitas</span>
            </div>
            <span className="text-emerald-400 text-sm font-semibold">
              R$ {Number(payload[0].value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-gray-300 text-sm">Despesas</span>
            </div>
            <span className="text-red-400 text-sm font-semibold">
              R$ {Number(payload[1].value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function DashboardHistoryChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#121827] border border-gray-800 rounded-xl p-6 h-[400px] flex items-center justify-center shadow-sm">
        <p className="text-gray-500 font-medium">Nenhum dado disponível para o gráfico.</p>
      </div>
    );
  }

  // Format data for Recharts
  const chartData = data.map(item => {
    const [month, year] = item.month.split('/');
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const formattedMonth = `${monthNames[parseInt(month) - 1]}/${year.slice(-2)}`;
    
    return {
      name: formattedMonth,
      originalMonth: item.month,
      incomes: parseFloat(item.incomes) || 0,
      expenses: parseFloat(item.expenses) || 0,
    };
  });


  return (
    <div className="bg-[#121827] border border-gray-800 rounded-xl p-6 shadow-sm h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Fluxo de Caixa</h3>
        <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-md">Últimos 6 meses</span>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barGap={8}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#1f2937" 
            />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: '#1f2937', radius: 4 }}
            />
            <Bar 
              dataKey="incomes" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]} 
              barSize={20}
              animationDuration={1500}
            />
            <Bar 
              dataKey="expenses" 
              fill="#ef4444" 
              radius={[4, 4, 0, 0]} 
              barSize={20}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-800/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
          <span className="text-sm text-gray-400 font-medium">Receitas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
          <span className="text-sm text-gray-400 font-medium">Despesas</span>
        </div>
      </div>
    </div>
  );
}
