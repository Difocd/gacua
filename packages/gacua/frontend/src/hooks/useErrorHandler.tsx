/**
 * @license
 * Copyright 2025 MuleRun
 * SPDX-License-Identifier: Apache-2.0
 */

import { useToast } from '../contexts/ToastContext.js';

export const useErrorHandler = () => {
  const { showToast } = useToast();

  const handleError = (error: Error | string, ...args: unknown[]) => {
    const message = error instanceof Error ? error.message : error;
    console.error(error, ...args);
    showToast(message, 'error');
  };

  return {
    handleError,
  };
};
