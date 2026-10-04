// Đọc file Word (.docx) không cần thư viện: giải nén ZIP + đọc document.xml, giữ lại thông tin MÀU CHỮ (để nhận đáp án in đỏ).
'use strict';
const zlib = require('zlib');

const MAX_UNZIP = 12 * 1024 * 1024;

function zipEntries(buf) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 66000); i--) if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new Error('File không phải định dạng Word (.docx) hợp lệ.');
  const count = Math.min(buf.readUInt16LE(eocd + 10), 4000);
  let p = buf.readUInt32LE(eocd + 16);
  const map = new Map();
  for (let n = 0; n < count && p + 46 <= buf.length; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) break;
    const method = buf.readUInt16LE(p + 10), csize = buf.readUInt32LE(p + 20), usize = buf.readUInt32LE(p + 24);
    const nlen = buf.readUInt16LE(p + 28), elen = buf.readUInt16LE(p + 30), clen = buf.readUInt16LE(p + 32), off = buf.readUInt32LE(p + 42);
    map.set(buf.toString('utf8', p + 46, p + 46 + nlen), { method, csize, usize, off });
    p += 46 + nlen + elen + clen;
  }
  return map;
}
function zipRead(buf, e) {
  if (!e) throw new Error('File Word thiếu nội dung (document.xml).');
  if (e.usize > MAX_UNZIP) throw new Error('File quá lớn hoặc không đọc được.');
  const nlen = buf.readUInt16LE(e.off + 26), elen = buf.readUInt16LE(e.off + 28);
  const start = e.off + 30 + nlen + elen;
  const data = buf.subarray(start, start + e.csize);
  if (e.method === 0) return data;
  if (e.method === 8) return zlib.inflateRawSync(data, { maxOutputLength: MAX_UNZIP });
  throw new Error('Kiểu nén của file không được hỗ trợ.');
}
function xmlDecode(x) {
  return String(x).replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(Math.min(+d, 0x10ffff)))
    .replace(/&#x([0-9a-f]+);/gi, (m, h) => String.fromCodePoint(Math.min(parseInt(h, 16), 0x10ffff)))
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
}

// Màu "đỏ": FF0000, C00000, E02020, FF3333... (R cao, G và B thấp) hoặc tên màu red/darkRed
function isRedColor(v) {
  if (!v) return false;
  const s = String(v).toLowerCase();
  if (s === 'red' || s === 'darkred') return true;
  if (!/^[0-9a-f]{6}$/.test(s)) return false;
  const r = parseInt(s.slice(0, 2), 16), g = parseInt(s.slice(2, 4), 16), b = parseInt(s.slice(4, 6), 16);
  return r >= 0xb0 && g <= 0x78 && b <= 0x78 && r - Math.max(g, b) >= 0x60;
}

// Trả về { paragraphs:[{ text, red:[bool theo từng ký tự], num:{numId,ilvl}|null }], hasImages }
function docxParagraphs(buf) {
  const z = zipEntries(buf);
  const xml = zipRead(buf, z.get('word/document.xml')).toString('utf8');
  const hasImages = /<w:drawing|<w:pict|<v:imagedata/.test(xml);
  const out = [];
  for (const pm of xml.matchAll(/<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g)) {
    const inner = pm[1];
    let text = '', red = [];
    for (const rm of inner.matchAll(/<w:r\b[^>]*>([\s\S]*?)<\/w:r>/g)) {
      const r = rm[1];
      const rpr = (r.match(/<w:rPr>([\s\S]*?)<\/w:rPr>/) || [])[1] || '';
      const col = (rpr.match(/<w:color\b[^>]*\bw:val="([^"]+)"/) || [])[1];
      const hl = (rpr.match(/<w:highlight\b[^>]*\bw:val="([^"]+)"/) || [])[1];
      const isRed = isRedColor(col) || /^(red|darkRed)$/i.test(hl || '');
      for (const tk of r.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>|<w:tab\/>|<w:br\/>/g)) {
        const piece = tk[1] !== undefined ? xmlDecode(tk[1]) : (tk[0] === '<w:tab/>' ? '\t' : ' ');
        text += piece;
        for (let i = 0; i < piece.length; i++) red.push(isRed);
      }
    }
    const np = inner.match(/<w:numPr>([\s\S]*?)<\/w:numPr>/);
    const num = np ? { ilvl: parseInt((np[1].match(/<w:ilvl\b[^>]*\bw:val="(\d+)"/) || [])[1], 10) || 0, numId: (np[1].match(/<w:numId\b[^>]*\bw:val="(\d+)"/) || [])[1] || '0' } : null;
    out.push({ text, red, num });
  }
  return { paragraphs: out, hasImages };
}

// ── Tạo file .docx đơn giản (dùng cho FILE MẪU tải về) ──
const CRC_T = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t.push(c >>> 0); } return t; })();
function crc32(buf) { let c = 0xffffffff; for (let i = 0; i < buf.length; i++) c = CRC_T[(c ^ buf[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
const xmlEsc = (x) => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// paragraphs: [ [ {t, color?, bold?}, ... ], ... ]
function buildDocx(paragraphs) {
  const body = paragraphs.map(runs => '<w:p>' + (Array.isArray(runs) ? runs : [{ t: runs }]).map(r =>
    '<w:r>' + ((r.color || r.bold) ? '<w:rPr>' + (r.bold ? '<w:b/>' : '') + (r.color ? '<w:color w:val="' + r.color + '"/>' : '') + '</w:rPr>' : '') + '<w:t xml:space="preserve">' + xmlEsc(r.t) + '</w:t></w:r>').join('') + '</w:p>').join('');
  const files = [
    ['[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'],
    ['_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'],
    ['word/document.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' + body + '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>']
  ];
  const parts = [], central = []; let off = 0;
  for (const [name, content] of files) {
    const nb = Buffer.from(name, 'utf8'), data = Buffer.from(content, 'utf8'), crc = crc32(data);
    const lh = Buffer.alloc(30); lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(0x0800, 6); lh.writeUInt16LE(0, 8); lh.writeUInt16LE(0, 10); lh.writeUInt16LE(0x21, 12);
    lh.writeUInt32LE(crc, 14); lh.writeUInt32LE(data.length, 18); lh.writeUInt32LE(data.length, 22); lh.writeUInt16LE(nb.length, 26); lh.writeUInt16LE(0, 28);
    parts.push(lh, nb, data);
    const ch = Buffer.alloc(46); ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6); ch.writeUInt16LE(0x0800, 8); ch.writeUInt16LE(0, 10); ch.writeUInt16LE(0, 12); ch.writeUInt16LE(0x21, 14);
    ch.writeUInt32LE(crc, 16); ch.writeUInt32LE(data.length, 20); ch.writeUInt32LE(data.length, 24); ch.writeUInt16LE(nb.length, 28); ch.writeUInt32LE(off, 42);
    central.push(ch, nb);
    off += 30 + nb.length + data.length;
  }
  const cdBuf = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10); end.writeUInt32LE(cdBuf.length, 12); end.writeUInt32LE(off, 16);
  return Buffer.concat([...parts, cdBuf, end]);
}

module.exports = { zipEntries, zipRead, xmlDecode, isRedColor, docxParagraphs, buildDocx };
