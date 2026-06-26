import React, { useState, useEffect } from 'react';
import { generateQuotation } from '../utils/generateQuotation';
import { Trash2, Download, CheckCircle2 } from 'lucide-react';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [clientDetails, setClientDetails] = useState({
    name: '',
    careOf: '',
    address: '',
    pincode: '',
    phone: '',
    projectType: 'Machinery Unit'
  });
  const [isGenerated, setIsGenerated] = useState(false);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('rudra_cart') || '[]');
    setCartItems(items);
  }, []);

  const handleRemove = (id) => {
    const updated = cartItems.filter(i => i.id !== id);
    setCartItems(updated);
    localStorage.setItem('rudra_cart', JSON.stringify(updated));
  };

  const handleGenerateQuote = (e) => {
    e.preventDefault();
    if(cartItems.length === 0) return alert("Your cart is empty.");
    
    // Generate formatted items for PDF
    const formattedItems = cartItems.map(item => ({
      description: item.name,
      quantity: item.quantity,
      rate: item.price
    }));

    generateQuotation(clientDetails, formattedItems);
    setIsGenerated(true);
  };

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-12">Request <span className="text-brand-gold">Quotation</span></h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Cart Items */}
        <div>
          <h2 className="text-2xl font-bold text-brand-gold mb-6">Selected Machinery</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-400">No machinery selected yet.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="bg-brand-dark border border-brand-green p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white">{item.name}</h3>
                    <p className="text-sm text-gray-400">Qty: {item.quantity} x ₹{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-brand-gold">₹{(item.price * item.quantity).toLocaleString()}</span>
                    <button onClick={() => handleRemove(item.id)} className="text-red-500 hover:text-red-400">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              <div className="text-right pt-4 border-t border-brand-green">
                <span className="text-gray-400 mr-4">Total (Excl. GST):</span>
                <span className="text-2xl font-bold text-brand-gold">₹{total.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Client Details Form */}
        <div>
          <h2 className="text-2xl font-bold text-brand-gold mb-6">Your Details</h2>
          {isGenerated ? (
            <div className="bg-brand-green/20 border border-brand-green p-8 rounded-2xl text-center">
              <CheckCircle2 className="w-16 h-16 text-brand-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Quotation Generated!</h3>
              <p className="text-gray-400 mb-6">Your PDF quotation has been downloaded. You can present this document for your requirements.</p>
              <button onClick={() => setIsGenerated(false)} className="btn-outline">
                Generate Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleGenerateQuote} className="bg-brand-dark border border-brand-green p-8 rounded-2xl space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Full Name *</label>
                <input required type="text" className="w-full bg-[#111] border border-brand-green rounded-md p-3 text-white focus:border-brand-gold outline-none" value={clientDetails.name} onChange={e => setClientDetails({...clientDetails, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">S/O or C/O</label>
                <input type="text" className="w-full bg-[#111] border border-brand-green rounded-md p-3 text-white focus:border-brand-gold outline-none" value={clientDetails.careOf} onChange={e => setClientDetails({...clientDetails, careOf: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Address *</label>
                <textarea required className="w-full bg-[#111] border border-brand-green rounded-md p-3 text-white focus:border-brand-gold outline-none" rows="2" value={clientDetails.address} onChange={e => setClientDetails({...clientDetails, address: e.target.value})}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Pincode</label>
                  <input type="text" className="w-full bg-[#111] border border-brand-green rounded-md p-3 text-white focus:border-brand-gold outline-none" value={clientDetails.pincode} onChange={e => setClientDetails({...clientDetails, pincode: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Mobile No *</label>
                  <input required type="tel" className="w-full bg-[#111] border border-brand-green rounded-md p-3 text-white focus:border-brand-gold outline-none" value={clientDetails.phone} onChange={e => setClientDetails({...clientDetails, phone: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Project/Unit Name</label>
                <input type="text" placeholder="e.g. Bakery Processing Unit" className="w-full bg-[#111] border border-brand-green rounded-md p-3 text-white focus:border-brand-gold outline-none" value={clientDetails.projectType} onChange={e => setClientDetails({...clientDetails, projectType: e.target.value})} />
              </div>
              
              <button type="submit" className="w-full btn-primary flex justify-center items-center mt-6">
                <Download className="w-5 h-5 mr-2" /> Download Quotation
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
