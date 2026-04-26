export default function ColorPicker({ colors, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((color) => {
        const isActive = value === color;

        return (
          <button
            type="button"
            key={color}
            onClick={() => onChange(color)}
            className={`h-8 w-8 rounded-full border transition ${
              isActive ? 'border-white ring-2 ring-white/50' : 'border-gray-700'
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Selecionar cor ${color}`}
          />
        );
      })}
    </div>
  );
}
