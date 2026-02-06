const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const allCategories = ['All', ...categories];

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-600">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
              selectedCategory === category
                ? 'border-teal-700 bg-teal-700 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
