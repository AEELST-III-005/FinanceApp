import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardPage from './pages/DashboardPage';
import ReleasesPage from './pages/ReleasesPage';
import CategoriesPage from './pages/CategoriesPage';
import TransactionsPage from './pages/TransactionsPage';

export default function App() {
    return (<BrowserRouter>
            <div className="flex min-h-screen bg-[#0b0f19] text-white font-sans">
                <Sidebar/>

                <main className="flex-1 p-8">
                    <Routes>
                        <Route path="/" element={<DashboardPage/>}/>
                        <Route path="/releases" element={<ReleasesPage/>}/>
                        <Route path="/transactions" element={<TransactionsPage/>}/>
                        <Route path="/new-release" element={<Navigate to="/transactions" replace/>}/>
                        <Route path="/categories" element={<CategoriesPage/>}/>
                        <Route path="*" element={<Navigate to="/" replace/>}/>
                    </Routes>
                </main>
            </div>
        </BrowserRouter>);
}
