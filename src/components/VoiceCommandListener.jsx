import { useEffect, useRef, useState } from 'react';
import { Mic } from 'lucide-react';
import { speak } from '../hooks/use-speech';

export function VoiceCommandListener({ afOn, activeProfiles, onNavigate, onLogout }) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  
  const isVI = activeProfiles.includes("vi");
  const isMotor = activeProfiles.includes("motor");
  const shouldListen = afOn && (isVI || isMotor);

  useEffect(() => {
    if (!shouldListen) {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null; // prevent restart loop
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-NG'; // Best for recognizing Nigerian accents/English

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("Voice Command Detected:", transcript);

      // Global Navigation Commands
      if (transcript.includes("home") || transcript.includes("dashboard")) {
        onNavigate('home');
        speak("Going to home", "en-NG");
      } 
      else if (transcript.includes("settings") || transcript.includes("profile")) {
        onNavigate('settings');
        speak("Opening settings", "en-NG");
      }
      else if (transcript.includes("send") || transcript.includes("pay") || transcript.includes("transfer")) {
        onNavigate('payment');
        speak("Opening transfer page", "en-NG");
      }
      else if (transcript.includes("logout") || transcript.includes("log out") || transcript.includes("sign out")) {
        onLogout();
        speak("Logging you out", "en-NG");
      }
    };

    recognition.onend = () => {
      // If the browser stops listening (times out), automatically restart it
      if (shouldListen) {
        try { recognition.start(); } catch (e) {}
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.error("Mic access denied or failed to start");
    }

    return () => {
      recognition.onend = null;
      try { recognition.stop(); } catch(e) {}
    };
  }, [shouldListen, isVI, isMotor, onNavigate, onLogout]);

  if (!shouldListen) return null;

  // Floating Mic Indicator to show the app is actively listening
  return (
    <div className="absolute top-12 right-4 z-[100] flex items-center gap-2">
      <span className="text-[10px] font-bold text-primary bg-accent px-2 py-1 rounded-full border border-primary shadow-sm animate-pulse">
        Listening {isListening ? "🟢" : "🔴"}
      </span>
    </div>
  );
}