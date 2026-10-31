import { useEffect, useRef, useState, type PointerEvent, type KeyboardEvent } from 'react';
import { identity, rotate, transform, type Quaternion } from '../lib/rotation';
import {
  createFaceTurn,
  resetButtonOrientation,
  sampleFaceTurn,
  type ClickTurnDegrees,
  type FaceTurn,
} from '../lib/faceTurn';
import { DIRECTIONS, KEY_DIRECTIONS } from '../data/cards';
import type { Axis, Direction } from '../types/card';

const DRAG_SENSITIVITY = 0.55;
const TURN_DURATION_MS = 800;
const MAX_FRAME_DELTA_MS = 50;

/** 화면 좌표계 회전과 포인터 캡처, 애니메이션 수명을 한곳에서 관리합니다. */
export function useCardRotation() {
  const [playing, setPlaying] = useState(false);
  const [axis, setAxis] = useState<Axis>('y');
  const [speed, setSpeed] = useState(10);
  const [step, setStep] = useState<ClickTurnDegrees>(180);

  const [dragging, setDragging] = useState(false);
  const rotor = useRef<HTMLDivElement>(null);
  const orientation = useRef<Quaternion>([...identity]);
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);
  const motion = useRef<{ turn: FaceTurn; startedAt: number | null } | null>(null);
  const settings = useRef({ playing, axis, speed });

  settings.current = { playing, axis, speed };
  const applyRotation = () => {
    if (rotor.current) {
      rotor.current.style.transform = transform(orientation.current);
      rotor.current.style.setProperty(
        '--shine-angle',
        `${125 + (orientation.current[0] + orientation.current[1]) * 90}deg`,
      );
    }
  };
  useEffect(() => {
    let frame: number,
      previous = 0;
    const tick = (now: number) => {
      const deltaMs = previous ? Math.min(now - previous, MAX_FRAME_DELTA_MS) : 0;
      previous = now;
      const activeMotion = motion.current;
      if (activeMotion) {
        if (activeMotion.startedAt === null) activeMotion.startedAt = now;
        const progress = Math.min((now - activeMotion.startedAt) / TURN_DURATION_MS, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        orientation.current = sampleFaceTurn(activeMotion.turn, eased);
        if (progress === 1) motion.current = null;
        applyRotation();
      } else if (settings.current.playing && !drag.current) {
        const amount = (deltaMs * 360) / (settings.current.speed * 1000);
        orientation.current = rotate(
          orientation.current,
          settings.current.axis === 'x' ? amount : 0,
          settings.current.axis === 'y' ? amount : 0,
        );
        applyRotation();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const turn = (direction: Direction) => {
    if (drag.current) return;
    setPlaying(false);
    const directionVector = DIRECTIONS[direction];
    const nextTurn = createFaceTurn(
      orientation.current,
      directionVector.x ? 'x' : 'y',
      directionVector.x + directionVector.y > 0 ? 1 : -1,
      step,
    );
    orientation.current = [...nextTurn.from];
    applyRotation();
    motion.current = {
      turn: nextTurn,
      startedAt: null,
    };
  };
  const reset = () => {
    setPlaying(false);
    motion.current = null;
    orientation.current = [...identity];
    applyRotation();
  };

  const endDrag = (event: PointerEvent) => {
    if (drag.current?.id === event.pointerId) {
      drag.current = null;
      setDragging(false);
    }
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.parentElement?.style.setProperty(
      '--mx',
      `${((event.clientX - rect.left) / rect.width) * 100}%`,
    );
    event.currentTarget.parentElement?.style.setProperty(
      '--my',
      `${((event.clientY - rect.top) / rect.height) * 100}%`,
    );
    if (!drag.current || drag.current.id !== event.pointerId) return;
    orientation.current = rotate(
      orientation.current,
      -(event.clientY - drag.current.y) * DRAG_SENSITIVITY,
      (event.clientX - drag.current.x) * DRAG_SENSITIVITY,
    );
    drag.current.x = event.clientX;
    drag.current.y = event.clientY;
    applyRotation();
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || drag.current) return;
    setPlaying(false);
    motion.current = null;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const direction = KEY_DIRECTIONS[event.key];
    if (direction) {
      event.preventDefault();
      turn(direction);
    }
  };
  const togglePlayback = () => {
    if (drag.current) return;
    motion.current = null;
    if (!playing) {
      orientation.current = resetButtonOrientation(orientation.current);
      applyRotation();
    }
    setPlaying((value) => !value);
  };
  const changeAxis = (nextAxis: Axis) => {
    if (nextAxis === axis) return;
    if (playing) {
      orientation.current = resetButtonOrientation(orientation.current);
      applyRotation();
    }
    setAxis(nextAxis);
  };
  return {
    playing,
    axis,
    speed,
    step,
    dragging,
    rotor,
    setAxis: changeAxis,
    setSpeed,
    setStep,
    turn,
    reset,
    togglePlayback,
    interactionProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onLostPointerCapture: endDrag,
      onKeyDown,
    },
  };
}
export type CardRotationController = ReturnType<typeof useCardRotation>;
