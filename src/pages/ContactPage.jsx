import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">Contact <span className="text-brand-gold">Us</span></h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Looking for specific MSME machinery? Reach out to us for quotations, international sourcing inquiries, or support.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="bg-brand-dark border border-brand-green p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-8">Get in Touch</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-brand-green/30 p-3 rounded-lg mr-4 mt-1">
                <MapPin className="text-brand-gold w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Head Office</h3>
                <p className="text-gray-400 mt-1 leading-relaxed">
                  255A, Vipin Garden<br />
                  Behind Ring Meadows Public School<br />
                  Dwarka, New Delhi - 110059
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-brand-green/30 p-3 rounded-lg mr-4 mt-1">
                <Phone className="text-brand-gold w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Phone</h3>
                <p className="text-gray-400 mt-1">
                  +91 7982813507<br />
                  +91 6200054896
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-brand-green/30 p-3 rounded-lg mr-4 mt-1">
                <Mail className="text-brand-gold w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Email</h3>
                <p className="text-gray-400 mt-1">rudratraders.store@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-brand-green/30 p-3 rounded-lg mr-4 mt-1">
                <Clock className="text-brand-gold w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Business Hours</h3>
                <p className="text-gray-400 mt-1">Mon - Sat: 9:00 AM - 7:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Google Map */}
        <div className="bg-brand-dark border border-brand-green p-2 rounded-2xl overflow-hidden h-[500px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14008.26190875463!2d77.0182582!3d28.6277931!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d05374b884ce3%3A0x86b0f02cd103a8ba!2sVipin%20Garden%2C%20Nawada%2C%20Delhi%2C%20110059!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0, borderRadius: '12px' }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Rudra Traders Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
