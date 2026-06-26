import React from 'react';
import { Globe, Truck, ShieldCheck, Award, Users, Factory, Zap } from 'lucide-react';

const AboutPage = () => {
  const values = [
    { icon: ShieldCheck, title: 'Integrity First', desc: 'We never compromise on product quality. Every machine we sell is one we stand behind completely.' },
    { icon: Truck, title: 'Reliable Delivery', desc: 'Our end-to-end logistics ensure your machinery arrives safely at your unit, anywhere in India.' },
    { icon: Globe, title: 'Global Reach', desc: 'We source from international suppliers in China, Germany, and Taiwan — as well as top domestic manufacturers.' },
    { icon: Zap, title: 'Fast Response', desc: 'Get your quotation within minutes and a callback from our team within 24 hours.' },
  ];

  const team = [
    { name: 'Reshu Ranjan', role: 'CEO', desc: 'With a deep passion for empowering small businesses, Reshu leads Rudra Traders to new heights.', mediaType: 'video', media: '/ceo-video.mp4' },
    { name: 'Manas Kumar', role: 'Logistics Head', desc: 'Our logistics expert ensuring every order is dispatched on time and delivered safely across India.', mediaType: 'icon' },
    { name: 'Ayush Sharma', role: 'Technical Head', desc: 'Industry expert who verifies quality, capacity, and efficiency of every machine in our catalog.', mediaType: 'image', media: '/ayush-sharma.jpg' },
  ];

  return (
    <div className="pt-28 min-h-screen pb-20">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="badge-gold inline-block mb-6">Our Story</div>
            <h1 className="text-5xl font-black text-white mb-6 leading-tight">
              Built for India's <span className="gold-text">Entrepreneurs</span>
            </h1>
            <p className="text-gray-400 leading-relaxed mb-6 text-lg">
              Rudra Traders was founded with a single mission: make premium industrial machinery accessible to every MSME entrepreneur in India. Based in New Delhi, we operate across the entire country — sourcing the best equipment globally and delivering it to your doorstep.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              We believe that every small business deserves access to quality industrial infrastructure. That's why we go the extra mile — visiting factories, vetting suppliers, negotiating the best prices — so you don't have to.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '500+', label: 'Clients Served' },
                { value: '10+', label: 'Years Experience' },
                { value: '28+', label: 'States Reached' },
              ].map((s, i) => (
                <div key={i} className="glass-card p-4 rounded-xl text-center">
                  <div className="text-2xl font-black gold-text">{s.value}</div>
                  <div className="text-gray-500 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400" alt="Factory" className="rounded-2xl h-56 w-full object-cover opacity-70 mt-8" />
            <img src="https://images.unsplash.com/photo-1565514020179-026b92b2d796?auto=format&fit=crop&q=80&w=400" alt="Machinery" className="rounded-2xl h-56 w-full object-cover opacity-70" />
            <img src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400" alt="Equipment" className="rounded-2xl h-56 w-full object-cover opacity-70" />
            <img src="https://images.unsplash.com/photo-1503596476-1c12a8ba09a9?auto=format&fit=crop&q=80&w=400" alt="Processing" className="rounded-2xl h-56 w-full object-cover opacity-70 -mt-8" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: 'linear-gradient(180deg, #060b0b, #0a1a1a)' }} className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-gold inline-block mb-4">Our Values</div>
            <h2 className="text-4xl font-black text-white">What Drives Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="glass-card p-8 rounded-2xl text-center hover:border-yellow-500/40 transition-all group">
                <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-500/20 transition-all">
                  <v.icon className="w-7 h-7 text-yellow-400" />
                </div>
                <h3 className="font-bold text-white text-lg mb-3">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="badge-gold inline-block mb-4">The Team</div>
          <h2 className="text-4xl font-black text-white">People Behind <span className="gold-text">Rudra Traders</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {team.map((t, i) => (
            <div key={i} className="glass-card p-8 rounded-2xl text-center group transition-all duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:-translate-y-2 relative z-10 hover:z-50">
              {t.mediaType === 'video' ? (
                <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-yellow-500/20 group-hover:border-yellow-400 transition-all duration-500 relative cursor-pointer group-hover:scale-110 md:group-hover:scale-[2.5] group-hover:shadow-2xl z-20">
                  <video 
                    src={t.media} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover transition-transform duration-500" 
                    onMouseEnter={(e) => { e.target.muted = false; e.target.volume = 1; }}
                    onMouseLeave={(e) => { e.target.muted = true; }}
                    onTimeUpdate={(e) => { if (e.target.currentTime >= 5) { e.target.currentTime = 0; } }}
                  />
                  <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-end pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="text-white text-[8px] font-bold bg-black/80 px-2 py-1 rounded-full">🔊 Sound On</span>
                  </div>
                </div>
              ) : t.mediaType === 'image' ? (
                <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-yellow-500/20 group-hover:border-yellow-400 transition-all duration-500 group-hover:scale-110 md:group-hover:scale-[2.5] group-hover:shadow-2xl z-20">
                  <img src={t.media} alt={t.name} className="w-full h-full object-cover transition-transform duration-500" />
                </div>
              ) : (
                <div className="w-40 h-40 bg-gradient-to-br from-yellow-600/30 to-yellow-800/30 border-4 border-yellow-500/20 group-hover:border-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:scale-110 md:group-hover:scale-[2.5] group-hover:shadow-2xl z-20">
                  <Users className="w-16 h-16 text-yellow-400 transition-transform duration-500" />
                </div>
              )}
              <h3 className="font-bold text-white text-2xl mb-1">{t.name}</h3>
              <div className="text-yellow-400 text-md font-semibold mb-4">{t.role}</div>
              <p className="text-gray-400 text-sm leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-sm italic">💡 Tip: Hover over the photos to enlarge them, and hover over the CEO's video to listen to the audio!</p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
