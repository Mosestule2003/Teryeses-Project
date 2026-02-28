"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to request reset");
            }

            setMessage(data.message);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md bg-card border border-foreground/10 p-8 rounded-sm shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="absolute inset-0" style={{
                        backgroundImage: "radial-gradient(circle at 1px 1px, #f5f0e8 1px, transparent 0)",
                        backgroundSize: "20px 20px"
                    }} />
                </div>

                <div className="relative z-10">
                    <button
                        onClick={() => router.push("/admin/login")}
                        className="group flex items-center gap-2 text-xs font-mono tracking-wider text-foreground/50 hover:text-primary transition-colors mb-6"
                    >
                        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Login
                    </button>

                    <div className="mb-8 text-center">
                        <p className="font-mono text-xs tracking-[0.2em] uppercase text-primary mb-2">
                            Recovery
                        </p>
                        <h1 className="font-serif text-3xl font-bold">Forgot Password</h1>
                    </div>

                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-sm mb-6 border border-destructive/20 text-center font-mono animate-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="bg-primary/10 text-primary text-sm p-3 rounded-sm mb-6 border border-primary/20 text-center font-mono animate-in slide-in-from-top-2">
                            {message}
                        </div>
                    )}

                    {!message && (
                        <form onSubmit={handleReset} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono tracking-wider uppercase text-foreground/70 mb-2">
                                    Admin Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-background border border-foreground/20 rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary text-primary-foreground font-mono text-xs tracking-wider uppercase py-3 rounded-sm hover:bg-primary/90 transition-colors flex items-center justify-center disabled:opacity-50 mt-4"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
