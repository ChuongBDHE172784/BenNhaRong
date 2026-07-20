import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from './app.js';

describe('API', () => {
  it('trả trạng thái khỏe', async () => { const res = await request(app).get('/api/health'); expect(res.status).toBe(200); expect(res.body.status).toBe('ok'); });
  it('trả danh sách dữ liệu đã seed', async () => { const res = await request(app).get('/api/events'); expect(res.status).toBe(200); expect(res.body.total).toBeGreaterThanOrEqual(8); });
  it('nhận cảm nhận hợp lệ', async () => { const res = await request(app).post('/api/reflections').send({ name: 'Người xem', content: 'Một trải nghiệm lịch sử rất đáng nhớ và chỉn chu.', emotion: 'Xúc động', confirmed: true }); expect(res.status).toBe(201); });
  it('từ chối cảm nhận rỗng', async () => { const res = await request(app).post('/api/reflections').send({ name: '', content: '', emotion: 'Xúc động', confirmed: false }); expect(res.status).toBe(422); });
});
