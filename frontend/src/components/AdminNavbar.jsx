import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import cafeLogo from "../assets/cafe-logo.svg";

const AdminNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
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

  const navTextColor = "text-orange-900";
  const navMenuColor = "text-[#222]";

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-orange-100" : "bg-white shadow-sm"}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#7B3F00] to-[#4E2E0E] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <img src={cafeLogo} alt="Coffee Cup Logo" className="w-8 h-8" />
            </div>
            <span className={`text-2xl font-bold text-orange-900 transition-colors duration-300 ${navTextColor}`}>CafeVerse Admin</span>
          </Link>

          {/* Desktop Navigation - Admin Only */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/admin" className={`font-semibold transition-all duration-300 hover:text-orange-500 ${navMenuColor}`}>Dashboard</Link>
            <Link to="/menu" className={`font-semibold transition-all duration-300 hover:text-orange-500 ${navMenuColor}`}>Menu Management</Link>
            <Link to="/" className={`font-semibold transition-all duration-300 hover:text-orange-500 ${navMenuColor}`}>View Site</Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="px-4 py-2 bg-orange-100 text-orange-800 font-semibold rounded-full border border-orange-200">
              Admin Panel
            </span>
            
            <button onClick={handleLogout} className="px-5 py-2 bg-white text-[#7B3F00] font-semibold rounded-full border border-[#7B3F00] hover:bg-[#f3e9e1] transition-all duration-300 shadow">
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden flex items-center justify-center p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all duration-300" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${navMenuColor} ${menuOpen ? "rotate-45 translate-y-1" : ""}`}></span>
              <span className={`block w-6 h-0.5 bg-current transition-all duration-300 mt-1 ${navMenuColor} ${menuOpen ? "opacity-0" : ""}`}></span>
              <span className={`block w-6 h-0.5 bg-current transition-all duration-300 mt-1 ${navMenuColor} ${menuOpen ? "-rotate-45 -translate-y-1" : ""}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu - Admin Only */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0 overflow-hidden"}`}>
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-orange-100 p-6 space-y-4">
            <Link to="/admin" className="block text-lg font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-300" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/menu" className="block text-lg font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-300" onClick={() => setMenuOpen(false)}>Menu Management</Link>
            <Link to="/" className="block text-lg font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-300" onClick={() => setMenuOpen(false)}>View Site</Link>
            <div className="pt-4 border-t border-orange-100 space-y-3">
              <span className="block w-full text-center px-6 py-3 bg-orange-100 text-orange-800 font-semibold rounded-full border border-orange-200">
                Admin Panel
              </span>
              <button onClick={handleLogout} className="block w-full text-center px-6 py-3 bg-white text-[#7B3F00] font-semibold rounded-full border border-[#7B3F00] hover:bg-[#f3e9e1]">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
