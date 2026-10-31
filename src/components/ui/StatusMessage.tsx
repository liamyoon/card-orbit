import { Check, X } from 'lucide-react';
interface Props {
  message: string;
  onDismiss: () => void;
}
export function StatusMessage({ message, onDismiss }: Props) {
  return (
    <div className="status-message" role="status">
      {message && (
        <>
          <Check size={15} />
          {message}
          <button onClick={onDismiss} aria-label="알림 닫기">
            <X size={14} />
          </button>
        </>
      )}
    </div>
  );
}
