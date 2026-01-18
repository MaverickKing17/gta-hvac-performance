
import React from 'react';

const AboutOwner: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full lg:w-3/5 relative">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(26,67,50,0.15)] ring-12 ring-white bg-white">
              <img 
                src="https://i.ibb.co/5h96y7Zw/gemini-3-pro-image-preview-2k-a-Replace-the-current.png" 
                alt="Green Heating & Air Technicians" 
                className="w-full h-auto block transform hover:scale-105 transition-transform duration-700 object-top"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/10 to-transparent pointer-events-none"></div>
            </div>
            
            <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-emerald-800 rounded-full blur-[100px] opacity-20 -z-10"></div>
            <div className="absolute -top-12 -left-12 w-48 h-48 border-8 border-emerald-100 rounded-full -z-10 opacity-50"></div>
          </div>
          
          <div className="w-full lg:w-2/5">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-6">About Green Heating & Air</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-8 leading-tight">Mississauga’s Leaders in High-Efficiency Comfort</h2>
            
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
              <p>
                At Green Heating & Air, we believe home comfort shouldn't come with a massive utility bill. 
                Our team has spent over 15 years helping Mississauga homeowners transition to cleaner, more efficient heating 
                and cooling solutions.
              </p>
              <p>
                Our focus is simple: we leverage every available government rebate to make premium heat pumps and 
                insulation upgrades affordable for everyone. We handle the complex paperwork, so you can just enjoy the comfort.
              </p>
            </div>
            
            <div className="mt-10 flex flex-wrap gap-6 sm:gap-10">
              <div>
                <div className="text-3xl font-bold text-slate-900 mb-1">1,200+</div>
                <div className="text-sm text-slate-500 uppercase tracking-widest font-semibold">Installs</div>
              </div>
              <div className="w-px h-12 bg-slate-200 hidden sm:block"></div>
              <div>
                <div className="text-3xl font-bold text-slate-900 mb-1">15+</div>
                <div className="text-sm text-slate-500 uppercase tracking-widest font-semibold">Years</div>
              </div>
              <div className="w-px h-12 bg-slate-200 hidden sm:block"></div>
              <div>
                <div className="text-3xl font-bold text-slate-900 mb-1">5.0</div>
                <div className="text-sm text-slate-500 uppercase tracking-widest font-semibold">Rating</div>
              </div>
            </div>

            <div className="mt-12 flex items-center gap-4 border-t border-slate-200 pt-8">
              <div className="font-bold text-xl text-slate-900 italic">— Green Heating & Air Inc.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutOwner;
