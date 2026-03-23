import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import './Notification.css';

interface NotificationProps {
  type?: string;
  message: string;
  onClose?: () => void;
  duration?: number;
}

const Notification = ({ type = 'info', message, onClose, duration = 5000 }: NotificationProps) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose && onClose(), 300);
  };

  useEffect(() => {
    const timer = setTimeout(handleClose, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div className={`notification ${type} ${isExiting ? 'exit' : ''} p-3 rounded-lg border flex justify-between items-center bg-card`}>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={handleClose} className="p-1 hover:bg-black/5 rounded-full transition-colors">
        <X size={14} />
      </button>
    </div>
  );
};

export default Notification;
