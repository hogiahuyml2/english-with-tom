'use strict';
// Bộ máy Kiểm tra đầu vào: cấu trúc đề cố định, rút câu hỏi từ ngân hàng, chấm điểm, quy đổi CEFR, lộ trình học.
const crypto = require('crypto');

// ───────────── Cấu trúc đề (cố định cho mọi học sinh; chỉ nội dung câu hỏi thay đổi) ─────────────
const BLUEPRINT = {
  version: 1,
  sections: [
    { key: 'grammar', title: 'Ngữ pháp', icon: '🧩', minutes: 8, kind: 'single', sk: 'grammar', mcqOnly: true, picks: { A1: 4, A2: 4, B1: 4, B2: 4 },
      intro: 'Chọn đáp án đúng nhất cho chỗ trống. Các câu đi từ dễ đến khó.' },
    { key: 'vocab', title: 'Từ vựng', icon: '📖', minutes: 6, kind: 'single', sk: 'vocab', picks: { A1: 3, A2: 3, B1: 3, B2: 3 },
      intro: 'Chọn từ phù hợp nhất cho chỗ trống, hoặc tạo từ đúng từ chữ HOA cho sẵn.' },
    { key: 'reading', title: 'Đọc hiểu', icon: '👀', minutes: 19, kind: 'reading',
      parts: [{ kind: 'single', sk: 'reading', picks: { A1: 3, A2: 2 } }, { kind: 'passage', lv: 'A2' }, { kind: 'passage', lv: 'B1' }, { kind: 'passage', lv: 'B2' }],
      intro: 'Đọc thông báo ngắn và 3 bài đọc, rồi trả lời câu hỏi.' },
    { key: 'listening', title: 'Nghe hiểu', icon: '🎧', minutes: 16, kind: 'listening',
      parts: [{ kind: 'listen-single', lv: 'A1', n: 3 }, { kind: 'listen-single', lv: 'A2', n: 3 }, { kind: 'listen-single', lv: 'B1', n: 3 }, { kind: 'listen-single', lv: 'B2', n: 3 }],
      intro: 'Mỗi đoạn nghe là bản ghi gốc của kỳ thi Cambridge. Hãy bật loa hoặc đeo tai nghe trước khi bắt đầu.' },
    { key: 'writing', title: 'Viết ngắn', icon: '✍️', minutes: 12, kind: 'writing', tasks: [{ task: 1, lv: 'A2' }, { task: 2, lv: 'B1' }],
      intro: 'Viết 2 đoạn ngắn: Bài 1 (email ≥ 25 từ) và Bài 2 (bài viết khoảng 80–100 từ, không bắt buộc nhưng nên thử).' },
  ],
};
const MAX_PLAYS = 2;
const TOTAL_MINUTES = BLUEPRINT.sections.reduce((a, s) => a + s.minutes, 0);

// ───────────── Thang năng lực & quy đổi CEFR ─────────────
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
const LV_B = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };       // độ khó chuẩn của từng bậc
const SLOPE = 1.3;                                       // độ dốc đường cong chọn đúng
const CUTS = [['Pre-A1', -Infinity], ['A1', 1], ['A2', 2], ['B1', 3], ['B2', 4], ['C1', 4.75]];
const THETA_MIN = 0.4, THETA_MAX = 5.6;

function levelOf(theta) { let r = 'Pre-A1'; for (const [name, cut] of CUTS) if (theta >= cut) r = name; return r; }
function levelIdx(name) { return ['Pre-A1', 'A1', 'A2', 'B1', 'B2', 'C1'].indexOf(name); }
function score100(theta) { return Math.max(0, Math.min(100, Math.round(((theta - THETA_MIN) / (THETA_MAX - THETA_MIN)) * 100))); }
const sigmoid = (x) => 1 / (1 + Math.exp(-x));
const pCorrect = (theta, b, c) => c + (1 - c) * sigmoid(SLOPE * (theta - b));

