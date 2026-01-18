
import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 bg-forest-green rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <i className="fas fa-leaf text-white"></i>
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 block leading-none">Green Heating</span>
              <span className="text-xs text-forest-green font-semibold tracking-widest uppercase">& Air Inc.</span>
            </div>
          </button>
          
          <nav className="hidden md:flex space-x-8 items-center">
            <button 
              type="button"
              onClick={() => scrollToSection('rebates')} 
              className="text-slate-600 hover:text-forest-green font-medium transition-colors"
            >
              2026 Rebates
            </button>
            <button 
              type="button"
              onClick={() => scrollToSection('services')} 
              className="text-slate-600 hover:text-forest-green font-medium transition-colors"
            >
              Services
            </button>
            <button 
              type="button"
              onClick={() => scrollToSection('about')} 
              className="text-slate-600 hover:text-forest-green font-medium transition-colors"
            >
              About Green Heating & Air
            </button>
            <a 
              href="tel:9055551234" 
              className="bg-forest-green text-white px-5 py-2 rounded-full font-bold hover:bg-emerald-900 transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <i className="fas fa-phone-alt text-sm"></i> 905-555-1234
            </a>
          </nav>

          <button 
            className="md:hidden text-slate-600 text-2xl p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-6 space-y-6 shadow-2xl animate-in slide-in-from-top duration-300">
          <button onClick={() => scrollToSection('rebates')} className="block w-full text-left text-lg text-slate-700 font-medium p-2">2026 Rebates</button>
          <button onClick={() => scrollToSection('services')} className="block w-full text-left text-lg text-slate-700 font-medium p-2">Services</button>
          <button onClick={() => scrollToSection('about')} className="block w-full text-left text-lg text-slate-700 font-medium p-2">About Green Heating & Air</button>
          <a href="tel:9055551234" className="block bg-forest-green text-white px-5 py-4 rounded-xl font-bold text-center shadow-lg active:scale-95 transition-transform">
            Call 905-555-1234
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
