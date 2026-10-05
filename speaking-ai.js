'use strict';
/* Chấm Speaking bằng AI (Gemini nghe trực tiếp âm thanh).
   Quy trình 3 bước, để kết quả đáng tin và không bịa:
   1) Đo khách quan từ chính file WAV (thời lượng, thời gian nói thật, số lần dừng, từ/phút).
   2) AI nghe từng đoạn: chép nguyên văn (không sửa lỗi), liệt kê lỗi kèm đoạn trích dẫn, từ phát âm chưa rõ.
      Mọi lỗi/từ AI nêu mà KHÔNG có trong bản chép sẽ bị loại bỏ.
   3) AI chấm các tiêu chí theo thang của từng kỳ thi dựa trên bản chép + số đo; điểm tổng tính bằng code. */
const fs = require('fs');
const path = require('path');
const AI = require('./ai');
const { FORMATS } = require('./speaking/bank');

/* ───────────── 1. Đo từ file WAV ───────────── */
function readWav(file) {
  const b = fs.readFileSync(file);
  if (b.length < 44 || b.toString('latin1', 0, 4) !== 'RIFF') return null;
  let off = 12, fmt = null, dataOff = 0, dataLen = 0;
  while (off + 8 <= b.length) {
    const id = b.toString('latin1', off, off + 4), len = b.readUInt32LE(off + 4);
    if (id === 'fmt ') fmt = { ch: b.readUInt16LE(off + 10), rate: b.readUInt32LE(off + 12), bits: b.readUInt16LE(off + 22) };
    else if (id === 'data') { dataOff = off + 8; dataLen = Math.min(len, b.length - dataOff); break; }
    off += 8 + len + (len & 1);
  }
  if (!fmt || !dataOff || fmt.bits !== 16 || !fmt.rate) return null;
  return { buf: b, fmt, dataOff, dataLen };
}

// Đo: thời lượng, thời gian có tiếng nói, các quãng dừng, mức âm
function measure(file) {
  const w = readWav(file); if (!w) return null;
  const { buf, fmt, dataOff, dataLen } = w, step = Math.max(1, Math.round(fmt.rate * 0.05)), bytesPer = 2 * fmt.ch;
  const n = Math.floor(dataLen / bytesPer), win = [];
  let peak = 0;
  for (let i = 0; i + step <= n; i += step) {
    let s = 0;
    for (let j = 0; j < step; j++) { const v = buf.readInt16LE(dataOff + (i + j) * bytesPer); s += v * v; const a = Math.abs(v); if (a > peak) peak = a; }
    win.push(Math.sqrt(s / step));
  }
  const dur = n / fmt.rate;
  if (!win.length) return { dur, speech: 0, peak: 0, pauses: 0, longest: 0, lead: 0, rate: fmt.rate };
  const sorted = win.slice().sort((a, b2) => a - b2), floor = sorted[Math.floor(sorted.length * 0.1)] || 0, loud = sorted[Math.floor(sorted.length * 0.9)] || 0;
  const thr = Math.max(180, Math.min(floor * 2.8, loud * 0.3)), act = win.map((x) => x > thr);
  // làm mượt: lấp các khoảng trống < 0.25s (giữa các âm tiết), bỏ tiếng động < 0.1s
  const min = 5;
  for (let i = 0; i < act.length;) { if (act[i]) { i++; continue; } let j = i; while (j < act.length && !act[j]) j++; if (i > 0 && j < act.length && j - i < min) for (let k = i; k < j; k++) act[k] = true; i = j; }
  let speech = 0, pauses = 0, longest = 0, first = -1, last = -1;
  for (let i = 0; i < act.length; i++) { if (act[i]) { speech++; if (first < 0) first = i; last = i; } }
  if (first >= 0) for (let i = first; i <= last;) { if (act[i]) { i++; continue; } let j = i; while (j <= last && !act[j]) j++; const len = (j - i) * 0.05; if (len >= 0.6) pauses++; if (len > longest) longest = len; i = j; }
  return { dur: +dur.toFixed(2), speech: +(speech * 0.05).toFixed(1), peak, pauses, longest: +longest.toFixed(1), lead: first < 0 ? dur : +(first * 0.05).toFixed(1), rate: fmt.rate };
}

