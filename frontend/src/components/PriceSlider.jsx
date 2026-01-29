const PriceSlider = ({ minPrice, maxPrice, onPriceChange }) => {
  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Price Range</h3>
      <div className="space-y-4">
        {/* Min Price */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Min Price: ₹{minPrice}
          </label>
          <input
            type="range"
            min="0"
            max="500"
            value={minPrice}
            onChange={(e) => onPriceChange(Number(e.target.value), maxPrice)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-900"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Max Price: ₹{maxPrice}
          </label>
          <input
            type="range"
            min="0"
            max="500"
            value={maxPrice}
            onChange={(e) => onPriceChange(minPrice, Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-900"
          />
        </div>

        {/* Display Range */}
        <div className="text-center text-sm text-gray-600">
          ₹{minPrice} - ₹{maxPrice}
        </div>
      </div>
    </div>
  );
};

export default PriceSlider;