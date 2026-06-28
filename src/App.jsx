import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
      <main style={{ paddingTop: isAdmin ? '0px' : '90px' }}>
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

const IntroScreen = ({ onComplete }) => {
  const [started, setStarted] = React.useState(false);
  const videoRef = React.useRef(null);

  const handleStart = () => {
    setStarted(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    }, 100);
  };

  if (!started) {
    return (
  <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center gap-6">
  <img src="/favicon.svg" className="w-24 h-24 animate-pulse" />
  <h1 className="text-white text-3xl font-bold tracking-widest">RUDRA TRADERS</h1>
  <button
    onClick={handleStart}
    className="mt-4 text-yellow-400 border border-yellow-400 px-12 py-4 text-sm tracking-widest uppercase hover:bg-yellow-400 hover:text-black transition-all"
  >
    ▶ Enter
  </button>
</div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        playsInline
        onEnded={onComplete}
        className="w-full h-full object-contain"
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>
      <button
        onClick={onComplete}
        className="absolute bottom-10 right-10 text-white/50 hover:text-white transition-colors text-sm"
      >
        Skip Intro &rarr;
      </button>
    </div>
  );
};

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  return (
    <BrowserRouter>
      {showIntro ? (
        <IntroScreen onComplete={() => setShowIntro(false)} />
      ) : (
        <AppShell />
      )}
    </BrowserRouter>
  );
};

export default App;
