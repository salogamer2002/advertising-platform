import { useState, useMemo, useEffect } from 'react';
import KPICard from '../components/KPICard';
import PerformanceChart from '../components/PerformanceChart';
import CampaignTable from '../components/CampaignTable';
import DateRangePicker from '../components/DateRangePicker';
import mockData from '../data/mockData.json';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState({ type: 'preset', days: 30 });
  const [sortConfig, setSortConfig] = useState({ key: 'spend', direction: 'desc' });
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch campaigns from API
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/campaigns/public/list`);
        if (!response.ok) throw new Error('Failed to fetch campaigns');
        const data = await response.json();
        setCampaigns(data.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        // Fall back to mock data if API fails
        setCampaigns(mockData.campaigns);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Calculate aggregate KPIs from all campaigns
  const kpis = useMemo(() => {
    const campaignData = campaigns.length > 0 ? campaigns : mockData.campaigns;
    const totals = campaignData.reduce(
      (acc, campaign) => ({
        impressions: acc.impressions + campaign.impressions,
        clicks: acc.clicks + campaign.clicks,
        conversions: acc.conversions + campaign.conversions,
        spend: acc.spend + campaign.spend,
      }),
      { impressions: 0, clicks: 0, conversions: 0, spend: 0 }
    );

    const ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;
    const roas = totals.spend > 0 ? (totals.conversions * 100) / totals.spend : 0;

    return { ...totals, ctr, roas };
  }, [campaigns]);

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

  // Sort campaigns
  const sortedCampaigns = useMemo(() => {
    const campaignData = campaigns.length > 0 ? campaigns : mockData.campaigns;
    const sorted = [...campaignData].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      
      // Calculate derived values
      if (sortConfig.key === 'ctr') {
        aVal = a.impressions > 0 ? a.clicks / a.impressions : 0;
        bVal = b.impressions > 0 ? b.clicks / b.impressions : 0;
      } else if (sortConfig.key === 'roas') {
        aVal = a.spend > 0 ? a.conversions / a.spend : 0;
        bVal = b.spend > 0 ? b.conversions / b.spend : 0;
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Campaign Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Overview of all advertising campaigns
          </p>
        </div>
        <DateRangePicker selectedRange={dateRange} onRangeChange={setDateRange} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <KPICard
          title="Impressions"
          value={formatNumber(kpis.impressions)}
          change={12.5}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        />
        <KPICard
          title="Clicks"
          value={formatNumber(kpis.clicks)}
          change={8.3}
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          }
        />
        <KPICard
          title="CTR"
          value={`${kpis.ctr.toFixed(2)}%`}
          change={-2.1}
          color="orange"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <KPICard
          title="Conversions"
          value={formatNumber(kpis.conversions)}
          change={15.7}
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <KPICard
          title="Spend"
          value={formatCurrency(kpis.spend)}
          change={5.2}
          color="orange"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <KPICard
          title="ROAS"
          value={`${kpis.roas.toFixed(2)}x`}
          change={7.8}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* Performance Chart */}
      <PerformanceChart data={mockData.metrics.camp1} />

      {/* Campaign Table */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          All Campaigns
        </h2>
        <CampaignTable 
          campaigns={sortedCampaigns} 
          onSort={handleSort}
          sortConfig={sortConfig}
        />
      </div>
    </div>
  );
}
