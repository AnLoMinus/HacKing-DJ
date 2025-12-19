const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const masterGain = audioCtx.createGain();
const tiltFilter = audioCtx.createBiquadFilter();
setTiltDefaults();
const compressor = audioCtx.createDynamicsCompressor();
compressor.threshold.value = -12;
compressor.knee.value = 24;
compressor.ratio.value = 2.5;
compressor.attack.value = 0.01;
compressor.release.value = 0.25;

const delay = audioCtx.createDelay(5.0);
const feedback = audioCtx.createGain();
feedback.gain.value = 0.32;
const delayOut = audioCtx.createGain();
delayOut.gain.value = 0.25;
delay.connect(feedback).connect(delayOut);
feedback.connect(delay);

tiltFilter.connect(compressor);
compressor.connect(masterGain);
delayOut.connect(tiltFilter);
masterGain.connect(audioCtx.destination);

const analyser = audioCtx.createAnalyser();
analyser.fftSize = 1024;
masterGain.connect(analyser);

const masterMeterCanvas = document.getElementById("masterMeter");
const masterMeterCtx = masterMeterCanvas.getContext("2d");

function formatTime(value) {
  if (!isFinite(value)) return "00:00";
  const minutes = Math.floor(value / 60).toString().padStart(2, "0");
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function setTiltDefaults() {
  tiltFilter.type = "lowshelf";
  tiltFilter.frequency.value = 600;
}

class Deck {
  constructor(id) {
    this.id = id;
    this.audio = document.getElementById(`audio${id}`);
    this.metaEl = document.getElementById(`meta${id}`);
    this.progress = document.getElementById(`prog${id}`);
    this.timeEl = document.getElementById(`time${id}`);
    this.gainControl = document.querySelector(`[data-prop="gain"][data-deck="${id}"]`);
    this.delaySendControl = document.querySelector(`[data-prop="delaySend"][data-deck="${id}"]`);
    this.level = Number(this.gainControl.value);

    this.gain = audioCtx.createGain();
    this.delaySend = audioCtx.createGain();
    this.delaySend.gain.value = Number(this.delaySendControl.value);
    this.eq = {
      low: audioCtx.createBiquadFilter(),
      mid: audioCtx.createBiquadFilter(),
      high: audioCtx.createBiquadFilter(),
    };
    this.eq.low.type = "lowshelf";
    this.eq.low.frequency.value = 120;
    this.eq.mid.type = "peaking";
    this.eq.mid.frequency.value = 1000;
    this.eq.high.type = "highshelf";
    this.eq.high.frequency.value = 8500;

    this.source = audioCtx.createMediaElementSource(this.audio);
    this.source
      .connect(this.eq.low)
      .connect(this.eq.mid)
      .connect(this.eq.high)
      .connect(this.gain)
      .connect(tiltFilter);

    this.gain.connect(this.delaySend);
    this.delaySend.connect(delay);

    this.registerControls();
    this.updateMeta("אין קובץ נטען");
  }

  registerControls() {
    document.querySelector(`[data-target="file${this.id}"]`).addEventListener("change", (ev) => {
      const file = ev.target.files?.[0];
      if (file) this.loadFile(file);
    });

    document.querySelector(`[data-demo="${this.id}"]`).addEventListener("click", () => {
      this.loadDemo();
    });

    document.querySelector(`[data-action="play"][data-deck="${this.id}"]`).addEventListener("click", () => this.toggle());
    document.querySelector(`[data-action="stop"][data-deck="${this.id}"]`).addEventListener("click", () => this.stop());

    document.querySelector(`[data-prop="loop"][data-deck="${this.id}"]`).addEventListener("change", (ev) => {
      this.audio.loop = ev.target.checked;
    });

    document.querySelector(`[data-prop="playbackRate"][data-deck="${this.id}"]`).addEventListener("input", (ev) => {
      this.audio.playbackRate = Number(ev.target.value);
    });

    this.gainControl.addEventListener("input", (ev) => {
      this.level = Number(ev.target.value);
      updateCrossfader();
    });

    this.delaySendControl.addEventListener("input", (ev) => {
      this.delaySend.gain.value = Number(ev.target.value);
    });

    document
      .querySelectorAll(`[data-eq][data-deck="${this.id}"]`)
      .forEach((slider) => slider.addEventListener("input", (ev) => {
        const band = ev.target.dataset.eq;
        const value = Number(ev.target.value);
        if (band === "low") this.eq.low.gain.value = value;
        if (band === "mid") this.eq.mid.gain.value = value;
        if (band === "high") this.eq.high.gain.value = value;
      }));

    this.audio.addEventListener("timeupdate", () => this.updateProgress());
    this.audio.addEventListener("loadedmetadata", () => this.updateProgress());
  }

  updateProgress() {
    if (!this.audio.duration || !isFinite(this.audio.duration)) return;
    const percent = (this.audio.currentTime / this.audio.duration) * 100;
    this.progress.style.width = `${percent}%`;
    this.timeEl.textContent = `${formatTime(this.audio.currentTime)} / ${formatTime(this.audio.duration)}`;
  }

  async loadFile(file) {
    this.stop();
    const url = URL.createObjectURL(file);
    this.audio.src = url;
    await this.audio.load();
    this.updateMeta(`${file.name} (${Math.round(file.size / 1024)}KB)`);
  }

  async loadDemo() {
    this.stop();
    const demoUrl = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_f4671a8adf.mp3?filename=cool-vibe-11486.mp3";
    this.audio.src = demoUrl;
    await this.audio.load();
    this.updateMeta("Demo: Cool Vibe (Pixabay)");
  }

  async toggle() {
    await audioCtx.resume();
    if (this.audio.paused) {
      await this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.updateProgress();
  }

  updateMeta(text) {
    this.metaEl.textContent = text;
  }
}

const deckA = new Deck("A");
const deckB = new Deck("B");

const crossfader = document.getElementById("crossfader");
function updateCrossfader() {
  const v = Number(crossfader.value);
  const aGain = Math.cos(v * 0.5 * Math.PI);
  const bGain = Math.cos((1 - v) * 0.5 * Math.PI);
  deckA.gain.gain.value = aGain * deckA.level;
  deckB.gain.gain.value = bGain * deckB.level;
}
crossfader.addEventListener("input", updateCrossfader);
updateCrossfader();

const masterGainControl = document.getElementById("masterGain");
masterGainControl.addEventListener("input", (ev) => {
  masterGain.gain.value = Number(ev.target.value);
});

const masterTilt = document.getElementById("masterTilt");
masterTilt.addEventListener("input", (ev) => {
  tiltFilter.gain.value = Number(ev.target.value);
});

document.getElementById("globalDelay").addEventListener("input", (ev) => {
  delayOut.gain.value = Number(ev.target.value);
});

document.getElementById("bpmNudge").addEventListener("input", (ev) => {
  const factor = 1 + Number(ev.target.value) / 100;
  deckA.audio.playbackRate = factor;
  deckB.audio.playbackRate = factor;
});

document.getElementById("resetSession").addEventListener("click", () => {
  deckA.stop();
  deckB.stop();
  deckA.audio.src = "";
  deckB.audio.src = "";
  deckA.updateMeta("אין קובץ נטען");
  deckB.updateMeta("אין קובץ נטען");
  document.querySelectorAll("input[type=range]").forEach((el) => {
    el.value = el.defaultValue;
    el.dispatchEvent(new Event("input"));
  });
  document.querySelectorAll("input[type=checkbox]").forEach((el) => {
    el.checked = el.defaultChecked;
    el.dispatchEvent(new Event("change"));
  });
});

function drawMeter() {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);
  masterMeterCtx.clearRect(0, 0, masterMeterCanvas.width, masterMeterCanvas.height);
  const barWidth = (masterMeterCanvas.width / bufferLength) * 2.5;
  let x = 0;
  for (let i = 0; i < bufferLength; i += 2) {
    const value = dataArray[i];
    const barHeight = (value / 255) * masterMeterCanvas.height;
    const gradient = masterMeterCtx.createLinearGradient(0, 0, 0, masterMeterCanvas.height);
    gradient.addColorStop(0, "#5cf3f2");
    gradient.addColorStop(1, "#ab7bff");
    masterMeterCtx.fillStyle = gradient;
    masterMeterCtx.fillRect(x, masterMeterCanvas.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
  requestAnimationFrame(drawMeter);
}

drawMeter();
