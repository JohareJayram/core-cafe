'use client';
import { useEffect, useState } from 'react';
import styles from './Toast.module.css';

let toastFn = null;

export function toast(message, type = 'success', duration = 3500) {
  if (toastFn) toastFn(message, type, duration);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastFn = (message, type, duration) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    };
    return () => { toastFn = null; };
  }, []);

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <div className={styles.container} aria-live="polite" aria-atomic="false">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`${styles.toast} ${styles[t.type] || styles.success}`}
          role={t.type === 'error' ? 'alert' : 'status'}
          onClick={() => remove(t.id)}
        >
          <span className={styles.icon}>
            {t.type === 'success' ? '✓' :
             t.type === 'error'   ? '✕' :
             t.type === 'warning' ? '⚠' : 'ℹ'}
          </span>
          <span className={styles.message}>{t.message}</span>
          <button
            type="button"
            className={styles.close}
            onClick={(e) => {
              e.stopPropagation();
              remove(t.id);
            }}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