/* ───────────── Tiện ích văn bản ───────────── */
const norm = (s) => String(s || '').toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
const words = (s) => norm(s).split(' ').filter(Boolean);
const FILLERS = /\b(um+|uh+|er+|erm|ah+|hmm+|mm+)\b/g;
const round5 = (x) => Math.round(x * 2) / 2;
const clampN = (x, lo, hi) => Math.max(lo, Math.min(hi, Number(x) || 0));
const str = (s, n) => String(s == null ? '' : s).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, n);

/* ───────────── Thang chấm theo kỳ thi ───────────── */
const DESC = {
  ket: {
    gv: 'Band 5: dùng tốt các cấu trúc đơn giản, từ vựng đời thường đa dạng, lỗi không cản trở. Band 3: đủ kiểm soát cấu trúc đơn giản, từ vựng phù hợp tình huống quen thuộc. Band 1: kiểm soát rất hạn chế, chủ yếu từ/cụm rời rạc.',
    pr: 'Band 5: dễ hiểu dù có giọng mẹ đẻ, trọng âm/âm cuối nhìn chung đúng. Band 3: phần lớn dễ hiểu dù đôi chỗ cần người nghe cố gắng. Band 1: nhiều lỗi khiến khó hiểu.',
    ic: 'Band 5: trả lời đúng câu hỏi, đủ ý, ít cần nhắc/lặp lại. Band 3: trả lời phù hợp nhưng đôi khi ngắn hoặc cần gợi ý. Band 1: trả lời rất hạn chế, hay sai trọng tâm câu hỏi.',
    ga: 'Mức độ hoàn thành bài ở trình độ A2 nói chung (band 3 = đạt chuẩn A2, band 5 = vượt chuẩn).',
  },
  pet: {
    gv: 'Band 5: kiểm soát tốt cấu trúc đơn giản và một phần cấu trúc phức tạp, từ vựng phù hợp theo chủ đề. Band 3: đủ kiểm soát cấu trúc đơn giản, từ vựng phù hợp tình huống quen thuộc. Band 1: kiểm soát hạn chế, từ vựng cơ bản.',
    dm: 'Band 5: nói dài (ví dụ ~1 phút) dễ dàng, liên quan chủ đề, mạch lạc, dùng từ nối. Band 3: nói được hơn một cụm đơn lẻ, nhìn chung liên quan, còn ngập ngừng/lặp. Band 1: chỉ trả lời bằng cụm ngắn.',
    pr: 'Band 5: dễ hiểu, kiểm soát tốt trọng âm từ/câu và ngữ điệu. Band 3: phần lớn dễ hiểu, đôi lỗi âm làm người nghe cố gắng. Band 1: nhiều lỗi gây khó hiểu.',
    ic: 'Band 5: phản hồi, mở rộng, giữ nhịp trao đổi, ít cần nhắc. Band 3: phản hồi phù hợp, đôi lúc cần gợi ý. Band 1: phản hồi hạn chế. (Bản tự luyện: đánh giá việc đáp đúng câu hỏi, đưa/đáp lại gợi ý, hỏi ý “bạn thi” và đi đến quyết định.)',
    ga: 'Hiệu quả giao tiếp chung ở trình độ B1 (band 3 = đạt chuẩn B1, band 5 = vượt chuẩn).',
  },
  fce: {
    gv: 'Band 5: kiểm soát tốt nhiều cấu trúc đơn giản và một số cấu trúc phức tạp, vốn từ phù hợp theo chủ đề. Band 3: đủ kiểm soát cấu trúc đơn giản và một vài cấu trúc phức tạp, từ vựng đủ để nói chủ đề quen thuộc. Band 1: chỉ kiểm soát cấu trúc đơn giản, nhiều lỗi.',
    dm: 'Band 5: nói dài ít ngắt quãng, mạch lạc, dùng đa dạng từ nối, phát triển ý tốt. Band 3: nói dài khá mạch lạc dù còn ngập ngừng, dùng từ nối cơ bản. Band 1: nói ngắt quãng, khó theo dõi.',
    pr: 'Band 5: dễ hiểu, kiểm soát tốt trọng âm và ngữ điệu, âm đúng. Band 3: phần lớn dễ hiểu, một số lỗi âm/trọng âm. Band 1: nhiều lỗi ảnh hưởng hiểu.',
    ic: 'Band 5: phản hồi tự nhiên, mở rộng, nhường lượt, đưa ý mới và hỏi ý bạn thi. Band 3: tương tác phù hợp, đôi khi cần gợi ý. Band 1: tương tác hạn chế. (Bản tự luyện: đánh giá việc đáp đúng câu hỏi, đối thoại với “bạn thi”, so sánh các gợi ý và chốt quyết định.)',
    ga: 'Hiệu quả giao tiếp chung ở trình độ B2 (band 3 = đạt chuẩn B2, band 5 = vượt chuẩn).',
  },
  aptis: 'Mỗi tiêu chí 0–5 theo năng lực quy đổi CEFR: 5 ≈ C/B2 cao, 4 ≈ B2, 3 ≈ B1, 2 ≈ A2, 1 ≈ A1, 0 = không trả lời được. Ngữ pháp: độ đa dạng + chính xác. Từ vựng: phạm vi + phù hợp. Phát âm: dễ hiểu, trọng âm, ngữ điệu. Trôi chảy: mức ngập ngừng, dừng, lặp. Mạch lạc: ý được sắp xếp và nối với nhau.',
  ielts: {
    fc: 'Band 4: nói chậm, ngừng nhiều, câu ngắn rời rạc. Band 5: nói được nhưng lặp/tự sửa/ngắt nhiều, nối ý cơ bản. Band 6: nói dài, có lúc mất mạch/ngắt, dùng từ nối chưa đa dạng. Band 7: nói dài không cần cố gắng, ít lặp, dùng từ nối đa dạng. Band 8: trôi chảy, hiếm khi ngắt trừ khi tìm từ.',
    lr: 'Band 4: từ vựng đủ cho chủ đề quen thuộc, lặp từ, lỗi chọn từ. Band 5: đủ để nói đề tài quen và một phần chủ đề lạ nhưng hay diễn đạt vòng. Band 6: đủ vốn từ để bàn luận, dù có chỗ dùng sai; diễn đạt vòng thành công. Band 7: dùng linh hoạt, có từ ít gặp/thành ngữ, ý thức về collocation. Band 8: vốn từ rộng, chính xác, hiếm lỗi.',
    gr: 'Band 4: chủ yếu câu đơn, lỗi thường xuyên. Band 5: có câu phức nhưng lỗi nhiều, hạn chế. Band 6: trộn câu đơn và câu phức, lỗi còn nhưng hiếm khi gây khó hiểu. Band 7: nhiều cấu trúc phức khá chính xác, vẫn còn lỗi. Band 8: đa số câu không lỗi, lỗi nhỏ hiếm.',
    pr: 'Band 4: một số đặc điểm phát âm đúng nhưng hay sai âm, khó hiểu. Band 5: đúng ở mức nhất định nhưng không duy trì được. Band 6: dễ hiểu nhìn chung, có lỗi đôi chỗ làm giảm độ rõ. Band 7: dùng đa dạng đặc điểm phát âm, dễ hiểu suốt bài. Band 8: dễ hiểu liên tục, lỗi nhỏ hiếm.',
  },
};
const LEVEL_NAME = { ket: 'A2 Key (KET)', pet: 'B1 Preliminary (PET)', fce: 'B2 First (FCE)', aptis: 'Aptis General', ielts: 'IELTS Speaking' };

