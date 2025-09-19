/**
 * @license
 * Copyright 2025 MuleRun
 * SPDX-License-Identifier: Apache-2.0
 */

interface HeaderProps {
  onToggleSessions: () => void;
  onToggleSettings: () => void;
}

export default function Header({
  onToggleSessions,
  onToggleSettings,
}: HeaderProps) {
  return (
    <div className="bg-gray-800 text-white flex justify-between p-4">
      <button onClick={onToggleSessions} className="hover:text-gray-300">
        Sessions
      </button>
      <h1 className="text-xl font-bold">GACUA</h1>
      <button onClick={onToggleSettings} className="hover:text-gray-300">
        Settings
      </button>
    </div>
  );
}
