import { useState, useEffect } from 'react';
import { CartContext } from './cart-context';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    const existingItem = cartItems.find(
      (cartItem) =>
        cartItem.productId === item.productId &&
        cartItem.colorId === item.colorId &&
        cartItem.sizeId === item.sizeId
    );

    if (!existingItem) {
      setCartItems([...cartItems, item]);
      return true;
    }
    return false;
  };

  const removeFromCart = (productId, colorId, sizeId) => {
    setCartItems(
      cartItems.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.colorId === colorId &&
            item.sizeId === sizeId
          )
      )
    );
  };

  const getCartItemsCount = () => {
    return cartItems.length;
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    getCartItemsCount,
  };

  return <CartContext value={value}>{children}</CartContext>;
};
