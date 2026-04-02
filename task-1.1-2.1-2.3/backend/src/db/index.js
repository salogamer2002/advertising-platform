import pg from 'pg';
import dotenv from 'dotenv';
import mockPool from './mock.js';

dotenv.config();

const { Pool } = pg;

const useMock =
  process.env.USE_MOCK_DB === 'true' || !process.env.DATABASE_URL;

let pool;

if (useMock) {
  console.log('Using mock database (set DATABASE_URL and USE_MOCK_DB=false for PostgreSQL)');
  pool = mockPool;
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
  });

  pool
    .query('SELECT 1')
    .then(() => console.log('Connected to PostgreSQL'))
    .catch((err) => {
      console.error('PostgreSQL connection failed:', err.message);
      console.error('Fix DATABASE_URL or set USE_MOCK_DB=true');
      process.exit(1);
    });
}

export default pool;
