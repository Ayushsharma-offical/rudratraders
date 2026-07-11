import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, Globe, Zap, Users } from 'lucide-react';
import SEO from '../components/SEO';

const TiltCard = ({ children, className, tiltMultiplier = 14, scale = 1.03 }) => {
  const cardRef = useRef(null);

  const handleMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = x - r.width / 2;
    const cy = y - r.height / 2;
    const rotY = (cx / r.width) * tiltMultiplier;
    const rotX = -(cy / r.height) * tiltMultiplier;
    el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
    el.style.setProperty('--mx', x + 'px');
    el.style.setProperty('--my', y + 'px');
  };

  const handleLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
  };

  return (
    <div 
      ref={cardRef} 
      className={className} 
      onMouseMove={handleMove} 
      onMouseLeave={handleLeave}
      style={{ transition: 'transform 0.4s cubic-bezier(.2,.8,.2,1)' }}
    >
      {children}
    </div>
  );
};

const AboutPage = () => {
  const navigate = useNavigate();

  const team = [
    { name: 'Reshu Ranjan', role: 'CEO', desc: 'With a deep passion for empowering small businesses, Reshu leads Rudra Traders to new heights.', mediaType: 'video', media: '/ceo-video.mp4' },
    { name: 'Amrit Kumar', role: 'Logistics Head', desc: 'Our logistics expert ensuring every order is dispatched on time and delivered safely across India.', mediaType: 'icon' },
    { name: 'Ayush Sharma', role: 'Technical Head', desc: 'Industry expert who verifies quality, capacity, and efficiency of every machine in our catalog.', mediaType: 'image', media: '/ayush-sharma.jpg' },
  ];

  return (
    <div className="about-wrapper pt-28">
      <SEO 
        title="About Us"
        description="Learn about Rudra Traders, our values, and our mission to empower small businesses with premium machinery and logistics."
        url="/about"
      />
      <style>{`
        .about-wrapper {
          --bg: #0a0907;
          --glass: rgba(255,255,255,0.045);
          --glass-strong: rgba(255,255,255,0.08);
          --glass-border: rgba(255,255,255,0.09);
          --amber: #ff7a3d;
          --amber-2: #ffb066;
          --emerald: #17c081;
          --text: #f5f1ea;
          --text-dim: #a89e8f;
          --text-faint: #6f665a;
          background: radial-gradient(ellipse 120% 70% at 15% -8%, rgba(255,122,61,0.13), transparent 55%),
                      radial-gradient(ellipse 90% 55% at 95% 10%, rgba(23,192,129,0.10), transparent 55%),
                      var(--bg);
          color: var(--text);
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
        }
        .about-wrapper h1, .about-wrapper h2, .about-wrapper h3 { font-family: 'Sora', sans-serif; }
        
        .orb { position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0; }
        .orb1 { width: 460px; height: 460px; top: -140px; left: -120px; background: radial-gradient(circle, var(--amber), transparent 70%); opacity: 0.45; }
        .orb2 { width: 400px; height: 400px; top: 600px; right: -160px; background: radial-gradient(circle, var(--emerald), transparent 70%); opacity: 0.28; }
        .orb3 { width: 420px; height: 420px; bottom: -160px; left: 15%; background: radial-gradient(circle, var(--amber), transparent 70%); opacity: 0.22; }

        .about-wrap { max-width: 1320px; margin: 0 auto; padding: 0 28px; position: relative; z-index: 1; }

        .about-badge {
          display: inline-flex; align-items: center; gap: 8px; font-size: 11.5px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase; color: var(--amber-2);
          padding: 7px 14px; border-radius: 999px; border: 1px solid rgba(255,122,61,0.3);
          background: rgba(255,122,61,0.08); margin-bottom: 20px;
        }
        .about-badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--amber); box-shadow: 0 0 8px var(--amber); }
        .about-badge.green { color: var(--emerald); border-color: rgba(23,192,129,0.3); background: rgba(23,192,129,0.08); }
        .about-badge.green::before { background: var(--emerald); box-shadow: 0 0 8px var(--emerald); }

        .about-accent {
          background: linear-gradient(120deg, var(--amber-2), var(--amber) 60%, #ff5f4a);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }

        .about-hero { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; padding: 40px 0 100px; }
        .about-hero h1 { font-size: clamp(34px, 4.6vw, 52px); font-weight: 800; line-height: 1.08; letter-spacing: -0.02em; margin-bottom: 22px; }
        .about-hero h1 .about-accent { display: block; }
        .about-hero p { color: var(--text-dim); font-size: 15.5px; line-height: 1.75; margin-bottom: 16px; max-width: 560px; }

        .stats-row { display: flex; gap: 14px; margin-top: 32px; flex-wrap: wrap; }
        .stat-card {
          flex: 1; min-width: 120px; text-align: center; padding: 22px 12px; border-radius: 18px;
          background: var(--glass); border: 1px solid var(--glass-border); backdrop-filter: blur(16px);
          box-shadow: 0 10px 26px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06);
          transition: transform .3s, box-shadow .3s, border-color .3s;
        }
        .stat-card:hover { transform: translateY(-6px); border-color: rgba(255,122,61,0.35); box-shadow: 0 18px 40px rgba(255,122,61,0.18), inset 0 1px 0 rgba(255,255,255,0.1); }
        .stat-num {
          font-family: 'Sora', sans-serif; font-size: 27px; font-weight: 800;
          background: linear-gradient(120deg, var(--amber-2), var(--amber)); -webkit-background-clip: text; background-clip: text; color: transparent;
          text-shadow: 0 0 30px rgba(255,122,61,0.25); margin-bottom: 5px;
        }
        .stat-label { font-size: 11.2px; color: var(--text-dim); font-weight: 600; line-height: 1.3; }

        .about-media { position: relative; height: 460px; }
        .tilt-img {
          position: absolute; border-radius: 24px; overflow: hidden; cursor: pointer; border: 1px solid var(--glass-border);
          box-shadow: 0 25px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08);
          transform-style: preserve-3d;
        }
        .tilt-img img { width: 100%; height: 100%; object-fit: cover; }
        .tilt-img::after {
          content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .35s;
          background: radial-gradient(280px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.16), transparent 60%);
        }
        .tilt-img:hover::after { opacity: 1; }
        .tilt-img:hover { box-shadow: 0 35px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,122,61,0.3); z-index: 5; }
        .img-a { width: 64%; height: 78%; top: 0; left: 0; z-index: 2; }
        .img-b { width: 46%; height: 52%; bottom: 0; right: 0; z-index: 3; }

        .float-badge {
          position: absolute; z-index: 6; display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-radius: 16px;
          background: rgba(15,12,9,0.65); border: 1px solid var(--glass-border); backdrop-filter: blur(18px);
          box-shadow: 0 14px 34px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
          animation: float 4.5s ease-in-out infinite;
        }
        .float-badge.badge-top { top: -6%; right: 8%; }
        .float-badge.badge-bottom { bottom: 6%; left: -6%; animation-delay: .6s; }
        .float-badge .fb-icon {
          width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 16px;
          background: linear-gradient(135deg, var(--emerald), #0a8f5c); box-shadow: 0 4px 14px rgba(23,192,129,0.4);
        }
        .float-badge.badge-top .fb-icon { background: linear-gradient(135deg, var(--amber-2), var(--amber)); box-shadow: 0 4px 14px rgba(255,122,61,0.4); }
        .fb-title { font-size: 13.5px; font-weight: 700; }
        .fb-sub { font-size: 11px; color: var(--text-dim); }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

        .mission {
          display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center;
          padding: 70px 0; border-top: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border);
        }
        .mission-text h2 { font-size: clamp(26px, 3.4vw, 36px); font-weight: 800; margin-bottom: 18px; line-height: 1.2; }
        .mission-text p { color: var(--text-dim); font-size: 15px; line-height: 1.75; }
        .quote-card {
          padding: 34px; border-radius: 24px; background: var(--glass); border: 1px solid var(--glass-border);
          backdrop-filter: blur(18px); box-shadow: 0 20px 50px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06);
          position: relative; overflow: hidden;
        }
        .quote-card::before {
          content: '"'; position: absolute; top: -30px; left: 16px; font-size: 160px; font-family: 'Sora', sans-serif;
          color: rgba(255,122,61,0.12); font-weight: 800; line-height: 1;
        }
        .quote-card p { font-size: 18px; line-height: 1.6; font-weight: 500; position: relative; z-index: 1; margin-bottom: 20px; }
        .quote-author { display: flex; align-items: center; gap: 12px; position: relative; z-index: 1; }
        .quote-avatar { width: 44px; height: 44px; border-radius: 50%; overflow: hidden; border: 2px solid rgba(255,122,61,0.4); }
        .quote-name { font-weight: 700; font-size: 14px; }
        .quote-role { font-size: 12px; color: var(--text-dim); }

        .sec-head { text-align: center; max-width: 640px; margin: 0 auto 56px; padding-top: 80px; }
        .sec-head h2 { font-size: clamp(28px, 3.6vw, 40px); font-weight: 800; margin-bottom: 14px; letter-spacing: -0.01em; }
        .sec-head p { color: var(--text-dim); font-size: 15px; line-height: 1.7; }

        .timeline { position: relative; max-width: 900px; margin: 0 auto; padding-bottom: 100px; }
        .timeline::before {
          content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; transform: translateX(-50%);
          background: linear-gradient(180deg, transparent, rgba(255,122,61,0.5) 10%, rgba(23,192,129,0.4) 90%, transparent);
        }
        .t-item { position: relative; width: 50%; padding: 0 44px 56px; }
        .t-item:nth-child(odd) { left: 0; text-align: right; }
        .t-item:nth-child(even) { left: 50%; text-align: left; }
        .t-dot {
          position: absolute; top: 2px; width: 16px; height: 16px; border-radius: 50%;
          background: linear-gradient(135deg, var(--amber-2), var(--amber)); box-shadow: 0 0 0 6px rgba(255,122,61,0.15), 0 0 20px rgba(255,122,61,0.5);
        }
        .t-item:nth-child(odd) .t-dot { right: -8px; }
        .t-item:nth-child(even) .t-dot { left: -8px; }
        .t-card {
          display: inline-block; text-align: left; padding: 22px 24px; border-radius: 18px;
          background: var(--glass); border: 1px solid var(--glass-border); backdrop-filter: blur(16px);
          box-shadow: 0 14px 34px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06);
          transition: transform .3s, border-color .3s;
        }
        .t-card:hover { transform: translateY(-4px); border-color: rgba(255,122,61,0.3); }
        .t-year { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 20px; color: var(--amber-2); margin-bottom: 6px; }
        .t-title { font-weight: 700; font-size: 15px; margin-bottom: 6px; }
        .t-desc { font-size: 13px; color: var(--text-dim); line-height: 1.6; }

        .values-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; padding-bottom: 100px; }
        .value-card {
          padding: 30px 24px; border-radius: 22px; background: var(--glass); border: 1px solid var(--glass-border);
          backdrop-filter: blur(16px); box-shadow: 0 12px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06);
          transform-style: preserve-3d;
          position: relative; overflow: hidden;
        }
        .value-card .vglow {
          position: absolute; inset: 0; opacity: 0; transition: opacity .35s; pointer-events: none;
          background: radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(255,166,102,0.16), transparent 60%);
        }
        .value-card:hover .vglow { opacity: 1; }
        .value-card:hover { box-shadow: 0 22px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,122,61,0.25); }
        .value-icon {
          width: 52px; height: 52px; border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 24px;
          background: linear-gradient(135deg, rgba(255,122,61,0.25), rgba(255,122,61,0.05)); border: 1px solid rgba(255,122,61,0.25);
          margin-bottom: 18px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .value-card:nth-child(2) .value-icon { background: linear-gradient(135deg, rgba(23,192,129,0.25), rgba(23,192,129,0.05)); border-color: rgba(23,192,129,0.25); }
        .value-card:nth-child(4) .value-icon { background: linear-gradient(135deg, rgba(23,192,129,0.25), rgba(23,192,129,0.05)); border-color: rgba(23,192,129,0.25); }
        .value-title { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 16.5px; margin-bottom: 10px; position: relative; z-index: 1; }
        .value-desc { font-size: 13.2px; color: var(--text-dim); line-height: 1.65; position: relative; z-index: 1; }

        .team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; padding-bottom: 100px; }
        .team-card {
          border-radius: 22px; overflow: hidden; background: var(--glass); border: 1px solid var(--glass-border);
          backdrop-filter: blur(16px); box-shadow: 0 12px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06);
          transition: transform .35s, box-shadow .35s, border-color .35s;
        }
        .team-card:hover { transform: translateY(-8px); box-shadow: 0 24px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,122,61,0.25); z-index: 20; position: relative; }
        
        .team-photo { height: 260px; overflow: hidden; position: relative; background: #0a0907; display: flex; align-items: center; justify-content: center; }
        .team-photo img, .team-photo video { width: 100%; height: 100%; object-fit: cover; transition: transform .5s; }
        .team-card:hover .team-photo img, .team-card:hover .team-photo video { transform: scale(1.08); }
        .team-photo::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 60%, rgba(10,9,7,0.7)); pointer-events: none; }
        
        /* Special Video Hover for CEO */
        .ceo-card .team-photo video { filter: grayscale(20%); }
        .ceo-card:hover .team-photo video { filter: grayscale(0%); transform: scale(1.15); }
        .sound-badge { position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 20px; font-size: 10px; font-weight: bold; color: #fff; z-index: 10; opacity: 0; transition: opacity 0.3s; pointer-events: none; }
        .ceo-card:hover .sound-badge { opacity: 1; }

        .team-body { padding: 18px 20px 22px; }
        .team-name { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 18px; margin-bottom: 3px; }
        .team-role { font-size: 13.5px; color: var(--amber-2); font-weight: 600; margin-bottom: 10px; }
        .team-desc { font-size: 13.5px; color: var(--text-dim); line-height: 1.6; }

        .process { padding-bottom: 100px; }
        .process-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; position: relative; }
        .process-row::before {
          content: ''; position: absolute; top: 34px; left: 12%; right: 12%; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,122,61,0.5), rgba(23,192,129,0.4), transparent);
        }
        .p-step { text-align: center; padding: 0 16px; position: relative; }
        .p-num {
          width: 68px; height: 68px; margin: 0 auto 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-family: 'Sora', sans-serif; font-weight: 800; font-size: 22px; position: relative; z-index: 2;
          background: linear-gradient(135deg, #1a140d, #100c08); border: 1px solid var(--glass-border);
          box-shadow: 0 10px 26px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08);
          color: var(--amber-2); transition: all 0.3s;
        }
        .p-step:hover .p-num { box-shadow: 0 0 0 6px rgba(255,122,61,0.12), 0 10px 30px rgba(255,122,61,0.3); color: #fff; }
        .p-title { font-weight: 700; font-size: 15px; margin-bottom: 8px; font-family: 'Sora', sans-serif; }
        .p-desc { font-size: 12.8px; color: var(--text-dim); line-height: 1.6; }

        .cta {
          margin: 0 0 100px; padding: 64px 44px; border-radius: 32px; text-align: center; position: relative; overflow: hidden;
          background: linear-gradient(135deg, rgba(255,122,61,0.14), rgba(23,192,129,0.08));
          border: 1px solid rgba(255,122,61,0.25);
          box-shadow: 0 30px 70px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .cta::before {
          content: ''; position: absolute; width: 400px; height: 400px; border-radius: 50%; top: -160px; right: -100px;
          background: radial-gradient(circle, rgba(255,122,61,0.35), transparent 70%); filter: blur(50px);
        }
        .cta h2 { font-size: clamp(26px, 3.6vw, 38px); font-weight: 800; margin-bottom: 14px; position: relative; z-index: 1; }
        .cta p { color: var(--text-dim); font-size: 15px; margin-bottom: 30px; position: relative; z-index: 1; }
        .cta-btn {
          display: inline-flex; align-items: center; gap: 10px; padding: 16px 32px; border-radius: 999px; border: none;
          background: linear-gradient(135deg, var(--amber-2), var(--amber)); color: #1a0f08; font-weight: 800; font-size: 15px;
          box-shadow: 0 10px 30px rgba(255,122,61,0.4), inset 0 1px 0 rgba(255,255,255,0.4);
          position: relative; z-index: 1; transition: transform .25s, box-shadow .25s; cursor: pointer;
        }
        .cta-btn:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 16px 40px rgba(255,122,61,0.5); }

        @media (max-width: 980px) { .values-grid { grid-template-columns: repeat(2, 1fr); } .team-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 860px) {
          .about-hero { grid-template-columns: 1fr; gap: 50px; padding: 50px 0 70px; }
          .about-media { height: 360px; }
          .mission { grid-template-columns: 1fr; padding: 50px 0; }
          .sec-head { padding-top: 60px; margin-bottom: 40px; }
          .process-row { grid-template-columns: 1fr; gap: 36px; }
          .process-row::before { display: none; }
          .timeline::before { left: 20px; }
          .t-item, .t-item:nth-child(even) { width: 100%; left: 0; text-align: left; padding: 0 0 40px 52px; }
          .t-item:nth-child(odd) .t-dot, .t-item:nth-child(even) .t-dot { left: 12px; right: auto; }
        }
        @media (max-width: 560px) { .values-grid { grid-template-columns: 1fr; } .team-grid { grid-template-columns: 1fr; } }
        @media (max-width: 480px) { .about-wrap { padding: 0 18px; } .about-media { height: 300px; } .fb-sub { display: none; } }
      `}</style>

      <div className="orb orb1"></div>
      <div className="orb orb2"></div>
      <div className="orb orb3"></div>

      <div className="about-wrap">
        {/* HERO */}
        <section className="about-hero">
          <div className="about-text">
            <span className="about-badge">Our Story</span>
            <h1>Built for India's<span className="about-accent">Entrepreneurs</span></h1>
            <p>Rudra Traders was founded with a single mission: make premium industrial machinery accessible to every MSME entrepreneur in India. Based in New Delhi, we operate across the entire country — sourcing the best equipment globally and delivering it to your doorstep.</p>
            <p>We believe every small business deserves access to quality industrial infrastructure. That's why we go the extra mile — visiting factories, vetting suppliers, negotiating the best prices — so you don't have to.</p>
            <div className="stats-row">
              <div className="stat-card"><div className="stat-num">500+</div><div className="stat-label">MSMEs Served</div></div>
              <div className="stat-card"><div className="stat-num">10+</div><div className="stat-label">Years Experience</div></div>
              <div className="stat-card"><div className="stat-num">28+</div><div className="stat-label">Cities Covered</div></div>
            </div>
          </div>
          <div className="about-media">
            <TiltCard className="tilt-img img-a" tiltMultiplier={14}>
              <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80" alt="Engineering blueprint and machine design workshop" />
            </TiltCard>
            <TiltCard className="tilt-img img-b" tiltMultiplier={14}>
              <img src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80" alt="Wheat grains for flour milling machinery" />
            </TiltCard>
            <div className="float-badge badge-top">
              <div className="fb-icon">✅</div>
              <div><div className="fb-title">500+ Happy Clients</div><div className="fb-sub">Across 28 cities</div></div>
            </div>
            <div className="float-badge badge-bottom">
              <div className="fb-icon">🌍</div>
              <div><div className="fb-title">Pan-India Delivery</div><div className="fb-sub">Doorstep installation</div></div>
            </div>
          </div>
        </section>

        {/* MISSION */}
        <section className="mission">
          <div className="mission-text">
            <h2>Our mission is simple — <span className="about-accent">no MSME left behind.</span></h2>
            <p>India's small manufacturers power the economy, yet most struggle to access reliable, fairly-priced machinery. Rudra Traders exists to close that gap: we vet every supplier, test every machine, and stand behind every sale with real support — so a first-time entrepreneur in a small town gets the same quality and honesty as a large factory in Delhi.</p>
          </div>
          <div className="quote-card">
            <p>"We don't just sell machines — we sell the confidence to start, scale, and never look back."</p>
            <div className="quote-author">
              <div className="quote-avatar">
                <div className="w-full h-full bg-gradient-to-br from-[#ff7a3d] to-[#17c081] flex items-center justify-center font-black text-white text-lg">R</div>
              </div>
              <div>
                <div className="quote-name">Reshu Ranjan</div>
                <div className="quote-role">Founder & CEO, Rudra Traders</div>
              </div>
            </div>
          </div>
        </section>

        {/* TIMELINE - Updated to start from 2025 */}
        <div className="sec-head">
          <span className="about-badge green">Our Journey</span>
          <h2>A rapidly growing trust</h2>
          <p>From a single showroom in New Delhi to a pan-India machinery network — here's how we got here.</p>
        </div>
        <div className="timeline">
          <div className="t-item">
            <div className="t-dot"></div>
            <div className="t-card">
              <div className="t-year">Jan 2025</div>
              <div className="t-title">Rudra Traders founded</div>
              <div className="t-desc">Started as a small machinery trading shop in New Delhi, serving local flour mills and spice units.</div>
            </div>
          </div>
          <div className="t-item">
            <div className="t-dot"></div>
            <div className="t-card">
              <div className="t-year">Nov 2025</div>
              <div className="t-title">First 100 clients</div>
              <div className="t-desc">Expanded our catalog to feed processing and oil extraction machinery, crossing 100 MSME clients.</div>
            </div>
          </div>
          <div className="t-item">
            <div className="t-dot"></div>
            <div className="t-card">
              <div className="t-year">Feb 2026</div>
              <div className="t-title">Pan-India delivery launched</div>
              <div className="t-desc">Built logistics partnerships to deliver and install machinery in 28+ cities across India.</div>
            </div>
          </div>
          <div className="t-item">
            <div className="t-dot"></div>
            <div className="t-card">
              <div className="t-year">May 2026</div>
              <div className="t-title">Digital quotation system</div>
              <div className="t-desc">Launched instant online quoting so entrepreneurs can price and order machinery in minutes.</div>
            </div>
          </div>
          <div className="t-item">
            <div className="t-dot"></div>
            <div className="t-card">
              <div className="t-year">2027 (Vision)</div>
              <div className="t-title">500+ MSMEs served</div>
              <div className="t-desc">On track to cross 500 businesses equipped, becoming a trusted name in industrial machinery sourcing.</div>
            </div>
          </div>
        </div>

        {/* VALUES */}
        <div className="sec-head">
          <span className="about-badge">What Drives Us</span>
          <h2>Our core values</h2>
          <p>Every machine we sell, every relationship we build, is guided by these principles.</p>
        </div>
        <div className="values-grid">
          <TiltCard className="value-card" tiltMultiplier={8}>
            <div className="vglow"></div>
            <div className="value-icon"><ShieldCheck className="w-7 h-7 text-orange-400" /></div>
            <div className="value-title">Integrity First</div>
            <div className="value-desc">We never compromise on product quality. Every machine we sell is one we stand behind completely.</div>
          </TiltCard>
          <TiltCard className="value-card" tiltMultiplier={8}>
            <div className="vglow"></div>
            <div className="value-icon"><Globe className="w-7 h-7 text-emerald-400" /></div>
            <div className="value-title">Global Reach</div>
            <div className="value-desc">We source from international suppliers in China, Germany, and Taiwan — as well as top domestic manufacturers.</div>
          </TiltCard>
          <TiltCard className="value-card" tiltMultiplier={8}>
            <div className="vglow"></div>
            <div className="value-icon"><Truck className="w-7 h-7 text-orange-400" /></div>
            <div className="value-title">Reliable Delivery</div>
            <div className="value-desc">Our end-to-end logistics ensure your machinery arrives safely at your unit, anywhere in India.</div>
          </TiltCard>
          <TiltCard className="value-card" tiltMultiplier={8}>
            <div className="vglow"></div>
            <div className="value-icon"><Zap className="w-7 h-7 text-emerald-400" /></div>
            <div className="value-title">Fast Response</div>
            <div className="value-desc">Get your quotation within minutes and a callback from our team within 24 hours.</div>
          </TiltCard>
        </div>

        {/* TEAM */}
        <div className="sec-head">
          <span className="about-badge green">The People Behind It</span>
          <h2>Meet our team</h2>
          <p>A small, hands-on team that visits factories, tests machines, and answers your calls personally.</p>
        </div>
        <div className="team-grid">
          {team.map((t, i) => (
            <div key={i} className={`team-card ${t.role === 'CEO' ? 'ceo-card' : ''}`}>
              <div className="team-photo">
                {t.mediaType === 'video' ? (
                  <>
                    <video 
                      src={t.media} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      onMouseEnter={(e) => { e.target.muted = false; e.target.volume = 1; }}
                      onMouseLeave={(e) => { e.target.muted = true; }}
                      onTimeUpdate={(e) => { if (e.target.currentTime >= 5) { e.target.currentTime = 0; } }}
                    />
                    <div className="sound-badge">🔊 Sound On (Hover)</div>
                  </>
                ) : t.mediaType === 'image' ? (
                  <img src={t.media} alt={t.name} />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-600/20 to-orange-900/40 flex items-center justify-center">
                    <Users className="w-20 h-20 text-orange-500/50" />
                  </div>
                )}
              </div>
              <div className="team-body">
                <div className="team-name">{t.name}</div>
                <div className="team-role">{t.role}</div>
                <div className="team-desc">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* PROCESS */}
        <div className="sec-head">
          <span className="about-badge">How We Work</span>
          <h2>From enquiry to installation</h2>
          <p>A simple, transparent process built for busy entrepreneurs.</p>
        </div>
        <div className="process">
          <div className="process-row">
            <div className="p-step">
              <div className="p-num">1</div>
              <div className="p-title">Get a Quote</div>
              <div className="p-desc">Browse our catalog and generate an instant GST-ready quotation online.</div>
            </div>
            <div className="p-step">
              <div className="p-num">2</div>
              <div className="p-title">We Verify Fit</div>
              <div className="p-desc">Our team confirms specs and capacity match your business needs.</div>
            </div>
            <div className="p-step">
              <div className="p-num">3</div>
              <div className="p-title">Deliver & Install</div>
              <div className="p-desc">Machine is delivered and installed at your site, anywhere in India.</div>
            </div>
            <div className="p-step">
              <div className="p-num">4</div>
              <div className="p-title">Ongoing Support</div>
              <div className="p-desc">Training and after-sales service, whenever you need it.</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="cta">
          <h2>Ready to equip your business?</h2>
          <p>Join hundreds of MSMEs who trust Rudra Traders for their industrial machinery.</p>
          <button className="cta-btn" onClick={() => navigate('/products')}>Browse Machinery →</button>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
