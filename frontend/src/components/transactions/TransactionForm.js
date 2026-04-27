import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Check, HandCoins, Leaf } from 'lucide-react';
import { getCategories } from '../../services/categoriesService';
import 'react-datepicker/dist/react-datepicker.css';

const INITIAL_FORM = {
  title: '',
  amount: '',
  transactionDate: new Date().toISOString().split('T')[0],
  transactionType: 'expense',
  categoryId: '',
  description: '',
};

export default function TransactionForm({ editingTransaction, isSubmitting, onSave, onCancelEdit }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [categoriesError, setCategoriesError] = useState('');

  const isEditMode = Boolean(editingTransaction);

  useEffect(() => {
    if (!editingTransaction) {
      setForm(INITIAL_FORM);
      setErrors({});
      return;
    }

    setForm({
      title: editingTransaction.title || '',
      amount: String(editingTransaction.amount ?? ''),
      transactionDate: editingTransaction.transactionDate || new Date().toISOString().split('T')[0],
      transactionType: editingTransaction.transactionType || 'expense',
      categoryId: editingTransaction.categoryId || '',
      description: editingTransaction.description || '',
    });
    setErrors({});
  }, [editingTransaction]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        setCategoriesError(err.message || 'Nao foi possivel carregar categorias.');
      }
    }

    loadCategories();
  }, []);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.title.trim()) nextErrors.title = 'Descricao obrigatoria.';
    if (!Number(form.amount) || Number(form.amount) <= 0) nextErrors.amount = 'Valor deve ser maior que zero.';
    if (!form.transactionDate || Number.isNaN(new Date(form.transactionDate).getTime())) {
      nextErrors.transactionDate = 'Data invalida.';
    }
    if (!form.categoryId) nextErrors.categoryId = 'Categoria obrigatoria.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      await onSave({
        title: form.title.trim(),
        description: form.description.trim(),
        amount: Number(form.amount),
        transactionDate: form.transactionDate,
        transactionType: form.transactionType,
        categoryId: form.categoryId,
      });

      if (!isEditMode) {
        setForm(INITIAL_FORM);
      }
    } catch {
      // Parent page handles API errors.
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-lg font-semibold">Novo Lancamento</h2>

      <div>
        <label htmlFor="transaction-title" className="mb-1 block text-sm text-gray-300">
          Descricao *
        </label>
        <input
          id="transaction-title"
          type="text"
          value={form.title}
          onChange={(event) => setField('title', event.target.value)}
          placeholder="Ex: Supermercado, Salario, Aluguel..."
          className="w-full rounded-md border border-gray-700 bg-[#0b0f19] px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
        {errors.title && <p className="mt-1 text-xs text-red-300">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="transaction-amount" className="mb-1 block text-sm text-gray-300">
          Valor (R$) *
        </label>
        <input
          id="transaction-amount"
          type="number"
          min="0"
          step="0.01"
          value={form.amount}
          onChange={(event) => setField('amount', event.target.value)}
          placeholder="R$ 0"
          className="w-full rounded-md border border-gray-700 bg-[#0b0f19] px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
        {errors.amount && <p className="mt-1 text-xs text-red-300">{errors.amount}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-300">Data *</label>
        <DatePicker
          selected={form.transactionDate ? new Date(form.transactionDate) : null}
          onChange={(date) =>
            setField(
              'transactionDate',
              date ? new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0] : ''
            )
          }
          dateFormat="dd/MM/yyyy"
          placeholderText="Selecione uma data"
          className="w-full rounded-md border border-gray-700 bg-[#0b0f19] px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
          wrapperClassName="w-full"
        />
        {errors.transactionDate && <p className="mt-1 text-xs text-red-300">{errors.transactionDate}</p>}
      </div>

      <div>
        <p className="mb-2 block text-sm text-gray-300">Tipo *</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setField('transactionType', 'expense')}
            className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm ${
              form.transactionType === 'expense'
                ? 'border-red-400 bg-red-500/10 text-red-300'
                : 'border-gray-700 text-gray-300 hover:border-red-400/50'
            }`}
          >
            <Leaf size={15} />
            Despesa
          </button>
          <button
            type="button"
            onClick={() => setField('transactionType', 'income')}
            className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm ${
              form.transactionType === 'income'
                ? 'border-emerald-400 bg-emerald-500/10 text-emerald-300'
                : 'border-gray-700 text-gray-300 hover:border-emerald-400/50'
            }`}
          >
            <HandCoins size={15} />
            Receita
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="transaction-category" className="mb-1 block text-sm text-gray-300">
          Categoria *
        </label>
        <select
          id="transaction-category"
          value={form.categoryId}
          onChange={(event) => setField('categoryId', event.target.value)}
          className="w-full rounded-md border border-gray-700 bg-[#0b0f19] px-3 py-2 text-sm outline-none focus:border-blue-400"
        >
          <option value="">-- Sem categoria --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">Opcional</p>
        {(errors.categoryId || categoriesError) && (
          <p className="mt-1 text-xs text-red-300">{errors.categoryId || categoriesError}</p>
        )}
      </div>

      <div>
        <label htmlFor="transaction-description" className="mb-1 block text-sm text-gray-300">
          Observacoes
        </label>
        <textarea
          id="transaction-description"
          value={form.description}
          onChange={(event) => setField('description', event.target.value.slice(0, 500))}
          placeholder="Observacoes opcionais..."
          rows={4}
          className="w-full rounded-md border border-gray-700 bg-[#0b0f19] px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
        <p className="mt-1 text-xs text-gray-500">Maximo 500 caracteres</p>
        {errors.description && <p className="mt-1 text-xs text-red-300">{errors.description}</p>}
      </div>

      <p className="text-xs text-gray-500">* Campos obrigatorios</p>

      <div className="flex gap-3">
        {isEditMode && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={isSubmitting}
            className="rounded-md border border-gray-600 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 disabled:opacity-50"
          >
            Cancelar edicao
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400 disabled:opacity-60"
        >
          <Check size={15} />
          {isSubmitting
            ? 'Salvando...'
            : isEditMode
              ? 'Atualizar Lancamento'
              : '+ Criar Lancamento'}
        </button>
      </div>
    </form>
  );
}
