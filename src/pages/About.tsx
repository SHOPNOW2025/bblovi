/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { useContent } from "../hooks/useContent";
import { Editable } from "../components/Editable";

export default function About() {
  const { t } = useContent();

  return (
    <div className="pt-24 pb-32 px-6">
      <div className="max-w-4xl mx-auto space-y-24">
        <div className="space-y-8 text-center md:text-left">
          <Editable cmsKey="about.hero.title">
            {(val) => (
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hero-text text-white"
              >
                {val || "We are Bloovi."}
              </motion.h1>
            )}
          </Editable>
          <Editable cmsKey="about.hero.desc">
            {(val) => (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl md:text-2xl text-text-dim leading-relaxed font-light"
              >
                {val || "Founded in December 2021, BLOOVI LTD. was born from a simple mission: to empower modern brands with surgical precision in their digital marketing efforts."}
              </motion.p>
            )}
          </Editable>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
           <div className="aspect-square bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center p-20 shadow-2xl relative group overflow-hidden">
              <Editable cmsKey="about.identity.image" type="image">
                {(val) => (
                  <img 
                    src={val || "https://i.ibb.co/JRzZYn3S/2.png"} 
                    className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-700" 
                    alt="Bloovi Logo" 
                  />
                )}
              </Editable>
              <div className="absolute inset-0 bg-accent/20 blur-[100px] opacity-20" />
           </div>
           
           <div className="space-y-8">
              <div className="space-y-4">
                 <Editable cmsKey="about.identity.title">
                    {(val) => <h2 className="text-3xl font-display font-bold text-white tracking-tight">{val || "Our Identity"}</h2>}
                 </Editable>
                 <Editable cmsKey="about.identity.desc">
                    {(val) => (
                      <p className="text-text-dim leading-relaxed">
                        {val || "Based in Manchester, United Kingdom, we operate at the intersection of high-end data analytics and creative storytelling. We believe that growth shouldn't be a guessing game."}
                      </p>
                    )}
                 </Editable>
              </div>
              <div className="space-y-4">
                 <Editable cmsKey="about.vision.title">
                    {(val) => <h2 className="text-3xl font-display font-bold text-white tracking-tight">{val || "The Vision"}</h2>}
                 </Editable>
                 <Editable cmsKey="about.vision.desc">
                    {(val) => (
                      <p className="text-text-dim leading-relaxed">
                        {val || "To build the world's most intelligent operating system for brand growth—one that predicts, automates, and executes with unmatched accuracy."}
                      </p>
                    )}
                 </Editable>
              </div>
           </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 md:p-20 text-center space-y-8">
           <Editable cmsKey="about.stats.title">
              {(val) => <h3 className="text-2xl font-bold text-white uppercase tracking-widest text-xs opacity-50">{val || "Global Statistics"}</h3>}
           </Editable>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { key: "about.stat1", defVal: "2021", defLab: "Founded" },
                { key: "about.stat2", defVal: "50+", defLab: "Experts" },
                { key: "about.stat3", defVal: "1B+", defLab: "Data points" },
                { key: "about.stat4", defVal: "24/7", defLab: "Support" }
              ].map(s => (
                <div key={s.key} className="space-y-2">
                   <Editable cmsKey={`${s.key}.val`} defaultValue={s.defVal}>
                     {(val) => <div className="text-4xl font-display font-black text-white">{val}</div>}
                   </Editable>
                   <Editable cmsKey={`${s.key}.lab`} defaultValue={s.defLab}>
                     {(val) => <div className="text-[10px] font-black text-accent uppercase tracking-widest">{val}</div>}
                   </Editable>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
