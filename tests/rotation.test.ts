import { describe, expect, test } from 'bun:test';
import { identity, rotate, transform } from '../src/lib/rotation';
describe('screen-space card rotation', () => {
  test('a full revolution returns to the same visible orientation on either axis', () => {
    for (const [x, y] of [
      [360, 0],
      [0, 360],
    ]) {
      const q = rotate(identity, x, y);
      expect(Math.abs(q[3])).toBeCloseTo(1, 10);
      expect(Math.hypot(q[0], q[1], q[2])).toBeCloseTo(0, 10);
    }
  });
  test('a half turn reveals the back on both axes', () => {
    for (const [x, y] of [
      [180, 0],
      [0, 180],
    ]) {
      const [a, b] = rotate(identity, x, y);
      expect(1 - 2 * (a * a + b * b)).toBeCloseTo(-1, 10);
    }
  });
  test('mixed drag rotations can be reversed without drift', () => {
    let q = rotate(identity, 70, 125);
    q = rotate(q, -38, 13);
    q = rotate(q, 38, -13);
    q = rotate(q, -70, -125);
    expect(q[3]).toBeCloseTo(1, 10);
    expect(Math.hypot(...q)).toBeCloseTo(1, 10);
  });
  test('many drags preserve a normalized, finite orientation', () => {
    let q = identity;
    for (let i = 0; i < 10000; i++) q = rotate(q, 0.45, -1.7);
    expect(Math.hypot(...q)).toBeCloseTo(1, 10);
    expect(transform(q)).not.toContain('NaN');
  });
});
