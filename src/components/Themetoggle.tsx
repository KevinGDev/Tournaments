'use client'
export default function ThemeToggle() {
    const toggleTheme = () => {
        const root = window.document.documentElement;
        const current = root.getAttribute('data-theme');
        root.setAttribute('data-theme', current === 'light' ? '' : 'light');
    };

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-4 right-4 p-2 bg-bg-panel border border-steel/20 rounded-full hover:border-blood transition-all z-50 text-text-main"
        >
            🌓
        </button>
    );
}