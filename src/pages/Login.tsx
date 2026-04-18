/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const { user, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (loading) return null;

  return (
    <div className="pt-32 pb-48 px-6 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bento-card p-12 text-center space-y-8"
      >
        <div className="flex justify-center">
           <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <LogIn size={32} />
           </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-black text-white">Welcome Back</h1>
          <p className="text-text-dim">Login to access your dashboard</p>
        </div>

        <button 
          onClick={loginWithGoogle}
          className="w-full bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all active:scale-95"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="" />
          Sign in with Google
        </button>

        <p className="text-[10px] text-text-dim uppercase tracking-widest font-black">
          Company accounts are managed by BLOOVI Admins
        </p>
      </motion.div>
    </div>
  );
}
