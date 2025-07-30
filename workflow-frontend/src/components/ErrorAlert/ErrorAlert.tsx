import Alert from 'react-bootstrap/Alert';
import { useEffect, useState } from 'react';
import styles from './ErrorAlert.module.scss';
type ErrorDetail = {
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
};

type ErrorAlertProps = {
  error?: ErrorDetail;
  onClose: () => void;
};

export default function ErrorAlert({ error, onClose }: ErrorAlertProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setVisible(true);

      const hideTimer = setTimeout(() => setVisible(false), 4500);
      const removeTimer = setTimeout(() => onClose(), 5000);

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [error, onClose]);

  if (!error) return null;

  const { title, detail, errors } = error;

  return (
    <Alert
      variant="danger"
      onClose={onClose}
      dismissible
      className={`${styles['error-alert']} ${visible ? styles.show : styles.hide}`}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '320px',
        zIndex: 9999,
      }}
    >
      <Alert.Heading>{title || 'Error'}</Alert.Heading>
      {detail && <p>{detail}</p>}
      {errors &&
        Object.entries(errors).map(([field, msgs]) => (
          <div key={field}>
            <strong>{field}:</strong> {msgs.join(', ')}
          </div>
        ))}
    </Alert>
  );
}
