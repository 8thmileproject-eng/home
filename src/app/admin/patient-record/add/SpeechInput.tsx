"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square } from "lucide-react";

interface SpeechInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function SpeechInput({ value, onChange, placeholder, rows }: SpeechInputProps) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const valueRef = useRef(value);
  useEffect(() => { valueRef.current = value; }, [value]);

  const SpeechRecognitionAPI = typeof window !== "undefined"
    ? (window.SpeechRecognition || (window as Window & { webkitSpeechRecognition: typeof SpeechRecognition }).webkitSpeechRecognition)
    : null;

  const supported = !!SpeechRecognitionAPI;

  const startListening = () => {
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let newText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          newText += (newText ? " " : "") + event.results[i][0].transcript;
        }
      }
      if (newText) {
        const current = valueRef.current;
        onChange(current ? `${current} ${newText}` : newText);
      }
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  };

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows || 4}
        placeholder={placeholder}
        className="w-full px-4 py-3 pr-14 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent resize-none"
      />
      {supported && (
        <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
          {listening && (
            <div className="flex items-center gap-[2px] h-6">
              {[3, 5, 4, 7, 4, 6, 3].map((h, i) => (
                <div
                  key={i}
                  className="w-[3px] bg-red-500 rounded-full animate-pulse"
                  style={{
                    height: `${h * 3}px`,
                    animationDelay: `${i * 0.12}s`,
                    animationDuration: "0.6s",
                  }}
                />
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={listening ? stopListening : startListening}
            className={`p-2 rounded-lg transition-colors ${
              listening
                ? "bg-red-500 text-white shadow-sm hover:bg-red-600"
                : "text-gray-400 hover:text-[#2d5a3d] hover:bg-gray-100"
            }`}
            title={listening ? "Stop recording" : "Start speech-to-text"}
          >
            {listening ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
