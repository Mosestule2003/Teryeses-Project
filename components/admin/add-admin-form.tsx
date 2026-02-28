"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function AddAdminForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch("/api/auth/register-admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create new admin");
            }

            setMessage(data.message);
            setEmail("");
            setPassword("");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleCreate} className="space-y-4 max-w-sm">
            {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-sm mb-4 border border-destructive/20 font-mono animate-in slide-in-from-top-2">
                    {error}
                </div>
            )}

            {message && (
                <div className="bg-primary/10 text-primary text-sm p-3 rounded-sm mb-4 border border-primary/20 font-mono animate-in slide-in-from-top-2">
                    {message}
                </div>
            )}

            <div>
                <label className="block text-[10px] font-mono tracking-widest uppercase text-foreground/50 mb-1.5 font-semibold">
                    New Admin Email
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
                    required
                    placeholder="colleague@example.com"
                />
            </div>

            <div>
                <label className="block text-[10px] font-mono tracking-widest uppercase text-foreground/50 mb-1.5 font-semibold">
                    Temporary Password
                </label>
                <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
                    required
                    minLength={8}
                    placeholder="Minimum 8 characters"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground font-sans font-medium text-sm py-3 rounded-xl hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 mt-2 shadow-[0_8px_20px_-8px_rgba(26,26,26,0.5)]"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Admin Account"}
            </button>
        </form>
    );
}
