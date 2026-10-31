import { ACCEPTED_IMAGE_TYPES } from '../../data/cards';
import type { ImageFiles } from '../../types/card';

interface Props {
  multiple?: boolean;
  onFiles: (files: ImageFiles) => void;
}

/** 같은 파일을 다시 선택해도 change 이벤트가 발생하도록 값을 비웁니다. */
export function ImageFileInput({ multiple = false, onFiles }: Props) {
  return (
    <input
      type="file"
      accept={ACCEPTED_IMAGE_TYPES.join(',')}
      multiple={multiple}
      onChange={(event) => {
        const files = Array.from(event.currentTarget.files ?? []);
        event.currentTarget.value = '';
        onFiles(files);
      }}
    />
  );
}
