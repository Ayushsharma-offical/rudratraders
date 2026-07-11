import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SEO from './components/SEO';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';

const ScrollTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
};

const AppShell = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  return (
    <>
      <ScrollTop />
      {!isAdmin && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/machinery" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="*" element={
            <div className="pt-32 min-h-screen flex items-center justify-center text-center px-6">
              <div>
                <div className="text-8xl font-black gold-text mb-4">404</div>
                <h2 className="text-2xl font-bold text-white mb-4">Page not found</h2>
                <a href="/" className="btn-gold">Go Home</a>
              </div>
            </div>
          } />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </>
  );
};

// ─── INTRO VIDEO (MOBILE-SAFE) ─────────────────────────────────────────────
const IntroScreen = ({ onComplete }) => {
  const videoRef = useRef(null);
  const isApp = navigator.userAgent.includes('RudraApp');
  const [showMessage, setShowMessage] = useState(!isApp);
  const hasStartedRef = useRef(false);
  const completedRef = useRef(false);

  // Safe complete — prevents double-fire
  const safeComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }, [onComplete]);

  const startVideo = useCallback(() => {
    if (hasStartedRef.current) return;
    const vid = videoRef.current;
    if (!vid) return;
    hasStartedRef.current = true;

    vid.muted = false;
    vid.play().then(() => {
      setShowMessage(false);
    }).catch(() => {
      // Autoplay blocked → try muted
      vid.muted = true;
      vid.play().then(() => setShowMessage(false)).catch(() => {
        // Even muted play failed (very low memory) → skip intro
        safeComplete();
      });
    });
  }, [safeComplete]);

  useEffect(() => {
    if (isApp) {
      setTimeout(() => startVideo(), 100);
    }
  }, [isApp, startVideo]);

  // If the tab goes hidden while intro is playing (user switched app),
  // immediately mark intro as done so when tab restores it doesn't replay
  useEffect(() => {
    const onVisChange = () => {
      if (document.visibilityState === 'hidden' && !completedRef.current) {
        safeComplete();
      }
    };
    document.addEventListener('visibilitychange', onVisChange);
    return () => document.removeEventListener('visibilitychange', onVisChange);
  }, [safeComplete]);

  // Failsafe: if video hasn't finished in 15 seconds, skip
  useEffect(() => {
    const t = setTimeout(() => safeComplete(), 15000);
    return () => clearTimeout(t);
  }, [safeComplete]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      onMouseEnter={startVideo}
      onClick={startVideo}
    >
      <video
        ref={videoRef}
        playsInline
        preload="auto"
        onEnded={safeComplete}
        onError={safeComplete}
        className="w-full h-full object-contain"
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>

      {/* Stylish message — video start hote hi gayab */}
      {showMessage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-white/60 text-sm tracking-[0.3em] uppercase animate-pulse">
            Click anywhere to enter with sound
          </p>
        </div>
      )}

      <button
        onClick={(e) => { e.stopPropagation(); safeComplete(); }}
        className="absolute bottom-10 right-10 text-white/50 hover:text-white transition-colors text-sm"
      >
        Skip Intro &rarr;
      </button>
    </div>
  );
};

// ─── MAIN APP ──────────────────────────────────────────────────────────────
const INTRO_STORAGE_KEY = 'rudra_intro_ts';
const INTRO_COOLDOWN = 3600000; // 1 hour — show intro max once per hour

const App = () => {
  const [showIntro, setShowIntro] = useState(() => {
    try {
      // Check if there's a pending payment — NEVER show intro during payment recovery
      const pendingPayment = localStorage.getItem('rudra_pending_payment');
      if (pendingPayment) return false;

      const ts = localStorage.getItem(INTRO_STORAGE_KEY);
      if (ts) {
        const elapsed = Date.now() - parseInt(ts, 10);
        if (elapsed < INTRO_COOLDOWN) return false; // already played recently
      }
      return true;
    } catch {
      return false; // localStorage blocked → skip intro
    }
  });

  const handleIntroComplete = useCallback(() => {
    try {
      localStorage.setItem(INTRO_STORAGE_KEY, Date.now().toString());
    } catch { /* ignore */ }
    setShowIntro(false);
  }, []);

  return (
    <BrowserRouter>
      {showIntro ? (
        <IntroScreen onComplete={handleIntroComplete} />
      ) : (
        <AppShell />
      )}
    </BrowserRouter>
  );
};

export default App;
