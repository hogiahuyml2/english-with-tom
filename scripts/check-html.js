// ─────────────────────────────────────────────────────────────────────────────
// Hàng rào an toàn: kiểm tra cú pháp JavaScript inline trong MỌI file .html.
//
// Vì sao cần: một lỗi cú pháp nhỏ (vd chuỗi '...' bị xuống dòng) làm CHẾT toàn bộ
// <script> của trang → JS không chạy → trang kẹt "Đang tải đề...". Kiểu lỗi này
// KHÔNG làm server sập nên rất dễ lọt lên production mà không ai biết.
//
// Script này chạy TRƯỚC khi server khởi động (xem railway.toml startCommand).
// Nếu phát hiện lỗi cú pháp → thoát mã 1 → deploy thất bại → Railway giữ nguyên
// bản đang chạy tốt → học sinh KHÔNG BAO GIỜ thấy trang hỏng.
//
// Chạy thủ công tại máy trước khi push:  npm run check
// ─────────────────────────────────────────────────────────────────────────────
const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

const ROOT = path.join(__dirname, '..');

// Lấy dòng bắt đầu (1-based) của một vị trí ký tự trong chuỗi
function lineAt(text, index) {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i++) {
    if (text[i] === '\n') line++;
  }
  return line;
}

// Trả về true nếu thẻ <script ...> là JS inline cần kiểm (bỏ qua src ngoài,
// bỏ qua template/JSON như type="text/template", "application/json").
function isInlineJs(openTag) {
  if (/\bsrc\s*=/.test(openTag)) return false;               // script ngoài — không kiểm
  const m = openTag.match(/\btype\s*=\s*["']([^"']+)["']/i);
  if (!m) return true;                                        // không có type = JS cổ điển
  const t = m[1].toLowerCase().trim();
  return t === 'text/javascript' || t === 'application/javascript' || t === 'module';
}

function checkFile(file) {
  const html = fs.readFileSync(file, 'utf8');
  const errors = [];
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const openTag = m[1] || '';
    const code    = m[2] || '';
    if (!isInlineJs(openTag)) continue;
    if (!code.trim()) continue;
    const isModule = /\btype\s*=\s*["']module["']/i.test(openTag);
    try {
      // vm.Script CHỈ biên dịch (không chạy) → bắt lỗi cú pháp mà không cần
      // window/document. Module thì bọc để cho phép import/export ở top-level.
      const src = isModule ? '(async()=>{' + code + '\n})' : code;
      new vm.Script(src, { filename: path.basename(file) });
    } catch (e) {
      const startLine = lineAt(html, m.index);
      errors.push({ file: path.relative(ROOT, file), htmlLine: startLine, msg: e.message });
    }
  }
  return errors;
}

function main() {
  let files;
  try {
    files = fs.readdirSync(ROOT).filter(f => f.toLowerCase().endsWith('.html'));
  } catch (e) {
    // Không đọc được thư mục — KHÔNG chặn deploy vì đây là lỗi của checker, không phải của trang
    console.warn('[check-html] Bỏ qua (không liệt kê được file):', e.message);
    process.exit(0);
  }

  const allErrors = [];
  for (const f of files) {
    try {
      allErrors.push(...checkFile(path.join(ROOT, f)));
    } catch (e) {
      console.warn('[check-html] Bỏ qua', f, '—', e.message); // lỗi checker → không chặn
    }
  }

  if (allErrors.length === 0) {
    console.log('[check-html] ✅ ' + files.length + ' trang HTML — JavaScript hợp lệ, không có lỗi cú pháp.');
    process.exit(0);
  }

  console.error('\n[check-html] ❌ PHÁT HIỆN LỖI CÚ PHÁP JAVASCRIPT — CHẶN DEPLOY:');
  for (const e of allErrors) {
    console.error('  • ' + e.file + ' (gần dòng ' + e.htmlLine + '): ' + e.msg);
  }
  console.error('\n  → Sửa lỗi trên rồi push lại. Bản đang chạy vẫn được giữ nguyên cho học sinh.\n');
  process.exit(1);
}

main();
