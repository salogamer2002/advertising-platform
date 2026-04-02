"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bug, Code, Database, Zap, Sparkles, Check, Copy, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SPEED_TASKS = [
  {
    id: "q1",
    title: "Debug Express.js API",
    description: "Find and fix 4 bugs: SQL injection, missing validation, error leaks, rate limiting",
    stack: "Node.js / Express / SQL",
    time: "20 min",
    points: 10,
    icon: Bug,
    buggyCode: `// BUGGY CODE - 4 issues to find
const express = require('express');
const app = express();

app.get('/users', (req, res) => {
  const { search } = req.query;
  // Bug 1: SQL Injection vulnerability
  const query = \`SELECT * FROM users WHERE name = '\${search}'\`;
  db.query(query, (err, results) => {
    if (err) {
      // Bug 2: Exposing internal error details
      res.status(500).json({ error: err.message, stack: err.stack });
    }
    res.json(results);
  });
});

app.post('/users', (req, res) => {
  // Bug 3: No input validation
  const { name, email } = req.body;
  db.query('INSERT INTO users (name, email) VALUES (?, ?)', 
    [name, email], (err) => {
      if (err) res.status(500).send('Error');
      res.status(201).json({ success: true });
    });
});

// Bug 4: No rate limiting
app.listen(3000);`,
    fixedCode: `// FIXED CODE
const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const app = express();

// Fix 4: Add rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.get('/users', (req, res) => {
  const { search } = req.query;
  // Fix 1: Use parameterized queries
  const query = 'SELECT * FROM users WHERE name = ?';
  db.query(query, [search], (err, results) => {
    if (err) {
      // Fix 2: Generic error message, log internally
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});

// Fix 3: Add input validation
app.post('/users', [
  body('name').isString().trim().isLength({ min: 1, max: 100 }),
  body('email').isEmail().normalizeEmail()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name, email } = req.body;
  db.query('INSERT INTO users (name, email) VALUES (?, ?)', 
    [name, email], (err) => {
      if (err) {
        console.error('Insert error:', err);
        return res.status(500).json({ error: 'Failed to create user' });
      }
      res.status(201).json({ success: true });
    });
});

app.listen(3000);`,
  },
  {
    id: "q2",
    title: "useDebounce Custom Hook",
    description: "React custom hook that delays API calls in a search input by 300ms",
    stack: "React Hooks",
    time: "10 min",
    points: 10,
    icon: Code,
    fixedCode: `import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook that debounces a value
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook that returns a debounced callback function
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds (default: 300)
 * @returns Debounced callback function
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number = 300
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

// Usage Example
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearch) {
      // API call only fires 300ms after user stops typing
      fetchSearchResults(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}`,
  },
  {
    id: "q3",
    title: "SQL Query - Top 5 by ROAS",
    description: "Find top 5 campaigns by ROAS for each client in the last 30 days",
    stack: "PostgreSQL",
    time: "15 min",
    points: 10,
    icon: Database,
    fixedCode: `-- Top 5 campaigns by ROAS for each client (last 30 days)
-- Using window functions and CTEs for clean, efficient query

WITH campaign_metrics AS (
  SELECT 
    c.id AS campaign_id,
    c.name AS campaign_name,
    c.client_id,
    cl.name AS client_name,
    c.spend,
    c.conversions,
    -- Calculate ROAS (Return on Ad Spend)
    -- Assuming $100 average conversion value
    CASE 
      WHEN c.spend > 0 THEN (c.conversions * 100.0) / c.spend 
      ELSE 0 
    END AS roas,
    c.start_date,
    c.end_date
  FROM campaigns c
  INNER JOIN clients cl ON c.client_id = cl.id
  WHERE 
    c.start_date >= CURRENT_DATE - INTERVAL '30 days'
    AND c.status IN ('active', 'completed')
    AND c.spend > 0
),
ranked_campaigns AS (
  SELECT 
    *,
    ROW_NUMBER() OVER (
      PARTITION BY client_id 
      ORDER BY roas DESC
    ) AS rank_within_client
  FROM campaign_metrics
)
SELECT 
  client_name,
  campaign_name,
  spend,
  conversions,
  ROUND(roas, 2) AS roas,
  start_date,
  end_date,
  rank_within_client AS rank
FROM ranked_campaigns
WHERE rank_within_client <= 5
ORDER BY 
  client_name ASC, 
  rank_within_client ASC;

-- Alternative using LATERAL join for older PostgreSQL versions
SELECT 
  cl.name AS client_name,
  top_campaigns.*
FROM clients cl
CROSS JOIN LATERAL (
  SELECT 
    c.name AS campaign_name,
    c.spend,
    c.conversions,
    ROUND((c.conversions * 100.0) / NULLIF(c.spend, 0), 2) AS roas
  FROM campaigns c
  WHERE 
    c.client_id = cl.id
    AND c.start_date >= CURRENT_DATE - INTERVAL '30 days'
    AND c.spend > 0
  ORDER BY (c.conversions * 100.0) / NULLIF(c.spend, 0) DESC
  LIMIT 5
) top_campaigns
ORDER BY cl.name, roas DESC;`,
  },
  {
    id: "q4",
    title: "Optimize React Component",
    description: "Identify and fix unnecessary re-renders using React DevTools patterns",
    stack: "React Performance",
    time: "15 min",
    points: 10,
    icon: Zap,
    buggyCode: `// SLOW COMPONENT - Multiple re-render issues
function CampaignList({ campaigns }) {
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Problem 1: Recalculates on every render
  const filteredCampaigns = campaigns
    .filter(c => c.name.includes(filter))
    .sort((a, b) => sortOrder === 'asc' ? a.spend - b.spend : b.spend - a.spend);
  
  // Problem 2: Creates new function reference every render
  const handleClick = (id) => {
    console.log('Clicked:', id);
  };
  
  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      {filteredCampaigns.map(campaign => (
        // Problem 3: No memoization on child component
        <CampaignCard 
          key={campaign.id}
          campaign={campaign}
          onClick={handleClick}
        />
      ))}
    </div>
  );
}

function CampaignCard({ campaign, onClick }) {
  console.log('Rendering:', campaign.name); // Logs on every parent render
  return (
    <div onClick={() => onClick(campaign.id)}>
      {campaign.name} - ${campaign.spend}
    </div>
  );
}`,
    fixedCode: `// OPTIMIZED COMPONENT
import { useState, useMemo, useCallback, memo } from 'react';

function CampaignList({ campaigns }) {
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Fix 1: Memoize expensive computation
  const filteredCampaigns = useMemo(() => {
    return campaigns
      .filter(c => c.name.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => sortOrder === 'asc' ? a.spend - b.spend : b.spend - a.spend);
  }, [campaigns, filter, sortOrder]);
  
  // Fix 2: Stable callback reference
  const handleClick = useCallback((id) => {
    console.log('Clicked:', id);
  }, []);
  
  // Fix: Memoize input handler too
  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []);
  
  return (
    <div>
      <input value={filter} onChange={handleFilterChange} />
      {filteredCampaigns.map(campaign => (
        <MemoizedCampaignCard 
          key={campaign.id}
          campaign={campaign}
          onClick={handleClick}
        />
      ))}
    </div>
  );
}

// Fix 3: Memoize child component
const MemoizedCampaignCard = memo(function CampaignCard({ campaign, onClick }) {
  console.log('Rendering:', campaign.name); // Only logs when props change
  return (
    <div onClick={() => onClick(campaign.id)}>
      {campaign.name} - \${campaign.spend}
    </div>
  );
});

// Even better: Use arePropsEqual for custom comparison
const MemoizedCampaignCardV2 = memo(
  function CampaignCard({ campaign, onClick }) {
    return (
      <div onClick={() => onClick(campaign.id)}>
        {campaign.name} - \${campaign.spend}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.campaign.id === nextProps.campaign.id &&
           prevProps.campaign.spend === nextProps.campaign.spend;
  }
);`,
  },
  {
    id: "q5",
    title: "AI-Assisted CRUD Scaffold",
    description: "Use GitHub Copilot or Cursor AI to scaffold a full Express route in 10 min",
    stack: "AI Coding Tool",
    time: "10 min",
    points: 10,
    icon: Sparkles,
    fixedCode: `// AI-Generated CRUD Route for Campaigns
// Generated using GitHub Copilot / Cursor AI

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const Joi = require('joi');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Validation schemas
const campaignSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  client_id: Joi.string().uuid().required(),
  budget: Joi.number().positive().required(),
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().greater(Joi.ref('start_date')).required(),
  status: Joi.string().valid('draft', 'active', 'paused', 'completed').default('draft')
});

const updateSchema = campaignSchema.fork(
  ['name', 'client_id', 'budget', 'start_date', 'end_date'],
  (schema) => schema.optional()
);

// Middleware for validation
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  req.validatedBody = value;
  next();
};

// GET all campaigns with pagination & filtering
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, client_id, sort = 'created_at', order = 'desc' } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM campaigns WHERE deleted_at IS NULL';
    const params = [];
    
    if (status) {
      params.push(status);
      query += \` AND status = $\${params.length}\`;
    }
    if (client_id) {
      params.push(client_id);
      query += \` AND client_id = $\${params.length}\`;
    }
    
    const validSortColumns = ['name', 'budget', 'spend', 'created_at'];
    const sortColumn = validSortColumns.includes(sort) ? sort : 'created_at';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
    
    query += \` ORDER BY \${sortColumn} \${sortOrder} LIMIT $\${params.length + 1} OFFSET $\${params.length + 2}\`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    const countResult = await pool.query('SELECT COUNT(*) FROM campaigns WHERE deleted_at IS NULL');
    
    res.json({
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count),
        pages: Math.ceil(countResult.rows[0].count / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching campaigns:', err);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// GET single campaign
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM campaigns WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching campaign:', err);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

// POST create campaign
router.post('/', validate(campaignSchema), async (req, res) => {
  try {
    const { name, client_id, budget, start_date, end_date, status } = req.validatedBody;
    const result = await pool.query(
      \`INSERT INTO campaigns (name, client_id, budget, start_date, end_date, status) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *\`,
      [name, client_id, budget, start_date, end_date, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating campaign:', err);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// PUT update campaign
router.put('/:id', validate(updateSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.validatedBody;
    const keys = Object.keys(updates);
    
    if (keys.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    const setClause = keys.map((key, i) => \`\${key} = $\${i + 2}\`).join(', ');
    const values = [id, ...keys.map(k => updates[k])];
    
    const result = await pool.query(
      \`UPDATE campaigns SET \${setClause}, updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *\`,
      values
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating campaign:', err);
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

// DELETE (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE campaigns SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json({ message: 'Campaign deleted successfully' });
  } catch (err) {
    console.error('Error deleting campaign:', err);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

module.exports = router;`,
  },
];

