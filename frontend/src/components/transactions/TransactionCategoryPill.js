export default function TransactionCategoryPill({ categoryName }) {
  return (
    <span className="inline-flex rounded-full border border-gray-700 bg-[#0b0f19] px-2 py-1 text-xs text-gray-200">
      {categoryName || 'Sem categoria'}
    </span>
  );
}
