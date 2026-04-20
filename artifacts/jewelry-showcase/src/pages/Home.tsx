import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Ring3D } from '@/components/Ring3D';
import macroDiamondImg from '@/assets/macro-diamond.png';
import goldBandImg from '@/assets/gold-band.png';
import engravingDetailImg from '@/assets/engraving-detail.png';
import lifestyleRingImg from '@/assets/lifestyle-ring.png';
import { ChevronDown, Sparkles, PenTool, ArrowRight, Gem } from 'lucide-react';

const METALS = [
  { id: 'yellow', name: 'Yellow Gold', color: '#d4a843', hex: '#E5A93C' },
  { id: 'white', name: 'White Gold', color: '#d8d8d8', hex: '#D9D9D9' },
  { id: 'rose', name: 'Rose Gold', color: '#c47a6a', hex: '#CDA59B' },
];

const CUTS = [
  { id: 'round', name: 'Round Brilliant' },
  { id: 'emerald', name: 'Emerald Cut' },
];

export default function Home() {
  const [activeMetal, setActiveMetal] = useState(METALS[0]);
  const [activeCut, setActiveCut] = useState(CUTS[0]);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -60]);

  // Feed scroll progress to 3D ring
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => setScrollProgress(v));
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="bg-background text-foreground min-h-screen selection:bg-primary/30">
      
      {/* Fixed 3D Canvas Background */}
      <div className="fixed inset-0 z-0">
        <Ring3D metalColor={activeMetal.color} stoneCut={activeCut.id} scrollProgress={scrollProgress} />
        {/* Deep vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_40%,transparent_0%,rgba(8,9,12,0.75)_100%)]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 p-6 md:p-10 flex justify-between items-center">
        <div className="font-serif text-2xl tracking-widest uppercase text-white/90">Aurum &amp; Co.</div>
        <div className="hidden md:flex gap-8 text-xs tracking-[0.25em] uppercase text-white/40">
          <a href="#collection" className="hover:text-white/80 transition-colors duration-300">Collection</a>
          <a href="#craftsmanship" className="hover:text-white/80 transition-colors duration-300">Maison</a>
          <a href="#configurator" className="hover:text-white/80 transition-colors duration-300">Bespoke</a>
        </div>
      </nav>

      <div className="relative z-10">
        
        {/* Hero Section */}
        <section className="h-screen flex flex-col justify-center items-center text-center px-4 pointer-events-none">
          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="space-y-6">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              className="text-primary tracking-[0.4em] text-xs uppercase"
            >
              The Solitaire Collection — 2025
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-white leading-[0.95]"
            >
              Eternity<br />
              <span className="text-white/30 italic">Captured.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="text-white/40 text-sm tracking-wider font-light max-w-xs mx-auto"
            >
              Drag to inspect. A living jewel.
            </motion.p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className="absolute bottom-10 flex flex-col items-center gap-3 text-white/30"
          >
            <span className="text-[10px] tracking-[0.4em] uppercase">Discover</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </motion.div>
        </section>

        {/* Configurator Section */}
        <section id="configurator" className="min-h-screen flex items-center py-32 pointer-events-none">
          <div className="container mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="pointer-events-auto flex flex-col justify-center space-y-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.25, 0.4, 0.25, 1] }}
                className="space-y-4"
              >
                <p className="text-primary text-xs tracking-[0.35em] uppercase">Bespoke Configuration</p>
                <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight">Design Your Legacy</h2>
                <p className="text-white/40 font-light text-base max-w-sm leading-relaxed">
                  Every Aurum &amp; Co. piece is forged to order. Select your materials and cut — watch the ring transform in real time.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.15 }}
                className="space-y-8 bg-black/40 backdrop-blur-xl border border-white/[0.06] p-8"
              >
                {/* Metal Selection */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-primary">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Noble Metal</span>
                  </div>
                  <div className="flex gap-6">
                    {METALS.map((metal) => (
                      <button
                        key={metal.id}
                        data-testid={`button-metal-${metal.id}`}
                        onClick={() => setActiveMetal(metal)}
                        className={`group flex flex-col items-center gap-3 transition-all duration-500 ${activeMetal.id === metal.id ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`}
                      >
                        <div 
                          className={`w-9 h-9 rounded-full border-2 transition-all duration-300 shadow-lg ${activeMetal.id === metal.id ? 'border-white/60 scale-110 shadow-white/10' : 'border-transparent group-hover:scale-105'}`}
                          style={{ backgroundColor: metal.hex }}
                        />
                        <span className="text-[10px] tracking-widest text-white/70">{metal.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent" />

                {/* Cut Selection */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-primary">
                    <Gem className="w-3.5 h-3.5" />
                    <span>Diamond Cut</span>
                  </div>
                  <div className="flex gap-3">
                    {CUTS.map((cut) => (
                      <button
                        key={cut.id}
                        data-testid={`button-cut-${cut.id}`}
                        onClick={() => setActiveCut(cut)}
                        className={`px-5 py-2.5 border text-[11px] tracking-[0.2em] uppercase transition-all duration-500
                          ${activeCut.id === cut.id 
                            ? 'border-primary/70 text-primary bg-primary/5' 
                            : 'border-white/10 text-white/35 hover:border-white/25 hover:text-white/60'}`}
                      >
                        {cut.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  data-testid="button-request-appointment"
                  className="w-full mt-4 py-4 bg-white text-black text-[11px] tracking-[0.25em] uppercase hover:bg-primary hover:text-black transition-all duration-500 flex items-center justify-center gap-2"
                >
                  Request Private Appointment <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            </div>
            <div className="hidden lg:block" />
          </div>
        </section>

        {/* Craftsmanship Narrative */}
        <section id="craftsmanship" className="py-36 bg-background/96 backdrop-blur-2xl relative z-20 pointer-events-auto border-t border-white/[0.04]">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-28 items-center">
              <motion.div 
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1 }}
                className="aspect-[3/4] relative overflow-hidden"
              >
                <img 
                  src={lifestyleRingImg} 
                  alt="Couture lifestyle jewelry" 
                  data-testid="img-lifestyle-ring"
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-[2s] ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <p className="text-[10px] tracking-[0.3em] text-white/50 uppercase">Aurum — Atelier Paris</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: 0.3 }}
                className="space-y-10"
              >
                <div className="space-y-1">
                  <p className="text-primary text-[10px] tracking-[0.35em] uppercase mb-6">The Maison</p>
                  <h3 className="text-3xl md:text-5xl font-serif text-white leading-[1.1]">Forged in Silence,<br/><span className="text-white/25 italic">Worn in Brilliance.</span></h3>
                </div>
                <div className="space-y-5">
                  <p className="text-white/40 leading-loose text-base font-light">
                    Our master artisans dedicate over 300 hours to a single piece. From sourcing conflict-free rough stones in Antwerp to the final micro-setting of each pavé — the process is an unhurried meditation on perfection.
                  </p>
                  <p className="text-white/40 leading-loose text-base font-light">
                    We do not follow trends. We cast artifacts designed to outlive us all.
                  </p>
                </div>
                <div className="flex gap-12 pt-4">
                  {[['300+', 'Hours Per Piece'], ['18k', 'Recycled Gold'], ['0.1%', 'Stone Selection']].map(([num, label]) => (
                    <div key={label} className="space-y-1">
                      <p className="text-white text-2xl font-serif">{num}</p>
                      <p className="text-white/30 text-[10px] tracking-widest uppercase">{label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Materials Grid */}
        <section id="collection" className="py-32 bg-background relative z-20 pointer-events-auto">
          <div className="container mx-auto px-6 lg:px-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="mb-20 space-y-3"
            >
              <span className="text-primary text-[10px] tracking-[0.4em] uppercase">Material Excellence</span>
              <h2 className="text-3xl md:text-5xl font-serif text-white">Uncompromising by Nature</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
                className="group relative aspect-square overflow-hidden"
              >
                <img 
                  src={macroDiamondImg} 
                  alt="Diamond facets macro" 
                  data-testid="img-macro-diamond"
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-[2.5s] ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10">
                  <h4 className="text-xl font-serif text-white mb-2">Flawless Clarity</h4>
                  <p className="text-white/50 font-light text-sm leading-relaxed">Only the top 0.1% of graded stones meet the Aurum standard for light performance.</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.15 }}
                className="group relative aspect-square overflow-hidden"
              >
                <img 
                  src={goldBandImg} 
                  alt="Gold band craftsmanship" 
                  data-testid="img-gold-band"
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-[2.5s] ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10">
                  <h4 className="text-xl font-serif text-white mb-2">Recycled 18k Gold</h4>
                  <p className="text-white/50 font-light text-sm leading-relaxed">Sustainably refined and hand-drawn to achieve a dense, molecularly perfect alloy.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Engraving CTA */}
        <section className="py-44 relative z-20 pointer-events-auto overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={engravingDetailImg} 
              alt="Engraving detail" 
              className="w-full h-full object-cover object-center" 
              style={{ filter: 'brightness(0.25) saturate(0.5)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/80" />
          </div>
          
          <div className="container mx-auto px-6 relative z-10 text-center max-w-2xl">
            <PenTool className="w-6 h-6 text-primary/60 mx-auto mb-10" />
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight"
            >
              Make It Unmistakably Yours
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-white/40 font-light mb-12 leading-loose text-base"
            >
              Complimentary inside-band hand engraving by our master calligrapher.<br />
              A secret between you and eternity.
            </motion.p>
            <motion.button 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              data-testid="button-personalization"
              className="px-10 py-4 border border-primary/40 text-primary tracking-[0.25em] uppercase text-[11px] hover:bg-primary hover:border-primary hover:text-black transition-all duration-500"
            >
              Discover Personalization
            </motion.button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-background pt-24 pb-12 relative z-20 pointer-events-auto border-t border-white/[0.04]">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-2">
                <h4 className="font-serif text-xl text-white mb-5">Aurum &amp; Co.</h4>
                <p className="text-white/30 font-light max-w-xs mb-8 leading-loose text-sm">
                  Creating heirlooms of unparalleled beauty. Maison founded in Paris, pieces crafted for the world.
                </p>
                <div className="flex gap-3">
                  <input 
                    type="email" 
                    placeholder="Join the Inner Circle" 
                    data-testid="input-email-newsletter"
                    className="bg-white/[0.03] border border-white/[0.08] px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/40 transition-colors w-56 placeholder:text-white/20"
                  />
                  <button 
                    data-testid="button-subscribe"
                    className="bg-white text-black px-5 text-[11px] tracking-[0.2em] uppercase hover:bg-primary transition-colors duration-300"
                  >
                    Join
                  </button>
                </div>
              </div>
              
              <div>
                <h5 className="text-white/60 text-[10px] tracking-[0.3em] uppercase mb-6">Maison</h5>
                <ul className="space-y-3.5 text-white/30 text-sm font-light">
                  <li><a href="#" className="hover:text-white/70 transition-colors">The Heritage</a></li>
                  <li><a href="#" className="hover:text-white/70 transition-colors">Sustainability</a></li>
                  <li><a href="#" className="hover:text-white/70 transition-colors">Boutiques</a></li>
                  <li><a href="#" className="hover:text-white/70 transition-colors">Careers</a></li>
                </ul>
              </div>
              
              <div>
                <h5 className="text-white/60 text-[10px] tracking-[0.3em] uppercase mb-6">Client Care</h5>
                <ul className="space-y-3.5 text-white/30 text-sm font-light">
                  <li><a href="#" className="hover:text-white/70 transition-colors">Book Appointment</a></li>
                  <li><a href="#" className="hover:text-white/70 transition-colors">Care &amp; Repair</a></li>
                  <li><a href="#" className="hover:text-white/70 transition-colors">Track Order</a></li>
                  <li><a href="#" className="hover:text-white/70 transition-colors">Contact Concierge</a></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/20 tracking-wider">
              <p>© {new Date().getFullYear()} Aurum &amp; Co. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white/50 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white/50 transition-colors">Terms</a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
