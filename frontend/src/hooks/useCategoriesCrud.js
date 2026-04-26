import { useCallback, useEffect, useState } from 'react';
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../services/categoriesService';

export default function useCategoriesCrud() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  const clearFeedback = useCallback(() => {
    setError('');
    setSuccessMessage('');
  }, []);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Nao foi possivel carregar categorias.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleSaveCategory = useCallback(
    async (payload) => {
      setIsSubmitting(true);
      clearFeedback();

      try {
        if (editingCategory) {
          await updateCategory(editingCategory.id, payload);
          setSuccessMessage('Categoria atualizada com sucesso.');
        } else {
          await createCategory(payload);
          setSuccessMessage('Categoria criada com sucesso.');
        }

        await loadCategories();
        setEditingCategory(null);
      } catch (err) {
        setError(err.message || 'Nao foi possivel salvar a categoria.');
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [clearFeedback, editingCategory, loadCategories]
  );

  const handleDeleteCategory = useCallback(
    async (id) => {
      setIsDeleting(true);
      clearFeedback();

      try {
        await deleteCategory(id);
        setSuccessMessage('Categoria excluida com sucesso.');
        await loadCategories();
        setDeletingCategory(null);

        if (editingCategory?.id === id) {
          setEditingCategory(null);
        }
      } catch (err) {
        setError(err.message || 'Nao foi possivel excluir a categoria.');
      } finally {
        setIsDeleting(false);
      }
    },
    [clearFeedback, editingCategory?.id, loadCategories]
  );

  const startEdit = useCallback(
    (category) => {
      clearFeedback();
      setEditingCategory(category);
    },
    [clearFeedback]
  );

  const cancelEdit = useCallback(() => {
    setEditingCategory(null);
  }, []);

  const openDeleteModal = useCallback((category) => {
    setDeletingCategory(category);
  }, []);

  const closeDeleteModal = useCallback(() => {
    if (!isDeleting) {
      setDeletingCategory(null);
    }
  }, [isDeleting]);

  return {
    categories,
    isLoading,
    isSubmitting,
    isDeleting,
    error,
    successMessage,
    editingCategory,
    deletingCategory,
    loadCategories,
    handleSaveCategory,
    handleDeleteCategory,
    startEdit,
    cancelEdit,
    openDeleteModal,
    closeDeleteModal,
  };
}
