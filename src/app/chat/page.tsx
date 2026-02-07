"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth";
import { ChatContainer, type Message } from "@/components/chat/ChatContainer";
import { 
  sendChatMessage, 
  generateMessageId, 
  ChatApiError,
  type ChatResponse 
} from "@/services/chatApi";
import styles from "./page.module.css";

/**
 * Chat page component.
 * 
 * Main chat interface with authentication protection.
 */
export default function ChatPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  
  // Chat state
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState<string>("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin?redirect=/chat");
    }
  }, [session, isPending, router]);

  /**
   * Send a message to the chat API.
   */
  const handleSendMessage = useCallback(async (messageContent: string) => {
    if (!session?.user?.id) {
      setError("Please sign in to continue.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setLastUserMessage(messageContent);

    // Optimistically add user message
    const userMessage: Message = {
      id: generateMessageId(),
      role: "user",
      content: messageContent,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Get auth token
      const token = session.session?.token || "";
      
      // Send message to API
      const response: ChatResponse = await sendChatMessage(
        session.user.id,
        messageContent,
        conversationId,
        token
      );

      // Update conversation ID if new
      if (!conversationId) {
        setConversationId(response.conversationId);
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: generateMessageId(),
        role: "assistant",
        content: response.response,
        toolCalls: response.toolCalls,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      
    } catch (err) {
      console.error("Chat error:", err);
      
      // Remove optimistic user message on error
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
      
      if (err instanceof ChatApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [session, conversationId]);

  /**
   * Retry the last failed message.
   */
  const handleRetry = useCallback(() => {
    if (lastUserMessage) {
      setError(null);
      handleSendMessage(lastUserMessage);
    }
  }, [lastUserMessage, handleSendMessage]);

  /**
   * Clear the current error.
   */
  const handleClearError = useCallback(() => {
    setError(null);
  }, []);

  // Show loading state while checking auth
  if (isPending) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Loading...</p>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!session) {
    return null;
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Chat</h1>
        <p className={styles.subtitle}>
          Manage your tasks using natural language
        </p>
      </header>
      
      <ChatContainer
        conversationId={conversationId}
        messages={messages}
        isLoading={isLoading}
        error={error}
        onSendMessage={handleSendMessage}
        onRetry={handleRetry}
        onClearError={handleClearError}
      />
    </main>
  );
}
