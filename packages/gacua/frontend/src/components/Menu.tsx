/**
 * @license
 * Copyright 2025 MuleRun
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X } from 'lucide-react';
import type { SessionMetadata } from '@gacua/shared';
import Sessions from './Sessions.js';

interface MenuProps {
  sessions: SessionMetadata[] | null;
  currentSessionId: string | null;
  onSwitchSession: (sessionId: string | null) => void;
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({
  sessions,
  currentSessionId,
  onSwitchSession,
  onClose,
}) => {
  return (
    <div className="h-full flex flex-col border-r border-gray-200">
      <div className="lg:hidden flex justify-between p-2 bg-white">
        <h1 className="px-3 text-lg font-semibold">Menu</h1>
        <button onClick={onClose} className="p-1 rounded hover:bg-gray-200">
          <X size={20} strokeWidth={1.25} />
        </button>
      </div>
      <Sessions
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSwitchSession={onSwitchSession}
      />
    </div>
  );
};

export default React.memo(Menu);
