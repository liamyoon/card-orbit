import { describe, expect, test } from 'bun:test';
import { createFaceTurn, resetButtonOrientation, sampleFaceTurn } from '../src/lib/faceTurn';
import { identity, rotate, type Quaternion } from '../src/lib/rotation';

const axes = ['x', 'y'] as const;
const directions = [-1, 1] as const;
const back: Quaternion = [0, 1, 0, 0];
const normalZ = ([x, y]: Quaternion) => 1 - 2 * (x * x + y * y);
const sameOrientation = (a: Quaternion, b: Quaternion) =>
  Math.abs(a.reduce((sum, value, index) => sum + value * b[index], 0));

describe('click-only face alignment', () => {
  test('every direction preserves physical orientation instead of forcing an upright back', () => {
    for (const axis of axes) {
      for (const direction of directions) {
        for (const from of [identity, back]) {
          const expected = rotate(
            from,
            axis === 'x' ? direction * 180 : 0,
            axis === 'y' ? direction * 180 : 0,
          );
          const result = sampleFaceTurn(createFaceTurn(from, axis, direction, 180), 1);
          expect(sameOrientation(result, expected)).toBeCloseTo(1, 10);
        }
      }
    }
  });

  test('mixed-axis drag positions end at the opposite face without residual tilt', () => {
    const poses = [rotate(identity, 33, 47), rotate(back, -29, 37), rotate(identity, 90, 0)];
    for (const pose of poses) {
      for (const axis of axes) {
        for (const direction of directions) {
          const turn = createFaceTurn(pose, axis, direction, 180);
          expect(sampleFaceTurn(turn, 0)).toEqual(resetButtonOrientation(pose));
          const expectedSide = normalZ(pose) >= -1e-10 ? -1 : 1;
          const expected = sampleFaceTurn(turn, 1);
          expect(normalZ(expected)).toBeCloseTo(expectedSide, 10);
          expect(sameOrientation(sampleFaceTurn(turn, 0.999999), expected)).toBeCloseTo(1, 8);
          expect(Math.hypot(...sampleFaceTurn(turn, 0.5))).toBeCloseTo(1, 10);
        }
      }
    }
  });

  test('a full turn is animated and returns to the same visible face', () => {
    for (const axis of axes) {
      for (const direction of directions) {
        const turn = createFaceTurn(identity, axis, direction, 360);
        expect(normalZ(sampleFaceTurn(turn, 0.5))).toBeCloseTo(-1, 10);
        expect(sameOrientation(sampleFaceTurn(turn, 1), identity)).toBeCloseTo(1, 10);
        expect(
          normalZ(sampleFaceTurn(createFaceTurn(rotate(back, 20, 15), axis, direction, 360), 1)),
        ).toBeCloseTo(-1, 10);
      }
    }
  });

  test('the start of the turn follows the requested screen direction', () => {
    for (const axis of axes) {
      for (const direction of directions) {
        const pose = sampleFaceTurn(createFaceTurn(identity, axis, direction, 180), 0.001);
        expect(Math.sign(pose[axis === 'x' ? 0 : 1])).toBe(direction);
      }
    }
  });

  test('another button press resets the in-flight pose before starting its own turn', () => {
    const first = createFaceTurn(rotate(identity, 25, 13), 'x', 1, 180);
    const current = sampleFaceTurn(first, 0.4);
    const replacement = createFaceTurn(current, 'y', -1, 180);
    expect(sampleFaceTurn(replacement, 0)).toEqual(resetButtonOrientation(current));
    expect(Math.abs(normalZ(sampleFaceTurn(replacement, 1)))).toBeCloseTo(1, 10);
  });

  test('free rotation remains unsnapped, including after a click animation', () => {
    const end = sampleFaceTurn(createFaceTurn(identity, 'y', 1, 180), 1);
    const dragged = rotate(end, 23, 31);
    expect(Math.abs(normalZ(dragged))).toBeLessThan(0.9);
    expect(rotate(dragged, 0, 0)).toEqual(dragged);
  });

  test('vertical half turns never introduce horizontal rotation or roll at any frame', () => {
    for (const direction of directions) {
      const turn = createFaceTurn(identity, 'x', direction, 180);
      for (let frame = 0; frame <= 100; frame++) {
        const progress = frame / 100;
        const pose = sampleFaceTurn(turn, progress);
        expect(pose[1]).toBeCloseTo(0, 10);
        expect(pose[2]).toBeCloseTo(0, 10);
        expect(sameOrientation(pose, rotate(identity, direction * 180 * progress, 0))).toBeCloseTo(
          1,
          10,
        );
      }
    }
  });

  test('partly rotated cards reset first and then follow only the selected axis', () => {
    for (const axis of axes) {
      for (const startingAngle of [-220, -120, -30, 30, 90, 120, 220]) {
        for (const direction of directions) {
          const from = rotate(
            identity,
            axis === 'x' ? startingAngle : 0,
            axis === 'y' ? startingAngle : 0,
          );
          const turn = createFaceTurn(from, axis, direction, 180);
          const travel = axis === 'x' ? turn.x : turn.y;
          expect(Math.sign(travel)).toBe(direction);
          expect(Math.abs(travel)).toBeLessThanOrEqual(360);
          for (const progress of [0.1, 0.4, 0.7, 1]) {
            const expected = rotate(
              turn.from,
              axis === 'x' ? travel * progress : 0,
              axis === 'y' ? travel * progress : 0,
            );
            expect(sameOrientation(sampleFaceTurn(turn, progress), expected)).toBeCloseTo(1, 9);
          }
        }
      }
    }
  });

  test('switching axes after a vertical flip does not reset the top and bottom', () => {
    let pose = identity;
    for (const axis of ['x', 'y', 'x', 'x', 'y'] as const) {
      const expected = rotate(pose, axis === 'x' ? 180 : 0, axis === 'y' ? 180 : 0);
      const turn = createFaceTurn(pose, axis, 1, 180);
      for (const progress of [0.25, 0.5, 0.75]) {
        const intermediate = rotate(
          pose,
          axis === 'x' ? 180 * progress : 0,
          axis === 'y' ? 180 * progress : 0,
        );
        expect(sameOrientation(sampleFaceTurn(turn, progress), intermediate)).toBeCloseTo(1, 10);
      }
      pose = sampleFaceTurn(turn, 1);
      expect(sameOrientation(pose, expected)).toBeCloseTo(1, 10);
    }
  });

  test('edge-on positions stay finite and reach a face for either selected axis', () => {
    for (const pose of [rotate(identity, 0, 90), rotate(identity, 90, 0)]) {
      for (const axis of axes) {
        for (const direction of directions) {
          const turn = createFaceTurn(pose, axis, direction, 180);
          expect(Math.hypot(...sampleFaceTurn(turn, 0.5))).toBeCloseTo(1, 10);
          expect(normalZ(sampleFaceTurn(turn, 1))).toBeCloseTo(-1, 10);
        }
      }
    }
  });

  test('button initialization removes pure roll and mixed drag tilt from both faces', () => {
    const assertStraight = ([x, y, z, w]: Quaternion) => {
      expect(2 * (x * y - z * w)).toBeCloseTo(0, 10);
      expect(2 * (x * y + z * w)).toBeCloseTo(0, 10);
      expect(2 * (x * z + y * w)).toBeCloseTo(0, 10);
      expect(2 * (y * z - x * w)).toBeCloseTo(0, 10);
      expect(Math.abs(1 - 2 * (x * x + y * y))).toBeCloseTo(1, 10);
    };

    for (const angle of [-155, -35, -15, 15, 35, 155]) {
      const halfAngle = (angle * Math.PI) / 360;
      const rolled: Quaternion = [0, 0, Math.sin(halfAngle), Math.cos(halfAngle)];
      for (const pose of [
        rolled,
        rotate(rolled, 180, 0),
        rotate(rolled, 31, 47),
        rotate(rolled, 137, -24),
      ]) {
        const aligned = resetButtonOrientation(pose);
        assertStraight(aligned);
        expect(Math.sign(normalZ(aligned))).toBe(Math.sign(normalZ(pose)));
        expect(Math.abs(normalZ(rotate(aligned, 0, 90)))).toBeCloseTo(0, 10);
        for (const axis of axes) {
          for (const direction of directions) {
            for (const degrees of [180, 360] as const) {
              const turn = createFaceTurn(pose, axis, direction, degrees);
              assertStraight(sampleFaceTurn(turn, 0));
              assertStraight(sampleFaceTurn(turn, 1));
              for (const progress of [0.1, 0.3, 0.5, 0.8]) {
                const expected = rotate(aligned, turn.x * progress, turn.y * progress);
                expect(sameOrientation(sampleFaceTurn(turn, progress), expected)).toBeCloseTo(
                  1,
                  10,
                );
              }
            }
          }
        }
      }
    }
  });
});
