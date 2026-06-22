'use client';

import { useState, useEffect, useRef } from 'react';

// Custom Hook for Typing Speed
function useTypingSpeed(prompt: string) {
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleChange = (value: string) => {
    if (isComplete) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    setInput(value);

    if (value === prompt) {
      const timeTaken = (Date.now() - (startTime || Date.now())) / 1000 / 60; // in minutes
      const words = prompt.trim().split(' ').length;
      const calculatedWpm = Math.round(words / timeTaken);
      setWpm(calculatedWpm);
      setIsComplete(true);
    }
  };

  const reset = () => {
    setInput('');
    setStartTime(null);
    setWpm(0);
    setIsComplete(false);
  };

  return { input, wpm, isComplete, handleChange, reset };
}

const prompts = [
  "The quick brown fox jumps over the lazy dog",
  "React is a powerful JavaScript library for building user interfaces",
  "Practice makes perfect when learning to type fast",
  "Custom hooks allow you to reuse stateful logic across components",
];

export default function TypingSpeedCalculator() {
  const [currentPrompt, setCurrentPrompt] = useState(prompts[0]);
  const { input, wpm, isComplete, handleChange, reset } = useTypingSpeed(currentPrompt);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const newPrompt = () => {
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(randomPrompt);
    reset();
    textareaRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-12 text-indigo-600">Typing Speed Test</h1>

        <div className="challenge">
          <h2 className="text-2xl mb-6">Type this prompt:</h2>
          <p className="text-xl leading-relaxed bg-white p-6 rounded-xl border border-gray-200 mb-8">
            {currentPrompt}
          </p>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            disabled={isComplete}
            placeholder="Start typing here..."
            className="w-full h-32 p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none resize-y"
          />

          <div className="flex justify-between items-center mt-6">
            <button 
              onClick={newPrompt}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium"
            >
              New Prompt
            </button>

            {isComplete && (
              <div className="text-2xl font-bold text-green-600">
                🎉 Your WPM: {wpm}
              </div>
            )}
          </div>

          {isComplete && (
            <button 
              onClick={reset}
              className="mt-6 w-full py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}