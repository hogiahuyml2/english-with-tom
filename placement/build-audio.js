'use strict';
// Sinh file âm thanh cho phần Nghe từ lời thoại (script) trong ngân hàng đề — dùng giọng đọc có sẵn của macOS (`say`) + afconvert → m4a.
// Chạy trên máy macOS: node placement/build-audio.js [--force]
// Kết quả: placement/audio/<id>.m4a  +  placement/audio/manifest.json (độ dài, mã băm lời thoại để chỉ sinh lại khi lời đổi)
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { execFileSync } = require('child_process');
const bank = require('./bank');
const DIR = path.join(__dirname, 'audio'); const TMP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'ewt-tts-'));
const VOICES = { M: 'Daniel', M2: 'Reed (English (UK))', F: 'Shelley (English (UK))', F2: 'Sandy (English (UK))' };
const RATE = { A2: 158, B1: 166, B2: 172, C1: 176 };
const SR = 22050;
const force = process.argv.includes('--force');
const manifestPath = path.join(DIR, 'manifest.json');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};

function wavPcm(file) { // đọc dữ liệu PCM 16-bit từ file WAV do `say` tạo
  const b = fs.readFileSync(file); let p = 12;
  while (p < b.length - 8) { const id = b.toString('ascii', p, p + 4), sz = b.readUInt32LE(p + 4); if (id === 'data') return b.subarray(p + 8, p + 8 + sz); p += 8 + sz + (sz % 2); }
  throw new Error('WAV không hợp lệ: ' + file);
}
function wavFile(pcm, out) {
  const h = Buffer.alloc(44); h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40);
  fs.writeFileSync(out, Buffer.concat([h, pcm]));
}
const silence = (sec) => Buffer.alloc(Math.round(SR * sec) * 2);

const items = bank.all.filter((it) => it.type === 'listen' && !it.spare);
let made = 0, skipped = 0;
for (const it of items) {
  const hash = crypto.createHash('sha1').update(JSON.stringify([it.script, RATE[it.lv] || 165, VOICES])).digest('hex').slice(0, 12);
  const out = path.join(DIR, it.id + '.m4a');
  if (!force && manifest[it.id] && manifest[it.id].hash === hash && fs.existsSync(out)) { skipped++; continue; }
  const parts = [silence(0.6)];
  it.script.forEach(([spk, text], i) => {
    const voice = VOICES[spk]; if (!voice) throw new Error(it.id + ': người nói không hợp lệ ' + spk);
    const f = path.join(TMP, 'seg.wav');
    execFileSync('say', ['-v', voice, '-r', String(RATE[it.lv] || 165), '-o', f, '--file-format=WAVE', '--data-format=LEI16@' + SR, text]);
    parts.push(wavPcm(f));
    parts.push(silence(i < it.script.length - 1 ? 0.45 : 0.8));
  });
  const pcm = Buffer.concat(parts); const wav = path.join(TMP, it.id + '.wav'); wavFile(pcm, wav);
  execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '28000', '-c', '1', wav, out]);
  fs.unlinkSync(wav);
  manifest[it.id] = { hash, sec: Math.round((pcm.length / 2 / SR) * 10) / 10, bytes: fs.statSync(out).size };
  made++; if (made % 10 === 0) console.log('… đã tạo', made);
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
const tot = Object.values(manifest).reduce((a, m) => ({ sec: a.sec + m.sec, bytes: a.bytes + m.bytes }), { sec: 0, bytes: 0 });
console.log(`Xong: tạo ${made}, giữ nguyên ${skipped}. Tổng ${items.length} clip, ${Math.round(tot.sec / 60)} phút, ${(tot.bytes / 1048576).toFixed(1)} MB`);
