import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowRight, Share2, Play, Globe } from 'lucide-react';

const Footer = () => {
  const footerRef = useRef(null);
  const spotRef = useRef(null);

  const handleMouseMove = (e) => {
    const el = footerRef.current;
    const spot = spotRef.current;
    if (!el || !spot) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotY = (x - 0.5) * 7;
    const rotX = (0.5 - y) * 5;
    el.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    spot.style.setProperty('--mx', `${x * 100}%`);
    spot.style.setProperty('--my', `${y * 100}%`);
  };

  const handleMouseLeave = () => {
    if (footerRef.current) footerRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
  };

  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Machinery Catalog' },
    { to: '/about', label: 'About Us' },
    { to: '/cart', label: 'Request Quotation' },
    { to: '/contact', label: 'Contact Us' },
  ];

  const machineLinks = [
    'Poultry Feed Machines', 'Flour Milling Machines', 'Oil Expeller Units',
    'Spice Grinding Plants', 'Bakery Equipment', 'Dal Mill Machines',
    'Mixture Machines', 'Cyclone Grinders',
  ];

  const socialIcons = [
    { icon: Share2, href: '#', label: 'Instagram' },
    { icon: Play, href: '#', label: 'YouTube' },
    { icon: Globe, href: 'https://rudratrades.in', label: 'Website' },
  ];

  return (
    <footer style={{ background: 'transparent', padding: '0 0 48px', perspective: '1800px', overflowX: 'hidden' }}>
      {/* CTA Strip */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245,171,61,0.12), rgba(255,90,46,0.08))',
        borderTop: '1px solid rgba(245,171,61,0.15)',
        borderBottom: '1px solid rgba(245,171,61,0.10)',
      }}>
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

      {/* Main Footer Glass Card */}
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <div
          ref={footerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'relative',
            borderRadius: '28px',
            padding: '56px 48px 28px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.015) 40%, rgba(0,0,0,0.08)), #120d0a',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 1px 0 rgba(255,255,255,0.09) inset, 0 -1px 0 rgba(0,0,0,0.4) inset, 0 60px 100px -30px rgba(0,0,0,0.75)',
            backdropFilter: 'blur(22px)',
            overflow: 'hidden',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.12s ease-out',
            willChange: 'transform',
          }}
        >
          {/* Rotating conic sheen */}
          <div style={{
            position: 'absolute', inset: '-60%',
            background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(245,171,61,0.12) 35deg, transparent 80deg, rgba(255,90,46,0.08) 170deg, transparent 250deg, rgba(245,171,61,0.07) 320deg, transparent 360deg)',
            animation: 'footer-drift 26s linear infinite',
            pointerEvents: 'none', zIndex: 0,
          }} />

          {/* Grain overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 1,
          }} />

          {/* Cursor specular spot */}
          <div
            ref={spotRef}
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
              background: 'radial-gradient(380px circle at var(--mx, 50%) var(--my, 20%), rgba(255,255,255,0.09), transparent 60%)',
              mixBlendMode: 'overlay',
            }}
          />

          {/* Gear ornament */}
          <svg style={{ position:'absolute', right:'-30px', top:'-30px', width:'220px', height:'220px', color:'#f5ab3d', opacity:'0.055', animation:'footer-spin 40s linear infinite', zIndex:0 }} viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 30a20 20 0 100 40 20 20 0 000-40zm0 32a12 12 0 110-24 12 12 0 010 24z"/>
            <path d="M50 5l4 10-4 3-4-3zM50 95l-4-10 4-3 4 3zM5 50l10-4 3 4-3 4zM95 50l-10 4-3-4 3-4zM18 18l11 3-1 5-5-1zM82 82l-11-3 1-5 5 1zM82 18l-11 3 1 5 5-1zM18 82l11-3-1-5-5 1z"/>
          </svg>

          {/* Grid content */}
          <div style={{ position:'relative', zIndex:3, display:'grid', gridTemplateColumns:'1.3fr 1fr 1fr 1.1fr', gap:'44px', paddingBottom:'42px', transformStyle:'preserve-3d' }} className="footer-grid">

            {/* Brand */}
            <div style={{ transform:'translateZ(20px)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'20px' }}>
                <div style={{
                  width:'56px', height:'56px', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center',
                  fontWeight:800, fontSize:'22px', color:'#1a1206',
                  background:'linear-gradient(150deg, #f5ab3d, #ff5a2e)',
                  boxShadow:'0 12px 26px -8px rgba(255,120,40,0.55), 0 1px 0 rgba(255,255,255,0.45) inset',
                  transition:'transform 0.5s cubic-bezier(.2,.9,.3,1.3)', cursor:'pointer',
                  fontFamily:'serif',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform='rotateX(25deg) rotateY(-30deg) translateZ(10px) scale(1.06)'}
                  onMouseLeave={e => e.currentTarget.style.transform='none'}
                >R</div>
                <div>
                  <div style={{ fontWeight:800, fontSize:'19px', letterSpacing:'0.4px', background:'linear-gradient(90deg,#f5ab3d,#ff5a2e)', WebkitBackgroundClip:'text', backgroundClip:'text', color:'transparent' }}>RUDRA TRADERS</div>
                  <div style={{ fontSize:'10px', letterSpacing:'2.6px', color:'#a39a8e', fontWeight:500, marginTop:'2px' }}>MSME MACHINERY</div>
                </div>
              </div>
              <p style={{ color:'#a39a8e', fontSize:'14px', lineHeight:'1.75', maxWidth:'270px', margin:'0 0 24px' }}>
                India's trusted source for premium MSME-grade industrial machinery. Globally sourced, delivered to your doorstep — across India.
              </p>
              <div style={{ display:'flex', gap:'11px' }}>
                {socialIcons.map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} aria-label={label} style={{
                    width:'40px', height:'40px', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center',
                    background:'linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.05))',
                    border:'1px solid rgba(255,255,255,0.10)', color:'#a39a8e',
                    boxShadow:'0 6px 14px -8px rgba(0,0,0,0.6)',
                    transition:'all 0.3s cubic-bezier(.2,.9,.3,1.3)',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color='#1a1206'; e.currentTarget.style.background='linear-gradient(150deg,#f5ab3d,#ff5a2e)'; e.currentTarget.style.border='1px solid transparent'; e.currentTarget.style.transform='translateY(-6px) translateZ(24px)'; e.currentTarget.style.boxShadow='0 20px 30px -12px rgba(255,120,40,0.55)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color='#a39a8e'; e.currentTarget.style.background='linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.05))'; e.currentTarget.style.border='1px solid rgba(255,255,255,0.10)'; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 6px 14px -8px rgba(0,0,0,0.6)'; }}
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div style={{ transform:'translateZ(20px)' }}>
              <h4 style={{ fontFamily:'sans-serif', fontSize:'11px', letterSpacing:'2.2px', fontWeight:600, color:'#f5ab3d', margin:'0 0 20px', display:'flex', alignItems:'center', gap:'9px' }}>
                <span style={{ width:'16px', height:'1px', background:'linear-gradient(90deg,#f5ab3d,transparent)', display:'inline-block' }}></span>
                QUICK LINKS
              </h4>
              <ul style={{ listStyle:'none', margin:0, padding:0, display:'flex', flexDirection:'column', gap:'13px' }}>
                {quickLinks.map(l => (
                  <li key={l.to}>
                    <Link to={l.to} style={{ color:'#cdc7bd', textDecoration:'none', fontSize:'14px', display:'inline-flex', alignItems:'center', gap:'6px', transition:'all 0.25s ease', position:'relative' }}
                      onMouseEnter={e => { e.currentTarget.style.color='#fff'; e.currentTarget.style.transform='translateX(5px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color='#cdc7bd'; e.currentTarget.style.transform='none'; }}
                    >
                      <span style={{ color:'#f5ab3d', fontWeight:600 }}>›</span> {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Machinery */}
            <div style={{ transform:'translateZ(20px)' }}>
              <h4 style={{ fontFamily:'sans-serif', fontSize:'11px', letterSpacing:'2.2px', fontWeight:600, color:'#f5ab3d', margin:'0 0 20px', display:'flex', alignItems:'center', gap:'9px' }}>
                <span style={{ width:'16px', height:'1px', background:'linear-gradient(90deg,#f5ab3d,transparent)', display:'inline-block' }}></span>
                MACHINERY
              </h4>
              <ul style={{ listStyle:'none', margin:0, padding:0, display:'flex', flexDirection:'column', gap:'13px' }}>
                {machineLinks.map(item => (
                  <li key={item}>
                    <Link to="/products" style={{ color:'#cdc7bd', textDecoration:'none', fontSize:'14px', display:'inline-flex', alignItems:'center', gap:'6px', transition:'all 0.25s ease' }}
                      onMouseEnter={e => { e.currentTarget.style.color='#fff'; e.currentTarget.style.transform='translateX(5px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color='#cdc7bd'; e.currentTarget.style.transform='none'; }}
                    >
                      <span style={{ color:'#f5ab3d', fontWeight:600 }}>›</span> {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div style={{ transform:'translateZ(20px)' }}>
              <h4 style={{ fontFamily:'sans-serif', fontSize:'11px', letterSpacing:'2.2px', fontWeight:600, color:'#f5ab3d', margin:'0 0 20px', display:'flex', alignItems:'center', gap:'9px' }}>
                <span style={{ width:'16px', height:'1px', background:'linear-gradient(90deg,#f5ab3d,transparent)', display:'inline-block' }}></span>
                CONTACT
              </h4>
              {[
                { icon: MapPin, text: '255A, Vipin Garden, Behind Ring Meadows Public School, Dwarka, New Delhi – 110059' },
                { icon: Phone, text: '+91 7982813507', href: 'tel:+917982813507' },
                { icon: Mail, text: 'rudratraders.store@gmail.com', href: 'mailto:rudratraders.store@gmail.com' },
                { icon: Clock, text: 'Mon – Sat, 9:00 AM – 7:00 PM' },
              ].map(({ icon: Icon, text, href }, i) => (
                <div key={i} style={{ display:'flex', gap:'12px', marginBottom:'16px', alignItems:'flex-start' }}
                  className="footer-contact-item"
                >
                  <div style={{
                    flexShrink:0, width:'35px', height:'35px', borderRadius:'11px',
                    background:'linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.04))',
                    border:'1px solid rgba(255,255,255,0.10)',
                    display:'flex', alignItems:'center', justifyContent:'center', color:'#f5ab3d',
                    boxShadow:'0 6px 12px -8px rgba(0,0,0,0.6)',
                    transition:'transform 0.3s cubic-bezier(.2,.9,.3,1.3), box-shadow 0.3s ease',
                  }}>
                    <Icon size={14} />
                  </div>
                  {href
                    ? <a href={href} style={{ color:'#cdc7bd', fontSize:'13.5px', lineHeight:'1.6', paddingTop:'6px', textDecoration:'none', transition:'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color='#f5ab3d'}
                        onMouseLeave={e => e.currentTarget.style.color='#cdc7bd'}
                      >{text}</a>
                    : <span style={{ color:'#cdc7bd', fontSize:'13.5px', lineHeight:'1.6', paddingTop:'6px' }}>{text}</span>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ position:'relative', zIndex:3, borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:'22px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px', fontSize:'13px', color:'#a39a8e' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'14px', flexWrap:'wrap' }}>
              <span>© 2025 Rudra Traders. All rights reserved.</span>
              <span style={{ padding:'5px 14px', borderRadius:'100px', background:'linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.04))', border:'1px solid rgba(255,255,255,0.10)', fontWeight:500, color:'#e0dace', fontSize:'12px', letterSpacing:'0.3px' }}>
                GST: 07BCFPK2624A1Z7
              </span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
              Built with <span style={{ color:'#ff5a2e', fontWeight:600, animation:'footer-pulse 1.8s ease-in-out infinite', display:'inline-block' }}>♥</span> for Indian MSMEs
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes footer-drift { to { transform: rotate(360deg); } }
        @keyframes footer-spin  { to { transform: rotate(360deg); } }
        @keyframes footer-pulse { 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.3); } }
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .footer-grid { grid-template-columns: 1fr !important; gap: 30px !important; } }
      `}</style>
    </footer>
  );
};

export default Footer;
