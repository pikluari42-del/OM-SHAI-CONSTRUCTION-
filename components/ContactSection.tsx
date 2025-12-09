import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ContactSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="bg-white py-20 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold text-brand-blue mb-6">{t.contactUs}</h2>
            <p className="text-gray-600 mb-8 text-lg">
              We are available 24/7 to help you find the right job or the right worker. Visit our office or call us directly.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-brand-light p-3 rounded-full mr-4 text-brand-orange">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Office Location</h4>
                  <p className="text-gray-600">Shop No. 4, Market Road, Near City Center, Mumbai, India</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-brand-light p-3 rounded-full mr-4 text-brand-orange">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Phone Support</h4>
                  <p className="text-gray-600">+91 98765 43210</p>
                  <p className="text-gray-600">+91 98765 43211</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-brand-light p-3 rounded-full mr-4 text-brand-orange">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Email</h4>
                  <p className="text-gray-600">jobs@laborlink.com</p>
                </div>
              </div>
              
               <div className="flex items-start">
                <div className="bg-brand-light p-3 rounded-full mr-4 text-brand-orange">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Working Hours</h4>
                  <p className="text-gray-600">Monday - Saturday: 8:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="h-[400px] w-full bg-gray-200 rounded-2xl overflow-hidden shadow-lg">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.732408906951!2d72.82583331482187!3d19.07598375694703!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c97045c7128d%3A0x629555c82613d2f2!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1625123456789!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy"
              title="Office Map"
            ></iframe>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;