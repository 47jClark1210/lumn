import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../models/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSqlFiles(dir) {
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    console.log(`Running ${file}...`);
    try {
      await db.query(sql);
      console.log(`✅ ${file} complete`);
    } catch (err) {
      console.error(`❌ Error in ${file}:`, err);
      process.exit(1);
    }
  }
}

const inputDir = process.argv[2];
if (!inputDir) {
  console.error('Usage: node scripts/run-sql.js <directory>');
  process.exit(1);
}

runSqlFiles(path.resolve(__dirname, '..', inputDir)).then(() => {
  console.log('All SQL scripts complete!');
  process.exit(0);
});
