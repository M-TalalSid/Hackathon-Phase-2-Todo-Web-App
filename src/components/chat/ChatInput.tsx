"use client";

import React, { useRef, KeyboardEvent } from "react";
import styles from "./ChatInput.module.css";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * Chat message input with send button.
 * 
 * Supports Enter to send, Shift+Enter for new line.
 * Accessible with keyboard navigation.
 */
export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = "Type a message...",
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter to send (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) {
        onSubmit();
      }
    }
  };

  const handleSubmitClick = () => {
    if (!disabled && value.trim()) {
      onSubmit();
      textareaRef.current?.focus();
    }
  };

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    onChange(textarea.value);
    
    // Reset height to auto to get correct scrollHeight
    textarea.style.height = "auto";
    // Set height to scrollHeight (max 150px)
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          className={styles.input}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          aria-label="Message input"
          aria-describedby="input-hint"
        />
        <span id="input-hint" className={styles.srOnly}>
          Press Enter to send, Shift+Enter for new line
        </span>
      </div>
      
      <button
        type="button"
        className={styles.sendButton}
        onClick={handleSubmitClick}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        tabIndex={0}
      >
        <span className={styles.sendIcon}>↑</span>
      </button>
    </div>
  );
}
