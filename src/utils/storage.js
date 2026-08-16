// Utility for managing local storage without requiring any backend.
// All your data belongs to you and stays on your machine.

const STORAGE_PREFIX = 'cyberTracker_';

export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = window.localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage`, error);
    }
  },

  remove: (key) => {
    try {
      window.localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage`, error);
    }
  },

  // Specialized helpers
  getInitialState: () => {
    return {
      progress: storage.get('progress', 0),
      certifications: storage.get('certifications', []),
      weeklyLogs: storage.get('weeklyLogs', []),
      notes: storage.get('notes', []),
    };
  }
};

// ============================================================
// PHASE TEST SCORES
// ============================================================

const TEST_SCORES_KEY = 'phaseTestScores';

// Pure merge: returns a new best-scores map keeping the
// highest score per phase. Use with storage.set + setState.
export function mergeBestTestScore(prev, phaseId, score, total) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const previousBest = prev[phaseId];

  return {
    ...prev,
    [phaseId]: previousBest && previousBest.pct >= pct
      ? previousBest
      : { score, total, pct, date: new Date().toISOString() }
  };
}

export function loadTestScores() {
  return storage.get(TEST_SCORES_KEY, {});
}

export function saveTestScores(scores) {
  storage.set(TEST_SCORES_KEY, scores);
}
