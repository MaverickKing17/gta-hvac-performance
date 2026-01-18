
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-slate-800 pb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-forest-green rounded-lg flex items-center justify-center">
                <i className="fas fa-leaf text-white"></i>
              </div>
              <span className="text-xl font-bold">Green Heating & Air</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6">
              Providing Mississauga and the GTA with energy-efficient HVAC solutions since 2008.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-forest-green transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-forest-green transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-forest-green transition-colors">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Services</h4>
            <ul className="space-y-4 text-slate-400">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Heat Pump Installation</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Emergency Furnace Repair</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">AC Installation</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Ductless Systems</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Home Energy Audits</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-slate-400">
              <li><a href="#rebates" className="hover:text-emerald-400 transition-colors">2026 Rebate Guide</a></li>
              <li><a href="#about" className="hover:text-emerald-400 transition-colors">About Abe</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Schedule Service</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-slate-400">
              <li className="flex gap-3">
                <i className="fas fa-map-marker-alt text-emerald-400 mt-1"></i>
                <span>123 Burnamthorpe Rd W,<br />Mississauga, ON L5B 3C2</span>
              </li>
              <li className="flex gap-3">
                <i className="fas fa-phone-alt text-emerald-400 mt-1"></i>
                <a href="tel:9055551234" className="hover:text-emerald-400">905-555-1234</a>
              </li>
              <li className="flex gap-3">
                <i className="fas fa-envelope text-emerald-400 mt-1"></i>
                <a href="mailto:abe@greenheating.ca" className="hover:text-emerald-400">abe@greenheating.ca</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <p>© 2025 Green Heating and Air Inc. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Electrical Contractor: ESA #1234567 | TSSA Certified</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
