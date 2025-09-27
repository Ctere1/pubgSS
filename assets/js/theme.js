/**
 * Theme Manager
 * - Supports Light / Dark / Auto (system)
 * - Persists user preference
 * - Updates meta theme-color dynamically
 */
(function () {
    const STORAGE_KEY = 'pubgss-theme-preference';
    const root = document.documentElement;
    const menuBtn = document.getElementById('themeMenuButton');
    const menu = document.getElementById('themeMenu');
    const options = menu ? menu.querySelectorAll('button[data-theme-value]') : [];
    const metaTheme = document.getElementById('dynamic-theme-color');

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyBaseTheme(theme) {
        root.setAttribute('data-theme', theme);
        // Update dynamic theme color for mobile UI bars
        if (metaTheme) {
            metaTheme.setAttribute('content', theme === 'dark' ? '#0d1216' : '#0d4d91');
        }
    }

    function applyTheme(value) {
        if (value === 'auto') {
            applyBaseTheme(getSystemTheme());
            root.dataset.themeMode = 'auto';
            localStorage.removeItem(STORAGE_KEY);
        } else {
            applyBaseTheme(value);
            root.dataset.themeMode = value;
            localStorage.setItem(STORAGE_KEY, value);
        }
        reflectSelection(value);
    }

    function reflectSelection(value) {
        options.forEach(btn => {
            const isMatch = btn.dataset.themeValue === value;
            // if auto mode selected but local storage has explicit value? handle fallback
            btn.setAttribute('aria-checked', isMatch ? 'true' : 'false');
        });
    }

    function initTheme() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            applyTheme(stored);
        } else {
            applyTheme('auto');
        }
    }

    // Menu toggle
    function toggleMenu() {
        const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', String(!expanded));
        menu.setAttribute('aria-hidden', String(expanded));
    }

    function closeMenu() {
        menuBtn.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
    }

    // Click outside to close
    function handleDocumentClick(e) {
        if (!menu.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
    }

    // Esc key to close
    function handleKey(e) {
        if (e.key === 'Escape') closeMenu();
    }

    // Option select
    options.forEach(btn => {
        btn.addEventListener('click', () => {
            applyTheme(btn.dataset.themeValue);
            closeMenu();
            menuBtn.focus();
        });
    });

    // System change listener (only when in auto)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            applyTheme('auto');
        }
    });

    menuBtn.addEventListener('click', toggleMenu);
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleKey);

    initTheme();
})();