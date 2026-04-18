/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useContent } from "../hooks/useContent";
import { Editable } from "../components/Editable";

export default function Pricing() {
  const { t } = useContent();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "pricingPlans"), orderBy("order"));
    const unsub = onSnapshot(q, (snap) => {
      const plansData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPlans(plansData);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <div className="pt-24 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 space-y-4 text-center">
          <Editable cmsKey="pricing.hero.title">
            {(val) => (
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hero-text text-white leading-tight"
              >
                {val || "Flexible Pricing."}
              </motion.h1>
            )}
          </Editable>
          <Editable cmsKey="pricing.hero.desc">
            {(val) => (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-text-dim max-w-xl mx-auto"
              >
                {val || "Choose a plan that scales with your growth. No hidden fees."}
              </motion.p>
            )}
          </Editable>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
             <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div 
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-10 rounded-[2.5rem] border ${plan.isPopular ? "border-accent bg-accent/5 shadow-[0_0_50px_rgba(59,130,246,0.1)]" : "border-white/10 bg-glass"} relative overflow-hidden`}
              >
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-text-dim text-sm mb-8">{plan.desc || t("pricing.plan.defaultDesc", "Optimized performance and support.")}</p>
                
                <div className="mb-8 items-baseline flex gap-1">
                  <span className="text-5xl font-display font-black text-white">{plan.price}</span>
                  {plan.billing && <span className="text-text-dim text-sm">{plan.billing}</span>}
                </div>

                <ul className="space-y-4 mb-10">
                  {plan.features?.map((f: string) => (
                    <li key={f} className="flex gap-3 text-sm text-text-dim items-center font-medium">
                      <Check size={16} className="text-accent" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.isPopular ? "bg-accent text-white shadow-xl shadow-accent/20" : "bg-white/5 border border-white/10 text-white hover:bg-white/10"}`}>
                  Choose {plan.name}
                </button>

                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-accent text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-bl-2xl">
                     Most Popular
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
