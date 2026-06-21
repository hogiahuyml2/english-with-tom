// Chấm bài Writing bằng AI — hỗ trợ Gemini (Google) hoặc Claude (Anthropic)
// Trả về kết quả chấm + bài viết gợi ý (suggested_writing) theo tiêu chí từng kỳ thi
const Anthropic = require('@anthropic-ai/sdk');

function provider() {
  const p = (process.env.AI_PROVIDER || '').toLowerCase();
  if (p === 'gemini' || p === 'claude') return p;
  if (process.env.GEMINI_API_KEY) return 'gemini';
  if (process.env.ANTHROPIC_API_KEY) return 'claude';
  return null;
}

function aiEnabled() {
  const p = provider();
  if (p === 'gemini') return !!process.env.GEMINI_API_KEY;
  if (p === 'claude') return !!process.env.ANTHROPIC_API_KEY;
  return false;
}

// Rubric KET (Cambridge A2 Key) — chính thức, khác nhau theo Part
function ketRubric(title) {
  if (/part\s*1/i.test(title)) {
    return `Đây là KET (A2 Key) WRITING PART 1 (email/lời nhắn ngắn, ~25 từ, đề yêu cầu 3 ý nội dung).
Chấm theo THANG ĐIỂM CHUNG (General Mark Scheme) của Cambridge — MỘT điểm duy nhất từ 0 đến 5, dựa trên mức độ truyền đạt 3 ý nội dung:
- 5: Bài làm rất tốt. Người đọc không cần cố gắng để hiểu. TẤT CẢ các ý của thông điệp được truyền đạt đầy đủ.
- 4: Bài tốt. Người đọc chỉ cần cố gắng tối thiểu. Tất cả các ý được truyền đạt.
- 3: Đạt yêu cầu. Người đọc cần cố gắng đôi chút. Tất cả các ý được truyền đạt, HOẶC thiếu một ý nhưng các ý còn lại được truyền đạt rõ ràng.
- 2: Chưa đạt. Người đọc phải cố gắng đáng kể. Thiếu ý hoặc xử lý không thành công, thông điệp chỉ truyền đạt một phần.
- 1: Kém. Người đọc phải rất cố gắng. Truyền đạt được rất ít thông điệp.
- 0: Nội dung hoàn toàn lạc đề, hoặc quá ít ngôn ngữ để đánh giá.
overall_score = điểm 0–5 này. scale_label = "A2 Key Part 1 (0–5)".
criteria gồm DUY NHẤT MỘT mục: name = "Mức độ truyền đạt thông điệp", max = 5, score = điểm trên, comment giải thích còn thiếu/đạt ý nào.
suggested_writing: Viết bài mẫu EMAIL/LỜI NHẮN ngắn TIẾNG ANH (25–35 từ) truyền đạt đầy đủ 3 ý yêu cầu của đề, đạt điểm 5.`;
  }
  return `Đây là KET (A2 Key) WRITING PART 2 (viết truyện ngắn, ~35 từ, bắt đầu bằng câu cho sẵn).
Chấm theo THANG ĐÁNH GIÁ (Assessment Scale) của Cambridge A2 với 4 tiêu chí, MỖI tiêu chí 0–5:
- "Content (Nội dung)": 5 = mọi nội dung liên quan đề; 3 = vài chỗ lạc/thiếu nhỏ; 1 = nhiều chỗ lạc; 0 = hoàn toàn lạc đề.
- "Communicative Achievement (Hiệu quả giao tiếp)": dùng đúng quy ước của dạng bài viết truyện, truyền đạt các ý đơn giản một cách phù hợp.
- "Organisation (Tổ chức)": văn bản mạch lạc, liên kết, dùng từ nối cơ bản (and, but, then, because...).
- "Language (Ngôn ngữ)": dùng từ vựng hằng ngày; cấu trúc ngữ pháp đơn giản; lỗi có thể thấy nhưng vẫn hiểu được nghĩa.
overall_score = điểm TRUNG BÌNH của 4 tiêu chí, làm tròn về 0.5 gần nhất, thang 0–5. scale_label = "A2 Key Part 2 (0–5)".
criteria gồm ĐÚNG 4 mục với name như trên (giữ song ngữ).
suggested_writing: Viết bài mẫu TRUYỆN NGẮN TIẾNG ANH (35–55 từ) bắt đầu bằng câu cho sẵn trong đề, liên tục mạch lạc, đạt điểm cao.`;
}

