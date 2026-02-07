"use client";

import React from "react";
import styles from "./ErrorBanner.module.css";

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

/**
 * Error banner component with retry option.
 * 
 * Displays user-friendly error messages with optional retry.
 */
export function ErrorBanner({
  message,
  onRetry,
  onDismiss,
}: ErrorBannerProps) {
  return (
    <div 
      className={styles.banner}
      role="alert"
      aria-live="assertive"
    >
      <div className={styles.icon} aria-hidden="true">⚠️</div>
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
      </div>
      <div className={styles.actions}>
        {onRetry && (
          <button
            type="button"
            className={styles.retryButton}
            onClick={onRetry}
            aria-label="Retry sending message"
          >
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            className={styles.dismissButton}
            onClick={onDismiss}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
