import { useEffect, useState } from "react";
import { ArrowLeft, Banknote, Hash, Mic } from "lucide-react";
import { COPY, DEMO_BALANCE, formatNaira, LANGS } from "../lib/accessflow";
import { speak } from "../hooks/use-speech";
import { KeyPad } from "./KeyPad";
import { ErrorModal, SessionTimer, SpeakerButton } from "./bits";
import { CONTACTS } from "../data";

export function PaymentScreen({ afOn, activeProfiles, lang, preferences, onToggleAf, onBack, onComplete }) {
  const isLang = afOn && activeProfiles.includes("lang");
  const isVI = afOn && activeProfiles.includes("vi");
  const isMotor = afOn && activeProfiles.includes("motor");

  const t = isLang ? (COPY[lang] || COPY.en) : COPY.en;
  const ttsCode = LANGS.find(l => l.id === lang)?.ttsCode || "en-NG";

  const [contactId, setContactId] = useState(null);
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(false);
  
  // Separate states for Dictation vs Global Voice Commands to avoid conflicts
  const [isDictating, setIsDictating] = useState(false);
  const [isListeningCommand, setIsListeningCommand] = useState(false);

  const sessionTotal = (isMotor && preferences.extendedTimeout) ? 300 : 90;
  const [sessionLeft, setSessionLeft] = useState(sessionTotal);
  
  useEffect(() => setSessionLeft(sessionTotal), [sessionTotal]);
  useEffect(() => {
    const id = setInterval(() => setSessionLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const contact = CONTACTS.find((c) => c.id === contactId) ?? null;
  const amountValue = Number(amount || 0);
  const recipientOk = contact !== null || account.length >= 10;
  const canSend = recipientOk && amountValue > 0;

  function handleSend() {
    if (!canSend) return;
    if (amountValue > DEMO_BALANCE) {
      setError(true);
      if (isVI && preferences.tts) speak(`${t.errTitle}. ${t.errMsg}`, ttsCode);
      return;
    }
    onComplete({
      amount: amountValue, name: contact?.name ?? `Account •••• ${account.slice(-4)}`,
      bank: contact?.bank ?? "AccessFlow transfer", avatar: contact?.avatar,
      ref: `AF${Math.floor(100000 + Math.random() * 900000)}`,
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    });
  }

  // 1. Global Voice Commands (Send, Cancel, Numbers)
  function startVoiceCommand() {
    if (isDictating) return; // Don't interrupt dictation
    const w = window;
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SR) return;
    
    setIsListeningCommand(true);
    if (isVI && preferences.tts) speak(t.voiceCommandPrompt || "Say a command", "en-NG");

    try {
      const rec = new SR();
      rec.lang = "en-NG"; // Command parsing uses English to ensure accuracy across all dialects
      rec.interimResults = false;
      
      rec.onresult = (e) => {
        const transcript = (e.results?.[0]?.[0]?.transcript ?? "").toLowerCase();
        
        // Multi-language matching
        if (transcript.includes("send") || transcript.includes("zipu") || transcript.includes("firanse") || transcript.includes("aika")) {
           handleSend(); 
        } else if (transcript.includes("cancel") || transcript.includes("kagbuo") || transcript.includes("fagile") || transcript.includes("soke") || transcript.includes("back")) {
           onBack();
        } else {
           // Try to parse digits if they said a number
           const digits = (transcript.match(/\d/g) ?? []).join("");
           if (digits) setAmount(digits);
        }
        setIsListeningCommand(false);
      };
      
      rec.onerror = () => setIsListeningCommand(false);
      rec.start();
      setTimeout(() => { try { rec.stop(); } catch {} }, 4000);
    } catch {
      setIsListeningCommand(false);
    }
  }

  // 2. Amount Dictation (Motor Skills)
  function dictate() {
    if (!(isMotor && preferences.voiceInput)) return;
    if (isListeningCommand) return;
    
    setIsDictating(true);
    const w = window;
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    let settled = false;
    const finish = (digits) => {
      if (settled) return;
      settled = true;
      setIsDictating(false);
      setAmount((digits && digits.length ? digits : "5000").slice(0, 6));
    };
    if (SR) {
      try {
        const rec = new SR();
        rec.lang = ttsCode; 
        rec.interimResults = false; 
        rec.maxAlternatives = 1;
        rec.onresult = (e) => {
          const transcript = e.results?.[0]?.[0]?.transcript ?? "";
          finish((transcript.match(/\d/g) ?? []).join(""));
        };
        rec.onerror = () => finish();
        rec.start();
        setTimeout(() => { try { rec.stop(); } catch {} finish(); }, 4500);
        return;
      } catch {}
    }
    setTimeout(() => finish(), 1500);
  }

  return (
    <div className="af-screen-enter flex min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between px-5 pt-2 pb-3">
        {/* Added ARIA Label for Screen Readers */}
        <button aria-label="Go back" onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background active:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <SegmentedToggle afOn={afOn} onChange={onToggleAf} />
      </header>

      {/* Voice Command Banner */}
      {(isVI || isMotor) && (
        <div className="px-5 pb-2">
           <button 
             aria-label="Start voice command"
             onClick={startVoiceCommand}
             className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold transition-all ${isListeningCommand ? "border-red-500 text-red-500 animate-pulse bg-red-50" : "border-primary text-primary bg-primary/5"}`}
           >
             <Mic size={18} />
             {isListeningCommand ? t.listening : "Use Voice Commands"}
           </button>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center justify-between">
          <h1 className={`font-extrabold text-foreground ${isMotor && preferences.largeTargets ? "text-2xl" : "text-lg"}`}>{t.sendMoney}</h1>
          {isMotor && preferences.extendedTimeout && <SessionTimer seconds={sessionLeft} label={t.session} />}
        </div>

        <section className="mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-foreground">{t.accountNo}</h2>
            {isVI && preferences.tts && <SpeakerButton label={t.accountNo} onSpeak={() => speak(t.accountNo, ttsCode)} />}
          </div>

          {isLang ? (
            <div className="mt-2 grid grid-cols-3 gap-2.5">
              {CONTACTS.map((c) => (
                <button key={c.id} onClick={() => { setContactId(c.id); setAccount(""); }}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 ${contactId === c.id ? "border-primary bg-accent ring-2 ring-primary" : "border-border bg-muted"}`}
                >
                  <img src={c.avatar} alt={c.name} className="h-14 w-14 rounded-full object-cover" />
                  <span className="text-xs font-extrabold text-foreground">{c.shortName}</span>
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                {CONTACTS.map((c) => (
                  <button key={c.id} onClick={() => { setContactId(c.id); setAccount(""); }}
                    className={`flex w-16 flex-none flex-col items-center gap-1 rounded-2xl border p-1.5 ${contactId === c.id ? "border-primary bg-accent" : "border-transparent"}`}
                  >
                    <img src={c.avatar} alt={c.name} className="h-11 w-11 rounded-full object-cover" />
                    <span className="text-[11px] font-bold text-foreground">{c.shortName}</span>
                  </button>
                ))}
              </div>
              <div className={`mt-1 flex items-center gap-2 rounded-xl border border-border bg-muted px-3 focus-within:ring-2 focus-within:ring-ring ${isMotor && preferences.largeTargets ? "py-4" : "py-3"}`}>
                <Hash className="h-4 w-4 flex-none text-muted-foreground" />
                <input 
                  aria-label={t.accountNo}
                  inputMode="numeric" 
                  value={account} 
                  placeholder="0123456789"
                  onChange={(e) => { setAccount(e.target.value.replace(/\D/g, "").slice(0, 10)); setContactId(null); }}
                  className={`w-full bg-transparent font-bold text-foreground outline-none ${isMotor && preferences.largeTargets ? "text-lg" : "text-base"}`}
                />
              </div>
            </>
          )}
        </section>

        <section className="mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-foreground">{t.amount}</h2>
            <div className="flex gap-2">
              {isVI && preferences.tts && <SpeakerButton label={`${t.amount} ${formatNaira(amountValue)}`} onSpeak={() => speak(`${t.amount}: ${formatNaira(amountValue)} naira`, ttsCode)} />}
              {isMotor && preferences.voiceInput && (
                <button aria-label="Dictate amount" onClick={dictate} className={`inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-extrabold text-primary-foreground ${isDictating ? "af-pulse" : ""}`}>
                  <Mic className="h-4 w-4" /> {isDictating ? t.listening : t.sayAmount}
                </button>
              )}
            </div>
          </div>
          <div className={`mt-2 flex items-center justify-center gap-2 rounded-2xl border border-border bg-muted px-4 ${isMotor && preferences.largeTargets ? "py-7" : "py-4"}`}>
            <Banknote className="h-6 w-6 flex-none text-muted-foreground" />
            <span className={`font-extrabold tracking-tight text-foreground ${isVI && preferences.largeText ? "text-4xl" : isMotor && preferences.largeTargets ? "text-3xl" : "text-2xl"}`}>
              {amount ? formatNaira(amountValue) : "₦0"}
            </span>
          </div>
        </section>

        <div className="mt-4">
          <KeyPad 
            onDigit={(d) => setAmount(a => a.length < 6 ? a + d : a)} 
            onDelete={() => setAmount(a => a.slice(0, -1))} 
            isLarge={isMotor && preferences.largeTargets}
          />
        </div>
      </div>

      <div className="px-5 pb-5 pt-2">
        <button 
          aria-label={t.reviewSend}
          onClick={handleSend} 
          disabled={!canSend}
          className={`w-full rounded-2xl font-extrabold ${isMotor && preferences.largeTargets ? "py-6 text-xl" : "py-4 text-base"} ${canSend ? "bg-primary text-primary-foreground active:opacity-90" : "bg-muted text-muted-foreground"}`}
        >
          {t.reviewSend}
        </button>
      </div>

      {error && <ErrorModal title={t.errTitle} message={t.errMsg} retryLabel={t.retry} onClose={() => setError(false)} />}
    </div>
  );
}

function SegmentedToggle({ afOn, onChange }) {
  return (
    <div className="flex flex-none rounded-full border border-border bg-muted p-1 text-xs font-extrabold">
      <button onClick={() => onChange(false)} className={`rounded-full px-3 py-1.5 ${!afOn ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"}`}>Standard</button>
      <button onClick={() => onChange(true)} className={`rounded-full px-3 py-1.5 ${afOn ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>AccessFlow</button>
    </div>
  );
}