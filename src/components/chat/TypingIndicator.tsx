"use client";

import React from "react";
import styles from "./TypingIndicator.module.css";

/**
 * Animated typing indicator for assistant responses.
 * 
 * Shows when the AI is processing a message.
 */
export function TypingIndicator() {
  return (
    <div 
      className={styles.container}
      role="status"
      aria-label="Assistant is typing"
    >
      <div className={styles.avatar} aria-hidden="true">🤖</div>
      <div className={styles.dots}>
        <span className={styles.dot} style={{ animationDelay: "0ms" }} />
        <span className={styles.dot} style={{ animationDelay: "200ms" }} />
        <span className={styles.dot} style={{ animationDelay: "400ms" }} />
      </div>
    </div>
  );
}
