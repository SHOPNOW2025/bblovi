/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from "motion/react";
import { 
  ArrowRight, 
  BarChart3, 
  Globe, 
  Zap, 
  Layers, 
  Play,
  Plus,
  Trash2,
  Loader2
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../hooks/useContent";
import { Editable } from "../components/Editable";
import { useAuth } from "../context/AuthContext";
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { uploadImage } from "../services/imageService";
import { LeadForm } from "../components/LeadForm";

const PartnerMarquee = () => {
  const { profile, editMode } = useAuth();
  const [partners, setPartners] = useState<{id: string, logo: string, loading?: boolean}[]>([]);
  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    const q = query(collection(db, "partners"));
    return onSnapshot(q, (snap) => {
      setPartners(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
    });
  }, []);

  const handleAdd = async () => {
    const url = "https://i.ibb.co/JRzZYn3S/2.png";
    await addDoc(collection(db, "partners"), { logo: url });
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "partners", id));
  };

  const handleUpdate = async (id: string, file: File) => {
    // Set loading for this specific partner
    setPartners(prev => prev.map(p => p.id === id ? { ...p, loading: true } : p));
    
    try {
      const url = await uploadImage(file);
      await updateDoc(doc(db, "partners", id), { logo: url });
    } catch (err) {
      alert("Update failed.");
    } finally {
      setPartners(prev => prev.map(p => p.id === id ? { ...p, loading: false } : p));
    }
  };

  return (
    <div className="py-12 border-y border-white/5 lg:my-10 relative group/marquee overflow-hidden">
      {isAdmin && editMode && (
         <button 
           onClick={handleAdd}
           className="absolute -top-4 left-1/2 -translate-x-1/2 z-50 bg-accent text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg animate-bounce"
         >
           <Plus size={12} /> Add Partner
         </button>
      )}
      
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {(partners.length > 0 ? [...partners, ...partners] : [...Array(12)]).map((p, i) => (
          <div key={p?.id ? `${p.id}-${i}` : i} className="flex items-center group relative px-14">
             <div className="w-48 h-24 flex items-center justify-center relative overflow-hidden bg-white/5 rounded-2xl border border-white/5 p-6 hover:bg-white/10 transition-all duration-500">
                <img 
                  src={p?.logo || "https://i.ibb.co/JRzZYn3S/2.png"} 
                  className={`w-full h-full object-contain transition-all duration-500 ${p?.loading ? 'opacity-30' : 'opacity-100'} group-hover:scale-110`}
                  alt="" 
                />
                
                {p?.loading && (
                   <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                      <Loader2 className="animate-spin text-accent" size={24} />
                   </div>
                )}
                
                {isAdmin && editMode && p?.id && !p?.loading && (
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label className="cursor-pointer p-2 bg-accent text-white rounded-xl hover:scale-110 transition-transform shadow-lg">
                      <Plus size={16} />
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => {
                           if(e.target.files?.[0]) {
                              handleUpdate(p.id, e.target.files[0]);
                              e.target.value = ""; 
                           }
                        }} 
                      />
                    </label>
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="p-2 bg-red-500 text-white rounded-xl hover:scale-110 transition-transform shadow-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Hero = ({ onStartTrial }: { onStartTrial: () => void }) => {
  const { t } = useContent();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const staggerSettings = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <section ref={containerRef} className="relative pt-24 pb-32 overflow-hidden px-6 text-center lg:text-left">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          style={{ y, opacity }}
          className="flex flex-col gap-8 items-center lg:items-start"
        >
          <motion.div 
            {...staggerSettings}
            className="inline-flex items-center gap-3 bg-accent/10 border border-accent/20 px-6 py-2.5 rounded-full text-accent shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:bg-accent/20 transition-all duration-300"
          >
            <img src={t("global.logo.small", "https://i.ibb.co/JRzZYn3S/2.png")} className="w-5 h-5 object-contain" alt="" />
            <Editable cmsKey="home.hero.badge">
              {(val) => <span className="text-[11px] font-black tracking-widest uppercase">{val || "New: AI Integration Engine 2.0"}</span>}
            </Editable>
          </motion.div>
          
          <motion.h1 
            {...staggerSettings}
            transition={{ delay: 0.1, ...staggerSettings.transition }}
            className="hero-text text-white relative"
          >
            <Editable cmsKey="home.hero.title">
              {(val, color) => <span style={{ color }}>{val || 'The Intelligent OS for'}</span>}
            </Editable>
            <br />
            <Editable cmsKey="home.hero.title_accent">
              {(val, color) => (
                 <span className="gradient-text" style={{ color: color !== '#ffffff' ? color : undefined }}>
                   {val || 'Modern Growth'}
                 </span>
              )}
            </Editable>
          </motion.h1>
          
          <Editable cmsKey="home.hero.desc">
            {(val, color) => (
              <motion.p 
                {...staggerSettings}
                transition={{ delay: 0.2, ...staggerSettings.transition }}
                className="text-lg md:text-xl text-text-dim max-w-xl leading-relaxed"
                style={{ color }}
              >
                {val || 'Scale your marketing operations with precision. Bloovi combines real-time analytics with predictive automation to drive customer acquisition.'}
              </motion.p>
            )}
          </Editable>
          
          <motion.div 
            {...staggerSettings}
            transition={{ delay: 0.3, ...staggerSettings.transition }}
            className="flex flex-wrap justify-center lg:justify-start gap-4"
          >
            <Editable cmsKey="home.hero.cta_primary">
              {(val) => (
                <button 
                  onClick={onStartTrial}
                  className="bg-accent text-white px-10 py-5 rounded-xl text-md font-bold hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all flex items-center gap-2 group active:scale-95 shadow-xl shadow-accent/20"
                >
                  {val || 'Start Free Trial'}
                </button>
              )}
            </Editable>
            <Editable cmsKey="home.hero.cta_secondary">
              {(val) => (
                <button className="bg-transparent border border-white/10 text-white px-10 py-5 rounded-xl text-md font-bold hover:bg-white/5 transition-all flex items-center gap-2 active:scale-95">
                  {val || 'Watch Product Video'}
                </button>
              )}
            </Editable>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <motion.div 
            animate={{ 
              y: [0, -30, 0],
              rotate: [0, 15, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] flex items-center justify-center z-20 shadow-2xl"
          >
             <img src={t("global.logo.small", "https://i.ibb.co/JRzZYn3S/2.png")} className="w-16 h-16 object-contain" alt="" />
          </motion.div>

          <div className="relative z-10 p-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <Editable cmsKey="home.hero.image" type="image">
              {(val) => (
                <img 
                  src={val || "https://picsum.photos/seed/tech/1200/800"} 
                  alt="Platform Dashboard" 
                  className="rounded-[1.8rem] w-full"
                  referrerPolicy="no-referrer"
                />
              )}
            </Editable>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Features = () => {
  const { t } = useContent();
  const features = [
    {
      key: "home.feature1",
      icon: <BarChart3 className="text-accent" />,
      className: "col-span-1 md:col-span-2 row-span-1",
      defTitle: "Data Intelligence",
      defDesc: "Harness the power of real-time analytics to drive data-informed decisions."
    },
    {
       key: "home.feature2",
       icon: <Globe className="text-accent" />,
       className: "col-span-1",
       defTitle: "Global Scale",
       defDesc: "Expand your reach across 190+ countries with localized strategies."
    },
    {
       key: "home.feature3",
       icon: <Zap className="text-accent" />,
       className: "col-span-1",
       defTitle: "Instant Deployment",
       defDesc: "Go from concept to campaign in minutes with our automation suite."
    },
    {
       key: "home.feature4",
       icon: <Layers className="text-accent" />,
       className: "col-span-1 md:col-span-2",
       defTitle: "Multi-Channel Orchestration",
       defDesc: "Unify your messaging across social, search, and email seamlessly."
    }
  ];

  return (
    <section id="features" className="py-32 px-6 relative z-10 text-center lg:text-left">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 space-y-6">
          <h2 className="text-sm font-black tracking-[0.3em] uppercase text-accent flex items-center justify-center lg:justify-start gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20">
              <img src={t("global.logo.small", "https://i.ibb.co/JRzZYn3S/2.png")} className="w-6 h-6 object-contain" alt="" />
            </div>
            <Editable cmsKey="home.features.badge">
              {(val) => <span>{val || "Capabilities"}</span>}
            </Editable>
          </h2>
          <h3 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            <Editable cmsKey="home.features.title">
              {(val) => <span>{val || "Enterprise grade features."}</span>}
            </Editable>
            <br />
            <Editable cmsKey="home.features.subtitle">
              {(val) => <span>{val || "Consumer grade simplicity."}</span>}
            </Editable>
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bento-card group ${f.className}`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 relative z-10">
                {f.icon}
              </div>
              <Editable cmsKey={`${f.key}.title`} defaultValue={f.defTitle}>
                {(val, color) => <h4 className="text-xl font-bold text-white mb-3 relative z-10" style={{ color }}>{val}</h4>}
              </Editable>
              <Editable cmsKey={`${f.key}.desc`} defaultValue={f.defDesc}>
                {(val, color) => <p className="text-text-dim text-sm leading-relaxed max-w-xs relative z-10" style={{ color }}>{val}</p>}
              </Editable>
              
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity duration-700 -rotate-12 translate-x-4">
                 <img src={t("global.logo.small", "https://i.ibb.co/JRzZYn3S/2.png")} className="w-32 h-32 object-contain" alt="" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = ({ onStartTrial }: { onStartTrial: () => void }) => {
  const { t } = useContent();
  return (
    <section className="py-24 px-6 sm:py-32 relative z-10">
       <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         whileInView={{ opacity: 1, scale: 1 }}
         viewport={{ once: true }}
         className="max-w-7xl mx-auto bg-linear-to-b from-white/5 to-white/[0.02] border border-white/10 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden backdrop-blur-2xl transition-all"
       >
          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <div className="flex justify-center">
               <div className="w-24 h-24 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center mb-4 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
                  <img src={t("global.logo.small", "https://i.ibb.co/JRzZYn3S/2.png")} className="w-14 h-14 object-contain" alt="" />
               </div>
            </div>
            <Editable cmsKey="home.cta.title">
              {(val) => <h2 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight">{val || "Ready to transform your digital strategy?"}</h2>}
            </Editable>
            <Editable cmsKey="home.cta.desc">
              {(val) => <p className="text-xl text-text-dim">{val || "Join 5,000+ companies scaling with Bloovi today."}</p>}
            </Editable>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Editable cmsKey="home.cta.primary">
                {(val) => (
                  <button 
                    onClick={onStartTrial}
                    className="bg-accent text-white px-10 py-5 rounded-xl text-lg font-bold hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] active:scale-95 transition-all"
                  >
                    {val || "Get Started for Free"}
                  </button>
                )}
              </Editable>
              <Editable cmsKey="home.cta.secondary">
                {(val) => (
                  <button className="bg-white/5 backdrop-blur-md text-white border border-white/10 px-10 py-5 rounded-xl text-lg font-bold hover:bg-white/10 active:scale-95 transition-all">
                    {val || "Contact Sales"}
                  </button>
                )}
              </Editable>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none scale-[3]">
             <img src={t("global.logo.small", "https://i.ibb.co/JRzZYn3S/2.png")} className="w-64 h-64 object-contain" alt="" />
          </div>
       </motion.div>
    </section>
  );
};

 export default function Home() {
  const { t } = useContent();
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  return (
    <>
      <Hero onStartTrial={() => setIsLeadFormOpen(true)} />
      
      <PartnerMarquee />

      <Features />
      
      <section className="py-24 px-6 border-b border-white/5">
         <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 text-center lg:text-left">
            {[
              { key: "home.stat1", defVal: "99.9%", defLab: "Uptime guarantee" },
              { key: "home.stat2", defVal: "2.5M+", defLab: "Global API Calls" },
              { key: "home.stat3", defVal: "300+", defLab: "Enterprise Partners" },
              { key: "home.stat4", defVal: "0.2ms", defLab: "Edge response" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-1"
              >
                <div className="text-3xl md:text-5xl font-display font-black text-white">
                  <Editable cmsKey={`${stat.key}.val`} defaultValue={stat.defVal}>
                    {(val) => <span>{val}</span>}
                  </Editable>
                </div>
                <div className="text-[11px] font-black text-accent uppercase tracking-[0.2em] flex items-center justify-center lg:justify-start gap-3">
                  <img src={t("global.logo.small", "https://i.ibb.co/JRzZYn3S/2.png")} className="w-4 h-4 opacity-80" alt="" />
                  <Editable cmsKey={`${stat.key}.lab`} defaultValue={stat.defLab}>
                    {(val) => <span>{val}</span>}
                  </Editable>
                </div>
              </motion.div>
            ))}
         </div>
      </section>

      <CTA onStartTrial={() => setIsLeadFormOpen(true)} />

      <LeadForm isOpen={isLeadFormOpen} onClose={() => setIsLeadFormOpen(false)} />
    </>
  );
}
