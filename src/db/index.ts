import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is missing!");
}

const sql = neon(process.env.DATABASE_URL || 'postgresql://fake_user:fake_password@fake_host/fake_db?sslmode=require');
export const db = drizzle(sql, { schema });

