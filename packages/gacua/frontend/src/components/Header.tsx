/**
 * @license
 * Copyright 2025 MuleRun
 * SPDX-License-Identifier: Apache-2.0
 */

import { SlidersHorizontal, PanelLeft, PanelLeftClose } from 'lucide-react';

interface HeaderProps {
  isMenuOpen: boolean;
  isSettingsOpen: boolean;
  onTitleClick: () => void;
  onToggleMenu: () => void;
  onToggleSettings: () => void;
}

export default function Header({
  isMenuOpen,
  isSettingsOpen,
  onTitleClick,
  onToggleMenu,
  onToggleSettings,
}: HeaderProps) {
  return (
    <div className="flex justify-between p-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={onToggleMenu}
        className="p-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {isMenuOpen ? (
          <PanelLeftClose size={20} strokeWidth={1.25} />
        ) : (
          <PanelLeft size={20} strokeWidth={1.25} />
        )}
      </button>
      <button onClick={onTitleClick} className="text-lg hover:cursor-pointer">
        GACUA
      </button>
      <button
        onClick={onToggleSettings}
        className="p-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <SlidersHorizontal size={20} strokeWidth={1.25} />
      </button>
    </div>
  );
}
