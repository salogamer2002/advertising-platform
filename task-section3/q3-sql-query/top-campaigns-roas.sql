/**
 * Q3: SQL Query - Top 5 Campaigns by ROAS per Client
 * 
 * TASK: Write a SQL query to find the top 5 campaigns by ROAS 
 *       for each client in the last 30 days
 * Time: 15 minutes
 */

-- Solution using Window Functions (ROW_NUMBER)
-- ROAS = (Revenue from Conversions) / Spend
-- Assuming conversion_value or using conversions * average_order_value

WITH campaign_roas AS (
    SELECT 
        c.id,
        c.name AS campaign_name,
        c.client_id,
        cl.name AS client_name,
        c.spend,
        c.conversions,
        c.budget,
        c.created_at,
        -- Calculate ROAS: (conversions * assumed avg order value) / spend
        -- Or simpler: conversions / spend * budget ratio
        CASE 
            WHEN c.spend > 0 THEN ROUND((c.conversions::DECIMAL * 100) / c.spend, 2)
            ELSE 0 
        END AS roas,
        -- Rank campaigns within each client by ROAS
        ROW_NUMBER() OVER (
            PARTITION BY c.client_id 
            ORDER BY 
                CASE 
                    WHEN c.spend > 0 THEN (c.conversions::DECIMAL * 100) / c.spend 
                    ELSE 0 
                END DESC
        ) AS roas_rank
    FROM 
        campaigns c
    INNER JOIN 
        clients cl ON c.client_id = cl.id
    WHERE 
        c.deleted_at IS NULL
        AND c.created_at >= CURRENT_DATE - INTERVAL '30 days'
        AND c.spend > 0  -- Only include campaigns with spend
)
SELECT 
    client_id,
    client_name,
    campaign_name,
    spend,
    conversions,
    roas,
    roas_rank
FROM 
    campaign_roas
WHERE 
    roas_rank <= 5
ORDER BY 
    client_name,
    roas_rank;


-- ===========================================
-- Alternative Solution using LATERAL JOIN
-- ===========================================

/*
SELECT 
    cl.id AS client_id,
    cl.name AS client_name,
    top_campaigns.*
FROM 
    clients cl
CROSS JOIN LATERAL (
    SELECT 
        c.id,
        c.name AS campaign_name,
        c.spend,
        c.conversions,
        CASE 
            WHEN c.spend > 0 THEN ROUND((c.conversions::DECIMAL * 100) / c.spend, 2)
            ELSE 0 
        END AS roas
    FROM 
        campaigns c
    WHERE 
        c.client_id = cl.id
        AND c.deleted_at IS NULL
        AND c.created_at >= CURRENT_DATE - INTERVAL '30 days'
        AND c.spend > 0
    ORDER BY 
        (c.conversions::DECIMAL * 100) / c.spend DESC
    LIMIT 5
) AS top_campaigns
ORDER BY 
    cl.name,
    top_campaigns.roas DESC;
*/


-- ===========================================
-- Solution with additional metrics
-- ===========================================

/*
WITH campaign_metrics AS (
    SELECT 
        c.id,
        c.name AS campaign_name,
        c.client_id,
        cl.name AS client_name,
        c.budget,
        c.spend,
        c.impressions,
        c.clicks,
        c.conversions,
        -- CTR (Click-Through Rate)
        CASE 
            WHEN c.impressions > 0 
            THEN ROUND((c.clicks::DECIMAL / c.impressions) * 100, 2)
            ELSE 0 
        END AS ctr,
        -- ROAS (Return on Ad Spend)
        CASE 
            WHEN c.spend > 0 
            THEN ROUND((c.conversions::DECIMAL * 100) / c.spend, 2)
            ELSE 0 
        END AS roas,
        -- CPA (Cost Per Acquisition)
        CASE 
            WHEN c.conversions > 0 
            THEN ROUND(c.spend / c.conversions::DECIMAL, 2)
            ELSE NULL 
        END AS cpa,
        -- Budget utilization %
        CASE 
            WHEN c.budget > 0 
            THEN ROUND((c.spend / c.budget) * 100, 1)
            ELSE 0 
        END AS budget_utilization,
        -- Ranking
        ROW_NUMBER() OVER (
            PARTITION BY c.client_id 
            ORDER BY 
                CASE WHEN c.spend > 0 THEN (c.conversions::DECIMAL * 100) / c.spend ELSE 0 END DESC
        ) AS rank_in_client
    FROM 
        campaigns c
    INNER JOIN 
        clients cl ON c.client_id = cl.id
    WHERE 
        c.deleted_at IS NULL
        AND c.status = 'active'
        AND c.created_at >= CURRENT_DATE - INTERVAL '30 days'
)
SELECT 
    client_name,
    campaign_name,
    budget,
    spend,
    impressions,
    clicks,
    conversions,
    ctr,
    roas,
    cpa,
    budget_utilization,
    rank_in_client
FROM 
    campaign_metrics
WHERE 
    rank_in_client <= 5
ORDER BY 
    client_name,
    rank_in_client;
*/
