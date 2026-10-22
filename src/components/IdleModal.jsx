import { useEffect, useState, useRef } from "react";
import { Mic, X } from "lucide-react";
import { speakText } from "../utils/audio";

export function IdleModal({ isOpen, onClose, onNavigate, onLogout, isHighContrast }) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      speakText("Are you still there? You can say, Send Money, Check Balance, or Close App.");
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-NG";

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript.toLowerCase();
          
          if (transcript.includes("send") || transcript.includes("pay")) {
            onNavigate('payment');
            onClose();
          } else if (transcript.includes("balance")) {
            speakText("Please look at your screen for your balance.");
            onClose();
          } else if (transcript.includes("close") || transcript.includes("switch off") || transcript.includes("logout")) {
            onLogout();
            onClose();
          } else {
            speakText("I didn't catch that. Please try again.");
            onClose();
          }
          setIsListening(false);
        };
        
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
        try { recognition.start(); } catch {}
      }
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [isOpen, onClose, onNavigate, onLogout]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
      <div className={`rounded-3xl w-full max-w-sm p-6 shadow-2xl relative text-center ${isHighContrast ? "bg-black border-2 border-yellow-400 text-yellow-400" : "bg-white"}`}>
        <button onClick={onClose} className={`absolute top-4 right-4 p-2 rounded-full ${isHighContrast ? "bg-neutral-800 text-yellow-400" : "bg-gray-100"}`}>
          <X size={16} />
        </button>
        
        <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all ${isListening ? (isHighContrast ? "bg-yellow-400 text-black animate-pulse" : "bg-teal-100 text-teal-600 animate-pulse") : (isHighContrast ? "bg-neutral-800" : "bg-gray-100")}`}>
          <Mic className="w-10 h-10" />
        </div>
        
        <h2 className={`text-xl font-bold mb-2 ${isHighContrast ? "text-yellow-400" : "text-gray-900"}`}>
          Are you still there?
        </h2>
        <p className={`text-sm mb-6 ${isHighContrast ? "text-yellow-200" : "text-gray-500"}`}>
          Say "Send Money", "Check Balance", or "Close App"
        </p>

        <button 
          onClick={onClose} 
          className={`w-full py-3 rounded-xl font-bold ${isHighContrast ? "bg-yellow-400 text-black" : "bg-gray-100 text-gray-700"}`}
        >
          I'm still here
        </button>
      </div>
    </div>
  );
}