import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, ChevronDown, Search } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
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
    { to: '/products', label: 'Machinery' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'navbar-glass shadow-2xl' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-800 flex items-center justify-center text-black font-black text-lg border-2 border-yellow-500/50">R</div>
            <div>
              <span className="text-xl font-black gold-text tracking-wide">RUDRA</span>
              <span className="text-xl font-black text-white tracking-wide"> TRADERS</span>
              <div className="text-[10px] text-yellow-500/70 tracking-widest uppercase font-medium -mt-1">MSME Machinery Specialists</div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-semibold transition-all duration-200 relative group ${
                  pathname === l.to ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
                }`}
              >
                {l.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-yellow-400 transition-all duration-200 ${pathname === l.to ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 text-gray-300 hover:text-yellow-400 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-black text-xs font-black rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="hidden md:flex btn-gold text-sm"
            >
              Request Quote
            </button>
            <button className="md:hidden text-gray-300" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur border-t border-yellow-500/10 py-4">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/5 transition-all font-medium"
              >
                {l.label}
              </Link>
            ))}
            <div className="px-4 pt-3">
              <button onClick={() => { navigate('/cart'); setMobileOpen(false); }} className="btn-gold w-full justify-center">
                Request Quote
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
