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
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🛒 Groceries Delivered in <span className="text-zepto-orange">10 Minutes</span>
            </h1>
            <p className="text-gray-600">Fresh products at your doorstep</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="max-w-2xl mx-auto relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search for products (e.g., milk, bread, vegetables)..."
                className="w-full px-6 py-4 pr-12 rounded-full border-2 border-gray-300 focus:outline-none focus:border-zepto-orange text-lg"
              />
              <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-2xl">
                🔍
              </span>
            </div>
          </div>

          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Price Filter */}
            <div className="lg:col-span-1">
              <PriceSlider
                minPrice={minPrice}
                maxPrice={maxPrice}
                onPriceChange={handlePriceChange}
              />

              {/* Clear Filters Button */}
              <button
                onClick={clearFilters}
                className="w-full mt-4 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Clear All Filters
              </button>

              {/* Active Filters Display */}
              {(searchTerm || selectedCategory !== 'All' || minPrice > 0 || maxPrice < 500) && (
                <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
                  <h4 className="font-semibold text-gray-800 mb-2">Active Filters:</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    {searchTerm && <p>🔍 Search: "{searchTerm}"</p>}
                    {selectedCategory !== 'All' && <p>📂 Category: {selectedCategory}</p>}
                    {(minPrice > 0 || maxPrice < 500) && (
                      <p>💰 Price: ₹{minPrice} - ₹{maxPrice}</p>
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
                  <div className="mb-4">
                    <p className="text-gray-600">
                      Showing <span className="font-semibold text-zepto-orange">{products.length}</span> products
                    </p>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                </>
              ) : (
                /* No Products Found */
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">😕</div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search term
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-zepto-orange text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
                  >
                    Clear Filters
                  </button>
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