import { useState } from 'react';
import { Eye, Info, Volume2, Mic, Lock, X, Globe } from 'lucide-react';

export default function PersonalizationQuestions({ profilesToEdit, preferences, togglePreference, onComplete, onBack }) {
  const [currentStep, setCurrentStep] = useState(1);

  const getQuestions = () => {
    let allQuestions = [];
    if (profilesToEdit.includes('vi')) {
      allQuestions.push(
        { key: 'highContrast', title: 'High contrast', desc: 'Black, yellow and white palette', icon: <Eye size={32} /> },
        { key: 'largeText', title: 'Larger font', desc: 'Increase essential text by 40%', icon: <Info size={32} /> },
        { key: 'tts', title: 'Text-to-voice', desc: 'Read fields and alerts aloud', icon: <Volume2 size={32} /> }
      );
    }
    if (profilesToEdit.includes('motor')) {
      allQuestions.push(
        { key: 'largeTargets', title: 'Large touch targets', desc: 'Oversized controls and keypad', icon: <Info size={32} /> },
        { key: 'voiceInput', title: 'Voice-to-text', desc: 'Use dictation to enter details', icon: <Mic size={32} /> },
        { key: 'extendedTimeout', title: 'Extended timeout', desc: 'Keep sessions active for longer', icon: <Lock size={32} /> }
      );
    }
    if (profilesToEdit.includes('lang')) {
      allQuestions.push(
        { key: 'localDialects', title: 'Local dialects', desc: 'Switch to Pidgin, Yoruba, Igbo or Hausa', icon: <Globe size={32} /> },
        { key: 'simpleText', title: 'Simple text', desc: 'Use plain words instead of banking jargon', icon: <Info size={32} /> }
      );
    }
    return allQuestions;
  };

  const questions = getQuestions();
  const currentQuestion = questions[currentStep - 1];
  const totalSteps = questions.length;

  if (!currentQuestion) {
    onComplete();
    return null;
  }

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
    else onComplete(); 
  };

  const handlePreference = (turnOn) => {
    if (turnOn && !preferences[currentQuestion.key]) togglePreference(currentQuestion.key);
    if (!turnOn && preferences[currentQuestion.key]) togglePreference(currentQuestion.key);
    handleNext();
  };

  return (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 z-[70]">
      <div className="bg-background rounded-3xl w-full max-w-sm shadow-2xl relative max-h-[90vh] overflow-y-auto p-6 border border-border">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[10px] font-bold tracking-wider text-muted-foreground mb-1">PERSONALIZATION</p>
            <h2 className="text-lg font-bold text-foreground">{currentQuestion.title}</h2>
          </div>
          <button onClick={onBack} className="p-2 bg-muted rounded-full hover:bg-accent"><X size={16} /></button>
        </div>
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">Step {currentStep} of {totalSteps}</span>
          <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
          </div>
        </div>
        <div className="flex flex-col items-center text-center w-full pb-4">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-primary mb-4">{currentQuestion.icon}</div>
          <h3 className="text-xl font-bold text-foreground mb-2">Would you like {currentQuestion.title.toLowerCase()}?</h3>
          <p className="text-xs text-muted-foreground mb-6">{currentQuestion.desc}</p>
          <div className="flex flex-col gap-3 w-full">
            <button onClick={() => handlePreference(true)} className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 text-sm">
              ✓ Yes, turn it on
            </button>
            <button onClick={() => handlePreference(false)} className="w-full bg-background border-2 border-border text-foreground py-3 px-4 rounded-xl font-bold text-sm">
              No, not for me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}