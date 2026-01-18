
import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import RebateSection from './components/RebateSection';
import AboutOwner from './components/AboutOwner';
import Footer from './components/Footer';
import AssistantModal from './components/AssistantModal';

const App: React.FC = () => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const handleStartAssistant = () => setIsAssistantOpen(true);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main>
        <Hero onStartAssistant={handleStartAssistant} />
        
        {/* Floating Emergency Banner */}
        <div className="bg-red-600 text-white py-3 sticky top-20 z-30 shadow-xl border-b border-red-500">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm sm:text-base font-bold">
            <span className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              Emergency? 4-Hour Response Guarantee
            </span>
            <button 
              onClick={handleStartAssistant}
              className="bg-white text-red-700 px-6 py-2 rounded-full text-xs sm:text-sm font-black uppercase tracking-tight hover:bg-slate-100 transition-all shadow-md active:scale-95 focus:ring-2 focus:ring-white focus:outline-none"
            >
              Get Jessica (Dispatch)
            </button>
          </div>
        </div>

        <RebateSection onStartAssistant={handleStartAssistant} />
        
        {/* Benefits Section (Services) */}
        <section id="services" className="py-24 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                  <i className="fas fa-shield-heart"></i>
                </div>
                <h4 className="text-xl font-bold mb-4">Certified Professionals</h4>
                <p className="text-slate-600">Our technicians are TSSA and HRAI certified, ensuring safety and precision in every install.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                  <i className="fas fa-file-invoice-dollar"></i>
                </div>
                <h4 className="text-xl font-bold mb-4">Paperwork Handled</h4>
                <p className="text-slate-600">Don't stress about complex rebate applications. Chloe and the admin team handle everything for you.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
                  <i className="fas fa-clock"></i>
                </div>
                <h4 className="text-xl font-bold mb-4">Lifetime Support</h4>
                <p className="text-slate-600">We don't just install and leave. We provide ongoing maintenance and priority emergency dispatch.</p>
              </div>
            </div>
            
            <div className="mt-16 text-center">
               <button 
                 onClick={handleStartAssistant}
                 className="inline-flex items-center gap-2 bg-forest-green text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-900 transition-all shadow-lg hover:shadow-forest-green/20 active:scale-95"
               >
                 Book a Professional Consultation
                 <i className="fas fa-arrow-right text-sm"></i>
               </button>
            </div>
          </div>
        </section>

        <AboutOwner />
      </main>

      <Footer onStartAssistant={handleStartAssistant} />

      <AssistantModal 
        isOpen={isAssistantOpen} 
        onClose={() => setIsAssistantOpen(false)} 
      />
    </div>
  );
};

export default App;
