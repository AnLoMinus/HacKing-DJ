/**
 * Keyboard Shortcuts System - מערכת קיצורי מקלדת
 * HacKing-DJ
 */

class KeyboardShortcuts {
    constructor() {
        this.shortcuts = {
            // Deck Controls
            'KeyQ': { action: () => this.loadTrack('A'), description: 'Load Track to Deck A' },
            'KeyW': { action: () => this.playPause('A'), description: 'Play/Pause Deck A' },
            'KeyE': { action: () => this.cue('A'), description: 'Cue Deck A' },
            'KeyR': { action: () => this.loadTrack('B'), description: 'Load Track to Deck B' },
            'KeyT': { action: () => this.playPause('B'), description: 'Play/Pause Deck B' },
            'KeyY': { action: () => this.cue('B'), description: 'Cue Deck B' },
            
            // Mixer Controls
            'KeyZ': { action: () => this.adjustCrossfader(-5), description: 'Crossfader Left' },
            'KeyX': { action: () => this.adjustCrossfader(5), description: 'Crossfader Right' },
            'KeyC': { action: () => this.resetCrossfader(), description: 'Reset Crossfader' },
            
            // Volume Controls
            'Digit1': { action: () => this.adjustVolume('A', -5), description: 'Deck A Volume -' },
            'Digit2': { action: () => this.adjustVolume('A', 5), description: 'Deck A Volume +' },
            'Digit3': { action: () => this.adjustVolume('B', -5), description: 'Deck B Volume -' },
            'Digit4': { action: () => this.adjustVolume('B', 5), description: 'Deck B Volume +' },
            'Digit5': { action: () => this.adjustMasterVolume(-5), description: 'Master Volume -' },
            'Digit6': { action: () => this.adjustMasterVolume(5), description: 'Master Volume +' },
            
            // Panel Controls
            'KeyM': { action: () => this.toggleMixingPanel(), description: 'Toggle Mixing Panel' },
            'KeyH': { action: () => this.showShortcuts(), description: 'Show Keyboard Shortcuts' },
            
            // Language
            'KeyL': { action: () => this.toggleLanguage(), description: 'Toggle Language' },
            
            // Escape
            'Escape': { action: () => this.closeModals(), description: 'Close Modals/Panels' }
        };
        
        this.modal = null;
        this.init();
    }