function criteriaFor(exam) {
  const f = FORMATS[exam], c = f.criteria.slice();
  if (f.scale === 'cam5') c.push({ key: 'ga', name: 'Global Achievement', vi: 'Đánh giá chung' });
  return c;
}
const maxScore = (exam) => FORMATS[exam].scale === 'ielts' ? 9 : 5;

/* ───────────── 2. AI nghe & chép/phân tích ───────────── */
const ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    turns: { type: 'array', items: { type: 'object', properties: {
      i: { type: 'integer' },
      transcript: { type: 'string' },
      intelligible: { type: 'string', enum: ['clear', 'mostly', 'poor', 'none'] },
      on_topic: { type: 'boolean' },
      errors: { type: 'array', items: { type: 'object', properties: { said: { type: 'string' }, fix: { type: 'string' }, tip: { type: 'string' } }, required: ['said', 'fix', 'tip'] } },
      pron: { type: 'array', items: { type: 'object', properties: { word: { type: 'string' }, issue: { type: 'string' } }, required: ['word', 'issue'] } },
      good: { type: 'array', items: { type: 'string' } },
      upgrades: { type: 'array', items: { type: 'object', properties: { said: { type: 'string' }, better: { type: 'string' } }, required: ['said', 'better'] } },
      note: { type: 'string' },
    }, required: ['i', 'transcript', 'intelligible', 'on_topic', 'errors', 'pron', 'good', 'upgrades', 'note'] } },
  },
  required: ['turns'],
};

