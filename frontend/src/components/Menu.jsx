import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loadCart, saveCart } from '../utils/cartStorage';
import axios from 'axios'
import AuthContext from '../context/AuthContext';

// This component now fetches menu data dynamically from the Django backend API
// instead of using static data. The UI and design remain exactly the same.
// The API endpoint is: http://127.0.0.1:8000/api/menu/
// Make sure the backend server is running before testing this component.
const Menu = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(() => loadCart());
  const [nameQuery, setNameQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [menuCategories, setMenuCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatPriceToRs = (priceString) => {
    const numeric = parseFloat(String(priceString).replace(/[^0-9.]/g, ""));
    if (Number.isNaN(numeric)) return priceString;
    return `${numeric.toFixed(2)} Rs`;
  };

  const getNumericPrice = (priceString) => {
    const numeric = parseFloat(String(priceString).replace(/[^0-9.]/g, ""));
    return Number.isNaN(numeric) ? null : numeric;
  };

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        console.log('Fetching menu data from API...');
        const response = await axios.get('http://127.0.0.1:8000/api/menu/');
        console.log('API Response:', response.data);
        
        if (response.data && response.data.data) {
          // Transform the API data to match our expected format
          const transformedData = response.data.data.map(menu => ({
            id: menu.key?.category?.toLowerCase().replace(/\s+/g, '-') || menu.id,
            name: menu.name || menu.key?.category || 'Category',
            items: menu.items?.map(item => ({
              id: item.id,  // Add the item ID
              name: item.name,
              description: item.description,
              price: item.price?.toString() || '0',
              image: item.image || '/cafe.jpg',
              popular: item.popular || false,
              seasonal: item.seasonal || false,
              dietary: item.dietary?.map(d => d.name) || [],
              calories: item.calories || 0
            })) || []
          }));
          
          console.log('Transformed data:', transformedData);
          setMenuCategories(transformedData);
        } else {
          console.log('No data in API response');
          setError('No menu data available');
        }
      } catch (error) {
        console.error('Error fetching menu data:', error);
        setError('Failed to load menu data. Please try again later.');
        
        // For development/testing, you can uncomment this to show sample data
        // setMenuCategories(sampleMenuData);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  // Add to cart
  const addToCart = (item) => {
    if (!user) {
      // Show a more user-friendly message and redirect to login
      alert('Please log in to add items to your cart. You will be redirected to the login page.');
      navigate('/login');
      return;
    }
    
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.name === item.name);
      let newCart;
      if (existingItem) {
        newCart = prevCart.map(cartItem =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        newCart = [...prevCart, { ...item, quantity: 1 }];
      }
      return newCart;
    });
  };

  const updateQuantity = (itemName, newQuantity) => {
    if (!user) {
      alert('Please log in to manage your cart. You will be redirected to the login page.');
      navigate('/login');
      return;
    }
    
    setCart(prevCart => {
      let newCart;
      if (newQuantity <= 0) {
        newCart = prevCart.filter(item => item.name !== itemName);
      } else {
        newCart = prevCart.map(item =>
          item.name === itemName
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      return newCart;
    });
  };

  const getItemQuantity = (itemName) => {
    const cartItem = cart.find(item => item.name === itemName);
    return cartItem ? cartItem.quantity : 0;
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-900 mx-auto mb-4"></div>
          <p className="text-orange-900 text-lg">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-orange-900 text-white rounded-lg hover:bg-orange-800 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 mt-12">
          <h1 className="text-4xl md:text-5xl font-bold text-orange-900 mb-2">Our Menu</h1>
          <p className="text-gray-600">Freshly brewed coffee, cozy bites, and sweet finishes</p>
        </div>

        {/* Search & Price Filters */}
        <div className="bg-white rounded-xl p-6 mb-10 shadow-sm">
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-orange-900 mb-2">Search by name</label>
                <input
                  type="text"
                  placeholder="e.g., Latte, Muffin"
                  value={nameQuery}
                  onChange={(e) => setNameQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-orange-900 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                  <option value="">All Categories</option>
                  {menuCategories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-orange-900 mb-2">Max price</label>
                <input
                  type="number"
                  min="0"
                  step="400"
                  placeholder="e.g., 400"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>
            </div>
            <div className="flex md:items-end">
              <button
                onClick={() => { setNameQuery(""); setMaxPrice(""); setSelectedCategory(""); }}
                className="w-full md:w-auto px-6 py-2 rounded-lg bg-orange-900 text-white font-semibold hover:bg-orange-700 transition"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Menu Categories */}
        {menuCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No menu items available at the moment.</p>
          </div>
        ) : (
          menuCategories.map((category) => {
            // Filter categories based on selected category
            const matchesCategory = selectedCategory
              ? category.name === selectedCategory
              : true;
            
            if (!matchesCategory) return null;
            
            const filteredCategoryItems = category.items.filter((item) => {
              const matchesName = nameQuery
                ? item.name.toLowerCase().includes(nameQuery.toLowerCase())
                : true;
              const matchesPrice = maxPrice
                ? (getNumericPrice(item.price) ?? Infinity) <= parseFloat(maxPrice)
                : true;
              return matchesName && matchesPrice;
            });
            
            if (filteredCategoryItems.length === 0) return null;
            
            return (
              <div key={category.id} className="mb-14">
                <div className="flex items-center mb-6">
                  <h2 className="text-2xl font-bold text-orange-900">{category.name}</h2>
                  <div className="ml-4 flex-1 h-px bg-orange-200"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCategoryItems.map((item) => {
                    const itemQuantity = getItemQuantity(item.name);
                    const subtitle = item.description.length > 60
                      ? `${item.description.substring(0, 57)}...`
                      : item.description;
                    return (
                                             <div key={item.name} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                         <div className="relative h-48 overflow-hidden">
                           <img
                             src={item.image}
                             alt={item.name}
                             className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                             onError={(e) => {
                               e.target.src = '/cafe.jpg';
                             }}
                           />
                           {item.popular && (
                             <div className="absolute top-2 left-2 bg-orange-900 text-white px-2 py-1 rounded-full text-xs font-semibold">
                               Popular
                             </div>
                           )}
                           {item.seasonal && (
                             <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                               Seasonal
                             </div>
                           )}
                         </div>

                         <div className="p-5 flex flex-col flex-grow">
                           <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
                           <p className="text-gray-500 text-sm mb-4 flex-grow">{subtitle}</p>

                           <div className="flex items-end justify-between mt-auto">
                             <span className="text-base font-semibold text-orange-700">
                               {formatPriceToRs(item.price)}
                             </span>

                             {user && itemQuantity > 0 ? (
                               <div className="flex items-center gap-2">
                                 <button
                                   onClick={() => updateQuantity(item.name, itemQuantity - 1)}
                                   className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors duration-200 flex items-center justify-center font-semibold"
                                 >
                                   -
                                 </button>
                                 <span className="w-8 text-center font-bold text-orange-700">
                                   {itemQuantity}
                                 </span>
                                 <button
                                   onClick={() => updateQuantity(item.name, itemQuantity + 1)}
                                   className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors duration-200 flex items-center justify-center font-semibold"
                                 >
                                   +
                                 </button>
                               </div>
                             ) : (
                               <button
                                 onClick={() => addToCart(item)}
                                 className="px-4 py-2 rounded-full bg-orange-900 text-white text-sm font-semibold hover:bg-orange-800 transition-colors duration-200 shadow-sm"
                               >
                                 Add to Cart
                               </button>
                             )}
                           </div>
                         </div>
                       </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}

        {/* View Cart Button */}
        {user && cartItemCount > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center gap-2 bg-orange-900 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-orange-800 transition-colors duration-300 text-lg"
              aria-label="View Cart"
            >
              <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.5 5m2.5-5l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              View Cart
              <span className="ml-2 bg-white text-orange-900 px-2 py-1 rounded-full text-sm font-bold">
                {cartItemCount}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu; 