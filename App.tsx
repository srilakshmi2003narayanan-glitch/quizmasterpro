
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import QuizSetup from './pages/QuizSetup';
import GameView from './pages/GameView';
import Leaderboard from './pages/Leaderboard';
import ResultPage from './pages/ResultPage';

// Explicitly type ProtectedRoute to ensure children are recognized as required props in TSX.
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

const AppRoutes = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      <Navbar />
      <main className="container mx-auto px-4 pb-20 pt-24 max-w-7xl">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/setup" 
            element={
              <ProtectedRoute>
                <QuizSetup />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/play" 
            element={
              <ProtectedRoute>
                <GameView />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leaderboard" 
            element={<Leaderboard />} 
          />
          <Route 
            path="/results" 
            element={
              <ProtectedRoute>
                <ResultPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <QuizProvider>
          <AppRoutes />
        </QuizProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
