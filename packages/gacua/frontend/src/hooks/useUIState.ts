/**
 * @license
 * Copyright 2025 MuleRun
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useMediaQuery } from './useMediaQuery.js';

export function useUIState() {
  const isBigScreen = useMediaQuery('(min-width: 1024px)');
  const [isMenuOpen, setIsMenuOpen] = useState(isBigScreen);
  const [isSettingsOpen, setIsSettingsOpen] = useState(isBigScreen);

  useEffect(() => {
    setIsMenuOpen(isBigScreen);
    setIsSettingsOpen(isBigScreen);
  }, [isBigScreen]);

  return {
    isBigScreen,
    isMenuOpen,
    isSettingsOpen,
    setIsMenuOpen,
    setIsSettingsOpen,
  };
}
