import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, Globe, ShieldCheck, Factory } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden bg-brand-dark">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a3636] to-[#0d1c1c] opacity-90 z-0"></div>
        {/* Accent glow */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-bronze rounded-full blur-[150px] opacity-20 z-0"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-brand-green/50 border border-brand-bronze/30 text-brand-gold px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></span>
              <span>LIVE - Doorstep delivery across India</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
              India's most <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-bronze">trusted</span> <br />
              supply platform.
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              Premium MSME-grade machinery — sourced internationally and domestically, delivered with discipline to your doorstep.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate('/products')}
                className="btn-primary flex items-center shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              >
                Explore Machinery <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="btn-outline"
              >
                Request Quote
              </button>
            </div>
          </div>
          <div className="hidden lg:flex justify-center relative">
            <div className="absolute w-full h-full bg-brand-gold/10 rounded-full blur-3xl -z-10"></div>
            {/* Placeholder for Hero Graphic (e.g. 3D Machinery/Forklift like the reference) */}
            <div className="w-full max-w-lg h-96 bg-brand-green/40 border border-brand-gold/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-2xl relative">
              <Factory className="w-32 h-32 text-brand-gold opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-gray-400 font-medium">
                [High-Quality Machinery Graphic]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features/About Section */}
      <section className="py-24 bg-[#0a1515] relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-gold tracking-widest uppercase mb-3">About Us</h2>
            <p className="text-3xl md:text-4xl font-bold text-white">Empowering MSMEs Worldwide</p>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              We specialize exclusively in industrial and MSME machinery. Whether you need a 5HP Cyclone Grinder or a complete Bakery Processing Unit, we source the best equipment globally and bring it directly to your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-brand-dark border border-brand-green p-8 rounded-2xl hover:border-brand-gold transition duration-300">
              <div className="bg-brand-green/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-brand-gold" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Global Sourcing</h3>
              <p className="text-gray-400 leading-relaxed">
                We import state-of-the-art machinery from international hubs and source the best domestic equipment from across India.
              </p>
            </div>
            
            <div className="bg-brand-dark border border-brand-green p-8 rounded-2xl hover:border-brand-gold transition duration-300 transform md:-translate-y-4">
              <div className="bg-brand-green/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Truck className="w-7 h-7 text-brand-gold" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Doorstep Delivery</h3>
              <p className="text-gray-400 leading-relaxed">
                Logistics handled seamlessly. We ensure your heavy machinery reaches your facility safely and on time, anywhere in the country.
              </p>
            </div>

            <div className="bg-brand-dark border border-brand-green p-8 rounded-2xl hover:border-brand-gold transition duration-300">
              <div className="bg-brand-green/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7 text-brand-gold" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Quality Assured</h3>
              <p className="text-gray-400 leading-relaxed">
                Every machine undergoes rigorous MSME-grade quality checks. Only the most durable and efficient equipment makes it to our catalog.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
