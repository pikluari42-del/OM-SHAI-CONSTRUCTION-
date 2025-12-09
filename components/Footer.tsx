import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-blue text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4 flex flex-col">
                <span>OM SHAI</span>
                <span className="text-brand-yellow">CONSTRUCTION</span>
            </h3>
            <p className="text-gray-400 max-w-sm">
              The most trusted platform for daily wage workers and skilled laborers to find employment opportunities quickly and safely.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-brand-yellow">Home</a></li>
              <li><a href="#jobs" className="hover:text-brand-yellow">Find Jobs</a></li>
              <li><a href="#contact" className="hover:text-brand-yellow">Contact Us</a></li>
              <li><a href="#" className="hover:text-brand-yellow">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
             <h4 className="font-bold text-lg mb-4">Follow Us</h4>
             <div className="flex space-x-4">
               <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-brand-blue hover:text-brand-yellow transition">
                 <Facebook size={20} />
               </a>
               <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-brand-blue hover:text-brand-yellow transition">
                 <Instagram size={20} />
               </a>
               <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-brand-blue hover:text-brand-yellow transition">
                 <Twitter size={20} />
               </a>
             </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} OM SHAI CONSTRUCTION. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;