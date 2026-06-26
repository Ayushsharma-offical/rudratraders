import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import {
  LayoutDashboard, Package, FileText, LogOut, TrendingUp,
  Users, DollarSign, Plus, X, CheckCircle2, Trash2, Download, Menu
} from 'lucide-react';
import { MACHINERY } from '../data/machinery';
import { generateQuotation } from '../utils/generateQuotation';

// ---- LOGIN SCREEN ----
const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (email === 'admin@rudratraders.com' && password === 'admin123') {
        localStorage.setItem('rudra_admin', 'true');
        onLogin({ email });
      } else {
        setError('Invalid credentials. Please try again.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4">
      <div className="glass-card p-10 rounded-3xl w-full max-w-md" style={{ border: '1px solid rgba(212,175,55,0.3)' }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-2xl flex items-center justify-center text-black font-black text-2xl mx-auto mb-4">R</div>
          <h1 className="text-2xl font-black text-white">Admin Portal</h1>
          <p className="text-gray-400 text-sm mt-1">Rudra Traders Management System</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email Address</label>
            <input type="email" className="input-dark" placeholder="admin@rudratraders.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Password</label>
            <input type="password" className="input-dark" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</div>}
          <button type="submit" disabled={loading} className="btn-gold w-full justify-center mt-2 disabled:opacity-50">
            {loading ? 'Signing In...' : 'Sign In to Dashboard'}
          </button>
        </form>
        <div className="mt-6 p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl text-xs text-gray-500 text-center">
          🔒 Secure admin access only
        </div>
      </div>
    </div>
  );
};

