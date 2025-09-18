/**
 * @license
 * Copyright 2025 MuleRun
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useToast } from '../contexts/ToastContext.js';

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const getToastStyle = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-red-800 bg-red-50 border-red-200';
      case 'success':
        return 'text-green-800 bg-green-50 border-green-200';
      case 'warning':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'info':
        return 'text-gray-800 bg-gray-50 border-gray-200';
      default:
        return 'text-red-800 bg-red-50 border-red-200';
    }
  };

  return (
    <div className="absolute top-4 right-4 z-10 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getToastStyle(toast.type)} border px-4 py-3 rounded-lg shadow-lg max-w-sm md:max-w-md lg:max-w-lg animate-slide-in`}
        >
          <div className="flex justify-between items-start">
            <p
              className="text-sm break-all word-break pr-2 hyphens-auto"
              style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
            >
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 font-bold hover:text-gray-500 flex-shrink-0"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;
