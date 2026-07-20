export type JourneyMapPoint = {
  id: string;
  x: number;
  y: number;
  label: string;
  labelX: number;
  labelY: number;
  anchor?: 'start' | 'middle' | 'end';
};

export const journeyMapPoints: JourneyMapPoint[] = [
  { id: 'saigon', x: 1018, y: 443, label: 'Bến Nhà Rồng', labelX: 1001, labelY: 424, anchor: 'end' },
  { id: 'singapore', x: 932, y: 535, label: 'Singapore', labelX: 920, labelY: 564, anchor: 'middle' },
  { id: 'colombo', x: 760, y: 510, label: 'Colombo', labelX: 744, labelY: 542, anchor: 'middle' },
  { id: 'portsaid', x: 390, y: 310, label: 'Port Said', labelX: 375, labelY: 291, anchor: 'end' },
  { id: 'marseille-stop', x: 222, y: 190, label: 'Marseille', labelX: 238, labelY: 218, anchor: 'start' },
  { id: 'paris', x: 188, y: 146, label: 'Paris', labelX: 174, labelY: 128, anchor: 'end' },
  { id: 'pacbo', x: 1008, y: 342, label: 'Pác Bó', labelX: 990, labelY: 322, anchor: 'end' }
];

export const journeyRoutePath = journeyMapPoints
  .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
  .join(' ');
