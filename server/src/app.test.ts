import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from './app.js';
import { trackAsiaResourceOrigins } from './security.js';

app.get('/journey', (_req, res) => res.status(200).send('<!doctype html><div id="root"></div>'));

describe('API', () => {
  it('trả trạng thái khỏe', async () => { const res = await request(app).get('/api/health'); expect(res.status).toBe(200); expect(res.body.status).toBe('ok'); });
  it('response /journey cho phép toàn bộ TrackAsia host và Web Worker ở production', async () => {
    const res = await request(app).get('/journey');
    const csp = res.headers['content-security-policy'];
    expect(trackAsiaResourceOrigins).toEqual(['https://maps.track-asia.com', 'https://tiles.track-asia.com']);
    trackAsiaResourceOrigins.forEach((origin) => expect(csp).toContain(origin));
    expect(csp).toContain("connect-src 'self' https://maps.track-asia.com https://tiles.track-asia.com");
    expect(csp).toContain("img-src 'self' data: blob: https://maps.track-asia.com");
    expect(csp).toContain("worker-src 'self' blob:");
    expect(csp).toContain("child-src 'self' blob:");
    expect(csp).toContain("font-src 'self' data: https://fonts.gstatic.com https://maps.track-asia.com");
    expect(csp).toContain("style-src 'self' 'unsafe-inline' https://fonts.googleapis.com");
    expect(csp).toContain("script-src 'self'");
    expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(res.headers['x-app-build']).toBeTruthy();
  });
  it('trả danh sách dữ liệu đã seed', async () => { const res = await request(app).get('/api/events'); expect(res.status).toBe(200); expect(res.body.total).toBeGreaterThanOrEqual(8); });
  it('nhận cảm nhận hợp lệ', async () => { const res = await request(app).post('/api/reflections').send({ name: 'Người xem', content: 'Một trải nghiệm lịch sử rất đáng nhớ và chỉn chu.', emotion: 'Xúc động', confirmed: true }); expect(res.status).toBe(201); });
  it('từ chối cảm nhận rỗng', async () => { const res = await request(app).post('/api/reflections').send({ name: '', content: '', emotion: 'Xúc động', confirmed: false }); expect(res.status).toBe(422); });
});
