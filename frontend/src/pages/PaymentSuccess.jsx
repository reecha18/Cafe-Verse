import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderNumber, setOrderNumber] = useState("");
  const [orderType, setOrderType] = useState("");
  const [countdown, setCountdown] = useState(20); // 20 seconds countdown
  const [orderTime, setOrderTime] = useState(""); // Store actual order time from backend

  useEffect(() => {
    // Get order ID and order type from navigation state (sent from Payment component)
    const orderId = location.state?.orderId;
    const orderTypeFromState = location.state?.orderType;
    
    if (orderId) {
      setOrderNumber(`CV-${orderId}`);
    } else {
      // Fallback: generate a random order number if none provided
      const generateOrderNumber = () => {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `CV-${timestamp}-${random}`;
      };
      setOrderNumber(generateOrderNumber());
    }
    
    // Set order type from navigation state, fallback to localStorage if needed
    if (orderTypeFromState) {
      setOrderType(orderTypeFromState);
    } else {
      // Fallback: get order type from localStorage
      const type = localStorage.getItem('cafeverse-order-type');
      setOrderType(type);
    }

    // Set order time to current time (when order was placed)
    const now = new Date();
    setOrderTime(now.toLocaleTimeString()); // Only time, not date
    localStorage.removeItem('cafeverse-cart');
    // Start countdown timer
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          navigate('/'); // Redirect to home page
          return 0;
        }
        return prevCount - 1;
      });
    
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearInterval(timer);
  }, [location.state, navigate]);

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50 flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          {/* Success Animation */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your order. We're preparing your delicious coffee and treats!
          </p>

          {/* Countdown Timer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-yellow-800 font-semibold">
                Redirecting to home page in {countdown} seconds...
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-yellow-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((20 - countdown) / 20) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-orange-900 mb-4">Order Confirmation</h2>
            <div className="space-y-3 text-left">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-bold text-orange-900">{orderNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Type:</span>
                <span className="font-semibold text-orange-900">
                  {orderType === 'takeaway' ? 'Take Away' : 
                   orderType === 'dinein' ? 'Dine In' : 
                   orderType === 'delivery' ? 'Delivery' : 
                   orderType ? orderType.charAt(0).toUpperCase() + orderType.slice(1) : 'Not specified'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-semibold">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Time:</span>
                <span className="font-semibold">{orderTime || new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  {orderType === 'delivery' ? 'Estimated Delivery:' : 
                   orderType === 'takeaway' ? 'Ready for Pickup:' : 
                   'Ready Time:'}
                </span>
                <span className="font-semibold text-green-600">
                  {orderType === 'delivery' ? '15-20 minutes' : 
                   orderType === 'takeaway' ? '10-15 minutes' : 
                   '5-10 minutes'}
                </span>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-bold text-blue-800 mb-4">What's Next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-semibold text-blue-800">Order Confirmed</p>
                  <p className="text-sm text-blue-600">We've received your order and payment</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-semibold text-blue-800">Preparing Your Order</p>
                  <p className="text-sm text-blue-600">Our baristas are crafting your drinks fresh</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-semibold text-blue-800">
                    {orderType === 'delivery' ? 'Out for Delivery' : 
                     orderType === 'takeaway' ? 'Ready for Pickup' : 
                     'Ready to Serve'}
                  </p>
                  <p className="text-sm text-blue-600">
                    {orderType === 'delivery' ? 'Our delivery partner will bring your order to your doorstep' : 
                     orderType === 'takeaway' ? 'We\'ll notify you when your order is ready at the counter' : 
                     'We\'ll bring your order to your table when ready'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Need Help?</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>📞 Call us: 9877654321</p>
              <p>📧 Email: orders@cafeverse.com</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/menu')}
              className="flex-1 bg-orange-900 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Order Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 border-2 border-orange-900 text-orange-900 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-300"
            >
              Back to Home
            </button>
          </div>

          {/* Skip Countdown Button */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-500 hover:text-orange-600 transition-colors duration-300 underline"
            >
              Skip countdown and go to home page now
            </button>
          </div>

          {/* Social Media */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-4">Follow us for updates and special offers!</p>
            <div className="flex justify-center space-x-4">
              <a href="#" className="w-10 h-10 bg-orange-900 rounded-full flex items-center justify-center hover:bg-orange-500/40 transition-colors duration-300">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-orange-900 rounded-full flex items-center justify-center hover:bg-orange-500/40 transition-colors duration-300">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
              
              <a href="#" className="w-10 h-10 bg-orange-900 rounded-full flex items-center justify-center hover:bg-orange-500/40 transition-colors duration-300">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 