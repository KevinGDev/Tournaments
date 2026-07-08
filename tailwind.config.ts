import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Définition de tes couleurs personnalisées
                bg: {
                    dark: "var(--bg-dark)",
                    panel: "var(--bg-panel)",
                },
                text: {
                    main: "var(--text-main)",
                },
                blood: "var(--blood)",
                steel: "var(--steel)",
                glow: "var(--glow)",
            },
        },
    },
    plugins: [],
};
export default config;