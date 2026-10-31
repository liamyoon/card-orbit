import { Sparkles } from 'lucide-react';
import type { AppearanceControls } from '../../types/card';
import { SettingHeading } from '../ui/SettingHeading';
type Props = Pick<AppearanceControls, 'holo' | 'glow' | 'setHolo' | 'setGlow'>;
export function EffectSettings({ holo, glow, setHolo, setGlow }: Props) {
  return (
    <div className="setting-section">
      <SettingHeading number="02" title="빛과 질감" />
      <div className="control-label">
        <span>
          <Sparkles size={14} /> 홀로그램
        </span>
        <button
          className={`toggle ${holo ? 'on' : ''}`}
          role="switch"
          aria-checked={holo}
          aria-label="홀로그램 효과"
          onClick={() => setHolo(!holo)}
        >
          <span />
        </button>
      </div>
      <label className="control-label intensity" htmlFor="glow">
        반짝임 강도 <span>{glow}%</span>
      </label>
      <input
        id="glow"
        type="range"
        min="0"
        max="100"
        value={glow}
        disabled={!holo}
        onChange={(e) => setGlow(Number(e.target.value))}
      />
    </div>
  );
}
