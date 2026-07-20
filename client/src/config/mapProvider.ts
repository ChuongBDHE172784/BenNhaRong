export interface MapProviderConfig {
  name: string;
  styleUrl: string;
  attribution: string;
  apiKeyRequired: boolean;
  minZoom: number;
  maxZoom: number;
  documentationUrl: string;
}

export const trackAsiaProvider: MapProviderConfig = {
  name: 'TrackAsia',
  styleUrl: 'https://maps.track-asia.com/styles/v2/streets.json',
  attribution: 'Bản đồ © TrackAsia',
  apiKeyRequired: true,
  minZoom: 0,
  maxZoom: 22,
  documentationUrl: 'https://docs.track-asia.com/guides/'
};

export function readMapApiKey(): string {
  return (import.meta.env.VITE_TRACKASIA_API_KEY ?? '').trim();
}

export function createTrackAsiaStyleUrl(apiKey: string): string {
  const key = apiKey.trim();
  if (!key) throw new Error('Thiếu VITE_TRACKASIA_API_KEY');
  return `${trackAsiaProvider.styleUrl}?key=${encodeURIComponent(key)}`;
}
