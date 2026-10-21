import { useEffect, useState } from "react";
import { Banknote, Check, ThumbsUp, Volume2, Fingerprint } from "lucide-react";
import { COPY, formatNaira } from "../lib/accessflow";
import { speak } from "../hooks/use-speech";

export function SuccessSheet({ open, receipt, afOn, activeProfiles, lang, preferences, onClose }) {
  // ... existing logic ...
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (open) {
      // Reset verification state on new open
      setIsVerified(false);
      setIsVerifying(false);
    }
  }, [open]);

  function handleBiometricVerify() {
    setIsVerifying(true);
    if (isVI && preferences.tts) speak(t.scanningFingerprint, "en-NG");
    
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      if (isVI && preferences.tts) speak(t.biometricSuccess, "en-NG");
    }, 2000);
  }

  if (!open || !receipt) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <button onClick={onClose} className="af-fade absolute inset-0 bg-black/60" />
      <div className="af-sheet relative max-h-[88%] overflow-y-auto rounded-t-[2rem] bg-background p-6 text-foreground [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" />

        {/* ... (Receipt visual logic remains the same) ... */}
        
        {/* Biometric Action Bottom Area */}
        <div className="mt-6 border-t border-border pt-4">
          {!isVerified ? (
            <button 
              onClick={handleBiometricVerify} 
              disabled={isVerifying}
              className={`w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-extrabold text-primary-foreground transition-all ${isVerifying ? "bg-muted text-muted-foreground" : "bg-primary active:opacity-90"}`}
            >
              <Fingerprint className={isVerifying ? "animate-pulse" : ""} />
              {isVerifying ? t.scanningFingerprint : t.verifyBiometrics}
            </button>
          ) : (
            <button 
              onClick={onClose} 
              className={`w-full rounded-2xl bg-success text-white font-extrabold active:opacity-90 py-4 text-base`}
            >
              {t.done}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}