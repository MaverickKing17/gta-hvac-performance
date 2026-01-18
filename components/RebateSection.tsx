
import React from 'react';
import { REBATES } from '../constants';

interface RebateSectionProps {
  onStartAssistant?: () => void;
}

const RebateSection: React.FC<RebateSectionProps> = ({ onStartAssistant }) => {
  return (
    <section id="rebates" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-4">
            Available 2026 Home Renovation Savings
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Stack these rebates together to save thousands on your home energy upgrades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REBATES.map((rebate, idx) => (
            <button 
              key={idx} 
              onClick={onStartAssistant}
              className="text-left group bg-slate-50 border border-slate-100 rounded-2xl p-8 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-forest-green"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/10 transition-colors"></div>
              
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-sm text-forest-green text-xl">
                <i className={
                  rebate.type.includes('Heat Pump') ? 'fas fa-fan' :
                  rebate.type.includes('Insulation') ? 'fas fa-layer-group' :
                  rebate.type.includes('Windows') ? 'fas fa-window-maximize' :
                  rebate.type.includes('Solar') ? 'fas fa-solar-panel' : 'fas fa-thermometer-half'
                }></i>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">{rebate.type}</h3>
              <div className="text-3xl font-extrabold text-emerald-700 mb-4">{rebate.amount}</div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {rebate.requirement}
              </p>
              
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Eligibility Check Required</span>
                <i className="fas fa-chevron-right text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"></i>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-16 bg-emerald-900 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]"></div>
          <h3 className="text-2xl font-bold mb-4 relative z-10">Unsure where to start?</h3>
          <p className="text-emerald-100/80 mb-8 max-w-xl mx-auto relative z-10">
            A free energy assessment is the first step to unlocking the full $7,500 benefit. 
            Abe and the team can walk you through it.
          </p>
          <button 
            onClick={onStartAssistant}
            className="inline-block bg-white text-emerald-900 px-8 py-4 rounded-full font-bold hover:bg-emerald-50 transition-colors relative z-10 shadow-lg active:scale-95"
          >
            Check Your Eligibility Online
          </button>
        </div>
      </div>
    </section>
  );
};

export default RebateSection;
