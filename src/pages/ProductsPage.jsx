import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, ShoppingCart, SlidersHorizontal, X, ShieldCheck } from 'lucide-react';
import { CATEGORIES, addToCart } from '../data/machinery';
import { useMachinery } from '../hooks/useMachinery';

const Toast = ({ msg, onClose }) => (
  <div className="toast" onClick={onClose}>
    <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center shrink-0">
      <ShieldCheck className="w-4 h-4 text-yellow-400" />
    </div>
    <span>{msg}</span>
  </div>
);

const ProductsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [toast, setToast] = useState('');
  const { machinery: MACHINERY, loading } = useMachinery();

  const handleAddCart = (product, e) => {
    e.stopPropagation();
    if (!product.inStock) return;
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
    <div className="pt-28 min-h-screen max-w-7xl mx-auto px-6 pb-20">
      {/* Page Header */}
      <div className="mb-10">
        <div className="badge-gold inline-block mb-4">MSME Machinery Catalog</div>
        <h1 className="text-4xl font-black text-white mb-3">Industrial <span className="gold-text">Machinery</span></h1>
        <p className="text-gray-400 max-w-2xl">High-performance, MSME-grade industrial equipment. Add to cart to generate your custom quotation instantly.</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search machinery..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-dark pl-12 bg-[#4a2e1b]/80 border-white/20 focus:border-[#d4af37]"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="input-dark md:w-52 cursor-pointer bg-[#4a2e1b]/80 border-white/20 hover:border-[#d4af37] focus:border-[#d4af37]"
        >
          <option value="default">Sort By: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-3 mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              category === cat
                ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:border-yellow-500/40 hover:text-yellow-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-gray-500 text-sm mb-6">
        Showing <span className="text-yellow-400 font-semibold">{filtered.length}</span> machines
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
            <div key={product.id} className="glass-card rounded-2xl overflow-hidden group cursor-pointer hover-float border border-white/10 hover:border-white/30 transition-all" onClick={() => navigate(`/products/${product.id}`)}>
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
                {!product.inStock && (
                  <span className="absolute top-3 right-3 bg-red-600/90 text-white text-xs font-bold px-2 py-1 rounded-md">Out of Stock</span>
                )}
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-yellow-500/0 group-hover:bg-yellow-500/5 transition-all duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium bg-black/60 px-4 py-2 rounded-full transition-all">View Details</span>
                </div>
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
                    disabled={!product.inStock}
                    className="btn-coral w-full justify-center text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Quote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast msg={toast} onClose={() => setToast('')} />}
    </div>
  );
};

export default ProductsPage;
