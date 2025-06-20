import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ScrollRestoration } from 'react-router-dom';
import EmptyCart from './emptyCart';
import CartItems from './cartItems';
import { useCart } from '../../context/userCartContext';

const Cart = () => {
  const products = useSelector((state) => state.amazon.products);
  const { userCart } = useCart();

  // New state for Open Box option
  const [openBoxDelivery, setOpenBoxDelivery] = useState(false);

  const handleToggle = () => {
    setOpenBoxDelivery((prev) => !prev);
    // TODO: propagate this choice to your checkout logic/context
  };

  return (
    <div className="gap-5 w-full h-full bg-gray-200 p-6">
      <ScrollRestoration />

      {/* Open Box Delivery opt-in */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-medium">Open Box Delivery</h3>
          <p className="text-sm text-gray-600">
            Receive your items in an open-box condition at a discounted rate. Eligible items only.
          </p>
        </div>
        <label className="mt-3 sm:mt-0 flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={openBoxDelivery}
            onChange={handleToggle}
            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="ml-2 font-semibold">
            {openBoxDelivery ? 'Opted In' : 'Opt In'}
          </span>
        </label>
      </div>

      {/* Cart content */}
      {products.length > 0 || userCart.length > 0 ? (
        <CartItems openBox={openBoxDelivery} />
      ) : (
        <EmptyCart />
      )}
    </div>
  );
};

export default Cart;
