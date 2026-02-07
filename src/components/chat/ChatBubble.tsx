"use client";

import React from "react";
import type { ToolCall } from "./ChatContainer";
import styles from "./ChatBubble.module.css";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  toolCalls?: ToolCall[];
  timestamp?: Date;
}

/**
 * Individual chat message bubble.
 * 
 * Displays user and assistant messages with distinct styling.
 * Shows tool call badges for assistant messages with MCP actions.
 */
export function ChatBubble({
  role,
  content,
  toolCalls,
  timestamp,
}: ChatBubbleProps) {
  const isUser = role === "user";
  const hasToolCalls = toolCalls && toolCalls.length > 0;

  // Format tool name for display
  const formatToolName = (name: string) => {
    return name
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Get icon for tool
  const getToolIcon = (name: string) => {
    const iconMap: Record<string, string> = {
      add_task: "➕",
      list_tasks: "📋",
      complete_task: "✅",
      update_task: "✏️",
      delete_task: "🗑️",
    };
    return iconMap[name] || "🔧";
  };

  return (
    <div
      className={`${styles.bubble} ${isUser ? styles.user : styles.assistant}`}
      role="article"
      aria-label={`${isUser ? "Your message" : "Assistant message"}`}
    >
      {/* Avatar */}
      <div className={styles.avatar} aria-hidden="true">
        {isUser ? "👤" : "🤖"}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.messageText}>{content}</div>

        {/* Tool Call Badges (T042) */}
        {hasToolCalls && (
          <div 
            className={styles.toolCalls}
            role="list"
            aria-label="Actions taken"
          >
            {toolCalls.map((tc, index) => (
              <div
                key={index}
                className={`${styles.toolBadge} ${tc.result?.success ? styles.success : ""}`}
                role="listitem"
                title={`${formatToolName(tc.toolName)}: ${JSON.stringify(tc.arguments)}`}
              >
                <span className={styles.toolIcon}>{getToolIcon(tc.toolName)}</span>
                <span className={styles.toolName}>{formatToolName(tc.toolName)}</span>
                {tc.result?.success === true && (
                  <span className={styles.successCheck}>✓</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Timestamp */}
        {timestamp && (
          <time 
            className={styles.timestamp}
            dateTime={timestamp.toISOString()}
          >
            {timestamp.toLocaleTimeString([], { 
              hour: "2-digit", 
              minute: "2-digit" 
            })}
          </time>
        )}
      </div>
    </div>
  );
}
