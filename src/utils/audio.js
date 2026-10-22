let audioCtx = null;
let pendingSpeech = null; // Stores blocked speech

function getAudioContext() {
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioCtxClass();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.45);
    });
  } catch {}
}

export function playClickTone() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  } catch {}
}

export function speakText(text, lang = 'en-NG') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;
  console.log('[speakText] %s | %s', lang, JSON.stringify(String(text).slice(0, 60)));

  const speakNow = () => {
    try {
      synth.resume();
      const u = new SpeechSynthesisUtterance(String(text));
      u.lang = lang;
      u.rate = 0.95;
      u.pitch = 1.0;
      u.volume = 1.0;
      const voices = synth.getVoices();
      const prefix = lang.split('-')[0].toLowerCase();
      const voice =
        voices.find(v => v.lang && v.lang.toLowerCase() === lang.toLowerCase()) ||
        voices.find(v => v.lang && v.lang.toLowerCase().startsWith(prefix)) ||
        voices.find(v => v.default) ||
        voices[0];
      if (voice) u.voice = voice;
      
      u.onstart = () => {
        console.log('[speakText] SPEAKING');
        pendingSpeech = null; // Clear queue on success
      };
      
      synth.speak(u);

      // Check if the browser silently blocked it (autoplay policy)
      setTimeout(() => {
        if (!synth.speaking && !synth.pending) {
          console.warn('[speakText] BLOCKED BY BROWSER. Queuing for first tap.');
          pendingSpeech = { text, lang };
        }
      }, 500);

    } catch (e) {
      console.error('[speakText] exception', e);
    }
  };

  const dispatch = () => {
    if (synth.speaking || synth.pending) {
      try { synth.cancel(); } catch {}
      setTimeout(speakNow, 80);
    } else {
      speakNow();
    }
  };

  if (synth.getVoices().length > 0) return dispatch();

  let tries = 0;
  const poll = () => {
    tries++;
    if (synth.getVoices().length > 0 || tries >= 20) dispatch();
    else setTimeout(poll, 100);
  };
  poll();
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch {}
  }
}

// GLOBAL UNLOCK: Play queued speech on the very first user interaction
if (typeof window !== 'undefined') {
  const unlockAndPlay = () => {
    if (pendingSpeech) {
      const { text, lang } = pendingSpeech;
      pendingSpeech = null;
      speakText(text, lang);
    }
  };
  window.addEventListener('pointerdown', unlockAndPlay, { capture: true });
  window.addEventListener('keydown', unlockAndPlay, { capture: true });
  window.addEventListener('touchstart', unlockAndPlay, { capture: true });
}