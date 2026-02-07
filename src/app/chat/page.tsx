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

/**
 * Chat page component.
 */
export default function ChatPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState<string>("");

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin?redirect=/chat");
    }
  }, [session, isPending, router]);

  const handleSendMessage = useCallback(async (messageContent: string) => {
    if (!session?.user?.id) {
      setError("Please sign in to continue.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setLastUserMessage(messageContent);

    const userMessage: Message = {
      id: generateMessageId(),
      role: "user",
      content: messageContent,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const token = session.session?.token || "";
      const response: ChatResponse = await sendChatMessage(
        session.user.id,
        messageContent,
        conversationId,
        token
      );

      if (!conversationId) {
        setConversationId(response.conversationId);
      }

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
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
      setError(err instanceof ChatApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [session, conversationId]);

  const handleRetry = useCallback(() => {
    if (lastUserMessage) {
      setError(null);
      handleSendMessage(lastUserMessage);
    }
  }, [lastUserMessage, handleSendMessage]);

  const handleClearError = useCallback(() => {
    setError(null);
  }, []);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <main className="max-w-3xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Chat</h1>
        <p className="text-gray-600 mt-1">Manage your tasks using natural language</p>
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
