
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { QuizProvider } from './context/QuizContext.tsx';
import Navbar from './components/Navbar.tsx';
import LandingPage from './pages/LandingPage.tsx';
import QuizSetup from './pages/QuizSetup.tsx';
import GameView from './pages/GameView.tsx';
import Leaderboard from './pages/Leaderboard.tsx';
import ResultPage from './pages/ResultPage.tsx';

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
