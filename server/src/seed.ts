import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { seedReflections } from './data.js';

const here = dirname(fileURLToPath(import.meta.url));
const target = join(here, '..', 'data', 'reflections.json');
await mkdir(dirname(target), { recursive: true });
await writeFile(target, JSON.stringify(seedReflections, null, 2));
console.log(`Đã seed ${seedReflections.length} cảm nhận minh họa.`);
