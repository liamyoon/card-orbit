import { Sparkles } from 'lucide-react';
import { DEFAULT_BACK_TEXT } from '../../data/cards';
import type { CardAppearance } from '../../types/card';

type Props = Pick<CardAppearance, 'back' | 'backText' | 'spineTitle'>;

/** 앞·뒤 표지 사이를 채우는 책등과 세 방향의 페이지 단면입니다. */
export function BookEdges({ back, backText, spineTitle }: Props) {
  const title = spineTitle.trim() || backText.trim() || DEFAULT_BACK_TEXT;

  return (
    <>
      <div
        className={`book-edge book-spine ${back ? 'has-image' : ''}`}
        aria-label={`책등: ${title}`}
      >
        {back && <img className="spine-artwork" src={back} alt="" draggable={false} />}
        <div className="spine-design">
          <Sparkles size={13} strokeWidth={1.2} aria-hidden="true" />
          <span className="spine-title" title={title}>
            {title}
          </span>
          <span className="spine-mark" aria-hidden="true">
            ✦
          </span>
        </div>
      </div>
      <div className="book-edge book-pages book-pages-right" aria-label="책 오른쪽 페이지 단면" />
      <div className="book-edge book-pages book-pages-top" aria-label="책 위쪽 페이지 단면" />
      <div className="book-edge book-pages book-pages-bottom" aria-label="책 아래쪽 페이지 단면" />
    </>
  );
}
