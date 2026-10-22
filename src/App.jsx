import { useState, useEffect } from "react";
import { PhoneFrame } from "./components/PhoneFrame";
import { LoginScreen } from "./components/LoginScreen";
import { HomeScreen } from "./components/HomeScreen";
import { BankSettingsScreen } from "./components/BankSettingsScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { PaymentScreen } from "./components/PaymentScreen";
import { SuccessSheet } from "./components/SuccessSheet";
import { AutoVoiceAssistant } from "./components/AutoVoiceAssistant";
import { BiometricModal } from "./components/BiometricModal";
import { IdleModal } from "./components/IdleModal";
import { speakText } from "./utils/audio";

const DEFAULT_PROFILE = {
  isConfigured: false,
  profiles: { visuallyImpaired: false, motorSkills: false, languageBarrier: false },
  visuallyImpaired: { highContrast: false, largerFont: false, fontSizeMultiplier: 1.25, textToVoice: false, fullyVoiceAutomated: false },
  motorSkills: { touchTargets: false, extendedTimeout: false, largerButtons: false },
  languageBarrier: { useLocalDialect: false, selectedDialect: 'en' },
};

const INITIAL_USER = { name: 'Amaka Okafor', initials: 'AO', balance: 250000, account: '4021', pin: '1234', avatar: 'https://i.pravatar.cc/150?u=amaka' };

