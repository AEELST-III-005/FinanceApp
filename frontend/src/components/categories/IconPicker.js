export default function IconPicker({ icons, value, onChange }) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {icons.map((icon) => {
        const isActive = value === icon;

        return (
          <button
            type="button"
            key={icon}
            onClick={() => onChange(icon)}
            className={`h-10 rounded-lg border text-xl transition ${
              isActive
                ? 'border-blue-400 bg-blue-500/20'
                : 'border-gray-700 bg-[#0b0f19] hover:border-gray-500'
            }`}
            aria-label={`Selecionar icone ${icon}`}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}
