import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { LoginModal, RegisterModal } from '../components';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { isAuthenticated, user } = useAuth();
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
    } else if (user?.isAdmin) {
      toast.info('Admin users cannot place orders');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900">Your cart is empty</h2>
        <p className="mt-2 text-slate-600">Add products to start checkout.</p>
        <Link to="/" className="mt-6 rounded-lg bg-teal-700 px-6 py-3 font-semibold text-white hover:bg-teal-800">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-extrabold text-slate-900">Cart</h1>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="space-y-3 lg:w-2/3">
          {cartItems.map((item) => (
            <div key={item.product} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
              <div className="h-20 w-20 overflow-hidden rounded-lg bg-slate-100">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{item.name}</h3>
                <p className="text-sm text-slate-500">Rs {item.price}</p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50">
                  <button onClick={() => updateQuantity(item.product, item.quantity - 1)} className="px-3 py-1 text-lg font-bold text-slate-700">-</button>
                  <span className="w-8 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product, item.quantity + 1)} className="px-3 py-1 text-lg font-bold text-slate-700">+</button>
                </div>
                <button onClick={() => removeFromCart(item.product)} className="text-xs font-semibold text-red-600 hover:underline">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:w-1/3">
          <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-bold text-slate-900">Order Summary</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>Rs {total}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? 'Free' : `Rs ${deliveryFee}`}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
                <span>Total</span>
                <span>Rs {grandTotal}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-5 w-full rounded-lg bg-teal-700 py-3 font-semibold text-white hover:bg-teal-800"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

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