// Rubric riêng cho từng kỳ thi
function rubricFor(exercise) {
  const program = exercise.program;
  if (program === 'KET') return ketRubric(exercise.title || '');
  if (program === 'IELTS') return `Chấm theo thang BAND IELTS từ 0 đến 9 (bước 0.5). Dùng 4 tiêu chí (mỗi tiêu chí max 9): Task Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy. overall_score là band tổng (trung bình 4 tiêu chí, làm tròn 0.5). scale_label = "IELTS Band (0–9)".
suggested_writing: Xác định đây là Task 1 hay Task 2 dựa trên tên đề. Task 1: viết bài mẫu TIẾNG ANH 150–180 từ mô tả biểu đồ/số liệu trong đề (nếu là bar chart/line graph thì dựa vào dữ liệu mô tả trong nội dung đề). Task 2: viết bài luận TIẾNG ANH 250–280 từ đạt Band 7–8.`;
  if (program === 'PET') return `Chấm theo chuẩn Cambridge B1 Preliminary (PET). Dùng 4 tiêu chí Content, Communicative Achievement, Organisation, Language (mỗi tiêu chí max 5). overall_score là điểm trung bình 4 tiêu chí, thang 0–5. scale_label = "B1 Preliminary (0–5)".
suggested_writing: Viết bài mẫu TIẾNG ANH 80–120 từ đáp ứng đầy đủ yêu cầu đề PET, đạt điểm gần tối đa.`;
  if (program === 'FCE') return `Chấm theo chuẩn Cambridge B2 First (FCE). Dùng 4 tiêu chí Content, Communicative Achievement, Organisation, Language (mỗi tiêu chí max 5). overall_score là điểm trung bình 4 tiêu chí, thang 0–5. scale_label = "B2 First (0–5)".
suggested_writing: Viết bài mẫu TIẾNG ANH 140–190 từ (đúng dạng bài yêu cầu: essay, article, review, letter...) đạt điểm cao.`;
  if (program === 'APTIS') return `Chấm theo chuẩn APTIS General/Advanced của British Council. Dùng các tiêu chí phù hợp (Content/Task Achievement, Vocabulary, Grammar, Organisation). overall_score trên thang 0–5. scale_label = "APTIS (0–5)".
suggested_writing: Viết bài mẫu TIẾNG ANH đúng độ dài yêu cầu của component APTIS, đạt điểm cao theo rubric APTIS.`;
  return `Chấm theo thang điểm phù hợp với kỳ thi ${program}. Dùng các tiêu chí hợp lý (Content, Organisation, Language). overall_score trên thang 0–5. scale_label mô tả ngắn thang điểm.
suggested_writing: Viết bài mẫu TIẾNG ANH đạt yêu cầu đề bài và điểm cao.`;
}

function buildSystem(exercise) {
  return `Bạn là giám khảo chấm Writing giàu kinh nghiệm cho các kỳ thi tiếng Anh quốc tế.
${rubricFor(exercise)}

Quy tắc chung:
- Mọi nhận xét (comment, summary, suggestions, suggested_notes) viết bằng TIẾNG VIỆT, cụ thể, mang tính xây dựng, kèm ví dụ ngắn.
- criteria: danh sách tiêu chí, mỗi tiêu chí gồm name (song ngữ), score, max, comment.
- summary: 2–3 câu tổng quan bằng tiếng Việt.
- suggestions: 3–5 gợi ý cải thiện cụ thể bằng tiếng Việt.
- suggested_writing: BÀI MẪU HOÀN CHỈNH bằng TIẾNG ANH, đúng độ dài và format yêu cầu (xem hướng dẫn rubric ở trên). Bài mẫu phải đáp ứng đề bài cụ thể của học sinh, KHÔNG được viết generic. Phải thể hiện rõ cách đạt điểm cao theo tiêu chí của kỳ thi.
- suggested_notes: Giải thích TIẾNG VIỆT ngắn gọn (3–5 câu) vì sao bài mẫu đạt điểm cao: nêu từng tiêu chí và cách bài mẫu đáp ứng. Ví dụ: "Bài mẫu đạt Content 5/5 vì truyền đạt đủ 3 ý yêu cầu (nơi gặp, thời gian, hoạt động). Về Language, bài dùng đa dạng thì (present simple, future)..."`;
}

function buildUser(exercise, essay) {
  return `KỲ THI: ${exercise.program} — Kỹ năng: ${exercise.skill}\n` +
    `ĐỀ BÀI: ${exercise.title}\n${exercise.content || ''}\n\n` +
    `BÀI VIẾT CỦA HỌC SINH:\n"""\n${essay}\n"""`;
}

