import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrement = () => {
    updateQuantity(item.product._id, item.quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(item.product._id, item.quantity - 1);
  };

  const handleRemove = () => {
    removeFromCart(item.product);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">
      {/* Product Image */}
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg"
      />

      {/* Product Details */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{item.name}</h3>
        <p className="text-zepto-orange font-bold">₹{item.price}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center border-2 border-zepto-orange rounded-lg">
          <button
            onClick={handleDecrement}
            className="px-3 py-1 text-zepto-orange font-bold hover:bg-orange-50 transition"
          >
            -
          </button>
          <span className="px-4 font-semibold text-gray-800">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrement}
            className="px-3 py-1 text-zepto-orange font-bold hover:bg-orange-50 transition"
          >
            +
          </button>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 transition"
          title="Remove item"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Item Total */}
      <div className="text-right">
        <p className="text-gray-500 text-sm">Total</p>
        <p className="text-xl font-bold text-zepto-orange">
          ₹{item.price * item.quantity}
        </p>
      </div>
    </div>
  );
};

export default CartItem;