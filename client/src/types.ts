export type Source = { id: string; organization: string; title: string; url: string; accessedAt: string; usedFor: string; copyright?: string };
export type EventItem = { id: string; year: string; title: string; category: string; summary: string; detail: string; image: string; sourceId: string };
export type JourneyStop = { id: string; order: number; name: string; date: string; coordinates: [number, number]; summary: string; significance: string; image: string; sourceId: string };
export type Artifact = { id: string; room: string; title: string; era: string; type: string; description: string; image: string; sourceId: string };
export type QuizQuestion = { id: string; question: string; options: string[]; answer: number; explanation: string; sourceId: string };
export type Hotspot = { id: string; x: number; y: number; title: string; text: string };
export type Badge = { id: string; name: string; description: string };
export type Reflection = { id: string; name: string; content: string; emotion: string; isSample: boolean; createdAt: string };
