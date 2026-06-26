import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import {
  LayoutDashboard, Package, FileText, LogOut, TrendingUp,
  Users, DollarSign, Plus, X, CheckCircle2, Trash2, Edit, Save, ArrowRight
} from 'lucide-react';
import { useMachinery } from '../hooks/useMachinery';
import { MACHINERY as STATIC_MACHINERY, CATEGORIES } from '../data/machinery';

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
      <div className="glass-card p-10 rounded-3xl w-full max-w-md hover-float" style={{ border: '1px solid rgba(212,175,55,0.3)' }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-2xl flex items-center justify-center text-black font-black text-2xl mx-auto mb-4 shadow-lg shadow-yellow-900/50">R</div>
          <h1 className="text-2xl font-black text-white">Admin Portal</h1>
          <p className="text-gray-400 text-sm mt-1">Rudra Traders Management System</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email Address</label>
            <input type="email" className="input-dark bg-black/40 border-white/10 focus:border-[#d4af37]" placeholder="admin@rudratraders.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Password</label>
            <input type="password" className="input-dark bg-black/40 border-white/10 focus:border-[#d4af37]" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</div>}
          <button type="submit" disabled={loading} className="btn-gold w-full justify-center mt-2 disabled:opacity-50">
            {loading ? 'Signing In...' : 'Sign In to Dashboard'}
          </button>
        </form>
        <div className="mt-6 p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl text-xs text-gray-500 text-center">
          🔒 Secure admin access only
        </div>
        <button onClick={() => window.location.href = '/'} className="mt-4 text-gray-400 hover:text-white text-sm w-full flex items-center justify-center gap-2 transition-colors">
          &larr; Exit to Website
        </button>
      </div>
    </div>
  );
};

