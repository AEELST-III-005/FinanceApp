import CategoryForm from '../components/categories/CategoryForm';
import CategoriesList from '../components/categories/CategoriesList';
import ConfirmDeleteModal from '../components/categories/ConfirmDeleteModal';
import useCategoriesCrud from '../hooks/useCategoriesCrud';

export default function CategoriesPage() {
  const {
    categories,
    isLoading,
    isSubmitting,
    isDeleting,
    error,
    successMessage,
    editingCategory,
    deletingCategory,
    handleSaveCategory,
    handleDeleteCategory,
    startEdit,
    cancelEdit,
    openDeleteModal,
    closeDeleteModal,
  } = useCategoriesCrud();

  return (
    <section className="min-h-screen text-white">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <p className="text-gray-400 text-sm">{categories.length} categoria(s) cadastrada(s)</p>
      </header>

      {(error || successMessage) && (
        <div className="mb-6 space-y-2">
          {error && (
            <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}
          {successMessage && (
            <p className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              {successMessage}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#121827] border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
          </h2>
          <CategoryForm
            categories={categories}
            editingCategory={editingCategory}
            isSubmitting={isSubmitting}
            onSave={handleSaveCategory}
            onCancelEdit={cancelEdit}
          />
        </div>

        <div className="bg-[#121827] border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Suas Categorias</h2>
          <CategoriesList
            categories={categories}
            isLoading={isLoading}
            editingCategory={editingCategory}
            onEdit={startEdit}
            onDelete={openDeleteModal}
          />
        </div>
      </div>

      <ConfirmDeleteModal
        category={deletingCategory}
        isOpen={Boolean(deletingCategory)}
        isDeleting={isDeleting}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteCategory}
      />
    </section>
  );
}
