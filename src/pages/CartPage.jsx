import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Download, CheckCircle2, ShoppingCart, ArrowLeft, Plus, Minus, LogIn, CreditCard, X } from 'lucide-react';
import { getCart, removeFromCart, updateQty, clearCart } from '../data/machinery';
import { generateQuotation } from '../utils/generateQuotation';
import { generateAdvanceReceipt } from '../utils/generateAdvanceReceipt';
import { auth, rtdb } from '../firebase';
import { signInAnonymously } from 'firebase/auth';
import { ref, push, update } from 'firebase/database';
import SEO from '../components/SEO';

let refCounter = parseInt(localStorage.getItem('rudra_ref') || '65');

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1); // 1=Cart, 2=Details, 3=Done
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [client, setClient] = useState({
    name: '', careOf: '', address: '', pincode: '', phone: '', projectType: ''
  });
  const [quoteId, setQuoteId] = useState(null);
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [skipQuotation, setSkipQuotation] = useState(false);
  useEffect(() => {
    setCart(getCart());
    const handler = () => setCart(getCart());
    window.addEventListener('cart_updated', handler);
    
    const unsub = auth.onAuthStateChanged(u => {
      if (u) {
        setUser(u);
      } else {
        // Sign in anonymously in the background so Firebase DB rules still work
        signInAnonymously(auth).catch(console.error);
      }
    });

    return () => {
      window.removeEventListener('cart_updated', handler);
      unsub();
    };
  }, []);

  const handleRemove = (id) => { removeFromCart(id); setCart(getCart()); };
  const handleQty = (id, qty) => { updateQty(id, qty); setCart(getCart()); };

  const subtotal = cart.reduce((a, i) => a + i.price * i.quantity, 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const validate = () => {
    const e = {};
    if (!client.name.trim()) e.name = 'Name is required';
    if (!client.phone.trim() || !/^\d{10}$/.test(client.phone.trim())) e.phone = 'Valid 10-digit mobile required';
    if (!client.address.trim()) e.address = 'Address is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleProceedToQuotation = () => {
    if (!validate()) return;
    setShowTerms(true);
  };

  const handleSkipQuotation = async () => {
    if (!validate()) return;
    refCounter++;
    localStorage.setItem('rudra_ref', refCounter);
    
    const items = cart.map(i => ({
      description: String(i.name || 'Machinery Item'),
      quantity: Number(i.quantity) || 1,
      rate: Number(i.price) || 0
    }));
    const safeClient = {
      name: client.name || 'Client',
      careOf: client.careOf || '',
      address: client.address || '',
      pincode: client.pincode || '',
      phone: client.phone || '',
      projectType: client.projectType || 'Machinery Unit',
    };

    try {
      const newQuoteRef = await push(ref(rtdb, 'quotes'), {
        userId: user ? user.uid : 'guest',
        clientDetails: safeClient,
        items: items,
        refNo: refCounter.toString(),
        subtotal,
        gst,
        total,
        paymentStatus: 'Pending',
        createdAt: new Date().toISOString()
      });
      setQuoteId(newQuoteRef.key);
    } catch (err) {
      console.error('Error saving quote:', err);
    }
    
    setSkipQuotation(true);
    setStep(3);
  };

  const handleQuotationFeePayment = async () => {
    setPaying(true);
    try {
      refCounter++;
      localStorage.setItem('rudra_ref', refCounter);
      
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 2000, receipt: refCounter.toString() })
      });
      
      const order = await res.json();
      if (!order || order.error) throw new Error(order.error || 'Failed to create order');

      const options = {
        key: 'rzp_live_T6bASddyHt5W3K',
        amount: order.amount,
        currency: order.currency,
        name: "Rudra Traders",
        description: `Quotation Fee for Quote #${refCounter}`,
        order_id: order.order_id,
        handler: async (response) => {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const result = await verifyRes.json();
            
            if (result.success) {
              const items = cart.map(i => ({
                description: String(i.name || 'Machinery Item'),
                quantity: Number(i.quantity) || 1,
                rate: Number(i.price) || 0
              }));
              const safeClient = {
                name: client.name || 'Client',
                careOf: client.careOf || '',
                address: client.address || '',
                pincode: client.pincode || '',
                phone: client.phone || '',
                projectType: client.projectType || 'Machinery Unit',
              };

              try {
                const newQuoteRef = await push(ref(rtdb, 'quotes'), {
                  userId: user ? user.uid : 'guest',
                  clientDetails: safeClient,
                  items: items,
                  refNo: refCounter.toString(),
                  subtotal,
                  gst,
                  total,
                  quotationFeePaid: true,
                  paymentStatus: 'Quotation Generated',
                  createdAt: new Date().toISOString()
                });
                setQuoteId(newQuoteRef.key);
              } catch (err) {
                console.error('Error saving quote:', err);
              }

              setShowTerms(false);
              setStep(3);
            } else {
              alert('Payment Verification Failed!');
            }
          } catch (err) {
            console.error('Verify error:', err);
            alert('Verification Error. Please contact support.');
          }
        },
        prefill: {
          name: client.name || '',
          contact: client.phone || '',
        },
        theme: {
          color: "#d4af37"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert('Payment Failed: ' + response.error.description);
      });
      rzp.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      alert('Could not start payment: ' + error.message);
    } finally {
      setPaying(false);
    }
  };

  const handlePayment = async (isFullPayment = true) => {
    setPaying(true);
    try {
      let paymentAmount = Math.max(1, Math.round(total));
      
      if (!isFullPayment) {
        const parsed = parseInt(customAmountStr, 10);
        if (isNaN(parsed) || parsed < 100) {
          alert('Minimum token amount is ₹100');
          setPaying(false);
          return;
        }
        if (parsed > paymentAmount) {
          alert('Token amount cannot be greater than the total amount.');
          setPaying(false);
          return;
        }
        paymentAmount = parsed;
      }

      // 1. Create order on backend (amount in paise - minimum 100)
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: paymentAmount * 100, receipt: refCounter.toString() })
      });
      
      const order = await res.json();
      if (!order || order.error) throw new Error(order.error || 'Failed to create order');

      // 2. Open Razorpay Modal
      const options = {
        key: 'rzp_live_T6bASddyHt5W3K', // Safe to hardcode public key ID
        amount: order.amount,
        currency: order.currency,
        name: "Rudra Traders",
        description: isFullPayment ? `Full Payment for Quote #${refCounter}` : `Token Payment for Quote #${refCounter}`,
        order_id: order.order_id,
        handler: async (response) => {
          try {
            // 3. Verify Payment Signature
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const result = await verifyRes.json();
            
            if (result.success) {
              setPaymentSuccess(true);
              
              // Generate payment receipt
              try {
                generateAdvanceReceipt(client, paymentAmount, order.order_id);
              } catch (receiptErr) {
                console.error('Failed to generate receipt:', receiptErr);
              }

              // Update status in RTDB
              try {
                if (quoteId) {
                  const statusLabel = paymentAmount >= Math.round(total) ? 'Full Payment Received' : 'Token Paid';
                  await update(ref(rtdb, `quotes/${quoteId}`), {
                    paymentStatus: statusLabel,
                    advanceAmount: paymentAmount, // Keeping field name for backwards compatibility
                    totalAmount: Math.round(total),
                    amountLeft: Math.round(total) - paymentAmount,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id
                  });
                }
              } catch (e) { console.error('Error updating status:', e); }
            } else {
              alert('Payment Verification Failed!');
            }
          } catch (err) {
            console.error('Verify error:', err);
            alert('Verification Error. Please contact support.');
          }
        },
        prefill: {
          name: client.name || '',
          contact: client.phone || '',
        },
        theme: {
          color: "#d4af37" // gold
        }
      };

      console.log('Order ID:', order.order_id);
      console.log('Amount:', order.amount);

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        console.error('Payment failed full response:', JSON.stringify(response));
        alert('Payment Failed: ' + response.error.code + ' - ' + response.error.description);
      });
      rzp.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      alert('Could not start payment: ' + error.message);
    } finally {
      setPaying(false);
    }
  };

  if (step === 3) return (
    <div className="pt-32 min-h-screen flex items-center justify-center px-6">
      <div className="glass-card p-6 md:p-12 rounded-3xl text-center max-w-lg w-full">
        {(!skipQuotation || paymentSuccess) && (
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
        )}
        
        <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
          {paymentSuccess ? 'Payment Successful!' : (!skipQuotation ? 'Payment Successful!' : 'Complete Your Order')}
        </h2>
        
        {!skipQuotation && <p className="text-gray-400 mb-8">Your ₹20 quotation fee was received successfully.</p>}

        {(!pdfDownloaded && !skipQuotation) ? (
          <div className="mb-8 p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.1)]">
             <h3 className="text-yellow-400 font-bold mb-2 text-lg">Your Quotation is Ready</h3>
             <p className="text-sm text-gray-400 mb-4">Click below to generate and download your PDF.</p>
             <button onClick={() => {
                 const items = cart.map(i => ({
                   description: String(i.name || 'Machinery Item'),
                   quantity: Number(i.quantity) || 1,
                   rate: Number(i.price) || 0
                 }));
                 generateQuotation(client, items, refCounter.toString());
                 setPdfDownloaded(true);
             }} className="btn-gold w-full justify-center text-lg shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <Download className="w-5 h-5" /> Download Quotation PDF
             </button>
          </div>
        ) : (
          <>
            {!skipQuotation && (
              <div className="mb-8 p-3 bg-green-500/10 border border-green-500/20 rounded-xl inline-flex items-center gap-2 text-green-400 text-sm font-bold">
                <CheckCircle2 className="w-4 h-4" /> Quotation PDF Downloaded
              </div>
            )}
            {paymentSuccess ? (
              <div className="mb-8 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl">
                <h3 className="text-green-400 font-bold mb-1">Payment Received</h3>
                <p className="text-sm text-green-500/70">Your order is confirmed. We will process it immediately.</p>
              </div>
            ) : (
              <div className="mb-8 p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                <h3 className="text-yellow-400 font-bold mb-2 text-lg">Confirm Your Order Now</h3>
                <p className="text-sm text-gray-400 mb-4">Pay the full amount or a token amount to lock current prices and prioritize your order processing.</p>
                
                <button onClick={() => handlePayment(true)} disabled={paying} className="btn-gold w-full justify-center text-base mb-4 shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50">
                  {paying ? 'Processing...' : <><CreditCard className="w-5 h-5" /> Pay Full (₹{Math.max(1, Math.round(total)).toLocaleString()})</>}
                </button>
                
                <div className="flex items-center gap-4 my-4">
                  <div className="h-px bg-white/10 flex-1"></div>
                  <span className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">OR PAY TOKEN</span>
                  <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <span className="flex items-center justify-center bg-black/40 border border-white/10 rounded-xl px-4 text-gray-400 font-bold">₹</span>
                    <input 
                      type="number" 
                      min="100" 
                      max={Math.max(1, Math.round(total))}
                      placeholder="Min. ₹100" 
                      value={customAmountStr}
                      onChange={e => setCustomAmountStr(e.target.value)}
                      className="input-dark flex-1" 
                      style={{ background: 'rgba(0,0,0,0.3)' }} 
                    />
                  </div>
                  <button 
                    onClick={() => handlePayment(false)} 
                    disabled={paying || !customAmountStr || parseInt(customAmountStr) < 100} 
                    className="btn-outline-gold w-full justify-center text-sm sm:text-base disabled:opacity-50"
                  >
                    {paying ? 'Processing...' : `Pay Token Amount`}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <div className="space-y-3">
          <button onClick={() => { clearCart(); setCart([]); setStep(1); setClient({ name: user?.displayName || '',careOf:'',address:'',pincode:'',phone:'',projectType:'' }); setPaymentSuccess(false); setPdfDownloaded(false); }} className="btn-outline-gold w-full justify-center">
            Start New Quote
          </button>
          <button onClick={() => navigate('/products')} className="btn-outline-gold w-full justify-center" style={{ background: 'transparent' }}>
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-20 pt-6">
      <SEO 
        title="Your Cart & Checkout"
        description="Review your selected items and complete your order with Rudra Traders securely."
        url="/cart"
      />
      <div className="max-w-7xl mx-auto px-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:text-yellow-400 transition-colors text-gray-400">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="badge-gold inline-block mb-1">Quote Builder</div>
          <h1 className="text-3xl font-black text-white">Request <span className="gold-text">Quotation</span></h1>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-4 mb-12">
        {['Select Machinery', 'Your Details', 'Download PDF'].map((s, i) => (
          <React.Fragment key={i}>
            <div className={`flex items-center gap-2 ${step === i + 1 ? 'text-yellow-400' : step > i + 1 ? 'text-green-400' : 'text-gray-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step === i + 1 ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400' : step > i + 1 ? 'border-green-400 bg-green-400/10 text-green-400' : 'border-gray-700 text-gray-600'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className="text-sm font-semibold hidden sm:block">{s}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-px ${step > i + 1 ? 'bg-green-400/30' : 'bg-gray-700'}`}></div>}
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cart.length === 0 ? (
              <div className="text-center py-24 glass-card rounded-2xl">
                <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Your quote cart is empty</h3>
                <p className="text-gray-400 mb-6">Add machinery from our catalog to generate a quotation</p>
                <Link to="/products" className="btn-gold">Browse Machinery</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row gap-4 sm:items-center">
                    <div className="flex gap-4 items-center flex-1 min-w-0">
                      <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover opacity-80 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-yellow-500/70 font-medium uppercase mb-0.5 sm:mb-1 truncate">{item.category}</div>
                        <h3 className="font-bold text-white text-sm leading-snug line-clamp-2 sm:line-clamp-none">{item.name}</h3>
                        <div className="text-yellow-400 font-black text-sm sm:text-base mt-0.5 sm:mt-1">₹{item.price.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t border-white/5 sm:border-t-0 pt-3 sm:pt-0">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <button
                          onClick={() => handleQty(item.id, item.quantity - 1)}
                          className="w-8 h-8 sm:w-8 sm:h-8 rounded-full bg-white/5 hover:bg-yellow-500/20 text-white flex items-center justify-center transition-all border border-white/10 sm:border-transparent"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 sm:w-8 text-center font-bold text-white text-sm sm:text-base">{item.quantity}</span>
                        <button
                          onClick={() => handleQty(item.id, item.quantity + 1)}
                          className="w-8 h-8 sm:w-8 sm:h-8 rounded-full bg-white/5 hover:bg-yellow-500/20 text-white flex items-center justify-center transition-all border border-white/10 sm:border-transparent"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-right flex items-center sm:block gap-4">
                        <div className="font-bold text-yellow-300 text-sm sm:text-base">₹{(item.price * item.quantity).toLocaleString()}</div>
                        <button onClick={() => handleRemove(item.id)} className="w-8 h-8 sm:w-auto sm:h-auto sm:mt-2 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors">
                          <Trash2 className="w-4 h-4 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="glass-card p-6 rounded-2xl h-fit sticky top-28">
            <h3 className="font-bold text-white text-lg mb-6">Quote Summary</h3>
            <div className="space-y-3 text-sm mb-6" style={{ borderBottom: '1px solid rgba(212,175,55,0.1)', paddingBottom: '16px' }}>
              {cart.map(i => (
                <div key={i.id} className="flex justify-between text-gray-400">
                  <span className="truncate mr-2">{i.name} x{i.quantity}</span>
                  <span className="shrink-0">₹{(i.price * i.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal (ex. GST)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>GST @18%</span>
                <span>₹{gst.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between text-white font-black text-lg pt-2" style={{ borderTop: '1px solid rgba(212,175,55,0.2)' }}>
                <span>Total</span>
                <span className="gold-text">₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
            {cart.length > 0 && (
              <button onClick={() => setStep(2)} className="btn-gold w-full justify-center">
                Proceed to Details <Download className="w-4 h-4" />
              </button>
            )}
            <p className="text-xs text-gray-600 text-center mt-3">* Transportation charges extra</p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 glass-card p-8 rounded-2xl hover-float">
                <div className="flex justify-between items-start mb-8">
                  <h2 className="text-xl font-bold text-white">Your Details</h2>
                  <div className="text-right">
                    <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-white transition-colors">
                      &larr; Back to Cart
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2 font-medium">Full Name *</label>
                    <input type="text" className={`input-dark ${errors.name ? 'border-red-500' : ''}`} placeholder="Your full name" value={client.name} onChange={e => setClient({...client, name: e.target.value})} />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2 font-medium">S/O or Care Of</label>
                    <input type="text" className="input-dark" placeholder="Father's / Guardian's name" value={client.careOf} onChange={e => setClient({...client, careOf: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2 font-medium">Full Address *</label>
                    <textarea className={`input-dark resize-none ${errors.address ? 'border-red-500' : ''}`} rows="3" placeholder="Village, District, State..." value={client.address} onChange={e => setClient({...client, address: e.target.value})}></textarea>
                    {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2 font-medium">PIN Code</label>
                    <input type="text" className="input-dark" placeholder="PIN Code" value={client.pincode} onChange={e => setClient({...client, pincode: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2 font-medium">Mobile Number *</label>
                    <input type="tel" className={`input-dark ${errors.phone ? 'border-red-500' : ''}`} placeholder="10-digit mobile number" value={client.phone} onChange={e => setClient({...client, phone: e.target.value})} />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2 font-medium">Project / Unit Name</label>
                    <input type="text" className="input-dark" placeholder="e.g. Bakery Processing Unit, Poultry Farm Unit" value={client.projectType} onChange={e => setClient({...client, projectType: e.target.value})} />
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-8">
                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="btn-outline-gold">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button onClick={handleProceedToQuotation} className="btn-gold flex-1 justify-center text-sm md:text-base text-center break-words">
                      Proceed to generate quotation (Pay ₹20)
                    </button>
                  </div>
                  <button onClick={handleSkipQuotation} className="btn-outline-gold w-full justify-center text-sm md:text-base border-gray-600 text-gray-300 hover:border-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10 transition-all">
                    Pay Full / Advance Payment (Skip Quotation)
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Summary */}
          <div className="glass-card p-6 rounded-2xl h-fit sticky top-28 hover-float">
            <h3 className="font-bold text-white text-lg mb-6">Order Summary</h3>
            <div className="space-y-3 mb-6">
              {cart.map(i => (
                <div key={i.id} className="flex justify-between text-sm text-gray-400">
                  <span className="truncate mr-2">{i.name} ×{i.quantity}</span>
                  <span className="shrink-0 text-white font-medium">₹{(i.price * i.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 flex justify-between text-white font-black text-xl" style={{ borderTop: '1px solid rgba(212,175,55,0.2)' }}>
              <span>Grand Total</span>
              <span className="gold-text">₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
            <p className="text-xs text-gray-600 mt-3">Inclusive of GST @18%</p>
          </div>
        </div>
      )}

      {/* Terms & Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card p-6 md:p-8 rounded-3xl max-w-md w-full border border-yellow-500/30 shadow-[0_0_40px_rgba(212,175,55,0.15)] relative">
            <button onClick={() => setShowTerms(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl md:text-2xl font-black text-white mb-4 text-center">Terms & Conditions</h2>
            <div className="space-y-4 mb-6">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-sm md:text-base text-gray-200 leading-relaxed font-medium">
                  यह ₹20 शुल्क वापस नहीं किया जाएगा (Non-refundable)। इसका मतलब यह नहीं है कि आपने मशीन खरीद ली है या यह आपके घर भेजी जाएगी। यह केवल कोटेशन (Quotation) प्राप्त करने के लिए है।
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                  This ₹20 fee is strictly non-refundable. Paying this does not mean you own the machine or that it will be delivered. It is solely a processing fee to generate your quotation.
                </p>
              </div>
            </div>
            <button 
              onClick={handleQuotationFeePayment} 
              disabled={paying}
              className="btn-gold w-full justify-center text-lg shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50"
            >
              {paying ? 'Processing...' : 'Proceed & Pay ₹20'}
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default CartPage;
