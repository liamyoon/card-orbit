import type { Axis } from '../types/card';
import { identity, rotate, type Quaternion } from './rotation';

export type ClickTurnDegrees = 180 | 360;

export interface FaceTurn {
  from: Quaternion;
  target: Quaternion;
  x: number;
  y: number;
}

const EPSILON = 1e-10;
const flippedFront: Quaternion = [0, 0, 1, 0];
const uprightBack: Quaternion = [0, 1, 0, 0];
const flippedBack: Quaternion = [1, 0, 0, 0];

/** 버튼 회전 전 드래그의 기울기와 롤을 초기화합니다. 보이는 면과 가까운 상하 방향은 유지합니다. */
export function resetButtonOrientation(from: Quaternion): Quaternion {
  const [x, y] = from;
  const frontVisible = 1 - 2 * (x * x + y * y) >= -EPSILON;
  const candidates = frontVisible ? [identity, flippedFront] : [uprightBack, flippedBack];
  const similarity = (candidate: Quaternion) =>
    Math.abs(from.reduce((sum, value, index) => sum + value * candidate[index], 0));
  const aligned =
    similarity(candidates[1]) > similarity(candidates[0]) ? candidates[1] : candidates[0];
  return [...aligned];
}

/** 정렬을 먼저 완료한 뒤 선택한 단일 축으로만 회전합니다. 회전 도중 보정을 섞지 않습니다. */
export function createFaceTurn(
  from: Quaternion,
  axis: Axis,
  direction: 1 | -1,
  degrees: ClickTurnDegrees,
): FaceTurn {
  const aligned = resetButtonOrientation(from);
  const x = axis === 'x' ? direction * degrees : 0;
  const y = axis === 'y' ? direction * degrees : 0;
  const target = rotate(aligned, x, y).map((value) =>
    Math.abs(value) < EPSILON ? 0 : value,
  ) as Quaternion;

  return {
    from: aligned,
    target,
    x,
    y,
  };
}

export function sampleFaceTurn(turn: FaceTurn, progress: number): Quaternion {
  if (progress <= 0) return [...turn.from];
  if (progress >= 1) return [...turn.target];

  return rotate(turn.from, turn.x * progress, turn.y * progress);
}
