import CategoryListItem from './CategoryListItem';
import EmptyCategoriesState from './EmptyCategoriesState';

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((id) => (
        <div
          key={id}
          className="h-16 rounded-lg border border-gray-800 bg-[#0b0f19] animate-pulse"
        />
      ))}
    </div>
  );
}

export default function CategoriesList({
  categories,
  isLoading,
  editingCategory,
  onEdit,
  onDelete,
}) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!categories.length) {
    return <EmptyCategoriesState />;
  }

  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <CategoryListItem
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
          isEditing={editingCategory?.id === category.id}
        />
      ))}
    </div>
  );
}