// ---- SIDEBAR ----
const Sidebar = ({ active, setActive, onLogout }) => {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'catalog', label: 'Machinery Catalog', icon: Package },
    { id: 'quotation', label: 'Generate Quotation', icon: FileText },
    { id: 'inquiries', label: 'Client Inquiries', icon: Users },
  ];

  return (
    <div className="admin-sidebar flex flex-col">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
        <div className="w-9 h-9 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl flex items-center justify-center text-black font-black">R</div>
        <div>
          <div className="text-sm font-black gold-text">RUDRA TRADERS</div>
          <div className="text-xs text-gray-600">Admin Portal</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              active === item.id
                ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4" style={{ borderTop: '1px solid rgba(212,175,55,0.1)' }}>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

// ---- DASHBOARD OVERVIEW ----
const DashboardOverview = () => {
  const stats = [
    { label: 'Total Products', value: MACHINERY.length, icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'In Stock', value: MACHINERY.filter(m => m.inStock).length, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Avg. Price', value: `₹${Math.round(MACHINERY.reduce((a,m) => a + m.price, 0) / MACHINERY.length).toLocaleString()}`, icon: DollarSign, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Categories', value: [...new Set(MACHINERY.map(m => m.category))].length, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-black text-white mb-8">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl">
            <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center mb-4`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <div className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-gray-400 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Product Summary Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6" style={{ borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
          <h3 className="font-bold text-white">Machinery Catalog Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Machine Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Capacity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {MACHINERY.map(m => (
                <tr key={m.id}>
                  <td className="text-white font-medium">{m.name}</td>
                  <td>{m.category}</td>
                  <td className="text-yellow-400 font-bold">₹{m.price.toLocaleString()}</td>
                  <td>{m.capacity}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${m.inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {m.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ---- CATALOG VIEW ----
const CatalogView = () => (
  <div>
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-black text-white">Machinery Catalog</h2>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {MACHINERY.map(m => (
        <div key={m.id} className="glass-card rounded-2xl overflow-hidden">
          <img src={m.image} alt={m.name} className="w-full h-40 object-cover opacity-70" />
          <div className="p-5">
            <div className="text-xs text-yellow-500/60 font-semibold uppercase mb-1">{m.category}</div>
            <h3 className="font-bold text-white mb-1">{m.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{m.capacity}</p>
            <div className="flex justify-between items-center">
              <span className="text-yellow-400 font-black text-lg">₹{m.price.toLocaleString()}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${m.inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {m.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ---- GENERATE QUOTATION (ADMIN) ----
const AdminQuotation = () => {
  const [items, setItems] = useState([{ description: '', quantity: 1, rate: '' }]);
  const [client, setClient] = useState({ name: '', careOf: '', address: '', pincode: '', phone: '', projectType: '' });
  const [generated, setGenerated] = useState(false);

  const addItem = () => setItems([...items, { description: '', quantity: 1, rate: '' }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => {
    const updated = [...items];
    updated[i][field] = val;
    setItems(updated);
  };

  const handleGenerate = () => {
    const refNo = (parseInt(localStorage.getItem('rudra_ref') || '65') + 1).toString();
    localStorage.setItem('rudra_ref', refNo);
    generateQuotation(client, items, refNo);
    setGenerated(true);
    setTimeout(() => setGenerated(false), 3000);
  };

  const total = items.reduce((a, i) => a + (parseFloat(i.rate) || 0) * (parseInt(i.quantity) || 0), 0);

  return (
    <div>
      <h2 className="text-2xl font-black text-white mb-8">Generate Client Quotation</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Client Details */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="font-bold text-white mb-6">Client Details</h3>
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
                {f.textarea ? (
                  <textarea className="input-dark resize-none" rows="2" placeholder={f.placeholder} value={client[f.key]} onChange={e => setClient({ ...client, [f.key]: e.target.value })}></textarea>
                ) : (
                  <input type="text" className="input-dark" placeholder={f.placeholder} value={client[f.key]} onChange={e => setClient({ ...client, [f.key]: e.target.value })} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="font-bold text-white mb-6">Machinery Items</h3>
          <div className="space-y-4">
            {items.map((item, i) => (
              <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.1)' }}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-yellow-400 font-bold">Item {i + 1}</span>
                  {items.length > 1 && (
                    <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-300">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-3">
                    <input type="text" className="input-dark text-sm" placeholder="Machine description" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} />
                  </div>
                  <div>
                    <input type="number" className="input-dark text-sm" placeholder="Qty" min="1" value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <input type="number" className="input-dark text-sm" placeholder="Rate (₹)" value={item.rate} onChange={e => updateItem(i, 'rate', e.target.value)} />
                  </div>
                </div>
                {item.rate && item.quantity && (
                  <div className="text-xs text-gray-500 mt-2">
                    Subtotal: <span className="text-yellow-400 font-bold">₹{(parseFloat(item.rate) * parseInt(item.quantity)).toLocaleString()}</span>
                  </div>
                )}
              </div>
            ))}
            <button onClick={addItem} className="w-full btn-outline-gold text-sm justify-center">
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          {/* Total */}
          <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Subtotal (ex. GST)</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>GST @18%</span>
              <span>₹{(total * 0.18).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between font-black text-xl">
              <span className="text-white">Grand Total</span>
              <span className="gold-text">₹{(total * 1.18).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>

          <button onClick={handleGenerate} className="btn-gold w-full justify-center mt-6">
            <Download className="w-5 h-5" /> Generate & Download PDF
          </button>

          {generated && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle2 className="w-4 h-4" /> Quotation PDF downloaded!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ---- MAIN ADMIN PAGE ----
const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('dashboard');

  useEffect(() => {
    const isAdmin = localStorage.getItem('rudra_admin') === 'true';
    if (isAdmin) {
      setUser({ email: 'admin@rudratraders.com' });
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('rudra_admin');
    setUser(null);
  };

  if (loading) return (
    <div className="min-h-screen hero-gradient flex items-center justify-center">
      <div className="text-yellow-400 text-xl font-bold animate-pulse">Loading...</div>
    </div>
  );

  if (!user) return <AdminLogin onLogin={() => {}} />;

  const views = { dashboard: DashboardOverview, catalog: CatalogView, quotation: AdminQuotation };
  const ActiveView = views[active] || DashboardOverview;

  return (
    <div className="min-h-screen" style={{ background: '#0a0f0f' }}>
      <Sidebar active={active} setActive={setActive} onLogout={handleLogout} />
      <div className="admin-content p-8">
        <ActiveView />
      </div>
    </div>
  );
};

export default AdminPage;