// ---- SIDEBAR ----
const Sidebar = ({ active, setActive, onLogout }) => {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'catalog', label: 'Machinery Catalog', icon: Package },
    { id: 'requests', label: 'Client Requests', icon: FileText },
  ];

  return (
    <div className="admin-sidebar flex flex-col w-64 shrink-0 border-r border-white/5 bg-[#1a100a]/80 backdrop-blur-xl">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-9 h-9 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl flex items-center justify-center text-black font-black">R</div>
        <div>
          <div className="text-sm font-black gold-text">RUDRA TRADERS</div>
          <div className="text-xs text-gray-600">Admin Portal</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              active === item.id
                ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 shadow-lg shadow-[#d4af37]/5'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/5">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

// ---- DASHBOARD OVERVIEW ----
const DashboardOverview = ({ machinery, loading }) => {
  const [initLoading, setInitLoading] = useState(false);

  const handleInitDB = async () => {
    setInitLoading(true);
    try {
      for (const m of STATIC_MACHINERY) {
        await addDoc(collection(db, 'machinery'), m);
      }
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
    setInitLoading(false);
  };

  const inStock = machinery.filter(m => m.inStock).length;
  const avgPrice = machinery.length ? Math.round(machinery.reduce((a,m) => a + Number(m.price), 0) / machinery.length) : 0;
  
  const stats = [
    { label: 'Total Products', value: machinery.length, icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'In Stock', value: inStock, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Avg. Price', value: `₹${avgPrice.toLocaleString()}`, icon: DollarSign, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Categories', value: [...new Set(machinery.map(m => m.category))].length, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-white">Dashboard Overview</h2>
        {machinery.length === 0 && !loading && (
          <button onClick={handleInitDB} disabled={initLoading} className="btn-coral">
            {initLoading ? 'Initializing...' : 'Initialize Database with Default Data'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl hover-float border border-white/5">
            <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center mb-4`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <div className={`text-3xl font-black mb-1 ${s.color}`}>
              {loading ? <span className="animate-pulse">...</span> : s.value}
            </div>
            <div className="text-gray-400 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Product Summary Table */}
      <div className="glass-card rounded-2xl overflow-hidden hover-float border border-white/5">
        <div className="p-6 border-b border-white/5">
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
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500 animate-pulse">Loading database...</td></tr>
              ) : machinery.map(m => (
                <tr key={m.id}>
                  <td className="text-white font-medium">{m.name}</td>
                  <td>{m.category}</td>
                  <td className="text-yellow-400 font-bold">₹{Number(m.price).toLocaleString()}</td>
                  <td>{m.capacity}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${m.inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {m.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                </tr>
              ))}
              {machinery.length === 0 && !loading && (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500">No machinery found. Please initialize the database.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ---- CATALOG VIEW (CRUD) ----
const CatalogView = ({ machinery, refetch, loading }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'Feed Processing', capacity: '', price: '', originalPrice: '', image: '', description: '', inStock: true });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addDoc(collection(db, 'machinery'), {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        rating: 5.0,
        reviews: 0
      });
      setShowAdd(false);
      refetch();
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleToggleStock = async (id, currentStatus) => {
    try {
      const docRef = doc(db, 'machinery', id);
      await updateDoc(docRef, { inStock: !currentStatus });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this machine?")) return;
    try {
      await deleteDoc(doc(db, 'machinery', id));
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (showAdd) {
    return (
      <div className="max-w-2xl mx-auto glass-card p-8 rounded-3xl hover-float border border-white/5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-white">Add New Machinery</h2>
          <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Machine Name *</label>
            <input required type="text" className="input-dark bg-black/30 border-white/10" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Category</label>
              <select className="input-dark bg-black/30 border-white/10" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Capacity (e.g. 100 KG/HR)</label>
              <input required type="text" className="input-dark bg-black/30 border-white/10" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Selling Price (₹) *</label>
              <input required type="number" className="input-dark bg-black/30 border-white/10" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Original Price (₹)</label>
              <input required type="number" className="input-dark bg-black/30 border-white/10" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Image URL *</label>
            <input required type="url" className="input-dark bg-black/30 border-white/10" placeholder="https://..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea required rows="3" className="input-dark bg-black/30 border-white/10 resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>
          <button type="submit" disabled={saving} className="btn-gold w-full justify-center mt-4">
            {saving ? 'Saving to Database...' : 'Save Machinery'} <Save className="w-4 h-4 ml-2" />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-white">Manage Catalog</h2>
        <button onClick={() => setShowAdd(true)} className="btn-gold">
          <Plus className="w-4 h-4" /> Add Machine
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-20 text-yellow-400 animate-pulse">Fetching from database...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {machinery.map(m => (
            <div key={m.id} className="glass-card rounded-2xl overflow-hidden hover-float border border-white/5 flex flex-col">
              <img src={m.image} alt={m.name} className="w-full h-40 object-cover opacity-70" />
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-xs text-yellow-500/60 font-semibold uppercase mb-1">{m.category}</div>
                <h3 className="font-bold text-white mb-1 line-clamp-1">{m.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{m.capacity}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-yellow-400 font-black text-lg">₹{Number(m.price).toLocaleString()}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${m.inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {m.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                
                <div className="mt-auto pt-4 border-t border-white/5 flex gap-2">
                  <button onClick={() => handleToggleStock(m.id, m.inStock)} className="flex-1 btn-outline-gold text-xs justify-center px-2 py-1.5">
                    {m.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---- CLIENT REQUESTS (QUOTATIONS) ----
const ClientRequests = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const q = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setQuotes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchQuotes();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-black text-white mb-8">Client Quotation Requests</h2>
      {loading ? (
        <div className="text-center py-20 text-yellow-400 animate-pulse">Loading live requests...</div>
      ) : quotes.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl border border-white/5">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Requests Yet</h3>
          <p className="text-gray-400">When clients generate quotes on the website, they will appear here in real-time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map(q => (
            <div key={q.id} className="glass-card p-6 rounded-2xl hover-float border border-white/5 flex flex-col md:flex-row gap-6 justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-white text-lg">{q.clientDetails.name}</h3>
                  <span className="text-xs text-gray-500 bg-black/30 px-2 py-1 rounded-md">Ref: {q.refNo}</span>
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                  <p><span className="text-gray-500">Phone:</span> {q.clientDetails.phone}</p>
                  <p><span className="text-gray-500">Project:</span> {q.clientDetails.projectType || 'N/A'}</p>
                  <p><span className="text-gray-500">Address:</span> {q.clientDetails.address}, {q.clientDetails.pincode}</p>
                </div>
              </div>
              
              <div className="md:text-right flex flex-col justify-between">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Total Value</div>
                  <div className="text-2xl font-black gold-text">₹{Number(q.total).toLocaleString('en-IN', {maximumFractionDigits:0})}</div>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  {q.createdAt?.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---- MAIN ADMIN PAGE ----
const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [active, setActive] = useState('dashboard');
  const navigate = useNavigate();
  const { machinery, loading: machineryLoading, refetch } = useMachinery();

  useEffect(() => {
    const isAdmin = localStorage.getItem('rudra_admin') === 'true';
    if (isAdmin) {
      setUser({ email: 'admin@rudratraders.com' });
    }
    setLoadingUser(false);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('rudra_admin');
    setUser(null);
    navigate('/');
  };

  if (loadingUser) return (
    <div className="min-h-screen hero-gradient flex items-center justify-center">
      <div className="text-yellow-400 text-xl font-bold animate-pulse">Loading...</div>
    </div>
  );

  if (!user) return <AdminLogin onLogin={(u) => setUser(u)} />;

  const views = { 
    dashboard: <DashboardOverview machinery={machinery} loading={machineryLoading} />, 
    catalog: <CatalogView machinery={machinery} refetch={refetch} loading={machineryLoading} />, 
    requests: <ClientRequests /> 
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0f0f' }}>
      <Sidebar active={active} setActive={setActive} onLogout={handleLogout} />
      <div className="flex-1 p-8 overflow-y-auto max-h-screen">
        {views[active]}
      </div>
    </div>
  );
};

export default AdminPage;
