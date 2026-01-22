
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext.tsx';
import { GameStatus } from '../types.ts';
import { Timer, Trophy, ArrowRight, CheckCircle2, XCircle, Zap } from 'lucide-react';

const GameView: React.FC = () => {
  const { status, session, settings, submitAnswer, nextQuestion } = useQuiz();
  const navigate = useNavigate();
  
  const [timeLeft, setTimeLeft] = useState(settings?.timePerQuestion || 30);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  // Use ReturnType<typeof setInterval> to avoid NodeJS namespace issues in browser environments
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status !== GameStatus.PLAYING) {
      if (status === GameStatus.FINISHED) navigate('/results');
      else navigate('/setup');
      return;
    }

    startTimer();
    return () => stopTimer();
  }, [session?.currentQuestionIndex, status]);

  const startTimer = () => {
    setTimeLeft(settings?.timePerQuestion || 30);
    stopTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleTimeUp = () => {
    if (showResult) return;
    handleSelect(''); // Empty string counts as incorrect/timed out
  };

  const handleSelect = (option: string) => {
    if (showResult) return;
    
    stopTimer();
    setSelectedOption(option);
    setShowResult(true);
    
    const timeTaken = (settings?.timePerQuestion || 30) - timeLeft;
    submitAnswer(option, timeTaken);

    // Auto move to next question after delay
    setTimeout(() => {
      setShowResult(false);
      setSelectedOption(null);
      nextQuestion();
    }, 2000);
  };

  if (!session || !settings) return null;

  const currentQuestion = session.questions[session.currentQuestionIndex];
  const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* HUD Header */}
      <div className="flex items-center justify-between bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-lg">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Progress</span>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black">{session.currentQuestionIndex + 1} / {session.questions.length}</span>
            <div className="w-32 h-3 bg-slate-800 rounded-full overflow-hidden hidden md:block">
              <div 
                className="h-full bg-indigo-500 transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className={`relative flex items-center justify-center p-3 rounded-2xl transition-colors ${timeLeft <= 5 ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-indigo-400'}`}>
            <Timer className="w-6 h-6 mr-2" />
            <span className="text-2xl font-black tabular-nums">{timeLeft}s</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Score</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span className="text-2xl font-black">{session.score}</span>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden min-h-[400px] flex flex-col justify-center">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
          <div 
            className="h-full bg-indigo-500 transition-all duration-1000 linear"
            style={{ width: `${(timeLeft / settings.timePerQuestion) * 100}%` }}
          ></div>
        </div>
        
        <h2 className="text-3xl font-bold leading-snug mb-12 text-center">
          {currentQuestion.question}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, idx) => {
            const isCorrect = option === currentQuestion.correctAnswer;
            const isSelected = option === selectedOption;
            
            let btnClass = "bg-slate-800 border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/80";
            if (showResult) {
              if (isCorrect) btnClass = "bg-green-500/20 border-green-500 text-green-400 ring-2 ring-green-500/20";
              else if (isSelected && !isCorrect) btnClass = "bg-rose-500/20 border-rose-500 text-rose-400";
              else btnClass = "opacity-40 bg-slate-800 border-slate-800";
            }

            return (
              <button
                key={idx}
                disabled={showResult}
                onClick={() => handleSelect(option)}
                className={`group relative p-6 rounded-2xl border-2 transition-all flex items-center gap-4 text-left font-semibold text-lg ${btnClass}`}
              >
                <div className={`w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center border font-bold ${showResult ? 'hidden' : 'bg-slate-900 border-slate-700 group-hover:border-indigo-500 transition-colors'}`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                
                {showResult && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-rose-500" />}
                
                <span className="flex-grow">{option}</span>
                
                {isSelected && !showResult && (
                  <div className="absolute inset-0 bg-indigo-500/10 rounded-2xl animate-pulse"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex justify-center gap-12">
        <div className="flex items-center gap-2 text-slate-500">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">Difficulty: {settings.difficulty}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
          <span className="text-sm font-medium">{settings.category.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};

export default GameView;
