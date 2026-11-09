import React from 'react';
import { useApp } from '../../context/AppContext';
import styles from './Toast.module.css';

export default function Toast() {
  const { toast } = useApp();

  if (!toast.visible) return null;

  return (
    <div className={styles.toastContainer}>
      <div className={styles.toastBox}>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
