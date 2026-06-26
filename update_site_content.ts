import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
async function run() {
  const result = await sql`SELECT * FROM site_content`;
  if (result.length > 0 && result[0].data) {
    let contentStr = JSON.stringify(result[0].data);
    contentStr = contentStr.replace(/certiva-tuv\.com/g, 'certivatuv.com');
    await sql`UPDATE site_content SET data = ${contentStr}::jsonb WHERE id = ${result[0].id}`;
    console.log("Updated site content");
  }
}
run();
