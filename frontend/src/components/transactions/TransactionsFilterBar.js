import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Filter } from 'lucide-react';

export default function TransactionsFilterBar({ filters, categories, onApply, onClear }) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const setField = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onApply(localFilters);
  };

  const handleClear = () => {
    const reset = {
      search: '',
      categoryId: 'all',
      type: 'all',
      startDate: null,
      endDate: null,
    };
    setLocalFilters(reset);
    onClear();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 rounded-xl border border-gray-800 bg-[#121827] p-4 md:grid-cols-2 lg:grid-cols-6"
    >
      <div className="lg:col-span-2">
        <label htmlFor="filter-search" className="mb-1 block text-xs text-gray-400">
          Busca
        </label>
        <input
          id="filter-search"
          type="text"
          value={localFilters.search}
          onChange={(event) => setField('search', event.target.value)}
          placeholder="Descricao..."
          className="w-full rounded-md border border-gray-700 bg-[#0b0f19] px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
        />
      </div>

      <div>
        <label htmlFor="filter-category" className="mb-1 block text-xs text-gray-400">
          Categoria
        </label>
        <select
          id="filter-category"
          value={localFilters.categoryId}
          onChange={(event) => setField('categoryId', event.target.value)}
          className="w-full rounded-md border border-gray-700 bg-[#0b0f19] px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
        >
          <option value="all">Todas</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-type" className="mb-1 block text-xs text-gray-400">
          Tipo
        </label>
        <select
          id="filter-type"
          value={localFilters.type}
          onChange={(event) => setField('type', event.target.value)}
          className="w-full rounded-md border border-gray-700 bg-[#0b0f19] px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
        >
          <option value="all">Todos</option>
          <option value="income">Receita</option>
          <option value="expense">Despesa</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs text-gray-400">Data Inicio</label>
        <DatePicker
          selected={localFilters.startDate}
          onChange={(date) => setField('startDate', date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/mm/aaaa"
          className="w-full rounded-md border border-gray-700 bg-[#0b0f19] px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
          wrapperClassName="w-full"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-gray-400">Data Fim</label>
        <DatePicker
          selected={localFilters.endDate}
          onChange={(date) => setField('endDate', date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/mm/aaaa"
          className="w-full rounded-md border border-gray-700 bg-[#0b0f19] px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
          wrapperClassName="w-full"
        />
      </div>

      <div className="flex items-end gap-2 lg:col-span-6">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
        >
          <Filter size={14} />
          Filtrar
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/40"
        >
          Limpar
        </button>
      </div>
    </form>
  );
}
