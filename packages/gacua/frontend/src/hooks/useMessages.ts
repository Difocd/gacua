/**
 * @license
 * Copyright 2025 MuleRun
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useCallback } from 'react';
import type {
  DisplayMessage,
  PersistentMessage,
  ServerEvent,
} from '@gacua/shared';
import { useErrorHandler } from './useErrorHandler.js';

export function useMessages(accessToken: string | null) {
  const [messages, setMessages] = useState<DisplayMessage[] | null>(null);
  const [generating, setGenerating] = useState(false);
  const streamingMessageRef = useRef<{ thought: string; text: string }>({
    thought: '',
    text: '',
  });

  const { handleError } = useErrorHandler();

  const deserializeMessage = (
    message: Omit<PersistentMessage, 'timestamp'> & { timestamp: string },
  ) => {
    return {
      ...message,
      timestamp: new Date(message.timestamp),
    };
  };

  const loadMessages = useCallback(
    async (sessionId: string) => {
      setMessages(null);
      try {
        const url = accessToken
          ? `/api/sessions/${sessionId}/messages?token=${accessToken}`
          : `/api/sessions/${sessionId}/messages`;
        const response = await fetch(url);
        if (response.ok) {
          const messagesData = await response.json();
          const transformedMessages = messagesData.map(deserializeMessage);
          setMessages(transformedMessages);
        } else {
          handleError(
            `Failed to load messages for session ${sessionId} - HTTP response not ok: ${response.status} ${response.statusText}`,
          );
          setMessages(null);
        }
      } catch (error) {
        handleError(
          `Network or parsing error while loading messages for session ${sessionId}: ${error}`,
        );
        setMessages(null);
      }
    },
    [accessToken],
  );

  const addUserMessage = useCallback((content: string) => {
    const userMessage: DisplayMessage = {
      role: 'user',
      content: [{ text: content }],
      volatile: true,
    };
    setMessages((prev) => (prev ? [...prev, userMessage] : [userMessage]));
  }, []);

  const startStreaming = useCallback(() => {
    streamingMessageRef.current = {
      thought: '',
      text: '',
    };
  }, []);

  const handleServerEvent = useCallback((serverEvent: ServerEvent) => {
    switch (serverEvent.type) {
      case 'persistent_message': {
        setMessages((prev) => {
          if (!prev) return [deserializeMessage(serverEvent.payload)];
          const lastMessage = prev[prev.length - 1];
          const persistentMessage: PersistentMessage = deserializeMessage(
            serverEvent.payload,
          );
          const messagesToKeep =
            lastMessage && lastMessage.volatile ? prev.slice(0, -1) : prev;
          return [...messagesToKeep, persistentMessage];
        });
        streamingMessageRef.current = {
          thought: '',
          text: '',
        };
        break;
      }
      case 'stream_message': {
        const streamPiece = serverEvent.payload;
        streamingMessageRef.current.thought += streamPiece.thought ?? '';
        streamingMessageRef.current.text += streamPiece.text ?? '';
        setMessages((prev) => {
          if (!prev) return [];
          const lastMessage = prev[prev.length - 1];
          const StreamingMessage: DisplayMessage = {
            role: streamPiece.role,
            content: [
              { thought: streamingMessageRef.current.thought },
              { text: streamingMessageRef.current.text },
            ].filter((block) => block.text || block.thought),
            volatile: true,
          };
          if (lastMessage && lastMessage.volatile) {
            if (lastMessage.role !== streamPiece.role) {
              throw new Error(
                `Last volatile message has different role with the new stream piece: ${lastMessage.role} !== ${streamPiece.role}`,
              );
            }
            lastMessage.content = StreamingMessage.content;
          } else {
            return [...prev, StreamingMessage];
          }
          return prev;
        });
        break;
      }
      case 'session_status': {
        const sessionStatus = serverEvent.payload;
        if (sessionStatus.status === 'running') {
          setGenerating(true);
        } else {
          setGenerating(false);
        }

        if (sessionStatus.status === 'error') {
          handleError(
            `Session ${serverEvent.sessionId} encountered an error: ${sessionStatus.message}`,
          );
        }
        break;
      }
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    generating,
    loadMessages,
    addUserMessage,
    startStreaming,
    handleServerEvent,
    clearMessages,
  };
}
