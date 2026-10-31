export type Artwork = { id: string; src: string; name: string };
export type Axis = 'x' | 'y';
export type ObjectMode = 'card' | 'book';
export type Direction = 'up' | 'down' | 'left' | 'right';
export type ImageFiles = FileList | File[] | null;
export interface CardAppearance {
  mode: ObjectMode;
  bookThickness: number;
  spineTitle: string;
  holo: boolean;
  glow: number;
  back: string | null;
  backColor: string;
  backText: string;
}
export interface AppearanceControls extends CardAppearance {
  setMode: (value: ObjectMode) => void;
  setBookThickness: (value: number) => void;
  setSpineTitle: (value: string) => void;
  setHolo: (value: boolean) => void;
  setGlow: (value: number) => void;
  setBack: (value: string | null) => void;
  setBackColor: (value: string) => void;
  setBackText: (value: string) => void;
}
