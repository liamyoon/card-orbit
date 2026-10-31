import type { Artwork, Direction } from '../types/card';
export const CARD_ASPECT_RATIO = 400 / 710;
export const BOOK_THICKNESS = { min: 12, max: 60, default: 32 } as const;
export const INITIAL_ARTWORKS: Artwork[] = [
  { id: 'ocean', src: './images/ocean.webp', name: '바닷속 산책' },
  { id: 'summer', src: './images/summer.jpg', name: '여름의 한 장면' },
  { id: 'notes', src: './images/notes.webp', name: '작은 기록들' },
];
export const DIRECTIONS: Record<Direction, { label: string; x: number; y: number }> = {
  up: { label: '위로 회전', x: 1, y: 0 },
  down: { label: '아래로 회전', x: -1, y: 0 },
  left: { label: '왼쪽으로 회전', x: 0, y: -1 },
  right: { label: '오른쪽으로 회전', x: 0, y: 1 },
};
export const KEY_DIRECTIONS: Partial<Record<string, Direction>> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};
export const BACK_COLORS = ['#8c83b5', '#699e96', '#cc9d90', '#536783'];
export const DEFAULT_BACK_TEXT = 'little moments';
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
];
export const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
export const MAX_UPLOAD_COUNT = 20;
