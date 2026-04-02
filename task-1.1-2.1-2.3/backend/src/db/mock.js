// Mock Database for Development (No PostgreSQL Required)
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const mockDb = {
  users: [
    {
      id: uuidv4(),
      email: 'admin@example.com',
      password_hash: bcrypt.hashSync('password123', 10),
      name: 'Admin User',
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }
  ],
  clients: [
    {
      id: uuidv4(),
      name: 'Lumiere Skincare',
      industry: 'Beauty',
      contact_email: 'contact@lumiere.com',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      name: 'TechFlow Inc',
      industry: 'Technology',
      contact_email: 'contact@techflow.com',
      created_at: new Date(),
      updated_at: new Date()
    }
  ],
  campaigns: [],
  campaign_metrics: [],
  alert_thresholds: [],
  notifications: []
};

// Initialize with sample campaigns
const client1Id = mockDb.clients[0].id;
const client2Id = mockDb.clients[1].id;

mockDb.campaigns = [
  {
    id: 'c001',
    client_id: client1Id,
    name: 'Lumiere Summer Launch',
    status: 'active',
    budget: 50000,
    spend: 32450,
    impressions: 2400000,
    clicks: 48000,
    conversions: 1200,
    start_date: '2026-03-01',
    end_date: '2026-08-31',
    created_at: new Date('2026-03-01'),
    updated_at: new Date(),
    deleted_at: null,
    client_name: 'Lumiere Skincare'
  },
  {
    id: 'c002',
    client_id: client2Id,
    name: 'TechFlow Q1 Campaign',
    status: 'active',
    budget: 75000,
    spend: 45800,
    impressions: 3200000,
    clicks: 96000,
    conversions: 2400,
    start_date: '2026-01-01',
    end_date: '2026-03-31',
    created_at: new Date('2026-01-01'),
    updated_at: new Date(),
    deleted_at: null,
    client_name: 'TechFlow Inc'
  },
  {
    id: 'c003',
    client_id: client1Id,
    name: 'Spring Collection',
    status: 'paused',
    budget: 35000,
    spend: 20000,
    impressions: 1800000,
    clicks: 27000,
    conversions: 540,
    start_date: '2026-02-15',
    end_date: '2026-05-15',
    created_at: new Date('2026-02-15'),
    updated_at: new Date(),
    deleted_at: null,
    client_name: 'Lumiere Skincare'
  }
];

// Add CTR and ROAS calculations
mockDb.campaigns = mockDb.campaigns.map(c => ({
  ...c,
  ctr: c.impressions > 0 ? parseFloat((c.clicks / c.impressions * 100).toFixed(2)) : 0,
  roas: c.spend > 0 ? parseFloat((c.conversions * c.budget / c.spend).toFixed(2)) : 0
}));

export class MockPool {
  async query(sql, params = []) {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 10));

    try {
      // Parse the SQL and handle different operations
      if (sql.includes('SELECT COUNT(*) FROM campaigns')) {
        return { rows: [{ count: mockDb.campaigns.length.toString() }] };
      }

      if (sql.includes('SELECT * FROM users WHERE email')) {
        const email = params[0];
        const user = mockDb.users.find(u => u.email === email);
        return { rows: user ? [user] : [] };
      }

      if (sql.includes('INSERT INTO users')) {
        const newUser = {
          id: uuidv4(),
          email: params[0],
          password_hash: params[1],
          name: params[2],
          role: 'user',
          created_at: new Date(),
          updated_at: new Date()
        };
        mockDb.users.push(newUser);
        return { rows: [newUser] };
      }

      if (sql.includes('SELECT') && sql.includes('FROM campaigns')) {
        // Handle campaign queries
        let campaigns = [...mockDb.campaigns];

        // Apply filters from WHERE clause
        if (sql.includes('WHERE')) {
          // Basic filter simulation - in real app, would parse SQL properly
          if (params.some(p => p === 'active')) {
            campaigns = campaigns.filter(c => c.status === 'active');
          }
          if (params.find(p => typeof p === 'string' && p.length === 36)) {
            // UUID client filter
            const clientId = params.find(p => typeof p === 'string' && p.length === 36);
            campaigns = campaigns.filter(c => c.client_id === clientId);
          }
        }

        // Apply pagination
        const limit = params[params.length - 2];
        const offset = params[params.length - 1];
        const paginatedCampaigns = campaigns.slice(offset, offset + limit);

        return { rows: paginatedCampaigns };
      }

      if (sql.includes('UPDATE campaigns')) {
        // Update campaign
        const id = params[params.length - 1];
        const campaignIndex = mockDb.campaigns.findIndex(c => c.id === id);
        if (campaignIndex >= 0) {
          mockDb.campaigns[campaignIndex] = {
            ...mockDb.campaigns[campaignIndex],
            ...params.slice(0, -1).reduce((acc, val, i) => {
              const fields = ['name', 'status', 'budget', 'spend', 'impressions', 'clicks', 'conversions'];
              if (i < fields.length) acc[fields[i]] = val;
              return acc;
            }, {}),
            updated_at: new Date()
          };
          return { rows: [mockDb.campaigns[campaignIndex]] };
        }
        return { rows: [] };
      }

      if (sql.includes('INSERT INTO campaigns')) {
        const newCampaign = {
          id: uuidv4(),
          client_id: params[0],
          name: params[1],
          status: params[2] || 'draft',
          budget: params[3],
          spend: params[4] || 0,
          impressions: params[5] || 0,
          clicks: params[6] || 0,
          conversions: params[7] || 0,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null
        };
        mockDb.campaigns.push(newCampaign);
        return { rows: [newCampaign] };
      }

      if (sql.includes('UPDATE campaigns SET deleted_at')) {
        const id = params[0];
        const campaign = mockDb.campaigns.find(c => c.id === id);
        if (campaign) {
          campaign.deleted_at = new Date();
          return { rows: [campaign] };
        }
        return { rows: [] };
      }

      return { rows: [] };
    } catch (error) {
      console.error('Mock DB error:', error, sql, params);
      throw error;
    }
  }

  async end() {
    console.log('Mock database connection closed');
  }

  on() {
    // No-op for mock
  }
}

export default new MockPool();
