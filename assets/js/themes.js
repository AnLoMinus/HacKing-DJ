class ThemeManager {
    constructor() {
        this.storageKey = 'hackingdj-theme';
        this.root = document.documentElement;
        this.themes = {
            'cosmic-neon': {
                '--bg-dark': '#0a0a0f',
                '--bg-darker': '#050508',
                '--bg-accent-1': 'rgba(0, 212, 255, 0.08)',
                '--bg-accent-2': 'rgba(176, 38, 255, 0.08)',
                '--surface': '#0f111a',
                '--surface-strong': '#121422',
                '--neon-blue': '#00d4ff',
                '--neon-purple': '#b026ff',
                '--neon-gold': '#ffd700',
                '--neon-pink': '#ff4dff',
                '--accent-mint': '#3af2c5',
                '--text-light': '#e0e0e0',
                '--text-dim': '#9ca3af',
                '--glow-blue': '0 0 20px rgba(0, 212, 255, 0.5)',
                '--glow-purple': '0 0 20px rgba(176, 38, 255, 0.5)',
                '--glow-gold': '0 0 20px rgba(255, 215, 0, 0.5)',
                '--glow-mint': '0 0 16px rgba(58, 242, 197, 0.45)',
                '--card-border': '2px solid rgba(0, 212, 255, 0.35)',
                '--font-display': "'Segoe UI', 'Inter', system-ui, -apple-system, sans-serif",
                '--font-body': "'Segoe UI', 'Inter', system-ui, -apple-system, sans-serif"
            },
            'torah-clarity': {
                '--bg-dark': '#fdf7ec',
                '--bg-darker': '#f6e7cf',
                '--bg-accent-1': 'rgba(195, 138, 31, 0.12)',
                '--bg-accent-2': 'rgba(43, 95, 158, 0.12)',
                '--surface': '#fff8e8',
                '--surface-strong': '#f1e0c3',
                '--neon-blue': '#2b5f9e',
                '--neon-purple': '#a15b17',
                '--neon-gold': '#c38a1f',
                '--neon-pink': '#b45c5c',
                '--accent-mint': '#468585',
                '--text-light': '#2b2b2b',
                '--text-dim': '#5a5140',
                '--glow-blue': '0 0 18px rgba(43, 95, 158, 0.35)',
                '--glow-purple': '0 0 18px rgba(161, 91, 23, 0.35)',
                '--glow-gold': '0 0 20px rgba(195, 138, 31, 0.35)',
                '--glow-mint': '0 0 16px rgba(70, 133, 133, 0.32)',
                '--card-border': '2px solid rgba(67, 87, 119, 0.35)',
                '--font-display': "'Georgia', 'Times New Roman', serif",
                '--font-body': "'Georgia', 'Times New Roman', serif"
            },
            'midnight-ember': {
                '--bg-dark': '#0b0c11',
                '--bg-darker': '#05060a',
                '--bg-accent-1': 'rgba(249, 115, 22, 0.14)',
                '--bg-accent-2': 'rgba(34, 211, 238, 0.12)',
                '--surface': '#111827',
                '--surface-strong': '#0f172a',
                '--neon-blue': '#22d3ee',
                '--neon-purple': '#f97316',
                '--neon-gold': '#f59e0b',
                '--neon-pink': '#fb7185',
                '--accent-mint': '#38bdf8',
                '--text-light': '#e2e8f0',
                '--text-dim': '#94a3b8',
                '--glow-blue': '0 0 18px rgba(34, 211, 238, 0.4)',
                '--glow-purple': '0 0 18px rgba(249, 115, 22, 0.4)',
                '--glow-gold': '0 0 18px rgba(245, 158, 11, 0.45)',
                '--glow-mint': '0 0 16px rgba(56, 189, 248, 0.38)',
                '--card-border': '2px solid rgba(34, 211, 238, 0.35)',
                '--font-display': "'Segoe UI', 'Inter', system-ui, -apple-system, sans-serif",
                '--font-body': "'Segoe UI', 'Inter', system-ui, -apple-system, sans-serif"
            }
        };
    }

    init() {
        const savedTheme = localStorage.getItem(this.storageKey) || 'cosmic-neon';
        this.applyTheme(savedTheme, false);
        this.bindUI();
    }

    bindUI() {
        document.querySelectorAll('.apply-theme').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-theme-target');
                this.applyTheme(target);
            });
        });

        const restoreBtn = document.getElementById('theme-restore');
        if (restoreBtn) {
            restoreBtn.addEventListener('click', () => this.applyTheme('cosmic-neon'));
        }
    }

    applyTheme(themeKey, persist = true) {
        const theme = this.themes[themeKey];
        if (!theme) return;

        Object.entries(theme).forEach(([varName, value]) => {
            this.root.style.setProperty(varName, value);
        });

        this.root.dataset.theme = themeKey;
        if (persist) {
            localStorage.setItem(this.storageKey, themeKey);
        }

        document.querySelectorAll('.theme-card').forEach(card => {
            const isActive = card.getAttribute('data-theme-key') === themeKey;
            card.classList.toggle('theme-active', isActive);
        });
    }
}

const themeManager = new ThemeManager();
