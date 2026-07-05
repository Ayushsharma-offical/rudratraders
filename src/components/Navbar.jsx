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
    <nav className="sticky top-0 z-50 transition-all duration-300 bg-[#2D1C11]/95 backdrop-blur-md shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
            <div className="w-9 h-9 rounded-lg bg-[#274c43] flex items-center justify-center text-white font-medium text-base flex-shrink-0">
              R
            </div>
            <span className="text-lg font-medium text-white leading-tight">Rudra<br/><span className="text-xs text-gray-400 font-normal">Traders</span></span>
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
          <div className="flex items-center gap-2">
            <button className="text-gray-300 hover:text-white transition-colors hidden md:block">
              <Search className="w-5 h-5" />
            </button>

            {/* Admin Button */}
            <button
              onClick={() => { navigate('/admin'); setMobileOpen(false); }}
              className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all text-xs font-bold uppercase tracking-wider border border-red-500/30"
              title="Admin Portal"
            >
              <Lock className="w-3 h-3 flex-shrink-0" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Cart */}
            <button
              onClick={() => { navigate('/cart'); setMobileOpen(false); }}
              className="relative text-gray-300 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#F05A5A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Order Now — desktop only */}
            <button
              onClick={() => navigate('/cart')}
              className="hidden md:flex btn-green text-sm px-4 py-2"
            >
              Order Now <ArrowRight className="w-4 h-4" />
            </button>

            {/* Hamburger — mobile only */}
            <button className="md:hidden text-gray-300 ml-1" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu — absolutely positioned so it overlays content */}
      {mobileOpen && (
        <div
          className="md:hidden absolute left-0 right-0 top-full z-50 shadow-2xl border-t border-white/10"
          style={{ background: 'rgba(30, 16, 8, 0.98)', backdropFilter: 'blur(20px)' }}
        >
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center px-5 py-3.5 text-sm font-medium border-b border-white/5 transition-colors ${
                pathname === l.to ? 'text-[#F05A5A]' : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="p-4">
            <button
              onClick={() => { navigate('/cart'); setMobileOpen(false); }}
              className="btn-green w-full justify-center"
            >
              Order Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
