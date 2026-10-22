import { useState } from 'react';
import { ArrowLeft, Eye, Hand, Globe, Check, Save } from 'lucide-react';
import { playClickTone, playSuccessChime } from '../utils/audio';
import { getT } from '../lib/translations';

export function SettingsScreen({ initialProfile, onSaveProfile, onBack }) {
  const [profiles, setProfiles] = useState(initialProfile.profiles || { visuallyImpaired: false, motorSkills: false, languageBarrier: false });
  
  const [vi, setVi] = useState(initialProfile.visuallyImpaired || { 
    highContrast: false, largerFont: false, fontSizeMultiplier: 1.25, textToVoice: false, fullyVoiceAutomated: false 
  });
  
  const [motor, setMotor] = useState(initialProfile.motorSkills || { 
    touchTargets: false, extendedTimeout: false, largerButtons: false 
  });
  
  const [lang, setLang] = useState(initialProfile.languageBarrier || { 
    useLocalDialect: false, selectedDialect: 'en' 
  });
  
  const [isEnabled, setIsEnabled] = useState(initialProfile.isConfigured || false);
  
  // Only translate if the languageBarrier profile is actually checked AND useLocalDialect is on
  const activeLang = profiles.languageBarrier && lang.useLocalDialect ? lang.selectedDialect : 'en';
  const t = getT(activeLang);

  const handleToggleMaster = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    
    if (!newState) {
      setProfiles({ visuallyImpaired: false, motorSkills: false, languageBarrier: false });
      setVi(prev => ({ ...prev, highContrast: false, textToVoice: false, fullyVoiceAutomated: false }));
      setMotor(prev => ({ ...prev, touchTargets: false, largerButtons: false }));
      setLang({ useLocalDialect: false, selectedDialect: 'en' });
      playClickTone();
    }
  };

  const handleToggleProfile = (key) => {
    if (!isEnabled) return; 
    playClickTone();
    
    const isTurningOn = !profiles[key];
    setProfiles(prev => ({ ...prev, [key]: isTurningOn }));

    if (key === 'visuallyImpaired') {
      setVi({ highContrast: false, largerFont: false, fontSizeMultiplier: 1.25, textToVoice: false, fullyVoiceAutomated: false });
    }
    if (key === 'motorSkills') {
      setMotor({ touchTargets: false, extendedTimeout: false, largerButtons: false });
    }
    if (key === 'languageBarrier') {
      setLang({ useLocalDialect: false, selectedDialect: 'en' });
    }
  };

  const handleSave = () => {
    playSuccessChime();
    
    const finalProfiles = isEnabled 
      ? profiles 
      : { visuallyImpaired: false, motorSkills: false, languageBarrier: false };

    const finalLang = finalProfiles.languageBarrier ? lang : { useLocalDialect: false, selectedDialect: 'en' };

    onSaveProfile({
      profiles: finalProfiles, 
      visuallyImpaired: vi, 
      motorSkills: motor, 
      languageBarrier: finalLang, 
      isConfigured: isEnabled 
    });
  };

  const dialects = [
    { id: 'yo', label: 'Yoruba' }, 
    { id: 'ig', label: 'Igbo' },
    { id: 'ha', label: 'Hausa' }, 
    { id: 'pcm', label: 'Pidgin' }
  ];

  const profilesList = [
    { id: 'visuallyImpaired', icon: Eye, title: t.visuallyImpaired, desc: t.visuallyImpairedDesc },
    { id: 'motorSkills', icon: Hand, title: t.motorSkills, desc: t.motorSkillsDesc },
    { id: 'languageBarrier', icon: Globe, title: t.languageBarrier, desc: t.languageBarrierDesc },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto p-5 space-y-6 bg-white text-slate-900 [&::-webkit-scrollbar]:hidden">
      <div className="flex items-center gap-3 pt-1">
        <button onClick={onBack} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-800 hover:bg-slate-50"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">{t.accessFlowSetup}</h1>
          <p className="text-[11px] text-slate-400">{t.accessFlowSetupDesc}</p>
        </div>
      </div>

      {/* Master Toggle */}
      <div className="p-4 rounded-3xl border border-slate-200 bg-white shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-extrabold text-slate-900">{t.enableAccessFlow}</h2>
            </div>
            <p className="text-xs text-slate-500">{isEnabled ? t.enableAccessFlowOn : t.enableAccessFlowOff}</p>
          </div>
          <button onClick={handleToggleMaster} className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-200 ${isEnabled ? 'bg-[#123628]' : 'bg-slate-200'}`}>
             <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-200 ${isEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
      </div>

      {isEnabled ? (
        <section className="space-y-3 animate-in fade-in">
          <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">{t.selectProfiles}</label>
          
          <div className="space-y-4">
            {profilesList.map(item => {
              const isSelected = profiles[item.id];
              
              return (
                <div key={item.id} className="flex flex-col">
                  <button 
                    onClick={() => handleToggleProfile(item.id)} 
                    className={`w-full p-3.5 border text-left flex items-center justify-between transition-all ${
                      isSelected 
                        ? 'bg-[#eaf3ed] border-[#123628] rounded-t-2xl border-b-0' 
                        : 'bg-white border-slate-200 rounded-2xl'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-[#123628] text-white' : 'bg-slate-50 text-slate-500'}`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                        <p className="text-[10px] text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${isSelected ? 'bg-[#123628] border-[#123628] text-white' : 'border-slate-300 bg-white'}`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>

                  {isSelected && (
                    <div className="p-4 bg-[#f8fbf9] border border-[#123628] rounded-b-2xl border-t-0 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      {item.id === 'visuallyImpaired' && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{t.highContrast}</span>
                            <button onClick={() => setVi(p => ({...p, highContrast: !p.highContrast}))} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${vi.highContrast ? 'bg-[#123628] text-white' : 'bg-white border'}`}>{vi.highContrast ? t.on : t.off}</button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{t.textToVoice}</span>
                            <button onClick={() => setVi(p => ({...p, textToVoice: !p.textToVoice}))} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${vi.textToVoice ? 'bg-[#123628] text-white' : 'bg-white border'}`}>{vi.textToVoice ? t.on : t.off}</button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{t.fullyVoiceAutomated}</span>
                            <button onClick={() => setVi(p => ({...p, fullyVoiceAutomated: !p.fullyVoiceAutomated}))} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${vi.fullyVoiceAutomated ? 'bg-[#123628] text-white' : 'bg-white border'}`}>{vi.fullyVoiceAutomated ? t.on : t.off}</button>
                          </div>
                        </>
                      )}

                      {item.id === 'motorSkills' && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{t.largeTouchTargets}</span>
                            <button onClick={() => setMotor(p => ({...p, touchTargets: !p.touchTargets}))} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${motor.touchTargets ? 'bg-[#123628] text-white' : 'bg-white border'}`}>{motor.touchTargets ? t.on : t.off}</button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{t.largerButtons}</span>
                            <button onClick={() => setMotor(p => ({...p, largerButtons: !p.largerButtons}))} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${motor.largerButtons ? 'bg-[#123628] text-white' : 'bg-white border'}`}>{motor.largerButtons ? t.on : t.off}</button>
                          </div>
                        </>
                      )}

                      {item.id === 'languageBarrier' && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{t.useLocalDialect}</span>
                            <button onClick={() => setLang(p => ({...p, useLocalDialect: !p.useLocalDialect}))} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${lang.useLocalDialect ? 'bg-[#123628] text-white' : 'bg-white border'}`}>{lang.useLocalDialect ? t.on : t.off}</button>
                          </div>
                          {lang.useLocalDialect && (
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              {dialects.map(d => (
                                <button key={d.id} onClick={() => setLang(p => ({...p, selectedDialect: d.id}))} className={`py-1.5 rounded-lg text-xs font-bold ${lang.selectedDialect === d.id ? 'bg-[#123628] text-white' : 'bg-white border'}`}>{d.label}</button>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
            <Globe className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">{t.accessFlowIsOff}</h3>
          <p className="text-xs text-slate-500 max-w-[200px]">{t.accessFlowIsOffDesc}</p>
        </div>
      )}

      <button onClick={handleSave} className="w-full py-4 rounded-2xl bg-[#123628] text-white font-bold flex items-center justify-center gap-2 mt-4 shadow-lg active:scale-98 transition-transform">
        <Save className="w-5 h-5" /> {t.saveProfileButton}
      </button>
    </div>
  );
}