    /**
     * אתחול מערכת קיצורי מקלדת
     */
    init() {
        // יצירת מודל קיצורי מקלדת
        this.createShortcutsModal();
        
        // הוספת event listeners
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
        
        // מניעת פעולות ברירת מחדל במקרים מסוימים
        document.addEventListener('keydown', (e) => {
            if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                this.showShortcuts();
            }
        });
    }

    /**
     * יצירת מודל קיצורי מקלדת
     */
    createShortcutsModal() {
        if (!document.getElementById('shortcuts-modal')) {
            const modalHTML = `
                <div id="shortcuts-modal" class="shortcuts-modal">
                    <div class="shortcuts-modal-content">
                        <div class="shortcuts-modal-header">
                            <h2 data-i18n="shortcuts.title">⌨️ קיצורי מקלדת</h2>
                            <button class="shortcuts-modal-close" id="shortcuts-modal-close">&times;</button>
                        </div>
                        <div class="shortcuts-modal-body" id="shortcuts-modal-body">
                            <!-- יווצר דינמית -->
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Event listeners
            document.getElementById('shortcuts-modal-close').addEventListener('click', () => {
                this.hideShortcuts();
            });
            
            document.getElementById('shortcuts-modal').addEventListener('click', (e) => {
                if (e.target.id === 'shortcuts-modal') {
                    this.hideShortcuts();
                }
            });
            
            this.modal = document.getElementById('shortcuts-modal');
            this.renderShortcuts();
        }
    }

    /**
     * רינדור קיצורי מקלדת
     */
    renderShortcuts() {
        const body = document.getElementById('shortcuts-modal-body');
        const currentLang = i18n.getCurrentLanguage();
        
        const categories = {
            deck: {
                title: currentLang === 'he' ? 'דקים' : 'Decks',
                shortcuts: [
                    { key: 'Q', desc: currentLang === 'he' ? 'טען טראק לדק A' : 'Load Track to Deck A' },
                    { key: 'W', desc: currentLang === 'he' ? 'נגן/עצור דק A' : 'Play/Pause Deck A' },
                    { key: 'E', desc: currentLang === 'he' ? 'Cue דק A' : 'Cue Deck A' },
                    { key: 'R', desc: currentLang === 'he' ? 'טען טראק לדק B' : 'Load Track to Deck B' },
                    { key: 'T', desc: currentLang === 'he' ? 'נגן/עצור דק B' : 'Play/Pause Deck B' },
                    { key: 'Y', desc: currentLang === 'he' ? 'Cue דק B' : 'Cue Deck B' }
                ]
            },
            mixer: {
                title: currentLang === 'he' ? 'מיקסר' : 'Mixer',
                shortcuts: [
                    { key: 'Z', desc: currentLang === 'he' ? 'Crossfader שמאלה' : 'Crossfader Left' },
                    { key: 'X', desc: currentLang === 'he' ? 'Crossfader ימינה' : 'Crossfader Right' },
                    { key: 'C', desc: currentLang === 'he' ? 'איפוס Crossfader' : 'Reset Crossfader' }
                ]
            },
            volume: {
                title: currentLang === 'he' ? 'ווליום' : 'Volume',
                shortcuts: [
                    { key: '1', desc: currentLang === 'he' ? 'ווליום דק A -' : 'Deck A Volume -' },
                    { key: '2', desc: currentLang === 'he' ? 'ווליום דק A +' : 'Deck A Volume +' },
                    { key: '3', desc: currentLang === 'he' ? 'ווליום דק B -' : 'Deck B Volume -' },
                    { key: '4', desc: currentLang === 'he' ? 'ווליום דק B +' : 'Deck B Volume +' },
                    { key: '5', desc: currentLang === 'he' ? 'Master Volume -' : 'Master Volume -' },
                    { key: '6', desc: currentLang === 'he' ? 'Master Volume +' : 'Master Volume +' }
                ]
            },
            panels: {
                title: currentLang === 'he' ? 'פאנלים' : 'Panels',
                shortcuts: [
                    { key: 'M', desc: currentLang === 'he' ? 'פתח/סגור פאנל מיקסינג' : 'Toggle Mixing Panel' },
                    { key: 'H', desc: currentLang === 'he' ? 'הצג קיצורי מקלדת' : 'Show Keyboard Shortcuts' },
                    { key: '?', desc: currentLang === 'he' ? 'הצג קיצורי מקלדת' : 'Show Keyboard Shortcuts' },
                    { key: 'L', desc: currentLang === 'he' ? 'החלף שפה' : 'Toggle Language' }
                ]
            },
            general: {
                title: currentLang === 'he' ? 'כללי' : 'General',
                shortcuts: [
                    { key: 'ESC', desc: currentLang === 'he' ? 'סגור מודלים/פאנלים' : 'Close Modals/Panels' }
                ]
            }
        };
        
        body.innerHTML = Object.keys(categories).map(catKey => {
            const category = categories[catKey];
            return `
                <div class="shortcuts-category">
                    <h3>${category.title}</h3>
                    <div class="shortcuts-list">
                        ${category.shortcuts.map(shortcut => `
                            <div class="shortcut-item">
                                <span class="shortcut-key">${shortcut.key}</span>
                                <span class="shortcut-desc">${shortcut.desc}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * טיפול בלחיצת מקש
     */
    handleKeyPress(e) {
        // התעלם אם המשתמש מקליד בתוך input/textarea
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        const keyCode = e.code;
        const shortcut = this.shortcuts[keyCode];
        
        if (shortcut) {
            e.preventDefault();
            shortcut.action();
        }
    }

    /**
     * פעולות קיצורי מקלדת
     */
    loadTrack(deckId) {
        deckManager.loadTrack(deckId);
    }

    playPause(deckId) {
        deckManager.togglePlay(deckId);
    }

    cue(deckId) {
        audioEngine.cue(deckId);
    }

    adjustCrossfader(delta) {
        const crossfader = document.getElementById('crossfader');
        if (crossfader) {
            let value = parseInt(crossfader.value) + delta;
            value = Math.max(0, Math.min(100, value));
            crossfader.value = value;
            crossfader.dispatchEvent(new Event('input'));
        }
    }

    resetCrossfader() {
        const crossfader = document.getElementById('crossfader');
        if (crossfader) {
            crossfader.value = 50;
            crossfader.dispatchEvent(new Event('input'));
        }
    }

    adjustVolume(deckId, delta) {
        const volumeSlider = document.getElementById(`volume-${deckId.toLowerCase()}`);
        if (volumeSlider) {
            let value = parseInt(volumeSlider.value) + delta;
            value = Math.max(0, Math.min(100, value));
            volumeSlider.value = value;
            volumeSlider.dispatchEvent(new Event('input'));
        }
    }

    adjustMasterVolume(delta) {
        const masterVolume = document.getElementById('master-volume');
        if (masterVolume) {
            let value = parseInt(masterVolume.value) + delta;
            value = Math.max(0, Math.min(100, value));
            masterVolume.value = value;
            masterVolume.dispatchEvent(new Event('input'));
        }
    }

    toggleMixingPanel() {
        if (typeof mixingPanel !== 'undefined') {
            mixingPanel.togglePanel();
        }
    }

    showShortcuts() {
        if (this.modal) {
            this.renderShortcuts(); // עדכון תרגומים
            this.modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    hideShortcuts() {
        if (this.modal) {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    toggleLanguage() {
        const currentLang = i18n.getCurrentLanguage();
        const languages = ['he', 'en', 'ru', 'hi'];
        const currentIndex = languages.indexOf(currentLang);
        const nextIndex = (currentIndex + 1) % languages.length;
        i18n.changeLanguage(languages[nextIndex]);
    }

    closeModals() {
        // סגירת מודל קיצורי מקלדת
        this.hideShortcuts();
        
        // סגירת מודל מסמכים
        if (typeof markdownRenderer !== 'undefined') {
            markdownRenderer.closeModal();
        }
        
        // סגירת פאנל מיקסינג אם פתוח
        if (typeof mixingPanel !== 'undefined' && mixingPanel.isOpen) {
            mixingPanel.togglePanel();
        }
    }
}

// יצירת instance גלובלי
const keyboardShortcuts = new KeyboardShortcuts();

