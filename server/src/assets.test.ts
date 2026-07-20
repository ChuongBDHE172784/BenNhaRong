import { readFileSync, readdirSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { events } from './data.js';

const assetsDirectory = join(process.cwd(), '..', 'client', 'public', 'assets');

function detectedKind(path: string): 'jpeg' | 'png' | 'webp' | 'invalid' {
  const bytes = readFileSync(path);
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg';
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'png';
  if (bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP') return 'webp';
  return 'invalid';
}

describe('Timeline image assets', () => {
  it('dùng đường dẫn lowercase với filename tồn tại đúng case', () => {
    const exactNames = new Set(readdirSync(assetsDirectory));
    events.forEach((event) => {
      expect(event.image).toBe(event.image.toLowerCase());
      expect(exactNames.has(basename(event.image))).toBe(true);
    });
  });

  it('extension của từng ảnh khớp magic bytes thực tế', () => {
    events.forEach((event) => {
      const extension = extname(event.image);
      const expected = extension === '.png' ? 'png' : extension === '.webp' ? 'webp' : 'jpeg';
      expect(detectedKind(join(assetsDirectory, basename(event.image))), event.image).toBe(expected);
    });
  });
});
