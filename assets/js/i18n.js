/**
 * i18n Module - מערכת תרגום רב-לשונית
 * HacKing-DJ
 */

class I18n {
    constructor() {
        this.currentLanguage = 'he'; // שפה ברירת מחדל: עברית
        this.translations = {};
        this.supportedLanguages = ['he', 'en', 'ru', 'hi'];
        this.languageNames = {
            'he': 'עברית',
            'en': 'English',
            'ru': 'Русский',
            'hi': 'हिन्दी'
        };
    }

    /**
     * טעינת תרגום משפה מסוימת
     */
    async loadLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) {
            console.warn(`Language ${lang} not supported, falling back to Hebrew`);
            lang = 'he';
        }

        try {
            const response = await fetch(`assets/i18n/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load language file: ${lang}.json`);
            }
            this.translations[lang] = await response.json();
            this.currentLanguage = lang;
            
            // שמירת בחירת השפה ב-localStorage
            localStorage.setItem('hacking-dj-language', lang);
            
            // עדכון HTML lang attribute
            document.documentElement.lang = lang;
            
            // עדכון direction לפי שפה
            if (lang === 'he' || lang === 'ar') {
                document.documentElement.dir = 'rtl';
            } else {
                document.documentElement.dir = 'ltr';
            }
            
            console.log(`✅ Language loaded: ${lang}`);
            return true;
        } catch (error) {
            console.error(`❌ Error loading language ${lang}:`, error);
            // נסה לטעון עברית כגיבוי
            if (lang !== 'he') {
                return await this.loadLanguage('he');
            }
            return false;
        }
    }

    /**
     * קבלת תרגום לפי מפתח
     */
    t(key, defaultValue = '') {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return defaultValue || key;
            }
        }
        
        return value || defaultValue || key;
    }

    /**
     * עדכון כל הטקסטים בדף
     */
    updatePage() {
        // עדכון כל האלמנטים עם data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && element.type === 'button') {
                element.value = translation;
            } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // עדכון title
        const titleElement = document.querySelector('title');
        if (titleElement) {
            titleElement.textContent = `${this.t('app.title')} 🎚️`;
        }

        // עדכון logo
        const logoElement = document.querySelector('.logo');
        if (logoElement) {
            logoElement.textContent = `⚡ ${this.t('app.title')}`;
        }

        // עדכון tagline
        const taglineElement = document.querySelector('.tagline');
        if (taglineElement) {
            taglineElement.textContent = this.t('app.tagline');
        }

        // עדכון shortcuts hint
        const shortcutsHint = document.getElementById('shortcuts-hint');
        if (shortcutsHint) {
            shortcutsHint.innerHTML = this.t('shortcuts.hint', 'Press ? or H for keyboard shortcuts');
        }
    }

    /**
     * אתחול מערכת התרגום
     */
    async init() {
        // בדיקה אם יש שפה שמורה ב-localStorage
        const savedLanguage = localStorage.getItem('hacking-dj-language');
        const initialLanguage = savedLanguage || this.detectBrowserLanguage();
        
        await this.loadLanguage(initialLanguage);
        this.updatePage();
        
        console.log('✅ i18n initialized');
    }

    /**
     * זיהוי שפת הדפדפן
     */
    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0].toLowerCase();
        
        if (this.supportedLanguages.includes(langCode)) {
            return langCode;
        }
        
        return 'he'; // ברירת מחדל: עברית
    }

    /**
     * החלפת שפה
     */
    async changeLanguage(lang) {
        await this.loadLanguage(lang);
        this.updatePage();
        
        // עדכון כפתורי השפה
        this.updateLanguageButtons();
        
        // Event לשאר המערכת
        document.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: lang } 
        }));
    }

    /**
     * עדכון כפתורי בחירת שפה
     */
    updateLanguageButtons() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            if (btnLang === this.currentLanguage) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /**
     * קבלת שם השפה הנוכחית
     */
    getCurrentLanguageName() {
        return this.languageNames[this.currentLanguage] || this.currentLanguage;
    }

    /**
     * קבלת קוד השפה הנוכחית
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// יצירת instance גלובלי
const i18n = new I18n();

