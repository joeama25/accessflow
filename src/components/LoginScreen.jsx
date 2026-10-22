import { useState, useEffect, useRef } from "react";
import { Mic, ShieldCheck, ScanFace, ChevronDown, Globe } from "lucide-react";
import { getT } from "../lib/translations";
import { LANGS, MOCK_USERS } from "../data";
import { speakText } from "../utils/audio";
import { KeyPad } from "./KeyPad";

export function LoginScreen({ afOn, activeProfiles, lang, preferences, onLangChange, onLogin }) {
  const isLang = afOn && activeProfiles.includes("lang");
  const isMotor = afOn && activeProfiles.includes("motor");

  const t = getT(isLang ? lang : 'en');
  const isHighContrast = afOn && preferences?.highContrast;
  const ttsOn = afOn && preferences?.tts;
  const fullyOn = afOn && preferences?.fullyVoiceAutomated;
  const voiceOn = ttsOn || fullyOn;
  const ttsLang = lang === 'en' ? 'en-NG' : `${lang}-NG`;

  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isScanningFace, setIsScanningFace] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const loginHandledRef = useRef(false);
useEffect(() => {
  if (!voiceOn) return;
  const greeting = fullyOn
    ? 'Welcome to Astra. How would you like to log in? Say "Face ID" to scan your face, or say your 4 digit PIN.'
    : 'Welcome to Astra. Enter your 4 digit PIN using the keypad. Tap any button and I will read it.';

  // Speak after 400ms
  const timer = setTimeout(() => speakText(greeting, ttsLang), 400);

  // If they tap the screen (like trying to find a button), speak immediately
  const retry = () => speakText(greeting, ttsLang);
  window.addEventListener('pointerdown', retry);
  window.addEventListener('keydown', retry);
  window.addEventListener('touchstart', retry);

  return () => {
    clearTimeout(timer);
    window.removeEventListener('pointerdown', retry);
    window.removeEventListener('keydown', retry);
    window.removeEventListener('touchstart', retry);
  };
}, [voiceOn, fullyOn, ttsLang]);


