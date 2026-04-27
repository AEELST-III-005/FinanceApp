import { useCallback, useEffect, useState } from 'react';
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from '../services/transactionsService';

const sortByDateDesc = (items) =>
  [...items].sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));

export default function useTransactionsCrud() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await getTransactions();
      setTransactions(sortByDateDesc(data));
    } catch (err) {
      setError(err.message || 'Nao foi possivel carregar lancamentos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleSaveTransaction = useCallback(
    async (payload) => {
      setIsSubmitting(true);
      setError('');
      setSuccessMessage('');

      try {
        if (editingTransaction) {
          await updateTransaction(editingTransaction.id, payload);
          setSuccessMessage('Lancamento atualizado com sucesso.');
        } else {
          await createTransaction(payload);
          setSuccessMessage('Lancamento criado com sucesso.');
        }

        await loadTransactions();
        setEditingTransaction(null);
      } catch (err) {
        setError(err.message || 'Nao foi possivel salvar lancamento.');
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingTransaction, loadTransactions]
  );

  const handleDeleteTransaction = useCallback(
    async (id) => {
      setIsDeleting(true);
      setError('');
      setSuccessMessage('');

      try {
        await deleteTransaction(id);
        setSuccessMessage('Lancamento excluido com sucesso.');
        await loadTransactions();
        setDeletingTransaction(null);

        if (editingTransaction?.id === id) {
          setEditingTransaction(null);
        }
      } catch (err) {
        setError(err.message || 'Nao foi possivel excluir lancamento.');
      } finally {
        setIsDeleting(false);
      }
    },
    [editingTransaction?.id, loadTransactions]
  );

  const startEdit = useCallback((transaction) => {
    setError('');
    setSuccessMessage('');
    setEditingTransaction(transaction);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingTransaction(null);
  }, []);

  const openDeleteModal = useCallback((transaction) => {
    setDeletingTransaction(transaction);
  }, []);

  const closeDeleteModal = useCallback(() => {
    if (!isDeleting) {
      setDeletingTransaction(null);
    }
  }, [isDeleting]);

  return {
    transactions,
    isLoading,
    isSubmitting,
    isDeleting,
    error,
    successMessage,
    editingTransaction,
    deletingTransaction,
    loadTransactions,
    handleSaveTransaction,
    handleDeleteTransaction,
    startEdit,
    cancelEdit,
    openDeleteModal,
    closeDeleteModal,
  };
}
