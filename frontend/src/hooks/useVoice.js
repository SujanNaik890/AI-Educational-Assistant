import { useState, useEffect, useRef, useCallback } from "react";

export function useVoice({ onTranscript, autoSend = false, onAutoSend } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [volumeLevel, setVolumeLevel] = useState(0);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    // Check Speech Recognition support
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError("");
        startSimulatedAudioMeter();
      };

      recognition.onresult = (event) => {
        let interim = "";
        let final = "";
        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            final += res[0].transcript;
          } else {
            interim += res[0].transcript;
          }
        }
        const text = final || interim;
        if (onTranscript && text) {
          onTranscript(text, Boolean(final));
        }
        if (final && autoSend && onAutoSend) {
          onAutoSend(final);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          setVoiceError(`Voice recognition: ${event.error}`);
        }
        setIsListening(false);
        stopSimulatedAudioMeter();
      };

      recognition.onend = () => {
        setIsListening(false);
        stopSimulatedAudioMeter();
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    // Check TTS support
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setTtsSupported(true);
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      if (synthRef.current) {
        try {
          synthRef.current.cancel();
        } catch (_) {}
      }
      stopSimulatedAudioMeter();
    };
  }, [onTranscript, autoSend, onAutoSend]);

  const startSimulatedAudioMeter = () => {
    const animate = () => {
      setVolumeLevel(Math.random() * 0.8 + 0.2);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  const stopSimulatedAudioMeter = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setVolumeLevel(0);
  };

  const startListening = useCallback(() => {
    if (!speechSupported || !recognitionRef.current) {
      setVoiceError("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }
    try {
      if (synthRef.current && synthRef.current.speaking) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      }
      recognitionRef.current.start();
    } catch (e) {
      // Already active
      recognitionRef.current.stop();
    }
  }, [speechSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const speakText = useCallback(
    (text, { rate = 1.0, pitch = 1.0 } = {}) => {
      if (!ttsSupported || !synthRef.current) return;

      synthRef.current.cancel();
      setIsSpeaking(false);

      if (!text || !text.trim()) return;

      // Clean markdown tags for natural speech
      const cleanedText = text
        .replace(/[*_#`~[\]]/g, "")
        .replace(/https?:\/\/\S+/g, "")
        .replace(/\n+/g, " ")
        .slice(0, 1000); // speak up to 1000 chars smoothly

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.rate = rate;
      utterance.pitch = pitch;

      // Prefer a natural English voice if available
      const voices = synthRef.current.getVoices();
      const preferred =
        voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha"))) ||
        voices.find((v) => v.lang.startsWith("en"));
      if (preferred) {
        utterance.voice = preferred;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    },
    [ttsSupported]
  );

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    speechSupported,
    ttsSupported,
    voiceError,
    volumeLevel,
    startListening,
    stopListening,
    toggleListening,
    speakText,
    stopSpeaking,
  };
}
