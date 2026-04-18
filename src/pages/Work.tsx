/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ArrowUpRight, Plus, Trash2 } from "lucide-react";
import { useContent } from "../hooks/useContent";
import { Editable } from "../components/Editable";
import { useState, useEffect } from "react";
import { collection, query, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

export default function Work() {
  const { t } = useContent();
  const { profile, editMode } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    const q = query(collection(db, "projects"));
    return onSnapshot(q, (snap) => {
      setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const handleAddProject = async () => {
    await addDoc(collection(db, "projects"), {
      title: "New Project",
      category: "Digital Strategy",
      desc: "Detailed project description goes here.",
      stats: "+45% Growth",
      image: "https://picsum.photos/seed/project/1200/800",
      order: projects.length
    });
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await deleteDoc(doc(db, "projects", id));
    }
  };

  return (
    <div className="pt-24 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 space-y-4 text-center relative group/hero">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-1.5 rounded-full text-accent shadow-[0_0_20px_rgba(59,130,246,0.1)]"
          >
            <img src={t("global.logo.small", "https://i.ibb.co/JRzZYn3S/2.png")} className="w-3 h-3 object-contain" alt="" />
            <Editable cmsKey="work.hero.badge">
              {(val, color) => <span className="text-[10px] font-black tracking-widest uppercase text-accent" style={{ color }}>{val || "Our Portfolio"}</span>}
            </Editable>
          </motion.div>
          
          {isAdmin && editMode && (
             <button 
               onClick={handleAddProject}
               className="absolute -top-10 left-1/2 -translate-x-1/2 bg-accent text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-xl animate-pulse hover:scale-105 transition-transform"
             >
               <Plus size={14} className="inline mr-2" /> Add Project
             </button>
          )}

          <Editable cmsKey="work.hero.title">
            {(val, color) => (
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="hero-text text-white"
                style={{ color }}
              >
                {val || "Our Work."}
              </motion.h1>
            )}
          </Editable>
          <Editable cmsKey="work.hero.desc">
            {(val, color) => (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-text-dim max-w-2xl mx-auto"
                style={{ color }}
              >
                {val || "We help ambitious brands scale through surgical precision and data-driven creativity."}
              </motion.p>
            )}
          </Editable>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((p, i) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-[2.5rem] bg-glass border border-white/10"
            >
              <div className="aspect-video overflow-hidden relative">
                <Editable cmsKey={`project.${p.id}.image`} type="image" className="h-full">
                  {(val) => (
                    <img 
                      src={val || p.image} 
                      alt="Project" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                  )}
                </Editable>

                {isAdmin && editMode && (
                   <button 
                     onClick={() => handleDeleteProject(p.id)}
                     className="absolute top-4 left-4 z-[70] bg-red-500/80 backdrop-blur-md text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                   >
                     <Trash2 size={16} />
                   </button>
                )}
              </div>
              
              <div className="p-10 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <Editable cmsKey={`project.${p.id}.category`}>
                      {(val, color) => <span className="text-xs font-black text-accent uppercase tracking-widest mb-2 block" style={{ color }}>{val || p.category}</span>}
                    </Editable>
                    <Editable cmsKey={`project.${p.id}.title`}>
                      {(val, color) => <h3 className="text-3xl font-display font-bold text-white group-hover:text-accent transition-colors" style={{ color }}>{val || p.title}</h3>}
                    </Editable>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all shrink-0">
                    <ArrowUpRight size={20} />
                  </div>
                </div>
                <Editable cmsKey={`project.${p.id}.desc`}>
                  {(val, color) => <p className="text-text-dim leading-relaxed" style={{ color }}>{val || p.desc}</p>}
                </Editable>
                <div className="pt-4 flex items-center gap-4">
                  <Editable cmsKey={`project.${p.id}.stats`}>
                    {(val, color) => (
                      <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-accent font-bold text-sm" style={{ color }}>
                        {val || p.stats}
                      </div>
                    )}
                  </Editable>
                </div>
              </div>

              {/* Logo Watermark */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                <img src={t("global.logo.small", "https://i.ibb.co/JRzZYn3S/2.png")} className="w-16 h-16 object-contain" alt="" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
