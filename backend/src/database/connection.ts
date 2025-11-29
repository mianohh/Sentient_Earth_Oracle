import { Pool } from 'pg';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

export const db = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'sentient_earth_oracle',
  user: 'postgres',
  password: 'password',
  ssl: false,
});

export const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on('error', (err) => console.error('Redis Client Error', err));

export async function initializeDatabase() {
  try {
    const client = await db.connect();
    console.log('Connected to PostgreSQL');
    client.release();
    
    await redis.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Database connection error:', error);
    console.log('Continuing without database...');
  }
}