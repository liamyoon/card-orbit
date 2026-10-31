import type { AppearanceControls, ImageFiles } from '../../types/card';
import type { CardRotationController } from '../../hooks/useCardRotation';
import { MotionSettings } from './MotionSettings';
import { EffectSettings } from './EffectSettings';
import { BackSettings } from './BackSettings';
import { ObjectSettings } from './ObjectSettings';
interface Props {
  appearance: AppearanceControls;
  rotation: CardRotationController;
  uploadBack: (files: ImageFiles) => void;
}
export function CardSettings({ appearance, rotation, uploadBack }: Props) {
  return (
    <aside className="panel settings">
      <div className="panel-title">
        <h2>{appearance.mode === 'book' ? '책 설정' : '카드 설정'}</h2>
        <span className="panel-code">PROPERTIES</span>
      </div>
      <ObjectSettings {...appearance} />
      <MotionSettings {...rotation} />
      <EffectSettings {...appearance} />
      <BackSettings {...appearance} uploadBack={uploadBack} />
    </aside>
  );
}
