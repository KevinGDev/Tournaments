'use client'

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const [theme, setTheme] = useState('');

    // 1. Au chargement du composant, on lit la préférence sauvegardée
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || '';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    // 2. Fonction pour basculer et sauvegarder
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? '' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 bg-bg-panel border border-steel/20 rounded-full hover:border-blood transition-all text-text-main"
        >
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    );
}