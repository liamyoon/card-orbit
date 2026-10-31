import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from '../data/cards';

export function isSupportedImage(file: Pick<File, 'type' | 'size'>): boolean {
  return ACCEPTED_IMAGE_TYPES.includes(file.type) && file.size <= MAX_IMAGE_BYTES;
}

export async function decodeImage(file: File) {
  const src = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = src;
    await image.decode();
    return { src };
  } catch (error) {
    URL.revokeObjectURL(src);
    throw error;
  }
}
