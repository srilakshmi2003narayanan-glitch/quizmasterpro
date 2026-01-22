
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, Sparkles, Zap, Users, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && email) {
      login(username, email);
      navigate('/setup');
    }
  };

  if (isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 -z-10 animate-pulse"></div>
          <Trophy className="w-24 h-24 text-indigo-500 mx-auto" />
        </div>
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Ready for a challenge?</h1>
        <p className="text-xl text-slate-400 mb-10 leading-relaxed">
          The ultimate brain-teasing experience awaits. Choose your category, set your difficulty, and climb the global leaderboard.
        </p>
        <button 
          onClick={() => navigate('/setup')}
          className="group relative flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl text-xl font-bold transition-all shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-1"
        >
          Start New Quiz
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-16 items-center py-12">
      <div className="space-y-8 animate-in slide-in-from-left duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold mb-2">
          <Sparkles className="w-4 h-4" />
          Powered by Gemini 3.0
        </div>
        <h1 className="text-6xl font-black leading-tight">
          Master the <span className="text-indigo-500">Quiz</span>, Rule the <span className="text-indigo-500">Board</span>.
        </h1>
        <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
          An interactive, AI-driven quiz platform designed to push your limits. Battle with friends and climb the ranks.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
            <Zap className="w-6 h-6 text-amber-500" />
            <span className="font-bold text-lg">Real-time Stats</span>
            <span className="text-sm text-slate-500">Instant feedback & scoring</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
            <Users className="w-6 h-6 text-cyan-500" />
            <span className="font-bold text-lg">Global Ranking</span>
            <span className="text-sm text-slate-500">Compete with the world</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl relative animate-in slide-in-from-right duration-700">
        <div className="absolute -top-6 -right-6 p-4 bg-indigo-600 rounded-2xl shadow-lg -rotate-12 animate-bounce">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold mb-8">Join the Arena</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Display Name</label>
            <input 
              required
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Enter your hero name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="name@example.com"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98]"
          >
            Enter Now
          </button>
          <p className="text-center text-xs text-slate-500">
            By joining, you agree to our Terms of Service. No credit card required.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LandingPage;
