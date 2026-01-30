import { useState, useEffect } from 'react';
import { Header, ProductCard, CategoryFilter, PriceSlider, Loading, ProductSkeleton } from '../components';
import { getProducts } from '../services';
import { toast } from 'react-toastify';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [categories] = useState(['Dairy', 'Vegetables', 'Fruits', 'Grains', 'Snacks', 'Beverages', 'Bakery', 'Spices']);

  // Fetch products on mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice, searchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      
      if (minPrice > 0) {
        params.minPrice = minPrice;
      }
      
      if (maxPrice < 500) {
        params.maxPrice = maxPrice;
      }

      const response = await getProducts(params);
      
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Handle price change
  const handlePriceChange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setMinPrice(0);
    setMaxPrice(500);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-emerald-50">
        {/* Hero Section with Gradient */}
        <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjctNS4zNzMtMTItMTItMTJzLTEyIDUuMzczLTEyIDEyIDUuMzczIDEyIDEyIDEyIDEyLTUuMzczIDEyLTEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
          
          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <span className="text-sm font-semibold">⚡ Lightning Fast Delivery</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
                Groceries in
                <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-coral-400 bg-clip-text text-transparent">
                  10 Minutes
                </span>
              </h1>
              <p className="text-xl text-teal-50 mb-8 max-w-2xl mx-auto">
                Fresh products, instant delivery. Your everyday essentials, just a tap away.
              </p>
              
              {/* Glass-morphism Search Bar */}
              <div className="max-w-2xl mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-300 to-teal-300 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="🔍 Search for milk, bread, vegetables..."
                    className="w-full px-8 py-5 pr-14 rounded-full bg-white/90 backdrop-blur-md border border-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-800 text-lg placeholder-gray-500 shadow-2xl"
                  />
                  <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">

          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Price Filter */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                <PriceSlider
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onPriceChange={handlePriceChange}
                />
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={clearFilters}
                className="w-full bg-gradient-to-r from-slate-50 to-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:from-slate-100 hover:to-gray-200 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-gray-200"
              >
                ✨ Clear All Filters
              </button>

              {/* Active Filters Display */}
              {(searchTerm || selectedCategory !== 'All' || minPrice > 0 || maxPrice < 500) && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-lg p-5 border border-emerald-200 animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                    <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Active Filters</h4>
                  </div>
                  <div className="space-y-2">
                    {searchTerm && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 bg-white/60 px-3 py-2 rounded-lg">
                        <span>🔍</span>
                        <span className="font-medium truncate">"{searchTerm}"</span>
                      </div>
                    )}
                    {selectedCategory !== 'All' && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 bg-white/60 px-3 py-2 rounded-lg">
                        <span>📂</span>
                        <span className="font-medium">{selectedCategory}</span>
                      </div>
                    )}
                    {(minPrice > 0 || maxPrice < 500) && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 bg-white/60 px-3 py-2 rounded-lg">
                        <span>💰</span>
                        <span className="font-medium">₹{minPrice} - ₹{maxPrice}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Loading State */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  {/* Products Count */}
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-8 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full"></div>
                      <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">Products</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {products.length} <span className="text-lg text-gray-500 font-normal">found</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product, index) => (
                      <div 
                        key={product._id} 
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* No Products Found */
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-6xl">😕</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-3">
                      No products found
                    </h3>
                    <p className="text-gray-600 mb-8 text-lg">
                      We couldn't find what you're looking for. Try adjusting your filters or search term.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      ✨ Clear All Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;