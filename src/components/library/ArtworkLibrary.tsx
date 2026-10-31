import { Check, ImagePlus } from 'lucide-react';
import type { Artwork, ImageFiles } from '../../types/card';
import { INITIAL_ARTWORKS } from '../../data/cards';
import { ImageFileInput } from '../ui/ImageFileInput';
interface Props {
  artworks: Artwork[];
  selected: Artwork;
  onSelect: (art: Artwork) => void;
  upload: (files: ImageFiles) => void;
}
export function ArtworkLibrary({ artworks, selected, onSelect, upload }: Props) {
  return (
    <aside className="panel library">
      <div className="panel-title">
        <h2>이미지</h2>
        <span className="count">{artworks.length.toString().padStart(2, '0')}</span>
      </div>
      <label
        className="upload-zone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void upload(e.dataTransfer.files);
        }}
      >
        <ImageFileInput multiple onFiles={upload} />
        <span className="upload-icon">
          <ImagePlus size={23} />
        </span>
        <b>이미지 추가</b>
        <span>클릭하거나 여기로 드래그</span>
        <small>JPG, PNG, WebP 외 · 최대 20MB</small>
      </label>
      <div className="section-label">
        ASSETS <span>앞면 이미지</span>
      </div>
      <div className="art-list">
        {artworks.map((art, i) => (
          <button
            className={`art-item ${selected.id === art.id ? 'selected' : ''}`}
            key={art.id}
            onClick={() => onSelect(art)}
            aria-pressed={selected.id === art.id}
          >
            <img src={art.src} alt="" />
            <span>
              <b>{art.name}</b>
              <small>
                {String(i + 1).padStart(2, '0')} /{' '}
                {i < INITIAL_ARTWORKS.length ? '기본 이미지' : '업로드'}
              </small>
            </span>
            {selected.id === art.id ? (
              <span className="selected-check">
                <Check size={12} />
              </span>
            ) : (
              <span className="empty-check" />
            )}
          </button>
        ))}
      </div>
      <div className="privacy-note">
        이미지가 서버에 업로드되지 않습니다.
        <br />
        새로고침 시 업로드 이미지가 초기화됩니다.
      </div>
    </aside>
  );
}
