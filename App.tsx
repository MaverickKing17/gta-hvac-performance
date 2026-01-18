
import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import RebateSection from './components/RebateSection';
import AboutOwner from './components/AboutOwner';
import Footer from './components/Footer';
import AssistantModal from './components/AssistantModal';

const App: React.FC = () => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main>
        <Hero onStartAssistant={() => setIsAssistantOpen(true)} />
        
        {/* Floating Emergency Banner */}
        <div className="bg-red-600 text-white py-2 sticky top-20 z-30 shadow-md">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm sm:text-base font-bold">
            <span className="flex items-center gap-2">
              <i className="fas fa-exclamation-triangle animate-pulse"></i> 
              Emergency? 4-Hour Response Guarantee
            </span>
            <button 
              onClick={() => setIsAssistantOpen(true)}
              className="bg-white text-red-600 px-4 py-1 rounded-full text-xs sm:text-sm hover:bg-slate-100 transition-colors"
            >
              Get Sam (Dispatch)
            </button>
          </div>
        </div>

        <RebateSection />
        
        {/* Benefits Section */}
        <section className="py-24 bg-white border-t border-slate-100">
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
          </div>
        </section>

        <AboutOwner />
      </main>

      <Footer />

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-forest-green text-white rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform active:scale-95 z-50 ring-4 ring-white"
      >
        <i className="fas fa-microphone"></i>
      </button>

      {/* The Assistant Modal */}
      <AssistantModal 
        isOpen={isAssistantOpen} 
        onClose={() => setIsAssistantOpen(false)} 
      />
    </div>
  );
};

export default App;
