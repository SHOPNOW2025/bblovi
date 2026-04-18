import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, User, Mail, Building2, Phone, FileText, Loader2 } from "lucide-react";

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadForm = ({ isOpen, onClose }: LeadFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    info: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const whatsappNumber = "962793185557";
    const message = `*New Free Trial Request*%0A%0A` +
      `*Name:* ${formData.name}%0A` +
      `*Email:* ${formData.email}%0A` +
      `*Company:* ${formData.company}%0A` +
      `*Phone:* ${formData.phone}%0A` +
      `*Details:* ${formData.info}`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    // Simulate a small delay for UX
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      setLoading(false);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand/80 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-linear-to-b from-white/10 to-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent/20 blur-[100px] -z-10" />

            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-text-dim hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-display font-black text-white tracking-tight mb-2">Start Free Trial</h2>
              <p className="text-text-dim">Fill in your details to get started with Bloovi.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-accent transition-colors" size={18} />
                  <input 
                    required
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-hidden focus:border-accent/50 focus:bg-white/10 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-accent transition-colors" size={18} />
                    <input 
                      required
                      type="email"
                      placeholder="Email Address"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-hidden focus:border-accent/50 focus:bg-white/10 transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-accent transition-colors" size={18} />
                    <input 
                      required
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-hidden focus:border-accent/50 focus:bg-white/10 transition-all"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-accent transition-colors" size={18} />
                  <input 
                    required
                    type="text"
                    placeholder="Company Name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-hidden focus:border-accent/50 focus:bg-white/10 transition-all"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                  />
                </div>

                <div className="relative group">
                  <FileText className="absolute left-4 top-4 text-text-dim group-focus-within:text-accent transition-colors" size={18} />
                  <textarea 
                    required
                    rows={4}
                    placeholder="Tell us about your needs..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-hidden focus:border-accent/50 focus:bg-white/10 transition-all resize-none"
                    value={formData.info}
                    onChange={(e) => setFormData({...formData, info: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-white py-5 rounded-xl text-lg font-bold flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-xl shadow-accent/20"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Send size={20} />
                    Send via WhatsApp
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
