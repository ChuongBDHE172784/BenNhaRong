import { createContext, useContext, useEffect, useMemo, useState, useCallback, type ReactNode } from 'react';

export type ProgressState = { visitedPages: string[]; journeyStops: string[]; timelineEvents: string[]; hotspots: string[]; badges: string[]; quizScore: number; games: string[] };
const initial: ProgressState = { visitedPages: [], journeyStops: [], timelineEvents: [], hotspots: [], badges: [], quizScore: 0, games: [] };
const key = 'ben-nha-rong-progress-v1';
export const completionFor = (p: ProgressState) => Math.min(100, Math.round((p.visitedPages.length / 9 * 25) + (p.journeyStops.length / 7 * 20) + (p.timelineEvents.length / 8 * 15) + (p.hotspots.length / 8 * 15) + (p.games.length / 3 * 15) + (p.badges.length / 6 * 10)));
type ContextValue = { progress: ProgressState; completion: number; mark: (field: keyof Omit<ProgressState, 'quizScore'>, value: string) => void; setQuizScore: (score: number) => void; reset: () => void };
const ProgressContext = createContext<ContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => { try { return { ...initial, ...JSON.parse(localStorage.getItem(key) || '{}') }; } catch { return initial; } });
  useEffect(() => localStorage.setItem(key, JSON.stringify(progress)), [progress]);

  const mark = useCallback((field: keyof Omit<ProgressState, 'quizScore'>, value: string) => {
    setProgress((p) => (p[field] as string[]).includes(value) ? p : ({ ...p, [field]: [...(p[field] as string[]), value] }));
  }, []);

  const setQuizScore = useCallback((score: number) => {
    setProgress((p) => score <= p.quizScore ? p : ({ ...p, quizScore: score }));
  }, []);

  const reset = useCallback(() => {
    setProgress(initial);
  }, []);

  const value = useMemo<ContextValue>(() => ({
    progress,
    completion: completionFor(progress),
    mark,
    setQuizScore,
    reset
  }), [progress, mark, setQuizScore, reset]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
export function useProgress() { const value = useContext(ProgressContext); if (!value) throw new Error('ProgressProvider missing'); return value; }
