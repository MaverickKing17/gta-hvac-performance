
import React from 'react';
import Button from './Button';

interface HeroProps {
  onStartAssistant: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartAssistant }) => {
  return (
    <div className="relative overflow-hidden bg-forest-green pt-24 pb-32">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl mb-6">
            Mississauga’s Green Energy Experts – <span className="text-emerald-400">Maximize Your 2026 Rebates.</span>
          </h1>
          <p className="mt-6 text-xl text-emerald-100/90 leading-relaxed">
            Switching to a high-efficiency heat pump isn't just good for the planet—it's great for your wallet. 
            Access up to $7,500 in government incentives today.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={onStartAssistant} className="w-full sm:w-auto shadow-xl">
              Check My Eligibility
            </Button>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto" onClick={() => window.location.hash = '#rebates'}>
              View All Rebates
            </Button>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 grayscale opacity-60">
            <div className="flex items-center text-white gap-2">
              <i className="fas fa-check-circle text-emerald-400"></i>
              <span className="font-semibold text-sm tracking-wider uppercase">Enbridge Authorized</span>
            </div>
            <div className="flex items-center text-white gap-2">
              <i className="fas fa-check-circle text-emerald-400"></i>
              <span className="font-semibold text-sm tracking-wider uppercase">Energy Star Partner</span>
            </div>
            <div className="flex items-center text-white gap-2">
              <i className="fas fa-check-circle text-emerald-400"></i>
              <span className="font-semibold text-sm tracking-wider uppercase">4-Hour Dispatch</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
