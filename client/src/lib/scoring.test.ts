import { describe, expect, it } from 'vitest';
import { calculateScore, filterArtifacts } from './scoring';
import { completionFor, type ProgressState } from '../context/ProgressContext';

describe('quiz scoring', () => {
  const questions = [{ id: 'a', question: 'A?', options: ['0', '1'], answer: 1, explanation: '', sourceId: 's' }];
  it('tính đúng số câu trả lời chính xác', () => expect(calculateScore(questions, { a: 1 })).toBe(1));
  it('không cộng điểm cho đáp án sai', () => expect(calculateScore(questions, { a: 0 })).toBe(0));
});

describe('progress and filters', () => {
  it('giới hạn tiến độ ở 100%', () => { const p: ProgressState = { visitedPages: Array(12).fill('p'), journeyStops: Array(10).fill('j'), timelineEvents: Array(10).fill('t'), hotspots: Array(10).fill('h'), badges: Array(10).fill('b'), games: Array(5).fill('g'), quizScore: 10 }; expect(completionFor(p)).toBe(100); });
  it('lọc tư liệu theo từ khóa và phòng', () => { const items = [{ title: 'Nhà Rồng', description: 'Bến cảng', room: 'Ngày ra đi', era: '1911' }, { title: 'Paris', description: 'Yêu sách', room: 'Thế giới', era: '1919' }]; expect(filterArtifacts(items, 'rồng', 'Ngày ra đi', 'Tất cả')).toHaveLength(1); });
});
