/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { 
  Menu,
  X,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Building2
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { useContent } from "../hooks/useContent";
import { Editable } from "./Editable";

const Logo = () => {
  const { t } = useContent();
  return (
    <Link to="/" className="flex items-center gap-4 group cursor-pointer">
      <div className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.2)] group-hover:border-accent/40 transition-all duration-500 group-hover:shadow-accent/30 group-hover:bg-accent/5">
        <Editable cmsKey="global.logo" type="image">
          {(val) => (
            <img 
              src={val || "https://i.ibb.co/JRzZYn3S/2.png"} 
              alt="Bloovi Logo" 
              className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          )}
        </Editable>
      </div>
      <Editable cmsKey="global.site.name">
        {(val, color) => <span className="font-display font-black text-3xl tracking-tighter text-white" style={{ color }}>{val || "Bloovi"}</span>}
      </Editable>
    </Link>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, logout, editMode, setEditMode } = useAuth();

  const navLinks = [
    { name: "Platform", path: "/" },
    { name: "Our Work", path: "/work" },
    { name: "Pricing", path: "/pricing" },
    { name: "About", path: "/about" }
  ];

  return (
    <nav className="glass-nav border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Logo />
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path} 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${isActive ? "text-white" : "text-text-dim hover:text-white"}`
              }
            >
              {item.name}
            </NavLink>
          ))}
          
          <div className="flex items-center gap-4">
            {user && profile?.role === "admin" && (
              <button 
                onClick={() => setEditMode(!editMode)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  editMode ? "bg-accent text-white shadow-lg shadow-accent/40" : "bg-white/5 text-text-dim hover:bg-white/10"
                }`}
              >
                {editMode ? "Edit Mode: ON" : "Edit Mode: OFF"}
              </button>
            )}
            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  to={profile?.role === "admin" ? "/admin" : "/portal"}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-accent hover:border-accent/50 transition-all"
                  title={profile?.role === "admin" ? "Admin Hub" : "Client Portal"}
                >
                  {profile?.role === "admin" ? <ShieldCheck size={20} /> : <Building2 size={20} />}
                </Link>
                <button 
                  onClick={() => logout()}
                  className="p-2 text-text-dim hover:text-red-500 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="bg-white text-black px-6 py-2.5 rounded-lg text-sm font-bold hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all active:scale-95 flex items-center gap-2"
              >
                <UserIcon size={16} /> Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 left-0 w-full bg-brand border-b border-white/10 p-6 flex flex-col gap-4 md:hidden shadow-2xl z-50"
          >
            {navLinks.map((item) => (
              <NavLink 
                key={item.name} 
                to={item.path} 
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => 
                  `text-lg font-medium ${isActive ? "text-white" : "text-text-dim"}`
                }
              >
                {item.name}
              </NavLink>
            ))}
            {!user && (
              <Link to="/login" onClick={() => setIsOpen(false)} className="bg-white text-black w-full py-4 rounded-xl font-bold text-center">
                Sign In
              </Link>
            )}
            {user && (
              <>
                <Link to={profile?.role === "admin" ? "/admin" : "/portal"} onClick={() => setIsOpen(false)} className="bg-accent text-white w-full py-4 rounded-xl font-bold text-center">
                  {profile?.role === "admin" ? "Admin Hub" : "Client Portal"}
                </Link>
                <button onClick={() => { logout(); setIsOpen(false); }} className="text-red-500 font-bold py-2">
                  Logout
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="pt-24 pb-12 px-6 border-t border-white/10 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 mb-20">
        <div className="col-span-2 space-y-8">
          <Logo />
          <div className="space-y-4">
            <Editable cmsKey="footer.tagline">
              {(val, color) => (
                <p className="text-text-dim text-sm max-w-xs leading-relaxed" style={{ color }}>
                  {val || "The modern standard for digital marketing. Built with precision for the world's fastest growing teams."}
                </p>
              )}
            </Editable>
            <div className="pt-4 space-y-2 border-t border-white/5 max-w-xs">
              <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Registered Office</p>
              <Editable cmsKey="footer.address">
                {(val, color) => (
                  <p className="text-[11px] text-text-dim leading-relaxed" style={{ color }}>
                    {val || "BLOOVI LTD. (Co. No. 13808042) Unit 7 Initial Business Center, Wilson Business Park, Manchester, United Kingdom, M40 8WN"}
                  </p>
                )}
              </Editable>
              <p className="text-[10px] text-text-dim/60 italic">Established Dec 2021</p>
            </div>
          </div>
        </div>
        
        {[
          { title: "Product", links: ["Platform", "Features", "Pricing", "Security"] },
          { title: "Company", links: ["About", "Our Work", "Careers", "Contact"] },
          { title: "Resources", links: ["Community", "Documentation", "API", "Guides"] }
        ].map((section) => (
          <div key={section.title}>
            <h5 className="font-bold text-white mb-6 uppercase text-[10px] tracking-widest">{section.title}</h5>
            <ul className="space-y-4 text-xs font-semibold text-text-dim">
              {section.links.map(link => (
                <li key={link}><a href="#" className="hover:text-white transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5 text-[10px] font-bold text-text-dim uppercase tracking-widest">
         <p>© 2026 BLOOVI LTD. All rights reserved.</p>
         <div className="flex gap-8">
           <a href="#">Security</a>
           <a href="#">Privacy</a>
           <a href="#">Legal</a>
         </div>
      </div>
    </footer>
  );
};

export default function Layout() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-brand relative overflow-hidden">
        {/* Background Atmosphere */}
        <div className="fixed inset-0 grid-lines pointer-events-none z-0" />
        <div className="fixed -top-[20%] -right-[10%] w-[60%] h-[60%] glow-glow pointer-events-none z-0 opacity-40 blur-[100px]" />
        <div className="fixed -bottom-[20%] -left-[10%] w-[50%] h-[50%] glow-glow pointer-events-none z-0 opacity-20 blur-[100px]" />
        
        <Navbar />
        <main className="relative z-10">
          <Outlet />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
