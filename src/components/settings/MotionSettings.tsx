import { ChevronDown } from 'lucide-react';
import type { CardRotationController } from '../../hooks/useCardRotation';
import { SettingHeading } from '../ui/SettingHeading';
type Props = Pick<CardRotationController, 'speed' | 'step' | 'setSpeed' | 'setStep'>;
export function MotionSettings({ speed, step, setSpeed, setStep }: Props) {
  return (
    <div className="setting-section">
      <SettingHeading number="01" title="움직임" />
      <label className="control-label" htmlFor="speed">
        회전 속도 <span>{speed}초 / 한 바퀴</span>
      </label>
      <input
        id="speed"
        type="range"
        min="3"
        max="20"
        value={speed}
        onChange={(e) => setSpeed(Number(e.target.value))}
      />
      <div className="range-labels">
        <span>빠르게</span>
        <span>느리게</span>
      </div>
      <label className="control-label step-label" htmlFor="step">
        클릭 회전{' '}
        <span className="select-wrap">
          <select
            id="step"
            value={step}
            onChange={(e) => setStep(e.target.value === '360' ? 360 : 180)}
          >
            <option value="180">앞·뒷면 전환</option>
            <option value="360">한 바퀴</option>
          </select>
          <ChevronDown size={13} />
        </span>
      </label>
    </div>
  );
}
