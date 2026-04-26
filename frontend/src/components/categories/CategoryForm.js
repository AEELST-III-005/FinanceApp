import { useEffect, useMemo, useState } from 'react';
import IconPicker from './IconPicker';
import ColorPicker from './ColorPicker';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../utils/categoryConstants';

const DEFAULT_ICON = '💰';
const DEFAULT_COLOR = '#5C62F9';

export default function CategoryForm({
  categories,
  editingCategory,
  isSubmitting,
  onSave,
  onCancelEdit,
}) {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(DEFAULT_ICON);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);
  const [fieldError, setFieldError] = useState('');

  const isEditMode = Boolean(editingCategory);

  useEffect(() => {
    if (!editingCategory) {
      setName('');
      setSelectedIcon(DEFAULT_ICON);
      setSelectedColor(DEFAULT_COLOR);
      setFieldError('');
      return;
    }

    setName(editingCategory.name || '');
    setSelectedIcon(editingCategory.icon || DEFAULT_ICON);
    setSelectedColor(editingCategory.color || DEFAULT_COLOR);
    setFieldError('');
  }, [editingCategory]);

  const normalizedCategoryNames = useMemo(
    () =>
      categories
        .filter((category) => category.id !== editingCategory?.id)
        .map((category) => category.name?.trim().toLowerCase() || ''),
    [categories, editingCategory?.id]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setFieldError('Nome obrigatorio.');
      return;
    }

    if (normalizedCategoryNames.includes(trimmedName.toLowerCase())) {
      setFieldError('Ja existe uma categoria com este nome.');
      return;
    }

    setFieldError('');

    try {
      await onSave({
        name: trimmedName,
        icon: selectedIcon,
        color: selectedColor,
      });

      if (!isEditMode) {
        setName('');
        setSelectedIcon(DEFAULT_ICON);
        setSelectedColor(DEFAULT_COLOR);
      }
    } catch {
      // Handled by parent feedback area.
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="category-name" className="block text-sm text-gray-300 mb-1">
          Nome
        </label>
        <input
          id="category-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex.: Mercado"
          className="w-full rounded-md border border-gray-700 bg-[#0b0f19] px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
        {fieldError && <p className="text-xs text-red-300 mt-1">{fieldError}</p>}
      </div>

      <div>
        <p className="block text-sm text-gray-300 mb-2">Icone</p>
        <IconPicker icons={CATEGORY_ICONS} value={selectedIcon} onChange={setSelectedIcon} />
        <p className="text-xs text-gray-400 mt-2">Selecionado: {selectedIcon}</p>
      </div>

      <div>
        <p className="block text-sm text-gray-300 mb-2">Cor</p>
        <ColorPicker colors={CATEGORY_COLORS} value={selectedColor} onChange={setSelectedColor} />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400 disabled:opacity-60"
        >
          {isSubmitting
            ? 'Salvando...'
            : isEditMode
              ? 'Atualizar Categoria'
              : '+ Criar Categoria'}
        </button>

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
      </div>
    </form>
  );
}
