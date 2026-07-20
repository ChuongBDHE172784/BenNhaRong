export type MapLoadState = 'initializing' | 'loading-style' | 'loading-sources' | 'ready' | 'degraded' | 'failed';
export type MapResourceType = 'style' | 'sprite' | 'glyph' | 'tile' | 'source' | 'worker' | 'unknown';

export type SafeMapError = {
  type: MapResourceType;
  host: string | null;
  status: number | null;
  message: string;
  sourceId?: string;
  sourceDataType?: string;
  tile?: string;
  cspSuggestion?: string;
};

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  return typeof value === 'object' && value !== null ? value as UnknownRecord : {};
}

function stringValue(...values: unknown[]): string | undefined {
  return values.find((value): value is string => typeof value === 'string' && value.length > 0);
}

function numberValue(...values: unknown[]): number | null {
  const match = values.find((value) => typeof value === 'number' && Number.isFinite(value));
  return typeof match === 'number' ? match : null;
}

function findUrl(message: string, event: UnknownRecord, error: UnknownRecord): URL | null {
  const explicit = stringValue(error.url, event.url);
  const candidate = explicit || message.match(/https?:\/\/[^\s"'<>]+/i)?.[0];
  if (!candidate) return null;
  try { return new URL(candidate.replace(/[),.;]+$/, '')); } catch { return null; }
}

function redactMessage(message: string, apiKey: string): string {
  let safe = message.replace(/https?:\/\/[^\s"'<>]+/gi, (candidate) => {
    try {
      const url = new URL(candidate.replace(/[),.;]+$/, ''));
      return `${url.origin}${url.pathname}`;
    } catch { return '[REDACTED_URL]'; }
  });
  safe = safe.replace(/\b(key|apikey|access_token|token)\s*[=:]\s*[^\s&,;]+/gi, '$1=[REDACTED]');
  if (apiKey) safe = safe.split(apiKey).join('[REDACTED]');
  return safe.replace(/\s+/g, ' ').trim().slice(0, 280) || 'Map resource request failed';
}

function classifyResource(event: UnknownRecord, url: URL | null, message: string): MapResourceType {
  const declared = stringValue(event.resourceType)?.toLowerCase();
  if (declared) {
    if (declared.includes('glyph')) return 'glyph';
    if (declared.includes('sprite') || declared === 'image') return 'sprite';
    if (declared.includes('tile')) return 'tile';
    if (declared.includes('source')) return 'source';
    if (declared.includes('style')) return 'style';
  }

  const path = url?.pathname.toLowerCase() || '';
  const lowerMessage = message.toLowerCase();
  if (url?.protocol === 'blob:' || lowerMessage.includes('worker')) return 'worker';
  if (path.includes('/font/') || lowerMessage.includes('glyph')) return 'glyph';
  if (path.includes('/sprite') || lowerMessage.includes('sprite')) return 'sprite';
  if (path.includes('/styles/') || lowerMessage.includes('style')) return 'style';
  if (url?.hostname.startsWith('tiles.') || /\.(pbf|mvt)$/i.test(path) || lowerMessage.includes('tile')) return 'tile';
  if (path.endsWith('.json') || event.dataType === 'source' || lowerMessage.includes('source')) return 'source';
  return 'unknown';
}

function tileCoordinate(event: UnknownRecord): string | undefined {
  const tile = asRecord(event.tile || event.coord);
  const tileId = asRecord(tile.tileID || tile.id || tile.canonical || tile);
  const canonical = asRecord(tileId.canonical || tileId);
  const z = numberValue(canonical.z, tileId.overscaledZ);
  const x = numberValue(canonical.x);
  const y = numberValue(canonical.y);
  return z !== null && x !== null && y !== null ? `${z}/${x}/${y}` : undefined;
}

function suggestion(type: MapResourceType, host: string | null): string | undefined {
  if (type === 'worker') return "worker-src 'self' blob:";
  if (!host) return undefined;
  if (type === 'sprite') return `connect-src https://${host}; img-src https://${host}`;
  if (type === 'glyph') return `connect-src https://${host}; font-src https://${host}`;
  if (type === 'style' || type === 'source' || type === 'tile') return `connect-src https://${host}`;
  return undefined;
}

export function sanitizeTrackAsiaError(input: unknown, apiKey = ''): SafeMapError {
  const event = asRecord(input);
  const error = asRecord(event.error);
  const rawMessage = stringValue(error.message, event.message) || 'Map resource request failed';
  const url = findUrl(rawMessage, event, error);
  const statusFromMessage = rawMessage.match(/(?:status|http)\D{0,8}(\d{3})/i)?.[1];
  const status = numberValue(error.status, event.status, statusFromMessage ? Number(statusFromMessage) : null);
  const type = classifyResource(event, url, rawMessage);
  const host = url?.hostname || null;
  const source = asRecord(event.source);
  const sourceId = stringValue(event.sourceId, source.id);
  const sourceDataType = stringValue(event.sourceDataType);
  const tile = tileCoordinate(event);

  return {
    type,
    host,
    status,
    message: redactMessage(rawMessage, apiKey),
    ...(sourceId ? { sourceId } : {}),
    ...(sourceDataType ? { sourceDataType } : {}),
    ...(tile ? { tile } : {}),
    ...(suggestion(type, host) ? { cspSuggestion: suggestion(type, host) } : {})
  };
}
