
import { Difficulty } from './types';

export const CATEGORIES = [
  { id: 'general', name: 'General Knowledge', icon: 'Globe', color: 'bg-blue-500' },
  { id: 'science', name: 'Science & Nature', icon: 'FlaskConical', color: 'bg-green-500' },
  { id: 'tech', name: 'Technology & Computers', icon: 'Cpu', color: 'bg-purple-500' },
  { id: 'history', name: 'History', icon: 'ScrollText', color: 'bg-amber-500' },
  { id: 'sports', name: 'Sports', icon: 'Trophy', color: 'bg-orange-500' },
  { id: 'geography', name: 'Geography', icon: 'Map', color: 'bg-cyan-500' },
  { id: 'art', name: 'Art & Literature', icon: 'Palette', color: 'bg-rose-500' },
  { id: 'mythology', name: 'Mythology', icon: 'Sparkles', color: 'bg-indigo-500' }
];

export const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export const SCORE_MULTIPLIERS = {
  Easy: 10,
  Medium: 20,
  Hard: 30
};

export const TIME_BONUS_WEIGHT = 0.5; // Up to 50% bonus for fast answers

export const XP_PER_SCORE = 2;
export const XP_FOR_LEVEL_UP = (level: number) => Math.floor(100 * Math.pow(level, 1.5));
