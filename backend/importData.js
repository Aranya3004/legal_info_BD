// ============================================================
// importData.js — RAG Dataset Import Script
// Run this ONCE to load all 1,484 Bangladesh Legal Acts
// into your PostgreSQL context_legal_dataset table.
//
// HOW TO RUN:
//   cd backend
//   node importData.js
// ============================================================

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// ── Database connection (reads from your .env file) ──────────
const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// ── Path to your JSON file (must be in the backend/ folder) ──
const DATA_FILE = path.join(__dirname, 'Contextualized_Bangladesh_Legal_Acts.json');

// ── Helper: safely convert act_year to an integer ────────────
// Some years in the dataset are strings like "1799" or "XIX"
// We only store it if it's actually a valid number.
function parseYear(yearValue) {
  if (!yearValue) return null;
  const parsed = parseInt(String(yearValue), 10);
  return isNaN(parsed) ? null : parsed;
}

// ── Helper: extract all section text into one big string ─────
// This is what gets indexed for RAG search.
// We join every section_content field into a single text block.
function extractFullText(sections) {
  if (!Array.isArray(sections) || sections.length === 0) return '';
  return sections
    .map(s => s.section_content || '')
    .filter(Boolean)
    .join('\n\n');
}

// ── Helper: safely extract is_repealed from csv_metadata ─────
function extractIsRepealed(csvMetadata) {
  if (!csvMetadata || typeof csvMetadata !== 'object') return false;
  return csvMetadata.is_repealed === true;
}

