"use client";

import React, { useState, useCallback } from "react";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { ErrorBanner } from "./ErrorBanner";
import styles from "./ChatContainer.module.css";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCalls?: ToolCall[];
  createdAt: Date;
}

export interface ToolCall {
  toolName: string;
  arguments: Record<string, unknown>;
  result?: Record<string, unknown>;
}

interface ChatContainerProps {
  conversationId: number | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (message: string) => Promise<void>;
  onRetry: () => void;
  onClearError: () => void;
}

/**
 * Main chat container component.
 * 
 * Orchestrates the chat UI with message list, input, and error states.
 */
export function ChatContainer({
  conversationId,
  messages,
  isLoading,
  error,
  onSendMessage,
  onRetry,
  onClearError,
}: ChatContainerProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const message = inputValue.trim();
    setInputValue("");
    
    try {
      await onSendMessage(message);
    } catch (err) {
      // Error is handled by parent component
      console.error("Failed to send message:", err);
    }
  }, [inputValue, isLoading, onSendMessage]);

  const isEmpty = messages.length === 0;

  return (
    <div 
      className={styles.container}
      role="main"
      aria-label="Chat conversation"
    >
      {/* Error Banner */}
      {error && (
        <ErrorBanner
          message={error}
          onRetry={onRetry}
          onDismiss={onClearError}
        />
      )}

      {/* Message List or Empty State */}
      <div className={styles.messageArea}>
        {isEmpty ? (
          <div className={styles.emptyState} role="status">
            <div className={styles.emptyIcon}>💬</div>
            <h2 className={styles.emptyTitle}>Start a conversation</h2>
            <p className={styles.emptyHint}>
              Try saying something like:
            </p>
            <ul className={styles.exampleList}>
              <li>"Add a task to buy groceries"</li>
              <li>"Show me my tasks"</li>
              <li>"Mark task 3 as done"</li>
              <li>"What can you help me with?"</li>
            </ul>
          </div>
        ) : (
          <ChatMessageList messages={messages} />
        )}
        
        {/* Typing Indicator */}
        {isLoading && <TypingIndicator />}
      </div>

      {/* Input Area */}
      <div className={styles.inputArea}>
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSubmit}
          disabled={isLoading}
          placeholder={isEmpty ? "Type a message to get started..." : "Type a message..."}
        />
      </div>
    </div>
  );
}
