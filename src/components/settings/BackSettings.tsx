import { Check, Sparkles, Upload } from 'lucide-react';
import { BACK_COLORS, DEFAULT_BACK_TEXT } from '../../data/cards';
import type { AppearanceControls, ImageFiles } from '../../types/card';
import { SettingHeading } from '../ui/SettingHeading';
import { ImageFileInput } from '../ui/ImageFileInput';
type Props = Pick<
  AppearanceControls,
  'mode' | 'back' | 'backColor' | 'backText' | 'setBack' | 'setBackColor' | 'setBackText'
> & { uploadBack: (files: ImageFiles) => void };
export function BackSettings({
  mode,
  back,
  backColor,
  backText,
  setBack,
  setBackColor,
  setBackText,
  uploadBack,
}: Props) {
  return (
    <div className="setting-section back-settings">
      <SettingHeading
        number="03"
        title={mode === 'book' ? '뒷표지 · 책등 디자인' : '공통 뒷면'}
        badge={mode === 'book' ? '모든 책' : '모든 카드'}
      />
      <div className="back-preview-row">
        <div className="mini-back" style={{ background: backColor }}>
          {back ? (
            <img src={back} alt="선택한 뒷면" />
          ) : (
            <>
              <Sparkles size={23} />
              <span>{backText || DEFAULT_BACK_TEXT}</span>
            </>
          )}
        </div>
        <div>
          <b>{back ? '사용자 이미지' : '기본 디자인'}</b>
          <p>{back ? '이미지 적용 중' : '색상 선택'}</p>
          <div className="swatches">
            {BACK_COLORS.map((color) => (
              <button
                key={color}
                style={{ background: color }}
                aria-label={`뒷면 색상 ${color}`}
                aria-pressed={backColor === color && !back}
                onClick={() => {
                  setBackColor(color);
                  setBack(null);
                }}
              >
                {backColor === color && !back && <Check size={12} />}
              </button>
            ))}
          </div>
        </div>
      </div>
      <label className="back-text-label">
        {mode === 'book' ? '뒷표지 문구' : '뒷면 문구'}
        <input
          aria-label={mode === 'book' ? '뒷표지 문구' : '뒷면 문구'}
          value={backText}
          maxLength={32}
          disabled={!!back}
          onChange={(e) => setBackText(e.target.value)}
        />
      </label>
      <label className="back-upload">
        <Upload size={14} />
        {mode === 'book' ? '뒷표지 이미지 업로드' : '뒷면 이미지 업로드'}
        <ImageFileInput onFiles={uploadBack} />
      </label>
      {back && (
        <button className="restore-back" onClick={() => setBack(null)}>
          기본 디자인 복원
        </button>
      )}
      <p className="back-help">
        {mode === 'book' ? '모든 책의 뒷표지와 책등에 공통 적용' : '모든 카드의 뒷면에 공통 적용'}
      </p>
    </div>
  );
}
