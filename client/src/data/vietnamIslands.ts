export type VietnamIslandGroup = {
  id: 'hoang-sa' | 'truong-sa';
  x: number;
  y: number;
  label: string;
  nation: string;
  message: string;
};

export const vietnamIslandGroups: VietnamIslandGroup[] = [
  {
    id: 'hoang-sa',
    x: 1068,
    y: 405,
    label: 'Quần đảo Hoàng Sa',
    nation: 'Việt Nam',
    message: 'Quần đảo Hoàng Sa là bộ phận không thể tách rời của lãnh thổ Việt Nam.'
  },
  {
    id: 'truong-sa',
    x: 1082,
    y: 494,
    label: 'Quần đảo Trường Sa',
    nation: 'Việt Nam',
    message: 'Quần đảo Trường Sa là bộ phận không thể tách rời của lãnh thổ Việt Nam.'
  }
];
