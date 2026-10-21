import { useState, useEffect } from "react";
import { PhoneFrame } from "./components/PhoneFrame";
import { LoginScreen } from "./components/LoginScreen";
import { HomeScreen } from "./components/HomeScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { PaymentScreen } from "./components/PaymentScreen";
import { SuccessSheet } from "./components/SuccessSheet";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState("home"); // home | settings | payment
  
  // AccessFlow Core State
  const [afOn, setAfOn] = useState(false);
  const [activeProfiles, setActiveProfiles] = useState([]); // Array of profile IDs
  const [lang, setLang] = useState("");
  const [preferences, setPreferences] = useState({
    highContrast: false, largeText: false, tts: false,
    largeTargets: false, voiceInput: false, extendedTimeout: false,
    localDialects: false, simpleText: false
  });
  
  const [receipt, setReceipt] = useState(null);

  // Load settings from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("accessflow_settings");
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setAfOn(p.afOn || false);
        setActiveProfiles(p.activeProfiles || []);
        setLang(p.lang || "en");
        setPreferences(prev => ({ ...prev, ...(p.preferences || {}) }));
      } catch (e) {
        console.error("Failed to parse saved settings", e);
      }
    }
  }, []);

  // Save settings to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("accessflow_settings", JSON.stringify({ afOn, activeProfiles, lang, preferences }));
  }, [afOn, activeProfiles, lang, preferences]);

  // Helper to toggle a specific preference
  const togglePreference = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Logout Function
  const handleLogout = () => {
    setIsLoggedIn(false);
    setView("home");
  };

  // Determine if High Contrast is active
  const isVI = afOn && activeProfiles.includes("vi") && preferences.highContrast;

  return (
    // Outer wrapper stays gray. 
    <div className="min-h-screen flex items-center justify-center bg-gray-200 sm:p-6 font-sans transition-colors">
      
      {/* PhoneFrame receives data-theme. */}
      <PhoneFrame dataAttrs={{ "data-theme": isVI ? "high-contrast" : "default" }}>
        
        {!isLoggedIn ? (
          <LoginScreen 
            afOn={afOn} 
            activeProfiles={activeProfiles} 
            lang={lang} 
            preferences={preferences} 
            onLangChange={setLang} 
            onUnlock={() => setIsLoggedIn(true)} 
          />
        ) : (
          <>
            {view === "home" && (
              <HomeScreen 
                afOn={afOn} 
                activeProfiles={activeProfiles} 
                lang={lang} 
                preferences={preferences} 
                onSend={() => setView("payment")} 
                onSettings={() => setView("settings")} 
                onLogout={handleLogout} // <-- Passed to HomeScreen
              />
            )}
            
            {view === "settings" && (
              <SettingsScreen
                afOn={afOn} 
                activeProfiles={activeProfiles} 
                lang={lang} 
                preferences={preferences}
                onToggleAf={setAfOn} 
                setActiveProfiles={setActiveProfiles} 
                togglePreference={togglePreference}
                onLangChange={setLang} 
                onBack={() => setView("home")}
              />
            )}
            
            {view === "payment" && (
              <PaymentScreen 
                afOn={afOn} 
                activeProfiles={activeProfiles} 
                lang={lang} 
                preferences={preferences} 
                onToggleAf={setAfOn} 
                onBack={() => setView("home")} 
                onComplete={setReceipt} 
              />
            )}
            
            <SuccessSheet 
              open={receipt !== null} 
              receipt={receipt} 
              afOn={afOn} 
              activeProfiles={activeProfiles} 
              lang={lang} 
              preferences={preferences} 
              onClose={() => setReceipt(null)} 
            />
          </>
        )}
      </PhoneFrame>
    </div>
  );
}