/**
 * @license
 * Copyright 2025 MuleRun
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useCallback } from 'react';
import type {
  ServerEvent,
  UserInputRequest,
  ToolReviewResponseRequest,
  ToolReviewResponse,
} from '@gacua/shared';

export function useWebSocket(
  accessToken: string | null,
  onEvent: (event: ServerEvent) => void,
) {
  const wsRef = useRef<WebSocket | null>(null);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const hostname = window.location.hostname;
    const port = window.location.port;
    const wsUrl = accessToken
      ? `ws://${hostname}:${port}/ws?token=${accessToken}`
      : `ws://${hostname}:${port}/ws`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connection established successfully');
    };

    ws.onmessage = (event) => {
      try {
        const serverEvent: ServerEvent = JSON.parse(event.data);
        onEvent(serverEvent);
      } catch (error) {
        console.error(
          'Failed to parse WebSocket message as JSON:',
          error,
          'Raw message:',
          event.data,
        );
      }
    };

    ws.onclose = (event) => {
      console.log(
        'WebSocket connection closed.',
        'Code:',
        event.code,
        'Reason:',
        event.reason,
        'Was clean:',
        event.wasClean,
      );
    };

    ws.onerror = (error) => {
      console.error(
        'WebSocket connection error occurred.',
        'Error event:',
        error,
        'Connection state:',
        ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][ws.readyState] ?? 'UNKNOWN',
      );
    };
  }, [accessToken, onEvent]);

  const sendUserInput = useCallback(
    (sessionId: string, input: string, model: string) => {
      if (!wsRef.current) {
        console.error(
          'Cannot submit message - WebSocket connection is not available. Connection state:',
          wsRef.current,
        );
        return false;
      }

      const userInputEvent: UserInputRequest = {
        type: 'user_input',
        sessionId,
        payload: {
          input,
          model,
        },
      };
      wsRef.current.send(JSON.stringify(userInputEvent));
      return true;
    },
    [],
  );

  const sendToolReviewResponse = useCallback(
    (sessionId: string, toolReviewResponse: ToolReviewResponse) => {
      if (!wsRef.current) {
        console.error(
          'Cannot send tool review response - WebSocket connection is not available. Connection state:',
          wsRef.current,
        );
        return false;
      }

      const toolReviewEvent: ToolReviewResponseRequest = {
        type: 'tool_review',
        sessionId,
        payload: toolReviewResponse,
      };
      wsRef.current.send(JSON.stringify(toolReviewEvent));
      return true;
    },
    [],
  );

  const closeConnection = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
  }, []);

  return {
    connectWebSocket,
    sendUserInput,
    sendToolReviewResponse,
    closeConnection,
    isConnected: () => wsRef.current?.readyState === WebSocket.OPEN,
  };
}
