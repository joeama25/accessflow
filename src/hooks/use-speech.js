export function speak(text, langCode = "en-NG") {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel(); // Stop any currently playing audio
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    // Optional: pick a specific voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang.includes(langCode.split('-')[0]));
    if (matchedVoice) utterance.voice = matchedVoice;
    
    window.speechSynthesis.speak(utterance);
  }
}