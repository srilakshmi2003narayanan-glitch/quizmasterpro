
import React from 'react';
import { mockBackend } from '../services/mockBackend.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { Crown, Star, User as UserIcon, Medal, TrendingUp, Trophy } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const leaderboard = mockBackend.getLeaderboard();
  const { user: currentUser } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black tracking-tight">The Pantheon</h1>
        <p className="text-slate-400 text-lg">The world's sharpest minds, ranked by glory.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {leaderboard.slice(0, 3).map((entry, idx) => {
          const colors = [
            'bg-amber-500 ring-amber-500/20',
            'bg-slate-300 ring-slate-300/20',
            'bg-orange-400 ring-orange-400/20'
          ];
          const icons = [Crown, Medal, Medal];
          const Icon = icons[idx];

          return (
            <div 
              key={entry.userId}
              className={`relative p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 flex flex-col items-center gap-4 text-center transition-transform hover:-translate-y-2 duration-300 ${idx === 0 ? 'scale-110 z-10' : ''}`}
            >
              <div className={`absolute -top-4 -right-4 p-3 rounded-2xl shadow-xl ${colors[idx]} text-slate-900 ring-8`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-700 shadow-inner overflow-hidden">
                <UserIcon className="w-10 h-10 text-slate-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold truncate max-w-[150px]">{entry.username}</h3>
                <div className="text-xs uppercase font-black text-indigo-400">Level {entry.level}</div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-white">{entry.score.toLocaleString()}</span>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Total Points</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            Global Rankings
          </h2>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{leaderboard.length} Active Players</span>
        </div>
        
        <div className="divide-y divide-slate-800">
          {leaderboard.map((entry, idx) => {
            const isMe = entry.userId === currentUser?.id;
            return (
              <div 
                key={entry.userId}
                className={`p-6 flex items-center justify-between transition-colors hover:bg-slate-800/30 ${isMe ? 'bg-indigo-600/5' : ''}`}
              >
                <div className="flex items-center gap-6">
                  <span className={`w-8 text-center font-black text-xl ${idx < 3 ? 'text-indigo-400' : 'text-slate-600'}`}>
                    #{idx + 1}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
                      <UserIcon className="w-6 h-6 text-slate-500" />
                    </div>
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        {entry.username}
                        {isMe && <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500 text-white uppercase tracking-tighter">You</span>}
                      </div>
                      <div className="text-xs text-slate-500 font-medium uppercase tracking-tighter">Master Ranked • LVL {entry.level}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-12">
                  <div className="text-right hidden sm:block">
                    <div className="text-lg font-black">{entry.score.toLocaleString()}</div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">Score</div>
                  </div>
                  <div className="p-2.5 bg-slate-800 rounded-xl">
                    <Star className={`w-5 h-5 ${idx < 3 ? 'text-indigo-400 fill-indigo-400' : 'text-slate-600'}`} />
                  </div>
                </div>
              </div>
            );
          })}
          
          {leaderboard.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8 text-slate-700" />
              </div>
              <p className="text-slate-500 font-medium">No one has ascended yet. Be the first!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
