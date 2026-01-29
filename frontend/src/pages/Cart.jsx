import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { LoginModal, RegisterModal } from '../components';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const total = getCartTotal();
  const deliveryFee = total > 499 ? 0 : 35;
  const grandTotal = total + deliveryFee;

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      toast.info('Please login to continue');
      setShowLoginModal(true);
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <div className="w-48 h-48 bg-purple-50 rounded-full flex items-center justify-center mb-6">
          <span className="text-8xl">🛒</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-lg">Looks like you haven't added anything yet.</p>
        <Link
          to="/"
          className="bg-purple-900 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-800 transition-all shadow-lg hover:shadow-xl"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Cart ({cartItems.length} items)</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="lg:w-2/3 space-y-4">
          {cartItems.map((item) => (
            <div key={item.product} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
              <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg p-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg mb-1">{item.name}</h3>
                <p className="text-gray-500 text-sm mb-2">{item.unit}</p>
                <div className="font-bold text-lg text-purple-900">₹{item.price}</div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center bg-purple-50 rounded-lg overflow-hidden border border-purple-100">
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-purple-900 font-bold hover:bg-purple-200 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-purple-900 text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-purple-900 font-bold hover:bg-purple-200 transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.product)}
                  className="text-red-500 text-sm font-medium hover:text-red-700 hover:underline transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bill Details */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 sticky top-24">
            <h3 className="font-bold text-xl mb-6 text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Bill Details
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Item Total</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span className="text-green-600 font-bold">FREE</span>
                ) : (
                  <span>₹{deliveryFee}</span>
                )}
              </div>
              <div className="border-t border-dashed border-gray-300 pt-4 flex justify-between font-bold text-lg text-gray-900">
                <span>Grand Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            {deliveryFee > 0 && (
              <div className="bg-yellow-50 text-yellow-800 text-xs p-3 rounded-lg mb-6 border border-yellow-100 flex items-center gap-2">
                <span className="text-lg">💡</span>
                Add items worth ₹{500 - total} more for free delivery
              </div>
            )}

            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-purple-900 to-purple-800 text-white font-bold py-4 rounded-xl hover:from-purple-800 hover:to-purple-700 transition-all shadow-md transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => setShowRegisterModal(true)}
      />
      <RegisterModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => setShowLoginModal(true)}
      />
    </div>
  );
};

export default Cart;