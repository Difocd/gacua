/**
 * @license
 * Copyright 2025 MuleRun
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import type { ServerEvent, ToolReviewResponse } from '@gacua/shared';

import Menu from './components/Menu.js';
import Settings from './components/Settings.js';
import Chat from './components/Chat.js';
import Header from './components/Header.js';
import { useErrorHandler } from './hooks/useErrorHandler.js';
import { useSessions } from './hooks/useSessions.js';
import { useWebSocket } from './hooks/useWebSocket.js';
import { useMessages } from './hooks/useMessages.js';
import { useUIState } from './hooks/useUIState.js';

function App() {
  const [input, setInput] = useState('');
  const [model, setModel] = useState('gemini-2.5-pro');

  const { handleError } = useErrorHandler();

  const accessToken = new URLSearchParams(window.location.search).get('token');

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
    (serverEvent: ServerEvent) => {
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
        handleError(
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
        handleError(
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
        handleError(
          `Cannot send tool review response - No active session selected. Current session ID: ${selectedSessionId}`,
        );
        return;
      }

      sendToolReviewResponse(selectedSessionId, toolReviewResponse);
    },
    [selectedSessionId, sendToolReviewResponse],
  );

  useEffect(() => {
    loadSessionsMetadata();
    connectWebSocket();

    return closeConnection;
  }, [loadSessionsMetadata, connectWebSocket, closeConnection]);

  const {
    isBigScreen,
    isMenuOpen,
    isSettingsOpen,
    setIsMenuOpen,
    setIsSettingsOpen,
  } = useUIState();

  useEffect(() => {
    if (selectedSessionId) {
      handleSessionSwitch(selectedSessionId);
    }
  }, [selectedSessionId, handleSessionSwitch]);

  return (
    <div className="h-svh flex flex-1 text-black dark:text-gray-100">
      {/* Menu Panel */}
      <div
        className={`h-full z-20 lg:z-0 transition-all duration-300 ease-in-out fixed lg:relative overflow-hidden w-80 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${isMenuOpen ? '' : 'lg:w-0'}`}
      >
        <Menu
          sessions={sessions}
          currentSessionId={selectedSessionId}
          onSwitchSession={(id) => {
            switchSession(id);
            if (!isBigScreen) {
              setIsMenuOpen(false);
            }
          }}
          onClose={() => setIsMenuOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header
          isMenuOpen={isMenuOpen}
          isSettingsOpen={isSettingsOpen}
          onTitleClick={() => {
            switchSession(null);
            if (!isBigScreen) {
              setIsMenuOpen(false);
            }
          }}
          onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
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
        />
      </div>

      {/* Settings Panel */}
      <div
        className={`h-full z-20 lg:z-0 transition-all duration-300 ease-in-out fixed lg:relative overflow-hidden w-80 ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 ${isSettingsOpen ? '' : 'lg:w-0'} right-0`}
      >
        <Settings onClose={() => setIsSettingsOpen(false)} />
      </div>

      {/* Mobile Overlays */}
      <div
        className={`fixed w-full h-full bg-black dark:bg-white opacity-50 z-10 ${
          isMenuOpen || isSettingsOpen ? 'block' : 'hidden'
        } lg:hidden`}
        onClick={() => {
          setIsMenuOpen(false);
          setIsSettingsOpen(false);
        }}
      ></div>
    </div>
  );
}

export default App;
