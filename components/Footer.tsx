
import React from 'react';
import { OFFICIAL_ADDRESS, OFFICIAL_WEBSITE } from '../constants';

interface FooterProps {
  onStartAssistant?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onStartAssistant }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
              Mississauga's premier choice for energy-efficient HVAC and government rebate maximization.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-forest-green transition-colors" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-forest-green transition-colors" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-forest-green transition-colors" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Services</h4>
            <ul className="space-y-4 text-slate-400">
              <li><button type="button" onClick={() => scrollToSection('services')} className="hover:text-emerald-400 transition-colors text-left">Heat Pump Installation</button></li>
              <li><button type="button" onClick={() => scrollToSection('services')} className="hover:text-emerald-400 transition-colors text-left">Emergency Furnace Repair</button></li>
              <li><button type="button" onClick={() => scrollToSection('services')} className="hover:text-emerald-400 transition-colors text-left">AC Installation</button></li>
              <li><button type="button" onClick={() => scrollToSection('services')} className="hover:text-emerald-400 transition-colors text-left">Ductless Systems</button></li>
              <li><button type="button" onClick={() => scrollToSection('services')} className="hover:text-emerald-400 transition-colors text-left">Home Energy Audits</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-slate-400">
              <li><button type="button" onClick={() => scrollToSection('rebates')} className="hover:text-emerald-400 transition-colors text-left">2026 Rebate Guide</button></li>
              <li><button type="button" onClick={() => scrollToSection('about')} className="hover:text-emerald-400 transition-colors text-left">About Abe</button></li>
              <li>
                <button 
                  type="button"
                  onClick={onStartAssistant}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Schedule Service
                </button>
              </li>
              <li><button type="button" onClick={() => scrollToSection('about')} className="hover:text-emerald-400 transition-colors text-left">Sustainability Policy</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-slate-400">
              <li className="flex gap-3 text-sm">
                <i className="fas fa-map-marker-alt text-emerald-400 mt-1"></i>
                <span>{OFFICIAL_ADDRESS}</span>
              </li>
              <li className="flex gap-3">
                <i className="fas fa-phone-alt text-emerald-400 mt-1"></i>
                <a href="tel:9055551234" className="hover:text-emerald-400 font-medium">905-555-1234</a>
              </li>
              <li className="flex gap-3">
                <i className="fas fa-globe text-emerald-400 mt-1"></i>
                <a href={`https://${OFFICIAL_WEBSITE}`} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">{OFFICIAL_WEBSITE}</a>
              </li>
              <li className="flex gap-3">
                <i className="fas fa-envelope text-emerald-400 mt-1"></i>
                <a href="mailto:abe@greenheatingandair.ca" className="hover:text-emerald-400">abe@greenheatingandair.ca</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <p>© 2025 Green Heating and Air Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             <span>ESA #1234567</span>
             <span className="opacity-30">|</span>
             <span>TSSA Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
