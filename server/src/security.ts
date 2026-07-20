export const trackAsiaStyleOrigins = ['https://maps.track-asia.com'] as const;
export const trackAsiaTileOrigins = ['https://tiles.track-asia.com'] as const;
export const trackAsiaResourceOrigins = [...trackAsiaStyleOrigins, ...trackAsiaTileOrigins] as const;

export const contentSecurityPolicyDirectives = {
  defaultSrc: ["'self'"],
  baseUri: ["'self'"],
  connectSrc: ["'self'", ...trackAsiaResourceOrigins],
  childSrc: ["'self'", 'blob:'],
  fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com', ...trackAsiaStyleOrigins],
  imgSrc: ["'self'", 'data:', 'blob:', ...trackAsiaStyleOrigins],
  objectSrc: ["'none'"],
  scriptSrc: ["'self'"],
  scriptSrcAttr: ["'none'"],
  styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  workerSrc: ["'self'", 'blob:']
};

export function currentBuildId(): string {
  const raw = process.env.RENDER_GIT_COMMIT || process.env.SOURCE_VERSION || 'local';
  return raw.replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 40) || 'local';
}
