
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  id: string;
  category: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctAnswer: string;
  type: 'mcq' | 'boolean';
}

export interface QuizSettings {
  category: string;
  difficulty: Difficulty;
  questionCount: number;
  timePerQuestion: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  totalScore: number;
  level: number;
  experience: number;
  gamesPlayed: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  level: number;
  rank: number;
}

export interface QuizSession {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  startTime: number;
  endTime?: number;
  answers: {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
    timeTaken: number;
  }[];
}

export enum GameStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}
