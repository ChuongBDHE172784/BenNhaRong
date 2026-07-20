/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_TRACKASIA_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