const ANALYSIS_SYSTEM = `You are a senior Cambridge/IELTS speaking examiner and phonetics-aware teacher. You will hear short audio clips recorded by a Vietnamese learner of English, each answering one examiner prompt.
For EVERY clip, in order, return one object:
- i: the turn number given in the list.
- transcript: a VERBATIM transcript of exactly what the learner said. Do NOT correct grammar, do NOT improve vocabulary, do NOT add words. Keep hesitations ("um", "uh"), repetitions and false starts. Use [unclear] for unintelligible parts. If there is no speech, return an empty string.
- intelligible: clear | mostly | poor | none (how easily a listener understands the speech).
- on_topic: whether the answer addresses the examiner's prompt.
- errors: up to 6 real language errors that are actually present in your transcript. "said" MUST be copied exactly from the transcript (a short span of 1–8 words), "fix" is the corrected version, "tip" is a short explanation IN VIETNAMESE (max 25 words).
- pron: up to 5 words that were mispronounced or unclear, only if you really heard the problem (e.g. wrong vowel, missing final consonant, wrong word stress). "word" must be a word from the transcript; "issue" in VIETNAMESE says what was heard vs. expected (include a simple IPA hint if useful). If pronunciation was fine, return [].
- good: up to 3 short phrases copied from the transcript that were well said (good grammar/vocabulary/linking).
- upgrades: up to 3 pairs {said, better}: "said" copied from the transcript, "better" a more natural or higher-level way to say the same thing at the exam level.
- note: 1–2 sentences IN VIETNAMESE about delivery (fluency, pauses, intonation, length vs. the task).
Rules: Base everything only on what you can hear. Never invent speech. If a clip is silent or only noise, return transcript "" with intelligible "none". Be accurate and fair; do not be generous.`;

function analysisUser(exam, batch) {
  const lines = batch.map((c, k) => 'Clip ' + (k + 1) + ' = turn ' + c.turn.i + ' (' + c.turn.ph + '). Examiner prompt: "' + str(c.turn.say, 500) + '"' + (c.turn.ctx ? ' [Photo content for your reference: ' + str(c.turn.ctx, 500) + ']' : '') + (c.turn.cue ? ' [Task card bullets: ' + c.turn.cue.bullets.join('; ') + ']' : '') + (c.turn.mind ? ' [Options: ' + c.turn.mind.items.join('; ') + ']' : '') + (c.turn.items && !c.turn.mind ? ' [Prompt cards: ' + c.turn.items.map((x) => x.label).join('; ') + ']' : '') + ' Target length ≈ ' + c.turn.min + '–' + c.turn.max + ' seconds. Actual length ' + c.m.dur + ' s.');
  return 'Exam: ' + LEVEL_NAME[exam] + '. The audio clips follow in this exact order:\n' + lines.join('\n') + '\nReturn JSON with one entry per clip.';
}

const MIME = { '.wav': 'audio/wav', '.mp3': 'audio/mp3', '.ogg': 'audio/ogg', '.flac': 'audio/flac', '.m4a': 'audio/aac' };