// ===== Claude (Anthropic SDK) =====
const CLAUDE_SCHEMA = {
  type: 'object',
  properties: {
    overall_score: { type: 'number' },
    scale_label: { type: 'string' },
    criteria: {
      type: 'array',
      items: {
        type: 'object',
        properties: { name: { type: 'string' }, score: { type: 'number' }, max: { type: 'number' }, comment: { type: 'string' } },
        required: ['name', 'score', 'max', 'comment'], additionalProperties: false
      }
    },
    summary: { type: 'string' },
    suggestions: { type: 'array', items: { type: 'string' } },
    suggested_writing: { type: 'string' },
    suggested_notes: { type: 'string' }
  },
  required: ['overall_score', 'scale_label', 'criteria', 'summary', 'suggestions', 'suggested_writing', 'suggested_notes'],
  additionalProperties: false
};

async function gradeWithClaude(exercise, essay) {
  const client = new Anthropic();
  const model = process.env.ANTHROPIC_MODEL || 'claude-opus-4-8';
  const resp = await client.messages.create({
    model, max_tokens: 5000, system: buildSystem(exercise),
    messages: [{ role: 'user', content: buildUser(exercise, essay) }],
    output_config: { format: { type: 'json_schema', schema: CLAUDE_SCHEMA } }
  });
  const block = resp.content.find(b => b.type === 'text');
  return JSON.parse(block.text);
}

// ===== Gemini (Google) — REST =====
const GEMINI_SCHEMA = {
  type: 'OBJECT',
  properties: {
    overall_score: { type: 'NUMBER' },
    scale_label: { type: 'STRING' },
    criteria: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: { name: { type: 'STRING' }, score: { type: 'NUMBER' }, max: { type: 'NUMBER' }, comment: { type: 'STRING' } },
        required: ['name', 'score', 'max', 'comment']
      }
    },
    summary: { type: 'STRING' },
    suggestions: { type: 'ARRAY', items: { type: 'STRING' } },
    suggested_writing: { type: 'STRING' },
    suggested_notes: { type: 'STRING' }
  },
  required: ['overall_score', 'scale_label', 'criteria', 'summary', 'suggestions', 'suggested_writing', 'suggested_notes']
};

async function gradeWithGemini(exercise, essay) {
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: buildSystem(exercise) }] },
      contents: [{ role: 'user', parts: [{ text: buildUser(exercise, essay) }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: GEMINI_SCHEMA,
        maxOutputTokens: 8000,
        thinkingConfig: { thinkingBudget: 0 }
      }
    })
  });
  if (!r.ok) throw new Error('Gemini ' + r.status + ': ' + (await r.text()));
  const data = await r.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const text = parts.map(p => p.text || '').join('');
  if (!text) throw new Error('Gemini: phản hồi rỗng (finishReason=' + (data?.candidates?.[0]?.finishReason) + ')');
  return JSON.parse(text);
}

async function gradeWriting(exercise, essay) {
  const p = provider();
  if (p === 'gemini') return gradeWithGemini(exercise, essay);
  if (p === 'claude') return gradeWithClaude(exercise, essay);
  throw new Error('Chưa cấu hình AI');
}

// ============================================================
// APTIS WRITING FULL TEST — chấm 4 components cùng lúc
// ============================================================

function buildAptisSystem() {
  return `Bạn là giám khảo chấm Writing của British Council, chuyên kỳ thi APTIS General/Advanced.
Bài thi APTIS Writing gồm 4 components với trọng số và tiêu chí riêng:

COMPONENT 1 — Câu trả lời ngắn (Personal Info, trọng số 10%)
Học sinh trả lời ngắn gọn các câu hỏi cá nhân (tên, nghề, nơi sống, sở thích...).
Tiêu chí: Phù hợp/đúng nghĩa với câu hỏi, ngữ pháp đơn giản đúng, trọn vẹn (không bỏ câu).
Thang: 0–5.

COMPONENT 2 — Điền form (Form Fill, trọng số 20%)
Học sinh viết đoạn văn 20–30 từ theo prompt cho sẵn (về chủ đề cụ thể).
Tiêu chí chính: Task Achievement (đúng yêu cầu, đủ thông tin), Vocabulary Range, Grammatical Accuracy, đúng độ dài.
Thang: 0–5.

COMPONENT 3 — Group Chat (Chat Replies, trọng số 30%)
Học sinh trả lời 3 tin nhắn trong group chat (30–40 từ/reply).
Tiêu chí chính: Relevance (phản hồi đúng với từng tin nhắn), Coherence (mạch lạc), Vocabulary, Grammar. Chú ý cả 3 reply.
Thang: 0–5 cho cả 3 reply cộng lại (đánh giá tổng thể).

COMPONENT 4 — Email Writing (Email Writing, trọng số 40%)
Task 1: Email ngắn ~50 từ (informal/semi-formal).
Task 2: Email dài 120–150 từ (semi-formal/formal).
Tiêu chí: Content & Task Achievement, Vocabulary Range, Grammatical Range & Accuracy, Organisation & Cohesion.
Thang: 0–5 (tổng hợp cả Task 1 và Task 2).

TỔNG ĐIỂM: overall_score = trung bình có trọng số (C1×10% + C2×20% + C3×30% + C4×40%), thang 0–5, làm tròn 0.5.
scale_label = "APTIS Writing (0–5)"

Quy tắc phản hồi:
- criteria: ĐÚNG 4 mục, mỗi mục là 1 component (name song ngữ Vi/En), score (0–5), max=5, comment tiếng Việt cụ thể.
- summary: 2–3 câu tổng quan bằng tiếng Việt, nêu điểm mạnh và yếu chính.
- suggestions: 4–5 gợi ý cải thiện cụ thể bằng tiếng Việt (cho từng component yếu).
- suggested_writing: Bài mẫu TIẾNG ANH cho Component 4 Task 2 (email 120–150 từ, semi-formal/formal, đáp ứng đúng đề bài cụ thể của học sinh, KHÔNG generic).
- suggested_notes: Giải thích TIẾNG VIỆT 3–5 câu vì sao bài mẫu đạt điểm cao.`;
}