const INITIAL_TRANSACTIONS = [
  { id: '1', title: 'Transfer to Chidi', bankName: 'GTBank', amount: 5000, direction: 'OUT', recipientOrSender: 'Chidi' },
  { id: '2', title: 'Deposit', bankName: 'Astra MFB', amount: 25000, direction: 'IN', recipientOrSender: 'Self' }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [view, setView] = useState("home");

 const SETTINGS_KEY = 'accessflow_settings_last';

const [settings, setSettings] = useState(() => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { accessFlowActive: false, savedProfile: DEFAULT_PROFILE };
});
  const [receipt, setReceipt] = useState(null);
  const [biometricModal, setBiometricModal] = useState({ isOpen: false, action: () => {} });
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    if (currentUser) {
      localStorage.setItem(`accessflow_settings_${currentUser.pin}`, JSON.stringify(settings));
    }
  } catch {}
}, [settings, currentUser]);

  const isHighContrast = settings.accessFlowActive && settings.savedProfile.isConfigured && settings.savedProfile.visuallyImpaired.highContrast;
  const activeLang = settings.accessFlowActive && settings.savedProfile.languageBarrier.useLocalDialect ? settings.savedProfile.languageBarrier.selectedDialect : 'en';
  const ttsOn = settings.accessFlowActive && settings.savedProfile.isConfigured && settings.savedProfile.visuallyImpaired.textToVoice;
  const isVoiceAutomated = settings.accessFlowActive && settings.savedProfile.isConfigured && settings.savedProfile.visuallyImpaired.fullyVoiceAutomated;
  const speakLang = activeLang === 'en' ? 'en-NG' : `${activeLang}-NG`;

  useEffect(() => {
    const unlock = () => {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC && !window.__afAudioCtx) window.__afAudioCtx = new AC();
        if (window.__afAudioCtx && window.__afAudioCtx.state === 'suspended') window.__afAudioCtx.resume();
        if (window.speechSynthesis) window.speechSynthesis.resume();
      } catch {}
    };
    window.addEventListener('pointerdown', unlock, { capture: true, once: true });
    window.addEventListener('keydown', unlock, { capture: true, once: true });
    window.addEventListener('touchstart', unlock, { capture: true, once: true });
    window.addEventListener('click', unlock, { capture: true, once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock, { capture: true });
      window.removeEventListener('keydown', unlock, { capture: true });
      window.removeEventListener('touchstart', unlock, { capture: true });
      window.removeEventListener('click', unlock, { capture: true });
    };
  }, []);

  useEffect(() => {
    if (!ttsOn) return;
    const handler = (e) => {
      const el = e.target.closest('button, a, [role="button"], select, input[readonly], [data-speak]');
      if (!el) return;
      if (el.closest('[data-no-speak]')) return;
      const text =
        el.getAttribute('data-speak') ||
        el.getAttribute('aria-label') ||
        el.getAttribute('placeholder') ||
        el.textContent ||
        '';
      const clean = String(text).replace(/\s+/g, ' ').trim();
      if (clean) speakText(clean, speakLang);
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, [ttsOn, speakLang]);

  useEffect(() => {
    if (!ttsOn || !currentUser) return;
    let msg = '';
    if (view === 'home') msg = `Home. Your available balance is ${currentUser.balance} naira. Quick actions: Send Money, Deposit, History, Settings.`;
    else if (view === 'payment') msg = 'Send money. Enter the recipient account number, then the amount.';
    else if (view === 'settings') msg = 'Settings. AccessFlow setup and general banking settings.';
    else if (view === 'accessflow_settings') msg = 'AccessFlow setup. Choose your accessibility profiles, then save.';
    if (!msg) return;
    const timer = setTimeout(() => speakText(msg, speakLang), 350);
    return () => clearTimeout(timer);
  }, [view, ttsOn, speakLang, currentUser]);

  useEffect(() => {
    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      setIsIdle(false);
      if (currentUser && isVoiceAutomated) {
        timer = setTimeout(() => setIsIdle(true), 15000);
      }
    };
    if (currentUser && isVoiceAutomated) {
      resetTimer();
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keydown', resetTimer);
      window.addEventListener('click', resetTimer);
      window.addEventListener('touchstart', resetTimer);
    }
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
    };
  }, [currentUser, isVoiceAutomated]);

  const handleLogin = (user) => {
    const loggedInUser = { ...INITIAL_USER, ...user };
    setCurrentUser(loggedInUser);
    const savedSettings = localStorage.getItem(`accessflow_settings_${loggedInUser.pin}`);
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    else setSettings({ accessFlowActive: false, savedProfile: DEFAULT_PROFILE });
    setView('home');
  };

  const handleSwitchOff = () => {
    setCurrentUser(null);
    setView("login");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView("login");
    setSettings({ accessFlowActive: false, savedProfile: DEFAULT_PROFILE });
  };

  const handleCompleteTransfer = (newReceipt) => {
    if (newReceipt.error) {
      setReceipt(newReceipt);
      return;
    }
    setCurrentUser(prev => ({
      ...prev,
      balance: Math.max(0, Number(prev.balance || 0) - Number(newReceipt.amount || 0))
    }));
    setTransactions(prev => [
      {
        id: Date.now().toString(),
        title: `Transfer to ${newReceipt.name.split(' ')[0]}`,
        bankName: newReceipt.bank,
        amount: newReceipt.amount,
        direction: 'OUT',
        recipientOrSender: newReceipt.name
      },
      ...prev
    ]);
    setReceipt(newReceipt);
  };

  const activeProfilesArray = [];
  if (settings.accessFlowActive) {
    if (settings.savedProfile.profiles.visuallyImpaired) activeProfilesArray.push("vi");
    if (settings.savedProfile.profiles.motorSkills) activeProfilesArray.push("motor");
    if (settings.savedProfile.profiles.languageBarrier) activeProfilesArray.push("lang");
  }

  const mappedPreferences = {
    highContrast: isHighContrast,
    largeText: settings.accessFlowActive && settings.savedProfile.visuallyImpaired.largerFont,
    tts: ttsOn,
    largeTargets: settings.accessFlowActive && settings.savedProfile.motorSkills.largerButtons,
    voiceInput: settings.accessFlowActive && settings.savedProfile.motorSkills.touchTargets,
    extendedTimeout: settings.accessFlowActive && settings.savedProfile.motorSkills.extendedTimeout,
    fullyVoiceAutomated: isVoiceAutomated,
  };

  const triggerBiometric = (title, subtitle, action) => {
    setBiometricModal({ isOpen: true, title, subtitle, action });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 sm:p-6 font-sans">
      <PhoneFrame dataAttrs={{ "data-theme": isHighContrast ? "high-contrast" : "default" }}>

        {!currentUser && (
          <LoginScreen
            afOn={settings.accessFlowActive}
            activeProfiles={activeProfilesArray}
            lang={activeLang}
            preferences={mappedPreferences}
            onLangChange={() => {}}
            onLogin={handleLogin}
          />
        )}

        {currentUser && view === "home" && (
          <HomeScreen
            account={currentUser}
            transactions={transactions}
            language={activeLang}
            highContrast={isHighContrast}
            largeTouchTargets={mappedPreferences.largeTargets}
            afOn={settings.accessFlowActive}
            preferences={mappedPreferences}
            onNavigateSendMoney={() => setView("payment")}
            onNavigateSettings={() => setView("settings")}
            onSwitchOff={handleSwitchOff}
          />
        )}

        {currentUser && view === "settings" && (
          <BankSettingsScreen
            settings={settings}
            onNavigateSetupProfile={() => setView("accessflow_settings")}
            onBack={() => setView("home")}
            onLogout={handleLogout}
            largeTouchTargets={mappedPreferences.largeTargets}
          />
        )}

        {currentUser && view === "accessflow_settings" && (
          <SettingsScreen
            initialProfile={settings.savedProfile}
            onSaveProfile={(newProfile) => {
              setSettings(prev => ({ ...prev, accessFlowActive: newProfile.isConfigured, savedProfile: newProfile }));
              setView('settings');
            }}
            onBack={() => setView("settings")}
          />
        )}

        {currentUser && view === "payment" && (
          <PaymentScreen
            user={currentUser}
            afOn={settings.accessFlowActive}
            activeProfiles={activeProfilesArray}
            lang={activeLang}
            preferences={mappedPreferences}
            onToggleAf={() => {}}
            onBack={() => setView("home")}
            onComplete={handleCompleteTransfer}
          />
        )}

        <SuccessSheet
          open={receipt !== null}
          receipt={receipt}
          lang={activeLang}
          afOn={settings.accessFlowActive}
          preferences={mappedPreferences}
          onClose={() => { setReceipt(null); setView("home"); }}
        />

        {currentUser && isVoiceAutomated && (
          <AutoVoiceAssistant
            language={activeLang}
            isVoiceAutomatedEnabled={true}
            isLoggedIn={currentUser !== null}
            onVoiceLogin={() => handleLogin(INITIAL_USER)}
            onVoiceTransfer={() => setView('payment')}
            onVoiceOpenSettings={() => setView('accessflow_settings')}
            onVoiceCheckBalance={() => speakText(`Your balance is ${currentUser?.balance} Naira`, speakLang)}
            onLogout={handleLogout}
          />
        )}

        <BiometricModal
          isOpen={biometricModal.isOpen}
          title={biometricModal.title}
          subtitle={biometricModal.subtitle}
          onSuccess={() => { setBiometricModal({ isOpen: false }); biometricModal.action(); }}
          onCancel={() => { setBiometricModal({ isOpen: false }) }}
        />

        <IdleModal
          isOpen={isIdle}
          onClose={() => setIsIdle(false)}
          onNavigate={setView}
          onLogout={handleSwitchOff}
          isHighContrast={isHighContrast}
        />
      </PhoneFrame>
    </div>
  );
}