import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderApi';
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
    fetchSavedAddresses();
  }, []);

  const fetchSavedAddresses = async () => {
    try {
      const response = await getProfile();
      if (response.success && response.data.addresses) {
        setSavedAddresses(response.data.addresses);
        
        // Auto-select default address or first address
        const defaultAddr = response.data.addresses.find(addr => addr.isDefault);
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

  const handleChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    setShowNewAddressForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let deliveryAddress;

      // If using saved address
      if (selectedAddressId && !showNewAddressForm) {
        const selectedAddr = savedAddresses.find(addr => addr._id === selectedAddressId);
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
        // Using new address
        deliveryAddress = {
          name: user?.name || 'Customer',
          phone: shippingInfo.phone,
          addressLine: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          pincode: shippingInfo.postalCode
        };

        // Save address if checkbox is checked
        if (saveAddress) {
          try {
            await addAddress(deliveryAddress);
            toast.success('Address saved for future orders');
          } catch (err) {
            console.error('Error saving address:', err);
          }
        }
      }

      const orderData = {
        items: cartItems.map(item => ({
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        deliveryAddress,
        totalAmount: grandTotal,
        paymentMethod: 'Razorpay'
      };

      const response = await createOrder(orderData);
      
      if (response.success) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate(`/order-success/${response.data._id}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Shipping Form */}
        <div className="lg:w-2/3">
          <form id="checkout-form" onSubmit={handleSubmit}>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                <span className="bg-purple-100 text-purple-900 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Shipping Address
              </h2>
            
            {/* Saved Addresses */}
            {savedAddresses.length > 0 && !showNewAddressForm && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-3">Select Saved Address</label>
                <div className="space-y-3">
                  {savedAddresses.map((address) => (
                    <div
                      key={address._id}
                      onClick={() => handleAddressSelect(address._id)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedAddressId === address._id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            checked={selectedAddressId === address._id}
                            onChange={() => handleAddressSelect(address._id)}
                            className="mt-1"
                          />
                          <div>
                            <div className="font-bold text-gray-900 flex items-center gap-2">
                              {address.name}
                              {address.isDefault && (
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                  DEFAULT
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{address.phone}</p>
                            <p className="text-sm text-gray-700 mt-1">{address.addressLine}</p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(true)}
                  className="mt-4 w-full py-3 border-2 border-dashed border-purple-300 text-purple-900 font-semibold rounded-xl hover:bg-purple-50 transition-all"
                >
                  + Add New Address
                </button>
              </div>
            )}

            {/* New Address Form */}
            {(showNewAddressForm || savedAddresses.length === 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedAddresses.length > 0 && (
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="text-purple-900 font-semibold text-sm hover:underline"
                    >
                      ← Back to saved addresses
                    </button>
                  </div>
                )}
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="House No, Street, Landmark"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="City"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="State"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">Postal Code</label>
                  <input
                    type="number"
                    name="postalCode"
                  value={shippingInfo.postalCode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="PIN Code"
                  required
                />
              </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Phone Number"
                    maxLength={10}
                    required
                  />
                </div>

                {/* Save Address Checkbox */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="w-5 h-5 text-purple-900 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-700 font-semibold">
                      💾 Save this address for future orders
                    </span>
                  </label>
                </div>
              </div>
              )}
            </div>
          </form>

          {/* Payment Method - Mock */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
              <span className="bg-purple-100 text-purple-900 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Payment Method
            </h2>
            <div className="p-4 border border-purple-200 bg-purple-50 rounded-xl flex items-center gap-3">
              <input type="radio" checked readOnly className="w-5 h-5 text-purple-900 accent-purple-900" />
              <span className="font-semibold text-gray-800">Cash on Delivery / UPI</span>
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-1">Simple payment for demo purposes.</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 sticky top-24">
            <h3 className="font-bold text-xl mb-6 text-gray-800">Order Summary</h3>
            
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={item.product} className="flex gap-3 text-sm">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-gray-50 rounded" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-600">{item.name}</div>
                    <div className="text-gray-400 text-xs">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-bold text-gray-800">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                {deliveryFee === 0 ? <span className="text-green-600">Free</span> : <span>₹{deliveryFee}</span>}
              </div>
              <div className="flex justify-between font-bold text-xl text-gray-900 pt-2 border-t border-gray-100 mt-2">
                <span>Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={loading || (!selectedAddressId && !showNewAddressForm)}
              className="w-full bg-purple-900 text-white font-bold py-4 rounded-xl hover:bg-purple-800 transition-all shadow-md transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Pay ₹${grandTotal}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;