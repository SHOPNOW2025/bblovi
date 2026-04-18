/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, FormEvent } from "react";
import { collection, query, onSnapshot, doc, setDoc, deleteDoc, addDoc, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Settings, 
  Users, 
  FolderKanban, 
  Upload,
  CreditCard,
  Image as ImageIcon,
  ChevronRight
} from "lucide-react";
import { uploadImage } from "../services/imageService";

export default function AdminDashboard() {
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"cms" | "pricing" | "companies" | "projects">("cms");
  const [content, setContent] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);

  // Site Content State
  const [editKey, setEditKey] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");
  const [uploading, setUploading] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newType, setNewType] = useState<"text" | "image" | "rich-text">("text");

  useEffect(() => {
    if (!authLoading && profile?.role !== "admin") {
      navigate("/");
    }
  }, [profile, authLoading, navigate]);

  useEffect(() => {
    if (profile?.role !== "admin") return;
    
    const qCms = query(collection(db, "siteContent"));
    const unsubCms = onSnapshot(qCms, (snap) => {
      setContent(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qComp = query(collection(db, "companies"));
    const unsubComp = onSnapshot(qComp, (snap) => {
      setCompanies(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qProj = query(collection(db, "projects"));
    const unsubProj = onSnapshot(qProj, (snap) => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qPricing = query(collection(db, "pricingPlans"), orderBy("order"));
    const unsubPricing = onSnapshot(qPricing, (snap) => {
      setPricingPlans(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubCms(); unsubComp(); unsubProj(); unsubPricing(); };
  }, [profile]);

  const saveContent = async (id: string, value: string) => {
    await setDoc(doc(db, "siteContent", id), { value, updatedAt: new Date().toISOString() }, { merge: true });
    setEditKey(null);
  };

  const addContentKey = async () => {
    if (!newKey) return;
    await addDoc(collection(db, "siteContent"), { 
      key: newKey, 
      value: newType === "image" ? "https://picsum.photos/seed/bloovi/800/600" : "Sample Text",
      type: newType,
      updatedAt: new Date().toISOString()
    });
    setNewKey("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      await saveContent(id, url);
    } catch (err) {
      alert("Upload failed. Check API key or connection.");
    } finally {
      setUploading(false);
    }
  };

  const addPricingPlan = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const price = (form.elements.namedItem("price") as HTMLInputElement).value;
    const features = (form.elements.namedItem("features") as HTMLTextAreaElement).value.split("\n").filter(f => f.trim());
    const order = parseInt((form.elements.namedItem("order") as HTMLInputElement).value);
    
    await addDoc(collection(db, "pricingPlans"), { 
      name, 
      price, 
      features, 
      order, 
      isPopular: (form.elements.namedItem("isPopular") as HTMLInputElement).checked,
      billing: "/month"
    });
    form.reset();
  };

  const addCompany = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    await addDoc(collection(db, "companies"), { name, email, createdAt: new Date().toISOString() });
    form.reset();
  };

  const addProject = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const companyId = (form.elements.namedItem("companyId") as HTMLSelectElement).value;
    const desc = (form.elements.namedItem("desc") as HTMLTextAreaElement).value;
    await addDoc(collection(db, "projects"), { 
      title, 
      companyId, 
      description: desc, 
      progress: 0, 
      status: "Initializing", 
      updatedAt: new Date().toISOString() 
    });
    form.reset();
  };

  const updateProgress = async (id: string, progress: number) => {
    await setDoc(doc(db, "projects", id), { progress, updatedAt: new Date().toISOString() }, { merge: true });
  };

  return (
    <div className="pt-24 pb-32 px-6 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/10 pb-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-display font-black text-white tracking-tighter italic">Bloovi Control</h1>
          <p className="text-text-dim uppercase text-[10px] font-black tracking-widest">Master Administration Interface</p>
        </div>
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-3xl overflow-x-auto whitespace-nowrap scrollbar-hide">
          {[
            { id: "cms", label: "CMS", icon: Settings },
            { id: "pricing", label: "Pricing", icon: CreditCard },
            { id: "companies", label: "Companies", icon: Users },
            { id: "projects", label: "Projects", icon: FolderKanban }
          ].map(t => (
            <button 
              key={t.id}
              onClick={() => setTab(t.id as any)} 
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 ${tab === t.id ? "bg-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]" : "text-text-dim hover:text-white"}`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "cms" && (
        <div className="space-y-12">
          {/* New Content Key Form */}
          <div className="bento-card p-10 flex flex-wrap gap-6 items-end">
             <div className="space-y-2 flex-1 min-w-[300px]">
                <label className="text-[10px] font-black uppercase text-text-dim ml-1">New Content Identifier (e.g., home.hero.title)</label>
                <input 
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="page.section.element"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-accent transition-all"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-text-dim ml-1">Content Type</label>
                <select 
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 text-white appearance-none min-w-[150px]"
                >
                  <option value="text" className="bg-brand">Text</option>
                  <option value="image" className="bg-brand">Image</option>
                   <option value="rich-text" className="bg-brand">Rich Text</option>
                </select>
             </div>
             <button 
               onClick={addContentKey}
               className="bg-white text-black px-10 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-accent hover:text-white transition-all group active:scale-95 shadow-xl shadow-white/10"
             >
                <Plus size={18} /> Add Entry
             </button>
          </div>

          <div className="grid gap-6">
            {content.map(item => (
              <div key={item.id} className="bento-card p-8 group relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-12 relative z-10">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${item.type === 'image' ? 'bg-purple-500/10 text-purple-500' : 'bg-accent/10 text-accent'}`}>
                        {item.type === 'image' ? <ImageIcon size={14} /> : <Edit2 size={14} />}
                      </div>
                      <span className="text-xs font-black text-white/50 uppercase tracking-widest">{item.key}</span>
                    </div>

                    {editKey === item.id ? (
                      item.type === "image" ? (
                        <div className="space-y-4">
                           <input 
                              type="text"
                              value={editVal}
                              onChange={(e) => setEditVal(e.target.value)}
                              className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white text-sm"
                              placeholder="Image URL"
                           />
                           <div className="flex items-center gap-4">
                              <label className="flex-1 bg-accent/10 border border-accent/20 rounded-xl p-4 text-accent text-sm font-bold flex items-center justify-center gap-3 cursor-pointer hover:bg-accent/20 transition-all">
                                 <Plus size={18} /> {uploading ? "Processing..." : "Upload from Computer"}
                                 <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={(e) => handleImageUpload(e, item.id)}
                                    disabled={uploading}
                                 />
                              </label>
                           </div>
                        </div>
                      ) : (
                        <textarea 
                          value={editVal}
                          onChange={(e) => setEditVal(e.target.value)}
                          className="w-full h-32 bg-black/30 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-accent transition-all ring-0 outline-none"
                        />
                      )
                    ) : (
                      item.type === "image" ? (
                        <div className="relative group/img w-full max-w-sm rounded-xl overflow-hidden border border-white/5">
                           <img src={item.value} alt={item.key} className="w-full aspect-video object-cover transition-transform duration-700 group-hover/img:scale-110" />
                           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                              <button onClick={() => { setEditKey(item.id); setEditVal(item.value); }} className="bg-white text-black px-6 py-2 rounded-lg font-bold">Change Image</button>
                           </div>
                        </div>
                      ) : (
                        <p className="text-white text-lg font-medium leading-relaxed">{item.value}</p>
                      )
                    )}
                  </div>

                  <div className="flex gap-2">
                    {editKey === item.id ? (
                      <>
                        <button onClick={() => saveContent(item.id, editVal)} className="p-3 bg-green-500/20 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-lg shadow-green-500/10"><Save size={20} /></button>
                        <button onClick={() => setEditKey(null)} className="p-3 bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"><X size={20} /></button>
                      </>
                    ) : item.type !== 'image' && (
                      <button onClick={() => { setEditKey(item.id); setEditVal(item.value); }} className="p-3 bg-white/5 text-text-dim hover:text-white rounded-xl transition-all border border-white/5 hover:border-white/20"><Edit2 size={20} /></button>
                    )}
                    <button onClick={() => deleteDoc(doc(db, "siteContent", item.id))} className="p-3 bg-white/5 text-white/20 hover:text-red-500 transition-all rounded-xl opacity-20 group-hover:opacity-100"><Trash2 size={20} /></button>
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 text-white/5 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-700">
                    {item.type === 'image' ? <ImageIcon size={200} /> : <ChevronRight size={200} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "pricing" && (
        <div className="grid lg:grid-cols-3 gap-12">
          <form onSubmit={addPricingPlan} className="bento-card p-10 space-y-8 h-fit sticky top-32 border border-accent/20">
            <div className="space-y-2">
              <h3 className="text-3xl font-display font-black text-white">New Tier</h3>
              <p className="text-[10px] font-black text-accent uppercase tracking-widest">Pricing Architecture</p>
            </div>
            <div className="space-y-5">
              <input name="name" placeholder="Plan Name (e.g., Enterprise)" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white" required />
              <input name="price" placeholder="Price (e.g., $199)" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white" required />
              <textarea name="features" placeholder="Features (One per line)" className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white" required />
              <input name="order" type="number" placeholder="Display Order (1, 2, 3)" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white" required />
              <label className="flex items-center gap-3 text-white font-bold cursor-pointer bg-white/5 p-4 rounded-xl border border-white/10 hover:border-accent group">
                 <input type="checkbox" name="isPopular" className="w-5 h-5 accent-accent" />
                 Is Popular / Highlighted?
              </label>
            </div>
            <button className="w-full bg-accent text-white py-5 rounded-xl font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all">Add Plan</button>
          </form>

          <div className="lg:col-span-2 grid gap-6">
            {pricingPlans.map(plan => (
              <div key={plan.id} className={`bento-card p-8 flex justify-between items-center group relative overflow-hidden ${plan.isPopular ? 'border border-accent/30' : ''}`}>
                 <div className="space-y-4 flex-1">
                   <div className="flex items-center gap-4">
                      <h4 className="text-2xl font-black text-white">{plan.name}</h4>
                      {plan.isPopular && <span className="bg-accent text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">Most Popular</span>}
                   </div>
                   <div className="flex items-baseline gap-1 text-accent">
                      <span className="text-3xl font-black tracking-tighter">{plan.price}</span>
                      <span className="text-xs font-bold opacity-50">/month</span>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {plan.features?.map((f: string, i: number) => (
                        <span key={i} className="text-[10px] font-bold bg-white/5 border border-white/5 px-3 py-1 rounded-lg text-text-dim">{f}</span>
                      ))}
                   </div>
                 </div>
                 <button onClick={() => deleteDoc(doc(db, "pricingPlans", plan.id))} className="opacity-0 group-hover:opacity-100 p-3 bg-red-500/10 text-red-500 rounded-xl transition-all hover:bg-red-500 hover:text-white shadow-xl shadow-red-500/10">
                   <Trash2 size={20} />
                 </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "companies" && (
        <div className="grid lg:grid-cols-3 gap-12">
          <form onSubmit={addCompany} className="bento-card p-10 space-y-8 h-fit sticky top-32">
            <h3 className="text-3xl font-display font-black text-white">Register Brand</h3>
            <div className="space-y-4">
              <input name="name" placeholder="Company Name" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white" required />
              <input name="email" placeholder="Contact Email" type="email" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white" required />
            </div>
            <button className="w-full bg-accent text-white py-5 rounded-xl font-bold hover:shadow-lg transition-all">Create Company</button>
          </form>

          <div className="lg:col-span-2 space-y-6">
            {companies.map(c => (
              <div key={c.id} className="bento-card p-8 flex justify-between items-center group relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-2xl font-bold text-white tracking-tight">{c.name}</h4>
                  <p className="text-text-dim font-medium">{c.email}</p>
                </div>
                <button onClick={() => deleteDoc(doc(db, "companies", c.id))} className="opacity-0 group-hover:opacity-100 p-3 bg-red-500/10 text-red-500 rounded-xl transition-all hover:bg-red-500 hover:text-white relative z-10">
                  <Trash2 size={20} />
                </button>
                <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-20 transition-opacity">
                   <Users size={180} className="text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "projects" && (
        <div className="grid lg:grid-cols-3 gap-12">
          <form onSubmit={addProject} className="bento-card p-10 space-y-8 h-fit sticky top-32">
            <h3 className="text-3xl font-display font-black text-white tracking-tighter">Initialize Project</h3>
            <div className="space-y-4">
              <select name="companyId" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white appearance-none h-[58px]" required>
                <option value="" className="bg-brand">Select Client Company</option>
                {companies.map(c => <option key={c.id} value={c.id} className="bg-brand">{c.name}</option>)}
              </select>
              <input name="title" placeholder="Implementation Title" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white" required />
              <textarea name="desc" placeholder="Operational Description & Intelligence" className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-accent" />
            </div>
            <button className="w-full bg-accent text-white py-5 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-accent/20 transition-all active:scale-95">Deploy Strategy</button>
          </form>

          <div className="lg:col-span-2 space-y-8">
            {projects.map(p => (
              <div key={p.id} className="bento-card p-10 space-y-8 relative overflow-hidden group">
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-2 block">
                      {companies.find(c => c.id === p.companyId)?.name || 'Unknown Company'}
                    </span>
                    <h4 className="text-3xl font-black text-white tracking-tighter italic">{p.title}</h4>
                  </div>
                  <button onClick={() => deleteDoc(doc(db, "projects", p.id))} className="text-text-dim hover:text-red-500 transition-all opacity-20 group-hover:opacity-100"><Trash2 size={20} /></button>
                </div>
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between text-sm font-black text-white uppercase tracking-widest">
                    <span>Campaign Maturity</span>
                    <span className="text-accent">{p.progress}%</span>
                  </div>
                  <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/10">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${p.progress}%` }}
                      className="h-full bg-accent rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                    />
                  </div>
                </div>
                <div className="relative z-10">
                   <input 
                    type="range" 
                    min="0" max="100" 
                    value={p.progress} 
                    onChange={(e) => updateProgress(p.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 relative z-10">
                   <p className="text-text-dim text-sm leading-relaxed italic line-clamp-3 group-hover:line-clamp-none transition-all duration-500">{p.description}</p>
                </div>
                <div className="absolute -bottom-10 -right-10 opacity-[0.02] group-hover:opacity-5 transition-opacity pointer-events-none">
                    <FolderKanban size={200} className="text-white" />
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="bento-card p-24 text-center">
                 <p className="text-text-dim italic font-medium">No operational data deployed yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
