import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import SEO from '../components/SEO';

const ContactPage = () => {
  const localBizSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Rudra Traders",
    "image": "https://rudratraders.in/hero_banner.jpg",
    "telephone": "+918130957597",
    "email": "contact@rudratraders.in",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "255A, Vipin Garden, Behind Ring Meadows Public School",
      "addressLocality": "Dwarka, New Delhi",
      "postalCode": "110059",
      "addressCountry": "IN"
    }
  };

  return (
    <div className="pt-28 min-h-screen pb-20">
      <SEO 
        title="Contact Us"
        description="Get in touch with Rudra Traders for wholesale spices and machinery logistics. Contact us via phone, email, or visit our office in Delhi."
        url="/contact"
        schema={localBizSchema}
      />
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <div className="badge-gold inline-block mb-4">Get In Touch</div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Contact <span className="gold-text">Us</span></h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Looking for a specific machine? Want a custom quote? Our team is ready to assist you.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-6">
          {[
            {
              icon: MapPin,
              title: 'Head Office',
              lines: ['255A, Vipin Garden, Behind Ring Meadows Public School', 'Dwarka, New Delhi - 110059'],
              action: null,
            },
            {
              icon: Phone,
              title: 'Phone',
              lines: ['+91 7982813507'],
              action: 'tel:+917982813507',
            },
            {
              icon: Mail,
              title: 'Email',
              lines: ['rudratraders.store@gmail.com'],
              action: 'mailto:rudratraders.store@gmail.com',
            },
            {
              icon: Clock,
              title: 'Business Hours',
              lines: ['Monday – Saturday: 9:00 AM – 7:00 PM', 'Sunday: Closed'],
              action: null,
            },
          ].map((item, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl flex gap-5">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                {item.lines.map((line, j) => (
                  item.action ? (
                    <a key={j} href={item.action} className="block text-gray-400 hover:text-yellow-400 transition-colors">{line}</a>
                  ) : (
                    <p key={j} className="text-gray-400">{line}</p>
                  )
                ))}
              </div>
            </div>
          ))}

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/917982813507?text=Hello%2C%20I%20am%20interested%20in%20MSME%20machinery.%20Please%20send%20me%20more%20details."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold w-full justify-center text-base py-4 mt-2"
          >
            <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
          </a>
        </div>

        {/* Google Map */}
        <div className="glass-card p-2 rounded-2xl overflow-hidden" style={{ height: '550px' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0!2d77.074!3d28.627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1b4d8c9b6b1f%3A0x1234567890abcdef!2sVipin%20Garden%2C%20Dwarka%2C%20New%20Delhi%2C%20Delhi%20110059!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '14px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Rudra Traders Location - Vipin Garden, Dwarka, New Delhi"
          ></iframe>
        </div>
      </div>

      {/* GST & Bank Info */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="glass-card p-8 rounded-2xl">
          <h3 className="font-bold text-white mb-6 text-lg">Business Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'GST Number', value: '07BCFPK2624A1Z7' },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-medium">{item.label}</div>
                <div className="text-white font-bold text-sm">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
