import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
async function run() {
  await sql`UPDATE users SET role = 'admin' WHERE username = 'admin'`;
  console.log("Updated");
}
run();
