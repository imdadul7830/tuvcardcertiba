import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
async function run() {
  const result = await sql`SELECT * FROM settings`;
  console.log(result);
}
run();
