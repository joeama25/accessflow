import axios from 'axios';
import { speakText } from './audio';

const API_BASE_URL = 'http://localhost:3001/api';

export const playAIVoice = async (text, language = 'en') => {
  const ttsLang = language === 'en' ? 'en-NG' : `${language}-NG`;
  try {
    const response = await axios.post(
      `${API_BASE_URL}/tts`,
      { text, language },
      { responseType: 'blob', timeout: 3000 }
    );
    const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    await audio.play();
    audio.onended = () => URL.revokeObjectURL(audioUrl);
  } catch (error) {
    console.warn('[playAIVoice] backend failed, falling back to speakText', error?.message);
    speakText(text, ttsLang);
  }
};