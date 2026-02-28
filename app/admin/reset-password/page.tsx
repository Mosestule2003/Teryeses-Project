"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("No reset token provided. Please use the link from your email.");
        }
    }, [token]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to reset password");
            }

            setMessage(data.message);
            // Optionally redirect to login after a few seconds
            setTimeout(() => {
                router.push("/admin/login");
            }, 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative z-10 w-full">
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
                    Security Update
                </p>
                <h1 className="font-serif text-3xl font-bold">New Password</h1>
            </div>

            {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-sm mb-6 border border-destructive/20 text-center font-mono animate-in slide-in-from-top-2">
                    {error}
                </div>
            )}

            {message && (
                <div className="bg-primary/10 text-primary text-sm p-3 rounded-sm mb-6 border border-primary/20 text-center font-mono animate-in slide-in-from-top-2">
                    {message}
                    <p className="mt-2 text-xs animate-pulse opacity-80">Redirecting to login...</p>
                </div>
            )}

            {!message && (
                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <label className="block text-xs font-mono tracking-wider uppercase text-foreground/70 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-background border border-foreground/20 rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                            required
                            minLength={8}
                            disabled={!token}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono tracking-wider uppercase text-foreground/70 mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-background border border-foreground/20 rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                            required
                            minLength={8}
                            disabled={!token}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !token}
                        className="w-full bg-primary text-primary-foreground font-mono text-xs tracking-wider uppercase py-3 rounded-sm hover:bg-primary/90 transition-colors flex items-center justify-center disabled:opacity-50 mt-4"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
                    </button>
                </form>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md bg-card border border-foreground/10 p-8 rounded-sm shadow-sm relative overflow-hidden flex flex-col items-center">
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="absolute inset-0" style={{
                        backgroundImage: "radial-gradient(circle at 1px 1px, #f5f0e8 1px, transparent 0)",
                        backgroundSize: "20px 20px"
                    }} />
                </div>

                <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-primary" />}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
