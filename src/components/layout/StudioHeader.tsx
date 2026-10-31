import { Layers } from 'lucide-react';
export function StudioHeader() {
  return (
    <header className="header">
      <a className="brand" href="./" aria-label="Card Orbit 홈">
        <span className="brand-mark">
          <Layers size={21} />
        </span>
        <h1>Card Orbit</h1>
      </a>
      <div className="header-note">/ 이미지 회전 편집기</div>
      <span className="local-badge">
        <span />
        로컬 세션
      </span>
    </header>
  );
}
