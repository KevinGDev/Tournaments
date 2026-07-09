'use client'

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
    // 1. Initialiser avec une valeur neutre pour éviter le mismatch
    const [theme, setTheme] = useState<string>('dark');
    const [mounted, setMounted] = useState(false);

    // 2. Synchroniser avec localStorage SEULEMENT après le montage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        setMounted(true);
    }, []);

    // 3. Appliquer le thème au DOM quand il change
    useEffect(() => {
        if (mounted) {
            document.documentElement.setAttribute('data-theme', theme === 'dark' ? '' : theme);
            localStorage.setItem('theme', theme);
        }
    }, [theme, mounted]);

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'magic' : 'dark';
        setTheme(nextTheme);
    };

    // 4. Afficher un rendu cohérent le temps du montage
    const getIcon = () => {
        if (theme === 'light') return '☀️';
        if (theme === 'magic') return '🔮';
        return '🌙';
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-3 bg-bg-panel border border-steel/20 rounded-full hover:border-blood transition-all text-xl"
        >
            {getIcon()}
        </button>
    );
}