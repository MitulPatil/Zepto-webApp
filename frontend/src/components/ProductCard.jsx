import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart, isInCart, getItemQuantity, updateQuantity } = useCart();

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error('This product is out of stock');
      return;
    }
    addToCart(product, 1);
  };

  const handleIncrement = () => {
    const currentQty = getItemQuantity(product._id);
    if (currentQty >= product.stock) {
      toast.info('Maximum available quantity reached');
      return;
    }
    updateQuantity(product._id, currentQty + 1);
  };

  const handleDecrement = () => {
    const currentQty = getItemQuantity(product._id);
    updateQuantity(product._id, currentQty - 1);
  };

  const stockLabel =
    product.stock <= 0
      ? 'Out of stock'
      : product.stock <= (product.lowStockThreshold ?? 5)
      ? `Only ${product.stock} left`
      : 'In stock';

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        {product.discount > 0 && (
          <div className="absolute left-3 top-3 rounded-md bg-amber-500 px-2 py-1 text-xs font-bold text-white">
            {product.discount}% OFF
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 text-base font-bold text-slate-900">{product.name}</h3>
        <p className="mt-1 line-clamp-1 text-xs text-slate-500">{product.description}</p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-slate-900">Rs {product.price}</span>
            {product.discount > 0 && (
              <span className="text-xs text-slate-400 line-through">Rs {Math.round(product.price / (1 - product.discount / 100))}</span>
            )}
          </div>
          <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{product.unit}</span>
        </div>

        <p className={`mt-2 text-xs font-semibold ${product.stock <= 0 ? 'text-red-600' : product.stock <= (product.lowStockThreshold ?? 5) ? 'text-amber-600' : 'text-emerald-700'}`}>
          {stockLabel}
        </p>

        {!isInCart(product._id) ? (
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="mt-3 w-full rounded-lg bg-teal-700 py-2.5 text-sm font-bold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Add to Cart
          </button>
        ) : (
          <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-300 bg-slate-50">
            <button onClick={handleDecrement} className="px-4 py-2 text-lg font-bold text-slate-700 hover:bg-slate-100">-</button>
            <span className="font-bold text-slate-900">{getItemQuantity(product._id)}</span>
            <button
              onClick={handleIncrement}
              disabled={getItemQuantity(product._id) >= product.stock}
              className="px-4 py-2 text-lg font-bold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
