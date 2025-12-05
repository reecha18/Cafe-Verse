import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, delivered
  const [orderTypeFilter, setOrderTypeFilter] = useState('all'); // all, delivery, dinein, takeaway
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    // Check if user is logged in and is admin
    if (!user || !token) {
      alert('Please log in to access admin dashboard.');
      navigate('/login');
      return;
    }

    if (user.role !== 'admin') {
      alert('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    fetchOrders();
  }, [user, token, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/orders/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please log in again.');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, action) => {
    try {
      setUpdatingOrder(orderId);
      await axios.patch(`http://localhost:8000/api/orders/${orderId}/`, {
        action: action
      }, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      
      // Refresh orders data to ensure accurate counts
      await fetchOrders();
      
      // Show success message
      alert(`Order #${orderId} marked as complete. Dashboard refreshed with latest data.`);
    } catch (error) {
      console.error('Error updating order status:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please log in again.');
        navigate('/login');
      } else {
        alert('Failed to update order status');
      }
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Filter orders based on selected filter
  const filteredOrders = orders.filter(order => {
    const matchesStatusFilter = filter === 'all' || order.status === filter;
    const matchesOrderTypeFilter = orderTypeFilter === 'all' || order.order_type === orderTypeFilter;
    return matchesStatusFilter && matchesOrderTypeFilter;
  });

  // Get counts for different order statuses
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const deliveredOrders = orders.filter(order => order.status === 'delivered');
  const completedOrders = orders.filter(order => order.status === 'completed');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 pt-20">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-orange-900">Admin Dashboard</h1>
                <p className="mt-1 text-sm text-orange-700">Manage orders and track delivery status</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={fetchOrders}
                  className="px-6 py-2 bg-orange-900 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 font-semibold"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                                 <div className="ml-4">
                   <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                   <p className="text-3xl font-bold text-gray-900">{pendingOrders.length}</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                                 <div className="ml-4">
                   <p className="text-sm font-medium text-gray-600">Delivered Orders</p>
                   <p className="text-3xl font-bold text-gray-900">{deliveredOrders.length}</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                                 <div className="ml-4">
                   <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                   <p className="text-3xl font-bold text-gray-900">{completedOrders.length}</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>
                                 <div className="ml-4">
                   <p className="text-sm font-medium text-gray-600">Total Orders</p>
                   <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
                             <button
                 onClick={() => setFilter('all')}
                 className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                   filter === 'all'
                     ? 'border-orange-500 text-orange-600'
                     : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                 }`}
               >
                 All Orders ({orders.length})
               </button>
                             <button
                 onClick={() => setFilter('pending')}
                 className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                   filter === 'pending'
                     ? 'border-orange-500 text-orange-600'
                     : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                 }`}
               >
                 Pending ({pendingOrders.length})
               </button>
                             <button
                 onClick={() => setFilter('delivered')}
                 className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                   filter === 'delivered'
                     ? 'border-orange-500 text-orange-600'
                     : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                 }`}
               >
                 Delivered ({deliveredOrders.length})
               </button>
                             <button
                 onClick={() => setFilter('completed')}
                 className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                   filter === 'completed'
                     ? 'border-orange-500 text-orange-600'
                     : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                 }`}
               >
                 Completed ({completedOrders.length})
               </button>
            </nav>
          </div>
          
          {/* Order Type Filter */}
          <div className="px-6 py-4">
            <div className="flex flex-wrap gap-2">
                             <span className="text-sm font-medium text-gray-700 mr-2">Order Type:</span>
              <button
                onClick={() => setOrderTypeFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  orderTypeFilter === 'all'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => setOrderTypeFilter('delivery')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  orderTypeFilter === 'delivery'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                🚚 Delivery
              </button>
              <button
                onClick={() => setOrderTypeFilter('dinein')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  orderTypeFilter === 'dinein'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                🍽️ Dine In
              </button>
              <button
                onClick={() => setOrderTypeFilter('takeaway')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  orderTypeFilter === 'takeaway'
                    ? 'bg-orange-600 text-white'
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                }`}
              >
                📦 Take Away
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Orders</h3>
          </div>
          
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {filter === 'all' ? 'No orders have been placed yet.' : `No ${filter} orders found.`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-xl font-semibold text-gray-900">
                              Order #{order.id}
                            </h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                              order.order_type === 'delivery' 
                                ? 'bg-blue-100 text-blue-800 border-blue-200' 
                                : order.order_type === 'dinein'
                                ? 'bg-purple-100 text-purple-800 border-purple-200'
                                : 'bg-orange-100 text-orange-800 border-orange-200'
                            }`}>
                              {order.order_type === 'delivery' ? '🚚 Delivery' : 
                               order.order_type === 'dinein' ? '🍽️ Dine In' : 
                               '📦 Take Away'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(order.created_at).toLocaleDateString()} at{' '}
                            {new Date(order.created_at).toLocaleTimeString()}
                          </p>
                          {order.delivered_at && (
                            <p className={`text-sm font-medium mt-1 ${
                              order.status === 'delivered' ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {order.status === 'delivered' ? '✅ Delivered' : '✅ Completed'}: {new Date(order.delivered_at).toLocaleDateString()} at{' '}
                              {new Date(order.delivered_at).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-4">
                          {getStatusBadge(order.status)}
                          {order.status === 'pending' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'mark_complete')}
                              disabled={updatingOrder === order.id}
                              className="px-6 py-2 rounded-lg hover:disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-semibold shadow-sm bg-green-600 hover:bg-green-700 text-white"
                            >
                              {updatingOrder === order.id ? 'Updating...' : 
                               order.order_type === 'delivery' ? 'Mark as Delivered' : 'Mark as Complete'}
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-sm font-semibold text-gray-900 mb-3">Order Items:</h5>
                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-700 font-medium">
                                  {item.quantity}x {item.name}
                                </span>
                                <span className="text-gray-900 font-semibold">
                                  ₹{item.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-semibold text-gray-900 mb-3">Customer Details:</h5>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Order Type:</span> 
                              <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                                order.order_type === 'delivery' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : order.order_type === 'dinein'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}>
                                {order.order_type === 'delivery' ? '🚚 Delivery' : 
                                 order.order_type === 'dinein' ? '🍽️ Dine In' : 
                                 '📦 Take Away'}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Name:</span> {order.customer_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Phone:</span> 
                              <span className="font-mono text-blue-600">{order.phone_number || 'N/A'}</span>
                            </p>
                            {order.order_type === 'delivery' && order.delivery_address && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Delivery Address:</span> {order.delivery_address}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Payment Method:</span> {order.payment_method}
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              Total: ₹{order.total_amount}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
