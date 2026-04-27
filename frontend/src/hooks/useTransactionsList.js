import { useCallback, useEffect, useMemo, useState } from 'react';
import { getCategories } from '../services/categoriesService';
import { deleteTransaction, getTransactionsWithFilters } from '../services/transactionsService';

const INITIAL_FILTERS = {
  search: '',
  categoryId: 'all',
  type: 'all',
  startDate: null,
  endDate: null,
};

const toDateOnly = (value) => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
};

const matchesDateRange = (transactionDate, startDate, endDate) => {
  const current = new Date(transactionDate);
  if (Number.isNaN(current.getTime())) return false;

  if (startDate) {
    const start = new Date(startDate);
    if (current < start) return false;
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    if (current > end) return false;
  }

  return true;
};

const sortByDateDesc = (items) =>
  [...items].sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));

export default function useTransactionsList() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const applyCurrentFilters = useCallback((items, nextFilters) => {
    const normalizedSearch = nextFilters.search.trim().toLowerCase();

    const filtered = items.filter((transaction) => {
      const title = String(transaction.title || '').toLowerCase();
      const description = String(transaction.description || '').toLowerCase();
      const searchMatch = !normalizedSearch
        || title.includes(normalizedSearch)
        || description.includes(normalizedSearch);
      const categoryMatch = nextFilters.categoryId === 'all' || transaction.categoryId === nextFilters.categoryId;
      const typeMatch = nextFilters.type === 'all' || transaction.transactionType === nextFilters.type;
      const dateMatch = matchesDateRange(
        transaction.transactionDate,
        nextFilters.startDate,
        nextFilters.endDate
      );

      return searchMatch && categoryMatch && typeMatch && dateMatch;
    });

    const sorted = sortByDateDesc(filtered);
    setFilteredTransactions(sorted);

    const expenses = sorted
      .filter((transaction) => transaction.transactionType === 'expense')
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

    setTotalExpenses(expenses);
  }, []);

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await getTransactionsWithFilters({
        category_id: filters.categoryId,
        transaction_type: filters.type,
        start_date: toDateOnly(filters.startDate),
        end_date: toDateOnly(filters.endDate),
      });
      const sorted = sortByDateDesc(data);
      setTransactions(sorted);
      applyCurrentFilters(sorted, filters);
    } catch (err) {
      setError(err.message || 'Nao foi possivel carregar lancamentos.');
    } finally {
      setIsLoading(false);
    }
  }, [applyCurrentFilters, filters]);

  const loadCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Nao foi possivel carregar categorias.');
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const applyFilters = useCallback(
    (newFilters) => {
      const nextFilters = { ...filters, ...newFilters };
      setFilters(nextFilters);
      applyCurrentFilters(transactions, nextFilters);
    },
    [applyCurrentFilters, filters, transactions]
  );

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    applyCurrentFilters(transactions, INITIAL_FILTERS);
  }, [applyCurrentFilters, transactions]);

  const handleDeleteTransaction = useCallback(
    async (id) => {
      setIsDeleting(true);
      setError('');
      setSuccessMessage('');

      try {
        await deleteTransaction(id);
        setSuccessMessage('Lancamento excluido com sucesso.');
        const remainingTransactions = transactions.filter((item) => item.id !== id);
        setTransactions(remainingTransactions);
        applyCurrentFilters(remainingTransactions, filters);
      } catch (err) {
        setError(err.message || 'Nao foi possivel excluir lancamento.');
      } finally {
        setIsDeleting(false);
      }
    },
    [applyCurrentFilters, filters, transactions]
  );

  const availableCategoryOptions = useMemo(
    () => categories.map((category) => ({ id: category.id, name: category.name })),
    [categories]
  );

  return {
    transactions,
    filteredTransactions,
    categories: availableCategoryOptions,
    isLoading,
    isDeleting,
    error,
    successMessage,
    filters,
    totalExpenses,
    loadTransactions,
    applyFilters,
    clearFilters,
    handleDeleteTransaction,
  };
}
