export default function Settings({ darkMode, setDarkMode }) {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your dashboard preferences
        </p>
      </div>

      <div className="card p-6 space-y-6">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              Dark Mode
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Toggle dark mode theme
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              darkMode ? 'bg-primary-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* API Settings Info */}
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            API Connection
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-gray-600 dark:text-gray-400">
                Connected to Campaign API
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Endpoint: http://localhost:3001
            </p>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Data Refresh */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              Auto Refresh
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Automatically refresh dashboard data
            </p>
          </div>
          <select className="input w-32">
            <option value="off">Off</option>
            <option value="30">30 seconds</option>
            <option value="60">1 minute</option>
            <option value="300">5 minutes</option>
          </select>
        </div>
      </div>
    </div>
  );
}
