
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import { Trophy, ArrowRight, RotateCcw, Target, Timer, Star, TrendingUp } from 'lucide-react';

const ResultPage: React.FC = () => {
  const { session, resetQuiz } = useQuiz();
  const { user, updateStats } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session && session.endTime) {
      // XP = Score / 5
      const xpGained = Math.floor(session.score / 5);
      updateStats(session.score, xpGained);
    } else {
      navigate('/');
    }
  }, []);

  if (!session) return null;

  const totalTime = session.endTime ? Math.floor((session.endTime - session.startTime) / 1000) : 0;
  const accuracy = Math.round((session.correctAnswers / session.questions.length) * 100);
  const xpGained = Math.floor(session.score / 5);

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700">
      <div className="text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 blur-3xl -z-10 rounded-full"></div>
        <div className="inline-block p-6 bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl mb-8">
          <Trophy className="w-24 h-24 text-amber-500 mx-auto" />
        </div>
        <h1 className="text-5xl font-black mb-4">Quiz Complete!</h1>
        <p className="text-xl text-slate-400">Awesome effort, {user?.username}. Here's how you performed.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-white">{session.score}</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Final Score</div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-white">{accuracy}%</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Accuracy</div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 text-center space-y-2">
          <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Timer className="w-6 h-6 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-white">{totalTime}s</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Time Taken</div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 text-center space-y-2">
          <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-cyan-500" />
          </div>
          <div className="text-3xl font-black text-white">+{xpGained}</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">XP Earned</div>
        </div>
      </div>

      <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 space-y-8">
        <h2 className="text-2xl font-bold">Answer Summary</h2>
        <div className="space-y-4">
          {session.answers.map((ans, i) => (
            <div key={i} className={`p-5 rounded-2xl border flex items-center justify-between ${ans.isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
              <div className="flex items-center gap-4">
                <span className="text-slate-500 font-bold w-6">#{i+1}</span>
                <span className="font-semibold">{session.questions[i].question.substring(0, 60)}...</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm font-medium text-slate-500 tabular-nums">{ans.timeTaken}s</span>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${ans.isCorrect ? 'bg-green-500 text-white' : 'bg-rose-500 text-white'}`}>
                  {ans.isCorrect ? 'Correct' : 'Wrong'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <button 
          onClick={() => {
            resetQuiz();
            navigate('/setup');
          }}
          className="w-full sm:flex-1 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] font-bold text-xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3"
        >
          <RotateCcw className="w-6 h-6" />
          Play Again
        </button>
        <button 
          onClick={() => {
            resetQuiz();
            navigate('/leaderboard');
          }}
          className="w-full sm:flex-1 py-5 bg-slate-800 hover:bg-slate-700 text-white rounded-[1.5rem] font-bold text-xl transition-all border border-slate-700 flex items-center justify-center gap-3"
        >
          View Leaderboard
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
