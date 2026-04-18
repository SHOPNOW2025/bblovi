/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import { Activity, Layout, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CompanyPortal() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role === "admin") {
      navigate("/admin");
      return;
    }

    if (!profile?.companyId) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, "projects"), where("companyId", "==", profile.companyId));
    const unsub = onSnapshot(q, (snap) => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsub();
  }, [profile]);

  if (loading) return null;

  if (!profile?.companyId) {
    return (
      <div className="pt-32 pb-48 text-center px-6">
        <h1 className="text-3xl font-display font-black text-white mb-4">Account Not Linked</h1>
        <p className="text-text-dim max-w-md mx-auto leading-relaxed">
          Your account is not currently linked to a company portal. Please contact the BLOOVI support team to activate your access.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-32 px-6 max-w-7xl mx-auto space-y-12">
      <div className="space-y-4">
        <h1 className="text-5xl font-display font-black text-white">Client Portal</h1>
        <p className="text-xl text-text-dim">Tracking your growth and operational milestones.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {projects.map(p => (
          <motion.div 
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bento-card p-10 space-y-8 relative overflow-hidden"
          >
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-accent uppercase tracking-widest">{p.status}</span>
                <h4 className="text-3xl font-bold text-white tracking-tight">{p.title}</h4>
              </div>
              <div className="p-3 bg-accent/10 text-accent rounded-2xl">
                <Activity size={24} />
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between text-sm font-black text-white uppercase tracking-widest">
                <span>Implementation Progress</span>
                <span className="text-accent">{p.progress}%</span>
              </div>
              <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${p.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-accent rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                />
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-3 relative z-10">
               <div className="flex items-center gap-2 text-[10px] font-black text-white/50 uppercase tracking-widest">
                  <Info size={14} /> Project Intelligence
               </div>
               <p className="text-text-dim text-sm leading-relaxed">{p.description}</p>
            </div>

            <div className="absolute -bottom-10 -right-10 opacity-5">
               <Layout size={200} className="text-white" />
            </div>
          </motion.div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="bento-card p-20 text-center space-y-4">
          <p className="text-text-dim italic">No active projects found correctly linked to your portal.</p>
          <button className="text-accent font-bold hover:underline">Contact Account Manager</button>
        </div>
      )}
    </div>
  );
}
