import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const publicRoot = join(root, 'client', 'public');
const assetsRoot = join(publicRoot, 'assets');
const searchableRoots = [join(root, 'client', 'src'), join(root, 'server', 'src')];
const searchableExtensions = new Set(['.ts', '.tsx', '.css', '.html']);
const assetPattern = /\/assets\/[a-zA-Z0-9._/-]+/g;

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(path) : [path];
  }));
  return nested.flat();
}

function imageKind(bytes) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg';
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'png';
  if (bytes.length >= 12 && bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP') return 'webp';
  return 'invalid';
}

function expectedKind(path) {
  const extension = extname(path).toLowerCase();
  if (extension === '.jpg' || extension === '.jpeg') return 'jpeg';
  if (extension === '.png') return 'png';
  if (extension === '.webp') return 'webp';
  return 'unsupported';
}

async function hasExactCase(pathFromPublic) {
  const segments = pathFromPublic.split('/').filter(Boolean);
  let current = publicRoot;
  for (const segment of segments) {
    const names = await readdir(current);
    if (!names.includes(segment)) return false;
    current = join(current, segment);
  }
  return true;
}

const sourceFiles = (await Promise.all(searchableRoots.map(filesBelow))).flat()
  .filter((path) => searchableExtensions.has(extname(path)) && !path.includes('.test.'));
const references = new Set();
for (const file of sourceFiles) {
  const text = await readFile(file, 'utf8');
  for (const match of text.matchAll(assetPattern)) references.add(match[0]);
}

const publicImages = (await filesBelow(assetsRoot)).filter((path) => ['.jpg', '.jpeg', '.png', '.webp'].includes(extname(path).toLowerCase()));
const invalidFiles = [];
for (const file of publicImages) {
  const detected = imageKind(await readFile(file));
  const expected = expectedKind(file);
  if (detected !== expected) invalidFiles.push({ file: relative(root, file).replaceAll('\\', '/'), expected, detected });
}

const invalidReferences = [];
for (const reference of [...references].sort()) {
  const relativeToPublic = reference.replace(/^\//, '');
  const absolute = join(publicRoot, relativeToPublic);
  let existsWithExactCase = false;
  try { existsWithExactCase = await hasExactCase(relativeToPublic); } catch { existsWithExactCase = false; }
  const repoPath = relative(root, absolute).replaceAll('\\', '/');
  const tracked = spawnSync('git', ['ls-files', '--error-unmatch', repoPath], { cwd: root, stdio: 'ignore' }).status === 0;
  if (!existsWithExactCase || !tracked) invalidReferences.push({ reference, existsWithExactCase, tracked });
}

const report = {
  referencedAssets: references.size,
  imageFiles: publicImages.length,
  invalidFiles,
  invalidReferences
};
console.log(JSON.stringify(report, null, 2));
if (invalidFiles.length || invalidReferences.length) process.exitCode = 1;
