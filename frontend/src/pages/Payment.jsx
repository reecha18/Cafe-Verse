import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loadCart } from '../utils/cartStorage';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Payment = () => {
  const navigate = useNavigate();
  const { user, token, clearUserCart } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: ""
  });
  const [orderType, setOrderType] = useState("");

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      alert('Please log in to complete your order.');
      navigate('/login');
      return;
    }

    const savedCart = loadCart(user.id);
    if (savedCart.length === 0) {
      navigate('/menu');
      return;
    }
    
    setCart(savedCart);
    
    // Load order type if user goes back
    const savedType = localStorage.getItem('cafeverse-order-type');
    if (savedType) setOrderType(savedType);
    
    // Pre-fill email and phone if available from user data
    if (user.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.085;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleOrderTypeChange = (type) => {
    setOrderType(type);
    localStorage.setItem('cafeverse-order-type', type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderType) return; // Prevent submit if not selected
    setIsProcessing(true);

    try {
      // Check if user is authenticated
      if (!user || !token) {
        alert('Please log in to complete your order.');
        navigate('/login');
        return;
      }

      // Prepare order data for backend
      console.log('Cart data:', cart);  // Debug cart data
      
      const orderData = {
        order_type: orderType,
        payment_method: paymentMethod,
        customer_name: user.username || user.first_name || user.email || 'Customer',
        customer_email: formData.email,
        customer_phone: formData.phone,
        ...(orderType === 'delivery' && {
          address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,  // Complete address
          delivery_address: formData.address,
          delivery_city: formData.city,
          delivery_zipcode: formData.zipCode,
        }),
        items: cart.map(item => ({
          item_id: item.id || 1, // Fallback ID if not available
          quantity: item.quantity,
          price: parseFloat(item.price.replace(/[^0-9.]/g, '')),
          item_name: item.name
        }))
      };
      
      console.log('Order data being sent:', orderData);  // Debug order data
      console.log('Auth token:', token);  // Debug token

      // Send order to backend with explicit headers
      const response = await axios.post('http://127.0.0.1:8000/api/order/', orderData, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Backend response:', response.data);  // Debug response

      if (response.data.status === 'success') {
        // Clear user-specific cart after successful order creation
        // Add a small delay to ensure order is fully processed
        setTimeout(() => {
          clearUserCart();
          // Also clear local cart state as fallback
          setCart([]);
          console.log('Cart cleared after successful order');
        }, 100);
        
        localStorage.removeItem('cafeverse-order-type');
        
        // Navigate to success page with order ID and order type
        navigate('/payment-success', { 
          state: { 
            orderId: response.data.order_id,
            orderType: orderType  // Pass the order type to success page
          }
        });
      } else {
        throw new Error(response.data.message || 'Order creation failed');
      }
    } catch (error) {
      console.error("Error creating order:", error);
      console.error("Error response:", error.response?.data);  // Debug error response
      
      let errorMessage = "Failed to create order. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 403) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data.message || "Invalid order data.";
      }
      
      alert(errorMessage);
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <svg className="w-24 h-24 mx-auto text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-orange-700 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. Start exploring our delicious menu!
          </p>
          <button
            onClick={() => navigate('/menu')}
            className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-300"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-900 mb-4 mt-15">Secure Checkout</h1>
          <p className="text-xl text-gray-600">
            Complete your order with our secure payment system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-orange-900 mb-6">Payment Information</h2>
            
            {/* Order Type Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Order Type <span className="text-red-900">*</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => handleOrderTypeChange('takeaway')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center ${
                    orderType === 'takeaway'
                      ? 'border-[#977757] bg-[#E5D4B2]' : 'border-gray-200 hover:border-[#977757]'
                  }`}
                >
                  <svg className="w-8 h-8 mb-2 text-[#977757]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 7l1.5 12.5A2 2 0 007.5 21h9a2 2 0 002-1.5L20 7M9 7V4a3 3 0 016 0v3" /></svg>
                  <span className="font-semibold">Take Away</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOrderTypeChange('dinein')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center ${
                    orderType === 'dinein'
                      ? 'border-[#977757] bg-[#E5D4B2]' : 'border-gray-200 hover:border-[#977757]'
                  }`}
                >
                  <svg className="w-8 h-8 mb-2 text-[#977757]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  <span className="font-semibold">Dine In</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOrderTypeChange('delivery')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center ${
                    orderType === 'delivery'
                      ? 'border-[#977757] bg-[#E5D4B2]' : 'border-gray-200 hover:border-[#977757]'
                  }`}
                >
                  <svg className="w-8 h-8 mb-2 text-[#977757]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  <span className="font-semibold">Delivery</span>
                </button>
              </div>
              {!orderType && <div className="text-red-500 text-sm mt-2">Please select an order type.</div>}
            </div>

            {/* Payment Method Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    paymentMethod === "card"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-6 h-6 text-orange-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="font-semibold">Credit Card</span>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setPaymentMethod("UPI")}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    paymentMethod === "UPI"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-6 h-6 text-orange-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 5 L13 12 L7 19 Z M11 5 L19 12 L11 19 Z"/>
                    </svg>
                    <span className="font-semibold">UPI</span>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setPaymentMethod("apple")}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    paymentMethod === "apple"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-6 h-6 text-orange-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <span className="font-semibold">Apple Pay</span>
                  </div>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {paymentMethod === "card" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value);
                        setFormData(prev => ({ ...prev, cardNumber: formatted }));
                      }}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      maxLength="19"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        maxLength="5"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      maxLength="4"
                      required
                    />
                  </div>
                </>
              )}

              {paymentMethod === "UPI" && (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 5 L13 12 L7 19 Z M11 5 L19 12 L11 19 Z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">UPI Payment</h3>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UPI ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="upiId"
                      placeholder="yourname@upi"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">Enter your UPI ID (e.g., username@bank)</p>
                  </div>
                </div>
              )}

              {paymentMethod === "apple" && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  </div>
                  <p className="text-gray-600">Complete your payment with Apple Pay for a seamless experience.</p>
                </div>
              )}

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      pattern="\d{10}"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Conditional Delivery Address or Self Service Note */}
              {orderType === 'delivery' ? (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Delivery Address <span className="text-red-500">*</span>
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Please provide your delivery address for order delivery.</p>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street Address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required={orderType === 'delivery'}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required={orderType === 'delivery'}
                      />
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="ZIP Code"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required={orderType === 'delivery'}
                      />
                    </div>
                  </div>
                </div>
              ) : orderType && (
                <div className="border-t pt-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-800 mb-1">Self Service</h3>
                        <p className="text-blue-700">Take Your Orders From The Counter After Your Order Is Ready.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || !orderType}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                  isProcessing || !orderType
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-900 hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 shadow-lg"
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Payment...
                  </div>
                ) : (
                  `Pay ${calculateTotal().toFixed(2)} Rs.`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-orange-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        {(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)} Rs.
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.reduce((total, item) => total + item.quantity, 0)} items):</span>
                  <span>{calculateSubtotal().toFixed(2)} Rs.</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8.5%):</span>
                  <span>{calculateTax().toFixed(2)} Rs.</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-orange-900 border-t pt-2">
                  <span>Total:</span>
                  <span>{calculateTotal().toFixed(2)} Rs.</span>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="font-semibold text-green-800">Secure Payment</h3>
              </div>
              <p className="text-green-700 text-sm">
                Your payment information is encrypted and secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment; 