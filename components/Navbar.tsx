
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, LogOut, User as UserIcon, LogIn, Crown } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            QuizMaster<span className="text-indigo-500">Pro</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/leaderboard" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-medium">
            <Crown className="w-4 h-4" />
            Ranking
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4 border-l border-slate-800 pl-6">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-semibold text-white">{user?.username}</span>
                <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold">LVL {user?.level}</span>
              </div>
              <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 ring-2 ring-indigo-500/20">
                <UserIcon className="w-5 h-5 text-indigo-400" />
              </div>
              <button 
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
