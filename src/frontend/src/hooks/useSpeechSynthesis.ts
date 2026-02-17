import { useState, useEffect, useCallback } from 'react';

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

export function useSpeechSynthesis() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setIsAvailable('speechSynthesis' in window);
  }, []);

  const speak = useCallback((text: string, options?: SpeechOptions) => {
    if (!isAvailable || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply options if provided
    if (options) {
      if (options.rate !== undefined) utterance.rate = options.rate;
      if (options.pitch !== undefined) utterance.pitch = options.pitch;
      if (options.volume !== undefined) utterance.volume = options.volume;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isAvailable]);

  const stop = useCallback(() => {
    if (!isAvailable) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isAvailable]);

  return {
    isAvailable,
    isSpeaking,
    speak,
    stop,
  };
}