export default function Section3SpeedTasks() {
  const [activeTask, setActiveTask] = useState("q1");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const currentTask = SPEED_TASKS.find((t) => t.id === activeTask)!;

  const copyCode = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto p-8">
        <Link href="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Section 3: Speed & Practical Tasks</h1>
          <p className="text-slate-400 mt-2">Timed technical challenges - accuracy and code quality matter as much as speed</p>
          <div className="flex items-center gap-4 mt-4">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              <Clock className="h-3 w-3 mr-1" />
              Total: 70 min
            </Badge>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <Award className="h-3 w-3 mr-1" />
              50 points
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Task Selector */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Tasks</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-700">
                  {SPEED_TASKS.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => setActiveTask(task.id)}
                      className={`w-full text-left p-4 transition-colors ${
                        activeTask === task.id ? "bg-slate-700" : "hover:bg-slate-700/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${activeTask === task.id ? "bg-slate-600" : "bg-slate-800"}`}>
                          <task.icon className="h-4 w-4 text-slate-300" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white text-sm">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-400">{task.time}</span>
                            <span className="text-xs text-slate-500">|</span>
                            <span className="text-xs text-emerald-400">{task.points} pts</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Task Content */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className="bg-slate-700 text-slate-300">{currentTask.id.toUpperCase()}</Badge>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{currentTask.stack}</Badge>
                    </div>
                    <CardTitle className="text-white text-xl">{currentTask.title}</CardTitle>
                    <CardDescription className="text-slate-400 mt-1">{currentTask.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-500/20 text-amber-400">
                      <Clock className="h-3 w-3 mr-1" />
                      {currentTask.time}
                    </Badge>
                    <Badge className="bg-emerald-500/20 text-emerald-400">
                      {currentTask.points} pts
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={currentTask.buggyCode ? "buggy" : "solution"}>
                  <TabsList className="bg-slate-700">
                    {currentTask.buggyCode && (
                      <TabsTrigger value="buggy" className="data-[state=active]:bg-slate-600">
                        Buggy Code
                      </TabsTrigger>
                    )}
                    <TabsTrigger value="solution" className="data-[state=active]:bg-slate-600">
                      Solution
                    </TabsTrigger>
                  </TabsList>

                  {currentTask.buggyCode && (
                    <TabsContent value="buggy" className="mt-4">
                      <div className="relative">
                        <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed">
                          <code>{currentTask.buggyCode}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2 text-slate-400 hover:text-white"
                          onClick={() => copyCode(currentTask.buggyCode!, "buggy")}
                        >
                          {copiedCode === "buggy" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TabsContent>
                  )}

                  <TabsContent value="solution" className="mt-4">
                    <div className="relative">
                      <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed">
                        <code>{currentTask.fixedCode}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-slate-400 hover:text-white"
                        onClick={() => copyCode(currentTask.fixedCode, "fixed")}
                      >
                        {copiedCode === "fixed" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
