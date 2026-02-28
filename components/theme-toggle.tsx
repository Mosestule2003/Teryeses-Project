"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
    // Rest state is light by default for the doctor portfolio
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check current class on HTML to sync state on load
        const isDarkMode = document.documentElement.classList.contains("dark");
        setIsDark(isDarkMode);
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;
        if (root.classList.contains("dark")) {
            // Switch to light mode
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDark(false);
        } else {
            // Switch to dark mode
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDark(true);
        }
    };

    // Before hydration, show an invisible placeholder to prevent layout shift
    if (!mounted) {
        return (
            <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 w-12 h-12 md:w-14 md:h-14 bg-background/50 border border-border/50 rounded-full opacity-50 backdrop-blur-xl" />
        );
    }

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex items-center"
        >
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-background/60 hover:bg-background/80 border border-foreground/5 hover:border-foreground/20 rounded-full shadow-lg hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 backdrop-blur-2xl overflow-hidden"
                title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />

                <AnimatePresence mode="wait">
                    {isDark ? (
                        <motion.div
                            key="sun"
                            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.3, ease: "backOut" }}
                            className="text-primary group-hover:text-primary transition-colors drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                        >
                            <Sun className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="moon"
                            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.3, ease: "backOut" }}
                            className="text-primary group-hover:text-primary transition-colors drop-shadow-[0_0_8px_rgba(0,0,0,0.2)]"
                        >
                            <Moon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </motion.div>
    );
}
