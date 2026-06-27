import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, Factory, Truck, Award, Star, ArrowRight } from 'lucide-react';
import { addToCart } from '../data/machinery';
import { useMachinery } from '../hooks/useMachinery';

const Toast = ({ msg, onClose }) => (
  <div className="toast" onClick={onClose}>
    <div className="w-8 h-8 bg-[#1B4543] rounded-full flex items-center justify-center shrink-0">
      <ShieldCheck className="w-4 h-4 text-white" />
    </div>
    <span>{msg}</span>
  </div>
);

const HomePage = () => {
  const navigate = useNavigate();
  const { machinery: MACHINERY, loading } = useMachinery();
  const [toast, setToast] = useState('');
  const featured = MACHINERY.filter(m => m.stockQuantity !== 0).slice(0, 4);

  const handleAddCart = (product) => {
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
    <div>
      {/* HERO SECTION - MATCHING SCREENSHOT EXACTLY */}
      <section className="relative min-h-[90vh] flex items-center pt-10 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="pt-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#d4af37]/40 bg-black/10 text-[#d4af37] text-xs font-medium mb-8 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></span>
                LIVE — Same-day dispatch available in Gaya
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold leading-[0.95] tracking-tight mb-8 text-[#eaddcf]" style={{ textShadow: '2px 4px 10px rgba(0,0,0,0.3)' }}>
                Bihar's most<br />
                <span className="font-serif italic coral-text font-normal block py-2">trusted</span>
                supply<br />
                platform.
              </h1>

              <p className="text-[17px] text-[#c0b0a0] leading-relaxed mb-10 max-w-lg font-medium">
                Wholesale essentials, MSME-grade machinery and bulk goods — sourced with care, delivered with discipline. Built in Gaya, made for every business in Bihar.
              </p>

              <div className="flex flex-wrap gap-4">
                <button onClick={() => navigate('/products')} className="btn-coral">
                  Explore Catalog
                </button>
                <button onClick={() => navigate('/cart')} className="btn-white">
                  Request Machinery Quote
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative animate-float pt-10 lg:pt-0">
              {/* Optional glow behind image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#6c8672]/20 blur-[100px] rounded-full mix-blend-screen"></div>
              
              <img 
                src="/hero-image.png" 
                alt="Bihar Logistics" 
                className="w-full h-auto object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
                style={{ transform: 'scale(1.15)', transformOrigin: 'center right' }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="border-y border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-black text-[#d4af37] mb-1">{s.value}</div>
              <div className="text-[#a09080] text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="badge-gold inline-block mb-4">Top Rated</div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Featured <span className="gold-text">Machinery</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Explore our best-selling industrial equipment designed for high efficiency.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="glass-card rounded-2xl h-80 animate-pulse bg-white/5 border border-white/5 hover-float"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {MACHINERY.slice(0, 4).map(product => (
              <div key={product.id} className="glass-card rounded-2xl overflow-hidden group cursor-pointer border border-white/10 hover:border-white/30 transition-all" onClick={() => navigate(`/products/${product.id}`)}>
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-black/40">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" />
                </div>
                {/* Info */}
                <div className="p-5">
                  <div className="text-xs text-[#d4af37] font-medium uppercase tracking-wide mb-1">{product.category}</div>
                  <h3 className="font-bold text-white text-sm mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-[#a09080] mb-4">{product.capacity}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-white">₹{product.price.toLocaleString()}</div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); handleAddCart(product); }}
                      className="btn-coral px-4 py-1.5 text-xs rounded-lg"
                    >
                      Add
                    </button>
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
