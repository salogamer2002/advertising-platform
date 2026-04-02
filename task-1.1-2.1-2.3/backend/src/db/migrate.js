import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.join(__dirname, '..', '..');

const defaultUrl =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@127.0.0.1:5432/campaign_db';

function adminDatabaseUrl(url) {
  const u = new URL(url);
  u.pathname = '/postgres';
  return u.toString();
}

async function ensureDatabase(adminUrlStr, dbName) {
  const client = new pg.Client({ connectionString: adminUrlStr });
  await client.connect();
  const r = await client.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [dbName]
  );
  if (r.rows.length === 0) {
    await client.query(`CREATE DATABASE "${dbName.replace(/"/g, '""')}"`);
    console.log(`Created database: ${dbName}`);
  } else {
    console.log(`Database already exists: ${dbName}`);
  }
  await client.end();
}

async function run() {
  const url = new URL(defaultUrl);
  const dbName = url.pathname.replace(/^\//, '') || 'campaign_db';

  const adminConn = adminDatabaseUrl(defaultUrl);
  await ensureDatabase(adminConn, dbName);

  const schemaPath = path.join(backendRoot, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  const pool = new pg.Pool({ connectionString: defaultUrl });
  await pool.query(sql);
  console.log('Applied schema.sql');

  await seedIfEmpty(pool);

  await pool.end();
  console.log('Migration finished.');
}

async function seedIfEmpty(pool) {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS c FROM users');
  if (rows[0].c > 0) {
    console.log('Seed skipped (users already present).');
    return;
  }

  const hash =
    '$2a$10$wePnFF5wwYAOuP67aSbzoeEjYmhJ7jpw6KCVMzBljm3MKdMhtiJAu';

  const client1 = '11111111-1111-1111-1111-111111111101';
  const client2 = '22222222-2222-2222-2222-222222222202';
  const camp1 = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1';
  const camp2 = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2';

  await pool.query(
    `INSERT INTO users (id, email, password_hash, name, role) VALUES
      (gen_random_uuid(), 'admin@example.com', $1, 'Admin User', 'admin')`,
    [hash]
  );

  await pool.query(
    `INSERT INTO clients (id, name, industry, contact_email) VALUES
      ($1, 'Lumiere Skincare', 'Beauty', 'contact@lumiere.com'),
      ($2, 'TechFlow Inc', 'Technology', 'contact@techflow.com')`,
    [client1, client2]
  );

  await pool.query(
    `INSERT INTO campaigns (
      id, client_id, name, status, budget, spend, impressions, clicks, conversions,
      start_date, end_date
    ) VALUES
      ($1, $3, 'Lumiere Summer Launch', 'active', 50000, 32450, 2400000, 48000, 1200,
       '2026-03-01', '2026-08-31'),
      ($2, $4, 'TechFlow Q1 Campaign', 'active', 75000, 45800, 3200000, 96000, 2400,
       '2026-01-01', '2026-03-31')`,
    [camp1, camp2, client1, client2]
  );

  const metrics = [];
  for (let d = 0; d < 30; d++) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    const y = date.toISOString().slice(0, 10);
    metrics.push(
      pool.query(
        `INSERT INTO campaign_metrics (campaign_id, date, impressions, clicks, conversions, spend)
         VALUES ($1, $2::date, $3, $4, $5, $6)
         ON CONFLICT (campaign_id, date) DO NOTHING`,
        [camp1, y, 80000 + d * 100, 1600 + d * 2, 40 + d, 1000 + d * 10]
      )
    );
  }
  await Promise.all(metrics);

  console.log('Seed data inserted.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
