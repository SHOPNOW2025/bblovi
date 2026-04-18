/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useContent } from "../hooks/useContent";
import { collection, doc, setDoc, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Edit2, Save, X, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { uploadImage } from "../services/imageService";
import { createPortal } from "react-dom";

interface EditableProps {
  cmsKey: string;
  children: (value: string | null, color?: string) => React.ReactNode;
  defaultValue?: string;
  className?: string;
  type?: "text" | "image" | "rich-text";
}

export const Editable: React.FC<EditableProps> = ({ cmsKey, children, defaultValue = "", className = "", type = "text" }) => {
  const { profile, editMode } = useAuth();
  const { getMetadata } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [loading, setLoading] = useState(false);
  
  const isAdmin = profile?.role === "admin";
  const showEditIcon = isAdmin && editMode;
  const content = getMetadata(cmsKey);
  const currentValue = (content?.value || defaultValue) || null;
  const currentColor = content?.color || "#ffffff";

  const handleStartEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setValue(currentValue || "");
    setColor(currentColor);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (content?.id) {
        await setDoc(doc(db, "siteContent", content.id), { 
          value, 
          color,
          updatedAt: new Date().toISOString() 
        }, { merge: true });
      } else {
        const contentRef = collection(db, "siteContent");
        await addDoc(contentRef, {
          key: cmsKey,
          value,
          color,
          type: type,
          updatedAt: new Date().toISOString()
        });
      }
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Save failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const url = await uploadImage(file);
      if (content?.id) {
        await setDoc(doc(db, "siteContent", content.id), { 
          value: url, 
          updatedAt: new Date().toISOString() 
        }, { merge: true });
      } else {
        await addDoc(collection(db, "siteContent"), {
          key: cmsKey,
          value: url,
          type: "image",
          updatedAt: new Date().toISOString()
        });
      }
      setIsEditing(false);
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <span className={`relative group/editable ${type === 'image' ? 'block w-full' : 'inline-block'} ${className}`}>
      {children(currentValue, currentColor)}
      
      {showEditIcon && !isEditing && (
        <span 
          role="button"
          tabIndex={0}
          onClick={handleStartEdit}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleStartEdit(e as any); }}
          className="absolute top-2 right-2 p-2 bg-accent text-white rounded-full shadow-lg opacity-0 group-hover/editable:opacity-100 transition-opacity z-[60] scale-75 hover:scale-100 cursor-pointer flex items-center justify-center border border-white/20"
          title={`Edit ${cmsKey}`}
        >
          <Edit2 size={12} />
        </span>
      )}

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isEditing && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
                onClick={() => !loading && setIsEditing(false)}
              />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-[#0F1115] border border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   {type === 'image' ? <ImageIcon size={100} /> : <Edit2 size={100} />}
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-display font-black text-white italic">Edit Content</h3>
                      <p className="text-[10px] font-black text-accent uppercase tracking-widest">{cmsKey}</p>
                    </div>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="p-2 text-text-dim hover:text-white transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {type === "image" ? (
                    <div className="space-y-6">
                      <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-white/5 relative group">
                        {value ? (
                          <img src={value} alt="Preview" className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-dim/20">
                            <ImageIcon size={48} />
                          </div>
                        )}
                        {loading && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                            <Loader2 className="animate-spin text-accent" size={32} />
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-text-dim">Global URL</label>
                          <input 
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-accent transition-all animate-none ring-0 outline-none"
                          />
                        </div>
                        
                        <div className="relative">
                          <label className="flex items-center justify-center gap-3 bg-accent text-white py-5 rounded-xl font-black uppercase tracking-widest cursor-pointer hover:shadow-xl hover:shadow-accent/20 transition-all active:scale-95">
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                            {loading ? "Processing..." : "Upload New Image"}
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*" 
                              onChange={handleImageUpload}
                              disabled={loading}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                       <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-text-dim">Content Text</label>
                            <div className="flex items-center gap-2">
                               <label className="text-xs font-bold text-text-dim">Color</label>
                               <input 
                                 type="color" 
                                 value={color}
                                 onChange={(e) => setColor(e.target.value)}
                                 className="w-10 h-10 border-none bg-transparent cursor-pointer rounded-lg overflow-hidden"
                               />
                            </div>
                         </div>
                         <textarea 
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="w-full h-64 bg-white/5 border border-white/10 rounded-xl p-6 text-white text-lg leading-relaxed focus:border-accent transition-all animate-none ring-0 outline-none"
                         />
                       </div>
                       <button 
                          onClick={handleSave}
                          disabled={loading}
                          className="w-full bg-accent text-white py-5 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-accent/20 transition-all active:scale-95 disabled:opacity-50"
                       >
                          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                          {loading ? "Saving..." : "Save Changes"}
                       </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </span>
  );
};
