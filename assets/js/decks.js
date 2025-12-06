/**
 * Decks Module - ניהול הדקים
 * HacKing-DJ
 */

class DeckManager {
    constructor() {
        this.currentDeck = null;
    }

    /**
     * אתחול דק
     */
    initDeck(deckId) {
        const deckElement = document.getElementById(`deck-${deckId.toLowerCase()}`);
        if (!deckElement) return;

        // Load button
        const loadBtn = document.getElementById(`load-${deckId.toLowerCase()}`);
        if (loadBtn) {
            loadBtn.addEventListener('click', () => this.loadTrack(deckId));
        }

        // Play button
        const playBtn = document.getElementById(`play-${deckId.toLowerCase()}`);
        if (playBtn) {
            playBtn.addEventListener('click', () => this.togglePlay(deckId));
        }

        // Pause button
        const pauseBtn = document.getElementById(`pause-${deckId.toLowerCase()}`);
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => audioEngine.pause(deckId));
        }

        // Cue button
        const cueBtn = document.getElementById(`cue-${deckId.toLowerCase()}`);
        if (cueBtn) {
            cueBtn.addEventListener('click', () => audioEngine.cue(deckId));
        }

        // Volume slider
        const volumeSlider = document.getElementById(`volume-${deckId.toLowerCase()}`);
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                audioEngine.setVolume(deckId, e.target.value);
            });
        }

        // Pitch slider
        const pitchSlider = document.getElementById(`pitch-${deckId.toLowerCase()}`);
        if (pitchSlider) {
            pitchSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                audioEngine.setPitch(deckId, value);
                // עדכון תצוגה
                const valueDisplay = document.getElementById(`pitch-value-${deckId.toLowerCase()}`);
                if (valueDisplay) {
                    valueDisplay.textContent = `${value > 0 ? '+' : ''}${value}%`;
                }
            });
        }
        
        // Volume slider - עדכון תצוגה
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                const valueDisplay = document.getElementById(`volume-value-${deckId.toLowerCase()}`);
                if (valueDisplay) {
                    valueDisplay.textContent = `${e.target.value}%`;
                }
            });
        }
        
        // BPM input
        const bpmInput = document.getElementById(`bpm-${deckId.toLowerCase()}`);
        if (bpmInput) {
            bpmInput.addEventListener('input', (e) => {
                const bpm = parseFloat(e.target.value);
                const deck = audioEngine.decks[deckId];
                const resolvedBpm = Number.isFinite(bpm) ? bpm : deck.baseBpm;
                deck.bpm = resolvedBpm;
                audioEngine.applyPlaybackRate(deckId);

                // עדכון תצוגה
                const bpmDisplay = document.getElementById(`bpm-display-${deckId.toLowerCase()}`);
                if (bpmDisplay) {
                    bpmDisplay.textContent = `${resolvedBpm.toFixed(1)} BPM`;
                }
            });

            // שמירת BPM בסיסי עם ערך התחלתי מה-UI
            const initialBpm = parseFloat(bpmInput.value) || 120;
            const deck = audioEngine.decks[deckId];
            deck.bpm = initialBpm;
            deck.baseBpm = initialBpm;
            deck.playbackRate = audioEngine.getPlaybackRate(deckId);
        }

        console.log(`✅ Deck ${deckId} initialized`);
    }

    /**
     * טעינת טראק לדק
     */
    async loadTrack(deckId) {
        const fileInput = document.getElementById('file-input');
        if (!fileInput) return;

        // יצירת Promise לטעינה
        return new Promise((resolve) => {
            fileInput.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) {
                    resolve(null);
                    return;
                }

                try {
                    await audioEngine.loadTrack(deckId, file);
                    
                    // עדכון UI
                    this.updateDeckUI(deckId, file.name);
                    
                    // ציור waveform
                    this.drawWaveform(deckId);
                    
                    // עדכון duration
                    const duration = audioEngine.decks[deckId].buffer.duration;
                    const durationElement = document.getElementById(`progress-duration-${deckId.toLowerCase()}`);
                    if (durationElement) {
                        durationElement.textContent = this.formatTime(duration);
                    }
                    
                    resolve(file);
                } catch (error) {
                    console.error(`Error loading track to Deck ${deckId}:`, error);
                    alert(`שגיאה בטעינת הקובץ: ${error.message}`);
                    resolve(null);
                }

                // איפוס input
                fileInput.value = '';
            };

            fileInput.click();
        });
    }

    /**
     * נגינה/עצירה
     */
    togglePlay(deckId) {
        const deck = audioEngine.decks[deckId];
        
        if (!deck.buffer) {
            alert(i18n.t('playlist.noTrackLoaded', 'אנא טען טראק קודם'));
            return;
        }

        if (deck.isPlaying) {
            audioEngine.pause(deckId);
        } else {
            audioEngine.play(deckId);
        }

        this.updatePlayButton(deckId);
    }

    /**
     * עדכון UI של דק
     */
    updateDeckUI(deckId, trackName) {
        const deckHeader = document.querySelector(`#deck-${deckId.toLowerCase()} .deck-header h2`);
        if (deckHeader && trackName) {
            deckHeader.textContent = `🎛️ Deck ${deckId} - ${trackName}`;
        }
    }

    /**
     * עדכון כפתור Play
     */
    updatePlayButton(deckId) {
        const playBtn = document.getElementById(`play-${deckId.toLowerCase()}`);
        const deck = audioEngine.decks[deckId];
        
        if (playBtn) {
            if (deck.isPlaying) {
                playBtn.textContent = '⏸ Pause';
                playBtn.classList.add('pulse');
            } else {
                playBtn.textContent = '▶ Play';
                playBtn.classList.remove('pulse');
            }
        }
    }

    /**
     * ציור Waveform
     */
    drawWaveform(deckId) {
        const canvas = document.getElementById(`waveform-${deckId.toLowerCase()}`);
        const deck = audioEngine.decks[deckId];
        
        if (!canvas || !deck.buffer) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = canvas.offsetHeight;

        const buffer = deck.buffer;
        const channelData = buffer.getChannelData(0);
        const step = Math.ceil(channelData.length / width);
        const amp = height / 2;

        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let i = 0; i < width; i++) {
            const sample = channelData[i * step] || 0;
            const y = amp + (sample * amp * 0.8);
            
            if (i === 0) {
                ctx.moveTo(i, y);
            } else {
                ctx.lineTo(i, y);
            }
        }

        ctx.stroke();
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00d4ff';
        ctx.stroke();
        
        // הוספת click handler
        canvas.style.cursor = 'pointer';
        canvas.addEventListener('click', (e) => {
            this.handleWaveformClick(deckId, e, canvas, buffer);
        });
        
        // ציור progress bar על waveform
        this.drawProgressOnWaveform(deckId, canvas, ctx, buffer);
    }

    /**
     * טיפול בלחיצה על waveform
     */
    handleWaveformClick(deckId, event, canvas, buffer) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const width = canvas.width;
        const clickPosition = x / width;
        const newPosition = clickPosition * buffer.duration;
        
        // עדכון מיקום נגינה
        const deck = audioEngine.decks[deckId];
        if (deck.isPlaying) {
            audioEngine.pause(deckId);
        }
        
        deck.position = newPosition;
        
        // אם היה בנגינה, המשך מהמיקום החדש
        if (deck.isPlaying) {
            audioEngine.play(deckId);
        }
        
        console.log(`📍 Deck ${deckId} jumped to ${newPosition.toFixed(2)}s`);
    }

    /**
     * ציור progress bar על waveform
     */
    drawProgressOnWaveform(deckId, canvas, ctx, buffer) {
        if (!canvas || !ctx || !buffer) return;
        
        const deck = audioEngine.decks[deckId];
        if (!deck || !deck.buffer) return;
        
        const progress = deck.position / buffer.duration;
        const progressX = progress * canvas.width;
        
        // קו progress
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ffd700';
        ctx.beginPath();
        ctx.moveTo(progressX, 0);
        ctx.lineTo(progressX, canvas.height);
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}

// יצירת instance גלובלי
const deckManager = new DeckManager();

