import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Share2, Heart, ExternalLink, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: 'linear-gradient(180deg, #060b0b 0%, #030707 100%)', borderTop: '1px solid rgba(212,175,55,0.1)' }}>
      {/* CTA Strip */}
      <div style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(184,134,11,0.05))', borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Ready to power your MSME unit?</h3>
            <p className="text-gray-400">Get a custom quotation for any machinery in under 2 minutes.</p>
          </div>
          <Link to="/cart" className="btn-gold shrink-0">
            Get Free Quotation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-800 flex items-center justify-center text-black font-black text-lg">R</div>
            <div>
              <span className="text-lg font-black gold-text">RUDRA TRADERS</span>
              <div className="text-[10px] text-yellow-500/60 tracking-widest uppercase">MSME Machinery</div>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            India's trusted source for premium MSME-grade industrial machinery. Globally sourced, delivered to your doorstep.
          </p>
          <div className="flex gap-3">
            {[Share2, Heart, ExternalLink].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full border border-yellow-500/20 flex items-center justify-center text-gray-400 hover:border-yellow-500 hover:text-yellow-400 transition-all">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-white mb-6 text-sm tracking-widest uppercase">Quick Links</h4>
          <ul className="space-y-3">
            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'Machinery Catalog' },
              { to: '/about', label: 'About Us' },
              { to: '/cart', label: 'Request Quotation' },
              { to: '/contact', label: 'Contact Us' },
            ].map(l => (
              <li key={l.to}>
                <Link to={l.to} className="text-gray-400 hover:text-yellow-400 text-sm transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Machinery Categories */}
        <div>
          <h4 className="font-bold text-white mb-6 text-sm tracking-widest uppercase">Machinery</h4>
          <ul className="space-y-3">
            {['Poultry Feed Machines', 'Flour Milling Machines', 'Oil Expeller Units', 'Spice Grinding Plants', 'Bakery Equipment', 'Cyclone Grinders', 'Mixture Machines', 'Packaging Units'].map(item => (
              <li key={item}>
                <Link to="/products" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-white mb-6 text-sm tracking-widest uppercase">Contact</h4>
          <ul className="space-y-4">
            <li className="flex gap-3 items-start">
              <MapPin className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <span className="text-gray-400 text-sm leading-relaxed">255A, Vipin Garden, Behind Ring Meadows Public School, Dwarka, New Delhi - 110059</span>
            </li>
            <li className="flex gap-3 items-center">
              <Phone className="w-4 h-4 text-yellow-400 shrink-0" />
              <a href="tel:+917982813507" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">+91 7982813507</a>
            </li>
            <li className="flex gap-3 items-center">
              <Mail className="w-4 h-4 text-yellow-400 shrink-0" />
              <a href="mailto:rudratraders.store@gmail.com" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors break-all">rudratraders.store@gmail.com</a>
            </li>
            <li className="flex gap-3 items-center">
              <Clock className="w-4 h-4 text-yellow-400 shrink-0" />
              <span className="text-gray-400 text-sm">Mon - Sat: 9:00 AM - 7:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(212,175,55,0.08)' }} className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="text-gray-500 text-sm">© 2025 Rudra Traders. All rights reserved. | GST: 07BCFPK2624A1Z7</p>
        <p className="text-gray-600 text-xs">Built with ❤️ for Indian MSMEs</p>
      </div>
    </footer>
  );
};

export default Footer;
