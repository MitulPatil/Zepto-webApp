const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const allCategories = ['All', ...categories];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              selectedCategory === category
                ? 'bg-zepto-orange text-white'
                : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-300'
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