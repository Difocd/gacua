/**
 * @license
 * Copyright 2025 MuleRun
 * SPDX-License-Identifier: Apache-2.0
 */

import { SlidersHorizontal, PanelLeft, PanelLeftClose } from 'lucide-react';

interface HeaderProps {
  isSessionsOpen: boolean;
  isSettingsOpen: boolean;
  onToggleSessions: () => void;
  onToggleSettings: () => void;
}

export default function Header({
  isSessionsOpen,
  isSettingsOpen,
  onToggleSessions,
  onToggleSettings,
}: HeaderProps) {
  return (
    <div className="flex justify-between p-2 bg-white text-black border-b border-gray-200">
      <button onClick={onToggleSessions} className="hover:text-gray-400">
        {isSessionsOpen ? <PanelLeftClose size={20} strokeWidth={1.3} /> : <PanelLeft size={20} strokeWidth={1.3} />}
      </button>
      <h1 className="text-lg">GACUA</h1>
      <button onClick={onToggleSettings} className="hover:text-gray-400">
        <SlidersHorizontal size={20} strokeWidth={1.3} />
      </button>
    </div>
  );
}
