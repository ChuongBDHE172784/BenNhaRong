import type { QuizQuestion } from '../types';
export const calculateScore = (questions: QuizQuestion[], answers: Record<string, number>) => questions.reduce((score, q) => score + (answers[q.id] === q.answer ? 1 : 0), 0);
export const filterArtifacts = <T extends { title: string; description: string; room: string; era: string }>(items: T[], search: string, room: string, era: string) => {
  const q = search.toLocaleLowerCase('vi');
  return items.filter((item) => (!q || `${item.title} ${item.description}`.toLocaleLowerCase('vi').includes(q)) && (room === 'Tất cả' || item.room === room) && (era === 'Tất cả' || item.era.includes(era)));
};
