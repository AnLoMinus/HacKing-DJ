/**
 * Audio Engine - מנוע האודיו המרכזי
 * HacKing-DJ
 */

class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.decks = {
            A: {
                buffer: null,
                source: null,
                gainNode: null,
                analyser: null,
                filterLow: null,
                filterMid: null,
                filterHigh: null,
                isPlaying: false,
                position: 0,
                startTime: 0,
                bpm: 120,
                baseBpm: 120,
                pitchPercent: 0,
                playbackRate: 1,
                startOffset: 0,
                loop: { enabled: false, start: 0, end: 0 }
            },
            B: {
                buffer: null,
                source: null,
                gainNode: null,
                analyser: null,
                filterLow: null,
                filterMid: null,
                filterHigh: null,
                isPlaying: false,
                position: 0,
                startTime: 0,
                bpm: 120,
                baseBpm: 120,
                pitchPercent: 0,
                playbackRate: 1,
                startOffset: 0,
                loop: { enabled: false, start: 0, end: 0 }
            }
        };
        this.masterGain = null;
        this.initialized = false;
    }

    /**
     * אתחול AudioContext
     */
    async init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // יצירת Master Gain Node
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = 0.8;

            // אתחול כל דק
            ['A', 'B'].forEach(deckId => {
                this.initDeck(deckId);
            });

            this.initialized = true;
            console.log('✅ Audio Engine initialized');
        } catch (error) {
            console.error('❌ Error initializing Audio Engine:', error);
            throw error;
        }
    }

    /**
     * אתחול דק בודד
     */
    initDeck(deckId) {
        const deck = this.decks[deckId];
        
        // Gain Node
        deck.gainNode = this.audioContext.createGain();
        deck.gainNode.gain.value = 0.75;
        
        // Analyser Node (לויזואליזציה)
        deck.analyser = this.audioContext.createAnalyser();
        deck.analyser.fftSize = 2048;
        
        // EQ Filters
        deck.filterLow = this.audioContext.createBiquadFilter();
        deck.filterLow.type = 'lowshelf';
        deck.filterLow.frequency.value = 200;
        
        deck.filterMid = this.audioContext.createBiquadFilter();
        deck.filterMid.type = 'peaking';
        deck.filterMid.frequency.value = 1000;
        deck.filterMid.Q.value = 1;
        
        deck.filterHigh = this.audioContext.createBiquadFilter();
        deck.filterHigh.type = 'highshelf';
        deck.filterHigh.frequency.value = 5000;
        
        // חיבור: Gain -> Filters -> Analyser -> Master
        deck.gainNode.connect(deck.filterLow);
        deck.filterLow.connect(deck.filterMid);
        deck.filterMid.connect(deck.filterHigh);
        deck.filterHigh.connect(deck.analyser);
        deck.analyser.connect(this.masterGain);
    }

    /**
     * טעינת קובץ אודיו
     */
    async loadTrack(deckId, file) {
        if (!this.initialized) {
            await this.init();
        }

        try {
            const arrayBuffer = await file.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

            this.decks[deckId].buffer = audioBuffer;
            this.decks[deckId].position = 0;
            this.decks[deckId].startOffset = 0;

            console.log(`✅ Track loaded to Deck ${deckId}:`, file.name);
            return audioBuffer;
        } catch (error) {
            console.error(`❌ Error loading track to Deck ${deckId}:`, error);
            throw error;
        }
    }

    /**
     * נגינת דק
     */
    play(deckId) {
        const deck = this.decks[deckId];
        
        if (!deck.buffer) {
            console.warn(`⚠️ No track loaded in Deck ${deckId}`);
            return;
        }

        if (deck.isPlaying) {
            this.pause(deckId);
            return;
        }

        // יצירת source חדש
        deck.source = this.audioContext.createBufferSource();
        deck.source.buffer = deck.buffer;
        deck.playbackRate = this.getPlaybackRate(deckId);
        deck.source.playbackRate.value = deck.playbackRate;

        // חיבור ל-Gain Node
        deck.source.connect(deck.gainNode);

        // התחלת נגינה
        const offset = deck.position;
        deck.startOffset = offset;
        deck.source.start(0, offset);
        deck.startTime = this.audioContext.currentTime;
        deck.isPlaying = true;

        // טיפול בסיום
        deck.source.onended = () => {
            if (!deck.loop.enabled) {
                deck.isPlaying = false;
                deck.position = 0;
                deck.startOffset = 0;
            }
        };
        
        // עדכון position בזמן אמת
        this.startPositionUpdate(deckId);

        console.log(`▶️ Deck ${deckId} playing`);
    }
    
    /**
     * עדכון position בזמן אמת
     */
    startPositionUpdate(deckId) {
        const deck = this.decks[deckId];
        if (!deck.isPlaying) return;

        const updateInterval = setInterval(() => {
            if (!deck.isPlaying) {
                clearInterval(updateInterval);
                return;
            }

            const elapsed = this.audioContext.currentTime - deck.startTime;
            deck.position = deck.startOffset + (elapsed * deck.playbackRate);

            // עדכון UI
            this.updateProgressUI(deckId);
            
            // עדכון waveform progress
            const waveformCanvas = document.getElementById(`waveform-${deckId.toLowerCase()}`);
            if (waveformCanvas && deck.buffer) {
                const ctx = waveformCanvas.getContext('2d');
                deckManager.drawProgressOnWaveform(deckId, waveformCanvas, ctx, deck.buffer);
            }
        }, 100);
    }
    
    /**
     * עדכון UI של progress
     */
    updateProgressUI(deckId) {
        const deck = this.decks[deckId];
        if (!deck.buffer) return;

        const duration = deck.buffer.duration;
        const currentTime = Math.min(deck.position, duration);
        
        // עדכון זמן
        const timeElement = document.getElementById(`progress-time-${deckId.toLowerCase()}`);
        if (timeElement) {
            timeElement.textContent = this.formatTime(currentTime);
        }
        
        const durationElement = document.getElementById(`progress-duration-${deckId.toLowerCase()}`);
        if (durationElement) {
            durationElement.textContent = this.formatTime(duration);
        }
        
        // ציור progress waveform
        const progressCanvas = document.getElementById(`progress-waveform-${deckId.toLowerCase()}`);
        if (progressCanvas && deck.buffer) {
            this.drawProgressWaveform(deckId, progressCanvas, deck.buffer, currentTime, duration);
        }
    }
    
    /**
     * פורמט זמן
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    /**
     * ציור progress waveform
     */
    drawProgressWaveform(deckId, canvas, buffer, currentTime, duration) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = canvas.offsetHeight;
        
        const channelData = buffer.getChannelData(0);
        const step = Math.ceil(channelData.length / width);
        const amp = height / 2;
        const progress = currentTime / duration;
        
        // רקע
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, width, height);
        
        // Waveform
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        for (let i = 0; i < width; i++) {
            const sample = channelData[i * step] || 0;
            const y = amp + (sample * amp * 0.6);
            
            if (i === 0) {
                ctx.moveTo(i, y);
            } else {
                ctx.lineTo(i, y);
            }
        }
        
        ctx.stroke();
        
        // Progress overlay
        const progressX = progress * width;
        ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.fillRect(0, 0, progressX, height);
        
        // Progress line
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(progressX, 0);
        ctx.lineTo(progressX, height);
        ctx.stroke();
        
        // Click handler
        canvas.style.cursor = 'pointer';
        canvas.onclick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const clickPosition = x / width;
            const newPosition = clickPosition * duration;
            
            const deck = this.decks[deckId];
            if (deck.isPlaying) {
                this.pause(deckId);
            }
            
            deck.position = newPosition;
            
            if (deck.isPlaying) {
                this.play(deckId);
            }
        };
    }

    /**
     * עצירת דק
     */
    pause(deckId) {
        const deck = this.decks[deckId];

        if (!deck.isPlaying || !deck.source) return;

        // שמירת מיקום נוכחי
        const elapsed = this.audioContext.currentTime - deck.startTime;
        deck.position = deck.startOffset + (elapsed * deck.playbackRate);

        // עצירת source
        deck.source.stop();
        deck.source.disconnect();
        deck.source = null;
        deck.isPlaying = false;
        deck.startOffset = deck.position;

        console.log(`⏸️ Deck ${deckId} paused at ${deck.position.toFixed(2)}s`);
    }

    /**
     * Cue - חזרה לנקודת התחלה
     */
    cue(deckId) {
        this.pause(deckId);
        this.decks[deckId].position = 0;
        console.log(`🔙 Deck ${deckId} cued to start`);
    }

    /**
     * הגדרת ווליום
     */
    setVolume(deckId, value) {
        const deck = this.decks[deckId];
        if (deck.gainNode) {
            deck.gainNode.gain.value = value / 100;
        }
    }

    /**
     * הגדרת Pitch/Tempo
     */
    setPitch(deckId, value) {
        const deck = this.decks[deckId];
        deck.pitchPercent = Number(value) || 0;
        this.applyPlaybackRate(deckId);
    }

    /**
     * הגדרת EQ
     */
    setEQ(deckId, band, value) {
        const deck = this.decks[deckId];
        const gainValue = value; // dB
        
        switch(band) {
            case 'low':
                if (deck.filterLow) deck.filterLow.gain.value = gainValue;
                break;
            case 'mid':
                if (deck.filterMid) deck.filterMid.gain.value = gainValue;
                break;
            case 'high':
                if (deck.filterHigh) deck.filterHigh.gain.value = gainValue;
                break;
        }
    }

    /**
     * הגדרת Master Volume
     */
    setMasterVolume(value) {
        if (this.masterGain) {
            this.masterGain.gain.value = value / 100;
        }
    }

    /**
     * קבלת נתוני Analyser לויזואליזציה
     */
    getAnalyserData(deckId) {
        const deck = this.decks[deckId];
        if (!deck.analyser) return null;

        const bufferLength = deck.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        deck.analyser.getByteFrequencyData(dataArray);

        return {
            frequencyData: dataArray,
            bufferLength: bufferLength
        };
    }

    /**
     * חישוב playbackRate משולב של BPM + Pitch
     */
    getPlaybackRate(deckId) {
        const deck = this.decks[deckId];
        const tempoFactor = deck.bpm && deck.baseBpm ? deck.bpm / deck.baseBpm : 1;
        const pitchFactor = 1 + (deck.pitchPercent / 100);
        const rate = tempoFactor * pitchFactor;

        // מניעת ערכים לא תקינים
        if (!isFinite(rate) || rate <= 0) {
            return 1;
        }

        // הגבלת קצוות למניעת ארטיפקטים
        return Math.min(Math.max(rate, 0.25), 4);
    }

    /**
     * החלת playbackRate בזמן אמת
     */
    applyPlaybackRate(deckId) {
        const deck = this.decks[deckId];
        if (!deck) return;

        const newRate = this.getPlaybackRate(deckId);

        if (deck.isPlaying && deck.source) {
            // חישוב מיקום נוכחי לפי הקצב הישן, ואז ריסטרט שעון לחישוב מדויק
            const elapsed = this.audioContext.currentTime - deck.startTime;
            deck.position = deck.startOffset + (elapsed * deck.playbackRate);
            deck.startOffset = deck.position;
            deck.startTime = this.audioContext.currentTime;
            deck.source.playbackRate.value = newRate;
        }

        deck.playbackRate = newRate;
    }
}

// יצירת instance גלובלי
const audioEngine = new AudioEngine();

