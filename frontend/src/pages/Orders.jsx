import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Orders = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, completed, cancelled
  const [menuItems, setMenuItems] = useState({}); // Store menu items with images
  const [cancellingOrder, setCancellingOrder] = useState(null); // Track which order is being cancelled
  const [showCancelConfirm, setShowCancelConfirm] = useState(false); // Show custom confirmation dialog
  const [orderToCancel, setOrderToCancel] = useState(null); // Store order ID to cancel

  useEffect(() => {
    // Check if user is logged in
    if (!user || !token) {
      alert('Please log in to view your orders.');
      navigate('/login');
      return;
    }

    fetchOrders();
    fetchMenuItems();
  }, [user, token, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/api/order/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (response.data.data) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/menu/');
      if (response.data) {
        const itemsMap = {};
        response.data.forEach(item => {
          itemsMap[item.id] = item;
        });
        setMenuItems(itemsMap);
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      setCancellingOrder(orderId);
      const response = await axios.patch('http://127.0.0.1:8000/api/order/', {
        order_id: orderId
      }, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (response.data.status === 'success') {
        alert('Order cancelled successfully!');
        // Refresh orders to show updated status
        fetchOrders();
      } else {
        alert('Failed to cancel order: ' + response.data.message);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      if (error.response?.data?.message) {
        alert('Error: ' + error.response.data.message);
      } else {
        alert('Failed to cancel order. Please try again.');
      }
    } finally {
      setCancellingOrder(null);
    }
  };

  const handleCancelOrder = (orderId) => {
    setOrderToCancel(orderId);
    setShowCancelConfirm(true);
  };

  const confirmCancelOrder = () => {
    if (orderToCancel) {
      cancelOrder(orderToCancel);
      setShowCancelConfirm(false);
      setOrderToCancel(null);
    }
  };

  const cancelCancelOrder = () => {
    setShowCancelConfirm(false);
    setOrderToCancel(null);
  };

  const getItemImage = (itemId) => {
    const menuItem = menuItems[itemId];
    if (menuItem && menuItem.image) {
      return `http://127.0.0.1:8000${menuItem.image}`;
    }
    return '/cafe.jpg'; // Default fallback image
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOrderTypeIcon = (orderType) => {
    switch (orderType) {
      case 'delivery':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        );
      case 'takeaway':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 7l1.5 12.5A2 2 0 007.5 21h9a2 2 0 002-1.5L20 7M9 7V4a3 3 0 016 0v3" />
          </svg>
        );
      case 'dinein':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-8 mt-20">
      {/* Cancel Order Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel Order</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelCancelOrder}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  No, Keep Order
                </button>
                <button
                  onClick={confirmCancelOrder}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Yes, Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-900 mb-4">My Orders</h1>
          <p className="text-xl text-gray-600">
            Track your past and current orders
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({orders.filter(o => o.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('delivered')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'delivered'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Delivered ({orders.filter(o => o.status === 'delivered').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed ({orders.filter(o => o.status === 'completed').length})
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'cancelled'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancelled ({orders.filter(o => o.status === 'cancelled').length})
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Orders Found</h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? "You haven't placed any orders yet." 
                  : `No ${filter} orders found.`
                }
              </p>
              <button
                onClick={() => navigate('/menu')}
                className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getOrderTypeIcon(order.order_type)}
                        <span className="font-semibold text-gray-700 capitalize">
                          {order.order_type === 'takeaway' ? 'Take Away' : 
                           order.order_type === 'dinein' ? 'Dine In' : 
                           order.order_type === 'delivery' ? 'Delivery' : order.order_type}
                        </span>
                      </div>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-600">Order #{order.id}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6">
                  {/* Items */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {order.items_data && order.items_data.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={getItemImage(item.item_id || item.id)} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/cafe.jpg'; // Fallback image
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-800 truncate">{item.name}</h5>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">₹{item.price}</p>
                            <p className="text-sm text-gray-600">Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Information */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Order Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium text-right">₹{order.total_amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (8.5%):</span>
                        <span className="font-medium text-right">₹{(parseFloat(order.total_amount) * 0.085).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-800 font-semibold">Total Amount:</span>
                        <span className="font-bold text-gray-900 text-right">₹{(parseFloat(order.total_amount) * 1.085).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Date:</span>
                        <span className="font-medium text-right">{formatDate(order.created_at || order.date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Time:</span>
                        <span className="font-medium text-right">{formatTime(order.created_at || order.date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium text-right capitalize">{order.payment_method}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Information (if delivery order or completed order) */}
                  {(order.order_type === 'delivery' || order.status === 'completed' || order.status === 'delivered') && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-800 mb-3">Delivery Information</h4>
                                              <div className="space-y-2 text-sm">
                          {(order.address || order.delivery_address) && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Delivery Address:</span>
                              <span className="font-medium text-right max-w-xs">
                                {order.address || order.delivery_address}
                              </span>
                            </div>
                          )}
                          {order.customer_phone && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Phone:</span>
                              <span className="font-medium">{order.customer_phone}</span>
                            </div>
                          )}
                          {order.delivered_at && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Completed Date:</span>
                              <span className="font-medium text-gray-900 text-right">
                                {formatDate(order.delivered_at)}
                              </span>
                            </div>
                          )}
                          {order.delivered_at && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Completed Time:</span>
                              <span className="font-medium text-gray-900 text-right">
                                {formatTime(order.delivered_at)}
                              </span>
                            </div>
                          )}
                        </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => navigate('/menu')}
                        className="flex-1 bg-[#7B3F00] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#4E2E0E] transition-colors"
                      >
                        Order Again
                      </button>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingOrder === order.id}
                          className="flex-1 bg-red-400 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancellingOrder === order.id ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Back to Menu Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/menu')}
            className="bg-orange-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-800 transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;
