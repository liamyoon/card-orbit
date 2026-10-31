import { describe, expect, test } from 'bun:test';
import { isSupportedImage } from '../src/lib/imageFiles';
import { MAX_IMAGE_BYTES } from '../src/data/cards';

describe('image upload constraints', () => {
  test('allows supported images up to the exact size limit', () => {
    for (const type of ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']) {
      expect(isSupportedImage({ type, size: MAX_IMAGE_BYTES })).toBe(true);
    }
  });
  test('rejects unsupported content and oversized images', () => {
    expect(isSupportedImage({ type: 'image/svg+xml', size: 100 })).toBe(false);
    expect(isSupportedImage({ type: '', size: 100 })).toBe(false);
    expect(isSupportedImage({ type: 'image/png', size: MAX_IMAGE_BYTES + 1 })).toBe(false);
  });
});
