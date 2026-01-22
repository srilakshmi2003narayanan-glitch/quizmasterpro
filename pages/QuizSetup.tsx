
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, DIFFICULTIES } from '../constants.ts';
import { Difficulty } from '../types.ts';
import { useQuiz } from '../context/QuizContext.tsx';
import { generateQuizQuestions } from '../services/geminiService.ts';
import { ArrowRight, Loader2, Sparkles, Check } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const QuizSetup: React.FC = () => {
  const { startQuiz } = useQuiz();
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const questions = await generateQuizQuestions(selectedCategory, difficulty, count);
      startQuiz(questions, {
        category: selectedCategory,
        difficulty,
        questionCount: count,
        timePerQuestion: difficulty === 'Easy' ? 45 : difficulty === 'Medium' ? 30 : 20
      });
      navigate('/play');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentCategoryObj = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Setup Your Session</h1>
        <p className="text-slate-400 text-lg">Customize your experience and generate a fresh set of AI-curated questions.</p>
      </div>

      <div className="grid gap-10">
        <section className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-sm border border-indigo-500/20">1</span>
            Select Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = (LucideIcons as any)[cat.icon];
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative p-6 rounded-2xl border transition-all flex flex-col items-center gap-4 text-center group ${
                    isSelected 
                      ? 'bg-indigo-600/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 p-1 bg-indigo-500 rounded-full">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className={`p-4 rounded-xl ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:scale-110 transition-transform'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-400'}`}>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-10">
          <section className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-sm border border-indigo-500/20">2</span>
              Difficulty
            </h2>
            <div className="flex gap-2">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`flex-1 py-3 px-4 rounded-xl border font-bold transition-all ${
                    difficulty === diff 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-sm border border-indigo-500/20">3</span>
              Questions
            </h2>
            <div className="flex gap-4 items-center">
              {[5, 10, 15, 20].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`w-14 h-14 rounded-full border flex items-center justify-center font-bold transition-all ${
                    count === n 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {n}
                </button>
              ))}
              <span className="text-slate-500 ml-auto font-medium">Approx. {count * (difficulty === 'Hard' ? 20 : 30)}s game</span>
            </div>
          </section>
        </div>

        <button
          disabled={loading}
          onClick={handleStart}
          className="w-full group relative py-6 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white rounded-[2rem] font-black text-2xl transition-all shadow-2xl shadow-indigo-500/30 overflow-hidden flex items-center justify-center gap-4"
        >
          {loading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin" />
              Generating with Gemini...
            </>
          ) : (
            <>
              Start the Game
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
        </button>
      </div>
    </div>
  );
};

export default QuizSetup;
