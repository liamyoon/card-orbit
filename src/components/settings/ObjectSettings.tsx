import { BookOpen, CreditCard } from 'lucide-react';
import { BOOK_THICKNESS, DEFAULT_BACK_TEXT } from '../../data/cards';
import type { AppearanceControls } from '../../types/card';

type Props = Pick<
  AppearanceControls,
  | 'mode'
  | 'setMode'
  | 'bookThickness'
  | 'setBookThickness'
  | 'spineTitle'
  | 'setSpineTitle'
  | 'backText'
>;

export function ObjectSettings({
  mode,
  setMode,
  bookThickness,
  setBookThickness,
  spineTitle,
  setSpineTitle,
  backText,
}: Props) {
  return (
    <div className="object-settings">
      <h3>표현 방식</h3>
      <div className="object-mode-switch" role="group" aria-label="표현 모드">
        <button aria-pressed={mode === 'card'} onClick={() => setMode('card')}>
          <CreditCard size={15} />
          카드
        </button>
        <button aria-pressed={mode === 'book'} onClick={() => setMode('book')}>
          <BookOpen size={15} />책
        </button>
      </div>
      {mode === 'book' && (
        <div className="book-controls">
          <label className="control-label" htmlFor="book-thickness">
            책 두께<span>{bookThickness}px</span>
          </label>
          <input
            id="book-thickness"
            type="range"
            min={BOOK_THICKNESS.min}
            max={BOOK_THICKNESS.max}
            value={bookThickness}
            onChange={(event) => setBookThickness(Number(event.target.value))}
          />
          <div className="range-labels">
            <span>얇게</span>
            <span>두껍게</span>
          </div>
          <label className="back-text-label">
            책등 제목
            <input
              aria-label="책등 제목"
              value={spineTitle}
              maxLength={48}
              placeholder={backText.trim() || DEFAULT_BACK_TEXT}
              onChange={(event) => setSpineTitle(event.target.value)}
            />
          </label>
          <p className="book-help">책등에 뒷표지 색상과 이미지를 함께 적용합니다.</p>
        </div>
      )}
    </div>
  );
}
