import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TransactionForm from '../components/transactions/TransactionForm';
import { createTransaction, getTransactions, updateTransaction } from '../services/transactionsService';

export default function TransactionsFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditMode) return;

    async function loadTransaction() {
      setIsLoading(true);
      setError('');
      try {
        const data = await getTransactions();
        const selected = data.find((item) => item.id === id);
        if (!selected) {
          setError('Lancamento nao encontrado.');
          return;
        }
        setEditingTransaction(selected);
      } catch (err) {
        setError(err.message || 'Nao foi possivel carregar lancamento.');
      } finally {
        setIsLoading(false);
      }
    }

    loadTransaction();
  }, [id, isEditMode]);

  const title = useMemo(
    () => (isEditMode ? 'Editar Lancamento' : 'Novo Lancamento'),
    [isEditMode]
  );

  const subtitle = useMemo(
    () =>
      isEditMode
        ? 'Atualize os dados do seu lancamento financeiro.'
        : 'Cadastre uma nova movimentacao financeira.',
    [isEditMode]
  );

  const handleSave = async (payload) => {
    setIsSubmitting(true);
    setError('');
    try {
      if (isEditMode) {
        await updateTransaction(id, payload);
      } else {
        await createTransaction(payload);
      }
      navigate('/transactions');
    } catch (err) {
      setError(err.message || 'Nao foi possivel salvar lancamento.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen text-white">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </header>

      {error && (
        <p className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      <div className="max-w-2xl rounded-xl border border-gray-800 bg-[#121827] p-6">
        {isLoading ? (
          <div className="h-72 animate-pulse rounded-lg bg-[#0b0f19]" />
        ) : (
          <TransactionForm
            editingTransaction={editingTransaction}
            isSubmitting={isSubmitting}
            onSave={handleSave}
            onCancelEdit={() => navigate('/transactions')}
          />
        )}
      </div>
    </section>
  );
}
