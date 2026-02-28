import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ContentEditor } from "@/components/admin/content-editor";

export default async function AdminDashboard() {
    const session = await getSession();

    if (!session) {
        redirect("/admin/login");
    }

    // Server-side securely fetch the master order of website sections from the database
    const { data: contentRows } = await supabase
        .from('site_content')
        .select('*')
        .order('order_index', { ascending: true });

    return (
        <div className="flex h-screen bg-muted/30 text-foreground transition-colors duration-500 overflow-hidden font-sans selection:bg-primary/20 selection:text-primary">
            {/* Elegant Sidebar Component */}
            <aside className="w-[280px] border-r border-foreground/5 bg-card/60 backdrop-blur-3xl flex flex-col shrink-0 z-10 shadow-[4px_0_24px_-10px_rgba(0,0,0,0.05)]">
                <div className="p-8 pb-6 border-b border-foreground/5 flex justify-between items-start">
                    <div className="space-y-1">
                        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary/70 font-semibold h-4">
                            System Panel
                        </p>
                        <h2 className="font-serif text-3xl font-medium tracking-tight mt-1">Dashboard</h2>
                    </div>
                </div>

                <div className="flex-1 px-4 py-8 overflow-y-auto space-y-6">
                    <div className="space-y-1">
                        <p className="px-4 text-[10px] font-mono uppercase tracking-widest text-foreground/40 font-semibold mb-3">Management</p>
                        <nav className="space-y-1">
                            <a href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground rounded-2xl transition-all shadow-sm font-medium text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" x2="21" y1="9" y2="9" /><line x1="9" x2="9" y1="21" y2="9" /></svg>
                                Content Manager
                            </a>
                        </nav>
                    </div>
                </div>

                <div className="p-6 border-t border-foreground/5 bg-background/30 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif font-bold text-xs ring-1 ring-primary/20">
                            {(session.email as string).charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-semibold truncate">{session.email as string}</p>
                            <p className="text-[10px] text-foreground/50 font-mono uppercase tracking-widest mt-0.5">Administrator</p>
                        </div>
                    </div>

                    <form action="/api/auth/logout" method="POST">
                        <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[11px] font-mono font-semibold tracking-widest uppercase text-destructive/80 hover:text-destructive bg-destructive/5 hover:bg-destructive/10 rounded-xl transition-all border border-destructive/10">
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-y-auto overflow-x-hidden scroll-smooth perspective-[1000px]">
                {/* Subtle Grain Overlay for texture */}
                <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] bg-repeat" />

                <div className="max-w-6xl mx-auto p-12 lg:p-16 relative z-10">
                    <div className="mb-12 max-w-2xl">
                        <h1 className="font-serif text-5xl font-medium tracking-tight mb-4 text-foreground/90">Website Engine</h1>
                        <p className="text-foreground/50 text-base leading-relaxed max-w-lg font-medium">Control, rewrite, and deploy every layer of your digital presence instantaneously.</p>
                    </div>

                    <ContentEditor initialData={contentRows || []} />
                </div>
            </main>
        </div>
    );
}
