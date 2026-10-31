import { describe, expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { CardFaces } from '../src/components/preview/CardFaces';
import { BookEdges } from '../src/components/preview/BookEdges';
import { BOOK_THICKNESS, INITIAL_ARTWORKS } from '../src/data/cards';
import type { CardAppearance } from '../src/types/card';

const appearance: CardAppearance = {
  mode: 'card',
  bookThickness: BOOK_THICKNESS.default,
  spineTitle: '',
  holo: false,
  glow: 35,
  back: null,
  backColor: '#8c83b5',
  backText: '작은 순간들',
};

describe('book and card rendering', () => {
  test('card mode keeps two faces without book edges', () => {
    const html = renderToStaticMarkup(
      <CardFaces {...appearance} selected={INITIAL_ARTWORKS[0]} rotor={null} />,
    );
    expect(html).toContain('data-object-mode="card"');
    expect(html).not.toContain('class="book-edge');
    expect(html.match(/class="card-face /g)).toHaveLength(2);
  });

  test('book mode closes both covers with a spine and three page surfaces', () => {
    const html = renderToStaticMarkup(
      <CardFaces {...appearance} mode="book" selected={INITIAL_ARTWORKS[0]} rotor={null} />,
    );
    expect(html).toContain('data-object-mode="book"');
    expect(html.match(/class="card-face /g)).toHaveLength(2);
    expect(html.match(/class="book-edge /g)).toHaveLength(4);
    expect(html).toContain('책등: 작은 순간들');
    expect(html).toContain('--book-depth:32px');
    expect(html).toContain('--back-color:#8c83b5');
  });

  test('custom back artwork and spine title share the same book', () => {
    const html = renderToStaticMarkup(
      <CardFaces
        {...appearance}
        mode="book"
        bookThickness={60}
        back="/images/notes.webp"
        spineTitle="나의 기록"
        selected={INITIAL_ARTWORKS[0]}
        rotor={null}
      />,
    );
    expect(html.match(/src="\/images\/notes.webp"/g)).toHaveLength(2);
    expect(html).toContain('--book-depth:60px');
    expect(html).toContain('책등: 나의 기록');
  });

  test('blank spine titles fall back without producing an empty binding', () => {
    const html = renderToStaticMarkup(<BookEdges back={null} backText="" spineTitle="   " />);
    expect(html).toContain('책등: little moments');
  });
});
