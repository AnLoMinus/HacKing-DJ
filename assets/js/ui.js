/**
 * UI Module - ניהול ממשק המשתמש
 * HacKing-DJ
 */

class UIManager {
    constructor() {
        this.playlist = [];
    }

    /**
     * אתחול UI
     */
    init() {
        // Add Track button
        const addTrackBtn = document.getElementById('add-track');
        if (addTrackBtn) {
            addTrackBtn.addEventListener('click', () => this.addTrackToPlaylist());
        }

        console.log('✅ UI Manager initialized');
    }

    /**
     * הוספת טראק לפלייליסט
     */
    addTrackToPlaylist() {
        const fileInput = document.getElementById('file-input');
        if (!fileInput) return;

        fileInput.onchange = async (e) => {
            const files = Array.from(e.target.files);
            
            for (const file of files) {
                await this.addTrack(file);
            }

            fileInput.value = '';
            this.renderPlaylist();
        };

        fileInput.click();
    }

    /**
     * הוספת טראק בודד
     */
    async addTrack(file) {
        const track = {
            id: Date.now() + Math.random(),
            name: file.name,
            file: file,
            duration: null,
            bpm: null
        };

        // טעינת מידע בסיסי
        try {
            const arrayBuffer = await file.arrayBuffer();
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            track.duration = audioBuffer.duration;
            await audioContext.close();
        } catch (error) {
            console.error('Error reading track info:', error);
        }

        this.playlist.push(track);
    }

    /**
     * הצגת פלייליסט
     */
    renderPlaylist() {
        const playlistContainer = document.getElementById('playlist');
        if (!playlistContainer) return;

        if (this.playlist.length === 0) {
            playlistContainer.innerHTML = `<p class="empty-playlist" data-i18n="playlist.empty">אין טראקים עדיין. לחץ על "Add Track" כדי להוסיף.</p>`;
            i18n.updatePage();
            return;
        }

            playlistContainer.innerHTML = this.playlist.map(track => `
            <div class="playlist-item" data-track-id="${track.id}">
                <div class="track-info">
                    <span class="track-name">${track.name}</span>
                    <span class="track-duration">${this.formatDuration(track.duration)}</span>
                </div>
                <div class="track-actions">
                    <button class="btn btn-small" onclick="uiManager.loadToDeck('A', ${track.id})" data-i18n="playlist.loadToA">Load to A</button>
                    <button class="btn btn-small" onclick="uiManager.loadToDeck('B', ${track.id})" data-i18n="playlist.loadToB">Load to B</button>
                </div>
            </div>
        `).join('');
        
        // עדכון תרגומים אחרי יצירת הפלייליסט
        i18n.updatePage();
    }

    /**
     * טעינת טראק לדק
     */
    async loadToDeck(deckId, trackId) {
        const track = this.playlist.find(t => t.id === trackId);
        if (!track) return;

        try {
            await audioEngine.loadTrack(deckId, track.file);
            deckManager.updateDeckUI(deckId, track.name);
            deckManager.drawWaveform(deckId);
        } catch (error) {
            console.error(`Error loading track to Deck ${deckId}:`, error);
            alert(`${i18n.t('common.error', 'שגיאה')}: ${error.message}`);
        }
    }

    /**
     * פורמט זמן
     */
    formatDuration(seconds) {
        if (!seconds) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// יצירת instance גלובלי
const uiManager = new UIManager();

