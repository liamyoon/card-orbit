import { DEFAULT_BACK_TEXT } from '../../data/cards';
import { Sparkles } from 'lucide-react';
import type { CSSProperties, Ref } from 'react';
import type { Artwork, CardAppearance } from '../../types/card';
import { BookEdges } from './BookEdges';
interface Props extends CardAppearance {
  selected: Artwork;
  rotor: Ref<HTMLDivElement>;
}
export function CardFaces({
  selected,
  rotor,
  holo,
  back,
  backColor,
  backText,
  mode,
  bookThickness,
  spineTitle,
}: Props) {
  const isBook = mode === 'book';
  return (
    <div
      className={`card-rotor ${isBook ? 'book-object' : ''}`}
      ref={rotor}
      data-object-mode={mode}
      style={{ '--back-color': backColor, '--book-depth': `${bookThickness}px` } as CSSProperties}
    >
      <div className="card-face front">
        <img
          src={selected.src}
          alt={isBook ? `${selected.name} 앞표지` : selected.name}
          draggable={false}
        />
        {holo && <div className="holo" />}
        <div className="card-gloss" />
      </div>
      <div className="card-face back">
        {back ? (
          <img src={back} alt={isBook ? '공통 책 뒷표지' : '공통 카드 뒷면'} draggable={false} />
        ) : (
          <div className="back-design">
            <span className="back-small">A LITTLE PIECE OF MY WORLD</span>
            <div className="back-orbit">
              <Sparkles size={44} strokeWidth={1} />
            </div>
            <span className="back-name">{backText || DEFAULT_BACK_TEXT}</span>
            <span className="back-small">COLLECT THE THINGS YOU LOVE</span>
            <div className="back-star star-one">✦</div>
            <div className="back-star star-two">✧</div>
          </div>
        )}
        {holo && <div className="holo" />}
        <div className="card-gloss" />
      </div>
      {isBook && <BookEdges back={back} backText={backText} spineTitle={spineTitle} />}
    </div>
  );
}
