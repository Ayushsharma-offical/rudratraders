import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, ShoppingCart, SlidersHorizontal, X, ShieldCheck } from 'lucide-react';
import { CATEGORIES, addToCart } from '../data/machinery';
import { useMachinery } from '../hooks/useMachinery';
import SEO from '../components/SEO';

const Toast = ({ msg, onClose }) => (
  <div className="toast" onClick={onClose}>
    <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center shrink-0">
      <ShieldCheck className="w-4 h-4 text-yellow-400" />
    </div>
    <span>{msg}</span>
  </div>
);

const TiltCard = ({ children, onClick }) => {
  const cardRef = useRef(null);
  const handleMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotY = (x - 0.5) * 18;
    const rotX = (0.5 - y) * 14;
    el.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px) scale(1.025)`;
    el.style.boxShadow = `${-rotY * 1.5}px ${rotX * 1.5}px 40px -10px rgba(245,171,61,0.25), 0 20px 60px -20px rgba(0,0,0,0.7)`;
  };
  const handleLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
    el.style.boxShadow = '';
  };
  return (
    <div ref={cardRef} onClick={onClick} onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{ transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out', willChange: 'transform', transformStyle: 'preserve-3d', cursor: 'pointer' }}
    >
      {children}
    </div>
  );
};

const ProductsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [toast, setToast] = useState('');
  const { machinery: MACHINERY, loading } = useMachinery();

  const handleAddCart = (product, e) => {
    e.stopPropagation();
    if (product.inStock === false) return;
    addToCart(product);
    setToast(`${product.name} added to quote!`);
    setTimeout(() => setToast(''), 3000);
  };

  let filtered = MACHINERY
    .filter(m => category === 'All' || m.category === category)
    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.category.toLowerCase().includes(search.toLowerCase()));

  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <div className="relative min-h-screen pb-20 overflow-hidden">
      {/* Background glow effects based on the image */}
      <div className="absolute top-0 left-0 w-full h-screen pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-orange-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute top-[10%] -right-[10%] w-[40%] h-[60%] bg-emerald-900/10 blur-[120px] rounded-full"></div>
      </div>
      
      <div className="pt-28 max-w-7xl mx-auto px-6 relative z-10">
        {/* Page Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-500 text-xs font-bold tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            MSME MACHINERY CATALOG
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Industrial <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-400">Machinery</span></h1>
          <p className="text-gray-300 text-lg max-w-2xl">High-performance, MSME-grade industrial equipment. Add to cart to generate your custom quotation instantly.</p>
        </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search machinery..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-10 h-12 bg-[#121212]/80 border border-white/10 hover:border-white/20 focus:border-orange-500/50 rounded-2xl text-white outline-none transition-all text-sm font-medium backdrop-blur-md"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="relative sm:w-64">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="w-full h-12 appearance-none pl-5 pr-10 bg-[#121212]/80 border border-white/10 hover:border-white/20 focus:border-emerald-500/50 rounded-2xl text-white outline-none transition-all text-sm font-medium cursor-pointer backdrop-blur-md"
          >
            <option value="default" className="bg-[#121212]">Sort By: Default</option>
            <option value="price-asc" className="bg-[#121212]">Price: Low to High</option>
            <option value="price-desc" className="bg-[#121212]">Price: High to Low</option>
            <option value="rating" className="bg-[#121212]">Highest Rated</option>
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-3 mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              category === cat
                ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-black shadow-[0_0_20px_rgba(249,115,22,0.3)] border border-orange-400'
                : 'bg-[#121212]/80 text-gray-400 border border-white/10 hover:border-white/20 hover:text-white hover:bg-white/5 backdrop-blur-md'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-gray-400 text-lg mb-8 font-medium">
        Showing <span className="text-orange-500 font-bold">{filtered.length}</span> machines
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="glass-card rounded-2xl h-80 animate-pulse bg-white/5 border border-white/5"></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">No machines found</h3>
          <p className="text-gray-400">Try a different search or category</p>
          <button onClick={() => { setSearch(''); setCategory('All'); }} className="btn-outline-gold mt-6">Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(product => (
            <TiltCard key={product.id}>
              <div className="glass-card rounded-2xl overflow-hidden group border border-white/10 hover:border-yellow-500/30 transition-colors">
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-75 group-hover:opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  {product.tag && (
                    <span className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-md">{product.tag}</span>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="text-xs text-yellow-500/70 font-semibold uppercase tracking-wide mb-1">{product.category}</div>
                  <h3 className="font-bold text-white text-sm mb-1 line-clamp-2 leading-snug">{product.name}</h3>
                  <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                    <SlidersHorizontal className="w-3 h-3" /> {product.capacity}
                  </p>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                  </div>

                  <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xl font-bold text-white">₹{product.price.toLocaleString()}</div>
                        <div className="text-xs text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</div>
                      </div>
                      <div className="text-xs text-green-400 font-medium bg-green-400/10 px-2 py-1 rounded-md">
                        Save ₹{(product.originalPrice - product.price).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={e => handleAddCart(product, e)}
                      className="btn-coral w-full justify-center text-sm"
                    >
                      <ShoppingCart className="w-4 h-4" /> Add to Quote
                    </button>
                  </div>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      )}

      {toast && <Toast msg={toast} onClose={() => setToast('')} />}
      </div>
    </div>
  );
};

export default ProductsPage;
