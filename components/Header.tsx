
import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-forest-green rounded-lg flex items-center justify-center">
              <i className="fas fa-leaf text-white"></i>
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 block leading-none">Green Heating</span>
              <span className="text-xs text-forest-green font-semibold tracking-widest uppercase">& Air Inc.</span>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-8 items-center">
            <a href="#rebates" className="text-slate-600 hover:text-forest-green font-medium">2026 Rebates</a>
            <a href="#services" className="text-slate-600 hover:text-forest-green font-medium">Services</a>
            <a href="#about" className="text-slate-600 hover:text-forest-green font-medium">About Abe</a>
            <a href="tel:9055551234" className="bg-forest-green text-white px-5 py-2 rounded-full font-bold hover:bg-emerald-900 transition-colors flex items-center gap-2">
              <i className="fas fa-phone-alt text-sm"></i> 905-555-1234
            </a>
          </nav>

          <button 
            className="md:hidden text-slate-600 text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4 shadow-xl">
          <a href="#rebates" className="block text-slate-700 py-2 font-medium">2026 Rebates</a>
          <a href="#services" className="block text-slate-700 py-2 font-medium">Services</a>
          <a href="#about" className="block text-slate-700 py-2 font-medium">About Abe</a>
          <a href="tel:9055551234" className="block bg-forest-green text-white px-5 py-3 rounded-lg font-bold text-center">
            Call 905-555-1234
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
