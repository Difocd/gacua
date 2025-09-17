/**
 * @license
 * Copyright 2025 MuleRun
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useMediaQuery } from './useMediaQuery.js';

export function useUIState() {
  const isBigScreen = useMediaQuery('(min-width: 1024px)');
  const [isSessionsOpen, setIsSessionsOpen] = useState(isBigScreen);
  const [isSettingsOpen, setIsSettingsOpen] = useState(isBigScreen);

  useEffect(() => {
    setIsSessionsOpen(isBigScreen);
    setIsSettingsOpen(isBigScreen);
  }, [isBigScreen]);

  return {
    isBigScreen,
    isSessionsOpen,
    isSettingsOpen,
    setIsSessionsOpen,
    setIsSettingsOpen,
  };
}
