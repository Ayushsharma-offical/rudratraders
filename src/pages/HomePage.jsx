import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, Factory, Truck, Award, Star, ArrowRight, Zap } from 'lucide-react';
import { addToCart } from '../data/machinery';
import { useMachinery } from '../hooks/useMachinery';
import SEO from '../components/SEO';

const Toast = ({ msg, onClose }) => (
  <div className="toast" onClick={onClose} style={{ zIndex: 999 }}>
    <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
      <ShieldCheck className="w-4 h-4 text-emerald-400" />
    </div>
    <span>{msg}</span>
  </div>
);

const HomePage = () => {
  const navigate = useNavigate();
  const { machinery: MACHINERY, loading } = useMachinery();
  const [toast, setToast] = useState('');
  
  // Create ambient particles
  useEffect(() => {
    if (document.getElementById('home-custom-styles')) return;
    const style = document.createElement('style');
    style.id = 'home-custom-styles';
    style.textContent = `
      .ambient-orb {
        position: absolute; filter: blur(120px); border-radius: 50%; opacity: 0.4;
        animation: orbFloat 20s ease-in-out infinite alternate; pointer-events: none; z-index: 0;
      }
      .orb-1 { width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(255,122,61,0.15), transparent 70%); top: -10%; left: -10%; }
      .orb-2 { width: 40vw; height: 40vw; background: radial-gradient(circle, rgba(23,192,129,0.12), transparent 70%); bottom: -10%; right: -5%; animation-delay: -5s; }
      .orb-3 { width: 30vw; height: 30vw; background: radial-gradient(circle, rgba(224,178,61,0.1), transparent 70%); top: 40%; left: 30%; animation-delay: -10s; }
      
      @keyframes orbFloat {
        0% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(5%, 10%) scale(1.1); }
        100% { transform: translate(-5%, -5%) scale(0.9); }
      }
      
      .hero-title {
        background: linear-gradient(180deg, #fff, #eaddcf);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 10px 40px rgba(255,255,255,0.1);
      }
      
      .hero-italic {
        background: linear-gradient(135deg, #ff7a3d, #ffb066);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 40px rgba(255,122,61,0.4);
      }
      
      .glass-badge {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(224,178,61,0.3);
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1);
        position: relative; overflow: hidden;
      }
      .glass-badge::after {
        content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        animation: shine 4s ease-in-out infinite;
      }
      @keyframes shine { 100% { left: 200%; } }

      .btn-glow-coral {
        background: linear-gradient(135deg, #ff4d4d, #ff7a3d);
        color: white; font-weight: 700; border-radius: 999px; padding: 14px 28px;
        box-shadow: 0 10px 30px rgba(255,77,77,0.3), inset 0 1px 0 rgba(255,255,255,0.3);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      }
      .btn-glow-coral:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 15px 40px rgba(255,77,77,0.5); }
      
      .btn-glow-white {
        background: rgba(255,255,255,0.95);
        color: #1a0f08; font-weight: 800; border-radius: 999px; padding: 14px 28px;
        box-shadow: 0 10px 30px rgba(255,255,255,0.15);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        display: inline-flex; align-items: center; justify-content: center; gap: 8px; border: 1px solid rgba(255,255,255,1);
      }
      .btn-glow-white:hover { transform: translateY(-3px) scale(1.02); background: white; box-shadow: 0 15px 40px rgba(255,255,255,0.3); }

      .film-grain {
        position: absolute; inset: 0; z-index: 1; pointer-events: none; opacity: 0.04; mix-blend-mode: overlay;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      }
    `;
    document.head.appendChild(style);
  }, []);

  const handleAddCart = (product, e) => {
    e.stopPropagation();
    addToCart(product);
    setToast(`${product.name} added to quote!`);
    setTimeout(() => setToast(''), 3000);
  };

  const stats = [
    { label: 'Happy Clients', value: '500+', icon: Users },
    { label: 'Machinery Types', value: '50+', icon: Factory },
    { label: 'States Delivered', value: '28+', icon: Truck },
    { label: 'Years Experience', value: '10+', icon: Award },
  ];

  return (
    <div className="relative bg-[#08070a] min-h-screen text-white overflow-hidden">
      {/* Ambient Background */}
      <div className="film-grain"></div>
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-24 pb-20 lg:pt-32 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center text-center lg:text-left">
            
            {/* Left Content */}
            <div className="relative z-20 flex flex-col items-center lg:items-start">
              <div className="glass-badge inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[#e0b23d] text-xs font-bold tracking-wide mb-8">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e0b23d] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#d4af37]"></span>
                </div>
                LIVE — Same-day dispatch available in Gaya
              </div>

              <h1 className="text-[3.5rem] sm:text-7xl md:text-8xl lg:text-[6rem] font-bold leading-[0.9] tracking-tighter mb-8 hero-title">
                Bihar's most<br />
                <span className="font-serif italic font-normal block py-2 lg:py-4 hero-italic">trusted</span>
                supply<br />
                platform.
              </h1>

              <p className="text-[17px] sm:text-lg text-[#a89e8f] leading-relaxed mb-10 max-w-lg font-medium drop-shadow-sm">
                Wholesale essentials, MSME-grade machinery and bulk goods — sourced with care, delivered with discipline. Built in Gaya, made for every business in Bihar.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start">
                <button onClick={() => navigate('/products')} className="btn-glow-coral w-full sm:w-auto">
                  Explore Catalog <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => navigate('/cart')} className="btn-glow-white w-full sm:w-auto">
                  Request Machinery Quote
                </button>
              </div>
            </div>

            {/* Right Image with Float Effect */}
            <div className="relative animate-float pt-4 lg:pt-0 group z-10 w-full max-w-lg mx-auto lg:max-w-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#ff7a3d]/20 to-[#17c081]/20 blur-[80px] rounded-full mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <img 
                src="/hero-image.png" 
                alt="Bihar Logistics" 
                className="w-full h-auto object-contain relative z-10 drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-transform duration-700 group-hover:scale-[1.03]" 
                style={{ transformOrigin: 'center right' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="relative z-20 border-y border-white/5 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((s, i) => (
            <div key={i} className="text-center group">
              <div className="w-12 h-12 mx-auto mb-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-[#e0b23d] group-hover:bg-[#e0b23d]/10 group-hover:scale-110 transition-all duration-300">
                <s.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white mb-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{s.value}</div>
              <div className="text-[#a89e8f] text-xs sm:text-sm font-semibold tracking-wide uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="relative z-20 py-24 lg:py-32 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#17c081]/10 text-[#17c081] text-xs font-bold uppercase tracking-widest border border-[#17c081]/20 mb-6">
            <Zap className="w-3.5 h-3.5" /> Top Rated
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 tracking-tight">Featured <span className="hero-italic">Machinery</span></h2>
          <p className="text-[#a89e8f] max-w-2xl mx-auto text-lg">Explore our best-selling industrial equipment designed for high efficiency and maximum output.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="glass-card rounded-3xl h-80 animate-pulse bg-white/5 border border-white/5"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {MACHINERY.slice(0, 4).map(product => (
              <div key={product.id} className="relative group cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
                {/* Glow behind card */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#ff7a3d]/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl -z-10"></div>
                
                <div className="h-full rounded-3xl overflow-hidden bg-[#111] border border-white/10 group-hover:border-[#ff7a3d]/50 transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-black shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-bold text-white">{product.rating}</span>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-6 relative flex flex-col flex-1">
                    <div className="text-xs text-[#ffb066] font-bold uppercase tracking-wider mb-2">{product.category}</div>
                    <h3 className="font-bold text-white text-lg mb-2 line-clamp-1 group-hover:text-[#ffb066] transition-colors">{product.name}</h3>
                    <p className="text-sm text-[#a89e8f] mb-6 font-medium">{product.capacity}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-xl font-black text-white tracking-tight">₹{product.price.toLocaleString()}</div>
                      <button
                        onClick={e => handleAddCart(product, e)}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#ff7a3d] flex items-center justify-center text-white transition-all duration-300 border border-white/20 hover:border-[#ff7a3d] group/btn"
                      >
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {toast && <Toast msg={toast} onClose={() => setToast('')} />}
    </div>
  );
};

export default HomePage;
