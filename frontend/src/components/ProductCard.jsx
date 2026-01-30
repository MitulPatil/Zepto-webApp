import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, isInCart, getItemQuantity, updateQuantity } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleIncrement = () => {
    const currentQty = getItemQuantity(product._id);
    updateQuantity(product._id, currentQty + 1);
  };

  const handleDecrement = () => {
    const currentQty = getItemQuantity(product._id);
    updateQuantity(product._id, currentQty - 1);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
      {/* Product Image */}
      <div className="relative h-52 bg-gradient-to-br from-gray-50 to-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            🔥 {product.discount}% OFF
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 text-lg group-hover:text-emerald-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-1">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              ₹{product.price}
            </span>
            {product.discount > 0 && (
              <span className="text-xs text-gray-400 line-through">
                ₹{Math.round(product.price / (1 - product.discount / 100))}
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {product.unit}
          </span>
        </div>

        {/* Add to Cart Button */}
        {!isInCart(product._id) ? (
          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center justify-between bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border-2 border-purple-300 overflow-hidden shadow-md">
            <button
              onClick={handleDecrement}
              className="px-5 py-3 text-purple-700 font-bold hover:bg-purple-200 transition-colors text-xl"
            >
              −
            </button>
            <span className="font-bold text-gray-800 text-lg px-4">
              {getItemQuantity(product._id)}
            </span>
            <button
              onClick={handleIncrement}
              className="px-5 py-3 text-purple-700 font-bold hover:bg-purple-200 transition-colors text-xl"
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