import { useEffect, useRef, useState } from 'react';
import { INITIAL_ARTWORKS, MAX_UPLOAD_COUNT } from '../data/cards';
import { decodeImage, isSupportedImage } from '../lib/imageFiles';
import type { Artwork, ImageFiles } from '../types/card';

const UPLOAD_ERROR =
  '일부 이미지를 열 수 없습니다. 20MB 이하의 JPG, PNG, WebP, GIF, AVIF를 사용해 주세요.';

/** 업로드 이미지의 선택 상태와 Object URL의 생성·해제를 소유합니다. */
export function useImageLibrary(onFrontChange: () => void) {
  const [artworks, setArtworks] = useState(INITIAL_ARTWORKS);
  const [selected, setSelected] = useState(INITIAL_ARTWORKS[0]);
  const [back, setBackState] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const urls = useRef(new Set<string>());
  const backUrl = useRef<string | null>(null);
  const mounted = useRef(true);
  const backRequest = useRef(0);

  useEffect(() => {
    mounted.current = true;
    const ownedUrls = urls.current;
    return () => {
      mounted.current = false;
      ownedUrls.forEach((url) => URL.revokeObjectURL(url));
      ownedUrls.clear();
    };
  }, []);

  const releaseUrl = (url: string) => {
    URL.revokeObjectURL(url);
    urls.current.delete(url);
  };

  const replaceBack = (src: string | null) => {
    if (backUrl.current && backUrl.current !== src) releaseUrl(backUrl.current);
    backUrl.current = src;
    setBackState(src);
  };

  const setBack = (src: string | null) => {
    // 기본 디자인을 선택했다면 진행 중인 이전 업로드가 이를 덮어쓰지 않습니다.
    backRequest.current++;
    replaceBack(src);
  };

  const selectArtwork = (artwork: Artwork) => {
    setSelected(artwork);
    onFrontChange();
  };

  const uploadFront = async (files: ImageFiles) => {
    if (!files?.length) return;
    const added: Artwork[] = [];
    let failures = 0;
    for (const file of Array.from(files).slice(0, MAX_UPLOAD_COUNT)) {
      if (!isSupportedImage(file)) {
        failures++;
        continue;
      }
      try {
        const image = await decodeImage(file);
        if (!mounted.current) {
          URL.revokeObjectURL(image.src);
          return;
        }
        urls.current.add(image.src);
        added.push({ id: crypto.randomUUID(), name: file.name.replace(/\.[^.]+$/, ''), ...image });
      } catch {
        failures++;
      }
    }
    if (!mounted.current) return;
    if (added.length) {
      setArtworks((current) => [...current, ...added]);
      selectArtwork(added[0]);
    }
    setMessage(failures ? UPLOAD_ERROR : `${added.length}장의 이미지를 추가했습니다.`);
  };

  const uploadBack = async (files: ImageFiles) => {
    if (!files?.length) return;
    const request = ++backRequest.current;
    const file = files[0];
    if (!isSupportedImage(file)) {
      setMessage(UPLOAD_ERROR);
      return;
    }
    try {
      const image = await decodeImage(file);
      if (!mounted.current || request !== backRequest.current) {
        URL.revokeObjectURL(image.src);
        return;
      }
      urls.current.add(image.src);
      replaceBack(image.src);
      setMessage('모든 카드의 뒷면에 적용했습니다.');
    } catch {
      if (mounted.current && request === backRequest.current) setMessage(UPLOAD_ERROR);
    }
  };

  return {
    artworks,
    selected,
    back,
    message,
    selectArtwork,
    setBack,
    uploadFront,
    uploadBack,
    dismissMessage: () => setMessage(''),
  };
}
