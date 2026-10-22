import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { playClickTone, speakText } from '../utils/audio';
import { getT } from '../lib/translations';

export function AutoVoiceAssistant({
  language, isVoiceAutomatedEnabled, isLoggedIn,
  onVoiceLogin, onVoiceTransfer, onVoiceOpenSettings, onVoiceCheckBalance, onLogout
}) {
  const [isListening, setIsListening] = useState(false);
  const [lastSpoken, setLastSpoken] = useState('');
  const recognitionRef = useRef(null);
  const cancelRef = useRef(false);
  const hasGreetedRef = useRef(false);
  const t = getT(language);

  const ttsLang = language === 'en' ? 'en-NG' : `${language}-NG`;

  useEffect(() => {
    if (!isVoiceAutomatedEnabled || !isLoggedIn) return;
    if (hasGreetedRef.current) return;
    hasGreetedRef.current = true;
    setTimeout(() => {
      speakText("You are on the homepage. You can say: Send Money, Check Balance, Edit AccessFlow, or Close App.", ttsLang);
    }, 600);
  }, [isLoggedIn, isVoiceAutomatedEnabled, ttsLang]);

  useEffect(() => {
    if (!isVoiceAutomatedEnabled || !isLoggedIn) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    cancelRef.current = false;
    let recognition = null;

    const handleResult = (transcript) => {
      setLastSpoken(transcript);
      const lower = transcript.toLowerCase();

      if (lower.includes('balance') || lower.includes('money')) {
        onVoiceCheckBalance();
      } else if (lower.includes('send') || lower.includes('transfer') || lower.includes('pay')) {
        speakText("Opening transfer page.", ttsLang);
        onVoiceTransfer();
      } else if (lower.includes('settings') || lower.includes('edit') || lower.includes('access')) {
        speakText("Opening settings.", ttsLang);
        onVoiceOpenSettings();
      } else if (lower.includes('close') || lower.includes('logout') || lower.includes('switch')) {
        speakText("Closing app. Goodbye.", ttsLang);
        setTimeout(onLogout, 1500);
      }
    };

    const start = () => {
      if (cancelRef.current) return;
      recognition = new SR();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-NG';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => handleResult(event.results[0][0].transcript);
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => {
        setIsListening(false);
        if (!cancelRef.current) setTimeout(start, 700);
      };
      try { recognition.start(); } catch {}
    };

    const timer = setTimeout(start, 1200);
    return () => {
      cancelRef.current = true;
      clearTimeout(timer);
      if (recognition) {
        recognition.onend = null;
        try { recognition.stop(); } catch {}
      }
    };
  }, [isVoiceAutomatedEnabled, isLoggedIn, ttsLang, onVoiceCheckBalance, onVoiceTransfer, onVoiceOpenSettings, onLogout]);

  if (!isVoiceAutomatedEnabled) return null;

  const toggleMic = () => {
    playClickTone();
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    if (isListening) {
      try { recognitionRef.current?.stop(); } catch {}
      setIsListening(false);
    } else {
      const r = new SR();
      r.lang = 'en-NG';
      r.continuous = false;
      r.onstart = () => setIsListening(true);
      r.onend = () => setIsListening(false);
      r.onresult = (e) => setLastSpoken(e.results[0][0].transcript);
      try { r.start(); recognitionRef.current = r; } catch {}
    }
  };

  return (
    <aside className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-xs px-2 pointer-events-none">
      <div className="pointer-events-auto rounded-2xl bg-slate-900/95 backdrop-blur-md border border-emerald-500/40 p-2.5 shadow-2xl flex items-center justify-between gap-2.5 text-white">
        <div className="flex items-center gap-2">
          <button onClick={toggleMic} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isListening ? 'bg-emerald-500 text-slate-950 animate-pulse ring-4 ring-emerald-500/30' : 'bg-slate-800 text-slate-300'}`}>
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>
          <div className="text-left">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-white">Voice Banking</span>
              <span className="text-[9px] font-mono px-1 rounded bg-emerald-500/20 text-emerald-400 uppercase">{language}</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
              {isListening ? 'Listening...' : (lastSpoken ? `"${lastSpoken}"` : 'Voice active — speak anytime')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-0.5 h-3 shrink-0 pr-1">
          <span className={`w-1 bg-emerald-400 rounded-full ${isListening ? 'h-3 animate-bounce' : 'h-1'}`} />
          <span className={`w-1 bg-emerald-400 rounded-full delay-75 ${isListening ? 'h-4 animate-bounce' : 'h-1'}`} />
          <span className={`w-1 bg-emerald-400 rounded-full delay-150 ${isListening ? 'h-2 animate-bounce' : 'h-1'}`} />
        </div>
      </div>
    </aside>
  );
}