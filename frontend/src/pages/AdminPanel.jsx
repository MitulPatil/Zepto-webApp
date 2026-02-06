import { useEffect, useMemo, useState } from 'react';
import { Header } from '../components';
import { toast } from 'react-toastify';
import {
  createAdminProduct,
  deleteAdminUser,
  deleteAdminProduct,
  getAdminOrders,
  getAdminProducts,
  getAdminStats,
  getAdminUsers,
  updateAdminOrderStatus,
  updateAdminProduct,
  updateAdminProductStock,
  updateAdminUser
} from '../services/adminApi';

const CATEGORIES = ['Dairy', 'Vegetables', 'Fruits', 'Grains', 'Snacks', 'Beverages', 'Bakery', 'Spices'];
const UNITS = ['kg', 'g', 'l', 'ml', 'piece', 'dozen', 'pack'];
const ORDER_STATUSES = ['Confirmed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'];

const emptyProductForm = {
  name: '',
  description: '',
  price: '',
  image: '',
  category: 'Dairy',
  stock: '',
  lowStockThreshold: 5,
  unit: 'piece',
  discount: 0,
  isAvailable: true
};

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState('create');
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [stockInputs, setStockInputs] = useState({});

  const statsCards = useMemo(() => {
    if (!stats) return [];
    return [
      { label: 'Products', value: stats.products },
      { label: 'Low Stock', value: stats.lowStockProducts },
      { label: 'Out of Stock', value: stats.outOfStockProducts },
      { label: 'Orders', value: stats.orders },
      { label: 'Users', value: stats.users }
    ];
  }, [stats]);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, productsRes, ordersRes, usersRes] = await Promise.all([
        getAdminStats(),
        getAdminProducts(),
        getAdminOrders(),
        getAdminUsers()
      ]);
      setStats(statsRes.data);
      setProducts(productsRes.data || []);
      setOrders(ordersRes.data || []);
      setUsers(usersRes.data || []);
    } catch (error) {
      toast.error(error?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const resetProductForm = () => {
    setProductForm(emptyProductForm);
    setFormMode('create');
    setEditingProductId(null);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        discount: Number(productForm.discount),
        lowStockThreshold: Number(productForm.lowStockThreshold)
      };

      if (formMode === 'create') {
        await createAdminProduct(payload);
        toast.success('Product created');
      } else {
        await updateAdminProduct(editingProductId, payload);
        toast.success('Product updated');
      }

      await loadAdminData();
      resetProductForm();
    } catch (error) {
      toast.error(error?.message || 'Failed to save product');
    }
  };

  const startEditProduct = (product) => {
    setFormMode('edit');
    setEditingProductId(product._id);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold ?? 5,
      unit: product.unit,
      discount: product.discount,
      isAvailable: product.isAvailable
    });
    setActiveTab('products');
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteAdminProduct(productId);
      toast.success('Product deleted');
      await loadAdminData();
    } catch (error) {
      toast.error(error?.message || 'Failed to delete product');
    }
  };

  const handleStockAdjust = async (productId, operation) => {
    const qty = Number(stockInputs[productId] || 0);
    if (!qty || qty < 0) return toast.error('Enter valid stock quantity');
    try {
      await updateAdminProductStock(productId, { operation, quantity: qty });
      toast.success('Stock updated');
      await loadAdminData();
      setStockInputs((prev) => ({ ...prev, [productId]: '' }));
    } catch (error) {
      toast.error(error?.message || 'Failed to update stock');
    }
  };

  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      await updateAdminOrderStatus(orderId, status);
      toast.success('Order status updated');
      await loadAdminData();
    } catch (error) {
      toast.error(error?.message || 'Failed to update status');
    }
  };

  const handleToggleAdmin = async (targetUser) => {
    try {
      await updateAdminUser(targetUser._id, { isAdmin: !targetUser.isAdmin });
      toast.success('User role updated');
      await loadAdminData();
    } catch (error) {
      toast.error(error?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user account?')) return;
    try {
      await deleteAdminUser(userId);
      toast.success('User deleted');
      await loadAdminData();
    } catch (error) {
      toast.error(error?.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen items-center justify-center">Loading admin panel...</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <h1 className="mb-6 text-3xl font-extrabold text-slate-900">Admin Panel</h1>

          <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
            {statsCards.map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-5 flex gap-2">
            {['products', 'orders', 'users'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize ${
                  activeTab === tab ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'products' && (
            <div className="space-y-5">
              <form onSubmit={handleProductSubmit} className="rounded-xl border border-slate-200 bg-white p-5">
                <h2 className="mb-4 text-lg font-bold text-slate-900">{formMode === 'create' ? 'Create Product' : 'Edit Product'}</h2>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none" placeholder="Name" value={productForm.name} onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))} required />
                  <input className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none" placeholder="Image URL" value={productForm.image} onChange={(e) => setProductForm((prev) => ({ ...prev, image: e.target.value }))} required />
                  <input className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none" type="number" min="0" placeholder="Price" value={productForm.price} onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))} required />
                  <input className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none" type="number" min="0" placeholder="Stock" value={productForm.stock} onChange={(e) => setProductForm((prev) => ({ ...prev, stock: e.target.value }))} required />
                  <input className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none" type="number" min="0" placeholder="Low Stock Threshold" value={productForm.lowStockThreshold} onChange={(e) => setProductForm((prev) => ({ ...prev, lowStockThreshold: e.target.value }))} />
                  <input className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none" type="number" min="0" max="100" placeholder="Discount" value={productForm.discount} onChange={(e) => setProductForm((prev) => ({ ...prev, discount: e.target.value }))} />
                  <select className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none" value={productForm.category} onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))}>
                    {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <select className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none" value={productForm.unit} onChange={(e) => setProductForm((prev) => ({ ...prev, unit: e.target.value }))}>
                    {UNITS.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                  </select>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={productForm.isAvailable} onChange={(e) => setProductForm((prev) => ({ ...prev, isAvailable: e.target.checked }))} />
                    Listed for customers
                  </label>
                  <textarea className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none md:col-span-2" rows="3" placeholder="Description" value={productForm.description} onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))} required />
                </div>
                <div className="mt-4 flex gap-2">
                  <button type="submit" className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800">{formMode === 'create' ? 'Create' : 'Update'}</button>
                  {formMode === 'edit' && <button type="button" onClick={resetProductForm} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>}
                </div>
              </form>

              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Price</th>
                      <th className="p-3 text-left">Stock</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Inventory</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-t border-slate-200">
                        <td className="p-3 font-semibold text-slate-900">{product.name}</td>
                        <td className="p-3">Rs {product.price}</td>
                        <td className="p-3">{product.stock}</td>
                        <td className="p-3 capitalize">{product.stockStatus?.replaceAll('_', ' ') || 'in stock'}</td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1.5">
                            <input className="w-20 rounded border border-slate-300 px-2 py-1" type="number" min="0" value={stockInputs[product._id] ?? ''} onChange={(e) => setStockInputs((prev) => ({ ...prev, [product._id]: e.target.value }))} />
                            <button type="button" onClick={() => handleStockAdjust(product._id, 'increase')} className="rounded bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">Add</button>
                            <button type="button" onClick={() => handleStockAdjust(product._id, 'decrease')} className="rounded bg-amber-600 px-2 py-1 text-xs font-semibold text-white">Reduce</button>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-3">
                            <button type="button" onClick={() => startEditProduct(product)} className="text-sm font-semibold text-teal-700 hover:underline">Edit</button>
                            <button type="button" onClick={() => handleDeleteProduct(product._id)} className="text-sm font-semibold text-red-600 hover:underline">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-2">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-3 text-left">Order ID</th>
                    <th className="p-3 text-left">User</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-t border-slate-200">
                      <td className="p-3 font-mono">{order.orderId}</td>
                      <td className="p-3">{order.user?.name} ({order.user?.phone})</td>
                      <td className="p-3">Rs {order.totalAmount}</td>
                      <td className="p-3">{order.orderStatus}</td>
                      <td className="p-3">
                        <select className="rounded border border-slate-300 px-2 py-1" value={order.orderStatus} onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}>
                          {ORDER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-2">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Phone</th>
                    <th className="p-3 text-left">Joined</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((adminUser) => (
                    <tr key={adminUser._id} className="border-t border-slate-200">
                      <td className="p-3">{adminUser.name}</td>
                      <td className="p-3">{adminUser.phone}</td>
                      <td className="p-3">{new Date(adminUser.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">{adminUser.isAdmin ? 'Admin' : 'Customer'}</td>
                      <td className="p-3">
                        <div className="flex gap-3">
                          <button type="button" onClick={() => handleToggleAdmin(adminUser)} className="text-sm font-semibold text-teal-700 hover:underline">
                            Make {adminUser.isAdmin ? 'Customer' : 'Admin'}
                          </button>
                          <button type="button" onClick={() => handleDeleteUser(adminUser._id)} className="text-sm font-semibold text-red-600 hover:underline">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
