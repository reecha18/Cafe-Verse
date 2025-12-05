import React, { useContext } from "react";
// Make sure to remove BrowserRouter from this import line if it's there
import { Routes, Route, useLocation } from "react-router-dom"; 
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Menu from "./components/Menu";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";
import Contact from "./pages/Contact";
import ScrollToTop from "./components/ScrollToTop";
import AuthContext from "./context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  
  // Determine which navbar to show
  const isAdminRoute = location.pathname === '/admin';
  const shouldShowAdminNavbar = user && user.role === 'admin' && isAdminRoute;
  
  return (
      <div className="font-sans bg-gradient-to-br from-yellow-50 to-orange-100 min-h-screen flex flex-col">
         <ScrollToTop />
        {shouldShowAdminNavbar ? <AdminNavbar /> : <Navbar />}
        
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
        <Footer />
      </div>
  );
}

export default App;