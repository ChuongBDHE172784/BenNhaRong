export interface MapProviderConfig {
  name: string;
  styleUrl: string;
  attribution: string;
  apiKeyRequired: boolean;
  minZoom: number;
  maxZoom: number;
  documentationUrl: string;
}

export const vietmapProvider: MapProviderConfig = {
  name: 'VIETMAP',
  styleUrl: 'https://maps.vietmap.vn/maps/styles/dm/style.json',
  attribution: 'Bản đồ © VIETMAP',
  apiKeyRequired: true,
  minZoom: 0,
  maxZoom: 22,
  documentationUrl: 'https://maps.vietmap.vn/docs/map-api/tilemap/'
};

export function readMapApiKey(): string {
  return (import.meta.env.VITE_MAP_API_KEY ?? '').trim();
}

export function createVietmapStyleUrl(apiKey: string): string {
  const key = apiKey.trim();
  if (!key) throw new Error('Thiếu VITE_MAP_API_KEY');
  return `${vietmapProvider.styleUrl}?apikey=${encodeURIComponent(key)}`;
}
