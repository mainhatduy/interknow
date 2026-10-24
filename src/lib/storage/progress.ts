export interface LessonProgress {
  lessonId: string;
  predictionAnswered: boolean;
  predictedChoice?: number;
  tinkered: boolean;
  quizScore?: number;
  completed: boolean;
  lastVisited: number;
}

export interface UserStats {
  completedLessons: string[];
  totalPoints: number;
}

const STORAGE_KEY = 'interknow_user_progress_v1';

export function getLessonProgress(lessonId: string): LessonProgress {
  if (typeof window === 'undefined') {
    return {
      lessonId,
      predictionAnswered: false,
      tinkered: false,
      completed: false,
      lastVisited: Date.now(),
    };
  }

  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${lessonId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read progress from localStorage', e);
  }

  return {
    lessonId,
    predictionAnswered: false,
    tinkered: false,
    completed: false,
    lastVisited: Date.now(),
  };
}

export function saveLessonProgress(progress: Partial<LessonProgress> & { lessonId: string }) {
  if (typeof window === 'undefined') return;

  try {
    const existing = getLessonProgress(progress.lessonId);
    const updated: LessonProgress = {
      ...existing,
      ...progress,
      lastVisited: Date.now(),
    };
    localStorage.setItem(`${STORAGE_KEY}_${progress.lessonId}`, JSON.stringify(updated));
    window.dispatchEvent(new Event('interknow-progress-update'));
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
}

export function getAllLessonsProgress(lessonIds: string[]): Record<string, LessonProgress> {
  const result: Record<string, LessonProgress> = {};
  for (const id of lessonIds) {
    result[id] = getLessonProgress(id);
  }
  return result;
}
