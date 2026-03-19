//NOT FINAL THIS IS A GENERIC DRAFT!!
//IT DOES NOT FULLY MATCH THE SYSTEM

import { useState, useEffect } from 'react';
import Notification from '../components/Notification';

const useNotification = (position = 'bottom-left') => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Math.random().toString(36).substring(7);
    setNotifications((prev) => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  useEffect(() => {
    const timers = notifications.map((notification) =>
      notification.duration
        ? setTimeout(() => removeNotification(notification.id), notification.duration)
        : null
    );

    return () => timers.forEach((timer) => timer && clearTimeout(timer));
  }, [notifications]);

  const NotificationComponent = (
    <div className={`notification-container ${position}`}>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );

  return { triggerNotification: addNotification, NotificationComponent };
};

export default useNotification;
