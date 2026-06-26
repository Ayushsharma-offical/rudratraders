import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  LayoutDashboard, Package, FileText, LogOut, TrendingUp,
  Users, DollarSign, Plus, X, CheckCircle2, Trash2, Download,
  Save, Upload, ImageIcon
} from 'lucide-react';
import { useMachinery } from '../hooks/useMachinery';
import { MACHINERY as STATIC_MACHINERY, CATEGORIES } from '../data/machinery';
import { generateQuotation } from '../utils/generateQuotation';

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
// SIDEBAR
// ============================================================
const Sidebar = ({ active, setActive, onLogout }) => {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'catalog', label: 'Machinery Catalog', icon: Package },
    { id: 'quotation', label: 'Generate Quotation', icon: FileText },
    { id: 'requests', label: 'Client Requests', icon: Users },
  ];

  return (
    <div className="flex flex-col shrink-0 border-r border-white/5" style={{ width: '240px', background: 'rgba(15,8,4,0.95)', backdropFilter: 'blur(20px)' }}>
      <div className="p-5 flex items-center gap-3 border-b border-white/5">
        <div className="w-9 h-9 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl flex items-center justify-center text-black font-black text-sm">R</div>
        <div>
          <div className="text-sm font-black gold-text">RUDRA TRADERS</div>
          <div className="text-xs text-gray-600">Admin Portal</div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              active === item.id
                ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-white/5">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

// ============================================================
// DASHBOARD
// ============================================================
const DashboardOverview = ({ machinery, loading }) => {
  const inStock = machinery.filter(m => (m.stockQuantity ?? (m.inStock ? 1 : 0)) > 0).length;
  const avgPrice = machinery.length ? Math.round(machinery.reduce((a, m) => a + Number(m.price), 0) / machinery.length) : 0;
  const stats = [
    { label: 'Total Products', value: machinery.length, icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'In Stock', value: inStock, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Avg. Price', value: `₹${avgPrice.toLocaleString()}`, icon: DollarSign, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Categories', value: [...new Set(machinery.map(m => m.category))].length, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-black text-white mb-8">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl hover-float border border-white/5">
            <div className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center mb-4`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className={`text-3xl font-black mb-1 ${s.color}`}>{loading ? <span className="animate-pulse text-lg">...</span> : s.value}</div>
            <div className="text-gray-400 text-sm">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        <div className="p-5 border-b border-white/5">
          <h3 className="font-bold text-white">Machinery Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>Machine Name</th><th>Category</th><th>Price</th><th>Stock Qty</th><th>Status</th></tr>
            </thead>
            <tbody>
              {loading
                ? <tr><td colSpan="5" className="text-center py-8 text-gray-500 animate-pulse">Loading from database...</td></tr>
                : machinery.map(m => (
                  <tr key={m.id}>
                    <td className="text-white font-medium">{m.name}</td>
                    <td className="text-gray-400">{m.category}</td>
                    <td className="text-yellow-400 font-bold">₹{Number(m.price).toLocaleString()}</td>
                    <td className="text-white font-bold">{m.stockQuantity ?? (m.inStock ? '10+' : '0')}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${(m.stockQuantity ?? (m.inStock ? 1 : 0)) > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {(m.stockQuantity ?? (m.inStock ? 1 : 0)) > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// IMAGE PASTE / UPLOAD HELPER
// ============================================================
const ImageInput = ({ value, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const pasteRef = useRef(null);

  const uploadFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `machinery/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setPreview(url);
      onChange(url);
    } catch (err) {
      console.error('Upload failed:', err);
      // Fallback: create object URL
      const url = URL.createObjectURL(file);
      setPreview(url);
      onChange(url);
    }
    setUploading(false);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        uploadFile(file);
        break;
      }
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div>
      <div
        ref={pasteRef}
        onPaste={handlePaste}
        tabIndex={0}
        className="relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer focus:outline-none transition-all"
        style={{ borderColor: 'rgba(212,175,55,0.3)', background: 'rgba(0,0,0,0.3)' }}
        onClick={() => pasteRef.current?.focus()}
      >
        {uploading ? (
          <div className="py-6 text-yellow-400 animate-pulse flex flex-col items-center gap-2">
            <Upload className="w-6 h-6" />
            <span className="text-sm">Uploading...</span>
          </div>
        ) : preview ? (
          <div className="relative">
            <img src={preview} alt="preview" className="w-full h-32 object-cover rounded-lg" />
            <button
              type="button"
              onClick={e => { e.stopPropagation(); setPreview(''); onChange(''); }}
              className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center gap-2">
            <ImageIcon className="w-8 h-8 text-gray-500" />
            <p className="text-sm text-gray-400">Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-yellow-400 text-xs font-mono">Ctrl+V</kbd> to paste image</p>
            <p className="text-xs text-gray-600">or click below to upload</p>
          </div>
        )}
      </div>
      <label className="mt-2 flex items-center gap-2 cursor-pointer btn-outline-gold text-xs w-full justify-center">
        <Upload className="w-3 h-3" /> Choose File
        <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
      </label>
      {value && !preview && (
        <input
          type="text"
          className="input-dark mt-2 text-sm"
          placeholder="Or paste image URL..."
          value={value}
          onChange={e => { onChange(e.target.value); setPreview(e.target.value); }}
        />
      )}
    </div>
  );
};

