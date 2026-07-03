// Worker Thread riêng cho exercise queries — tránh block event loop chính
// node:sqlite (DatabaseSync) là synchronous, nếu NFS chậm sẽ block toàn bộ server.
// Chạy trong Worker Thread riêng: chỉ block thread này, không block main thread.
const { workerData, parentPort } = require('worker_threads');
const { DatabaseSync } = require('node:sqlite');

let db = null;

try {
  db = new DatabaseSync(workerData.dbPath);
  db.exec('PRAGMA busy_timeout=10000');
  db.exec('PRAGMA cache_size=-8000');
  db.exec('PRAGMA temp_store=MEMORY');
  console.log('[ExWorker] DB opened:', workerData.dbPath);
} catch (e) {
  console.error('[ExWorker] Cannot open DB:', e.message);
}

const EXERCISE_SQL = `
  SELECT id,program,skill,title,content,questions,answer_key,
         image_url,audio_url,task_type,metadata,auto_grade,is_private,created_at
  FROM exercises WHERE id=?
`;

let stmt = null;
function getStmt() {
  if (!stmt && db) {
    try { stmt = db.prepare(EXERCISE_SQL); } catch(e) { console.error('[ExWorker] Prepare error:', e.message); }
  }
  return stmt;
}

parentPort.on('message', ({ msgId, id }) => {
  if (!db) {
    parentPort.postMessage({ msgId, ex: null, error: 'DB not available in worker' });
    return;
  }
  try {
    const s = getStmt();
    if (!s) { parentPort.postMessage({ msgId, ex: null, error: 'Cannot prepare statement' }); return; }
    const ex = s.get(id);
    parentPort.postMessage({ msgId, ex: ex || null, error: null });
  } catch (e) {
    stmt = null; // reset prepared statement on error
    parentPort.postMessage({ msgId, ex: null, error: e.message });
  }
});
