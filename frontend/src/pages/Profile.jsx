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

  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [addressMode, setAddressMode] = useState(null);
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
      setProfileData({ name: response.data.name, phone: response.data.phone });
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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfile(profileData.name, profileData.phone);
      if (response.success) {
        updateUser(response.data);
        setEditMode(false);
        toast.success('Profile updated');
        fetchUserData();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) return toast.error('Passwords do not match');
    if (passwordData.newPassword.length < 6) return toast.error('Password must be at least 6 characters');

    try {
      const response = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (response.success) {
        toast.success('Password changed');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
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
        toast.success('Address added');
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
        toast.success('Address updated');
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
    if (!window.confirm('Delete this address?')) return;
    try {
      const response = await deleteAddress(addressId);
      if (response.success) {
        toast.success('Address deleted');
        fetchUserData();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete address');
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

  if (!user || !userData) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen items-center justify-center">Loading profile...</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-extrabold text-slate-900">My Account</h1>

        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="lg:w-1/4">
            <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-4 rounded-lg bg-slate-900 p-4 text-center text-white">
                <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-xl font-bold">
                  {userData.name.charAt(0).toUpperCase()}
                </div>
                <p className="font-bold">{userData.name}</p>
                <p className="text-sm text-slate-300">{userData.phone}</p>
              </div>

              {['profile', 'addresses', 'orders', 'password'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`mb-2 w-full rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                    activeTab === tab ? 'bg-teal-700 text-white' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {tab === 'profile' && 'Profile'}
                  {tab === 'addresses' && 'Addresses'}
                  {tab === 'orders' && 'Orders'}
                  {tab === 'password' && 'Change Password'}
                </button>
              ))}

              <button onClick={logout} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Logout
              </button>
            </div>
          </aside>

          <main className="lg:w-3/4">
            {activeTab === 'profile' && (
              <section className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Profile Details</h2>
                  {!editMode && (
                    <button onClick={() => setEditMode(true)} className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800">
                      Edit
                    </button>
                  )}
                </div>

                {editMode ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-3">
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none"
                      required
                    />
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none"
                      required
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800">Save</button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          setProfileData({ name: userData.name, phone: userData.phone });
                        }}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-2 text-sm text-slate-700">
                    <p><span className="font-semibold text-slate-900">Name:</span> {userData.name}</p>
                    <p><span className="font-semibold text-slate-900">Phone:</span> {userData.phone}</p>
                    <p><span className="font-semibold text-slate-900">Joined:</span> {new Date(userData.createdAt).toLocaleDateString()}</p>
                  </div>
                )}
              </section>
            )}

            {activeTab === 'addresses' && (
              <section className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Saved Addresses</h2>
                  {!addressMode && (
                    <button
                      onClick={() => {
                        setAddressMode('add');
                        resetAddressForm();
                      }}
                      className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
                    >
                      Add Address
                    </button>
                  )}
                </div>

                {addressMode && (
                  <form onSubmit={addressMode === 'add' ? handleAddAddress : handleUpdateAddress} className="mb-5 grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
                    <input value={addressData.name} onChange={(e) => setAddressData({ ...addressData, name: e.target.value })} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 focus:border-teal-700 focus:outline-none" placeholder="Name" required />
                    <input value={addressData.phone} onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 focus:border-teal-700 focus:outline-none" placeholder="Phone" required />
                    <input value={addressData.addressLine} onChange={(e) => setAddressData({ ...addressData, addressLine: e.target.value })} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 focus:border-teal-700 focus:outline-none md:col-span-2" placeholder="Address Line" required />
                    <input value={addressData.city} onChange={(e) => setAddressData({ ...addressData, city: e.target.value })} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 focus:border-teal-700 focus:outline-none" placeholder="City" required />
                    <input value={addressData.state} onChange={(e) => setAddressData({ ...addressData, state: e.target.value })} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 focus:border-teal-700 focus:outline-none" placeholder="State" required />
                    <input value={addressData.pincode} onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 focus:border-teal-700 focus:outline-none" placeholder="Pincode" required />
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" checked={addressData.isDefault} onChange={(e) => setAddressData({ ...addressData, isDefault: e.target.checked })} />
                      Set as default
                    </label>
                    <div className="md:col-span-2 flex gap-2">
                      <button type="submit" className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800">
                        {addressMode === 'add' ? 'Save Address' : 'Update Address'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAddressMode(null);
                          setEditingAddressId(null);
                        }}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {userData.addresses?.length ? (
                    userData.addresses.map((address) => (
                      <div key={address._id} className="rounded-lg border border-slate-200 p-4">
                        <p className="font-bold text-slate-900">
                          {address.name} {address.isDefault && <span className="ml-2 rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Default</span>}
                        </p>
                        <p className="text-sm text-slate-600">{address.phone}</p>
                        <p className="mt-1 text-sm text-slate-700">{address.addressLine}</p>
                        <p className="text-sm text-slate-700">{address.city}, {address.state} - {address.pincode}</p>
                        <div className="mt-2 flex gap-3 text-sm font-semibold">
                          <button onClick={() => startEditAddress(address)} className="text-teal-700 hover:underline">Edit</button>
                          <button onClick={() => handleDeleteAddress(address._id)} className="text-red-600 hover:underline">Delete</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-600">No addresses added yet.</p>
                  )}
                </div>
              </section>
            )}

            {activeTab === 'password' && (
              <section className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="mb-4 text-xl font-bold text-slate-900">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="max-w-md space-y-3">
                  <input type="password" placeholder="Current Password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none" required />
                  <input type="password" placeholder="New Password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none" required minLength={6} />
                  <input type="password" placeholder="Confirm New Password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 focus:border-teal-700 focus:bg-white focus:outline-none" required />
                  <button type="submit" className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800">Update Password</button>
                </form>
              </section>
            )}

            {activeTab === 'orders' && (
              <section className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="mb-4 text-xl font-bold text-slate-900">My Orders</h2>
                {loading ? (
                  <p className="text-sm text-slate-600">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
                    <p className="text-sm text-slate-600">No orders yet.</p>
                    <button onClick={() => navigate('/')} className="mt-3 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800">Start Shopping</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="rounded-lg border border-slate-200">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                          <span className="font-mono font-semibold text-slate-900">{order.orderId || order._id.slice(-8)}</span>
                          <span className="text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</span>
                          <span className="font-semibold text-slate-900">Rs {order.totalAmount}</span>
                          <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">{order.orderStatus}</span>
                        </div>
                        <div className="space-y-2 p-4">
                          {order.items?.map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="text-slate-700">{item.name} x {item.quantity}</span>
                              <span className="font-semibold text-slate-900">Rs {item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Profile;
