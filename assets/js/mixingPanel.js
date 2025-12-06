/**
 * Mixing Panel - פאנל מיקסינג ואפקטים
 * HacKing-DJ
 */

class MixingPanel {
    constructor() {
        this.isOpen = false;
        this.targetDeck = 'A';
        this.activeChakraLabel = null;
        this.initPanel();
    }

    /**
     * אתחול פאנל
     */
    initPanel() {
        // יצירת פאנל אם לא קיים
        if (!document.getElementById('mixing-panel')) {
            const panelHTML = `
                <div id="mixing-panel" class="mixing-panel">
                    <div class="mixing-panel-header">
                        <h2 data-i18n="mixing.title">🎛️ פאנל מיקסינג ואפקטים</h2>
                        <button class="mixing-panel-toggle" id="mixing-panel-toggle">▼</button>
                    </div>
                    <div class="mixing-panel-content" id="mixing-panel-content">
                        <div class="mixing-tabs">
                            <button class="mixing-tab active" data-tab="chakras" data-i18n="mixing.chakras">צ'אקרות</button>
                            <button class="mixing-tab" data-tab="effects" data-i18n="mixing.effects">אפקטים</button>
                            <button class="mixing-tab" data-tab="presets" data-i18n="mixing.presets">סטים מוכנים</button>
                        </div>

                        <div class="mixing-tab-content active" id="tab-chakras">
                            <div class="chakra-toolbar">
                                <div class="chakra-target" aria-live="polite">
                                    <span data-i18n="mixing.targetDeck">Apply to deck:</span>
                                    <div class="chakra-target-buttons">
                                        <button class="btn pill ghost chakra-target-btn active" data-target-deck="A" data-i18n="deck.deckA">Deck A</button>
                                        <button class="btn pill ghost chakra-target-btn" data-target-deck="B" data-i18n="deck.deckB">Deck B</button>
                                    </div>
                                </div>
                                <div class="chakra-active" id="chakra-active-label" data-i18n="mixing.noChakra">No chakra selected yet</div>
                            </div>
                            <div class="chakras-grid" id="chakras-grid">
                                <!-- יווצר דינמית -->
                            </div>
                        </div>
                        
                        <div class="mixing-tab-content" id="tab-effects">
                            <div class="effects-list" id="effects-list">
                                <p data-i18n="mixing.comingSoon">בקרוב...</p>
                            </div>
                        </div>
                        
                        <div class="mixing-tab-content" id="tab-presets">
                            <div class="presets-list" id="presets-list">
                                <p data-i18n="mixing.comingSoon">בקרוב...</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', panelHTML);

            // Event listeners
            document.getElementById('mixing-panel-toggle').addEventListener('click', () => {
                this.togglePanel();
            });

            // Tab switching
            document.querySelectorAll('.mixing-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    const tabName = tab.getAttribute('data-tab');
                    this.switchTab(tabName);
                });
            });

            // Chakra target deck buttons
            document.querySelectorAll('.chakra-target-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const deckId = btn.getAttribute('data-target-deck');
                    this.setTargetDeck(deckId);
                });
            });

            // Language change should refresh chakra names
            document.addEventListener('languageChanged', () => {
                this.renderChakras();
            });

            this.activeChakraLabel = document.getElementById('chakra-active-label');

            // יצירת צ'אקרות
            this.renderChakras();
        }
    }

    /**
     * הצגת/הסתרת פאנל
     */
    togglePanel() {
        this.isOpen = !this.isOpen;
        const panel = document.getElementById('mixing-panel');
        const content = document.getElementById('mixing-panel-content');
        const toggle = document.getElementById('mixing-panel-toggle');
        
        if (this.isOpen) {
            panel.classList.add('open');
            content.style.maxHeight = '600px';
            toggle.textContent = '▲';
        } else {
            panel.classList.remove('open');
            content.style.maxHeight = '0';
            toggle.textContent = '▼';
        }
    }

    /**
     * החלפת טאב
     */
    switchTab(tabName) {
        // הסרת active מכל הטאבים והתוכן
        document.querySelectorAll('.mixing-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.mixing-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // הוספת active לטאב והתוכן הנבחר
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`tab-${tabName}`).classList.add('active');
    }

    /**
     * רינדור צ'אקרות
     */
    renderChakras() {
        const grid = document.getElementById('chakras-grid');
        const chakras = chakraSystem.getAllChakras();

        grid.innerHTML = Object.keys(chakras).map(chakraId => {
            const chakra = chakras[chakraId];
            const currentLang = i18n.getCurrentLanguage();
            const chakraName = currentLang === 'he' ? chakra.nameHe : chakra.name;

            return `
                <div class="chakra-item" data-chakra="${chakraId}" style="border-color: ${chakra.color}">
                    <div class="chakra-icon" style="background: ${chakra.color}">
                        <span class="chakra-note">${chakra.note}</span>
                    </div>
                    <div class="chakra-info">
                        <h4>${chakraName}</h4>
                        <p class="chakra-frequency">${chakra.frequency} Hz</p>
                        <p class="chakra-element">${chakra.element}</p>
                    </div>
                    <button class="chakra-activate-btn" data-chakra-id="${chakraId}" data-i18n="mixing.activate">הפעל</button>
                </div>
            `;
        }).join('');

        grid.querySelectorAll('.chakra-activate-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const chakraId = btn.getAttribute('data-chakra-id');
                this.activateChakra(chakraId);
            });
        });

        // עדכון תרגומים + מצב UI
        i18n.updatePage();
        chakraSystem.updateChakraUI(chakraSystem.activeChakra);
        this.updateActiveLabel(chakraSystem.activeChakra);
    }

    /**
     * הפעלת צ'אקרה
     */
    activateChakra(chakraId) {
        // הפעלה על דק A (ניתן לשנות)
        chakraSystem.activateChakra(chakraId, this.targetDeck);

        // עדכון UI
        chakraSystem.updateChakraUI(chakraId);
        this.updateActiveLabel(chakraId);
    }

    /**
     * החלפת דק יעד לצ'אקרות
     */
    setTargetDeck(deckId) {
        this.targetDeck = deckId;
        document.querySelectorAll('.chakra-target-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-target-deck') === deckId);
        });
        this.updateActiveLabel(chakraSystem.activeChakra);
    }

    /**
     * עדכון תווית הצ'אקרה הפעילה
     */
    updateActiveLabel(chakraId) {
        if (!this.activeChakraLabel) return;

        if (!chakraId) {
            this.activeChakraLabel.textContent = i18n.t('mixing.noChakra', 'No chakra selected yet');
            return;
        }

        const chakra = chakraSystem.getChakra(chakraId);
        const lang = i18n.getCurrentLanguage();
        const chakraName = lang === 'he' ? chakra.nameHe : chakra.name;
        const deckLabel = this.targetDeck === 'A' ? i18n.t('deck.deckA', 'Deck A') : i18n.t('deck.deckB', 'Deck B');
        this.activeChakraLabel.textContent = `${chakraName} • ${deckLabel}`;
    }
}

// יצירת instance גלובלי
const mixingPanel = new MixingPanel();