useEffect(() => {
  if (!fullyOn) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;

  let cancelled = false;
  let recognition = null;

  const handleTranscript = (transcript) => {
    if (loginHandledRef.current) return;
    const lower = transcript.toLowerCase();
    console.log('[login-voice] heard:', lower);

    if (lower.includes('face') || lower.includes('scan')) {
      loginHandledRef.current = true;
      cancelled = true;
      if (recognition) {
        recognition.onend = null;
        try { recognition.stop(); } catch {}
      }
      handleFaceScan();
      return;
    }

    if ((lower.includes('pin') || lower.includes('code')) && !/\d|zero|one|two|three|four|five|six|seven|eight|nine/.test(lower)) {
      speakText('Please say your 4 digit PIN. For example: one two three four.', ttsLang);
      return;
    }

    const numberMap = { zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9' };
    let digits = '';
    lower.split(/\s+/).forEach(w => {
      if (numberMap[w]) digits += numberMap[w];
      else if (/^\d+$/.test(w)) digits += w;
    });

    if (!digits) {
      speakText('Say Face ID to scan your face, or say your 4 digit PIN.', ttsLang);
      return;
    }

    const newPin = digits.slice(0, 4);
    setPin(newPin);

    if (newPin.length === 4) {
      loginHandledRef.current = true;
      cancelled = true;
      if (recognition) {
        recognition.onend = null;
        try { recognition.stop(); } catch {}
      }
      setTimeout(() => {
        const user = MOCK_USERS[newPin];
        if (user) {
          speakText(`Welcome back ${user.name}. Logging you in.`, ttsLang);
          onLogin({ ...user, pin: newPin });
        } else {
          loginHandledRef.current = false;
          cancelled = false;
          speakText(t.voiceInvalidPin || 'Invalid PIN. Please try again.', ttsLang);
          setPin('');
          start();
        }
      }, 700);
    } else {
      speakText(`I heard ${newPin.length} digits. Continue.`, ttsLang);
    }
  };

  const start = () => {
    if (cancelled || loginHandledRef.current) return;
    recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-NG';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => handleTranscript(e.results[0][0].transcript);
    recognition.onerror = (e) => {
      setIsListening(false);
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        cancelled = true;
        speakText('Microphone access is blocked. Allow it in your browser settings.', 'en-NG');
      }
    };
    recognition.onend = () => {
      setIsListening(false);
      if (!cancelled && !loginHandledRef.current) setTimeout(start, 500);
    };
    try { recognition.start(); } catch {}
  };

  const timer = setTimeout(start, 1500);
  return () => {
    cancelled = true;
    clearTimeout(timer);
    if (recognition) {
      recognition.onend = null;
      try { recognition.stop(); } catch {}
    }
  };
}, [fullyOn, ttsLang, t]);
function handleFaceScan() {
  setIsScanningFace(true);
  if (voiceOn) speakText('Face ID selected. Please raise your phone to your face.', ttsLang);
  setTimeout(() => {
    setIsScanningFace(false);
    loginHandledRef.current = true;
    const user = MOCK_USERS['1234'];
    if (voiceOn) speakText(`Face recognised. Logging you in as ${user.name}.`, ttsLang);
    onLogin({ ...user, pin: '1234' });
  }, 2500);
}
  function submitPin() {
    const user = MOCK_USERS[pin];
    if (user) {
      loginHandledRef.current = true;
      if (voiceOn) speakText(`Welcome back ${user.name}`, ttsLang);
      onLogin({ ...user, pin });
    } else {
      setError("Invalid PIN. Try 1234");
      setPin("");
      if (voiceOn) speakText(t.voiceInvalidPin || "Invalid PIN.", ttsLang);
    }
  }

  function press(d) {
    if (pin.length < 4) {
      setPin(pin + d);
      setError("");
      if (voiceOn) speakText(d, ttsLang);
    }
  }

  return (
    <div className={`af-screen-enter flex min-h-0 flex-1 flex-col px-6 pb-8 relative transition-colors ${isHighContrast ? "bg-black" : "bg-white"}`}>
      {isScanningFace && (
        <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center text-white backdrop-blur-sm">
          <ScanFace className="h-24 w-24 animate-pulse text-teal-400 mb-4" />
          <p className="text-xl font-bold animate-pulse">Scanning face...</p>
        </div>
      )}

      {isLang && (
        <div className="absolute top-4 right-4 z-20">
          <div className="relative">
            <select
              value={lang} onChange={(e) => onLangChange(e.target.value)}
              className={`appearance-none rounded-full border py-1.5 pl-8 pr-7 text-[11px] font-bold outline-none focus:ring-2 cursor-pointer ${isHighContrast ? "bg-black border-yellow-400 text-yellow-400" : "bg-muted border-border text-foreground focus:ring-primary"}`}
            >
              <option value="" disabled>Language</option>
              {LANGS.map((l) => <option key={l.id} value={l.id}>{l.native}</option>)}
            </select>
            <Globe className={`absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none ${isHighContrast ? "text-yellow-400" : "text-muted-foreground"}`} />
            <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none ${isHighContrast ? "text-yellow-400" : "text-muted-foreground"}`} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col items-center justify-center gap-2 mt-8">
        {fullyOn && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${isListening ? "bg-teal-100 text-teal-700 animate-pulse" : "bg-gray-100 text-gray-500"}`}>
            <Mic size={16} />
            <span className="text-xs font-bold">{isListening ? "Listening..." : "Ready"}</span>
          </div>
        )}

        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${isHighContrast ? "bg-yellow-400 text-black" : "bg-[#123628] text-white"}`}>
          <ShieldCheck className="h-7 w-7" />
        </div>

        <h1 className={`text-center font-bold ${preferences?.largeText ? "text-2xl" : "text-xl"} ${isHighContrast ? "text-yellow-400" : "text-gray-900"}`}>
          {t.enterPin}
        </h1>

        {error ? (
          <p className="text-sm font-bold text-red-500">{error}</p>
        ) : (
          <p className={`text-sm ${isHighContrast ? "text-yellow-200" : "text-gray-500"}`}>{t.your4DigitPin}</p>
        )}

        <div className="mt-3 flex gap-4 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`h-3.5 w-3.5 rounded-full transition-all ${i < pin.length ? (isHighContrast ? "bg-yellow-400 scale-110" : "bg-[#123628] scale-110") : (isHighContrast ? "bg-neutral-800 border border-yellow-400" : "border border-gray-200 bg-white")}`} />
          ))}
        </div>

        <button
          onClick={handleFaceScan}
          className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold border active:opacity-80 relative ${isHighContrast ? "bg-black border-yellow-400 text-yellow-400" : "bg-[#f3f8f5] text-[#123628] border-[#123628]"}`}
        >
          <ScanFace size={16} /> Face ID Login
          <span className={`absolute -right-2 -top-2 text-[8px] px-1 rounded font-bold uppercase tracking-wider ${isHighContrast ? "bg-yellow-400 text-black" : "bg-[#a7f3d0] text-[#065f46]"}`}>Demo</span>
        </button>
      </div>

      <KeyPad
        onDigit={press}
        onDelete={() => {
          setPin((p) => p.slice(0, -1));
          if (voiceOn) speakText("Deleted", ttsLang);
        }}
        isLarge={isMotor && preferences?.largeTargets}
        isHighContrast={isHighContrast}
      />

      <button
        onClick={submitPin}
        disabled={pin.length !== 4}
        className={`mt-6 w-full py-4 rounded-2xl font-bold transition-all ${
          pin.length === 4
            ? (isHighContrast ? "bg-yellow-400 !text-black" : "bg-[#123628] text-white shadow-lg")
            : (isHighContrast ? "bg-neutral-900 text-neutral-500" : "bg-gray-100 text-gray-400")
        }`}
      >
        Login
      </button>
    </div>
  );
}