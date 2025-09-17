/**
 * @license
 * Copyright 2025 MuleRun
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type { ToolReviewResponse } from '@gacua/shared';

import Sessions from './components/Sessions.js';
import Settings from './components/Settings.js';
import Chat from './components/Chat.js';
import Header from './components/Header.js';
import { useSessions } from './hooks/useSessions.js';
import { useWebSocket } from './hooks/useWebSocket.js';
import { useMessages } from './hooks/useMessages.js';
import { useUIState } from './hooks/useUIState.js';

function App() {
  const [input, setInput] = useState('');
  const [model, setModel] = useState('gemini-2.5-pro');

  const accessToken = new URLSearchParams(window.location.search).get('token');

  const showToastRef = useRef<
    | ((
        message: string,
        type?: 'error' | 'success' | 'info' | 'warning',
      ) => void)
    | null
  >(null);

  const {
    sessions,
    selectedSessionId,
    loadSessionsMetadata,
    createSession,
    switchSession,
    updateSessionStatus,
  } = useSessions(accessToken);

  const {
    messages,
    generating,
    loadMessages,
    addUserMessage,
    startStreaming,
    handleServerEvent,
    clearMessages,
  } = useMessages(accessToken);

  const handleEvent = useCallback(
    (serverEvent: any) => {
      handleServerEvent(serverEvent);
      if (serverEvent.type === 'session_status') {
        updateSessionStatus(
          serverEvent.sessionId,
          serverEvent.payload.status,
          serverEvent.payload.message,
        );
      }
    },
    [handleServerEvent, updateSessionStatus],
  );

  const {
    connectWebSocket,
    sendUserInput,
    sendToolReviewResponse,
    closeConnection,
  } = useWebSocket(accessToken, handleEvent);

  const handleSessionSwitch = useCallback(
    async (sessionId: string | null) => {
      if (sessionId === null) {
        switchSession(null);
        clearMessages();
        return;
      }

      if (!sessions) return;

      const session = sessions.find((s) => s.id === sessionId);
      if (!session) {
        console.error(
          `Session with ID ${sessionId} not found in available sessions`,
        );
        return;
      }

      switchSession(sessionId);
      setModel(session.model);
      await loadMessages(sessionId);
    },
    [sessions, switchSession, clearMessages, loadMessages],
  );

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const handleModelChange = useCallback((newModel: string) => {
    setModel(newModel);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;

      if (selectedSessionId !== null && messages === null) {
        console.error(
          `Cannot submit message - Messages not loaded for session ${selectedSessionId}.`,
        );
        return;
      }

      const inputValue = input;
      let sessionId = selectedSessionId;

      if (sessionId === null) {
        sessionId = await createSession(inputValue, model);
        if (!sessionId) return;
        switchSession(sessionId);
      }

      addUserMessage(inputValue);
      setInput('');
      startStreaming();

      sendUserInput(sessionId, inputValue, model);
    },
    [
      input,
      model,
      selectedSessionId,
      messages,
      createSession,
      switchSession,
      addUserMessage,
      startStreaming,
      sendUserInput,
    ],
  );

  const handleToolReviewResponse = useCallback(
    async (toolReviewResponse: ToolReviewResponse) => {
      if (selectedSessionId === null) {
        console.error(
          'Cannot send tool review response - No active session selected. Current session ID:',
          selectedSessionId,
        );
        return;
      }

      sendToolReviewResponse(selectedSessionId, toolReviewResponse);
    },
    [selectedSessionId, sendToolReviewResponse],
  );

  useEffect(() => {
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      const message = args
        .map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg)))
        .join(' ');
      if (showToastRef.current) {
        showToastRef.current(message, 'error');
      }
      originalError(...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  useEffect(() => {
    loadSessionsMetadata();
    connectWebSocket();

    return closeConnection;
  }, [loadSessionsMetadata, connectWebSocket, closeConnection]);

  const {
    isSessionsOpen,
    isSettingsOpen,
    setIsSessionsOpen,
    setIsSettingsOpen,
  } = useUIState();

  useEffect(() => {
    if (selectedSessionId) {
      handleSessionSwitch(selectedSessionId);
    }
  }, [selectedSessionId, handleSessionSwitch]);

  return (
    <div className="h-svh flex flex-col">
      <div className="flex h-full">
        {/* Sessions Panel */}
        <div
          className={`${isSessionsOpen ? 'block' : 'hidden'} fixed lg:relative left-0 h-full z-20 lg:z-0`}
        >
          <Sessions
            sessions={sessions}
            currentSessionId={selectedSessionId}
            onSwitchSession={(id) => {
              switchSession(id);
              setIsSessionsOpen(false);
            }}
            onClose={() => setIsSessionsOpen(false)}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Header
            isSessionsOpen={isSessionsOpen}
            isSettingsOpen={isSettingsOpen}
            onToggleSessions={() => setIsSessionsOpen(!isSessionsOpen)}
            onToggleSettings={() => setIsSettingsOpen(!isSettingsOpen)}
          />
          <Chat
            messages={messages}
            currentSessionId={selectedSessionId}
            input={input}
            model={model}
            loading={generating}
            accessToken={accessToken}
            onInputChange={handleInputChange}
            onModelChange={handleModelChange}
            onSubmit={handleSubmit}
            onToolReviewResponse={handleToolReviewResponse}
            showToastRef={showToastRef}
          />
        </div>

        {/* Settings Panel */}
        <div
          className={`${isSettingsOpen ? 'block' : 'hidden'} fixed lg:relative right-0 h-full z-20 lg:z-0`}
        >
          <Settings onClose={() => setIsSettingsOpen(false)} />
        </div>
      </div>

      {/* Mobile Overlays */}
      <div
        className={`fixed w-full h-full bg-black opacity-50 z-10 ${
          isSessionsOpen || isSettingsOpen ? 'block' : 'hidden'
        } lg:hidden`}
        onClick={() => {
          setIsSessionsOpen(false);
          setIsSettingsOpen(false);
        }}
      ></div>
    </div>
  );
}

export default App;