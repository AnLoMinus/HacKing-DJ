/**
 * Mixer Module - ניהול המיקסר
 * HacKing-DJ
 */

class MixerManager {
    constructor() {
        this.crossfaderPosition = 50; // 0 = A, 100 = B
        this.crossfaderReadout = null;
        this.meterElements = {};
        this.meterAnimation = null;
        this.meterLevels = { A: 0, B: 0 };
    }

    /**
     * אתחול מיקסר
     */
    init() {
        this.crossfaderReadout = document.getElementById('crossfader-readout');

        // Crossfader
        const crossfader = document.getElementById('crossfader');
        if (crossfader) {
            crossfader.addEventListener('input', (e) => {
                this.setCrossfader(parseInt(e.target.value));
            });

            // הצגה ראשונית
            this.updateCrossfaderReadout(this.crossfaderPosition);
        }

        // Crossfader quick actions
        document.getElementById('crossfader-left')?.addEventListener('click', () => {
            this.nudgeCrossfader(-10);
        });
        document.getElementById('crossfader-right')?.addEventListener('click', () => {
            this.nudgeCrossfader(10);
        });
        document.getElementById('crossfader-center')?.addEventListener('click', () => {
            this.resetCrossfader();
        });

        // EQ for Deck A
        ['low', 'mid', 'high'].forEach(band => {
            const slider = document.getElementById(`eq-${band}-a`);
            if (slider) {
                slider.addEventListener('input', (e) => {
                    audioEngine.setEQ('A', band, parseFloat(e.target.value));
                });
            }
        });

        // EQ for Deck B (אם נוסיף בהמשך)
        ['low', 'mid', 'high'].forEach(band => {
            const slider = document.getElementById(`eq-${band}-b`);
            if (slider) {
                slider.addEventListener('input', (e) => {
                    audioEngine.setEQ('B', band, parseFloat(e.target.value));
                });
            }
        });

        // Reset EQ buttons
        ['A', 'B'].forEach(deckId => {
            const resetBtn = document.getElementById(`eq-reset-${deckId.toLowerCase()}`);
            if (resetBtn) {
                resetBtn.addEventListener('click', () => this.resetEQ(deckId));
            }
        });

        // Master Volume
        const masterVolume = document.getElementById('master-volume');
        if (masterVolume) {
            masterVolume.addEventListener('input', (e) => {
                audioEngine.setMasterVolume(parseInt(e.target.value));
            });
        }

        // Meter elements
        this.meterElements = {
            a: document.getElementById('meter-bar-a'),
            b: document.getElementById('meter-bar-b'),
            master: document.getElementById('meter-bar-master')
        };

        this.startMeters();

        console.log('✅ Mixer initialized');
    }

    /**
     * הגדרת Crossfader
     * 0 = רק Deck A
     * 50 = שני הדקים שווים
     * 100 = רק Deck B
     */
    setCrossfader(value) {
        this.crossfaderPosition = value;
        
        // חישוב ווליום לכל דק
        let volumeA, volumeB;
        
        if (value <= 50) {
            // Deck A דומיננטי
            volumeA = 100;
            volumeB = (value / 50) * 100;
        } else {
            // Deck B דומיננטי
            volumeA = ((100 - value) / 50) * 100;
            volumeB = 100;
        }

        // עדכון ווליום (בנוסף לווליום הקיים של כל דק)
        const deckA = audioEngine.decks.A;
        const deckB = audioEngine.decks.B;
        
        if (deckA.gainNode) {
            const baseVolumeA = document.getElementById('volume-a')?.value || 75;
            deckA.gainNode.gain.value = (baseVolumeA / 100) * (volumeA / 100);
        }
        
        if (deckB.gainNode) {
            const baseVolumeB = document.getElementById('volume-b')?.value || 75;
            deckB.gainNode.gain.value = (baseVolumeB / 100) * (volumeB / 100);
        }

        this.updateCrossfaderReadout(value, volumeA, volumeB);
    }

