/**
 * Chakras System - מערכת צ'אקרות
 * HacKing-DJ
 */

class ChakraSystem {
    constructor() {
        this.chakras = {
            root: {
                name: 'Root Chakra',
                nameHe: 'צאקרת השורש',
                color: '#FF0000',
                frequency: 256, // Hz - C note
                element: 'Earth',
                note: 'C',
                effects: {
                    low: 3,
                    mid: 0,
                    high: -2,
                    reverb: 0.1
                }
            },
            sacral: {
                name: 'Sacral Chakra',
                nameHe: 'צאקרת המין',
                color: '#FF7F00',
                frequency: 288, // Hz - D note
                element: 'Water',
                note: 'D',
                effects: {
                    low: 2,
                    mid: 2,
                    high: -1,
                    reverb: 0.15
                }
            },
            solar: {
                name: 'Solar Plexus Chakra',
                nameHe: 'צאקרת מקלעת השמש',
                color: '#FFFF00',
                frequency: 320, // Hz - E note
                element: 'Fire',
                note: 'E',
                effects: {
                    low: 1,
                    mid: 3,
                    high: 0,
                    reverb: 0.1
                }
            },
            heart: {
                name: 'Heart Chakra',
                nameHe: 'צאקרת הלב',
                color: '#00FF00',
                frequency: 341.3, // Hz - F note
                element: 'Air',
                note: 'F',
                effects: {
                    low: 0,
                    mid: 2,
                    high: 2,
                    reverb: 0.2
                }
            },
            throat: {
                name: 'Throat Chakra',
                nameHe: 'צאקרת הגרון',
                color: '#0000FF',
                frequency: 384, // Hz - G note
                element: 'Sound',
                note: 'G',
                effects: {
                    low: -1,
                    mid: 1,
                    high: 3,
                    reverb: 0.25
                }
            },
            thirdEye: {
                name: 'Third Eye Chakra',
                nameHe: 'צאקרת העין השלישית',
                color: '#4B0082',
                frequency: 426.7, // Hz - A note
                element: 'Light',
                note: 'A',
                effects: {
                    low: -2,
                    mid: 0,
                    high: 3,
                    reverb: 0.3
                }
            },
            crown: {
                name: 'Crown Chakra',
                nameHe: 'צאקרת הכתר',
                color: '#9400D3',
                frequency: 480, // Hz - B note
                element: 'Thought',
                note: 'B',
                effects: {
                    low: -3,
                    mid: -1,
                    high: 4,
                    reverb: 0.35
                }
            }
        };
        
        this.activeChakra = null;
        this.activeDeck = 'A';
    }

    /**
     * הפעלת צ'אקרה
     */
    activateChakra(chakraId, deckId = 'A') {
        const chakra = this.chakras[chakraId];
        if (!chakra) return;

        this.activeChakra = chakraId;
        this.activeDeck = deckId;

        // החלת אפקטים על הדק
        const effects = chakra.effects;

        // עדכון EQ
        audioEngine.setEQ(deckId, 'low', effects.low);
        audioEngine.setEQ(deckId, 'mid', effects.mid);
        audioEngine.setEQ(deckId, 'high', effects.high);

        if (typeof mixerManager?.applyEqProfile === 'function') {
            mixerManager.applyEqProfile(deckId, effects);
        }

        // עדכון UI
        this.updateChakraUI(chakraId);
        
        // Event
        document.dispatchEvent(new CustomEvent('chakraActivated', {
            detail: { chakraId, chakra, deckId }
        }));

        console.log(`✅ Chakra activated: ${chakra.name} (${chakra.note} - ${chakra.frequency}Hz)`);
    }

    /**
     * עדכון UI של צ'אקרה
     */
    updateChakraUI(chakraId) {
        // הסרת active מכל הצ'אקרות
        document.querySelectorAll('.chakra-item').forEach(item => {
            item.classList.remove('active');
        });

        // הוספת active לצ'אקרה הנוכחית
        const chakraElement = document.querySelector(`[data-chakra="${chakraId}"]`);
        if (chakraElement) {
            chakraElement.classList.add('active');
        }
    }

    /**
     * קבלת צ'אקרה לפי ID
     */
    getChakra(chakraId) {
        return this.chakras[chakraId];
    }

    /**
     * קבלת כל הצ'אקרות
     */
    getAllChakras() {
        return this.chakras;
    }
}

// יצירת instance גלובלי
const chakraSystem = new ChakraSystem();

