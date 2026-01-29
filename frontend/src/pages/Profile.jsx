import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrders } from '../services/orderApi';
import { updateProfile, changePassword, addAddress, updateAddress, deleteAddress, getProfile } from '../services/authApi';
import { toast } from 'react-toastify';
import { Header } from '../components';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  
  // Profile edit state
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    phone: ''
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Address state
  const [addressMode, setAddressMode] = useState(null); // 'add', 'edit', null
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressData, setAddressData] = useState({
    name: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  useEffect(() => {
    fetchUserData();
    fetchOrders();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await getProfile();
      setUserData(response.data);
      setProfileData({
        name: response.data.name,
        phone: response.data.phone
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfile(profileData.name, profileData.phone);
      if (response.success) {
        updateUser(response.data);
        setEditMode(false);
        toast.success('Profile updated successfully');
        fetchUserData();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (response.success) {
        toast.success('Password changed successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await addAddress(addressData);
      if (response.success) {
        toast.success('Address added successfully');
        setAddressMode(null);
        resetAddressForm();
        fetchUserData();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to add address');
    }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await updateAddress(editingAddressId, addressData);
      if (response.success) {
        toast.success('Address updated successfully');
        setAddressMode(null);
        setEditingAddressId(null);
        resetAddressForm();
        fetchUserData();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const response = await deleteAddress(addressId);
        if (response.success) {
          toast.success('Address deleted successfully');
          fetchUserData();
        }
      } catch (error) {
        toast.error(error.message || 'Failed to delete address');
      }
    }
  };

  const startEditAddress = (address) => {
    setAddressMode('edit');
    setEditingAddressId(address._id);
    setAddressData({
      name: address.name,
      phone: address.phone,
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault
    });
  };

  const resetAddressForm = () => {
    setAddressData({
      name: userData?.name || '',
      phone: userData?.phone || '',
      addressLine: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    });
  };

  if (!user || !userData) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Dashboard</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-purple-900 to-purple-800 p-6 text-center text-white">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 text-3xl font-bold border-4 border-white/30">
                  {userData.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold">{userData.name}</h2>
                <p className="text-purple-200 text-sm">{userData.phone}</p>
              </div>
              
              <div className="p-4">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-xl mb-2 font-semibold transition-all ${
                    activeTab === 'profile' 
                      ? 'bg-purple-100 text-purple-900' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  👤 Profile Info
                </button>
                
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full text-left px-4 py-3 rounded-xl mb-2 font-semibold transition-all ${
                    activeTab === 'addresses' 
                      ? 'bg-purple-100 text-purple-900' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📍 My Addresses
                </button>
                
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-3 rounded-xl mb-2 font-semibold transition-all ${
                    activeTab === 'orders' 
                      ? 'bg-purple-100 text-purple-900' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📦 My Orders
                </button>
                
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full text-left px-4 py-3 rounded-xl mb-2 font-semibold transition-all ${
                    activeTab === 'password' 
                      ? 'bg-purple-100 text-purple-900' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  🔒 Change Password
                </button>

                <button
                  onClick={logout}
                  className="w-full mt-4 border-2 border-red-100 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            
            {/* Profile Info Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Profile Information</h3>
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-purple-900 text-white rounded-lg font-semibold hover:bg-purple-800 transition"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {editMode ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        maxLength={10}
                        required
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 bg-purple-900 text-white font-bold py-3 rounded-xl hover:bg-purple-800 transition"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          setProfileData({
                            name: userData.name,
                            phone: userData.phone
                          });
                        }}
                        className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-900">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-semibold uppercase">Full Name</div>
                        <div className="text-lg font-bold text-gray-900">{userData.name}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-900">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-semibold uppercase">Phone Number</div>
                        <div className="text-lg font-bold text-gray-900">{userData.phone}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-900">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-semibold uppercase">Member Since</div>
                        <div className="text-lg font-bold text-gray-900">
                          {new Date(userData.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">My Addresses</h3>
                  {!addressMode && (
                    <button
                      onClick={() => {
                        setAddressMode('add');
                        resetAddressForm();
                      }}
                      className="px-4 py-2 bg-purple-900 text-white rounded-lg font-semibold hover:bg-purple-800 transition"
                    >
                      + Add New Address
                    </button>
                  )}
                </div>

                {addressMode && (
                  <form 
                    onSubmit={addressMode === 'add' ? handleAddAddress : handleUpdateAddress}
                    className="mb-8 p-6 bg-purple-50 rounded-xl border-2 border-purple-100"
                  >
                    <h4 className="text-lg font-bold text-gray-800 mb-4">
                      {addressMode === 'add' ? 'Add New Address' : 'Edit Address'}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input
                          type="text"
                          value={addressData.name}
                          onChange={(e) => setAddressData({ ...addressData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                        <input
                          type="tel"
                          value={addressData.phone}
                          onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          maxLength={10}
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                        <input
                          type="text"
                          value={addressData.addressLine}
                          onChange={(e) => setAddressData({ ...addressData, addressLine: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="House No, Street, Landmark"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">City</label>
                        <input
                          type="text"
                          value={addressData.city}
                          onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">State</label>
                        <input
                          type="text"
                          value={addressData.state}
                          onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Pincode</label>
                        <input
                          type="text"
                          value={addressData.pincode}
                          onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isDefault"
                          checked={addressData.isDefault}
                          onChange={(e) => setAddressData({ ...addressData, isDefault: e.target.checked })}
                          className="w-5 h-5 text-purple-900 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="isDefault" className="ml-3 text-gray-700 font-semibold">
                          Set as default address
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <button
                        type="submit"
                        className="flex-1 bg-purple-900 text-white font-bold py-3 rounded-xl hover:bg-purple-800 transition"
                      >
                        {addressMode === 'add' ? 'Add Address' : 'Update Address'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAddressMode(null);
                          setEditingAddressId(null);
                          resetAddressForm();
                        }}
                        className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-4">
                  {userData.addresses && userData.addresses.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-4">📍</div>
                      <p className="font-semibold">No addresses saved yet</p>
                      <p className="text-sm">Add your first address to get started</p>
                    </div>
                  ) : (
                    userData.addresses?.map((address) => (
                      <div
                        key={address._id}
                        className="p-6 border-2 border-gray-100 rounded-xl hover:border-purple-200 transition relative"
                      >
                        {address.isDefault && (
                          <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                            DEFAULT
                          </span>
                        )}
                        
                        <div className="mb-4">
                          <h4 className="font-bold text-gray-900 text-lg">{address.name}</h4>
                          <p className="text-gray-600">{address.phone}</p>
                        </div>
                        
                        <p className="text-gray-700 mb-2">{address.addressLine}</p>
                        <p className="text-gray-600">
                          {address.city}, {address.state} - {address.pincode}
                        </p>

                        <div className="flex gap-4 mt-4">
                          <button
                            onClick={() => startEditAddress(address)}
                            className="text-purple-900 font-semibold hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address._id)}
                            className="text-red-600 font-semibold hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Change Password Tab */}
            {activeTab === 'password' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h3>

                <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-purple-900 text-white font-bold py-3 rounded-xl hover:bg-purple-800 transition"
                  >
                    Change Password
                  </button>
                </form>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h3>

                {loading ? (
                  <div className="text-center py-12 text-gray-500">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🛍️</div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h4>
                    <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                    <button
                      onClick={() => navigate('/')}
                      className="px-6 py-3 bg-purple-900 text-white font-bold rounded-xl hover:bg-purple-800 transition"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order._id} className="border-2 border-gray-100 rounded-xl overflow-hidden hover:border-purple-200 transition">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <div className="text-xs text-gray-500 font-bold uppercase">Order ID</div>
                            <div className="font-mono text-sm font-bold text-gray-900">{order.orderId || order._id.slice(-8)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-bold uppercase">Date</div>
                            <div className="font-semibold text-gray-900">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-bold uppercase">Total</div>
                            <div className="font-bold text-purple-900">₹{order.totalAmount}</div>
                          </div>
                          <div>
                            <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                              order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                              order.orderStatus === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="space-y-4">
                            {order.items?.map((item, index) => (
                              <div key={index} className="flex items-center gap-4">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 object-contain bg-gray-50 rounded-lg border border-gray-100"
                                />
                                <div className="flex-1">
                                  <h5 className="font-semibold text-gray-800">{item.name}</h5>
                                  <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                                </div>
                                <div className="font-bold text-gray-700">
                                  ₹{item.price * item.quantity}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;