"use client";

import { useState } from "react";
import { Loader2, Save, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ImageUpload } from "./image-upload";
import { motion, AnimatePresence } from "framer-motion";

export function ContentEditor({ initialData }: { initialData: any[] }) {
    const router = useRouter();
    const [sections, setSections] = useState(initialData);
    const [saving, setSaving] = useState<string | null>(null);
    const [openSection, setOpenSection] = useState<string | null>(null);
    const [newFieldKey, setNewFieldKey] = useState<string>("");
    const [addingFieldTo, setAddingFieldTo] = useState<string | null>(null);

    const handleAddField = (sectionId: string, type: 'text' | 'image' | 'list' | 'object') => {
        if (!newFieldKey.trim()) {
            toast.error("Please provide a field name first");
            return;
        }
        const formattedKey = newFieldKey.toLowerCase().replace(/\s+/g, '_');

        let initialValue: any = "";
        if (type === 'list') initialValue = [];
        if (type === 'object') initialValue = {};

        setSections(sections.map(sec => {
            if (sec.id === sectionId) {
                return {
                    ...sec,
                    content_json: {
                        ...(sec.content_json || {}),
                        [formattedKey]: initialValue
                    }
                };
            }
            return sec;
        }));
        setNewFieldKey("");
        setAddingFieldTo(null);
        toast.success(`Field "${formattedKey}" added successfully`);
    };

    const handleSave = async (id: string, content_json: any) => {
        setSaving(id);
        try {
            const res = await fetch("/api/admin/content", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, content_json })
            });
            if (!res.ok) throw new Error("Failed to save changes.");
            toast.success("Section updated successfully!");
            router.refresh(); // Refresh the page payload so changes show on the main site immediately
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setSaving(null);
        }
    };

    const handleChange = (id: string, key: string, value: any) => {
        setSections(sections.map(sec => {
            if (sec.id === id) {
                return {
                    ...sec,
                    content_json: {
                        ...sec.content_json,
                        [key]: value
                    }
                };
            }
            return sec;
        }));
    };

    return (
        <div className="space-y-6 max-w-5xl">
            {sections.map((section, index) => (
                <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    key={section.id}
                    className="border border-foreground/5 bg-card/60 backdrop-blur-xl rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
                >
                    <button
                        onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                        className="w-full flex items-center justify-between p-6 hover:bg-foreground/[0.02] transition-colors text-left group"
                    >
                        <div>
                            <p className="font-mono text-[10px] text-primary/70 uppercase tracking-[0.2em] mb-2 font-semibold">Content Module</p>
                            <h2 className="font-serif text-2xl font-semibold capitalize tracking-tight group-hover:text-primary transition-colors">{section.section_key.replace("-", " ")}</h2>
                        </div>
                        <motion.div
                            animate={{ rotate: openSection === section.id ? 180 : 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="bg-foreground/5 p-2 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                        >
                            <ChevronDown className="w-5 h-5 opacity-70" />
                        </motion.div>
                    </button>

                    <AnimatePresence>
                        {openSection === section.id && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <div className="p-8 border-t border-foreground/5 bg-background/30 space-y-8">
                                    {Object.keys(section.content_json || {}).map((key) => {
                                        const value = section.content_json[key];

                                        // Standard string fields (Titles, Descriptions, Text, Images)
                                        if (typeof value === "string") {
                                            const isTextArea = value.length > 50 || value.includes("\n");
                                            const isImageField = key === "src" || key.includes("image") || key === "photo" || key === "logo" || key === "url";

                                            return (
                                                <div key={key} className="space-y-2">
                                                    <label className="block text-[11px] font-mono uppercase tracking-widest text-foreground/50">
                                                        {key.replace("_", " ")}
                                                    </label>
                                                    {isImageField ? (
                                                        <ImageUpload
                                                            value={value}
                                                            onChange={(newUrl) => handleChange(section.id, key, newUrl)}
                                                        />
                                                    ) : isTextArea ? (
                                                        <div className="space-y-1">
                                                            <textarea
                                                                value={value}
                                                                onChange={(e) => handleChange(section.id, key, e.target.value)}
                                                                className="w-full bg-background/50 border border-foreground/10 rounded-xl p-5 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none min-h-[140px] resize-y transition-all shadow-sm"
                                                                placeholder={`Enter ${key}...`}
                                                            />
                                                            <p className="text-[10px] text-foreground/40 font-mono pl-1">Tip: Wrap words in *asterisks* to highlight them</p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-1">
                                                            <input
                                                                type="text"
                                                                value={value}
                                                                onChange={(e) => handleChange(section.id, key, e.target.value)}
                                                                className="w-full bg-background/50 border border-foreground/10 rounded-xl p-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all shadow-sm"
                                                            />
                                                            <p className="text-[10px] text-foreground/40 font-mono pl-1">Tip: Wrap words in *asterisks* to highlight them</p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }

                                        // Complex JSON fields (like Arrays of stats or Arrays of images)
                                        if (typeof value === "object") {
                                            if (Array.isArray(value)) {
                                                return (
                                                    <div key={key} className="space-y-4 border border-foreground/5 p-6 rounded-2xl bg-background/40 shadow-sm relative overflow-hidden">
                                                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20"></div>
                                                        <div className="flex items-center justify-between mb-6">
                                                            <h3 className="font-mono text-xs uppercase tracking-[0.15em] text-foreground/70 font-semibold">{key.replace("_", " ")} Array</h3>
                                                            <span className="text-[9px] bg-primary/10 text-primary px-3 py-1 rounded-full font-mono tracking-widest font-semibold uppercase">List Editor</span>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <AnimatePresence>
                                                                {value.map((item, index) => (
                                                                    <motion.div
                                                                        key={index}
                                                                        initial={{ opacity: 0, x: -20 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        exit={{ opacity: 0, scale: 0.95, height: 0, overflow: "hidden", marginTop: 0 }}
                                                                        transition={{ duration: 0.3 }}
                                                                        className="flex gap-4 items-start relative border border-foreground/5 p-5 bg-card/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-shadow group/item"
                                                                    >
                                                                        {typeof item === "object" ? (
                                                                            <div className="flex-1 space-y-4">
                                                                                {Object.keys(item).map(subKey => {
                                                                                    const isObjImageField = subKey === "src" || subKey.includes("image") || subKey === "photo" || subKey === "url";
                                                                                    const isObjTextArea = typeof item[subKey] === "string" && (item[subKey].length > 40 || item[subKey].includes("\n"));

                                                                                    return (
                                                                                        <div key={subKey} className="space-y-1">
                                                                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-foreground/40">{subKey}</label>
                                                                                            {isObjImageField ? (
                                                                                                <div className="pt-2">
                                                                                                    <ImageUpload
                                                                                                        value={item[subKey] || ""}
                                                                                                        onChange={(newUrl) => {
                                                                                                            const newArr = [...value];
                                                                                                            newArr[index] = { ...newArr[index], [subKey]: newUrl };
                                                                                                            handleChange(section.id, key, newArr);
                                                                                                        }}
                                                                                                    />
                                                                                                </div>
                                                                                            ) : isObjTextArea ? (
                                                                                                <textarea
                                                                                                    value={item[subKey] || ""}
                                                                                                    onChange={(e) => {
                                                                                                        const newArr = [...value];
                                                                                                        newArr[index] = { ...newArr[index], [subKey]: e.target.value };
                                                                                                        handleChange(section.id, key, newArr);
                                                                                                    }}
                                                                                                    className="w-full bg-background border border-foreground/5 rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all resize-y min-h-[80px]"
                                                                                                />
                                                                                            ) : (
                                                                                                <input
                                                                                                    type="text"
                                                                                                    value={item[subKey] || ""}
                                                                                                    onChange={(e) => {
                                                                                                        const newArr = [...value];
                                                                                                        newArr[index] = { ...newArr[index], [subKey]: e.target.value };
                                                                                                        handleChange(section.id, key, newArr);
                                                                                                    }}
                                                                                                    className="w-full bg-background border border-foreground/5 rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none placeholder:text-foreground/20 transition-all"
                                                                                                    placeholder={subKey === "src" ? "/images/..." : ""}
                                                                                                />
                                                                                            )}
                                                                                        </div>
                                                                                    )
                                                                                })}
                                                                            </div>
                                                                        ) : (
                                                                            <input
                                                                                type="text"
                                                                                value={item}
                                                                                onChange={(e) => {
                                                                                    const newArr = [...value];
                                                                                    newArr[index] = e.target.value;
                                                                                    handleChange(section.id, key, newArr);
                                                                                }}
                                                                                className="flex-1 bg-background border border-foreground/5 rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all"
                                                                            />
                                                                        )}

                                                                        <button
                                                                            onClick={() => {
                                                                                const newArr = value.filter((_, i) => i !== index);
                                                                                handleChange(section.id, key, newArr);
                                                                            }}
                                                                            className="text-foreground/20 hover:text-destructive hover:bg-destructive/10 transition-colors mt-[1.4rem] p-2 flex-shrink-0 rounded-full opacity-0 group-hover/item:opacity-100"
                                                                            title="Remove Array Item"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                                                        </button>
                                                                    </motion.div>
                                                                ))}
                                                            </AnimatePresence>
                                                        </div>

                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => {
                                                                const newArr = [...value];
                                                                const defaultItem = value.length > 0 && typeof value[0] === "object"
                                                                    ? Object.keys(value[0] || {}).reduce((acc, k) => ({ ...acc, [k]: "" }), {})
                                                                    : "";
                                                                newArr.push(defaultItem);
                                                                handleChange(section.id, key, newArr);
                                                            }}
                                                            className="inline-flex items-center justify-center w-full gap-2 text-[11px] font-mono font-semibold uppercase tracking-widest text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/40 px-6 py-4 rounded-xl transition-all mt-4"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                                            Add New Object
                                                        </motion.button>
                                                    </div>
                                                );
                                            }

                                            // Fallback for non-array objects
                                            return (
                                                <div key={key} className="space-y-4 border border-foreground/5 p-6 rounded-2xl bg-background/40 shadow-sm relative overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/20"></div>
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="font-mono text-xs uppercase tracking-[0.15em] text-foreground/70 font-semibold">{key.replace("_", " ")} Object</h3>
                                                        <span className="text-[9px] bg-primary/10 text-primary px-3 py-1 rounded-full font-mono tracking-widest font-semibold uppercase">Nested Editor</span>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {value && Object.keys(value).map(subKey => {
                                                            const isObjImageField = subKey === "src" || subKey.includes("image") || subKey === "photo" || subKey === "url";
                                                            const isObjTextArea = typeof value[subKey] === "string" && (value[subKey].length > 40 || value[subKey].includes("\n"));

                                                            return (
                                                                <div key={subKey} className="space-y-1">
                                                                    <div className="flex items-center justify-between">
                                                                        <label className="block text-[10px] font-mono uppercase tracking-widest text-foreground/40">{subKey}</label>
                                                                        <button onClick={() => {
                                                                            const newVal = { ...value }; delete newVal[subKey]; handleChange(section.id, key, newVal);
                                                                        }} className="text-[8px] text-destructive/50 hover:text-destructive border border-destructive/10 px-2 py-0.5 rounded-sm">Remove</button>
                                                                    </div>
                                                                    {isObjImageField ? (
                                                                        <div className="pt-2">
                                                                            <ImageUpload
                                                                                value={value[subKey] || ""}
                                                                                onChange={(newUrl) => handleChange(section.id, key, { ...value, [subKey]: newUrl })}
                                                                            />
                                                                        </div>
                                                                    ) : isObjTextArea ? (
                                                                        <textarea
                                                                            value={value[subKey] || ""}
                                                                            onChange={(e) => handleChange(section.id, key, { ...value, [subKey]: e.target.value })}
                                                                            className="w-full bg-background border border-foreground/5 rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all resize-y min-h-[80px]"
                                                                        />
                                                                    ) : (
                                                                        <input
                                                                            type="text"
                                                                            value={value[subKey] || ""}
                                                                            onChange={(e) => handleChange(section.id, key, { ...value, [subKey]: e.target.value })}
                                                                            className="w-full bg-background border border-foreground/5 rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all"
                                                                        />
                                                                    )}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>

                                                    <div className="mt-4 pt-4 border-t border-foreground/5">
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="text"
                                                                placeholder="New nested field name..."
                                                                className="flex-1 bg-background border border-foreground/10 rounded-lg px-3 py-2 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all"
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' && e.currentTarget.value) {
                                                                        handleChange(section.id, key, { ...value, [e.currentTarget.value.toLowerCase().replace(/\s+/g, '_')]: "" });
                                                                        e.currentTarget.value = "";
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}

                                    {Object.keys(section.content_json || {}).length === 0 && (
                                        <div className="p-6 border border-dashed border-primary/20 bg-primary/5 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground/80 font-mono text-sm tracking-widest uppercase mb-1">Empty Structure</h3>
                                                <p className="text-foreground/50 text-xs max-w-sm font-medium">This section has no data fields assigned. Start building your layout by injecting dynamic fields below.</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-8 pt-6 border-t border-foreground/10">
                                        {addingFieldTo === section.id ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-card p-5 rounded-2xl border border-primary/20 shadow-lg shadow-primary/5 space-y-4"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-mono text-xs uppercase tracking-widest font-semibold text-foreground/70">Build New Content Field</h4>
                                                    <button onClick={() => setAddingFieldTo(null)} className="text-foreground/40 hover:text-foreground">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                                    </button>
                                                </div>

                                                <input
                                                    type="text"
                                                    placeholder="e.g. hero_title, background_image, team_members"
                                                    value={newFieldKey}
                                                    onChange={(e) => setNewFieldKey(e.target.value)}
                                                    className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all"
                                                />

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                    <button onClick={() => handleAddField(section.id, 'text')} className="flex flex-col items-center justify-center p-3 text-xs font-mono font-medium rounded-xl border border-foreground/5 bg-foreground/5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" x2="15" y1="20" y2="20" /><line x1="12" x2="12" y1="4" y2="20" /></svg>
                                                        Text Box
                                                    </button>
                                                    <button onClick={() => handleAddField(section.id, 'image')} className="flex flex-col items-center justify-center p-3 text-xs font-mono font-medium rounded-xl border border-foreground/5 bg-foreground/5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                                                        Image
                                                    </button>
                                                    <button onClick={() => handleAddField(section.id, 'list')} className="flex flex-col items-center justify-center p-3 text-xs font-mono font-medium rounded-xl border border-foreground/5 bg-foreground/5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg>
                                                        Array List
                                                    </button>
                                                    <button onClick={() => handleAddField(section.id, 'object')} className="flex flex-col items-center justify-center p-3 text-xs font-mono font-medium rounded-xl border border-foreground/5 bg-foreground/5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                                                        Object
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <button
                                                onClick={() => { setAddingFieldTo(section.id); setNewFieldKey(""); }}
                                                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest font-semibold text-primary/70 hover:text-primary transition-colors border border-dashed border-primary/30 px-4 py-2 rounded-xl bg-primary/5 hover:bg-primary/10"
                                            >
                                                + Inject New Structure Block
                                            </button>
                                        )}
                                    </div>

                                    <div className="pt-6 flex justify-end">
                                        <motion.button
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleSave(section.id, section.content_json)}
                                            disabled={saving === section.id}
                                            className="flex items-center gap-3 bg-foreground text-background font-medium px-8 py-3.5 rounded-full text-sm hover:opacity-90 transition-all disabled:opacity-50 shadow-[0_8px_16px_-4px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_20px_-4px_rgba(0,0,0,0.2)]"
                                        >
                                            {saving === section.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Deploy Changes
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}

            {sections.length === 0 && (
                <div className="p-8 text-center border border-dashed border-foreground/20 rounded-sm text-foreground/50 font-mono text-sm">
                    No editable sections found. Please ensure the database is seeded.
                </div>
            )}
        </div>
    );
}
