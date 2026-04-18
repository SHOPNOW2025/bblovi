import React from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-brand flex flex-col items-center justify-center">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 grid-lines pointer-events-none z-0" />
      <div className="fixed -top-[20%] -right-[10%] w-[60%] h-[60%] glow-glow pointer-events-none z-0 opacity-40 blur-[100px]" />
      <div className="fixed -bottom-[20%] -left-[10%] w-[50%] h-[50%] glow-glow pointer-events-none z-0 opacity-20 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center gap-8"
      >
        <div className="w-24 h-24 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.2)]">
          <img 
            src="https://i.ibb.co/JRzZYn3S/2.png" 
            alt="Bloovi Logo" 
            className="w-16 h-16 object-contain animate-pulse"
          />
        </div>

        <div className="flex flex-col items-center gap-3">
           <h1 className="font-display font-black text-3xl tracking-tighter text-white uppercase italic">Bloovi Media</h1>
           <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-accent"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
              />
           </div>
           <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em] animate-pulse">Initializing Intelligence...</p>
        </div>
      </motion.div>
    </div>
  );
};
