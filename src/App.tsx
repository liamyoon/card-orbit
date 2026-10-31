import { useState } from 'react';
import { StudioHeader } from './components/layout/StudioHeader';
import { StudioFooter } from './components/layout/StudioFooter';
import { ArtworkLibrary } from './components/library/ArtworkLibrary';
import { CardPreview } from './components/preview/CardPreview';
import { CardSettings } from './components/settings/CardSettings';
import { StatusMessage } from './components/ui/StatusMessage';
import { BACK_COLORS, BOOK_THICKNESS, DEFAULT_BACK_TEXT } from './data/cards';
import { useCardRotation } from './hooks/useCardRotation';
import { useImageLibrary } from './hooks/useImageLibrary';
import type { AppearanceControls, ObjectMode } from './types/card';

export function App() {
  const rotation = useCardRotation();
  const library = useImageLibrary(rotation.reset);
  const [mode, setMode] = useState<ObjectMode>('card');
  const [bookThickness, setBookThickness] = useState<number>(BOOK_THICKNESS.default);
  const [spineTitle, setSpineTitle] = useState('');
  const [holo, setHolo] = useState(true);
  const [glow, setGlow] = useState(35);
  const [backColor, setBackColor] = useState(BACK_COLORS[0]);
  const [backText, setBackText] = useState(DEFAULT_BACK_TEXT);
  const appearance: AppearanceControls = {
    mode,
    bookThickness,
    spineTitle,
    setMode,
    setBookThickness,
    setSpineTitle,
    holo,
    glow,
    backColor,
    backText,
    back: library.back,
    setHolo,
    setGlow,
    setBackColor,
    setBackText,
    setBack: library.setBack,
  };

  return (
    <>
      <StudioHeader />
      <main>
        <div className="workspace">
          <ArtworkLibrary
            artworks={library.artworks}
            selected={library.selected}
            onSelect={library.selectArtwork}
            upload={library.uploadFront}
          />
          <CardPreview
            artworks={library.artworks}
            selected={library.selected}
            appearance={appearance}
            rotation={rotation}
          />
          <CardSettings
            appearance={appearance}
            rotation={rotation}
            uploadBack={library.uploadBack}
          />
        </div>
        <StudioFooter />
        <StatusMessage message={library.message} onDismiss={library.dismissMessage} />
      </main>
    </>
  );
}
