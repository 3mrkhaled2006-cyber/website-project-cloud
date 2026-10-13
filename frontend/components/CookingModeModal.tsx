import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import { X, Play, Pause, RotateCcw, CheckCircle, ChevronRight, ChevronLeft, Volume2, Flame } from 'lucide-react';

interface CookingModeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onComplete: () => void;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({ recipe, onClose, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const currentStep = recipe.steps[currentStepIndex];

  // Set initial timer if step has one
  useEffect(() => {
    if (currentStep?.timerMinutes) {
      setTimerSeconds(currentStep.timerMinutes * 60);
      setIsTimerRunning(false);
    } else {
      setTimerSeconds(null);
      setIsTimerRunning(false);
    }
  }, [currentStepIndex, currentStep]);

  // Countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds !== null && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Play ding sound using Web Audio API
      playTimerBeep();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const playTimerBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.log('Audio notification trigger');
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (currentStepIndex < recipe.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const progressPercent = Math.round(((currentStepIndex + 1) / recipe.steps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-800 flex items-center justify-between bg-stone-900/50">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Flame className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-semibold text-lg text-white line-clamp-1">{recipe.title}</h3>
              <p className="text-xs text-stone-400">
                Step {currentStepIndex + 1} of {recipe.steps.length} • {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min total
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition"
            aria-label="Close cooking mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-800 h-1.5">
          <div
            className="bg-emerald-500 h-1.5 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 flex-1 overflow-y-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            Step {currentStep.stepNumber} of {recipe.steps.length}
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-serif">
            {currentStep.title}
          </h2>

          <p className="text-lg sm:text-xl text-stone-300 leading-relaxed font-normal">
            {currentStep.instruction}
          </p>

          {/* Interactive Timer if available */}
          {timerSeconds !== null && (
            <div className="p-5 rounded-2xl bg-stone-800/60 border border-stone-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-3xl sm:text-4xl font-mono font-bold text-emerald-400 tracking-wider">
                  {formatTimer(timerSeconds)}
                </div>
                <div className="text-xs text-stone-400">
                  <p className="font-medium text-stone-200">Step Timer</p>
                  <p>Keeps food cooked to perfection</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 font-medium text-sm transition ${
                    isTimerRunning
                      ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                      : 'bg-emerald-600 text-white hover:bg-emerald-500'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isTimerRunning ? 'Pause' : 'Start Timer'}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    if (currentStep?.timerMinutes) {
                      setTimerSeconds(currentStep.timerMinutes * 60);
                    }
                  }}
                  className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-700 rounded-xl transition"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Recipe Ingredients used in this dish */}
          <div className="pt-4 border-t border-stone-800">
            <h4 className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-2">
              Recipe Ingredients
            </h4>
            <div className="flex flex-wrap gap-2">
              {recipe.usedPantryIngredients.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs rounded-lg bg-stone-800 text-stone-300 border border-stone-700"
                >
                  ✓ {item}
                </span>
              ))}
              {recipe.missingIngredients.map((item, idx) => (
                <span
                  key={`missing-${idx}`}
                  className="px-2.5 py-1 text-xs rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20"
                >
                  + {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-6 border-t border-stone-800 bg-stone-900 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition ${
              currentStepIndex === 0
                ? 'opacity-40 cursor-not-allowed text-stone-500'
                : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition"
          >
            {currentStepIndex === recipe.steps.length - 1 ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-200" />
                Finish Meal
              </>
            ) : (
              <>
                Next Step
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
