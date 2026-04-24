import Sidebar from './Sidebar';

export default function App() {
  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-white font-sans">
      <Sidebar />

      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold mb-1">Categorias</h2>
          <p className="text-gray-500 text-sm">5 categoria(s) cadastrada(s)</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#121827] border border-gray-800 rounded-xl p-6 min-h-[400px]">
            {/* New Category Form goes here */}
          </div>

          <div className="bg-[#121827] border border-gray-800 rounded-xl p-6 min-h-[400px]">
            {/* Categories List goes here */}
          </div>
        </div>
      </main>
    </div>
  );
}
