import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';

const ScrollTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
};

const Navbar = () => (
  <nav className="p-4 bg-brand-green flex justify-between items-center text-brand-light sticky top-0 z-50">
    <div className="font-extrabold text-2xl text-brand-gold">Rudra Traders</div>
    <div className="space-x-6 text-sm font-semibold">
      <a href="/" className="hover:text-brand-gold transition duration-300">Home</a>
      <a href="/products" className="hover:text-brand-gold transition duration-300">Machinery Catalog</a>
      <a href="/contact" className="hover:text-brand-gold transition duration-300">Contact Us</a>
    </div>
  </nav>
);

const AppShell = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  return (
    <>
      <ScrollTop />
      {!isAdmin && <Navbar />}
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* Aliasing machinery to products for backward compat */}
          <Route path="/machinery" element={<ProductsPage />} />
        </Routes>
      </main>
      {!isAdmin && (
        <footer className="bg-[#050a0a] border-t border-brand-green/30 p-12 text-center mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="text-left mb-6 md:mb-0">
              <h3 className="text-brand-gold font-bold text-xl mb-2">Rudra Traders</h3>
              <p className="text-gray-400">Address: 255 A, Vipin Garden, Uttam Nagar, New Delhi-110059</p>
              <p className="text-gray-400">Contact: +91 7982813507 | +91 6200054896</p>
            </div>
            <div className="text-right">
              <p className="text-sm mt-4 text-gray-500">Premium MSME Machinery Solutions</p>
              <p className="text-sm text-gray-500">&copy; 2025 Rudra Traders. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
};

export default App;
