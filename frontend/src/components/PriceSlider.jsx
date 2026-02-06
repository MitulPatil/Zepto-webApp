const PriceSlider = ({ minPrice, maxPrice, onPriceChange }) => {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-600">Price Range</h3>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-slate-600">Min Price: Rs {minPrice}</label>
          <input
            type="range"
            min="0"
            max="500"
            value={minPrice}
            onChange={(e) => onPriceChange(Number(e.target.value), maxPrice)}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-700"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-600">Max Price: Rs {maxPrice}</label>
          <input
            type="range"
            min="0"
            max="500"
            value={maxPrice}
            onChange={(e) => onPriceChange(minPrice, Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-700"
          />
        </div>

        <div className="rounded-lg bg-slate-100 py-2 text-center text-sm font-semibold text-slate-700">
          Rs {minPrice} - Rs {maxPrice}
        </div>
      </div>
    </div>
  );
};

export default PriceSlider;