    /**
     * תזוזה קטנה של ה-Crossfader
     */
    nudgeCrossfader(delta) {
        const crossfader = document.getElementById('crossfader');
        if (!crossfader) return;

        const newValue = Math.min(100, Math.max(0, parseInt(crossfader.value) + delta));
        crossfader.value = newValue;
        this.setCrossfader(newValue);
    }

    /**
     * איפוס Crossfader לאמצע
     */
    resetCrossfader() {
        const crossfader = document.getElementById('crossfader');
        if (crossfader) {
            crossfader.value = 50;
        }
        this.setCrossfader(50);
    }

    /**
     * איפוס EQ לדק ספציפי
     */
    resetEQ(deckId) {
        ['low', 'mid', 'high'].forEach(band => {
            const slider = document.getElementById(`eq-${band}-${deckId.toLowerCase()}`);
            if (slider) {
                slider.value = 0;
                audioEngine.setEQ(deckId, band, 0);
            }
        });
    }

    /**
     * החלת פרופיל EQ מתצורה מוגדרת (למשל מצ'אקרות)
     */
    applyEqProfile(deckId, profile) {
        ['low', 'mid', 'high'].forEach(band => {
            const value = typeof profile[band] === 'number' ? profile[band] : 0;
            const slider = document.getElementById(`eq-${band}-${deckId.toLowerCase()}`);
            if (slider) {
                slider.value = value;
            }
            audioEngine.setEQ(deckId, band, value);
        });
    }

    /**
     * עדכון תצוגת Crossfader
     */
    updateCrossfaderReadout(value, volumeA = 100, volumeB = 100) {
        if (!this.crossfaderReadout) return;

        const leaning = value < 45 ? 'A' : value > 55 ? 'B' : 'center';
        if (leaning === 'center') {
            this.crossfaderReadout.textContent = i18n.t('mixer.crossfaderCentered', 'Centered');
        } else {
            const loudness = leaning === 'A' ? volumeA : volumeB;
            const label = leaning === 'A' ? i18n.t('deck.deckA', 'Deck A') : i18n.t('deck.deckB', 'Deck B');
            this.crossfaderReadout.textContent = `${label} • ${Math.round(loudness)}%`;
        }
    }

    /**
     * הפעלת מדדי ווליום לדקים ולמאסטר
     */
    startMeters() {
        const hasAnalysers = audioEngine?.decks?.A?.analyser && audioEngine?.decks?.B?.analyser;
        if (!hasAnalysers) return;

        const updateMeters = () => {
            ['A', 'B'].forEach(deckId => {
                const analyser = audioEngine.decks[deckId].analyser;
                if (!analyser) return;

                const level = this.calculateRmsLevel(analyser);
                this.updateMeter(deckId, level);
            });

            const masterVolume = parseInt(document.getElementById('master-volume')?.value || 80) / 100;
            const masterLevel = Math.max(this.meterLevels.A, this.meterLevels.B) * masterVolume;
            this.updateMeter('master', masterLevel);

            this.meterAnimation = requestAnimationFrame(updateMeters);
        };

        updateMeters();
    }

    /**
     * חישוב RMS
     */
    calculateRmsLevel(analyser) {
        const bufferLength = analyser.fftSize;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        let sumSquares = 0;
        for (let i = 0; i < bufferLength; i++) {
            const sample = (dataArray[i] - 128) / 128;
            sumSquares += sample * sample;
        }

        const rms = Math.sqrt(sumSquares / bufferLength);
        return Math.min(1, rms * 2); // scale gently to fill meter
    }

    /**
     * עדכון אלמנט מד
     */
    updateMeter(deckId, level) {
        const key = deckId.toLowerCase();
        this.meterLevels[deckId] = level;
        const meterEl = this.meterElements[key] || (deckId === 'master' ? this.meterElements.master : null);
        if (meterEl) {
            meterEl.style.setProperty('--meter-level', `${(level * 100).toFixed(1)}%`);
        }
    }
}

// יצירת instance גלובלי
const mixerManager = new MixerManager();

