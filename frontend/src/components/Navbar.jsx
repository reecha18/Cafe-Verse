import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import cafeLogo from "../assets/cafe-logo.svg";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const navigate = useNavigate();

  const { user, logOut } = useContext(AuthContext);

  const handleLogout = () => {
    logOut();
    setMenuOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const close = () => setMenuOpen(false);
      window.addEventListener("resize", close);
      window.addEventListener("scroll", close);
      return () => {
        window.removeEventListener("resize", close);
        window.removeEventListener("scroll", close);
      };
    }
  }, [menuOpen]);

  const navTextColor = isHome ? (scrolled ? "text-orange-700" : "text-white drop-shadow-lg") : "text-[#222]";
  const navMenuColor = isHome ? (scrolled ? "text-gray-700" : "text-white drop-shadow") : "text-[#222]";

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-orange-100" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#7B3F00] to-[#4E2E0E] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <img src={cafeLogo} alt="Coffee Cup Logo" className="w-8 h-8" />
            </div>
            <span className={`text-2xl font-bold text-orange-900 transition-colors duration-300 ${navTextColor}`}>CafeVerse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`font-semibold transition-all duration-300 hover:text-orange-500 ${navMenuColor}`}>Home</Link>
            <Link to="/about" className={`font-semibold transition-all duration-300 hover:text-orange-500 ${navMenuColor}`}>About</Link>
            <Link to="/menu" className={`font-semibold transition-all duration-300 hover:text-orange-500 ${navMenuColor}`}>Menu</Link>
            {user && (
              <Link to="/orders" className={`font-semibold transition-all duration-300 hover:text-orange-500 ${navMenuColor}`}>Orders</Link>
            )}
            {user && user.role === 'admin' && (
              <Link to="/admin" className={`font-semibold transition-all duration-300 hover:text-orange-500 ${navMenuColor}`}>Admin Dashboard</Link>
            )}
            <Link to="/cart" className={`font-semibold transition-all duration-300 hover:text-orange-500 ${navMenuColor}`}>Cart</Link>
            <Link to="/contact" className={`font-semibold transition-all duration-300 hover:text-orange-500 ${navMenuColor}`}>Contact Us</Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <Link to="/menu" className="px-6 py-2 bg-[#7B3F00] text-white font-semibold rounded-full hover:from-[#4E2E0E] hover:to-[#7B3F00] transition-all duration-300 transform hover:scale-105 shadow-lg">Order Now</Link>
            )}
            
            {user ? (
              <button onClick={handleLogout} className="px-5 py-2 bg-white text-[#7B3F00] font-semibold rounded-full border border-[#7B3F00] hover:bg-[#f3e9e1] transition-all duration-300 shadow">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="px-5 py-2 bg-white text-[#7B3F00] font-semibold rounded-full border border-[#7B3F00] hover:bg-[#f3e9e1] transition-all duration-300 shadow">Login</Link>
                <Link to="/signup" className="px-5 py-2 bg-[#7B3F00] text-white font-semibold rounded-full border border-[#7B3F00] hover:bg-[#4E2E0E] transition-all duration-300 shadow">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden flex items-center justify-center p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all duration-300" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              {/* Fixed typos in this section */}
              <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${navMenuColor} ${menuOpen ? "rotate-45 translate-y-1" : ""}`}></span>
              <span className={`block w-6 h-0.5 bg-current transition-all duration-300 mt-1 ${navMenuColor} ${menuOpen ? "opacity-0" : ""}`}></span>
              <span className={`block w-6 h-0.5 bg-current transition-all duration-300 mt-1 ${navMenuColor} ${menuOpen ? "-rotate-45 -translate-y-1" : ""}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0 overflow-hidden"}`}>
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-orange-100 p-6 space-y-4">
            <Link to="/" className="block text-lg font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-300" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/about" className="block text-lg font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-300" onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/menu" className="block text-lg font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-300" onClick={() => setMenuOpen(false)}>Menu</Link>
            {user && (
              <Link to="/orders" className="block text-lg font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-300" onClick={() => setMenuOpen(false)}>Orders</Link>
            )}
            {user && user.role === 'admin' && (
              <Link to="/admin" className="block text-lg font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-300" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
            )}
            <Link to="/cart" className="block text-lg font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-300" onClick={() => setMenuOpen(false)}>Cart</Link>
            <Link to="/contact" className="block text-lg font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-300" onClick={() => setMenuOpen(false)}>Contact Us</Link>
            <div className="pt-4 border-t border-orange-100 space-y-3">
              {user && (
                 <Link to="/menu" className="block w-full text-center px-6 py-3 bg-gradient-to-r from-[#7B3F00] to-[#4E2E0E] text-white font-semibold rounded-full" onClick={() => setMenuOpen(false)}>Order Now</Link>
              )}
             
              {user ? (
                <button onClick={handleLogout} className="block w-full text-center px-6 py-3 bg-white text-[#7B3F00] font-semibold rounded-full border border-[#7B3F00] hover:bg-[#f3e9e1]">Logout</button>
              ) : (
                <>
                  <Link to="/login" className="block w-full text-center px-6 py-3 bg-white text-[#7B3F00] font-semibold rounded-full border border-[#7B3F00] hover:bg-[#f3e9e1]" onClick={() => setMenuOpen(false)}>Login</Link>
                  <Link to="/signup" className="block w-full text-center px-6 py-3 bg-[#7B3F00] text-white font-semibold rounded-full" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;