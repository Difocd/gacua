/**
 * @license
 * Copyright 2025 MuleRun
 * SPDX-License-Identifier: Apache-2.0
 */

import { useToast } from '../contexts/ToastContext.js';

/**
 * Custom hook that provides error handling with toast notifications
 * Use this instead of console.error when you want to show user-facing error messages
 */
export const useErrorHandler = () => {
  const { showToast } = useToast();

  const handleError = (error: Error | string, showToUser: boolean = true) => {
    const message = error instanceof Error ? error.message : error;

    // Always log to console for debugging
    console.error(error);

    // Optionally show toast to user
    if (showToUser) {
      showToast(message, 'error');
    }
  };

  return { handleError };
};