function buildAptisUser(exercise, testContent, answers) {
  const p1 = testContent.part1 || {};
  const p2 = testContent.part2 || {};
  const p3 = testContent.part3 || {};
  const p4 = testContent.part4 || {};
  const qs1 = (p1.questions || []);
  const msgs3 = (p3.messages || []);

  let txt = `ĐỀ BÀI: ${exercise.title}\nChủ đề: ${testContent.theme || ''}\n\n`;

  txt += `=== COMPONENT 1 — Câu trả lời ngắn ===\n`;
  txt += `Câu ví dụ: "${p1.example_q || ''}" → "${p1.example_a || ''}"\n`;
  qs1.forEach((q, i) => {
    const a = (answers.part1 || [])[i] || '(bỏ trống)';
    txt += `Câu ${i + 1}: "${q}" → Học sinh trả lời: "${a}"\n`;
  });

  txt += `\n=== COMPONENT 2 — Điền form ===\n`;
  txt += `Ngữ cảnh: ${p2.context || ''}\n`;
  txt += `Prompt: "${p2.prompt || ''}"\nYêu cầu: ${p2.word_range || '20-30'} từ.\n`;
  txt += `Bài viết học sinh:\n"""\n${answers.part2 || '(bỏ trống)'}\n"""\n`;

  txt += `\n=== COMPONENT 3 — Group Chat ===\n`;
  txt += `${p3.context || ''}\n`;
  msgs3.forEach((m, i) => {
    const a = (answers.part3 || [])[i] || '(bỏ trống)';
    txt += `[${m.name || 'Person'}]: "${m.text}"\n  → Học sinh: "${a}"\n`;
  });

  txt += `\n=== COMPONENT 4 — Email Writing ===\n`;
  txt += `${p4.email_context || ''}\n`;
  txt += `Email nhận được:\n"""\n${p4.email_body || ''}\n"""\n`;
  const t1 = p4.task1 || {}, t2 = p4.task2 || {};
  txt += `Task 1 (${t1.word_target || '~50'} từ): ${t1.prompt || ''}\n`;
  txt += `Bài viết Task 1:\n"""\n${(answers.part4 || {}).task1 || '(bỏ trống)'}\n"""\n`;
  txt += `Task 2 (${t2.word_target || '120-150'} từ): ${t2.prompt || ''}\n`;
  txt += `Bài viết Task 2:\n"""\n${(answers.part4 || {}).task2 || '(bỏ trống)'}\n"""`;

  return txt;
}

async function gradeAptisWriting(exercise, testContent, answers) {
  const p = provider();

  const systemPrompt = buildAptisSystem();
  const userPrompt = buildAptisUser(exercise, testContent, answers);

  if (p === 'gemini') {
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: GEMINI_SCHEMA,
          maxOutputTokens: 10000,
          thinkingConfig: { thinkingBudget: 0 }
        }
      })
    });
    if (!r.ok) throw new Error('Gemini ' + r.status + ': ' + (await r.text()));
    const data = await r.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const text = parts.map(pp => pp.text || '').join('');
    if (!text) throw new Error('Gemini: phản hồi rỗng');
    return JSON.parse(text);
  }

  if (p === 'claude') {
    const client = new Anthropic();
    const model = process.env.ANTHROPIC_MODEL || 'claude-opus-4-8';
    const resp = await client.messages.create({
      model, max_tokens: 8000, system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      output_config: { format: { type: 'json_schema', schema: CLAUDE_SCHEMA } }
    });
    const block = resp.content.find(b => b.type === 'text');
    return JSON.parse(block.text);
  }

  throw new Error('Chưa cấu hình AI');
}

module.exports = { aiEnabled, gradeWriting, gradeAptisWriting, provider };
