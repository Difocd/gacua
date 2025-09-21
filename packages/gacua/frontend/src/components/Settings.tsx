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
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700">
      <div className="space-y-4">
        <div>
          <p className="text-black dark:text-gray-100 text-sm">
            Settings panel placeholder
          </p>
          <p className="text-black dark:text-gray-100 text-xs mt-2">
            This is a placeholder component. Real settings will be implemented
            later.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