async function analyse(exam, clips) {
  // chia lô ≤ 8MB âm thanh/lần gọi (giới hạn 20MB cả yêu cầu base64)
  const batches = []; let cur = [], size = 0;
  for (const c of clips) { if (cur.length && size + c.bytes > 8 * 1024 * 1024) { batches.push(cur); cur = []; size = 0; } cur.push(c); size += c.bytes; }
  if (cur.length) batches.push(cur);
  const out = new Map();
  for (const b of batches) {
    const files = b.map((c) => ({ mime: MIME[path.extname(c.file)] || 'audio/wav', data: fs.readFileSync(c.file).toString('base64') }));
    const r = await AI.generateJSON({ system: ANALYSIS_SYSTEM, user: analysisUser(exam, b), schema: ANALYSIS_SCHEMA, maxTokens: 8192, temperature: 0.1, files, timeoutMs: 120000 });
    for (const t of (r && r.turns) || []) { if (b.some((c) => c.turn.i === t.i)) out.set(t.i, t); }
  }
  return out;
}

// Lọc kết quả AI: bỏ mọi lỗi/từ không có trong bản chép (chống bịa)
function sanitize(a, dur) {
  const tr = str(a && a.transcript, 3000), tn = ' ' + norm(tr) + ' ', tw = new Set(words(tr));
  let nw = words(tr).length;
  if (dur > 0 && nw > dur * 4.5) { nw = Math.floor(dur * 4.5); } // không ai nói quá ~270 từ/phút → nghi ngờ bản chép
  const has = (x) => { const q = norm(x); return q && tn.includes(' ' + q + ' '); };
  return {
    transcript: tr,
    intelligible: ['clear', 'mostly', 'poor', 'none'].includes(a && a.intelligible) ? a.intelligible : 'mostly',
    on_topic: a ? a.on_topic !== false : true,
    errors: ((a && a.errors) || []).filter((e) => e && has(e.said) && norm(e.fix) !== norm(e.said)).slice(0, 6).map((e) => ({ said: str(e.said, 120), fix: str(e.fix, 140), tip: str(e.tip, 220) })),
    pron: ((a && a.pron) || []).filter((p) => p && tw.has(norm(p.word).split(' ')[0])).slice(0, 5).map((p) => ({ word: str(p.word, 40), issue: str(p.issue, 220) })),
    good: ((a && a.good) || []).filter((g) => has(g)).slice(0, 3).map((g) => str(g, 120)),
    upgrades: ((a && a.upgrades) || []).filter((u) => u && has(u.said) && norm(u.better) !== norm(u.said)).slice(0, 3).map((u) => ({ said: str(u.said, 120), better: str(u.better, 160) })),
    note: str(a && a.note, 300),
    words: nw,
    fillers: (norm(tr).match(FILLERS) || []).length,
  };
}

/* ───────────── 3. Chấm tiêu chí ───────────── */
function scoreSchema(exam) {
  const keys = criteriaFor(exam).map((c) => c.key);
  return {
    type: 'object',
    properties: {
      criteria: { type: 'array', items: { type: 'object', properties: { key: { type: 'string', enum: keys }, score: { type: 'number' }, comment: { type: 'string' }, evidence: { type: 'array', items: { type: 'string' } } }, required: ['key', 'score', 'comment', 'evidence'] } },
      summary: { type: 'string' },
      strengths: { type: 'array', items: { type: 'string' } },
      priorities: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, why: { type: 'string' }, how: { type: 'string' } }, required: ['title', 'why', 'how'] } },
      plan: { type: 'array', items: { type: 'string' } },
      models: { type: 'array', items: { type: 'object', properties: { i: { type: 'integer' }, text: { type: 'string' }, why: { type: 'string' } }, required: ['i', 'text', 'why'] } },
    },
    required: ['criteria', 'summary', 'strengths', 'priorities', 'plan', 'models'],
  };
}

