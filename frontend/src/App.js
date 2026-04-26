import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardPage from './pages/DashboardPage';
import ReleasesPage from './pages/ReleasesPage';
import NewReleasePage from './pages/NewReleasePage';
import CategoriesPage from './pages/CategoriesPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#0b0f19] text-white font-sans">
        <Sidebar />

        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/releases" element={<ReleasesPage />} />
            <Route path="/new-release" element={<NewReleasePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
