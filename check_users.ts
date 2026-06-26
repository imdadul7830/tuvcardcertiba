import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();
const sql = neon(process.env.DATABASE_URL!);
async function run() {
  const result = await sql`SELECT * FROM users`;
  console.log(result);
}
run();
