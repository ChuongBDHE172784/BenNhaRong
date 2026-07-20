export interface SovereigntyLocation {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  description: string;
}

export const vietnamSovereigntyLocations: SovereigntyLocation[] = [
  {
    id: 'hoang-sa',
    name: 'Quần đảo Hoàng Sa',
    country: 'Việt Nam',
    latitude: 16.5,
    longitude: 112,
    description: 'Quần đảo Hoàng Sa là bộ phận không thể tách rời của lãnh thổ Việt Nam.'
  },
  {
    id: 'truong-sa',
    name: 'Quần đảo Trường Sa',
    country: 'Việt Nam',
    latitude: 10,
    longitude: 114,
    description: 'Quần đảo Trường Sa là bộ phận không thể tách rời của lãnh thổ Việt Nam.'
  }
];

export const vietnamViewBounds: [[number, number], [number, number]] = [
  [102, 7],
  [117.5, 23.5]
];
