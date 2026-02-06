import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderApi';
import { createPayment, verifyPayment } from '../services/paymentApi';
import { getProfile, addAddress } from '../services/authApi';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phone: user?.phone || ''
  });

  const total = getCartTotal();
  const deliveryFee = total > 499 ? 0 : 35;
  const grandTotal = total + deliveryFee;

  useEffect(() => {
    if (user?.isAdmin) {
      toast.info('Admin users cannot place orders');
      navigate('/admin');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [navigate, user?.isAdmin]);

  useEffect(() => {
    fetchSavedAddresses();
  }, []);

  const fetchSavedAddresses = async () => {
    try {
      const response = await getProfile();
      if (response.success && response.data.addresses) {
        setSavedAddresses(response.data.addresses);
        const defaultAddr = response.data.addresses.find((addr) => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
        } else if (response.data.addresses.length > 0) {
          setSelectedAddressId(response.data.addresses[0]._id);
        } else {
          setShowNewAddressForm(true);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let deliveryAddress;

      if (selectedAddressId && !showNewAddressForm) {
        const selectedAddr = savedAddresses.find((addr) => addr._id === selectedAddressId);
        if (selectedAddr) {
          deliveryAddress = {
            name: selectedAddr.name,
            phone: selectedAddr.phone,
            addressLine: selectedAddr.addressLine,
            city: selectedAddr.city,
            state: selectedAddr.state,
            pincode: selectedAddr.pincode
          };
        }
      } else {
        deliveryAddress = {
          name: user?.name || 'Customer',
          phone: shippingInfo.phone,
          addressLine: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          pincode: shippingInfo.postalCode
        };

        if (saveAddress) {
          try {
            await addAddress(deliveryAddress);
            toast.success('Address saved');
          } catch (err) {
            console.error('Error saving address:', err);
          }
        }
      }

      const paymentResponse = await createPayment(grandTotal);
      if (!paymentResponse.success) throw new Error('Failed to create payment order');

      const { orderId, amount, keyId } = paymentResponse.data;
      const options = {
        key: keyId,
        amount: amount * 100,
        currency: 'INR',
        name: 'Zepto Market',
        description: 'Grocery Order Payment',
        order_id: orderId,
        handler: async (response) => {
          try {
            const verifyResponse = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.success && verifyResponse.verified) {
              const orderData = {
                items: cartItems.map((item) => ({
                  product: item.product,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  image: item.image
                })),
                deliveryAddress,
                totalAmount: grandTotal,
                paymentMethod: 'Razorpay',
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id
              };

              const orderResponse = await createOrder(orderData);
              if (orderResponse.success) {
                toast.success('Order placed successfully');
                clearCart();
                navigate(`/order-success/${orderResponse.data._id}`);
              }
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Order creation error:', error);
            toast.error('Payment succeeded, but order creation failed');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || 'Customer',
          contact: deliveryAddress?.phone || ''
        },
        theme: { color: '#0f766e' },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.info('Payment cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-extrabold text-slate-900">Checkout</h1>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-2/3">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="mb-4 text-lg font-bold text-slate-900">Delivery Address</h2>

              {savedAddresses.length > 0 && !showNewAddressForm && (
                <div className="space-y-3">
                  {savedAddresses.map((address) => (
                    <button
                      key={address._id}
                      type="button"
                      onClick={() => {
                        setSelectedAddressId(address._id);
                        setShowNewAddressForm(false);
                      }}
                      className={`w-full rounded-lg border p-3 text-left ${
                        selectedAddressId === address._id ? 'border-teal-700 bg-teal-50' : 'border-slate-300 bg-white'
                      }`}
                    >
                      <p className="font-bold text-slate-900">{address.name}</p>
                      <p className="text-sm text-slate-600">{address.phone}</p>
                      <p className="mt-1 text-sm text-slate-700">
                        {address.addressLine}, {address.city}, {address.state} - {address.pincode}
                      </p>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm(true)}
                    className="w-full rounded-lg border border-dashed border-slate-300 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Add New Address
                  </button>
                </div>
              )}

              {(showNewAddressForm || savedAddresses.length === 0) && (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo((prev) => ({ ...prev, address: e.target.value }))}
                    className="md:col-span-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none"
                    placeholder="House No, Street, Landmark"
                    required
                  />
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo((prev) => ({ ...prev, city: e.target.value }))}
                    className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none"
                    placeholder="City"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={(e) => setShippingInfo((prev) => ({ ...prev, state: e.target.value }))}
                    className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none"
                    placeholder="State"
                    required
                  />
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={(e) => setShippingInfo((prev) => ({ ...prev, postalCode: e.target.value }))}
                    className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none"
                    placeholder="Postal Code"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo((prev) => ({ ...prev, phone: e.target.value }))}
                    className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none"
                    placeholder="Phone Number"
                    maxLength={10}
                    required
                  />
                  <label className="md:col-span-2 mt-1 flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
                    Save this address for future orders
                  </label>
                </div>
              )}
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="mb-2 text-lg font-bold text-slate-900">Payment</h2>
              <p className="text-sm text-slate-600">Secure payment powered by Razorpay (UPI, cards, netbanking, wallets).</p>
            </section>
          </form>
        </div>

        <div className="lg:w-1/3">
          <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-bold text-slate-900">Order Summary</h3>
            <div className="mt-4 space-y-3">
              {cartItems.map((item) => (
                <div key={item.product} className="flex items-center justify-between text-sm">
                  <span className="max-w-[70%] truncate text-slate-700">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-semibold text-slate-900">Rs {item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>Rs {total}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? 'Free' : `Rs ${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900">
                <span>Total</span>
                <span>Rs {grandTotal}</span>
              </div>
            </div>
            <button
              type="submit"
              form="checkout-form"
              disabled={loading || (!selectedAddressId && !showNewAddressForm)}
              className="mt-5 w-full rounded-lg bg-teal-700 py-3 font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Processing...' : `Pay Rs ${grandTotal}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
