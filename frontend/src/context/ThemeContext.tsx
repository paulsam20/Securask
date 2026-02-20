import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Theme Type
 * Supports modern Light and Dark modes.
 */
type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

// Instantiate the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider
 * Wrapper that tracks the current theme and synchs it with:
 * 1. The document root (for Tailwind dark: utility classes)
 * 2. Local storage (for persistence)
 * 3. System preferences (fallback)
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');

    /**
     * Recovery logic: Initialize theme based on past choice or browser settings
     */
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Respect the user's OS-level theme preference
            setTheme('dark');
            document.documentElement.classList.add('dark');
        }
    }, []);

    /**
     * Handover: Swaps the theme and updates the DOM
     */
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        // Tailwind uses the 'dark' class on the HTML element for switching
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * useTheme Hook
 * Custom hook for easy access to theme state across the app.
 */
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
