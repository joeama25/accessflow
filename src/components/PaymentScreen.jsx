import { useEffect, useState, useRef } from "react";
import { ArrowLeft, ChevronRight, X, Lock, Search, Mic } from "lucide-react";
import { getT } from "../lib/translations";
import { speakText } from "../utils/audio";
import { KeyPad } from "./KeyPad";
import { CONTACTS, MOCK_ACCOUNTS, ALL_RECIPIENTS } from "../data";
import { playAIVoice } from '../utils/aiVoice';

export function PaymentScreen({ user, afOn, activeProfiles, lang, preferences, onToggleAf, onBack, onComplete }) {
  const t = getT(lang);
  const isVoiceActive = afOn && (preferences?.tts || preferences?.fullyVoiceAutomated);
  const isHighContrast = afOn && preferences?.highContrast;
  const isFullyAutomated = afOn && preferences?.fullyVoiceAutomated;
  const isMotor = afOn && activeProfiles.includes("motor");
  const isLarge = isMotor && preferences?.largeTargets;

  const [account, setAccount] = useState("");
  const [resolvedName, setResolvedName] = useState("");
  const [amount, setAmount] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showKeypad, setShowKeypad] = useState(false);
  const [activeField, setActiveField] = useState("amount"); 
  const [showPinConfirm, setShowPinConfirm] = useState(false);
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");

  const accountRef = useRef(null);
  const amountRef = useRef(null);

  const [voiceStep, setVoiceStep] = useState(isFullyAutomated ? 'account' : 'manual');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!isFullyAutomated || voiceStep === 'manual') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (voiceStep === 'account') {
      playAIVoice(t.voiceAccountPrompt, lang);
    } else if (voiceStep === 'amount') {
      playAIVoice(t.voiceAmountPrompt, lang);
    } else if (voiceStep === 'pin') {
      setShowPinConfirm(true);
      playAIVoice(t.voicePinPrompt.replace("{amount}", amount).replace("{name}", resolvedName), lang);
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang === 'en' ? "en-NG" : `${lang}-NG`;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      const numberMap = { zero: "0", one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9" };
      let digits = "";
      
      transcript.split(" ").forEach(w => {
        if (numberMap[w]) digits += numberMap[w];
        else if (/^\d+$/.test(w)) digits += w;
      });

      if (voiceStep === 'account') {
        if (digits.length >= 10) { setAccount(digits.slice(0, 10)); setVoiceStep('amount'); } 
        else { playAIVoice(t.voiceInvalidPin, lang); }
      } 
      else if (voiceStep === 'amount') {
        if (digits.length > 0) { setAmount(digits); setVoiceStep('pin'); } 
        else { playAIVoice(t.voiceAmountPrompt, lang); }
      }
      else if (voiceStep === 'pin') {
        if (digits.length === 4) { setConfirmPin(digits); } 
        else { playAIVoice(t.voicePinPrompt.replace("{amount}", amount).replace("{name}", resolvedName), lang); }
      }
      setIsListening(false);
    };
    
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    try { recognition.start(); } catch {}

    return () => { try { recognition.stop(); } catch {} };
  }, [voiceStep, isFullyAutomated, account, amount, resolvedName, lang, t]);

  useEffect(() => {
    if (account.length > 0) {
      if (account.length === 10) {
        const resolved = MOCK_ACCOUNTS[account];
        if (resolved) { setResolvedName(resolved.name); } 
        else { setResolvedName("Account Not Found"); }
        setShowSearch(false);
      } else {
        setResolvedName("");
        const query = account.toLowerCase();
        const matches = ALL_RECIPIENTS.filter(c => c.name.toLowerCase().includes(query) || c.account.includes(query));
        setSearchResults(matches);
        setShowSearch(true);
      }
    } else {
      setResolvedName("");
      setShowSearch(false);
    }
  }, [account]);

  const amountValue = Number(amount || 0);
  const canSend = resolvedName !== "" && resolvedName !== "Account Not Found" && amountValue > 0;

  const handleInputClick = (field, ref) => {
    setActiveField(field);
    setShowKeypad(true);
    setTimeout(() => {
      if (ref.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  };

  const handleSelectRecipient = (selectedAccount) => {
    setAccount(selectedAccount);
    setShowSearch(false);
    setActiveField("amount"); 
    setShowKeypad(true); 
    setTimeout(() => {
      if (amountRef.current) amountRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  };

  const handleKeypadInput = (digit) => {
    if (isVoiceActive) speakText(digit, lang === 'en' ? "en-NG" : `${lang}-NG`);
    if (activeField === "account") {
      if (account.length >= 10) return;
      setAccount((prev) => prev + digit);
    } else {
      if (amount.length < 6) setAmount((prev) => (prev === "0" ? digit : prev + digit));
    }
  };

  const handleKeypadDelete = () => {
    if (activeField === "account") { setAccount((prev) => prev.slice(0, -1)); } 
    else { setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : "")); }
  };

  function handleReview() {
    if (!canSend) return;
    setShowPinConfirm(true);
    setConfirmPin("");
    setPinError("");
  }

  function handleConfirmPin() {
    if (confirmPin === user.pin) {
      setShowPinConfirm(false);
      if (amountValue > user.balance) {
        onComplete({ error: true, message: t.voiceInsufficient });
        return;
      }
      onComplete({
        amount: amountValue, name: resolvedName,
        bank: MOCK_ACCOUNTS[account]?.bank ?? "AccessFlow transfer", 
        ref: `AF${Math.floor(100000 + Math.random() * 900000)}`,
        time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      });
    } else {
      setPinError(t.incorrectPin);
      setConfirmPin("");
      if (isVoiceActive) playAIVoice(t.incorrectPin, lang);
    }
  }

  useEffect(() => { if (confirmPin.length === 4) handleConfirmPin(); }, [confirmPin]);

  return (
    <div className={`flex flex-col w-full h-full relative overflow-hidden ${isHighContrast ? "bg-black" : "bg-gray-50"}`}>
      
      <header className={`flex items-center justify-between px-5 py-4 border-b shrink-0 z-20 ${isHighContrast ? "bg-black border-yellow-400 text-yellow-400" : "bg-white border-gray-100 text-gray-900"}`}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className={`p-2 -ml-2 rounded-full ${isHighContrast ? "text-yellow-400" : "text-gray-700"}`}><ArrowLeft className={isLarge ? "h-8 w-8" : "h-6 w-6"} /></button>
          <h1 className={`font-bold ${isLarge ? "text-2xl" : "text-lg"}`}>{t.sendMoney}</h1>
        </div>
        {isFullyAutomated && (
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${isListening ? "bg-teal-100 text-teal-700 animate-pulse" : "bg-gray-100 text-gray-500"}`}>
             <Mic size={14} /> {isListening ? "Listening..." : "Ready"}
          </div>
        )}
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-4 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        
        <div ref={accountRef} className={`rounded-2xl p-4 shadow-sm border mb-4 relative z-20 ${isHighContrast ? "bg-black border-yellow-400" : "bg-white border-gray-100"}`}>
          <label className={`block font-bold mb-2 ${isLarge ? "text-lg" : "text-sm"} ${isHighContrast ? "text-yellow-400" : "text-gray-700"}`}>{t.recipientAccount}</label>
          
          <div 
            onClick={() => handleInputClick("account", accountRef)}
            className={`flex items-center gap-2 rounded-xl border px-3 cursor-text transition-all ${isLarge ? "py-5" : "py-3"} ${isHighContrast ? "bg-black border-yellow-400 text-yellow-400" : "bg-gray-50 border-gray-200 text-gray-900"} ${activeField === "account" && showKeypad ? (isHighContrast ? "ring-2 ring-yellow-400" : "border-teal-600 ring-2 ring-teal-100") : ""}`}
          >
            <Search className={`flex-none ${isLarge ? "h-6 w-6" : "h-4 w-4"} ${isHighContrast ? "text-yellow-400" : "text-gray-400"}`} />
            <input readOnly value={account} placeholder={isFullyAutomated ? "Listening..." : "Phone No. / Name"} className={`w-full bg-transparent font-bold outline-none ${isLarge ? "text-xl" : "text-base"} ${isHighContrast ? "text-yellow-400 placeholder-yellow-700" : "text-gray-900 placeholder-gray-400"}`} />
            {account && <button onClick={(e) => { e.stopPropagation(); setAccount(""); }} className={isHighContrast ? "text-yellow-400" : "text-gray-400"}><X size={isLarge ? 24 : 16} /></button>}
          </div>
          
          {resolvedName && <div className={`mt-2 font-bold ${isLarge ? "text-sm" : "text-xs"} ${resolvedName === "Account Not Found" ? "text-red-500" : (isHighContrast ? "text-yellow-400" : "text-teal-700")}`}>{resolvedName}</div>}

          {showSearch && searchResults.length > 0 && (
            <div className={`absolute left-0 right-0 top-full mt-1 border rounded-xl shadow-lg overflow-hidden mx-4 z-30 ${isHighContrast ? "bg-black border-yellow-400" : "bg-white border-gray-100"}`}>
              {searchResults.map(c => (
                <button 
                  key={c.id}
                  onClick={() => handleSelectRecipient(c.account)}
                  className={`w-full flex items-center gap-3 p-3 border-b last:border-0 ${isHighContrast ? "border-yellow-400/30 hover:bg-neutral-900" : "border-gray-50 hover:bg-gray-50 active:bg-gray-100"}`}
                >
                  <img src={c.avatar} alt={c.name} className="h-8 w-8 rounded-full object-cover" />
                  <div className="text-left">
                    <p className={`font-bold text-xs uppercase ${isHighContrast ? "text-yellow-400" : "text-gray-900"}`}>{c.name}</p>
                    <p className={`text-[10px] ${isHighContrast ? "text-yellow-200" : "text-gray-500"}`}>{c.account} • {c.bank}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div ref={amountRef} className={`rounded-2xl p-4 shadow-sm border mb-4 ${isHighContrast ? "bg-black border-yellow-400" : "bg-white border-gray-100"}`}>
          <label className={`block font-bold mb-2 ${isLarge ? "text-lg" : "text-sm"} ${isHighContrast ? "text-yellow-400" : "text-gray-700"}`}>{t.amount}</label>
          
          <div 
            onClick={() => handleInputClick("amount", amountRef)}
            className={`relative flex items-center rounded-xl border cursor-text transition-all ${isLarge ? "py-5" : "py-3"} px-4 ${isHighContrast ? "bg-black border-yellow-400 text-yellow-400" : "bg-gray-50 border-gray-200 text-gray-900"} ${activeField === "amount" && showKeypad ? (isHighContrast ? "ring-2 ring-yellow-400" : "border-teal-600 ring-2 ring-teal-100") : ""}`}
          >
            <span className={`font-extrabold mr-1 ${isLarge ? "text-2xl" : "text-xl"} ${isHighContrast ? "text-yellow-400" : "text-gray-500"}`}>₦</span>
            <input readOnly value={amount ? amountValue.toLocaleString() : ""} placeholder={isFullyAutomated ? "Listening..." : "0"} className={`w-full bg-transparent font-extrabold outline-none ${isLarge ? "text-3xl" : "text-2xl"} ${isHighContrast ? "text-yellow-400 placeholder-yellow-700" : "text-gray-900 placeholder-gray-300"}`} />
            {activeField === "amount" && showKeypad && <span className={`w-0.5 h-6 animate-pulse ml-0.5 ${isHighContrast ? "bg-yellow-400" : "bg-teal-600"}`}></span>}
          </div>
        </div>

        {!account && !showSearch && (
          <div className={`rounded-2xl p-4 shadow-sm border relative z-10 animate-in fade-in ${isHighContrast ? "bg-black border-yellow-400" : "bg-white border-gray-100"}`}>
            <div className={`flex justify-between items-center border-b pb-2 mb-2 ${isHighContrast ? "border-yellow-400/30" : "border-gray-100"}`}>
              <span className={`font-bold border-b-2 pb-2 -mb-[10px] ${isLarge ? "text-lg" : "text-sm"} ${isHighContrast ? "text-yellow-400 border-yellow-400" : "text-teal-600 border-teal-600"}`}>Recents</span>
            </div>
            {CONTACTS.map(c => (
              <button 
                key={c.id} 
                onClick={() => handleSelectRecipient(c.account)}
                className={`w-full flex items-center justify-between border-b last:border-0 transition-colors ${isLarge ? "py-5" : "py-3"} ${isHighContrast ? "border-yellow-400/30 hover:bg-neutral-900" : "border-gray-50 active:bg-gray-50"}`}
              >
                <div className="flex items-center gap-3">
                  <img src={c.avatar} alt={c.name} className={`rounded-full object-cover ${isLarge ? "h-12 w-12" : "h-9 w-9"}`} />
                  <div className="text-left">
                    <p className={`font-bold uppercase ${isLarge ? "text-sm" : "text-xs"} ${isHighContrast ? "text-yellow-400" : "text-gray-900"}`}>{c.name}</p>
                    <p className={`${isLarge ? "text-xs" : "text-[10px]"} ${isHighContrast ? "text-yellow-200" : "text-gray-500"}`}>{c.account}</p>
                  </div>
                </div>
                <ChevronRight size={isLarge ? 24 : 16} className={isHighContrast ? "text-yellow-400" : "text-gray-300"} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={`shrink-0 border-t p-4 z-30 ${isHighContrast ? "bg-black border-yellow-400" : "bg-white border-gray-100"}`}>
        {showKeypad ? (
          <>
            <div className="flex justify-between items-end mb-2">
              <span className={`font-bold ${isLarge ? "text-sm" : "text-xs"} ${isHighContrast ? "text-yellow-400" : "text-gray-500"}`}>
                {t.entering} {activeField === "account" ? t.accountNumber : t.amount}
              </span>
              <button onClick={() => setShowKeypad(false)} className={`font-bold ${isLarge ? "text-sm" : "text-xs"} ${isHighContrast ? "text-yellow-400" : "text-teal-600"}`}>
                {t.done}
              </button>
            </div>
            <KeyPad onDigit={handleKeypadInput} onDelete={handleKeypadDelete} isLarge={isLarge} isHighContrast={isHighContrast} />
          </>
        ) : (
          <button onClick={handleReview} disabled={!canSend} className={`w-full rounded-xl font-extrabold flex items-center justify-between px-6 transition-all ${isLarge ? "py-6 text-xl" : "py-4 text-base"} ${canSend ? (isHighContrast ? "bg-yellow-400 !text-black" : "bg-teal-600 text-white") : "bg-gray-200 text-gray-400"}`}>
            {t.reviewAndSend} <ChevronRight size={isLarge ? 28 : 20} className={canSend && isHighContrast ? "!text-black" : ""} />
          </button>
        )}
      </div>

      {showPinConfirm && (
        <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className={`rounded-3xl w-full max-w-sm p-6 shadow-2xl relative ${isHighContrast ? "bg-black border-2 border-yellow-400 text-yellow-400" : "bg-white"}`}>
            <button onClick={() => setShowPinConfirm(false)} className={`absolute top-4 right-4 p-2 rounded-full ${isHighContrast ? "bg-neutral-800 text-yellow-400" : "bg-gray-100 text-gray-600"}`}><X size={isLarge ? 24 : 16} /></button>
            <div className="flex justify-center mb-4"><div className={`p-3 rounded-full ${isHighContrast ? "bg-yellow-400 text-black" : "bg-teal-50 text-teal-600"}`}><Lock size={isLarge ? 32 : 24} /></div></div>
            
            <h2 className={`font-bold text-center mb-1 ${isLarge ? "text-2xl" : "text-xl"} ${isHighContrast ? "text-yellow-400" : "text-gray-900"}`}>
              {t.reviewConfirm}
            </h2>
            <p className={`text-center mb-6 ${isLarge ? "text-base" : "text-sm"} ${isHighContrast ? "text-yellow-200" : "text-gray-500"}`}>
              {t.sending} <span className="font-bold">₦{amountValue.toLocaleString()}</span> {t.to} <span className="font-bold">{resolvedName}</span>.
            </p>
            
            <div className="flex justify-center gap-4 mb-8">
              {[0, 1, 2, 3].map((i) => <div key={i} className={`rounded-full ${isLarge ? "w-5 h-5" : "w-4 h-4"} ${confirmPin.length > i ? (isHighContrast ? "bg-yellow-400" : "bg-teal-600") : (isHighContrast ? "bg-neutral-800 border border-yellow-400" : "bg-gray-200")}`} />)}
            </div>
            
            {pinError && <p className="text-center text-red-500 text-sm font-bold mb-4">{pinError}</p>}

            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '<'].map((key, i) => {
                if (key === '') return <div key={i} />;
                if (key === '<') return <button key={i} onClick={() => setConfirmPin(p => p.slice(0, -1))} className={`flex items-center justify-center rounded-xl border font-bold ${isLarge ? "py-5" : "py-3"} ${isHighContrast ? "bg-neutral-900 border-yellow-400 text-yellow-400" : "bg-gray-50 border-gray-200 text-gray-700"}`}><X size={isLarge ? 24 : 20} /></button>;
                return (
                  <button 
                    key={i} 
                    onClick={() => {
                      if (isVoiceActive) speakText(key, lang === 'en' ? "en-NG" : `${lang}-NG`); 
                      setConfirmPin(p => p.length < 4 ? p + key : p);
                    }} 
                    className={`flex items-center justify-center rounded-xl border font-bold ${isLarge ? "py-5 text-2xl" : "py-3 text-xl"} ${isHighContrast ? "bg-neutral-900 border-yellow-400 text-yellow-400" : "bg-gray-50 border-gray-200 text-gray-900"}`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}