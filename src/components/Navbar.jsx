import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Lock, ArrowRight } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [stars, setStars] = useState([]);
  
  // Brand color cycling states
  const rudraColors = ['c-white', 'c-gold', 'c-coral', 'c-emerald'];
  const tradersColors = ['t-gray', 't-gold', 't-coral', 't-emerald'];
  const [rudraColorClass, setRudraColorClass] = useState(rudraColors[0]);
  const [tradersColorClass, setTradersColorClass] = useState(tradersColors[0]);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Scroll handler for background effects
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cart count synchronization
  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('rudra_cart') || '[]');
      setCartCount(cart.reduce((a, i) => a + i.quantity, 0));
    };
    updateCart();
    window.addEventListener('cart_updated', updateCart);
    return () => window.removeEventListener('cart_updated', updateCart);
  }, [pathname]);

  // Dynamically generate starry background stars
  useEffect(() => {
    const spawnStars = () => {
      const w = window.innerWidth;
      const count = Math.max(15, Math.min(35, Math.floor(w / 40)));
      const newStars = Array.from({ length: count }).map((_, i) => {
        const isBig = Math.random() < 0.12;
        return {
          id: i,
          big: isBig,
          size: isBig ? (2 + Math.random() * 1.5) : (1 + Math.random() * 1.6),
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          dur: `${1.6 + Math.random() * 2.6}s`,
          minOp: (0.15 + Math.random() * 0.25).toFixed(2),
          ddur: `${18 + Math.random() * 22}s`,
          dx: `${(Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 40)}px`,
          delay: `${Math.random() * 3}s, ${Math.random() * 6}s`
        };
      });
      setStars(newStars);
    };

    spawnStars();
    window.addEventListener('resize', spawnStars);
    return () => window.removeEventListener('resize', spawnStars);
  }, []);

  const cycleRudraColor = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const currentIndex = rudraColors.indexOf(rudraColorClass);
    const nextIndex = (currentIndex + 1) % rudraColors.length;
    setRudraColorClass(rudraColors[nextIndex]);
  };

  const cycleTradersColor = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const currentIndex = tradersColors.indexOf(tradersColorClass);
    const nextIndex = (currentIndex + 1) % tradersColors.length;
    setTradersColorClass(tradersColors[nextIndex]);
  };

  const links = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/machinery', label: 'Machinery' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`sticky top-0 z-50 w-full flex justify-center py-3 px-4 md:px-8 transition-all duration-300 ${scrolled ? 'bg-[#0a0806]/40 backdrop-blur-md' : 'bg-transparent'}`}>
      
      {/* Volumetric Island Navbar */}
      <div id="navbar" className="navbar-starry relative w-full max-w-7xl rounded-2xl px-5 md:px-8 py-3 flex items-center justify-between">
        
        {/* Star Field & Shooting Star */}
        <div className="star-field">
          {stars.map(s => (
            <div
              key={s.id}
              className={`star ${s.big ? 'big' : ''}`}
              style={{
                width: `${s.size}px`,
                height: `${s.size}px`,
                left: s.left,
                top: s.top,
                '--dur': s.dur,
                '--min-op': s.minOp,
                '--ddur': s.ddur,
                '--dx': s.dx,
                animationDelay: s.delay
              }}
            />
          ))}
        </div>
        <div className="shooting-star"></div>

        {/* Brand Logo & Same-line typography with separate clicks */}
        <Link to="/" className="relative z-10 flex items-center gap-3 select-none" onClick={() => setMobileOpen(false)}>
          <div className="brand-logo-3d w-9 h-9 md:w-10 md:h-10 rounded-xl text-white font-black text-base md:text-lg flex-shrink-0">
            R
          </div>
          <div className="brand-text-3d text-[1.1rem] md:text-[1.25rem] font-black uppercase tracking-wider">
            <span className={`brand-text-rudra ${rudraColorClass}`} onClick={cycleRudraColor}>Rudra</span>
            <span className={`brand-text-traders ${tradersColorClass}`} onClick={cycleTradersColor}>Traders</span>
          </div>
        </Link>

        {/* Desktop Links - Centered */}
        <div className="hidden md:flex items-center gap-2 relative z-10">
          {links.map(l => {
            const isActive = pathname === l.to || (l.to === '/' && pathname === '/');
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`nav-link-3d text-sm font-semibold transition-all ${
                  isActive 
                  ? 'nav-link-3d-active text-white' 
                  : 'text-gray-300 hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 relative z-10">
          <button className="icon-btn-3d text-gray-300 hover:text-white transition-colors hidden md:flex">
            <Search className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          {/* Admin Button */}
          <button
            onClick={() => { navigate('/admin'); setMobileOpen(false); }}
            className="admin-pill-3d header-admin-btn flex items-center gap-1.5 transition-all text-xs font-bold uppercase tracking-wider"
            title="Admin Portal"
          >
            <Lock className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          {/* Cart */}
          <button
            onClick={() => { navigate('/cart'); setMobileOpen(false); }}
            className="icon-btn-3d text-gray-300 hover:text-white"
            aria-label="Cart"
          >
            <ShoppingCart className="w-4.5 h-4.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F05A5A] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(240,90,90,0.6)]">
                {cartCount}
              </span>
            )}
          </button>

          {/* Order Now — desktop/tablet only */}
          <button
            onClick={() => navigate('/cart')}
            className="order-btn-3d header-order-btn text-sm ml-1"
          >
            Order Now <ArrowRight className="w-4 h-4" />
          </button>

          {/* Custom Animated Hamburger — mobile only */}
          <button 
            className={`hamburger-btn-3d md:hidden ml-1 ${mobileOpen ? 'open' : ''}`} 
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileOpen && (
          <div className="mobile-menu-panel md:hidden">
            {links.map((l) => {
              const isActive = pathname === l.to || (l.to === '/' && pathname === '/');
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className={`mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}
                >
                  {l.label}
                </Link>
              );
            })}
            <div className="mobile-menu-action">
              <button
                onClick={() => { navigate('/cart'); setMobileOpen(false); }}
                className="order-btn-3d w-full justify-center"
              >
                Order Now <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
