/**
 * @license
 * Copyright 2025 MuleRun
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { SessionMetadata } from '@gacua/shared';

interface SessionsProps {
  sessions: SessionMetadata[] | null;
  currentSessionId: string | null;
  onSwitchSession: (sessionId: string | null) => void;
}

const Sessions: React.FC<SessionsProps> = ({
  sessions,
  currentSessionId,
  onSwitchSession,
}) => {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto p-2">
        <button
          className="w-full py-3 px-4 mb-4 border-0 rounded-lg text-sm font-medium text-gray-700 cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-gray-100 hover:border-gray-300 active:scale-95"
          onClick={() => onSwitchSession(null)}
        >
          <span className="relative">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="absolute right-full top-1/2 -translate-y-1/2 mr-2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            New chat
          </span>
        </button>
        {sessions === null ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            <p>Loading...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            <p>No conversations yet</p>
          </div>
        ) : (
          sessions
            .slice()
            .reverse()
            .map((session) => (
              <div
                key={session.id}
                className={`flex items-center justify-between py-3 px-3 mb-1 rounded-lg cursor-pointer transition-all duration-200 min-h-14 hover:bg-gray-100 ${
                  currentSessionId === session.id
                    ? 'bg-white border border-gray-200 shadow-sm'
                    : ''
                }`}
                onClick={() => onSwitchSession(session.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {session.name || session.id}
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-400 font-mono flex-shrink-0">
                      #{session.id}
                    </span>
                    <span
                      className={`flex items-center gap-1 text-[10px] ${
                        session.status === 'running'
                          ? 'text-emerald-600'
                          : session.status === 'pending'
                            ? 'text-amber-600'
                            : session.status === 'error'
                              ? 'text-red-600'
                              : 'text-gray-500'
                      }`}
                      title={
                        session.statusMessage
                          ? session.status + ': ' + session.statusMessage
                          : session.status
                      }
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          session.status === 'running'
                            ? 'bg-emerald-500'
                            : session.status === 'pending'
                              ? 'bg-amber-500'
                              : session.status === 'error'
                                ? 'bg-red-500'
                                : 'bg-gray-400'
                        }`}
                      ></span>
                      <span className="capitalize">{session.status}</span>
                    </span>
                  </div>
                </div>

                <div className="opacity-0 transition-opacity duration-200 hover:opacity-100">
                  <button
                    className="w-6 h-6 border-none bg-transparent text-gray-400 rounded cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-gray-100 hover:text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                      <circle cx="5" cy="12" r="1" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default React.memo(Sessions);
