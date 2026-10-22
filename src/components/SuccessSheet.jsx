import { Check, X, Volume2, AlertTriangle } from "lucide-react";
import { speakText } from "../utils/audio";
import { getT } from "../lib/translations";
import { playAIVoice } from '../utils/aiVoice';

export function SuccessSheet({ open, receipt, afOn, preferences, onClose, lang }) {
  const isVoiceActive = afOn && preferences?.tts;
  const isHighContrast = afOn && preferences?.highContrast;
  const t = getT(lang);

  if (!open || !receipt) return null;

  // ERROR STATE
  if (receipt.error) {
    return (
      <div className="absolute inset-0 z-50 flex flex-col justify-end">
        <button onClick={onClose} className="absolute inset-0 bg-black/60" />
        
        <div className={`relative max-h-[88%] rounded-t-[2rem] p-6 pb-10 ${isHighContrast ? "bg-black text-red-500 border-t-2 border-red-500" : "bg-white text-slate-900"}`}>
          <button onClick={onClose} className={`absolute top-4 right-4 p-2 rounded-full ${isHighContrast ? "bg-neutral-800 text-red-500" : "bg-slate-100 text-slate-600"}`}>
            <X size={20} />
          </button>

          <div className={`mx-auto mb-4 h-1.5 w-10 rounded-full ${isHighContrast ? "bg-red-500" : "bg-slate-200"}`} />

          <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full mt-4 mb-4 ${isHighContrast ? "bg-red-500 text-black" : "bg-red-100 text-red-600"}`}>
            <AlertTriangle className="h-8 w-8 text-inherit" strokeWidth={3} />
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className={`text-center text-2xl font-extrabold ${isHighContrast ? "text-red-500" : "text-red-600"}`}>
              {t.transactionFailed}
            </h2>
          </div>
          
          <p className={`text-center text-sm mb-6 ${isHighContrast ? "text-red-200" : "text-slate-500"}`}>
            {receipt.message}
          </p>

          <button 
            onClick={onClose} 
            className={`w-full mt-6 rounded-2xl py-4 font-extrabold ${isHighContrast ? "bg-red-500 !text-black" : "bg-red-600 text-white"}`}
          >
            {t.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  // SUCCESS STATE
  const formattedAmount = `₦${(Number(receipt.amount) || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handlePlayAudio = () => {
  if (isVoiceActive) {
    playAIVoice(
      `${t.transferSuccess} ${formattedAmount} ${t.to} ${receipt.name} at ${receipt.bank}. ${t.reference}: ${receipt.ref}.`,
      lang
    );
  }
};

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <button onClick={onClose} className="absolute inset-0 bg-black/60" />
      
      <div className={`relative max-h-[88%] rounded-t-[2rem] p-6 pb-10 ${isHighContrast ? "bg-black text-yellow-400 border-t-2 border-yellow-400" : "bg-white text-slate-900"}`}>
        
        <button onClick={onClose} className={`absolute top-4 right-4 p-2 rounded-full ${isHighContrast ? "bg-neutral-800 text-yellow-400" : "bg-slate-100 text-slate-600"}`}>
          <X size={20} />
        </button>

        <div className={`mx-auto mb-4 h-1.5 w-10 rounded-full ${isHighContrast ? "bg-yellow-400" : "bg-slate-200"}`} />

        <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full mt-4 mb-4 ${isHighContrast ? "bg-yellow-400 text-black" : "bg-green-100 text-green-600"}`}>
          <Check className="h-8 w-8 text-inherit" strokeWidth={3} />
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-1">
          <h2 className={`text-center text-2xl font-extrabold ${isHighContrast ? "text-yellow-400" : "text-slate-900"}`}>
            {t.transferSuccess}
          </h2>
          {isVoiceActive && (
            <button 
              onClick={handlePlayAudio} 
              className={`p-1.5 rounded-full transition-colors ${isHighContrast ? "bg-neutral-800 text-yellow-400" : "bg-emerald-50 text-emerald-600"}`}
            >
              <Volume2 size={20} />
            </button>
          )}
        </div>
        
        <p className={`text-center text-sm mb-6 ${isHighContrast ? "text-yellow-200" : "text-slate-500"}`}>
          {formattedAmount} {t.to} <span className={`font-bold ${isHighContrast ? "text-yellow-400" : "text-slate-900"}`}>{receipt.name}</span>
        </p>

        <dl className={`mt-5 rounded-2xl border p-4 text-sm ${isHighContrast ? "bg-black border-yellow-400" : "bg-slate-50 border-slate-100"}`}>
          <div className={`flex items-center justify-between border-b py-2 ${isHighContrast ? "border-yellow-400/30" : "border-slate-200"}`}>
            <dt className={isHighContrast ? "text-yellow-200" : "text-slate-500"}>{t.reference}</dt>
            <dd className={`font-bold font-mono text-xs ${isHighContrast ? "text-yellow-400" : "text-slate-900"}`}>{receipt.ref}</dd>
          </div>
          <div className={`flex items-center justify-between border-b py-2 ${isHighContrast ? "border-yellow-400/30" : "border-slate-200"}`}>
            <dt className={isHighContrast ? "text-yellow-200" : "text-slate-500"}>{t.time}</dt>
            <dd className={`font-bold ${isHighContrast ? "text-yellow-400" : "text-slate-900"}`}>{receipt.time}</dd>
          </div>
          <div className={`flex items-center justify-between border-b py-2 ${isHighContrast ? "border-yellow-400/30" : "border-slate-200"}`}>
            <dt className={isHighContrast ? "text-yellow-200" : "text-slate-500"}>{t.bank}</dt>
            <dd className={`font-bold ${isHighContrast ? "text-yellow-400" : "text-slate-900"}`}>{receipt.bank}</dd>
          </div>
          <div className="flex items-center justify-between py-2 last:pb-0">
            <dt className={isHighContrast ? "text-yellow-200" : "text-slate-500"}>{t.amount}</dt>
            <dd className={`font-bold ${isHighContrast ? "text-yellow-400" : "text-slate-900"}`}>{formattedAmount}</dd>
          </div>
        </dl>

        <button 
          onClick={onClose} 
          className={`w-full mt-6 rounded-2xl py-4 font-extrabold ${isHighContrast ? "bg-yellow-400 !text-black" : "bg-[#123628] text-white"}`}
        >
          {t.done}
        </button>

      </div>
    </div>
  );
}