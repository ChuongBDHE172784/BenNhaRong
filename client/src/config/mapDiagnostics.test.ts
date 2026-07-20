import { describe, expect, it } from 'vitest';
import { sanitizeTrackAsiaError } from './mapDiagnostics';

describe('TrackAsia diagnostics', () => {
  it('redact API key và query nhạy cảm khỏi lỗi tile', () => {
    const apiKey = 'raw-secret-map-key';
    const safe = sanitizeTrackAsiaError({
      error: {
        status: 403,
        url: `https://tiles.track-asia.com/2/3/1.pbf?key=${apiKey}`,
        message: `HTTP status 403 at https://tiles.track-asia.com/2/3/1.pbf?key=${apiKey}`
      },
      sourceId: 'composite',
      sourceDataType: 'content',
      coord: { canonical: { z: 2, x: 3, y: 1 } }
    }, apiKey);

    expect(safe).toMatchObject({ type: 'tile', host: 'tiles.track-asia.com', status: 403, sourceId: 'composite', tile: '2/3/1' });
    expect(JSON.stringify(safe)).not.toContain(apiKey);
    expect(JSON.stringify(safe)).not.toContain('?key=');
  });

  it('phân loại glyph và chỉ đưa hostname vào gợi ý CSP', () => {
    const safe = sanitizeTrackAsiaError({ error: { message: 'Failed glyph https://maps.track-asia.com/mapstyle/font/a/0-255.pbf?token=hidden' } });
    expect(safe.type).toBe('glyph');
    expect(safe.host).toBe('maps.track-asia.com');
    expect(safe.cspSuggestion).toContain('https://maps.track-asia.com');
    expect(safe.message).not.toContain('token=hidden');
  });

  it('không phản chiếu token đứng riêng trong message', () => {
    const safe = sanitizeTrackAsiaError({ error: { message: 'access_token=very-sensitive request failed' } });
    expect(safe.message).toBe('access_token=[REDACTED] request failed');
  });
});
