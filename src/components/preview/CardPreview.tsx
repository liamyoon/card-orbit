import { useEffect, useState } from 'react';
import { Maximize, Move, X } from 'lucide-react';
import type { Artwork, CardAppearance } from '../../types/card';
import type { CardRotationController } from '../../hooks/useCardRotation';
import { CardStage } from './CardStage';
import { PlaybackControls } from './PlaybackControls';
interface Props {
  artworks: Artwork[];
  selected: Artwork;
  appearance: CardAppearance;
  rotation: CardRotationController;
}
export function CardPreview({ artworks, selected, appearance, rotation }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { playing, dragging } = rotation;
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, []);

  return (
    <section className={`preview-panel ${expanded ? 'expanded' : ''}`}>
      <div className="preview-top">
        <span>
          <i /> 미리보기
        </span>
        <span className="viewport-meta">
          {appearance.mode === 'book' ? `BOOK / ${appearance.bookThickness}px` : 'CARD / 2 SIDES'}
        </span>
        <button
          className="icon-button"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? '미리보기 축소' : '미리보기 확대'}
        >
          {expanded ? <X size={17} /> : <Maximize size={17} />}
        </button>
      </div>
      <CardStage selected={selected} appearance={appearance} rotation={rotation} />
      <div className="preview-caption">
        <span className="image-index">
          {String(artworks.findIndex((a) => a.id === selected.id) + 1).padStart(2, '0')}
        </span>
        <span>{selected.name}</span>
        <span className="caption-separator" />
        <small>{playing ? '자동 회전 중' : dragging ? '드래그 중' : '대기'}</small>
      </div>
      <PlaybackControls {...rotation} />
      <div className="gesture-hint">
        <Move size={13} />
        <span>드래그: 자유 회전 · 방향 버튼: 기울기 정렬 후 회전</span>
      </div>
    </section>
  );
}
