import { useEffect, useState } from "react";
import { Mic, ShieldCheck, ScanFace, ChevronDown, Globe } from "lucide-react";
import { COPY, LANGS } from "../lib/accessflow"; 
import { speak } from "../hooks/use-speech";
import { KeyPad } from "./KeyPad";
import { SpeakerButton } from "./bits";

export function LoginScreen({ afOn, activeProfiles, lang, preferences, onLangChange, onUnlock }) {
  const isLang = afOn && activeProfiles.includes("lang");
  const isVI = afOn && activeProfiles.includes("vi");
  const isMotor = afOn && activeProfiles.includes("motor");
  
  const t = isLang ? (COPY[lang] || COPY.en) : COPY.en;

  const [pin, setPin] = useState("");
  const [checking, setChecking] = useState(false);
  const [listening, setListening] = useState(false);
  const [isScanningFace, setIsScanningFace] = useState(false);

  // Auto-trigger Face ID for Visually Impaired users
  useEffect(() => {
    if (isVI && preferences.tts) {
      speak(t.faceIdPrompt, "en-NG");
      const timer = setTimeout(() => {
        handleFaceScan();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVI, preferences.tts, t.faceIdPrompt]);

  function handleFaceScan() {
    setIsScanningFace(true);
    if (isVI && preferences.tts) speak(t.scanningFace, "en-NG");
    
    setTimeout(() => {
      setIsScanningFace(false);
      if (isVI && preferences.tts) speak(t.faceSuccess, "en-NG");
      setTimeout(onUnlock, 1500); 
    }, 2500);
  }

  useEffect(() => {
    if (pin.length !== 4) { setChecking(false); return; }
    setChecking(true);
    const id = setTimeout(onUnlock, 650);
    return () => clearTimeout(id);
  }, [pin, onUnlock]);

  useEffect(() => {
    if (isVI && preferences.tts) speak(t.pinPrompt, "en-NG");
  }, [isVI, preferences.tts, t.pinPrompt]);

  function press(d) {
    if (checking) return;
    setPin((p) => (p.length < 4 ? p + d : p));
    if (isVI && preferences.tts) speak(d, "en-NG");
  }

  function dictate() {
    if (!(isMotor && preferences.voiceInput)) return;
    setListening(true);
    setTimeout(() => { setListening(false); setPin("2046"); }, 1600);
  }

  return (
    <div className="af-screen-enter flex min-h-0 flex-1 flex-col px-6 pb-8 relative">
      
      {/* Mock Face Scanner Modal */}
      {isScanningFace && (
        <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center text-white">
          <ScanFace className="h-24 w-24 animate-pulse text-primary mb-4" />
          <p className="text-xl font-bold animate-pulse">{t.scanningFace}</p>
        </div>
      )}

      {/* Compact Language Dropdown with Placeholder */}
      {isLang && (
        <div className="absolute top-4 right-4 z-20">
          <div className="relative">
            <select 
              value={lang}
              onChange={(e) => onLangChange(e.target.value)}
              className="appearance-none rounded-full border border-border bg-muted py-1.5 pl-8 pr-7 text-[11px] font-bold text-foreground outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="" disabled>Language</option>
              {LANGS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.native}
                </option>
              ))}
            </select>
            <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      )}
      
      <div className="flex flex-1 flex-col items-center justify-center gap-2 mt-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><ShieldCheck className="h-7 w-7" /></div>
        <div className="flex items-center gap-2">
          <h1 className={`text-center font-bold text-foreground ${isVI && preferences.largeText ? "text-2xl" : "text-xl"}`}>{t.pinPrompt}</h1>
          {isVI && preferences.tts && <SpeakerButton label={t.pinPrompt} onSpeak={() => speak(t.pinPrompt, "en-NG")} />}
        </div>
        <p className="text-sm text-muted-foreground">{t.pinHint}</p>
        
        <button 
          onClick={handleFaceScan}
          className="mt-4 flex items-center gap-2 rounded-full bg-accent text-primary px-4 py-2 text-sm font-bold border border-primary"
        >
          <ScanFace size={16} /> Face ID Login
        </button>

        <div className="mt-3 flex gap-3">
          {[0, 1, 2, 3].map((i) => <span key={i} className={`h-3.5 w-3.5 rounded-full ${i < pin.length ? "bg-primary" : "border border-border bg-muted"}`} />)}
        </div>
      </div>

      {isMotor && preferences.voiceInput && (
        <button onClick={dictate} className={`mx-auto mb-4 flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-lg font-extrabold text-primary-foreground active:opacity-90 ${listening ? "af-pulse" : ""}`}>
          <Mic className="h-6 w-6" /> {listening ? t.listening : t.sayPin}
        </button>
      )}
      
      <KeyPad 
        onDigit={press} 
        onDelete={() => setPin((p) => p.slice(0, -1))} 
        isLarge={isMotor && preferences.largeTargets}
      />
      
      {checking && <p className="mt-4 animate-pulse text-center text-sm font-bold text-muted-foreground">Checking…</p>}
    </div>
  );
}