import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, CheckCircle2, Package, Truck, Shield, ChevronRight, ShieldCheck } from 'lucide-react';
import { MACHINERY, addToCart } from '../data/machinery';

const Toast = ({ msg }) => (
  <div className="toast">
    <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center shrink-0">
      <ShieldCheck className="w-4 h-4 text-yellow-400" />
    </div>
    <span>{msg}</span>
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = MACHINERY.find(m => String(m.id) === String(id));
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState('');

  if (!product) return (
    <div className="pt-32 text-center min-h-screen">
      <h2 className="text-2xl text-white">Product not found</h2>
      <Link to="/products" className="btn-gold mt-6 inline-flex">Go Back</Link>
    </div>
  );

  const handleAddCart = () => {
    addToCart(product, qty);
    setToast(`${product.name} added to quote!`);
    setTimeout(() => setToast(''), 3000);
  };

  const related = MACHINERY.filter(m => m.category === product.category && m.id !== product.id).slice(0, 3);

  return (
    <div className="pt-28 min-h-screen max-w-7xl mx-auto px-6 pb-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/products" className="hover:text-yellow-400 transition-colors">Machinery</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-300">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
        {/* Image */}
        <div className="relative">
          <div className="glass-card p-2 overflow-hidden rounded-2xl">
            <img src={product.image} alt={product.name} className="w-full h-96 lg:h-[500px] object-cover rounded-xl opacity-85" />
          </div>
          {product.tag && (
            <span className="absolute top-6 left-6 bg-yellow-500 text-black text-sm font-bold px-3 py-1.5 rounded-lg">{product.tag}</span>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="text-sm text-yellow-500/70 font-semibold uppercase tracking-widest mb-3">{product.category}</div>
          <h1 className="text-3xl font-black text-white mb-4 leading-tight">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
              ))}
            </div>
            <span className="text-white font-bold">{product.rating}</span>
            <span className="text-gray-500 text-sm">({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4 mb-8 p-6 glass-card rounded-2xl">
            <div className="text-4xl font-black gold-text">₹{product.price.toLocaleString()}</div>
            <div className="text-xl text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</div>
            <div className="bg-green-500/20 text-green-400 text-sm font-bold px-3 py-1 rounded-full">
              Save ₹{(product.originalPrice - product.price).toLocaleString()}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-400 leading-relaxed mb-6">{product.description}</p>

          {/* Features */}
          <div className="mb-8">
            <h3 className="font-bold text-white mb-4">Key Features</h3>
            <div className="grid grid-cols-1 gap-2">
              {product.features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Capacity */}
          <div className="flex items-center gap-3 mb-8 p-4 glass-card rounded-xl">
            <Package className="w-5 h-5 text-yellow-400" />
            <div>
              <span className="text-sm text-gray-400">Capacity: </span>
              <span className="font-bold text-white">{product.capacity}</span>
            </div>
          </div>

          {/* Qty + Add */}
          {product.inStock !== false ? (
            <div className="flex gap-4 items-center mb-6">
              <div className="flex items-center gap-3 glass-card px-4 py-3 rounded-xl">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-full bg-yellow-500/10 hover:bg-yellow-500/20 text-white font-bold flex items-center justify-center transition-all">-</button>
                <span className="w-8 text-center font-bold text-white text-lg">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-8 h-8 rounded-full bg-yellow-500/10 hover:bg-yellow-500/20 text-white font-bold flex items-center justify-center transition-all">+</button>
              </div>
              <button onClick={handleAddCart} className="btn-gold flex-1 justify-center py-4 text-base">
                <ShoppingCart className="w-5 h-5" /> Add to Quote Request
              </button>
            </div>
          ) : (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center font-medium mb-6">
              Currently Out of Stock
            </div>
          )}

          <button onClick={() => navigate('/cart')} className="btn-outline-gold w-full justify-center">
            View Quote Cart
          </button>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8" style={{ borderTop: '1px solid rgba(212,175,55,0.1)' }}>
            {[
              { icon: Truck, label: 'Doorstep Delivery' },
              { icon: Shield, label: 'Quality Assured' },
              { icon: Package, label: 'Safe Packaging' },
            ].map((b, i) => (
              <div key={i} className="text-center">
                <b.icon className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-xs text-gray-400 font-medium">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-black text-white mb-8">Related <span className="gold-text">Machinery</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map(p => (
              <div key={p.id} className="product-card cursor-pointer" onClick={() => navigate(`/products/${p.id}`)}>
                <img src={p.image} alt={p.name} className="w-full h-40 object-cover opacity-75 rounded-t-2xl" />
                <div className="p-4">
                  <h3 className="font-bold text-white text-sm mb-1">{p.name}</h3>
                  <div className="text-yellow-400 font-black">₹{p.price.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {toast && <Toast msg={toast} />}
    </div>
  );
};

export default ProductDetailPage;
