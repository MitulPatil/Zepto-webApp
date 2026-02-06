import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import { useAuth } from './context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const BuyerOnlyRoute = ({ children }) => {
  const { user } = useAuth();

  if (user?.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route
                path="/"
                element={(
                  <BuyerOnlyRoute>
                    <Home />
                  </BuyerOnlyRoute>
                )}
              />
              <Route
                path="/cart"
                element={(
                  <BuyerOnlyRoute>
                    <Cart />
                  </BuyerOnlyRoute>
                )}
              />
              <Route
                path="/checkout"
                element={(
                  <BuyerOnlyRoute>
                    <Checkout />
                  </BuyerOnlyRoute>
                )}
              />
              <Route
                path="/order-success/:orderId"
                element={(
                  <BuyerOnlyRoute>
                    <OrderSuccess />
                  </BuyerOnlyRoute>
                )}
              />
              <Route
                path="/profile"
                element={(
                  <BuyerOnlyRoute>
                    <Profile />
                  </BuyerOnlyRoute>
                )}
              />
              <Route
                path="/admin"
                element={(
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                )}
              />
              {/* Redirect old login/register routes to home */}
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/register" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            {/* Toast notifications */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              closeOnClick
              pauseOnHover
              draggable
            />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
