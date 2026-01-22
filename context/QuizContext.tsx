
import React, { createContext, useContext, useState } from 'react';
import { Question, QuizSession, GameStatus, QuizSettings } from '../types.ts';

interface QuizContextType {
  status: GameStatus;
  session: QuizSession | null;
  settings: QuizSettings | null;
  startQuiz: (questions: Question[], settings: QuizSettings) => void;
  submitAnswer: (answer: string, timeTaken: number) => void;
  resetQuiz: () => void;
  nextQuestion: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [settings, setSettings] = useState<QuizSettings | null>(null);

  const startQuiz = (questions: Question[], quizSettings: QuizSettings) => {
    setSettings(quizSettings);
    setSession({
      questions,
      currentQuestionIndex: 0,
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      startTime: Date.now(),
      answers: []
    });
    setStatus(GameStatus.PLAYING);
  };

  const submitAnswer = (answer: string, timeTaken: number) => {
    if (!session || status !== GameStatus.PLAYING) return;

    const currentQuestion = session.questions[session.currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    let points = 0;
    if (isCorrect) {
      const basePoints = 100;
      const speedBonus = Math.max(0, (settings?.timePerQuestion || 30) - timeTaken) * 2;
      points = basePoints + Math.floor(speedBonus);
    }

    const updatedSession: QuizSession = {
      ...session,
      score: session.score + points,
      correctAnswers: session.correctAnswers + (isCorrect ? 1 : 0),
      wrongAnswers: session.wrongAnswers + (isCorrect ? 0 : 1),
      answers: [
        ...session.answers,
        {
          questionId: currentQuestion.id,
          selectedAnswer: answer,
          isCorrect,
          timeTaken
        }
      ]
    };

    setSession(updatedSession);
  };

  const nextQuestion = () => {
    if (!session) return;

    if (session.currentQuestionIndex + 1 < session.questions.length) {
      setSession({
        ...session,
        currentQuestionIndex: session.currentQuestionIndex + 1
      });
    } else {
      setStatus(GameStatus.FINISHED);
      setSession({
        ...session,
        endTime: Date.now()
      });
    }
  };

  const resetQuiz = () => {
    setStatus(GameStatus.IDLE);
    setSession(null);
    setSettings(null);
  };

  return (
    <QuizContext.Provider value={{ status, session, settings, startQuiz, submitAnswer, resetQuiz, nextQuestion }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuiz must be used within a QuizProvider');
  return context;
};