// ============================================================
// CATALOG CRUD
// ============================================================
const CatalogView = ({ machinery, refetch, loading }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const blankForm = { name: '', category: 'Feed Processing', capacity: '', price: '', originalPrice: '', image: '', description: '', stockQuantity: 10 };
  const [formData, setFormData] = useState(blankForm);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.image) { alert('Please add an image first.'); return; }
    setSaving(true);
    try {
      await addDoc(collection(db, 'machinery'), {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        stockQuantity: Number(formData.stockQuantity),
        inStock: Number(formData.stockQuantity) > 0,
        rating: 5.0, reviews: 0,
      });
      setShowAdd(false);
      setFormData(blankForm);
      refetch();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const handleStockQty = async (id, qty) => {
    setTogglingId(id);
    try {
      await updateDoc(doc(db, 'machinery', id), { stockQuantity: qty, inStock: qty > 0 });
      refetch();
    } catch (err) { console.error(err); }
    setTogglingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this machine permanently?')) return;
    try { await deleteDoc(doc(db, 'machinery', id)); refetch(); }
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
          <label className="block text-sm text-gray-400 mb-1">Machine Image *</label>
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
            <input required type="text" className="input-dark" style={{ background: 'rgba(0,0,0,0.3)' }} placeholder="e.g. 100 KG/HR" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} />
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
          <textarea required rows="3" className="input-dark resize-none" style={{ background: 'rgba(0,0,0,0.3)' }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
        </div>
        <button type="submit" disabled={saving} className="btn-gold w-full justify-center mt-4">
          {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Machine to Database</>}
        </button>
      </form>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-white">Manage Catalog</h2>
        <button onClick={() => setShowAdd(true)} className="btn-gold"><Plus className="w-4 h-4" /> Add Machine</button>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="glass-card rounded-2xl h-72 animate-pulse border border-white/5" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {machinery.map(m => {
            const qty = m.stockQuantity ?? (m.inStock ? 10 : 0);
            const inStock = qty > 0;
            return (
              <div key={m.id} className="glass-card rounded-2xl overflow-hidden hover-float border border-white/5 flex flex-col">
                <img src={m.image} alt={m.name} className="w-full h-36 object-cover opacity-80" />
                <div className="p-4 flex-1 flex flex-col">
                  <div className="text-xs text-yellow-500/60 font-semibold uppercase mb-1">{m.category}</div>
                  <h3 className="font-bold text-white mb-1 text-sm line-clamp-1">{m.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-yellow-400 font-black">₹{Number(m.price).toLocaleString()}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {inStock ? `In Stock (${qty})` : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Stock Quantity Control */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-400">Stock Qty:</span>
                    <button
                      onClick={() => handleStockQty(m.id, Math.max(0, qty - 1))}
                      disabled={togglingId === m.id}
                      className="w-6 h-6 rounded bg-white/10 hover:bg-yellow-500/20 text-white flex items-center justify-center text-xs transition-all"
                    >−</button>
                    <span className="text-white font-bold text-sm w-8 text-center">{qty}</span>
                    <button
                      onClick={() => handleStockQty(m.id, qty + 1)}
                      disabled={togglingId === m.id}
                      className="w-6 h-6 rounded bg-white/10 hover:bg-yellow-500/20 text-white flex items-center justify-center text-xs transition-all"
                    >+</button>
                  </div>

                  <button
                    onClick={() => handleDelete(m.id)}
                    className="mt-auto flex items-center justify-center gap-2 w-full py-2 text-xs text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Delete Machine
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

  const addItem = () => setItems([...items, { description: '', quantity: 1, rate: '' }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => { const u = [...items]; u[i][field] = val; setItems(u); };

  const handleGenerate = async () => {
    if (!client.name.trim()) { alert('Please enter client name.'); return; }
    setGenerating(true);
    try {
      const refNo = (parseInt(localStorage.getItem('rudra_ref') || '65') + 1).toString();
      localStorage.setItem('rudra_ref', refNo);
      generateQuotation(client, items, refNo);
      // Save to DB
      try {
        await addDoc(collection(db, 'quotes'), {
          clientDetails: client, items, refNo,
          total: items.reduce((a, i) => a + (parseFloat(i.rate) || 0) * (parseInt(i.quantity) || 1), 0) * 1.18,
          createdAt: serverTimestamp(), source: 'admin',
        });
      } catch (e) { console.error(e); }
      setGenerated(true);
      setTimeout(() => setGenerated(false), 3000);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please check all fields.');
    }
    setGenerating(false);
  };

  const total = items.reduce((a, i) => a + (parseFloat(i.rate) || 0) * (parseInt(i.quantity) || 0), 0);

  return (
    <div>
      <h2 className="text-2xl font-black text-white mb-8">Generate Client Quotation</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="glass-card p-6 rounded-2xl border border-white/5">
          <h3 className="font-bold text-white mb-5">Client Details</h3>
          <div className="space-y-4">
            {[
              { label: 'Client Name *', key: 'name', placeholder: 'Full name' },
              { label: 'S/O or Care Of', key: 'careOf', placeholder: 'Father / Guardian name' },
              { label: 'Address *', key: 'address', placeholder: 'Full address', textarea: true },
              { label: 'PIN Code', key: 'pincode', placeholder: 'PIN Code' },
              { label: 'Mobile *', key: 'phone', placeholder: '10-digit mobile' },
              { label: 'Project / Unit Name', key: 'projectType', placeholder: 'e.g. Bakery Processing Unit' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">{f.label}</label>
                {f.textarea
                  ? <textarea className="input-dark resize-none" rows="2" placeholder={f.placeholder} value={client[f.key]} onChange={e => setClient({ ...client, [f.key]: e.target.value })}></textarea>
                  : <input type="text" className="input-dark" placeholder={f.placeholder} value={client[f.key]} onChange={e => setClient({ ...client, [f.key]: e.target.value })} />
                }
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/5">
          <h3 className="font-bold text-white mb-5">Machinery Items</h3>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="p-3 rounded-xl border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-yellow-400 font-bold">Item {i + 1}</span>
                  {items.length > 1 && <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-300"><X className="w-3 h-3" /></button>}
                </div>
                <input type="text" className="input-dark text-sm mb-2" placeholder="Machine description" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} />
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" className="input-dark text-sm" placeholder="Qty" min="1" value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)} />
                  <div className="col-span-2">
                    <input type="number" className="input-dark text-sm" placeholder="Rate (₹)" value={item.rate} onChange={e => updateItem(i, 'rate', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addItem} className="w-full btn-outline-gold text-sm justify-center py-2">
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          <div className="mt-5 p-4 rounded-xl border border-yellow-500/20" style={{ background: 'rgba(212,175,55,0.05)' }}>
            <div className="flex justify-between text-sm text-gray-400 mb-1"><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm text-gray-400 mb-2"><span>GST @18%</span><span>₹{(total * 0.18).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span></div>
            <div className="flex justify-between font-black text-lg"><span className="text-white">Grand Total</span><span className="gold-text">₹{(total * 1.18).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span></div>
          </div>

          <button onClick={handleGenerate} disabled={generating} className="btn-gold w-full justify-center mt-5 disabled:opacity-50">
            {generating ? 'Generating...' : <><Download className="w-4 h-4" /> Generate & Download PDF</>}
          </button>
          {generated && (
            <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle2 className="w-4 h-4" /> Quotation PDF downloaded!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// CLIENT REQUESTS
// ============================================================
const ClientRequests = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setQuotes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchQuotes(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this request permanently?')) return;
    setDeletingId(id);
    try { await deleteDoc(doc(db, 'quotes', id)); setQuotes(q => q.filter(x => x.id !== id)); }
    catch (err) { console.error(err); }
    setDeletingId(null);
  };

  const handleDownload = (q) => {
    try {
      const items = q.items || [];
      generateQuotation(q.clientDetails || {}, items, q.refNo || 'N/A');
    } catch (err) {
      console.error('Download error:', err);
      alert('Could not regenerate PDF for this quote.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-white">Client Quotation Requests</h2>
        <button onClick={fetchQuotes} className="btn-outline-gold text-sm px-4 py-2">Refresh</button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="glass-card h-24 rounded-2xl animate-pulse border border-white/5" />)}
        </div>
      ) : quotes.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl border border-white/5">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Requests Yet</h3>
          <p className="text-gray-400">Client quotation requests will appear here in real-time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map(q => (
            <div key={q.id} className="glass-card p-5 rounded-2xl hover-float border border-white/5">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-bold text-white">{q.clientDetails?.name || 'Unknown'}</h3>
                    <span className="text-xs text-gray-500 bg-black/30 px-2 py-0.5 rounded-md">Ref: {q.refNo}</span>
                    {q.source === 'admin' && <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">Admin Generated</span>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-400">
                    <p><span className="text-gray-500">Phone: </span>{q.clientDetails?.phone || '—'}</p>
                    <p><span className="text-gray-500">Project: </span>{q.clientDetails?.projectType || '—'}</p>
                    <p className="sm:col-span-2"><span className="text-gray-500">Address: </span>{q.clientDetails?.address || '—'}, {q.clientDetails?.pincode || ''}</p>
                  </div>
                  {q.items && q.items.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {q.items.map((item, i) => (
                        <span key={i} className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full">{item.description} ×{item.quantity}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between items-end gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Total Value</div>
                    <div className="text-xl font-black gold-text">₹{Number(q.total || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {q.createdAt?.toDate?.().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDownload(q)} className="flex items-center gap-1.5 px-3 py-1.5 btn-gold text-xs">
                      <Download className="w-3 h-3" /> Download
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      disabled={deletingId === q.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
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

  if (loadingUser) return (
    <div className="min-h-screen hero-gradient flex items-center justify-center">
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
      <Sidebar active={active} setActive={setActive} onLogout={handleLogout} />
      <div className="flex-1 p-6 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        {views[active]}
      </div>
    </div>
  );
};

export default AdminPage;
