import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const clientRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, clientRoot, '');
  if (mode === 'production' && !env.VITE_TRACKASIA_API_KEY?.trim()) {
    throw new Error('Production build requires VITE_TRACKASIA_API_KEY at build time.');
  }

  return {
    envDir: clientRoot,
    plugins: [react()],
    server: { port: 5173, proxy: { '/api': { target: 'http://localhost:4000', changeOrigin: true } } },
    preview: { port: 4173 }
  };
});