// obs: [{ b, c, ok }] ; prior: { mean, sd } — ước lượng EAP trên lưới θ
function estimate(obs, prior) {
  const step = 0.02; let sumW = 0, sumWT = 0, sumWT2 = 0;
  for (let t = 0; t <= 6.2 + 1e-9; t += step) {
    let ll = -0.5 * ((t - prior.mean) / prior.sd) ** 2;
    for (const o of obs) { const p = pCorrect(t, o.b, o.c); ll += Math.log(o.ok ? p : 1 - p); }
    const w = Math.exp(ll); sumW += w; sumWT += w * t; sumWT2 += w * t * t;
  }
  const mean = sumWT / sumW; const sd = Math.sqrt(Math.max(0, sumWT2 / sumW - mean * mean));
  return { theta: Math.max(THETA_MIN, Math.min(THETA_MAX, mean)), sd };
}

// ───────────── Rút đề từ ngân hàng ─────────────
const rint = (n) => crypto.randomInt(0, n);
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rint(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const groupOf = (id) => /^(tb|th)-/.test(id) ? String(id) : String(id).replace(/-\d+$/, '').replace(/-(8|9|10|11|12|13)$/, '');
const words = (s) => String(s).toLowerCase().match(/[a-z']{4,}/g) || [];
function answerWord(it) { return (it.type === 'fill' ? it.accept[0] : it.opts[it.a]).toLowerCase(); }

// Chọn n mục từ pool (ưu tiên chưa làm; tránh cùng nhóm bài; tránh lộ đáp án của câu khác trong cùng đề)
function pickN(pool, n, ctx) {
  const chosen = [];
  let cand = shuffle(pool);
  cand.sort((a, b) => (ctx.seen.has(a.id) ? 1 : 0) - (ctx.seen.has(b.id) ? 1 : 0)); // chưa thấy lên trước (sort ổn định)
  const tries = [(it) => !ctx.usedGroups.has(groupOf(it.id)) && !leaks(it, ctx), (it) => !leaks(it, ctx), () => true];
  for (const ok of tries) {
    for (const it of cand) {
      if (chosen.length >= n) break;
      if (chosen.includes(it) || ctx.usedIds.has(it.id)) continue;
      if (ok(it)) { chosen.push(it); ctx.usedIds.add(it.id); ctx.usedGroups.add(groupOf(it.id)); ctx.texts.push(it); }
    }
    if (chosen.length >= n) break;
  }
  return chosen;
}
function leaks(it, ctx) {
  if (it.type !== 'mcq' && it.type !== 'fill') return false;
  const aw = answerWord(it); const myWords = new Set(words(it.text || ''));
  for (const o of ctx.texts) {
    if (o.type !== 'mcq' && o.type !== 'fill') continue;
    const ow = answerWord(o);
    if (ow.length >= 4 && words(it.text || '').includes(ow)) return true;
    if (aw.length >= 4 && words(o.text || '').includes(aw)) return true;
  }
  return false;
}

// Dựng đề cho 1 học sinh. bank: danh sách mục đang bật. seenIds: các câu học sinh đã gặp ở các lần trước.
function buildForm(bank, seenIds) {
  const seen = new Set(seenIds || []);
  const ctx = { seen, usedIds: new Set(), usedGroups: new Set(), texts: [] };
  const by = (f) => bank.filter(f);
  const sections = [];
  for (const sec of BLUEPRINT.sections) {
    const out = { key: sec.key, minutes: sec.minutes, units: [] };
    if (sec.kind === 'single') {
      for (const lv of LEVELS) {
        const n = (sec.picks || {})[lv]; if (!n) continue;
        const okType = (i) => i.type === 'mcq' || (!sec.mcqOnly && i.type === 'fill');
        const pool = by((i) => okType(i) && i.sk === sec.sk && i.lv === lv);
        let got = pickN(pool, n, ctx);
        if (got.length < n) { // thiếu câu ở bậc này → lấy bù từ bậc kề (ưu tiên bậc thấp hơn) để giữ nguyên số câu
          const alt = by((i) => okType(i) && i.sk === sec.sk && Math.abs(LV_B[i.lv] - LV_B[lv]) === 1 && !ctx.usedIds.has(i.id));
          got = got.concat(pickN(alt, n - got.length, ctx));
        }
        for (const it of got) out.units.push({ id: it.id, lv, kind: 'single' });
      }
    } else if (sec.kind === 'reading') {
      for (const part of sec.parts) {
        if (part.kind === 'single') {
          for (const lv of LEVELS) { const n = part.picks[lv]; if (!n) continue; for (const it of pickN(by((i) => i.type === 'mcq' && i.sk === 'reading' && i.lv === lv), n, ctx)) out.units.push({ id: it.id, lv, kind: 'single' }); }
        } else { for (const it of pickN(by((i) => i.type === 'passage' && i.lv === part.lv), 1, ctx)) out.units.push({ id: it.id, lv: part.lv, kind: 'passage' }); }
      }
    } else if (sec.kind === 'listening') {
      for (const part of sec.parts) {
        const pool = by((i) => i.type === 'listen' && !i.spare && i.lv === part.lv && (part.kind === 'listen-single' ? i.qs.length === 1 : i.qs.length > 1));
        for (const it of pickN(pool, part.n, ctx)) out.units.push({ id: it.id, lv: part.lv, kind: it.qs.length === 1 ? 'listen1' : 'listen' });
      }
    } else if (sec.kind === 'writing') {
      for (const t of sec.tasks) { for (const it of pickN(by((i) => i.type === 'writing' && i.task === t.task), 1, ctx)) out.units.push({ id: it.id, lv: t.lv, kind: 'writing' }); }
    }
    sections.push(out);
  }
  return { v: BLUEPRINT.version, sections };
}

// Mỗi đơn vị → danh sách câu hỏi hiển thị; hoán vị phương án ngẫu nhiên cho từng câu trắc nghiệm
function questionsOf(bankItem) {
  if (bankItem.type === 'passage' || bankItem.type === 'listen') return bankItem.qs.map((q, qi) => ({ qi, opts: q.opts.length, ans: q.a, kind: 'mcq' }));
  if (bankItem.type === 'mcq') return [{ qi: 0, opts: bankItem.opts.length, ans: bankItem.a, kind: 'mcq' }];
  if (bankItem.type === 'fill') return [{ qi: 0, kind: 'fill' }];
  return [];
}
function addPerms(form, byId) {
  for (const s of form.sections) for (const u of s.units) {
    const it = byId.get(u.id); if (!it) continue;
    // câu hỏi có hình (A/B/C nằm trong ảnh) thì giữ nguyên thứ tự
    u.perm = questionsOf(it).map((q) => (q.kind === 'mcq' ? (it.img ? Array.from({ length: q.opts }, (_, i) => i) : shuffle(Array.from({ length: q.opts }, (_, i) => i))) : null));
  }
  return form;
}

// ───────────── Chấm ─────────────
const norm = (s) => String(s || '').toLowerCase().normalize('NFKD').replace(/[‘’ʼ`]/g, "'").replace(/[^a-z' ]/g, '').replace(/\s+/g, ' ').trim();
function fillOk(it, ans) { const a = norm(ans); if (!a) return false; return it.accept.some((x) => norm(x) === a || norm(x).replace(/^'/, '') === a && norm(x).startsWith("'")); }

// answers: { [unitId]: [ chosenShownIdx | string | null, ... ] } (theo thứ tự câu trong đơn vị)
function gradeSection(secForm, answers, byId) {
  const rows = [];
  for (const u of secForm.units) {
    const it = byId.get(u.id); if (!it) continue;
    const ans = (answers && answers[u.id]) || [];
    if (it.type === 'writing') continue;
    const qs = questionsOf(it);
    qs.forEach((q, i) => {
      let ok = false, answered = false;
      if (q.kind === 'mcq') {
        const c = ans[i]; answered = Number.isInteger(c) && c >= 0 && c < q.opts;
        if (answered) ok = u.perm[i][c] === q.ans;
      } else { answered = !!norm(ans[i]); ok = answered && fillOk(it, ans[i]); }
      rows.push({ unit: u.id, i, lv: it.lv, sk: it.sk, type: q.kind === 'fill' ? 'fill' : 'mcq', c: q.kind === 'fill' ? 0.02 : 1 / q.opts, ok, answered });
    });
  }
  return rows;
}

// rows: toàn bộ câu đã chấm; writing: { level, ... } hoặc null
function summarize(rows, writing) {
  const bySkill = {};
  for (const r of rows) (bySkill[r.sk] = bySkill[r.sk] || []).push(r);
  const obsOf = (rs) => rs.map((r) => ({ b: LV_B[r.lv], c: r.c, ok: r.ok }));
  const overallObs = obsOf(rows);
  const overall = estimate(overallObs, { mean: 3, sd: 1.5 });
  const skills = {};
  for (const sk of Object.keys(bySkill)) {
    const rs = bySkill[sk]; const e = estimate(obsOf(rs), { mean: overall.theta, sd: 1.0 });
    const correct = rs.filter((r) => r.ok).length;
    const byLv = {}; for (const r of rs) { const o = (byLv[r.lv] = byLv[r.lv] || { n: 0, ok: 0 }); o.n++; if (r.ok) o.ok++; }
    skills[sk] = { theta: e.theta, sd: e.sd, level: levelOf(e.theta), score: score100(e.theta), correct, total: rs.length, pct: Math.round((correct / rs.length) * 100), byLevel: byLv };
  }
  let wTheta = null;
  if (writing && writing.level) {
    const center = { 'Pre-A1': 0.6, A1: 1.5, A2: 2.5, B1: 3.5, B2: 4.5, C1: 5.2 }[writing.level];
    if (center != null) { wTheta = center; skills.writing = { theta: center, sd: 0.7, level: writing.level, score: score100(center), correct: null, total: null, pct: null }; }
  }
  // Tổng hợp: phần trắc nghiệm 80% + viết 20% (nếu đã chấm)
  let theta = overall.theta, sd = overall.sd;
  if (wTheta != null) { theta = 0.8 * overall.theta + 0.2 * wTheta; sd = Math.sqrt(0.64 * overall.sd ** 2 + 0.04 * 0.7 ** 2); }
  let level = levelOf(theta);
  // C1 chỉ công nhận (sơ bộ) khi làm tốt các câu B2+ ; tránh đoán mò
  const hi = rows.filter((r) => r.lv === 'C1'); const b2 = rows.filter((r) => r.lv === 'B2');
  let c1note = null;
  if (level === 'C1') {
    const hiRate = hi.length ? hi.filter((r) => r.ok).length / hi.length : 0; const b2Rate = b2.length ? b2.filter((r) => r.ok).length / b2.length : 0;
    if (hiRate < 0.66 || b2Rate < 0.75) { level = 'B2'; theta = Math.min(theta, 4.74); }
    else c1note = 'Bài kiểm tra này đo chính xác đến B2; mức C1 là đánh giá sơ bộ (cần bài C1 chuyên sâu để xác nhận).';
  }
  const lo = levelOf(Math.max(THETA_MIN, theta - 1.0 * sd)), hiL = levelOf(Math.min(THETA_MAX, theta + 1.0 * sd));
  const range = lo === hiL ? lo : (levelIdx(lo) < levelIdx(hiL) ? lo + '–' + hiL : hiL + '–' + lo);
  const frac = level === 'Pre-A1' ? 0 : level === 'C1' ? 1 : theta - (CUTS.find((c) => c[0] === level)[1]);
  const pos = level === 'C1' || level === 'Pre-A1' ? '' : frac < 0.34 ? 'đầu bậc' : frac < 0.67 ? 'giữa bậc' : 'cuối bậc';
  const answered = rows.filter((r) => r.answered).length;
  return { theta, sd, level, range, score: score100(theta), position: pos, skills, c1note, objective: { total: rows.length, answered, correct: rows.filter((r) => r.ok).length }, overallTheta: overall.theta };
}

// Quy đổi tham khảo giữa CEFR và các thang khác
const EQUIV = {
  'Pre-A1': { ielts: 'dưới 2.5', vn: 'chưa đạt bậc 1', cam: 'chưa đến KET', note: 'Cần xây nền từ vựng và câu đơn giản nhất.' },
  A1: { ielts: '~2.0 – 3.0', vn: 'Bậc 1', cam: 'Pre A1 Starters / Movers', note: 'Hiểu và dùng câu rất đơn giản về bản thân và đời sống hằng ngày.' },
  A2: { ielts: '~3.0 – 3.5', vn: 'Bậc 2', cam: 'KET (A2 Key)', note: 'Giao tiếp được các tình huống quen thuộc; sẵn sàng luyện KET.' },
  B1: { ielts: '~4.0 – 5.0', vn: 'Bậc 3', cam: 'PET (B1 Preliminary)', note: 'Tự xoay xở trong hầu hết tình huống; sẵn sàng luyện PET.' },
  B2: { ielts: '~5.5 – 6.5', vn: 'Bậc 4', cam: 'FCE (B2 First)', note: 'Hiểu ý chính của văn bản phức tạp, diễn đạt trôi chảy; sẵn sàng luyện FCE hoặc IELTS 5.5–6.5.' },
  C1: { ielts: '~7.0 – 8.0', vn: 'Bậc 5', cam: 'CAE (C1 Advanced)', note: 'Sử dụng tiếng Anh linh hoạt cho học tập và công việc (đánh giá sơ bộ).' },
};
const SKILL_NAME = { grammar: 'Ngữ pháp', vocab: 'Từ vựng', reading: 'Đọc hiểu', listening: 'Nghe hiểu', writing: 'Viết' };
const SKILL_ICON = { grammar: '🧩', vocab: '📖', reading: '👀', listening: '🎧', writing: '✍️' };

// ───────────── Lộ trình ưu tiên ─────────────
const NEXT = { 'Pre-A1': 'A1', A1: 'A2', A2: 'B1', B1: 'B2', B2: 'C1', C1: 'C1' };
const PROG = { 'Pre-A1': 'ket', A1: 'ket', A2: 'ket', B1: 'pet', B2: 'fce', C1: 'fce' };
const SCHOOL = { 'Pre-A1': 'lớp 6–7', A1: 'lớp 6–7', A2: 'lớp 8–9', B1: 'lớp 10–11', B2: 'lớp 11–12', C1: 'lớp 12' };
function planFor(summary) {
  const sk = summary.skills; const level = summary.level; const target = NEXT[level]; const prog = PROG[level];
  const progName = { ket: 'KET', pet: 'PET', fce: 'FCE' }[prog];
  const ranked = Object.keys(sk).sort((a, b) => sk[a].theta - sk[b].theta);
  const weak = ranked.filter((k) => sk[k].theta <= summary.theta - 0.3).slice(0, 2);
  if (!weak.length) weak.push(ranked[0]);
  const strong = ranked.slice().reverse().filter((k) => sk[k].theta >= summary.theta + 0.3).slice(0, 2);
  const link = (skill) => {
    if (skill === 'vocab') return [{ label: 'Học & ôn từ (SRS)', href: 'word-hub.html' }, { label: 'Trò chơi từ vựng', href: 'arcade.html' }];
    if (skill === 'grammar') return [{ label: 'Ngữ pháp phổ thông (' + SCHOOL[level] + ')', href: 'school.html' }, { label: 'Luyện câu', href: 'practice.html' }];
    if (skill === 'reading') return [{ label: 'Đề Reading ' + progName, href: prog + '.html' }];
    if (skill === 'listening') return [{ label: 'Đề Listening ' + progName, href: prog + '.html' }];
    return [{ label: prog === 'ket' ? 'Luyện viết KET' : 'Ngân hàng đề viết', href: prog === 'ket' ? 'ket-writing.html?part=1' : 'exercises.html' }];
  };
  const tip = {
    vocab: { A1: 'Học 5 từ mới mỗi ngày theo chủ đề quen thuộc (gia đình, trường học, đồ ăn) và ôn bằng flashcard.', A2: 'Học theo cụm (collocation): make/do/take + danh từ; ôn từ cũ trước khi học từ mới.', B1: 'Học từ theo cụm và theo ngữ cảnh đoạn văn; ghi lại phrasal verb thường gặp.', B2: 'Tập đoán nghĩa từ ngữ cảnh, học collocation và giới từ đi kèm.', C1: 'Mở rộng từ học thuật & thành ngữ; đọc báo/blog tiếng Anh mỗi ngày.' },
    grammar: { A1: 'Nắm chắc to be, thì hiện tại đơn, mạo từ a/an/the và giới từ in/on/at.', A2: 'Ôn quá khứ đơn, hiện tại hoàn thành cơ bản, so sánh hơn/nhất và các giới từ thông dụng.', B1: 'Luyện câu điều kiện loại 1–2, câu bị động, mệnh đề quan hệ, từ nối (although, because of).', B2: 'Luyện thì hoàn thành tiếp diễn, câu điều kiện hỗn hợp, đảo ngữ, từ nối nâng cao.', C1: 'Luyện cấu trúc phức tạp: mệnh đề rút gọn, đảo ngữ, giả định.' },
    reading: { A1: 'Đọc biển báo, tin nhắn ngắn; gạch chân từ khoá rồi so với đáp án.', A2: 'Đọc bài ngắn 100–150 từ; đọc câu hỏi trước, tìm từ đồng nghĩa trong bài.', B1: 'Luyện bài dài 300 từ; đọc nhanh lấy ý chính (skim) rồi đọc kỹ đoạn chứa đáp án.', B2: 'Chú ý thái độ/ý kiến tác giả; loại trừ đáp án bằng chứng cứ trong bài.', C1: 'Đọc bài luận/báo dài; tập tóm tắt từng đoạn bằng 1 câu.' },
    listening: { A1: 'Nghe câu chậm, bắt số – ngày – tên; nghe lại và chép từng câu (dictation).', A2: 'Mỗi ngày nghe 1 đoạn hội thoại ngắn 2 lần: lần 1 nghe ý chính, lần 2 bắt chi tiết.', B1: 'Nghe phỏng vấn/độc thoại; chú ý từ nối và từ đồng nghĩa với câu hỏi.', B2: 'Luyện bắt thái độ và ý kiến người nói; nghe nhiều giọng khác nhau.', C1: 'Nghe podcast/bài giảng không phụ đề rồi tóm tắt lại.' },
    writing: { A1: 'Viết 3–4 câu giới thiệu bản thân; dùng and, but, because.', A2: 'Viết email 25–35 từ đủ 3 ý; nhớ mở đầu/kết thư và chấm câu.', B1: 'Viết bài 80–100 từ có mở – thân – kết; dùng từ nối và ví dụ.', B2: 'Viết bài 140–190 từ; đa dạng cấu trúc câu và từ vựng, đúng văn phong.', C1: 'Viết bài luận lập luận chặt chẽ, dùng từ nối tinh tế.' },
  };
  const lvKey = level === 'Pre-A1' ? 'A1' : level;
  const week = (n, focus, goal, tasks) => ({ n, focus, goal, tasks });
  const w1 = weak[0], w2 = weak[1] || ranked[1];
  const weeks = [
    week(1, SKILL_NAME[w1], 'Làm chắc kỹ năng yếu nhất', [{ text: tip[w1][lvKey], links: link(w1) }, { text: 'Mỗi ngày 20 phút, 5 ngày/tuần. Ghi lại lỗi hay sai vào sổ tay.', links: [] }]),
    week(2, SKILL_NAME[w2], 'Nâng kỹ năng thứ hai', [{ text: tip[w2][lvKey], links: link(w2) }, { text: 'Cuối tuần: ôn lại 10 câu sai ở tuần 1.', links: [] }]),
    week(3, 'Luyện tổng hợp ' + progName, 'Làm quen dạng đề', [{ text: 'Làm 1 đề Reading + 1 đề Listening ' + progName + ' có chấm tự động trên trang.', links: [{ label: 'Chương trình ' + progName, href: prog + '.html' }] }, { text: 'Luyện viết 1 bài và nộp để AI chấm.', links: link('writing') }]),
    week(4, 'Kiểm tra lại', 'Đo tiến bộ', [{ text: 'Làm lại Bài kiểm tra đầu vào sau 4 tuần để so sánh với kết quả hôm nay.', links: [{ label: 'Kiểm tra đầu vào', href: 'placement.html' }] }]),
  ];
  return { target, program: progName, weak: weak.map((k) => ({ key: k, name: SKILL_NAME[k] })), strong: strong.map((k) => ({ key: k, name: SKILL_NAME[k] })), weeks };
}

module.exports = { BLUEPRINT, MAX_PLAYS, TOTAL_MINUTES, LEVELS, LV_B, estimate, pCorrect, levelOf, score100, buildForm, addPerms, questionsOf, gradeSection, summarize, planFor, fillOk, norm, EQUIV, SKILL_NAME, SKILL_ICON, shuffle };
