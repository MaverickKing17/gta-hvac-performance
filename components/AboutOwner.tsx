
import React from 'react';

const AboutOwner: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white bg-white">
              <img 
                src="https://i.ibb.co/5h96y7Zw/gemini-3-pro-image-preview-2k-a-Replace-the-current.png" 
                alt="Abe, Owner of Green Heating & Air Inc." 
                className="w-full h-auto aspect-square object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-20 -z-10"></div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-6">Meet the Owner</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-8 leading-tight">Specializing in high-efficiency systems that pay for themselves.</h2>
            
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
              <p>
                "At Green Heating and Air, we believe comfort shouldn't come with a massive utility bill. 
                I've spent over 15 years helping Mississauga homeowners transition to cleaner, more efficient heating 
                and cooling solutions."
              </p>
              <p>
                "Our focus is simple: we leverage every available government rebate to make premium heat pumps and 
                insulation upgrades affordable for everyone. We handle the paperwork, you enjoy the comfort."
              </p>
            </div>
            
            <div className="mt-10 flex flex-wrap gap-8">
              <div>
                <div className="text-3xl font-bold text-slate-900 mb-1">1,200+</div>
                <div className="text-sm text-slate-500 uppercase tracking-widest font-semibold">Installations in GTA</div>
              </div>
              <div className="w-px h-12 bg-slate-200 hidden sm:block"></div>
              <div>
                <div className="text-3xl font-bold text-slate-900 mb-1">15+</div>
                <div className="text-sm text-slate-500 uppercase tracking-widest font-semibold">Years Experience</div>
              </div>
              <div className="w-px h-12 bg-slate-200 hidden sm:block"></div>
              <div>
                <div className="text-3xl font-bold text-slate-900 mb-1">5.0</div>
                <div className="text-sm text-slate-500 uppercase tracking-widest font-semibold">Google Rating</div>
              </div>
            </div>

            <div className="mt-12 flex items-center gap-4 border-t border-slate-200 pt-8">
              <div className="font-bold text-xl text-slate-900 italic">— Abe, Founder & Energy Specialist</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutOwner;
