/**
 * @license
 * Copyright 2025 MuleRun
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Plus, Sun, Moon, Monitor } from 'lucide-react';
import type { SessionMetadata } from '@gacua/shared';
import Sessions from './Sessions.js';
import { useTheme } from '../contexts/ThemeContext.js';

interface MenuProps {
  sessions: SessionMetadata[] | null;
  currentSessionId: string | null;
  onSwitchSession: (sessionId: string | null) => void;
  onClose: () => void;
}

const ThemeToggle: React.FC<{}> = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex justify-center">
      <button
        onClick={() => setTheme('light')}
        className={`px-3 py-1 border border-gray-200 dark:border-gray-700 ${
          theme === 'light'
            ? 'bg-gray-200'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        title="Light theme"
      >
        <Sun size={20} strokeWidth={1.25} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`px-3 py-1 border border-gray-200 dark:border-gray-700 ${
          theme === 'dark'
            ? 'bg-gray-700'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        title="Dark theme"
      >
        <Moon size={20} strokeWidth={1.25} />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`px-3 py-1 border border-gray-200 dark:border-gray-700 ${
          theme === 'system'
            ? 'bg-gray-200 dark:bg-gray-700'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        title="System theme"
      >
        <Monitor size={20} strokeWidth={1.25} />
      </button>
    </div>
  );
};

const Menu: React.FC<MenuProps> = ({
  sessions,
  currentSessionId,
  onSwitchSession,
  onClose,
}) => {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div className="lg:hidden flex justify-between p-2">
        <h1 className="px-3 text-lg">Menu</h1>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <X size={20} strokeWidth={1.25} />
        </button>
      </div>

      <div className="py-1 px-3">
        <button
          className="relative w-full p-2 cursor-pointer flex justify-center hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => onSwitchSession(null)}
        >
          <p className="text-center">New chat</p>
          <Plus
            size={20}
            strokeWidth={2}
            className="absolute left-[28%] top-1/2 -translate-y-1/2"
          />
        </button>
      </div>

      <Sessions
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSwitchSession={onSwitchSession}
      />

      <div className="py-1">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default React.memo(Menu);
