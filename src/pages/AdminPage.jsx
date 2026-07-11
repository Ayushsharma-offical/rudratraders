import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { rtdb } from '../firebase';
import { ref, get, push, update, remove } from 'firebase/database';
import {
  LayoutDashboard, Package, FileText, LogOut, TrendingUp,
  Users, DollarSign, Plus, X, CheckCircle2, Trash2, Download,
  Save, Upload, ImageIcon
} from 'lucide-react';
import { useMachinery } from '../hooks/useMachinery';
import { CATEGORIES } from '../data/machinery';
import { generateQuotation } from '../utils/generateQuotation';
import { generateAdvanceReceipt } from '../utils/generateAdvanceReceipt';

// ============================================================
// LOGIN SCREEN
// ============================================================
const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (email === 'admin@rudratraders.com' && password === 'admin123') {
        localStorage.setItem('rudra_admin', 'true');
        window.location.reload();
      } else {
        setError('Invalid credentials. Please try again.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4">
      <div className="glass-card p-10 rounded-3xl w-full max-w-md hover-float" style={{ border: '1px solid rgba(212,175,55,0.3)' }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-2xl flex items-center justify-center text-black font-black text-2xl mx-auto mb-4 shadow-lg shadow-yellow-900/50">R</div>
          <h1 className="text-2xl font-black text-white">Admin Portal</h1>
          <p className="text-gray-400 text-sm mt-1">Rudra Traders Management System</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email Address</label>
            <input type="email" className="input-dark" style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.1)' }} placeholder="admin@rudratraders.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Password</label>
            <input type="password" className="input-dark" style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.1)' }} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</div>}
          <button type="submit" disabled={loading} className="btn-gold w-full justify-center mt-2 disabled:opacity-50">
            {loading ? 'Signing In...' : 'Sign In to Dashboard'}
          </button>
        </form>
        <div className="mt-6 p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl text-xs text-gray-500 text-center">
          🔒 Secure admin access only
        </div>
        <button onClick={() => navigate('/')} className="mt-4 text-gray-400 hover:text-white text-sm w-full flex items-center justify-center gap-2 transition-colors">
          ← Exit to Website
        </button>
      </div>
    </div>
  );
};

