import { useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import { CARD_ASPECT_RATIO, DIRECTIONS } from '../../data/cards';
import type { Artwork, CardAppearance, Direction } from '../../types/card';
import type { CardRotationController } from '../../hooks/useCardRotation';
import { CardFaces } from './CardFaces';
const DIRECTION_ICONS = { up: ArrowUp, down: ArrowDown, left: ArrowLeft, right: ArrowRight };
interface Props {
  selected: Artwork;
  appearance: CardAppearance;
  rotation: CardRotationController;
}
export function CardStage({ selected, appearance, rotation }: Props) {
  const [hover, setHover] = useState<Direction | null>(null);
  const { dragging } = rotation;
  const { glow } = appearance;
  return (
    <div className={`stage ${dragging ? 'dragging' : ''} ${hover ? `hover-${hover}` : ''}`}>
      <div
        className="card-space"
        style={{ '--ratio': CARD_ASPECT_RATIO, '--glow': glow / 100 } as CSSProperties}
      >
        <CardFaces selected={selected} rotor={rotation.rotor} {...appearance} />
        <div
          className="drag-surface"
          role="group"
          tabIndex={0}
          aria-label={`${appearance.mode === 'book' ? '책' : '카드'} 회전 영역. 드래그하거나 방향키로 회전`}
          {...rotation.interactionProps}
        />
      </div>
      {(Object.keys(DIRECTIONS) as Direction[]).map((d) => {
        const Icon = DIRECTION_ICONS[d];
        return (
          <button
            key={d}
            className={`direction direction-${d}`}
            aria-label={DIRECTIONS[d].label}
            onClick={() => rotation.turn(d)}
            onMouseEnter={() => setHover(d)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(d)}
            onBlur={() => setHover(null)}
          >
            <Icon size={19} />
            <span>{DIRECTIONS[d].label}</span>
          </button>
        );
      })}
      <div className="card-shadow" />
    </div>
  );
}
