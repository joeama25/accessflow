import { useState } from 'react';
import { ArrowLeft, Eye, Hand, Languages, Check, Settings2 } from "lucide-react";
import { COPY, LANGS, PROFILES } from "../lib/accessflow";
import PersonalizationQuestions from "./PersonalizationQuestions";

const PROFILE_ICONS = { vi: Eye, motor: Hand, lang: Languages };

export function SettingsScreen({ afOn, activeProfiles, lang, preferences, onToggleAf, setActiveProfiles, togglePreference, onLangChange, onBack }) {
  const t = activeProfiles.includes("lang") ? (COPY[lang] || COPY.en) : COPY.en;
  
  const [isEditing, setIsEditing] = useState(activeProfiles.length === 0);
  const [tempProfiles, setTempProfiles] = useState(activeProfiles);
  const [showQuestions, setShowQuestions] = useState(false);

  const handleToggleAf = () => {
    onToggleAf(!afOn);
    if (afOn) {
      setActiveProfiles([]);
      setIsEditing(true);
      setTempProfiles([]);
    }
  };

  const handleProfileToggle = (id) => {
    setTempProfiles(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (tempProfiles.length > 0) setShowQuestions(true);
  };

  const handleQuestionsComplete = () => {
    setShowQuestions(false);
    setIsEditing(false);
    setActiveProfiles(tempProfiles);
  };

  return (
    <div className="af-screen-enter flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-8 [&::-webkit-scrollbar]:hidden">
      <header className="flex items-center gap-3 pt-2 pb-4">
        <button aria-label="Go back" type="button" onClick={onBack} className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-border bg-background active:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-extrabold text-foreground text-xl">{t.settings}</h1>
      </header>

      {/* Main Toggle */}
      <div className="flex items-center justify-between rounded-2xl border border-border bg-muted p-4 mb-5">
        <div>
          <p className="font-extrabold text-foreground">AccessFlow</p>
          <p className="text-xs text-muted-foreground">{afOn ? "On — accessibility active" : "Off — standard interface"}</p>
        </div>
        <button type="button" onClick={handleToggleAf} className={`relative h-8 w-14 flex-none rounded-full border transition-colors ${afOn ? "border-primary bg-primary" : "border-border bg-background"}`}>
          <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${afOn ? "left-7" : "left-1"}`} />
        </button>
      </div>

      {/* STEP 1: Profile Selection */}
      {afOn && isEditing && !showQuestions && (
        <>
          <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2">Select Profile(s)</p>
          <div className="flex flex-col gap-3 mb-6">
            {PROFILES.map((p) => {
              const Icon = PROFILE_ICONS[p.id];
              const isSelected = tempProfiles.includes(p.id);
              return (
                <div key={p.id} onClick={() => handleProfileToggle(p.id)} className={`w-full cursor-pointer rounded-2xl border p-4 text-left transition-all ${isSelected ? "border-primary bg-accent ring-1 ring-primary" : "border-border bg-background"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                        <Icon className="h-6 w-6" />
                      </span>
                      <div>
                        <p className="font-extrabold text-foreground text-sm">{p.name}</p>
                        <p className="text-[10px] font-semibold text-muted-foreground">{p.tagline}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary' : 'border-gray-300 bg-white'}`}>
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Language Dropdown - Shows immediately when Language Barrier is checked */}
          {tempProfiles.includes("lang") && (
            <div className="mb-6 animate-in fade-in">
              <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2">{t.chooseLang}</p>
              <div className="flex flex-wrap gap-2">
                {LANGS.map((l) => (
                  <button key={l.id} onClick={() => onLangChange(l.id)} className={`rounded-full px-3.5 py-1.5 text-sm font-bold ${l.id === lang ? "bg-primary text-primary-foreground" : "border border-border bg-muted text-foreground"}`}>
                    {l.native}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button onClick={handleNext} disabled={tempProfiles.length === 0} className="w-full bg-primary text-white py-4 rounded-xl font-bold disabled:opacity-50 mt-auto">Next</button>
        </>
      )}

      {/* STEP 2: Locked View */}
      {afOn && !isEditing && (
        <>
          <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2">Your Active Setup</p>
          <div className="flex flex-col gap-3 mb-6">
            {activeProfiles.map(pId => {
              const p = PROFILES.find(x => x.id === pId);
              const Icon = PROFILE_ICONS[p.id];
              return (
                <div key={p.id} className="w-full rounded-2xl border border-primary bg-accent p-4 text-left">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="font-extrabold text-foreground text-sm">{p.name}</p>
                      <p className="text-[10px] font-semibold text-primary">Active</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {activeProfiles.includes("lang") && (
            <div className="mb-6">
              <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2">{t.chooseLang}</p>
              <div className="flex flex-wrap gap-2">
                {LANGS.map((l) => (
                  <button key={l.id} onClick={() => onLangChange(l.id)} className={`rounded-full px-3.5 py-1.5 text-sm font-bold ${l.id === lang ? "bg-primary text-primary-foreground" : "border border-border bg-muted text-foreground"}`}>
                    {l.native}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => { setIsEditing(true); setTempProfiles(activeProfiles); }} className="w-full bg-white border-2 border-primary text-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-auto">
            <Settings2 size={18} /> Edit Preferences
          </button>
        </>
      )}

      {/* STEP 3: Questions Modal */}
      {showQuestions && (
        <PersonalizationQuestions 
          profilesToEdit={tempProfiles} 
          preferences={preferences} 
          togglePreference={togglePreference} 
          onComplete={handleQuestionsComplete} 
          onBack={() => setShowQuestions(false)} 
        />
      )}

    </div>
  );
}