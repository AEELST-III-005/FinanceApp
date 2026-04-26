export default function CategoriesPage() {
  return (
    <section>
      <header className="mb-8">
        <h2 className="text-2xl font-bold mb-1">Categorias</h2>
        <p className="text-gray-500 text-sm">5 categoria(s) cadastrada(s)</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#121827] border border-gray-800 rounded-xl p-6 min-h-[400px]">
          {/* Formulario de categoria */}
        </div>

        <div className="bg-[#121827] border border-gray-800 rounded-xl p-6 min-h-[400px]">
          {/* Lista de categorias */}
        </div>
      </div>
    </section>
  );
}
