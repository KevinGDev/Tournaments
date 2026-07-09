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
                gold: 'var(--gold)',
                'gold-glow': 'var(--gold-glow)',
            },
        },
    },
    plugins: [],
};

export default config;