import { useState, useMemo } from 'react';

const statusColors = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  completed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  draft: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

export default function CampaignTable({ campaigns, onSort, sortConfig }) {
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const calculateCTR = (clicks, impressions) => {
    if (impressions === 0) return '0.00%';
    return ((clicks / impressions) * 100).toFixed(2) + '%';
  };

  const calculateROAS = (conversions, spend, budget) => {
    if (spend === 0) return '0.00';
    return ((conversions * budget) / spend / 100).toFixed(2);
  };

  const columns = [
    { key: 'name', label: 'Campaign' },
    { key: 'client_name', label: 'Client' },
    { key: 'status', label: 'Status' },
    { key: 'impressions', label: 'Impressions' },
    { key: 'clicks', label: 'Clicks' },
    { key: 'ctr', label: 'CTR' },
    { key: 'conversions', label: 'Conversions' },
    { key: 'spend', label: 'Spend' },
    { key: 'roas', label: 'ROAS' },
  ];

  const SortIcon = ({ column }) => {
    if (sortConfig?.key !== column) {
      return <span className="ml-1 text-gray-400">&#8597;</span>;
    }
    return sortConfig.direction === 'asc' 
      ? <span className="ml-1">&#8593;</span> 
      : <span className="ml-1">&#8595;</span>;
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => onSort?.(col.key)}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {col.label}
                  <SortIcon column={col.key} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {campaigns.map((campaign) => (
              <tr 
                key={campaign.id} 
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {campaign.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {campaign.client_name}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[campaign.status]}`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {formatNumber(campaign.impressions)}
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {formatNumber(campaign.clicks)}
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {calculateCTR(campaign.clicks, campaign.impressions)}
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {formatNumber(campaign.conversions)}
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {formatCurrency(campaign.spend)}
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-primary-600 dark:text-primary-400">
                    {calculateROAS(campaign.conversions, campaign.spend, campaign.budget)}x
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
