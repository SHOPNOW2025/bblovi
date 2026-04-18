/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

export default function Login() {
  const { user, loginWithGoogle, loginWithEmail, signUpWithEmail, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      if (mode === "login") {
        await loginWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Please login.");
        setMode("login");
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else if (err.code === 'auth/invalid-credential') {
        setError("Invalid credentials. If you haven't created an account yet, use the 'Create Account' option below.");
      } else {
        setError(mode === "login" ? "Login failed. Check your credentials." : "Sign up failed.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="pt-32 pb-48 px-6 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bento-card p-12 space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center">
             <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                <LogIn size={32} />
             </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-black text-white">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-text-dim text-sm">
              {mode === "login" ? "Login with your account" : "Initialize your admin account"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                 <input 
                   type="email" 
                   required
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="admin@bloovi.media"
                   className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-accent transition-all ring-0 outline-none"
                 />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                 <input 
                   type="password" 
                   required
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="••••••••"
                   className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-accent transition-all ring-0 outline-none"
                 />
              </div>
           </div>

           {error && (
             <p className="text-red-400 text-xs font-bold text-center leading-relaxed">{error}</p>
           )}

           <button 
             type="submit"
             disabled={isSubmitting}
             className="w-full bg-accent text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-accent/20 hover:shadow-accent/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
           >
             {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
             {isSubmitting ? (mode === "login" ? "Signing In..." : "Creating...") : (mode === "login" ? "Login" : "Create Account")}
           </button>

           <div className="text-center">
             <button 
               type="button"
               onClick={() => setMode(mode === "login" ? "signup" : "login")}
               className="text-text-dim hover:text-accent text-[11px] font-black uppercase tracking-widest transition-colors"
             >
               {mode === "login" ? "Need to create an account? Sign Up" : "Already have an account? Login"}
             </button>
           </div>
        </form>

        <div className="relative">
           <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
           <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black"><span className="bg-brand px-4 text-text-dim">Or continue with</span></div>
        </div>

        <button 
          onClick={loginWithGoogle}
          className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="" />
          Google Account
        </button>

        <p className="text-[10px] text-text-dim text-center uppercase tracking-widest font-black pt-4">
           bloovi Media &copy; 2025
        </p>
      </motion.div>
    </div>
  );
}
