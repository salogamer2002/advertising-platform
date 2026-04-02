import { useState } from 'react';

const presetRanges = [
  { label: 'Last 7d', value: 7 },
  { label: 'Last 30d', value: 30 },
  { label: 'Last 90d', value: 90 },
  { label: 'Custom', value: 'custom' },
];

export default function DateRangePicker({ selectedRange, onRangeChange }) {
  const [showCustom, setShowCustom] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const handlePresetClick = (value) => {
    if (value === 'custom') {
      setShowCustom(true);
    } else {
      setShowCustom(false);
      onRangeChange({ type: 'preset', days: value });
    }
  };

  const handleCustomSubmit = () => {
    if (customStart && customEnd) {
      onRangeChange({ type: 'custom', start: customStart, end: customEnd });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {presetRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => handlePresetClick(range.value)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              (selectedRange?.days === range.value || (range.value === 'custom' && showCustom))
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
      
      {showCustom && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="input px-3 py-1.5 text-sm"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="input px-3 py-1.5 text-sm"
          />
          <button
            onClick={handleCustomSubmit}
            className="btn-primary text-sm py-1.5"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