// ── Main import function ──────────────────────────────────────
async function importData() {

  // Step 1: Check the JSON file exists
  if (!fs.existsSync(DATA_FILE)) {
    console.error('❌ File not found:', DATA_FILE);
    console.error('   Make sure Contextualized_Bangladesh_Legal_Acts.json');
    console.error('   is inside your backend/ folder.');
    process.exit(1);
  }

  console.log('📂 Reading JSON file...');
  const rawData = fs.readFileSync(DATA_FILE, 'utf-8');

  console.log('🔍 Parsing JSON...');
  const parsed = JSON.parse(rawData);

  // The acts are nested under a "acts" key in this dataset
  const acts = parsed.acts || (Array.isArray(parsed) ? parsed : []);

  if (acts.length === 0) {
    console.error('❌ No acts found in the JSON file. Check the file structure.');
    process.exit(1);
  }

  console.log(`✅ Found ${acts.length} acts to import.`);

  // Step 2: Test database connection
  console.log('\n🔌 Connecting to database...');
  try {
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Database connected:', testResult.rows[0].now);
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('   Check your .env file credentials.');
    process.exit(1);
  }

  // Step 3: Check the table exists
  try {
    await pool.query('SELECT 1 FROM context_legal_dataset LIMIT 1');
    console.log('✅ Table context_legal_dataset found.');
  } catch (err) {
    console.error('❌ Table context_legal_dataset not found!');
    console.error('   Run the SQL from Task 1 in pgAdmin first.');
    process.exit(1);
  }

  // Step 4: Check if data already exists to prevent duplicates
  const countResult = await pool.query('SELECT COUNT(*) FROM context_legal_dataset');
  const existingCount = parseInt(countResult.rows[0].count, 10);

  if (existingCount > 0) {
    console.log(`\n⚠️  Table already has ${existingCount} records.`);
    console.log('   Clearing existing data before re-import...');
    await pool.query('TRUNCATE TABLE context_legal_dataset RESTART IDENTITY');
    console.log('✅ Table cleared.');
  }

  // Step 5: Insert all acts
  // We use batches of 50 to avoid overwhelming the DB connection.
  // Each batch is wrapped in a transaction — if one row fails,
  // only that batch is rolled back, not the whole import.
  console.log('\n🚀 Starting import...\n');

  const BATCH_SIZE = 50;
  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  for (let i = 0; i < acts.length; i += BATCH_SIZE) {
    const batch = acts.slice(i, i + BATCH_SIZE);
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      for (const act of batch) {
        try {
          // ── Extract and clean each field ──────────────────

          const act_title = act.act_title
            ? String(act.act_title).trim().slice(0, 1000)
            : 'Untitled Act';

          const act_no = act.act_no
            ? String(act.act_no).trim().slice(0, 50)
            : null;

          const act_year = parseYear(act.act_year);

          const publication_date = act.publication_date
            ? String(act.publication_date).trim().slice(0, 50)
            : null;

          const language = act.language
            ? String(act.language).trim().slice(0, 20)
            : 'unknown';

          const source_url = act.source_url
            ? String(act.source_url).trim()
            : null;

          const is_repealed = extractIsRepealed(act.csv_metadata);

          const token_count = typeof act.token_count === 'number'
            ? act.token_count
            : 0;

          // sections and footnotes must be valid arrays for JSONB
          const sections = Array.isArray(act.sections)
            ? act.sections
            : [];

          const footnotes = Array.isArray(act.footnotes)
            ? act.footnotes
            : [];

          const copyright_info = act.copyright_info
            ? String(act.copyright_info).trim()
            : null;

          // full_text_search: all section text joined together
          // This is what PostgreSQL's tsvector will index
          const full_text_search = extractFullText(sections);

          // JSONB fields — must be objects, never null
          const government_context = (act.government_context && typeof act.government_context === 'object')
            ? act.government_context
            : {};

          const legal_system_context = (act.legal_system_context && typeof act.legal_system_context === 'object')
            ? act.legal_system_context
            : {};

          const csv_metadata = (act.csv_metadata && typeof act.csv_metadata === 'object')
            ? act.csv_metadata
            : {};

          const processing_info = (act.processing_info && typeof act.processing_info === 'object')
            ? act.processing_info
            : {};

          // ── INSERT query ──────────────────────────────────
          // Note: search_vector is NOT in this query because
          // the trigger we created in Task 1 auto-generates it
          // from act_title + full_text_search on every INSERT.
          await client.query(
            `INSERT INTO context_legal_dataset (
              act_title,
              act_no,
              act_year,
              publication_date,
              language,
              source_url,
              is_repealed,
              token_count,
              sections,
              footnotes,
              copyright_info,
              full_text_search,
              government_context,
              legal_system_context,
              csv_metadata,
              processing_info
            ) VALUES (
              $1,  $2,  $3,  $4,
              $5,  $6,  $7,  $8,
              $9,  $10, $11, $12,
              $13, $14, $15, $16
            )`,
            [
              act_title,
              act_no,
              act_year,
              publication_date,
              language,
              source_url,
              is_repealed,
              token_count,
              JSON.stringify(sections),           // Convert to JSON string for JSONB
              JSON.stringify(footnotes),
              copyright_info,
              full_text_search,
              JSON.stringify(government_context),
              JSON.stringify(legal_system_context),
              JSON.stringify(csv_metadata),
              JSON.stringify(processing_info),
            ]
          );

          successCount++;

        } catch (rowErr) {
          // One row failed — log it but keep going
          errorCount++;
          errors.push({
            act_title: act.act_title || 'Unknown',
            error: rowErr.message,
          });
        }
      }

      await client.query('COMMIT');

    } catch (batchErr) {
      await client.query('ROLLBACK');
      console.error(`❌ Batch starting at row ${i} failed:`, batchErr.message);
      errorCount += batch.length;
    } finally {
      client.release();
    }

    // Progress indicator every 100 records
    if ((i + BATCH_SIZE) % 100 === 0 || i + BATCH_SIZE >= acts.length) {
      const done = Math.min(i + BATCH_SIZE, acts.length);
      const pct  = Math.round((done / acts.length) * 100);
      const bar  = '█'.repeat(Math.floor(pct / 5)) + '░'.repeat(20 - Math.floor(pct / 5));
      process.stdout.write(`\r   [${bar}] ${pct}% (${done}/${acts.length})`);
    }
  }

  // Step 6: Final report
  console.log('\n\n═══════════════════════════════════════');
  console.log('           IMPORT COMPLETE');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Successfully imported : ${successCount}`);
  console.log(`❌ Failed                : ${errorCount}`);

  if (errors.length > 0) {
    console.log('\n⚠️  First 5 errors:');
    errors.slice(0, 5).forEach(e => {
      console.log(`   - "${e.act_title}": ${e.error}`);
    });
  }

  // Step 7: Verify in database
  const finalCount = await pool.query('SELECT COUNT(*) FROM context_legal_dataset');
  console.log(`\n📊 Total rows in database: ${finalCount.rows[0].count}`);

  // Step 8: Verify search_vector was built by trigger
  const vectorCheck = await pool.query(
    `SELECT COUNT(*) FROM context_legal_dataset WHERE search_vector IS NOT NULL`
  );
  console.log(`🔍 Rows with search index: ${vectorCheck.rows[0].count}`);

  // Step 9: Quick test search to confirm RAG will work
  console.log('\n🧪 Running test RAG search for "labour rights overtime"...');
  const testSearch = await pool.query(
    `SELECT act_title, act_year,
            ts_rank(search_vector, query) AS relevance_score
     FROM context_legal_dataset,
          plainto_tsquery('english', 'labour rights overtime') query
     WHERE search_vector @@ query
       AND is_repealed = FALSE
     ORDER BY relevance_score DESC
     LIMIT 3`
  );

  if (testSearch.rows.length > 0) {
    console.log('✅ RAG search working! Top results:');
    testSearch.rows.forEach((r, i) => {
      console.log(`   ${i + 1}. [${r.act_year}] ${r.act_title} (score: ${parseFloat(r.relevance_score).toFixed(4)})`);
    });
  } else {
    console.log('⚠️  Test search returned 0 results.');
    console.log('   This may be normal if no acts match "labour rights overtime".');
    console.log('   The system is still working correctly.');
  }

  console.log('\n🎉 Your RAG dataset is ready!');
  console.log('   Proceed to Task 3 to build the API endpoint.\n');

  await pool.end();
}

// ── Run it ───────────────────────────────────────────────────
importData().catch(err => {
  console.error('\n💥 Fatal error:', err.message);
  console.error(err.stack);
  process.exit(1);
});