// ============================================================
// SIDEBAR (responsive: drawer on mobile, inline on desktop)
// ============================================================
const Sidebar = ({ active, setActive, onLogout, open, setOpen }) => {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'catalog', label: 'Machinery Catalog', icon: Package },
    { id: 'quotation', label: 'Generate Quotation', icon: FileText },
    { id: 'requests', label: 'Client Requests', icon: Users },
  ];

  const handleSelect = (id) => {
    setActive(id);
    setOpen(false); // close drawer on mobile after selecting
  };

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/70 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 left-0 h-full z-50 flex flex-col border-r border-white/5 transition-transform duration-300
          md:static md:translate-x-0 md:shrink-0
          ${ open ? 'translate-x-0' : '-translate-x-full md:translate-x-0' }`}
        style={{ width: '240px', background: 'rgba(10,5,2,0.98)', backdropFilter: 'blur(20px)' }}
      >
        {/* Sidebar Header */}
        <div className="p-5 flex items-center gap-3 border-b border-white/5">
          <div className="w-9 h-9 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl flex items-center justify-center text-black font-black text-sm">R</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-black gold-text truncate">RUDRA TRADERS</div>
            <div className="text-[10px] font-black tracking-widest uppercase bg-red-600 text-white px-2 py-0.5 rounded shadow-lg shadow-red-900/50 inline-block mt-0.5">ADMIN</div>
          </div>
          {/* Close button on mobile */}
          <button onClick={() => setOpen(false)} className="md:hidden text-gray-400 hover:text-white ml-auto">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                active === item.id
                  ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/5">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

// ============================================================
// DASHBOARD
// ============================================================
const DashboardOverview = ({ machinery, loading }) => {
  const inStock = machinery.filter(m => (m.stockQuantity ?? 10) > 0).length;
  const avgPrice = machinery.length ? Math.round(machinery.reduce((a, m) => a + Number(m.price || 0), 0) / machinery.length) : 0;
  const stats = [
    { label: 'Total Products', value: machinery.length, icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'In Stock', value: inStock, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Avg. Price', value: `₹${avgPrice.toLocaleString()}`, icon: DollarSign, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Categories', value: [...new Set(machinery.map(m => m.category))].length, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div>
      <h2 className="text-xl font-black text-white mb-5">Dashboard Overview</h2>
      {/* Stats — 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="glass-card p-4 rounded-2xl border border-white/5">
            <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className={`text-2xl font-black mb-0.5 ${s.color}`}>{loading ? <span className="animate-pulse text-base">...</span> : s.value}</div>
            <div className="text-gray-400 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Machinery summary — card list on mobile, table on desktop */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        <div className="p-4 border-b border-white/5">
          <h3 className="font-bold text-white text-sm">Machinery Summary</h3>
        </div>
        {/* Mobile card list */}
        <div className="md:hidden divide-y divide-white/5">
          {loading
            ? <div className="p-4 text-center text-gray-500 animate-pulse text-sm">Loading...</div>
            : machinery.map(m => {
              const qty = m.stockQuantity ?? 10;
              return (
                <div key={m.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold text-sm truncate">{m.name}</div>
                    <div className="text-gray-500 text-xs">{m.category}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-yellow-400 font-bold text-sm">₹{Number(m.price || 0).toLocaleString()}</div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${qty > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {qty > 0 ? `Qty: ${qty}` : 'Out'}
                    </span>
                  </div>
                </div>
              );
            })
          }
        </div>
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>Machine Name</th><th>Category</th><th>Price</th><th>Stock Qty</th><th>Status</th></tr>
            </thead>
            <tbody>
              {loading
                ? <tr><td colSpan="5" className="text-center py-8 text-gray-500 animate-pulse">Loading...</td></tr>
                : machinery.map(m => {
                  const qty = m.stockQuantity ?? 10;
                  return (
                    <tr key={m.id}>
                      <td className="text-white font-medium">{m.name}</td>
                      <td className="text-gray-400">{m.category}</td>
                      <td className="text-yellow-400 font-bold">₹{Number(m.price || 0).toLocaleString()}</td>
                      <td className="text-white font-bold">{qty}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${qty > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {qty > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// IMAGE INPUT (base64, no storage needed)
// ============================================================
const ImageInput = ({ value, onChange }) => {
  const [converting, setConverting] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const pasteRef = useRef(null);

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setConverting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 600;
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setPreview(dataUrl);
        onChange(dataUrl);
        setConverting(false);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        processFile(items[i].getAsFile());
        return;
      }
      if (items[i].type === 'text/plain') {
        items[i].getAsString(str => {
          if (str.startsWith('http')) { setPreview(str); onChange(str); }
        });
      }
    }
  };

  return (
    <div>
      <div
        ref={pasteRef}
        onPaste={handlePaste}
        tabIndex={0}
        className="relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer focus:outline-none focus:border-yellow-400/60 transition-all outline-none"
        style={{ borderColor: 'rgba(212,175,55,0.3)', background: 'rgba(0,0,0,0.3)' }}
        onClick={() => pasteRef.current?.focus()}
      >
        {converting ? (
          <div className="py-6 text-yellow-400 flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Processing...</span>
          </div>
        ) : preview ? (
          <div className="relative">
            <img src={preview} alt="preview" className="w-full h-32 object-cover rounded-lg" />
            <button type="button" onClick={e => { e.stopPropagation(); setPreview(''); onChange(''); }}
              className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors">
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center gap-2">
            <ImageIcon className="w-8 h-8 text-gray-500" />
            <p className="text-sm text-gray-300">Click here then <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-yellow-400 text-xs font-mono">Ctrl+V</kbd> to paste</p>
            <p className="text-xs text-gray-500">Or use the button below</p>
          </div>
        )}
      </div>
      <label className="mt-2 flex items-center gap-2 cursor-pointer btn-outline-gold text-xs w-full justify-center py-2">
        <Upload className="w-3 h-3" /> Choose from Computer
        <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
      </label>
      <input type="text" className="input-dark text-sm mt-2" style={{ background: 'rgba(0,0,0,0.3)' }}
        placeholder="Or paste image URL (https://...)"
        value={preview?.startsWith('data:') ? '' : (preview || '')}
        onChange={e => { setPreview(e.target.value); onChange(e.target.value); }}
      />
    </div>
  );
};

// ============================================================
// CATALOG CRUD (Realtime Database)
// ============================================================
const CatalogView = ({ machinery, refetch, loading }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const blankForm = { name: '', category: 'Feed Processing', capacity: '', price: '', originalPrice: '', image: '', description: '', stockQuantity: 10 };
  const [formData, setFormData] = useState(blankForm);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { alert('Please enter machine name.'); return; }
    setSaving(true);
    try {
      await push(ref(rtdb, 'machinery'), {
        ...formData,
        price: Number(formData.price) || 0,
        originalPrice: Number(formData.originalPrice) || 0,
        stockQuantity: Number(formData.stockQuantity) || 0,
        rating: 5.0, reviews: 0,
      });
      setShowAdd(false);
      setFormData(blankForm);
      refetch();
    } catch (err) { console.error(err); alert('Failed to save. Check database rules.'); }
    setSaving(false);
  };

  const handleStockQty = async (id, qty) => {
    setTogglingId(id);
    try {
      await update(ref(rtdb, `machinery/${id}`), { stockQuantity: qty });
      refetch();
    } catch (err) { console.error(err); }
    setTogglingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this machine permanently?')) return;
    try { await remove(ref(rtdb, `machinery/${id}`)); refetch(); }
    catch (err) { console.error(err); }
  };

  if (showAdd) return (
    <div className="max-w-2xl mx-auto glass-card p-8 rounded-3xl border border-white/5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-white">Add New Machine</h2>
        <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
      </div>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Machine Image</label>
          <ImageInput value={formData.image} onChange={url => setFormData({ ...formData, image: url })} />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Machine Name *</label>
          <input required type="text" className="input-dark" style={{ background: 'rgba(0,0,0,0.3)' }} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Category</label>
            <select className="input-dark" style={{ background: 'rgba(0,0,0,0.3)' }} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
              {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Capacity</label>
            <input type="text" className="input-dark" style={{ background: 'rgba(0,0,0,0.3)' }} placeholder="e.g. 100 KG/HR" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Selling Price (₹) *</label>
            <input required type="number" className="input-dark" style={{ background: 'rgba(0,0,0,0.3)' }} value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Original Price (₹)</label>
            <input type="number" className="input-dark" style={{ background: 'rgba(0,0,0,0.3)' }} value={formData.originalPrice} onChange={e => setFormData({ ...formData, originalPrice: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Stock Quantity</label>
            <input type="number" min="0" className="input-dark" style={{ background: 'rgba(0,0,0,0.3)' }} value={formData.stockQuantity} onChange={e => setFormData({ ...formData, stockQuantity: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Description</label>
          <textarea rows="3" className="input-dark resize-none" style={{ background: 'rgba(0,0,0,0.3)' }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
        </div>
        <button type="submit" disabled={saving} className="btn-gold w-full justify-center mt-4">
          {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Machine to Database</>}
        </button>
      </form>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-5 gap-3">
        <h2 className="text-xl font-black text-white">Manage Catalog</h2>
        <button onClick={() => setShowAdd(true)} className="btn-gold text-sm px-4 py-2 shrink-0"><Plus className="w-4 h-4" /> Add</button>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="glass-card rounded-2xl h-64 animate-pulse border border-white/5" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {machinery.map(m => {
            const qty = m.stockQuantity ?? 10;
            return (
              <div key={m.id} className="glass-card rounded-2xl overflow-hidden border border-white/5 flex flex-col">
                {m.image && <img src={m.image} alt={m.name} className="w-full h-32 object-cover opacity-80" />}
                {!m.image && <div className="w-full h-32 bg-black/40 flex items-center justify-center text-gray-600"><ImageIcon className="w-8 h-8" /></div>}
                <div className="p-3 flex-1 flex flex-col">
                  <div className="text-xs text-yellow-500/60 font-semibold uppercase mb-0.5 truncate">{m.category}</div>
                  <h3 className="font-bold text-white mb-1 text-sm line-clamp-1">{m.name}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-yellow-400 font-black text-sm">₹{Number(m.price || 0).toLocaleString()}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${qty > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {qty > 0 ? `Stk:${qty}` : 'Out'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-400">Qty:</span>
                    <button onClick={() => handleStockQty(m.id, Math.max(0, qty - 1))} disabled={togglingId === m.id}
                      className="w-7 h-7 rounded bg-white/10 hover:bg-yellow-500/20 text-white flex items-center justify-center text-sm transition-all">−</button>
                    <span className="text-white font-bold text-sm w-6 text-center">{qty}</span>
                    <button onClick={() => handleStockQty(m.id, qty + 1)} disabled={togglingId === m.id}
                      className="w-7 h-7 rounded bg-white/10 hover:bg-yellow-500/20 text-white flex items-center justify-center text-sm transition-all">+</button>
                  </div>
                  <button onClick={() => handleDelete(m.id)}
                    className="mt-auto flex items-center justify-center gap-1.5 w-full py-1.5 text-xs text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================================
// ADMIN QUOTATION GENERATOR
// ============================================================
const AdminQuotation = () => {
  const [items, setItems] = useState([{ description: '', quantity: 1, rate: '' }]);
  const [client, setClient] = useState({ name: '', careOf: '', address: '', pincode: '', phone: '', projectType: '' });
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (document.getElementById('quotation-styles')) return;
    const style = document.createElement('style');
    style.id = 'quotation-styles';
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=JetBrains+Mono:wght@400;500;600;700&family=Alex+Brush&display=swap');

      .q-root {
        --glass: rgba(255,255,255,0.045);
        --glass-border: rgba(255,255,255,0.09);
        --amber: #ff7a3d;
        --amber-2: #ffb066;
        --gold: #e0b23d;
        --red: #ff4d4d;
        --emerald: #17c081;
        --text: #f5f1ea;
        --text-dim: #a89e8f;
        --text-faint: #6f665a;
        font-family: 'Inter', sans-serif;
        color: var(--text);
      }
      .q-page-head { display:flex; align-items:center; gap:12px; margin-bottom:10px; animation: riseIn .6s ease both; }
      .q-page-head .ph-icon { width:44px;height:44px;border-radius:13px; display:flex;align-items:center;justify-content:center;font-size:19px; background:linear-gradient(135deg, rgba(255,122,61,0.25), rgba(255,122,61,0.05)); border:1px solid rgba(255,122,61,0.3); }
      .q-page-head h1 { font-family:'Alex Brush', cursive; font-size:40px; font-weight:400; letter-spacing:0.01em; background:linear-gradient(90deg, var(--amber-2), var(--gold)); -webkit-background-clip:text; background-clip:text; color:transparent; text-shadow: 0 0 30px rgba(255,122,61,0.25); line-height:1.1; margin:0; }
      .q-page-head p { font-size:13px; color:var(--text-dim); margin-top:4px; }
      
      .q-grid { display:grid; grid-template-columns: 1fr 1fr; gap:26px; align-items:start; }
      @media (max-width:1080px){ .q-grid { grid-template-columns:1fr; } }
      
      .q-glass-card { background:var(--glass); border:1px solid var(--glass-border); border-radius:22px; backdrop-filter: blur(18px); box-shadow: 0 16px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06); padding:28px; transition: box-shadow .35s, border-color .35s; animation: riseIn .6s ease both; }
      .q-glass-card:nth-of-type(1){ animation-delay:.08s; }
      .q-glass-card:nth-of-type(2){ animation-delay:.16s; }
      .q-glass-card:hover{ box-shadow: 0 24px 55px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,122,61,0.12), inset 0 1px 0 rgba(255,255,255,0.08); }
      
      .q-card-title { font-family:'Sora',sans-serif; font-size:16px; font-weight:700; margin-bottom:20px; display:flex; align-items:center; gap:8px; }
      .q-card-title::before{ content:''; width:4px; height:18px; border-radius:3px; background:linear-gradient(180deg,var(--amber-2),var(--amber)); }
      
      .q-field { margin-bottom:18px; position:relative; }
      .q-field label { display:flex; align-items:center; gap:6px; font-size:11px; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px; }
      .q-field label .req { color:var(--amber); }
      .q-field label .ok { width:13px; height:13px; border-radius:50%; background:var(--emerald); color:#06251a; display:flex; align-items:center; justify-content:center; font-size:9px; font-weight:900; opacity:0; transform:scale(0.4); transition: all .3s cubic-bezier(.34,1.56,.64,1); }
      .q-field.filled label .ok { opacity:1; transform:scale(1); }
      
      .q-field input, .q-field textarea { width:100%; padding:13px 16px; border-radius:13px; font-size:14px; font-family:'Inter',sans-serif; background:rgba(255,255,255,0.03); border:1px solid var(--glass-border); color:var(--text); outline:none; transition: border-color .25s, box-shadow .25s, background .25s; }
      .q-field input::placeholder, .q-field textarea::placeholder { color:var(--text-faint); }
      .q-field input:focus, .q-field textarea:focus { border-color:rgba(255,122,61,0.55); background:rgba(255,122,61,0.05); box-shadow: 0 0 0 4px rgba(255,122,61,0.12), 0 0 26px rgba(255,122,61,0.18); }
      .q-field-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
      @media (max-width:860px){ .q-field-row { grid-template-columns:1fr; } }
      
      .q-items-list { display:flex; flex-direction:column; gap:14px; margin-bottom:18px; }
      .q-item-block { padding:18px; border-radius:16px; background:rgba(255,255,255,0.025); border:1px solid var(--glass-border); position:relative; transition: border-color .3s, box-shadow .3s, transform .3s; animation: itemIn .35s ease; }
      @keyframes itemIn{ from{ opacity:0; transform:translateY(-8px) scale(0.98);} to{opacity:1; transform:translateY(0) scale(1);} }
      .q-item-block:hover { border-color:rgba(255,122,61,0.25); box-shadow:0 10px 26px rgba(0,0,0,0.3); }
      
      .q-item-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
      .q-item-label { font-size:12px; font-weight:800; color:var(--amber-2); letter-spacing:0.03em; }
      .q-item-remove { width:24px;height:24px; border-radius:8px; border:1px solid rgba(255,77,77,0.3); background:rgba(255,77,77,0.08); color:#ff8080; font-size:13px; display:flex; align-items:center; justify-content:center; transition: all .2s; cursor:pointer; }
      .q-item-remove:hover { background:rgba(255,77,77,0.2); transform:scale(1.08) rotate(90deg); }
      
      .q-item-desc { margin-bottom:10px; }
      .q-item-nums { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
      @media (max-width:860px){ .q-item-nums { grid-template-columns:1fr; } }
      
      .q-item-nums input, .q-item-desc input { width:100%; padding:11px 14px; border-radius:11px; font-size:13.5px; background:rgba(255,255,255,0.03); border:1px solid var(--glass-border); color:var(--text); outline:none; transition: border-color .25s, box-shadow .25s, background .25s; }
      .q-item-nums input:focus, .q-item-desc input:focus { border-color:rgba(255,122,61,0.5); background:rgba(255,122,61,0.04); box-shadow: 0 0 0 3px rgba(255,122,61,0.1); }
      
      .q-item-line-total { margin-top:10px; text-align:right; font-size:12.5px; color:var(--text-dim); font-family:'JetBrains Mono',monospace; }
      .q-item-line-total b { color:var(--amber-2); font-family:'JetBrains Mono',monospace; }
      
      .q-add-btn { width:100%; padding:14px; border-radius:14px; font-weight:700; font-size:14px; background:transparent; border:1.5px solid var(--gold); color:var(--gold); display:flex; align-items:center; justify-content:center; gap:8px; transition: all .3s; position:relative; overflow:hidden; cursor:pointer; }
      .q-add-btn::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg, rgba(224,178,61,0.15), rgba(224,178,61,0.02)); opacity:0; transition:opacity .3s; }
      .q-add-btn:hover { box-shadow: 0 0 24px rgba(224,178,61,0.35); transform:translateY(-2px); }
      .q-add-btn:hover::before { opacity:1; }
      
      .q-summary-card { margin-top:18px; padding:20px 22px; border-radius:16px; background:rgba(255,255,255,0.025); border:1px solid var(--glass-border); }
      .q-sum-row { display:flex; justify-content:space-between; font-size:14px; color:var(--text-dim); padding:7px 0; font-family:'JetBrains Mono',monospace; }
      .q-sum-row.total { border-top:1px solid var(--glass-border); margin-top:8px; padding-top:14px; font-size:16.5px; font-weight:800; color:var(--text); font-family:'Inter',sans-serif; }
      .q-sum-row.total b { color:var(--amber-2); font-family:'JetBrains Mono',monospace; font-size:19px; text-shadow: 0 0 20px rgba(255,122,61,0.3); }
      
      .q-gen-btn { width:100%; margin-top:20px; padding:17px; border-radius:16px; border:none; font-weight:800; font-size:15px; display:flex; align-items:center; justify-content:center; gap:10px; background:linear-gradient(135deg, #f0cf6e, var(--gold)); color:#1a1204; box-shadow:0 12px 30px rgba(224,178,61,0.35), inset 0 1px 0 rgba(255,255,255,0.45); transition: transform .3s, box-shadow .3s; cursor:pointer; }
      .q-gen-btn:hover { transform:translateY(-3px); box-shadow:0 20px 44px rgba(224,178,61,0.5); }
      .q-gen-btn:active { transform:translateY(-1px) scale(0.98); }
      .q-gen-btn:disabled { opacity: 0.7; cursor: not-allowed; }
      .q-gen-btn.pulse-ready { animation: readyPulse 2s ease-in-out infinite; }
      @keyframes readyPulse{ 0%,100%{ box-shadow:0 12px 30px rgba(224,178,61,0.35), inset 0 1px 0 rgba(255,255,255,0.45); } 50%{ box-shadow:0 12px 40px rgba(224,178,61,0.6), 0 0 0 6px rgba(224,178,61,0.1), inset 0 1px 0 rgba(255,255,255,0.45); } }
      @keyframes riseIn{ from{ opacity:0; transform:translateY(14px);} to{ opacity:1; transform:translateY(0);} }
      
      .q-toast { position:fixed; bottom:26px; right:26px; z-index:50; display:flex; align-items:center; gap:12px; background:rgba(15,13,10,0.92); backdrop-filter:blur(16px); border:1px solid rgba(23,192,129,0.35); padding:15px 20px; border-radius:15px; box-shadow:0 20px 45px rgba(0,0,0,0.5), 0 0 30px rgba(23,192,129,0.15); transform:translateY(24px) scale(0.95); opacity:0; pointer-events:none; transition: all .4s cubic-bezier(.34,1.56,.64,1); }
      .q-toast.show { transform:translateY(0) scale(1); opacity:1; pointer-events:auto; }
      .q-toast .t-icon { width:30px;height:30px;border-radius:50%; background:linear-gradient(135deg,#5be0b3,var(--emerald)); display:flex; align-items:center; justify-content:center; color:#04160e; font-weight:900; font-size:14px; flex-shrink:0; }
      .q-toast .t-text b { display:block; font-size:13.5px; font-weight:700; color:var(--text); }
      .q-toast .t-text span { font-size:11.5px; color:var(--text-dim); }
    `;
    document.head.appendChild(style);
  }, []);

  const addItem = () => setItems([...items, { description: '', quantity: 1, rate: '' }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => { const u = [...items]; u[i][field] = val; setItems(u); };

  const burstConfetti = (x, y) => {
    const colors = ['#ff7a3d','#ffb066','#e0b23d','#17c081','#5be0b3'];
    for(let i=0;i<28;i++){
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      const size = 5 + Math.random()*6;
      p.style.width = size+'px';
      p.style.height = (size*0.4)+'px';
      p.style.background = colors[Math.floor(Math.random()*colors.length)];
      p.style.left = x+'px';
      p.style.top = y+'px';
      p.style.position = 'fixed';
      p.style.zIndex = '45';
      p.style.pointerEvents = 'none';
      p.style.borderRadius = '2px';
      document.body.appendChild(p);
      const angle = Math.random()*Math.PI*2;
      const dist = 90 + Math.random()*160;
      const dx = Math.cos(angle)*dist;
      const dy = Math.sin(angle)*dist - 60;
      const rot = Math.random()*720-360;
      p.animate([
        { transform:'translate(0,0) rotate(0deg)', opacity:1 },
        { transform:`translate(${dx}px, ${dy+220}px) rotate(${rot}deg)`, opacity:0 }
      ], { duration: 1100 + Math.random()*500, easing:'cubic-bezier(.25,.8,.3,1)' });
      setTimeout(()=> p.remove(), 1700);
    }
  };

  const handleGenerate = async (e) => {
    if (!client.name.trim()) { alert('Please enter client name.'); return; }
    if (!client.address.trim()) { alert('Please enter client address.'); return; }
    if (!client.phone.trim()) { alert('Please enter client mobile.'); return; }
    
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    setGenerating(true);
    try {
      const refNo = (parseInt(localStorage.getItem('rudra_ref') || '65') + 1).toString();
      localStorage.setItem('rudra_ref', refNo);
      await generateQuotation(client, items, refNo);
      try {
        await push(ref(rtdb, 'quotes'), {
          clientDetails: client, items, refNo,
          total: items.reduce((a, i) => a + (parseFloat(i.rate) || 0) * (parseInt(i.quantity) || 1), 0) * 1.18,
          createdAt: new Date().toISOString(), source: 'admin',
        });
      } catch (e) { console.error(e); }
      setGenerated(true);
      burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
      setToast(true);
      setTimeout(() => {
        setGenerated(false);
        setToast(false);
      }, 3600);
    } catch (err) {
      console.error('PDF error:', err);
      alert('Failed to generate PDF.');
    }
    setGenerating(false);
  };

  const total = items.reduce((a, i) => a + (parseFloat(i.rate) || 0) * (parseInt(i.quantity) || 0), 0);
  const gst = total * 0.18;
  const grandTotal = total + gst;

  return (
    <div className="q-root">
      <div className="q-page-head">
        <div className="ph-icon">📄</div>
        <div>
          <h1>Generate Client Quotation</h1>
          <p>Create a GST-ready quotation and share it instantly.</p>
        </div>
      </div>

      <div className="q-grid">
        {/* CLIENT DETAILS */}
        <div className="q-glass-card">
          <div className="q-card-title">Client Details</div>
          <div className={`q-field ${client.name.trim() ? 'filled' : ''}`}>
            <label>Client Name <span className="req">*</span><span className="ok">✓</span></label>
            <input type="text" placeholder="Full name" value={client.name} onChange={e => setClient({ ...client, name: e.target.value })} />
          </div>
          <div className={`q-field ${client.careOf.trim() ? 'filled' : ''}`}>
            <label>S/O or Care Of</label>
            <input type="text" placeholder="Father / Guardian name" value={client.careOf} onChange={e => setClient({ ...client, careOf: e.target.value })} />
          </div>
          <div className={`q-field ${client.address.trim() ? 'filled' : ''}`}>
            <label>Address <span className="req">*</span><span className="ok">✓</span></label>
            <textarea rows="3" placeholder="Full address" value={client.address} onChange={e => setClient({ ...client, address: e.target.value })}></textarea>
          </div>
          <div className="q-field-row">
            <div className={`q-field ${client.pincode.trim() ? 'filled' : ''}`}>
              <label>Pin Code</label>
              <input type="text" placeholder="PIN Code" value={client.pincode} onChange={e => setClient({ ...client, pincode: e.target.value })} />
            </div>
            <div className={`q-field ${client.phone.trim() ? 'filled' : ''}`}>
              <label>Mobile <span className="req">*</span><span className="ok">✓</span></label>
              <input type="tel" placeholder="10-digit mobile" value={client.phone} onChange={e => setClient({ ...client, phone: e.target.value })} />
            </div>
          </div>
          <div className={`q-field ${client.projectType.trim() ? 'filled' : ''}`} style={{ marginBottom: 0 }}>
            <label>Project Name</label>
            <input type="text" placeholder="e.g. Bakery Processing Unit" value={client.projectType} onChange={e => setClient({ ...client, projectType: e.target.value })} />
          </div>
        </div>

        {/* MACHINERY ITEMS */}
        <div className="q-glass-card">
          <div className="q-card-title">Machinery Items</div>
          <div className="q-items-list">
            {items.map((item, i) => {
              const qty = parseFloat(item.quantity) || 0;
              const rate = parseFloat(item.rate) || 0;
              const lineTotal = qty * rate;
              return (
                <div key={i} className="q-item-block">
                  <div className="q-item-head">
                    <span className="q-item-label">Item {i + 1}</span>
                    {items.length > 1 && (
                      <button className="q-item-remove" onClick={() => removeItem(i)}>✕</button>
                    )}
                  </div>
                  <div className="q-item-desc">
                    <input type="text" placeholder="Machine description" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} />
                  </div>
                  <div className="q-item-nums">
                    <input type="number" min="1" className="qty-input" placeholder="Qty" value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)} />
                    <input type="number" min="0" className="rate-input" placeholder="Rate (₹)" value={item.rate} onChange={e => updateItem(i, 'rate', e.target.value)} />
                  </div>
                  <div className="q-item-line-total">Line total: <b>₹{Math.round(lineTotal).toLocaleString('en-IN')}</b></div>
                </div>
              );
            })}
          </div>
          
          <button className="q-add-btn" onClick={addItem}>+ Add Item</button>

          <div className="q-summary-card">
            <div className="q-sum-row"><span>Subtotal</span><span>₹{Math.round(total).toLocaleString('en-IN')}</span></div>
            <div className="q-sum-row"><span>GST @18%</span><span>₹{Math.round(gst).toLocaleString('en-IN')}</span></div>
            <div className="q-sum-row total"><span>Grand Total</span><b>₹{Math.round(grandTotal).toLocaleString('en-IN')}</b></div>
          </div>

          <button 
            className={`q-gen-btn ${grandTotal > 0 ? 'pulse-ready' : ''}`} 
            onClick={handleGenerate} 
            disabled={generating}
            style={generated ? { background: 'linear-gradient(135deg, #5be0b3, #17c081)', color: '#04160e' } : {}}
          >
            {generating ? 'Generating...' : generated ? '✓ Quotation Generated!' : 'Generate'}
          </button>
        </div>
      </div>

      <div className={`q-toast ${toast ? 'show' : ''}`}>
        <div className="t-icon">✓</div>
        <div className="t-text"><b>Quotation generated</b><span>Ready to print or save as PDF</span></div>
      </div>
    </div>
  );
};

