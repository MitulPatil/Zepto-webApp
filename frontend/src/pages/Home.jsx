import { useState, useEffect } from 'react';
import { Header, ProductCard, CategoryFilter, PriceSlider, ProductSkeleton } from '../components';
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

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice, searchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (minPrice > 0) params.minPrice = minPrice;
      if (maxPrice < 500) params.maxPrice = maxPrice;

      const response = await getProducts(params);
      if (response.success) setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setMinPrice(0);
    setMaxPrice(500);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen">
        <section className="border-b border-slate-200 bg-white">
          <div className="container mx-auto px-4 py-10 md:py-14">
            <div className="max-w-3xl">
              <p className="mb-3 inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700">
                Grocery Delivery
              </p>
              <h1 className="text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
                Fresh groceries delivered in minutes
              </h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                Shop daily essentials, produce, dairy and snacks with fast local delivery.
              </p>
              <div className="mt-6 relative max-w-2xl">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 pr-10 text-slate-800 focus:border-teal-700 focus:bg-white focus:outline-none"
                />
                <svg className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <CategoryFilter categories={categories} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <aside className="lg:col-span-1">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <PriceSlider minPrice={minPrice} maxPrice={maxPrice} onPriceChange={(min, max) => { setMinPrice(min); setMaxPrice(max); }} />
                <button
                  onClick={clearFilters}
                  className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Clear Filters
                </button>
              </div>
            </aside>

            <main className="lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Products</h2>
                <span className="text-sm text-slate-500">{products.length} items</span>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => <ProductSkeleton key={i} />)}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => <ProductCard key={product._id} product={product} />)}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
                  <h3 className="text-xl font-bold text-slate-900">No products found</h3>
                  <p className="mt-2 text-slate-600">Try adjusting your search or filters.</p>
                  <button
                    onClick={clearFilters}
                    className="mt-5 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
