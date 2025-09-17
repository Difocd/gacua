/**
 * @license
 * Copyright 2025 MuleRun
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import type {
  SessionMetadata,
  CreateSessionRequest,
  CreateSessionResponse,
  SessionStatus,
} from '@gacua/shared';

export function useSessions(accessToken: string | null) {
  const [sessions, setSessions] = useState<SessionMetadata[] | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    () => sessionStorage.getItem('selectedSessionId'),
  );

  const loadSessionsMetadata = useCallback(async () => {
    try {
      const url = accessToken
        ? `/api/sessions?token=${accessToken}`
        : '/api/sessions';
      const response = await fetch(url);
      if (response.ok) {
        const sessionsData: SessionMetadata[] = await response.json();
        setSessions(sessionsData);
      } else {
        console.error(
          'Failed to load sessions metadata - HTTP response not ok:',
          response.status,
          response.statusText,
        );
        setSessions([]);
      }
    } catch (error) {
      console.error(
        'Network or parsing error while loading sessions metadata:',
        error,
      );
      setSessions([]);
    }
  }, [accessToken]);

  const createSession = useCallback(
    async (name: string, model: string): Promise<string | null> => {
      try {
        const requestBody: CreateSessionRequest = {
          name,
          model,
        };
        const url = accessToken
          ? `/api/sessions?token=${accessToken}`
          : '/api/sessions';
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          await loadSessionsMetadata();
          const result: CreateSessionResponse = await response.json();
          return result.id;
        } else {
          console.error(
            'Failed to create new session - HTTP response not ok:',
            response.status,
            response.statusText,
          );
          return null;
        }
      } catch (error) {
        console.error(
          'Network or parsing error while creating new session:',
          error,
        );
        return null;
      }
    },
    [accessToken, loadSessionsMetadata],
  );

  const switchSession = useCallback((sessionId: string | null) => {
    setSelectedSessionId(sessionId);
    if (sessionId) {
      sessionStorage.setItem('selectedSessionId', sessionId);
    } else {
      sessionStorage.removeItem('selectedSessionId');
    }
  }, []);

  const updateSessionStatus = useCallback(
    (sessionId: string, status: SessionStatus, statusMessage?: string) => {
      setSessions((prev) => {
        if (!prev) return prev;
        return prev.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                status,
                statusMessage,
              }
            : session,
        );
      });
    },
    [],
  );

  return {
    sessions,
    selectedSessionId,
    loadSessionsMetadata,
    createSession,
    switchSession,
    updateSessionStatus,
  };
}
