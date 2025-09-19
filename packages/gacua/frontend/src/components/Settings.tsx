/**
 * @license
 * Copyright 2025 MuleRun
 * SPDX-License-Identifier: Apache-2.0
 */

interface SettingsProps {
  onClose?: () => void;
}

function Settings({ onClose }: SettingsProps) {
  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Settings</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white lg:hidden"
          >
            ×
          </button>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-gray-400 text-sm">Settings panel placeholder</p>
          <p className="text-gray-500 text-xs mt-2">
            This is a placeholder component. Real settings will be implemented
            later.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
