import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, Lock, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('rudra_cart') || '[]');
      setCartCount(cart.reduce((a, i) => a + i.quantity, 0));
    };
    updateCart();
    window.addEventListener('cart_updated', updateCart);
    return () => window.removeEventListener('cart_updated', updateCart);
  }, [pathname]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/machinery', label: 'Machinery' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 transition-all duration-300 py-3 px-4 bg-[#2D1C11]/85 backdrop-blur-md shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#274c43] flex items-center justify-center text-white font-medium text-lg">
              R
            </div>
            <span className="text-xl font-medium text-white">Rudra Traders</span>
          </Link>

          {/* Desktop Links - Centered */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-medium transition-colors ${
                  pathname === l.to || (l.to === '/' && pathname === '/') 
                  ? 'text-[#F05A5A] border-b-2 border-[#F05A5A] pb-1' 
                  : 'text-gray-300 hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-5">
            <button className="text-gray-300 hover:text-white transition-colors hidden md:block">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="text-gray-400 hover:text-white transition-colors hidden md:block"
              title="Admin Portal"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="relative text-gray-300 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#F05A5A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="hidden md:flex btn-green"
            >
              Order Now <ArrowRight className="w-4 h-4" />
            </button>
            <button className="md:hidden text-gray-300" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pt-4 pb-2">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="block px-2 py-3 text-gray-300 hover:text-white border-b border-white/5"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-4">
              <button onClick={() => { navigate('/cart'); setMobileOpen(false); }} className="btn-green w-full justify-center">
                Order Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
