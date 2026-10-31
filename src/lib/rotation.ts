export type Quaternion = [number, number, number, number];
export const identity: Quaternion = [0, 0, 0, 1];
export function rotate(q: Quaternion, x: number, y: number): Quaternion {
  const length = Math.hypot(x, y);
  if (!length) return q;
  const half = (length * Math.PI) / 360;
  const a = (x / length) * Math.sin(half),
    b = (y / length) * Math.sin(half),
    d = Math.cos(half);
  const [e, f, g, h] = q;
  const result: Quaternion = [
    d * e + a * h + b * g,
    d * f - a * g + b * h,
    d * g + a * f - b * e,
    d * h - a * e - b * f,
  ];
  const norm = Math.hypot(...result);
  return result.map((n) => n / norm) as Quaternion;
}
export function transform([x, y, z, w]: Quaternion) {
  return `matrix3d(${[
    1 - 2 * (y * y + z * z),
    2 * (x * y + z * w),
    2 * (x * z - y * w),
    0,
    2 * (x * y - z * w),
    1 - 2 * (x * x + z * z),
    2 * (y * z + x * w),
    0,
    2 * (x * z + y * w),
    2 * (y * z - x * w),
    1 - 2 * (x * x + y * y),
    0,
    0,
    0,
    0,
    1,
  ].join(',')})`;
}
