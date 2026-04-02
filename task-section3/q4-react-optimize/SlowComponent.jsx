/**
 * Q4: Optimize Slow React Component
 * 
 * TASK: Identify and fix unnecessary re-renders using React DevTools
 * Time: 15 minutes
 * 
 * This file contains TWO versions:
 * 1. SLOW (problematic) version with performance issues
 * 2. OPTIMIZED version with fixes
 */

import React, { useState, useMemo, useCallback, memo } from 'react';

// ============================================
// SLOW VERSION - With Performance Issues
// ============================================

function SlowCampaignList({ campaigns, onSelect, filters }) {
  const [searchQuery, setSearchQuery] = useState('');

  // PROBLEM 1: Filtering happens on every render, even when campaigns haven't changed
  const filteredCampaigns = campaigns.filter(campaign => {
    return campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
           (filters.status === 'all' || campaign.status === filters.status);
  });

  // PROBLEM 2: New function created on every render
  const handleCampaignClick = (campaign) => {
    onSelect(campaign);
  };

  // PROBLEM 3: Inline object/array creation causes child re-renders
  const containerStyle = { padding: '20px', background: '#f5f5f5' };

  return (
    <div style={containerStyle}>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
      />
      {/* PROBLEM 4: CampaignCard re-renders when parent re-renders */}
      {filteredCampaigns.map(campaign => (
        <CampaignCardSlow
          key={campaign.id}
          campaign={campaign}
          onClick={handleCampaignClick}
          // PROBLEM 5: Inline function in props
          onFavorite={() => console.log('favorited', campaign.id)}
        />
      ))}
      {/* PROBLEM 6: Expensive calculation runs every render */}
      <TotalStats campaigns={campaigns} />
    </div>
  );
}

// Not memoized - re-renders every time parent renders
function CampaignCardSlow({ campaign, onClick, onFavorite }) {
  // This will log on EVERY parent render
  console.log('CampaignCard rendered:', campaign.id);
  
  return (
    <div onClick={() => onClick(campaign)}>
      <h3>{campaign.name}</h3>
      <p>Budget: ${campaign.budget}</p>
      <button onClick={onFavorite}>Favorite</button>
    </div>
  );
}

function TotalStats({ campaigns }) {
  // PROBLEM: Expensive calculation runs every render
  console.log('Calculating totals...');
  const totals = campaigns.reduce((acc, c) => ({
    budget: acc.budget + c.budget,
    spend: acc.spend + c.spend,
    conversions: acc.conversions + c.conversions,
  }), { budget: 0, spend: 0, conversions: 0 });

  return (
    <div>
      <p>Total Budget: ${totals.budget}</p>
      <p>Total Spend: ${totals.spend}</p>
    </div>
  );
}


// ============================================
// OPTIMIZED VERSION - Performance Issues Fixed
// ============================================

function OptimizedCampaignList({ campaigns, onSelect, filters }) {
  const [searchQuery, setSearchQuery] = useState('');

  // FIX 1: useMemo to memoize filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      return campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
             (filters.status === 'all' || campaign.status === filters.status);
    });
  }, [campaigns, searchQuery, filters.status]); // Only recalculates when dependencies change

  // FIX 2: useCallback to memoize callback function
  const handleCampaignClick = useCallback((campaign) => {
    onSelect(campaign);
  }, [onSelect]);

  // FIX 3: useCallback for favorite handler (stable reference)
  const handleFavorite = useCallback((campaignId) => {
    console.log('favorited', campaignId);
  }, []);

  // FIX 4: Move constant styles outside component or useMemo
  const containerStyle = useMemo(() => ({ 
    padding: '20px', 
    background: '#f5f5f5' 
  }), []);

  return (
    <div style={containerStyle}>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
      />
      {filteredCampaigns.map(campaign => (
        // FIX 5: Using memoized component
        <CampaignCardOptimized
          key={campaign.id}
          campaign={campaign}
          onClick={handleCampaignClick}
          onFavorite={handleFavorite}
        />
      ))}
      {/* FIX 6: TotalStats is memoized */}
      <TotalStatsOptimized campaigns={campaigns} />
    </div>
  );
}

// FIX: Memoize component to prevent unnecessary re-renders
const CampaignCardOptimized = memo(function CampaignCard({ campaign, onClick, onFavorite }) {
  console.log('CampaignCard rendered:', campaign.id);
  
  // FIX: Stable click handler
  const handleClick = useCallback(() => {
    onClick(campaign);
  }, [onClick, campaign]);

  const handleFavoriteClick = useCallback(() => {
    onFavorite(campaign.id);
  }, [onFavorite, campaign.id]);

  return (
    <div onClick={handleClick}>
      <h3>{campaign.name}</h3>
      <p>Budget: ${campaign.budget}</p>
      <button onClick={handleFavoriteClick}>Favorite</button>
    </div>
  );
});

// FIX: Memoize expensive calculations
const TotalStatsOptimized = memo(function TotalStats({ campaigns }) {
  // FIX: useMemo for expensive calculation
  const totals = useMemo(() => {
    console.log('Calculating totals...'); // Now only logs when campaigns change
    return campaigns.reduce((acc, c) => ({
      budget: acc.budget + c.budget,
      spend: acc.spend + c.spend,
      conversions: acc.conversions + c.conversions,
    }), { budget: 0, spend: 0, conversions: 0 });
  }, [campaigns]);

  return (
    <div>
      <p>Total Budget: ${totals.budget}</p>
      <p>Total Spend: ${totals.spend}</p>
    </div>
  );
});

export { SlowCampaignList, OptimizedCampaignList };
