import { app } from './app.js';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import express from 'express';

const port = Number(process.env.PORT) || 4000;
const clientDist = join(process.cwd(), '..', 'client', 'dist');
if (process.env.NODE_ENV === 'production' && existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((_req, res) => res.sendFile(join(clientDist, 'index.html')));
}
app.listen(port, () => console.log(`[api] http://localhost:${port}`));