function scoreSystem(exam) {
  const f = FORMATS[exam], crit = criteriaFor(exam), D = DESC[exam];
  let rub;
  if (f.scale === 'cam5') rub = crit.map((c) => '- ' + c.key + ' (' + c.name + '): ' + D[c.key]).join('\n') + '\nScale: 0–5 in steps of 0.5 for every criterion. Band 3 means "meets the level" (a typical pass), band 1 = clearly below, band 5 = clearly above the level. Real candidates at this level mostly score 2–4; use the full range, do NOT inflate.';
  else if (f.scale === 'aptis') rub = D + '\nCriteria keys: ' + crit.map((c) => c.key + ' = ' + c.name).join('; ') + '. Scale: 0–5 in steps of 0.5.';
  else rub = crit.map((c) => '- ' + c.key + ' (' + c.name + '): ' + D[c.key]).join('\n') + '\nScale: IELTS band 0–9 in steps of 0.5 for each criterion. Be strict and realistic: most Vietnamese learners score 4.5–6.5; never give 7+ unless the evidence clearly shows it.';
  return `You are a certified examiner for ${LEVEL_NAME[exam]} speaking, assessing a Vietnamese learner who recorded their answers alone (a self-practice version of the real test).
Assess ONLY from the transcripts, the measured delivery data and the per-clip analysis you are given. Do not assume anything not in the data. Ground every judgement in the learner's own words.
Criteria and descriptors:
${rub}
Write all comments, the summary, strengths, priorities and plan IN VIETNAMESE, simple and encouraging but honest.
For each criterion: "score", a 1–2 sentence "comment" (Vietnamese) explaining the score, and "evidence": 1–3 SHORT quotes copied verbatim from the transcripts that justify it (English).
"summary": 3–4 sentences overall in Vietnamese.
"strengths": 2–4 specific things done well.
"priorities": exactly 3 things to improve first; each has "title" (short), "why" (what happened, with a quote if possible) and "how" (one concrete practice action).
"plan": 3–5 short actionable steps for the next week.
"models": for up to 3 turns where the learner's answer was weakest, an improved model answer ("text", English, at the level of the exam and roughly the same length as the target) and "why" (Vietnamese, what makes it better). "i" is the turn number.
If many turns have no valid response, reflect that in Discourse/Interaction/Fluency scores. If the learner answered off-topic, reduce relevance-related scores.`;
}

function fmtTurn(t, m, a) {
  return 'Turn ' + t.i + ' [' + t.ph + '] prompt: "' + str(t.say, 300) + '"\n' + (m ? '  measured: length ' + m.dur + 's, speaking time ' + m.speech + 's, pauses>0.6s: ' + m.pauses + ', longest pause ' + m.longest + 's, words ' + a.words + ', speech rate ' + (m.speech > 2 ? Math.round(a.words / m.speech * 60) : '—') + ' wpm, fillers ' + a.fillers + ', target ' + t.min + '–' + t.max + 's\n  intelligible: ' + a.intelligible + (a.on_topic ? '' : ' | OFF-TOPIC') + '\n  transcript: "' + a.transcript + '"\n  errors found: ' + (a.errors.map((e) => '"' + e.said + '"→"' + e.fix + '"').join('; ') || 'none') + '\n  pronunciation notes: ' + (a.pron.map((p) => p.word + ': ' + p.issue).join('; ') || 'none') + '\n  delivery note: ' + a.note : '  NO VALID RESPONSE (empty, silent or too short)');
}

async function score(exam, turns, ana, meas) {
  const crit = criteriaFor(exam), user = 'Learner data (' + turns.length + ' prompts):\n' + turns.map((t) => fmtTurn(t, meas.get(t.i), ana.get(t.i))).join('\n');
  const r = await AI.generateJSON({ system: scoreSystem(exam), user, schema: scoreSchema(exam), maxTokens: 8192, temperature: 0.2, timeoutMs: 90000 });
  return r;
}

