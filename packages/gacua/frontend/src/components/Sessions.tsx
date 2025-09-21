/**
 * @license
 * Copyright 2025 MuleRun
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Ellipsis } from 'lucide-react';
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
    <div className="px-1 flex flex-col flex-1 gap-1 bg-white dark:bg-gray-900">
      {sessions === null ? (
        <div className="flex items-center justify-center h-32">
          <p>Loading...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <p>No conversations yet</p>
        </div>
      ) : (
        sessions
          .slice()
          .reverse()
          .map((session) => (
            <div
              key={session.id}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
                currentSessionId === session.id
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : ''
              }`}
              onClick={() => onSwitchSession(session.id)}
            >
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <div className="text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                  {session.name || session.id}
                </div>
                <div className="flex gap-2">
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

              <div className="flex-shrink-0 opacity-0 hover:opacity-100 flex justify-center">
                <button
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Ellipsis size={20} strokeWidth={1.25} />
                </button>
              </div>
            </div>
          ))
      )}
    </div>
  );
};

export default React.memo(Sessions);
