import { LayoutDashboard, Receipt, PlusCircle, Tags, CreditCard } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-[#0f1523] text-white p-4 flex flex-col border-r border-gray-800">
      <div className="flex items-center gap-3 mb-8 px-2 mt-2">
        <CreditCard className="text-blue-400" size={28} />
        <h1 className="text-xl font-bold">FinanceApp</h1>
      </div>

      <nav className="flex flex-col gap-2">
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <NavItem icon={<Receipt size={20} />} label="Lancamentos" />
        <NavItem icon={<PlusCircle size={20} />} label="Novo Lancamento" />
        <NavItem icon={<Tags size={20} />} label="Categorias" active />
      </nav>
    </aside>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active
          ? 'bg-[#2a2f4c] text-blue-400'
          : 'text-gray-400 hover:text-white hover:bg-[#1a2133]'
      }`}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </a>
  );
}
