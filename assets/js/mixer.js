/**
 * Mixer Module - ניהול המיקסר
 * HacKing-DJ
 */

class MixerManager {
    constructor() {
        this.crossfaderPosition = 50; // 0 = A, 100 = B
    }

    /**
     * אתחול מיקסר
     */
    init() {
        // Crossfader
        const crossfader = document.getElementById('crossfader');
        if (crossfader) {
            crossfader.addEventListener('input', (e) => {
                this.setCrossfader(parseInt(e.target.value));
            });
        }

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

        // Master Volume
        const masterVolume = document.getElementById('master-volume');
        if (masterVolume) {
            masterVolume.addEventListener('input', (e) => {
                audioEngine.setMasterVolume(parseInt(e.target.value));
            });
        }

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
    }
}

// יצירת instance גלובלי
const mixerManager = new MixerManager();

