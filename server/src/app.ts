import express, { type ErrorRequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { randomUUID } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { artifacts, badges, events, hotspots, journey, quiz, seedReflections, sources } from './data.js';
import { contentSecurityPolicyDirectives, currentBuildId } from './security.js';

const here = dirname(fileURLToPath(import.meta.url));
const dbPath = join(here, '..', 'data', 'reflections.json');
const reflectionSchema = z.object({
  name: z.string().trim().min(2, 'Tên cần ít nhất 2 ký tự').max(40, 'Tên tối đa 40 ký tự'),
  content: z.string().trim().min(10, 'Cảm nhận cần ít nhất 10 ký tự').max(600, 'Cảm nhận tối đa 600 ký tự'),
  emotion: z.enum(['Xúc động', 'Tò mò', 'Truyền cảm hứng', 'Tự hào', 'Hứng thú']),
  confirmed: z.literal(true, { errorMap: () => ({ message: 'Bạn cần xác nhận nội dung phù hợp' }) })
});

const sanitize = (value: string) => value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
async function readReflections() {
  try { return JSON.parse(await readFile(dbPath, 'utf8')) as typeof seedReflections; }
  catch { await mkdir(dirname(dbPath), { recursive: true }); await writeFile(dbPath, JSON.stringify(seedReflections, null, 2)); return seedReflections; }
}

export const app = express();
app.disable('x-powered-by');
app.use(helmet({
  crossOriginResourcePolicy: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  contentSecurityPolicy: { directives: contentSecurityPolicyDirectives }
}));
app.use((_req, res, next) => { res.setHeader('X-App-Build', currentBuildId()); next(); });
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') ?? ['http://localhost:5173'] }));
app.use(express.json({ limit: '20kb' }));
app.use('/api/reflections', rateLimit({ windowMs: 60_000, limit: 8, standardHeaders: 'draft-7', legacyHeaders: false }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'Từ Bến Nhà Rồng API', timestamp: new Date().toISOString() }));
const collection = (path: string, data: unknown[]) => {
  app.get(`/api/${path}`, (_req, res) => res.json({ data, total: data.length }));
  app.get(`/api/${path}/:id`, (req, res) => {
    const item = data.find((entry) => typeof entry === 'object' && entry !== null && 'id' in entry && entry.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Không tìm thấy nội dung' });
    return res.json({ data: item });
  });
};
collection('events', events); collection('journey', journey); collection('artifacts', artifacts); collection('quiz', quiz); collection('sources', sources);
app.get('/api/hotspots', (_req, res) => res.json({ data: hotspots, total: hotspots.length }));
app.get('/api/badges', (_req, res) => res.json({ data: badges, total: badges.length }));
app.get('/api/reflections', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1); const limit = Math.min(12, Math.max(1, Number(req.query.limit) || 6));
    const all = (await readReflections()).filter((item) => item.status === 'approved'); const start = (page - 1) * limit;
    res.json({ data: all.slice(start, start + limit), total: all.length, page, pages: Math.ceil(all.length / limit) });
  } catch (error) { next(error); }
});
app.post('/api/reflections', async (req, res, next) => {
  try {
    const parsed = reflectionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(422).json({ error: 'Dữ liệu chưa hợp lệ', details: parsed.error.flatten().fieldErrors });
    const all = await readReflections();
    const item = { id: randomUUID(), name: sanitize(parsed.data.name), content: sanitize(parsed.data.content), emotion: parsed.data.emotion, status: 'approved' as const, isSample: false, createdAt: new Date().toISOString() };
    all.unshift(item); await writeFile(dbPath, JSON.stringify(all, null, 2));
    return res.status(201).json({ data: item, message: 'Cảm ơn bạn đã chia sẻ cảm nhận.' });
  } catch (error) { return next(error); }
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'API không tồn tại' }));
const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error('[api:error]', error); res.status(500).json({ error: 'Đã có lỗi xảy ra. Vui lòng thử lại.' });
};
app.use(errorHandler);
