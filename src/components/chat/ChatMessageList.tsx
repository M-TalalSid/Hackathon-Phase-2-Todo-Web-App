"use client";

import React, { useRef, useEffect } from "react";
import type { Message } from "./ChatContainer";
import { ChatBubble } from "./ChatBubble";
import styles from "./ChatMessageList.module.css";

interface ChatMessageListProps {
  messages: Message[];
}

/**
 * Scrollable list of chat messages with auto-scroll.
 * 
 * Automatically scrolls to the latest message when new messages arrive.
 */
export function ChatMessageList({ messages }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Announce new messages to screen readers
  useEffect(() => {
    if (messages.length === 0) return;
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === "assistant") {
      // Create a live region announcement
      const announcement = document.createElement("div");
      announcement.setAttribute("role", "status");
      announcement.setAttribute("aria-live", "polite");
      announcement.setAttribute("aria-atomic", "true");
      announcement.className = styles.srOnly;
      announcement.textContent = `Assistant says: ${lastMessage.content.substring(0, 100)}...`;
      document.body.appendChild(announcement);
      
      // Remove after announcement
      setTimeout(() => {
        announcement.remove();
      }, 1000);
    }
  }, [messages.length]);

  return (
    <div 
      ref={listRef}
      className={styles.list}
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
    >
      {messages.map((message) => (
        <ChatBubble
          key={message.id}
          role={message.role}
          content={message.content}
          toolCalls={message.toolCalls}
          timestamp={message.createdAt}
        />
      ))}
      <div ref={bottomRef} className={styles.scrollAnchor} aria-hidden="true" />
    </div>
  );
}
