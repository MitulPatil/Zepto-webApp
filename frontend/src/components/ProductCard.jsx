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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            {product.discount}% OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2 line-clamp-1">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xl font-bold text-zepto-orange">
              ₹{product.price}
            </span>
            {product.discount > 0 && (
              <span className="text-xs text-gray-400 line-through ml-2">
                ₹{Math.round(product.price / (1 - product.discount / 100))}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {product.unit}
          </span>
        </div>

        {/* Add to Cart Button */}
        {!isInCart(product._id) ? (
          <button
            onClick={handleAddToCart}
            className="w-full bg-zepto-orange text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center justify-between border-2 border-zepto-orange rounded-lg">
            <button
              onClick={handleDecrement}
              className="px-4 py-2 text-zepto-orange font-bold hover:bg-orange-50 transition"
            >
              -
            </button>
            <span className="font-semibold text-gray-800">
              {getItemQuantity(product._id)}
            </span>
            <button
              onClick={handleIncrement}
              className="px-4 py-2 text-zepto-orange font-bold hover:bg-orange-50 transition"
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