"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/auth";
import styles from "./FloatingChatWidget.module.css";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface ChatResponse {
  conversation_id: number;
  response: string;
  tool_calls: { tool_name: string; arguments: Record<string, unknown>; result?: Record<string, unknown> }[];
}

// Available models
const MODELS = [
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", description: "Balanced" },
  { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite", description: "Faster" },
  { id: "gemini-3-flash", name: "Gemini 3 Flash", description: "Latest" },
] as const;

/**
 * Floating chat widget that appears on all pages.
 * 
 * Position: Fixed bottom-right corner.
 * Features:
 * - Toggle button with chat icon
 * - Expandable chat panel
 * - Message history
 * - Real-time AI responses
 */
export function FloatingChatWidget() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedModel, setSelectedModel] = useState<typeof MODELS[number]['id']>(MODELS[0].id);
  const [showModelSelector, setShowModelSelector] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
    setError(null);
  }, []);

  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

  const sendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: inputValue.trim(),
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("Please sign in to use the chat assistant.");
      }

      const response = await fetch(`/api/${userId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for Better Auth
        body: JSON.stringify({
          message: userMessage.content,
          conversation_id: conversationId,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.message || "Failed to send message");
      }

      const data: ChatResponse = await response.json();
      
      if (!conversationId) {
        setConversationId(data.conversation_id);
      }

      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: data.response,
        createdAt: new Date(),
      };

      // Invalidate tasks cache if AI performed any task operations
      // This triggers an immediate refetch of tasks on the dashboard
      const taskModifyingTools = ["add_task", "complete_task", "delete_task"];
      const hasTaskOperation = data.tool_calls?.some(tc => 
        taskModifyingTools.includes(tc.tool_name)
      );
      if (hasTaskOperation) {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      }

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      // Remove the user message on error
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, conversationId, session, queryClient, selectedModel]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Don't render if user is not authenticated
  if (!session?.user) {
    return (
      <div className={styles.container}>
        <button
          className={styles.toggleButton}
          onClick={() => window.location.href = "/signin"}
          aria-label="Sign in to use chat"
        >
          <span className={styles.chatIcon}>💬</span>
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Chat Panel */}
      {isOpen && (
        <div className={styles.chatPanel} role="dialog" aria-label="Chat assistant">
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <span className={styles.headerIcon}>🤖</span>
              <div>
                <h3 className={styles.headerTitle}>AI Assistant</h3>
                <p className={styles.headerSubtitle}>Ask me anything about your tasks</p>
              </div>
            </div>
            <button
              className={styles.closeButton}
              onClick={toggleChat}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Model Selector */}
          <div className={styles.modelSelector}>
            <button 
              className={styles.modelButton}
              onClick={() => setShowModelSelector(!showModelSelector)}
            >
              <span className={styles.modelIcon}>⚡</span>
              <span>{MODELS.find(m => m.id === selectedModel)?.name}</span>
              <span className={styles.modelArrow}>{showModelSelector ? '▲' : '▼'}</span>
            </button>
            {showModelSelector && (
              <div className={styles.modelDropdown}>
                {MODELS.map(model => (
                  <button
                    key={model.id}
                    className={`${styles.modelOption} ${selectedModel === model.id ? styles.modelOptionActive : ''}`}
                    onClick={() => {
                      setSelectedModel(model.id);
                      setShowModelSelector(false);
                    }}
                  >
                    <span className={styles.modelName}>{model.name}</span>
                    <span className={styles.modelDesc}>{model.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Messages */}
          <div className={styles.messagesContainer}>
            {messages.length === 0 && (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>💬</span>
                <p>How can I help you today?</p>
                <div className={styles.suggestions}>
                  <button onClick={() => setInputValue("Show my tasks")}>Show my tasks</button>
                  <button onClick={() => setInputValue("Add a new task")}>Add a task</button>
                  <button onClick={() => setInputValue("What can you do?")}>What can you do?</button>
                </div>
              </div>
            )}
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${msg.role === "user" ? styles.userMessage : styles.assistantMessage}`}
              >
                {msg.role === "assistant" && (
                  <span className={styles.messageAvatar}>🤖</span>
                )}
                <div className={styles.messageContent}>
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <span className={styles.messageAvatar}>🤖</span>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            {error && (
              <div className={styles.error}>
                <span>⚠️</span> {error}
                <button onClick={sendMessage}>Retry</button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={isLoading}
              className={styles.input}
            />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={styles.sendButton}
              aria-label="Send message"
            >
              ↑
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        className={`${styles.toggleButton} ${isOpen ? styles.toggleButtonActive : ""}`}
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <span className={styles.closeIcon}>✕</span>
        ) : (
          <span className={styles.chatIcon}>💬</span>
        )}
      </button>
    </div>
  );
}