// ============================================================
// CLIENT REQUESTS (Realtime Database)
// ============================================================
const ClientRequests = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const cardRefs = useRef({});

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const snapshot = await get(ref(rtdb, 'quotes'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const arr = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        arr.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        setQuotes(arr);
      } else {
        setQuotes([]);
      }
    } catch (err) {
      console.error(err);
      setQuotes([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchQuotes(); }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchQuotes();
    setTimeout(() => setRefreshing(false), 400);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this request permanently?')) return;
    setDeletingId(id);
    // Animate out
    const el = cardRefs.current[id];
    if (el) {
      el.style.transition = 'all 0.3s ease';
      el.style.opacity = '0';
      el.style.transform = 'translateX(-30px) scale(0.96)';
    }
    setTimeout(async () => {
      try { await remove(ref(rtdb, `quotes/${id}`)); setQuotes(q => q.filter(x => x.id !== id)); }
      catch (err) { console.error(err); }
      setDeletingId(null);
    }, 300);
  };

  const handleDownload = async (q) => {
    try {
      await generateQuotation(q.clientDetails || {}, q.items || [], q.refNo || 'N/A');
    } catch (err) {
      console.error(err);
      alert('Could not regenerate PDF.');
    }
  };

  const handleDownloadReceipt = async (q) => {
    try {
      await generateAdvanceReceipt(q.clientDetails || {}, q.advanceAmount || 0, q.razorpay_order_id || 'N/A');
    } catch (err) {
      console.error(err);
      alert('Could not regenerate Advance Receipt.');
    }
  };

  // 3D tilt effect
  const handleMouseMove = (e, id) => {
    const el = cardRefs.current[id];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = x - rect.width / 2;
    const cy = y - rect.height / 2;
    const rotY = (cx / rect.width) * 2.5;
    const rotX = -(cy / rect.height) * 2.5;
    el.style.transform = `perspective(1400px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    el.style.setProperty('--mx', x + 'px');
    el.style.setProperty('--my', y + 'px');
  };

  const handleMouseLeave = (id) => {
    const el = cardRefs.current[id];
    if (!el) return;
    el.style.transform = 'perspective(1400px) rotateX(0) rotateY(0) translateY(0)';
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  };

  const getStatusConfig = (q) => {
    if (q.paymentStatus === 'Full Payment Received') return {
      bg: 'linear-gradient(135deg, rgba(23,192,129,0.14), rgba(23,192,129,0.04))',
      border: 'rgba(23,192,129,0.3)', color: '#4ade80', dotColor: '#17c081',
      icon: '✓', text: `Full Payment Received — ₹${(q.advanceAmount || 0).toLocaleString()}`
    };
    if (q.paymentStatus === 'Token Paid' || q.paymentStatus === 'Advance Received') return {
      bg: 'linear-gradient(135deg, rgba(91,157,255,0.14), rgba(91,157,255,0.04))',
      border: 'rgba(91,157,255,0.3)', color: '#8bb8ff', dotColor: '#5b9dff',
      icon: '✓', text: `${q.paymentStatus} — ₹${(q.advanceAmount || 0).toLocaleString()}`
    };
    if (q.quotationFeePaid) return {
      bg: 'linear-gradient(135deg, rgba(91,157,255,0.14), rgba(91,157,255,0.04))',
      border: 'rgba(91,157,255,0.3)', color: '#8bb8ff', dotColor: '#5b9dff',
      icon: '✓', text: 'Quotation Generated (₹20 Paid)'
    };
    return {
      bg: 'linear-gradient(135deg, rgba(224,178,61,0.14), rgba(224,178,61,0.04))',
      border: 'rgba(224,178,61,0.3)', color: '#e0b23d', dotColor: '#e0b23d',
      icon: '⏳', text: q.paymentStatus || 'Pending'
    };
  };

  // ── CSS for animations (injected once) ──
  useEffect(() => {
    if (document.getElementById('req-card-styles')) return;
    const style = document.createElement('style');
    style.id = 'req-card-styles';
    style.textContent = `
      @keyframes reqCardIn {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes reqStatusPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.35; }
      }
      .req-card-anim {
        animation: reqCardIn 0.4s ease both;
        transform-style: preserve-3d;
        transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.35s;
      }
      .req-card-anim:hover {
        box-shadow: 0 26px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,122,61,0.2) !important;
      }
      .req-glow {
        position: absolute; inset: 0; opacity: 0; transition: opacity 0.35s; pointer-events: none; z-index: 0;
        background: radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(255,166,102,0.13), transparent 60%);
      }
      .req-card-anim:hover .req-glow { opacity: 1; }
      .req-status-dot {
        animation: reqStatusPulse 1.8s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div>
      {/* Page Head */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '24px', fontWeight: 800, letterSpacing: '-0.01em', color: '#f5f1ea', marginBottom: '4px' }}>
            Client Quotation Requests
          </h2>
          <p style={{ fontSize: '13px', color: '#a89e8f' }}>Manage and generate quotations for incoming client requests.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            padding: '11px 22px', borderRadius: '999px', fontWeight: 700, fontSize: '13.5px',
            background: 'transparent', border: '1.5px solid #e0b23d', color: '#e0b23d',
            display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
            transition: 'all 0.3s', opacity: refreshing ? 0.6 : 1,
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 22px rgba(224,178,61,0.35)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <span style={{ display: 'inline-block', transition: 'transform 0.5s', transform: refreshing ? 'rotate(360deg)' : 'rotate(0)' }}>⟳</span>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card" style={{
              height: '180px', borderRadius: '22px', border: '1px solid rgba(255,255,255,0.05)',
              animation: 'reqCardIn 0.4s ease both', animationDelay: `${i * 0.08}s`,
              background: 'rgba(255,255,255,0.03)',
            }}>
              <div style={{ padding: '26px 28px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)' }} className="animate-pulse" />
                  <div>
                    <div style={{ width: '120px', height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', marginBottom: '6px' }} className="animate-pulse" />
                    <div style={{ width: '80px', height: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }} className="animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : quotes.length === 0 ? (
        <div style={{
          padding: '60px 20px', textAlign: 'center', borderRadius: '22px',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(18px)',
        }}>
          <FileText style={{ width: '48px', height: '48px', color: '#6f665a', margin: '0 auto 16px' }} />
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '18px', fontWeight: 700, color: '#f5f1ea', marginBottom: '6px' }}>No Requests Yet</h3>
          <p style={{ fontSize: '14px', color: '#a89e8f' }}>Client quotation requests will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {quotes.map((q, idx) => {
            const status = getStatusConfig(q);
            const hasAdvance = q.paymentStatus === 'Advance Received' || q.paymentStatus === 'Full Payment Received' || q.paymentStatus === 'Token Paid';
            const amountLeft = q.amountLeft || (q.total - (q.advanceAmount || 0));

            return (
              <div
                key={q.id}
                ref={el => { cardRefs.current[q.id] = el; }}
                className="req-card-anim"
                onMouseMove={e => handleMouseMove(e, q.id)}
                onMouseLeave={() => handleMouseLeave(q.id)}
                style={{
                  position: 'relative', padding: '26px 28px', borderRadius: '22px', overflow: 'hidden',
                  background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.09)',
                  backdropFilter: 'blur(18px)',
                  boxShadow: '0 14px 36px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
                  animationDelay: `${idx * 0.06}s`,
                }}
              >
                {/* Radial glow on hover */}
                <div className="req-glow" />

                {/* Top: Avatar + Name + Amount */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', position: 'relative', zIndex: 1, marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '16px', fontFamily: "'Sora', sans-serif", color: '#1a0f08', flexShrink: 0,
                      background: 'linear-gradient(135deg, #ffb066, #ff7a3d)',
                      boxShadow: '0 6px 16px rgba(255,122,61,0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
                    }}>
                      {getInitials(q.clientDetails?.name)}
                    </div>
                    <div>
                      <div style={{ fontSize: '16.5px', fontWeight: 700, fontFamily: "'Sora', sans-serif", textTransform: 'capitalize', color: '#f5f1ea' }}>
                        {q.clientDetails?.name || 'Unknown'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6f665a', marginTop: '2px' }}>
                        Ref: {q.refNo || '—'} · {q.createdAt ? new Date(q.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
                        {q.source === 'admin' && <span style={{ marginLeft: '8px', color: '#c084fc', fontWeight: 700 }}>ADMIN</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: '21px',
                    background: 'linear-gradient(120deg, #ffb066, #ff7a3d)',
                    WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                    flexShrink: 0,
                  }}>
                    ₹{Number(q.total || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </div>
                </div>

                {/* Contact Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px', position: 'relative', zIndex: 1 }}>
                  {q.clientDetails?.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: '#a89e8f' }}>
                      <span style={{ fontSize: '13px' }}>📞</span>{q.clientDetails.phone}
                    </div>
                  )}
                  {q.clientDetails?.address && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: '#a89e8f' }}>
                      <span style={{ fontSize: '13px' }}>📍</span>{q.clientDetails.address}
                    </div>
                  )}
                </div>

                {/* Item Chips */}
                {q.items && q.items.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
                    {q.items.map((item, i) => (
                      <span key={i} style={{
                        fontSize: '11.8px', fontWeight: 600, padding: '6px 13px', borderRadius: '999px',
                        background: 'rgba(224,178,61,0.1)', border: '1px solid rgba(224,178,61,0.28)', color: '#e0b23d',
                      }}>
                        {item.description} ×{item.quantity}
                      </span>
                    ))}
                  </div>
                )}

                {/* Status Bar */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 18px', borderRadius: '14px', marginBottom: '12px',
                  position: 'relative', zIndex: 1,
                  background: status.bg, border: `1px solid ${status.border}`, color: status.color,
                  fontSize: '13.5px', fontWeight: 700,
                }}>
                  <span className="req-status-dot" style={{
                    width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                    background: status.dotColor, boxShadow: `0 0 10px ${status.dotColor}`,
                  }} />
                  {status.icon} {status.text}
                </div>

                {/* Amount Left Warning */}
                {hasAdvance && q.paymentStatus !== 'Full Payment Received' && amountLeft > 0 && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 16px', borderRadius: '12px', marginBottom: '14px',
                    position: 'relative', zIndex: 1,
                    background: 'linear-gradient(135deg, rgba(255,150,50,0.12), rgba(255,150,50,0.03))',
                    border: '1px solid rgba(255,150,50,0.25)', color: '#ffb066', fontSize: '13px', fontWeight: 700,
                  }}>
                    <span>⚠️</span> Amount Left: ₹{amountLeft.toLocaleString()}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                  <button
                    onClick={() => handleDownload(q)}
                    style={{
                      padding: '11px 24px', borderRadius: '999px', border: 'none', fontWeight: 800, fontSize: '13.5px', cursor: 'pointer',
                      background: 'linear-gradient(135deg, #f0cf6e, #e0b23d)', color: '#1a1204',
                      boxShadow: '0 8px 22px rgba(224,178,61,0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
                      display: 'flex', alignItems: 'center', gap: '7px', transition: 'all 0.25s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(224,178,61,0.48)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 22px rgba(224,178,61,0.35)'; }}
                  >
                    <Download className="w-3.5 h-3.5" /> Quotation PDF
                  </button>

                  {hasAdvance && (
                    <button
                      onClick={() => handleDownloadReceipt(q)}
                      style={{
                        padding: '11px 22px', borderRadius: '999px', fontWeight: 700, fontSize: '13.5px', cursor: 'pointer',
                        background: 'rgba(23,192,129,0.1)', border: '1px solid rgba(23,192,129,0.35)', color: '#4ade80',
                        display: 'flex', alignItems: 'center', gap: '7px', transition: 'all 0.25s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 22px rgba(23,192,129,0.25)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <Download className="w-3.5 h-3.5" /> Receipt
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(q.id)}
                    disabled={deletingId === q.id}
                    style={{
                      padding: '11px 22px', borderRadius: '999px', fontWeight: 700, fontSize: '13.5px', cursor: 'pointer',
                      background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.3)', color: '#ff8080',
                      display: 'flex', alignItems: 'center', gap: '7px', transition: 'all 0.25s',
                      opacity: deletingId === q.id ? 0.5 : 1,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,77,77,0.18)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 22px rgba(255,77,77,0.25)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,77,77,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================================
// MAIN ADMIN PAGE
// ============================================================
const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { machinery, loading: machineryLoading, refetch } = useMachinery();

  useEffect(() => {
    const isAdmin = localStorage.getItem('rudra_admin') === 'true';
    if (isAdmin) setUser({ email: 'admin@rudratraders.com' });
    setLoadingUser(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('rudra_admin');
    navigate('/');
  };

  const activeLabels = {
    dashboard: 'Dashboard',
    catalog: 'Machinery Catalog',
    quotation: 'Generate Quotation',
    requests: 'Client Requests',
  };

  if (loadingUser) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
      <div className="text-yellow-400 text-xl font-bold animate-pulse">Loading...</div>
    </div>
  );

  if (!user) return <AdminLogin />;

  const views = {
    dashboard: <DashboardOverview machinery={machinery} loading={machineryLoading} />,
    catalog: <CatalogView machinery={machinery} refetch={refetch} loading={machineryLoading} />,
    quotation: <AdminQuotation />,
    requests: <ClientRequests />,
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0f' }}>
      {/* Sidebar (drawer on mobile, inline on desktop) */}
      <Sidebar
        active={active}
        setActive={setActive}
        onLogout={handleLogout}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">

        {/* Mobile top header */}
        <div
          className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-white/5 sticky top-0 z-30"
          style={{ background: 'rgba(10,5,2,0.98)', backdropFilter: 'blur(16px)' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-300 hover:text-white p-1"
          >
            {/* Hamburger icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-lg flex items-center justify-center text-black font-black text-xs">R</div>
            <span className="text-sm font-black gold-text">RUDRA TRADERS</span>
            <span className="text-[9px] font-black tracking-widest uppercase bg-red-600 text-white px-1.5 py-0.5 rounded">ADMIN</span>
          </div>
          <span className="ml-auto text-xs text-gray-500 truncate">{activeLabels[active]}</span>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          {views[active]}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
