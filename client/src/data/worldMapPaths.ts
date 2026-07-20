export type MapLandPath = { id: string; d: string; className?: string; label?: { x: number; y: number; text: string } };

// Đường bờ được giản lược có chủ đích cho bản đồ kể chuyện, không biểu diễn biên giới chính trị.
export const worldMapPaths: MapLandPath[] = [
  { id: 'europe', d: 'M80 132 L112 101 164 94 190 112 226 103 275 123 316 153 305 190 270 203 245 232 199 220 172 194 129 203 97 177 Z', label: { x: 190, y: 84, text: 'CHÂU ÂU' } },
  { id: 'africa', d: 'M292 235 L352 224 407 253 457 309 477 373 458 444 415 520 367 575 337 520 312 446 276 382 260 304 Z', label: { x: 365, y: 403, text: 'CHÂU PHI' } },
  { id: 'asia', d: 'M302 125 L383 88 479 84 548 101 626 91 710 116 789 106 875 126 951 163 1020 207 1059 253 1051 306 1012 329 960 319 911 343 865 330 818 357 766 334 713 304 659 293 601 254 548 244 499 206 441 213 392 184 337 178 Z', label: { x: 685, y: 164, text: 'CHÂU Á' } },
  { id: 'arabia', d: 'M473 291 L535 277 589 312 562 368 506 354 Z' },
  { id: 'india', d: 'M675 307 L736 325 775 369 747 445 710 493 679 424 650 362 Z' },
  { id: 'southeast-asia', d: 'M822 346 L872 367 902 414 936 442 927 489 891 468 861 422 830 398 Z' },
  { id: 'malay-peninsula', d: 'M916 421 L939 448 948 509 934 540 921 501 905 462 Z' },
  { id: 'sumatra', d: 'M868 508 L902 517 931 555 915 570 878 548 851 519 Z' },
  { id: 'vietnam', className: 'vietnam-mainland', d: 'M982 330 L1008 337 1024 365 1016 391 1031 421 1026 462 1011 476 1000 450 1004 418 990 391 996 363 Z', label: { x: 1039, y: 351, text: 'VIỆT NAM' } },
  { id: 'sri-lanka', d: 'M755 486 C765 483 775 492 772 507 C768 520 756 520 752 507 Z' }
];
