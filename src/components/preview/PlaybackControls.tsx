import { Pause, Play, RotateCcw } from 'lucide-react';
import type { CardRotationController } from '../../hooks/useCardRotation';
type Props = Pick<
  CardRotationController,
  'playing' | 'axis' | 'setAxis' | 'reset' | 'togglePlayback'
>;
export function PlaybackControls({ playing, axis, setAxis, reset, togglePlayback }: Props) {
  return (
    <div className="playback">
      <button className={`play-button ${playing ? 'active' : ''}`} onClick={togglePlayback}>
        {playing ? <Pause size={15} /> : <Play size={15} />} {playing ? '일시정지' : '자동 회전'}
      </button>
      <div className="axis-switch" aria-label="자동 회전축">
        {(['x', 'y'] as const).map((a) => (
          <button
            key={a}
            onClick={() => setAxis(a)}
            className={axis === a ? 'active' : ''}
            aria-pressed={axis === a}
          >
            {a.toUpperCase()}축
          </button>
        ))}
      </div>
      <span className="playback-divider" />
      <button className="reset-button" onClick={reset}>
        <RotateCcw size={15} />
        초기화
      </button>
    </div>
  );
}
