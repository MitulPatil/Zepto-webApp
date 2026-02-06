import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      // Check if product already exists in cart
      const existingItem = prevItems.find(item => item.product === product._id);

      if (existingItem) {
        if (existingItem.quantity + quantity > product.stock) {
          toast.info(`Only ${product.stock} available in stock`);
          return prevItems;
        }
        // Update quantity
        toast.info(`Updated ${product.name} quantity`);
        return prevItems.map(item =>
          item.product === product._id
            ? { ...item, quantity: item.quantity + quantity, stock: product.stock }
            : item
        );
      } else {
        if (quantity > product.stock) {
          toast.info(`Only ${product.stock} available in stock`);
          return prevItems;
        }
        // Add new item
        toast.success(`${product.name} added to cart`);
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: quantity,
            stock: product.stock
          }
        ];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const item = cartItems.find((cartItem) => cartItem.product === productId);
    if (item?.stock !== undefined && quantity > item.stock) {
      toast.info(`Only ${item.stock} available in stock`);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const item = cartItems.find(item => item.product === productId);
    if (item) {
      toast.error(`${item.name} removed from cart`);
    }
    setCartItems(prevItems => prevItems.filter(item => item.product !== productId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    toast.info('Cart cleared');
  };

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get cart items count
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return cartItems.some(item => item.product === productId);
  };

  // Get item quantity
  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => item.product === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
