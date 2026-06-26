import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, Globe, ShieldCheck, Factory, Star, ChevronRight, Zap, Award, Users } from 'lucide-react';
import { MACHINERY, addToCart } from '../data/machinery';

// Toast notification
const Toast = ({ msg, onClose }) => (
  <div className="toast" onClick={onClose}>
    <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center shrink-0">
      <ShieldCheck className="w-4 h-4 text-yellow-400" />
    </div>
    <span>{msg}</span>
  </div>
);

const HomePage = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState('');
  const featured = MACHINERY.filter(m => m.inStock).slice(0, 4);

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

  const features = [
    {
      icon: Globe,
      title: 'International Sourcing',
      desc: 'We source premium MSME machinery from international hubs across China, Germany, and Taiwan — as well as top domestic manufacturers.',
    },
    {
      icon: Truck,
      title: 'Doorstep Delivery',
      desc: 'From Delhi to Dhanbad, we handle complete logistics. Your machinery reaches your unit safely and on schedule.',
    },
    {
      icon: ShieldCheck,
      title: 'Quality Guaranteed',
      desc: 'Every machine passes our MSME-grade quality check. Only proven, durable, and efficient equipment makes our catalog.',
    },
    {
      icon: Zap,
      title: 'Same-Day Dispatch',
      desc: 'For in-stock units in select cities, we offer same-day dispatch with real-time tracking until delivery.',
    },
  ];

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center hero-gradient overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] rounded-full blur-[200px] opacity-10"
          style={{ background: 'radial-gradient(circle, #d4af37, transparent)' }} />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[150px] opacity-8"
          style={{ background: 'radial-gradient(circle, #1a3636, transparent)' }} />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <div className="badge-gold inline-flex items-center gap-2 mb-8">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                LIVE — Same-day dispatch available in Delhi NCR
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
                <span className="text-white">Bihar's most</span><br />
                <span className="gold-text italic">trusted</span><br />
                <span className="text-white">supply platform.</span>
              </h1>

              <p className="text-xl text-gray-400 leading-relaxed mb-10 max-w-lg">
                Wholesale MSME-grade machinery — sourced internationally and from across India, delivered to your doorstep with precision and care.
              </p>

              <div className="flex flex-wrap gap-4">
                <button onClick={() => navigate('/products')} className="btn-gold text-base px-8 py-4">
                  Explore Machinery <ArrowRight className="w-5 h-5" />
                </button>
                <button onClick={() => navigate('/cart')} className="btn-outline-gold text-base px-8 py-4">
                  Request Machinery Quote
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <span>4.9/5 Rating</span>
                </div>
                <div className="w-px h-5 bg-gray-700"></div>
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-yellow-400" /> GST Registered
                </span>
                <div className="w-px h-5 bg-gray-700"></div>
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-400" /> 10+ Years
                </span>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hidden lg:flex justify-center relative animate-float">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-3xl blur-xl"></div>
                <div className="relative glass-card p-1 rounded-3xl overflow-hidden"
                  style={{ border: '1px solid rgba(212,175,55,0.3)', boxShadow: '0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                  <img
                    src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600"
                    alt="Industrial Machinery"
                    className="rounded-2xl w-full max-w-md h-96 object-cover opacity-80"
                  />
                  {/* Floating stat cards */}
                  <div className="absolute top-6 left-6 glass-card px-4 py-2 rounded-xl" style={{ background: 'rgba(10,15,15,0.9)' }}>
                    <div className="text-yellow-400 font-black text-xl">500+</div>
                    <div className="text-gray-400 text-xs">Happy Clients</div>
                  </div>
                  <div className="absolute bottom-6 right-6 glass-card px-4 py-2 rounded-xl" style={{ background: 'rgba(10,15,15,0.9)' }}>
                    <div className="text-yellow-400 font-black text-xl">28+</div>
                    <div className="text-gray-400 text-xs">States Covered</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 text-xs animate-bounce">
          <span>Scroll Down</span>
          <ChevronRight className="w-4 h-4 rotate-90" />
        </div>
      </section>

      {/* STATS SECTION */}
      <section style={{ background: 'linear-gradient(135deg, rgba(26,54,54,0.3), rgba(10,15,15,0.9))', borderTop: '1px solid rgba(212,175,55,0.1)', borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                <s.icon className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-3xl font-black gold-text mb-1">{s.value}</div>
              <div className="text-gray-400 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="badge-gold inline-block mb-4">Featured Machinery</div>
            <h2 className="text-4xl font-black text-white">Top Selling <span className="gold-text">Machines</span></h2>
            <p className="text-gray-400 mt-3 max-w-xl">Premium industrial equipment trusted by 500+ MSME businesses across India.</p>
          </div>
          <Link to="/products" className="hidden md:flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(product => (
            <div key={product.id} className="product-card group cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-75 group-hover:opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                {product.tag && (
                  <span className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-md">{product.tag}</span>
                )}
                {!product.inStock && (
                  <span className="absolute top-3 right-3 bg-red-500/80 text-white text-xs font-bold px-2 py-1 rounded-md">Out of Stock</span>
                )}
              </div>
              {/* Info */}
              <div className="p-5">
                <div className="text-xs text-yellow-500/70 font-medium uppercase tracking-wide mb-1">{product.category}</div>
                <h3 className="font-bold text-white text-sm mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{product.capacity}</p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-black text-yellow-400">₹{product.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-600 line-through">₹{product.originalPrice.toLocaleString()}</div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); handleAddCart(product); }}
                    disabled={!product.inStock}
                    className="btn-gold text-xs px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + Quote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/products" className="btn-outline-gold">
            View All Machinery <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: 'linear-gradient(180deg, #060b0b, #0a1a1a)' }} className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="badge-gold inline-block mb-4">Why Choose Us</div>
            <h2 className="text-4xl font-black text-white mb-4">The <span className="gold-text">Rudra Traders</span> Advantage</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">From sourcing to delivery, we handle everything so you can focus on growing your business.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="glass-card p-8 text-center group">
                <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-500/20 transition-all">
                  <f.icon className="w-7 h-7 text-yellow-400" />
                </div>
                <h3 className="font-bold text-white text-lg mb-3">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="badge-gold inline-block mb-6">About Rudra Traders</div>
            <h2 className="text-4xl font-black text-white mb-6">
              Empowering MSMEs <span className="gold-text">Across India</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Rudra Traders is a Delhi-based MSME machinery supplier with over 10 years of industry experience. We specialize exclusively in industrial machinery — no compromises on quality, no shortcuts on delivery.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              We intentionally source machinery from across different states and internationally, ensuring our clients get the best equipment at the most competitive prices. Whether you're setting up a small processing unit or scaling up production, we have the right machinery and the expertise to guide you.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: 'Domestic Suppliers', value: '25+ States' },
                { label: 'International Sources', value: 'China, Germany, Taiwan' },
                { label: 'Delivery Time', value: '7–15 Days' },
                { label: 'After-Sales Support', value: '12 Months' },
              ].map((item, i) => (
                <div key={i} className="glass-card p-4 rounded-xl">
                  <div className="text-yellow-400 font-bold text-sm">{item.value}</div>
                  <div className="text-gray-500 text-xs mt-1">{item.label}</div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/contact')} className="btn-gold">
              Get In Touch <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500/5 rounded-3xl blur-2xl"></div>
            <div className="relative grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1565514020179-026b92b2d796?auto=format&fit=crop&q=80&w=400" alt="Machinery" className="rounded-2xl w-full h-48 object-cover opacity-70 mt-8" />
              <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400" alt="Factory" className="rounded-2xl w-full h-48 object-cover opacity-70" />
              <img src="https://images.unsplash.com/photo-1544006659-f0b21884ce1d?auto=format&fit=crop&q=80&w=400" alt="Processing" className="rounded-2xl w-full h-48 object-cover opacity-70" />
              <img src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400" alt="Equipment" className="rounded-2xl w-full h-48 object-cover opacity-70 -mt-8" />
            </div>
          </div>
        </div>
      </section>

      {toast && <Toast msg={toast} onClose={() => setToast('')} />}
    </div>
  );
};

export default HomePage;
