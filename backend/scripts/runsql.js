const fs = require('fs');
const path = require('path');
const db = require('../models/db');

async function runSqlFiles(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();
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

const dir = process.argv[2];
if (!dir) {
  console.error('Usage: node scripts/run-sql.js <directory>');
  process.exit(1);
}

runSqlFiles(path.resolve(__dirname, '..', dir)).then(() => {
  console.log('All SQL scripts complete!');
  process.exit(0);
});