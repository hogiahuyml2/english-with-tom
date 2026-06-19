// Chấm bài Writing bằng AI — hỗ trợ Gemini (Google) hoặc Claude (Anthropic)
// Chấm theo đúng tiêu chí của từng kỳ thi (IELTS band, KET A2 Key, ...).
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

// Rubric riêng cho từng kỳ thi
function rubricFor(program) {
  if (program === 'IELTS') return 'Chấm theo thang BAND IELTS từ 0 đến 9 (bước 0.5). Dùng 4 tiêu chí (mỗi tiêu chí max 9): Task Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy. overall_score là band tổng (trung bình 4 tiêu chí, làm tròn 0.5). scale_label = "IELTS Band (0–9)".';
  if (program === 'KET') return 'Chấm theo chuẩn Cambridge A2 KEY (KET). Dùng 2 tiêu chí, mỗi tiêu chí max 5: "Content (Nội dung)" và "Language (Ngôn ngữ)". overall_score là TỔNG hai tiêu chí trên thang 0–10. scale_label = "A2 Key (0–10)". Đây là trình độ sơ cấp A2: hãy chấm phù hợp, động viên, ưu tiên việc trả lời đủ ý đề bài; không yêu cầu từ vựng/ngữ pháp phức tạp.';
  if (program === 'PET') return 'Chấm theo chuẩn Cambridge B1 Preliminary (PET). Dùng các tiêu chí Content, Communicative Achievement, Organisation, Language (mỗi tiêu chí max 5). overall_score trên thang 0–20 (tổng 4 tiêu chí). scale_label = "B1 Preliminary (0–20)".';
  if (program === 'FCE') return 'Chấm theo chuẩn Cambridge B2 First (FCE). Dùng các tiêu chí Content, Communicative Achievement, Organisation, Language (mỗi tiêu chí max 5). overall_score trên thang 0–20. scale_label = "B2 First (0–20)".';
  return 'Chấm theo thang điểm phù hợp với kỳ thi ' + program + '. Dùng các tiêu chí hợp lý (Content, Organisation, Language). overall_score trên thang 0–10. scale_label mô tả ngắn thang điểm.';
}

function buildSystem(program) {
  return `Bạn là giám khảo chấm Writing giàu kinh nghiệm cho các kỳ thi tiếng Anh quốc tế.
${rubricFor(program)}

Quy tắc chung:
- Mọi nhận xét (name có thể song ngữ; comment, summary, suggestions) viết bằng TIẾNG VIỆT, cụ thể, mang tính xây dựng, kèm ví dụ ngắn.
- criteria: danh sách tiêu chí, mỗi tiêu chí gồm name, score, max, comment.
- summary: 2–3 câu tổng quan. suggestions: 3–5 gợi ý cải thiện cụ thể.`;
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
    suggestions: { type: 'array', items: { type: 'string' } }
  },
  required: ['overall_score', 'scale_label', 'criteria', 'summary', 'suggestions'],
  additionalProperties: false
};

async function gradeWithClaude(exercise, essay) {
  const client = new Anthropic();
  const model = process.env.ANTHROPIC_MODEL || 'claude-opus-4-8';
  const resp = await client.messages.create({
    model, max_tokens: 2500, system: buildSystem(exercise.program),
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
    suggestions: { type: 'ARRAY', items: { type: 'STRING' } }
  },
  required: ['overall_score', 'scale_label', 'criteria', 'summary', 'suggestions']
};

async function gradeWithGemini(exercise, essay) {
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: buildSystem(exercise.program) }] },
      contents: [{ role: 'user', parts: [{ text: buildUser(exercise, essay) }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: GEMINI_SCHEMA,
        maxOutputTokens: 4000,
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

module.exports = { aiEnabled, gradeWriting, provider };
