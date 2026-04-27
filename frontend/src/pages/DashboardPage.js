import { Link } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import DashboardSummaryCards from '../components/dashboard/DashboardSummaryCards';
import DashboardHistoryChart from '../components/dashboard/DashboardHistoryChart';
import DashboardCategoryBars from '../components/dashboard/DashboardCategoryBars';
import DashboardRecentTransactions from '../components/dashboard/DashboardRecentTransactions';

export default function DashboardPage() {
  const { dashboardData, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <section className="min-h-screen text-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-4" />
          <p className="text-gray-400">Carregando dashboard...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen text-white">
        <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-4">
          <p className="text-red-200">Erro ao carregar o dashboard: {error}</p>
        </div>
      </section>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <section className="min-h-screen text-white">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
        </div>
        <Link
          to="/transactions/new"
          className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400 transition-colors shadow-sm"
        >
          + Novo Lançamento
        </Link>
      </header>

      <DashboardSummaryCards summary={dashboardData.summary} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DashboardHistoryChart data={dashboardData.monthly_history} />
        <DashboardCategoryBars data={dashboardData.expenses_by_category} />
      </div>

      <div className="mb-8">
        <DashboardRecentTransactions transactions={dashboardData.recent_transactions} />
      </div>
    </section>
  );
}
