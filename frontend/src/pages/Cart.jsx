import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadCart, saveCart } from '../utils/cartStorage';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => loadCart());

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const updateQuantity = (itemName, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemName);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.name === itemName
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (itemName) => {
    setCart(prevCart => prevCart.filter(item => item.name !== itemName));
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + (price * item.quantity);
    }, 0);
  };



  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <svg className="w-24 h-24 mx-auto text-orange-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-orange-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. Start exploring our delicious menu!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/menu')}
              className="bg-orange-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-300"
            >
              Browse Menu
            </button>
            <button
              onClick={() => navigate('/')}
              className="border-2 border-orange-900 text-orange-900 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-900 mb-4 mt-15">Your Cart</h1>
          <p className="text-gray-600">
            {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        {/* Cart Items */}
        <div className="bg-white/70 rounded-xl p-8 mb-8">
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.name} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">
                {/* Item Image */}
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-orange-900">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  <div className="flex items-center gap-2">
                    {item.dietary.map((diet) => (
                      <span
                        key={diet}
                        className="px-2 py-1 bg-orange-100 text-orange-900 text-xs rounded-full font-medium"
                      >
                        {diet}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.name, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-orange-100 text-orange-900 hover:bg-orange-200 transition-colors duration-200 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.name, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-orange-100 text-orange-900 hover:bg-orange-200 transition-colors duration-200 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                {/* Price */}
                <div className="text-right">
                  <div className="font-semibold text-orange-900">
                    {(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)} Rs.
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.name)}
                  className="text-orange-900 hover:text-red-700 transition-colors duration-200"
                  title="Remove item"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="bg-white/70 rounded-xl p-8 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-orange-900">Order Summary</h2>
            <button
              onClick={clearCart}
              className="text-orange-900 hover:text-red-700 font-semibold transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Cart
            </button>
          </div>
          
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal ({totalItems} items):</span>
              <span className="font-semibold">{calculateTotal().toFixed(2)} Rs.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (8.5%):</span>
              <span className="font-semibold"> {(calculateTotal() * 0.085).toFixed(2)} Rs.</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-orange-900">Total:</span>
                <span className="text-lg font-bold text-orange-900">
                  {(calculateTotal() * 1.085).toFixed(2)} Rs.
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/menu')}
              className="flex-1 border-2 border-orange-900 text-orange-900 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/payment')}
              className="flex-1 bg-orange-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Proceed to Payment
            </button>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Cart; 