/* ───────────── Quy đổi điểm tổng ───────────── */
const ieltsRound = (x) => { const w = Math.floor(x), f = x - w; return f < 0.25 ? w : f < 0.75 ? w + 0.5 : w + 1; };
const APTIS_CEFR = [[48, 'C'], [38, 'B2'], [28, 'B1'], [16, 'A2'], [4, 'A1'], [0, 'A0']];
function overall(exam, crit) {
  const f = FORMATS[exam], vals = crit.map((c) => c.score), avg = vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
  if (f.scale === 'ielts') { const b = Math.min(9, ieltsRound(avg)); return { value: b, max: 9, unit: 'Band', label: b >= 7 ? 'Band 7+ — khá/tốt' : b >= 6 ? 'Band 6–6.5 — khá' : b >= 5 ? 'Band 5–5.5 — trung bình' : 'Dưới Band 5 — cần tăng tốc', cefr: b >= 8.5 ? 'C2' : b >= 7 ? 'C1' : b >= 5.5 ? 'B2' : b >= 4 ? 'B1' : 'A2' }; }
  if (f.scale === 'aptis') { const sc = Math.round(avg / 5 * 50); const lv = APTIS_CEFR.find((x) => sc >= x[0])[1]; return { value: sc, max: 50, unit: '/50', label: 'Ước tính CEFR: ' + lv, cefr: lv }; }
  const v = Math.round(avg * 10) / 10;
  const lbl = v >= 4.5 ? 'Vượt chuẩn ' + f.level : v >= 3.5 ? 'Đạt chuẩn ' + f.level + ' — khá chắc' : v >= 2.5 ? 'Đạt chuẩn ' + f.level + ' (sát ngưỡng)' : v >= 1.5 ? 'Chưa đạt chuẩn ' + f.level : 'Còn thấp so với ' + f.level;
  return { value: v, max: 5, unit: '/5', label: lbl, cefr: f.level };
}

