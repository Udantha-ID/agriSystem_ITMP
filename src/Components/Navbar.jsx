import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Home, Info, ShoppingBag, Mail, UserCircle, Menu, X, ChevronRight, Leaf, LogOut, Bell, Settings, HelpCircle } from "lucide-react";
import SearchBar from '../Components/SearchBar.jsx';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAccountTray, setShowAccountTray] = useState(false);
  const accountTrayRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close account tray when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountTrayRef.current && !accountTrayRef.current.contains(event.target)) {
        setShowAccountTray(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowAccountTray(false);
  };

  return (
    <div className="fixed top-2 left-0 right-0 z-50">
      <nav className={`transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className={`flex justify-between items-center ${scrolled ? 'bg-white/95 backdrop-blur-md' : 'bg-white'} rounded-2xl px-6 py-4 shadow-lg transition-all`}>
            {/* Logo Section */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-700 rounded-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-800">
                GREEN SOIL
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-8">
              <NavItem to="/" label="Home" icon={<Home className="w-5 h-5" />} />
              <NavItem to="/About" label="About" icon={<Info className="w-5 h-5" />} />
              <NavItem to="/MarketPlace" label="Marketplace" icon={<ShoppingBag className="w-5 h-5" />} />
              <NavItem to="/Contact" label="Contact" icon={<Mail className="w-5 h-5" />} />
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden lg:flex w-64 xl:w-80">
              <div className="relative w-full">
                <SearchBar className="bg-gray-100 w-full pl-10 py-2 rounded-xl border-0 focus:ring-2 focus:ring-green-500 text-sm" />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="md:hidden text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* User Profile / Login Button */}
            <div className="hidden md:flex items-center relative" ref={accountTrayRef}>
              {isLoggedIn ? (
                <div 
                  className="flex items-center gap-3 bg-green-500 py-2 px-4 rounded-xl cursor-pointer hover:bg-green-600 transition-colors"
                  onClick={() => setShowAccountTray(!showAccountTray)}
                >
                  <UserCircle className="w-6 h-6 text-black-700" />
                  <span className="text-black-800 font-medium">My Account</span>
                  
                  {/* Account Tray */}
                  {showAccountTray && (
                    <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                      {/* Profile Section */}
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-full">
                            <UserCircle className="w-8 h-8 text-green-700" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Kamil Gunerathne</h3>
                            <p className="text-sm text-gray-500">Kamil@gmail.com</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Notifications Section */}
                      <div className="p-2 border-b border-gray-200">
                        <div className="flex items-center justify-between px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-full">
                              <Bell className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium">Notifications</span>
                          </div>
                          <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="p-2">
                        <Link 
                          to="/profile" 
                          className="flex items-center gap-3 px-2 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer text-gray-700"
                          onClick={() => setShowAccountTray(false)}
                        >
                          <UserCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Profile Settings</span>
                        </Link>
                        
                        <Link 
                          to="/settings" 
                          className="flex items-center gap-3 px-2 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer text-gray-700"
                          onClick={() => setShowAccountTray(false)}
                        >
                          <Settings className="w-5 h-5" />
                          <span className="text-sm font-medium">Account Settings</span>
                        </Link>
                        
                        <Link 
                          to="/help" 
                          className="flex items-center gap-3 px-2 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer text-gray-700"
                          onClick={() => setShowAccountTray(false)}
                        >
                          <HelpCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Help Center</span>
                        </Link>
                      </div>
                      
                      {/* Logout Button */}
                      <div className="p-2 border-t border-gray-200">
                        <button 
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-2 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer text-red-600"
                        >
                          <LogOut className="w-5 h-5" />
                          <span className="text-sm font-medium">Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setIsLoggedIn(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                >
                  Login
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>

        {/* Mobile Menu Panel */}
        <div className={`md:hidden fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-br from-green-500 to-emerald-700 rounded-md">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-green-800">GREEN SOIL</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Menu Items */}
            <div className="flex flex-col space-y-4">
              <MobileNavItem to="/" label="Home" icon={<Home className="w-5 h-5" />} onClick={() => setIsOpen(false)} />
              <MobileNavItem to="/about" label="About" icon={<Info className="w-5 h-5" />} onClick={() => setIsOpen(false)} />
              <MobileNavItem to="/products" label="Marketplace" icon={<ShoppingBag className="w-5 h-5" />} onClick={() => setIsOpen(false)} />
              <MobileNavItem to="/contact" label="Contact Us" icon={<Mail className="w-5 h-5" />} onClick={() => setIsOpen(false)} />
            </div>

            {/* Mobile Search */}
            <div className="mt-6 mb-6">
              <div className="relative">
                <SearchBar className="bg-gray-100 w-full pl-10 py-2.5 rounded-xl border-0 focus:ring-2 focus:ring-green-500" />
              </div>
            </div>

            {/* Mobile Login Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              {isLoggedIn ? (
                <div className="space-y-4">
                  {/* Profile Info */}
                  <div className="flex items-center gap-3 bg-green-50 py-3 px-4 rounded-xl">
                    <UserCircle className="w-6 h-6 text-green-700" />
                    <div>
                      <p className="text-green-800 font-medium">Kamil Gunarathne</p>
                      <p className="text-xs text-green-600">Kamil@gmail.com</p>
                    </div>
                  </div>
                  
                  {/* Mobile Account Options */}
                  <div className="space-y-2">
                    <Link 
                      to="/notifications" 
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      <Bell className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium">Notifications</span>
                      <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
                    </Link>
                    
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      <UserCircle className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium">My Profile</span>
                    </Link>
                    
                    <Link 
                      to="/settings" 
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium">Settings</span>
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg text-red-600"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-sm font-medium">Log Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setIsLoggedIn(true);
                    setIsOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  Login to Your Account
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

const NavItem = ({ to, label, icon }) => (
  <Link 
    to={to} 
    className="flex items-center gap-2 text-gray-700 hover:text-green-700 font-medium transition-colors"
  >
    {icon} 
    <span>{label}</span>
  </Link>
);

const MobileNavItem = ({ to, label, icon, onClick }) => (
  <Link 
    to={to} 
    className="flex items-center gap-3 text-gray-800 hover:text-green-700 p-3 rounded-xl hover:bg-green-50 transition-colors"
    onClick={onClick}
  >
    <div className="p-2 bg-gray-100 rounded-lg">
      {icon}
    </div>
    <span className="font-medium">{label}</span>
  </Link>
);