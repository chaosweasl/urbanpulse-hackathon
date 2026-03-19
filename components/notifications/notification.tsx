import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import './Notification.css';

const Notification = ({ type = 'info', message, onClose, duration = 5000 }) => {
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
    <div className={`notification ${type} ${isExiting ? 'exit' : ''}`}>
      <span>{message}</span>
      <AiOutlineClose className="close-button" onClick={handleClose} />
    </div>
  );
};

export default Notification;