/* ───────────── Điều phối ───────────── */
// clips: [{ turn, file(đường dẫn tuyệt đối), bytes }]; turns: toàn bộ lượt của bài
async function gradeSession(exam, turns, clips) {
  const meas = new Map(), valid = [];
  for (const c of clips) {
    let m = null; try { m = measure(c.file); } catch (_) {}
    if (m) meas.set(c.turn.i, m);
    // hợp lệ: ≥ 1.8s và có tiếng nói thật (≥ 0.8s)
    if (m && m.dur >= 1.8 && m.speech >= 0.8) valid.push(c);
  }
  if (!valid.length) { const e = new Error('Không nghe thấy tiếng nói trong bản ghi (có thể micro bị tắt hoặc bạn chưa nói).'); e.code = 'EMPTY'; throw e; }

  const mock = AI.aiMock();
  let ana = new Map();
  if (mock) {
    for (const c of valid) { const m = meas.get(c.turn.i); ana.set(c.turn.i, { transcript: '(bản chép thử nghiệm) I think it is a good idea because I like it very much and my friends like it too', intelligible: 'mostly', on_topic: true, errors: [{ said: 'I like it very much', fix: 'I like it a lot', tip: 'Cách nói tự nhiên hơn.' }], pron: [{ word: 'think', issue: 'Âm /θ/ đọc gần như /t/ (thử nghiệm).' }], good: ['my friends like it too'], upgrades: [{ said: 'a good idea', better: 'a great idea' }], note: 'Bản chấm thử nghiệm, không phải AI thật.' }); }
  } else {
    if (AI.provider() !== 'gemini') throw new Error('Chấm giọng nói cần Gemini (AI_PROVIDER=gemini + GEMINI_API_KEY).');
    ana = await analyse(exam, valid);
  }
  const A = new Map();
  for (const t of turns) {
    const m = meas.get(t.i), raw = ana.get(t.i);
    if (raw && valid.some((c) => c.turn.i === t.i)) A.set(t.i, sanitize(raw, m ? m.dur : 0));
  }
  const crit = criteriaFor(exam), mx = maxScore(exam);
  let sc;
  if (mock) {
    const rate = valid.length / turns.length, base = Math.min(mx, (mx === 9 ? 5.5 : 3) + (rate > 0.8 ? 0.5 : -0.5));
    sc = { criteria: crit.map((c) => ({ key: c.key, score: base, comment: 'Nhận xét thử nghiệm cho tiêu chí ' + c.vi + '.', evidence: [] })), summary: 'Đây là kết quả chấm THỬ NGHIỆM (không phải AI thật).', strengths: ['Hoàn thành bài nói.'], priorities: [1, 2, 3].map((n) => ({ title: 'Ưu tiên ' + n, why: 'Thử nghiệm.', how: 'Thử nghiệm.' })), plan: ['Luyện mỗi ngày 10 phút.'], models: [] };
  } else sc = await score(exam, turns, A, meas);

  // chuẩn hoá điểm: bước 0.5, trong thang, phủ đủ tiêu chí; áp trần khi bài làm thiếu
  const got = new Map(((sc && sc.criteria) || []).map((c) => [c.key, c]));
  const completion = valid.length / turns.length;
  const totalWords = [...A.values()].reduce((s, a) => s + a.words, 0), avgWords = totalWords / Math.max(1, valid.length);
  let cap = mx;
  if (completion < 0.5) cap = mx === 9 ? 5 : 3;           // làm chưa đến nửa bài → không quá "đạt chuẩn"
  if (avgWords < 5 && exam !== 'aptis') cap = Math.min(cap, mx === 9 ? 4 : 2); // chỉ trả lời 1–4 từ mỗi câu
  if (!got.size) throw new Error('AI không trả về điểm tiêu chí');
  const present = [...got.values()].map((g) => clampN(g.score, 0, mx)), meanPresent = present.reduce((a, b) => a + b, 0) / present.length;
  const criteria = crit.map((c) => {
    const g = got.get(c.key) || { score: meanPresent };
    let s = round5(clampN(g.score, 0, mx)); if (s > cap) s = cap;
    return { key: c.key, name: c.name, vi: c.vi, score: s, max: mx, comment: str(g.comment, 500), evidence: ((g.evidence) || []).filter((q) => q && words(q).length && [...A.values()].some((a) => (' ' + norm(a.transcript) + ' ').includes(' ' + norm(q) + ' '))).slice(0, 3).map((q) => str(q, 140)) };
  });
  const ov = overall(exam, criteria);

  const turnsOut = turns.map((t) => {
    const a = A.get(t.i), m = meas.get(t.i);
    const mo = (sc.models || []).find((x) => x && x.i === t.i);
    return { i: t.i, ok: !!a, dur: m ? m.dur : 0, speech: m ? m.speech : 0, pauses: m ? m.pauses : 0, longest: m ? m.longest : 0, wpm: a && m && m.speech > 2 ? Math.round(a.words / m.speech * 60) : null,
      ...(a || { transcript: '', intelligible: 'none', on_topic: false, errors: [], pron: [], good: [], upgrades: [], note: '', words: 0, fillers: 0 }),
      model: mo ? { text: str(mo.text, 900), why: str(mo.why, 300) } : null };
  });
  const sum = (k) => turnsOut.reduce((s, t) => s + (t[k] || 0), 0);
  const speechSec = turnsOut.reduce((s, t) => s + (t.speech || 0), 0);
  return {
    exam, overall: ov, criteria, completion: +completion.toFixed(2),
    stats: { turns: turns.length, answered: valid.length, words: sum('words'), fillers: sum('fillers'), speech_sec: +speechSec.toFixed(0), wpm: speechSec > 5 ? Math.round(sum('words') / speechSec * 60) : null, longest_pause: Math.max(0, ...turnsOut.map((t) => t.longest || 0)) },
    summary: str(sc.summary, 900), strengths: (sc.strengths || []).slice(0, 5).map((x) => str(x, 240)),
    priorities: (sc.priorities || []).slice(0, 3).map((p) => ({ title: str(p.title, 100), why: str(p.why, 400), how: str(p.how, 400) })),
    plan: (sc.plan || []).slice(0, 6).map((x) => str(x, 240)),
    turns: turnsOut, ai: { mock, provider: mock ? 'mock' : AI.provider(), model: process.env.GEMINI_MODEL || 'gemini-2.5-flash' },
  };
}

module.exports = { gradeSession, measure, criteriaFor, overall, norm, words };
