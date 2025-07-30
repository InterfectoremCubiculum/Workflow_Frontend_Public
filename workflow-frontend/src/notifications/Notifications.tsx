import { useEffect, useState } from 'react';
import { Dropdown, Badge } from 'react-bootstrap';
import { useSignalREvents } from '../hub/UseSignalREvents';
import type { SendedNotificationDto } from './SendedNotificationDto';
import { getNotifications, markNotificationAsRead } from '../services/notificationSetvice';
import { useDebouncedCallback } from 'use-debounce';
import moment from 'moment';
import "./Notifications.css"
type Notification = {
  id: number;
  title: string;
  message: string;
  createdAt?: Date;
  read: boolean;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const fetchNotifications = async () => {
    const sendedNotifications = await getNotifications(false);
    const mappedNotifications: Notification[] = sendedNotifications.map(n => ({
      id: n.id,
      title: n.title || 'No title',
      message: n.message || '',
      createdAt: n.createdAt,
      read: false,
    }));
    setNotifications(mappedNotifications);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const debouncedMarkAllAsRead = useDebouncedCallback(async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;

    await markNotificationAsRead(unreadIds).then(() => {
      setNotifications([]);
    });

  }, 5000);

  useSignalREvents({
    notifyClient: (data: SendedNotificationDto) => {
      const newNotification: Notification = {
        id: data.id,
        title: data.title || 'No title',
        message: data.message || '',
        createdAt: data.createdAt,
        read: false,
      };
      setNotifications(prev => [newNotification, ...prev]);
      debouncedMarkAllAsRead();
    },
  });

  const markAsRead = async (id: number) => {
    setNotifications(prev =>
      prev
        .map(n => (n.id === id ? { ...n, read: true } : n))
        .filter(n => !n.read)
    );


    try {
      await markNotificationAsRead([id]);
    } catch (error) {
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: false } : n))
      );
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;
    await markNotificationAsRead(unreadIds).then(() => {
      setNotifications([]);
    })
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Dropdown align="end">
      <Dropdown.Toggle variant="light" id="dropdown-notifications" className="position-relative">
        <i className="bi bi-bell"></i>
        {unreadCount > 0 && (
          <Badge
            bg="danger"
            pill
            className="position-absolute top-0 start-100 translate-middle"
          >
            {unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ minWidth: 300, maxHeight: 400, overflowY: 'auto' }}>
        <Dropdown.Header>
          Notifications
          {unreadCount > 0 && (
            <span
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await markAllAsRead();
              }}
              className="mark-all-as-read"
            >
              Mark all as read
            </span>
          )}
        </Dropdown.Header>
        {notifications.length === 0 && <Dropdown.Item>No notifications</Dropdown.Item>}
        {notifications.map(({ id, title, message, read, createdAt }) => (
            <Dropdown.Item
              key={id}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (hoveredId !== id) markAsRead(id);
              }}
              className={`notification-item ${read ? 'read' : 'unread'}`}
            >
            <div>{title}</div>
            <small className="text-muted">{message}</small>
            <p className="fw-lighter">{moment.utc(createdAt).local().format('YYYY-MM-DD HH:mm:ss')}</p>

           {hoveredId === id && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(id);
                  setHoveredId(null);
                }}
                className="notification-overlay"
              >
                Mark as read?
              </div>
            )}
          </Dropdown.Item>
        ))}

      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Notifications;