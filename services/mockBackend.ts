
import { User, LeaderboardEntry } from '../types';

const USERS_KEY = 'quizmaster_users';
const CURRENT_USER_KEY = 'quizmaster_current_user';
const LEADERBOARD_KEY = 'quizmaster_leaderboard';

export const mockBackend = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  updateUser: (updatedUser: User) => {
    const users = mockBackend.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
    } else {
      users.push(updatedUser);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    mockBackend.setCurrentUser(updatedUser);
    mockBackend.updateLeaderboard(updatedUser);
  },

  updateLeaderboard: (user: User) => {
    const leaderboard = mockBackend.getLeaderboard();
    const entryIndex = leaderboard.findIndex(e => e.userId === user.id);
    
    if (entryIndex !== -1) {
      leaderboard[entryIndex].score = user.totalScore;
      leaderboard[entryIndex].level = user.level;
    } else {
      leaderboard.push({
        userId: user.id,
        username: user.username,
        score: user.totalScore,
        level: user.level,
        rank: 0
      });
    }

    // Sort and rank
    const ranked = leaderboard
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(ranked));
  },

  getLeaderboard: (): LeaderboardEntry[] => {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : [];
  }
};
