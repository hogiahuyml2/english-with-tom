// Chấm bài Writing bằng AI — hỗ trợ Gemini (Google) hoặc Claude (Anthropic)
// Chọn nhà cung cấp qua biến AI_PROVIDER ('gemini' | 'claude').
// Nếu không đặt: tự ưu tiên Gemini nếu có GEMINI_API_KEY, rồi tới Claude.
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

const SYSTEM = `Bạn là giám khảo IELTS Writing giàu kinh nghiệm.
Hãy chấm bài viết của học sinh theo 4 tiêu chí chính thức của IELTS:
- Task Response (trả lời đúng yêu cầu đề)
- Coherence and Cohesion (mạch lạc, liên kết)
- Lexical Resource (vốn từ vựng)
- Grammatical Range and Accuracy (ngữ pháp)

Quy tắc:
- Điểm band từ 0 đến 9, theo bước 0.5.
- overall_band là trung bình hợp lý của 4 tiêu chí (làm tròn về 0.5 gần nhất).
- Mọi nhận xét (comment, summary, suggestions) phải viết bằng TIẾNG VIỆT, cụ thể, mang tính xây dựng, chỉ ra điểm mạnh và điểm cần cải thiện kèm ví dụ ngắn.
- summary: 2–3 câu tổng quan. suggestions: 3–5 gợi ý cải thiện cụ thể.`;

function buildUser(exercise, essay) {
  return `ĐỀ BÀI (${exercise.program} — ${exercise.skill}): ${exercise.title}\n` +
    `${exercise.content || ''}\n\n` +
    `BÀI VIẾT CỦA HỌC SINH:\n"""\n${essay}\n"""`;
}

// ===== Claude (Anthropic SDK) =====
const criterionClaude = {
  type: 'object',
  properties: { band: { type: 'number' }, comment: { type: 'string' } },
  required: ['band', 'comment'], additionalProperties: false
};
const CLAUDE_SCHEMA = {
  type: 'object',
  properties: {
    overall_band: { type: 'number' },
    task_response: criterionClaude,
    coherence_cohesion: criterionClaude,
    lexical_resource: criterionClaude,
    grammatical_range_accuracy: criterionClaude,
    summary: { type: 'string' },
    suggestions: { type: 'array', items: { type: 'string' } }
  },
  required: ['overall_band', 'task_response', 'coherence_cohesion',
    'lexical_resource', 'grammatical_range_accuracy', 'summary', 'suggestions'],
  additionalProperties: false
};

async function gradeWithClaude(exercise, essay) {
  const client = new Anthropic();
  const model = process.env.ANTHROPIC_MODEL || 'claude-opus-4-8';
  const resp = await client.messages.create({
    model, max_tokens: 2000, system: SYSTEM,
    messages: [{ role: 'user', content: buildUser(exercise, essay) }],
    output_config: { format: { type: 'json_schema', schema: CLAUDE_SCHEMA } }
  });
  const block = resp.content.find(b => b.type === 'text');
  return JSON.parse(block.text);
}

// ===== Gemini (Google) — qua REST, không cần thư viện =====
const criterionGemini = {
  type: 'OBJECT',
  properties: { band: { type: 'NUMBER' }, comment: { type: 'STRING' } },
  required: ['band', 'comment']
};
const GEMINI_SCHEMA = {
  type: 'OBJECT',
  properties: {
    overall_band: { type: 'NUMBER' },
    task_response: criterionGemini,
    coherence_cohesion: criterionGemini,
    lexical_resource: criterionGemini,
    grammatical_range_accuracy: criterionGemini,
    summary: { type: 'STRING' },
    suggestions: { type: 'ARRAY', items: { type: 'STRING' } }
  },
  required: ['overall_band', 'task_response', 'coherence_cohesion',
    'lexical_resource', 'grammatical_range_accuracy', 'summary', 'suggestions']
};

async function gradeWithGemini(exercise, essay) {
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: 'user', parts: [{ text: buildUser(exercise, essay) }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: GEMINI_SCHEMA,
        maxOutputTokens: 2000
      }
    })
  });
  if (!r.ok) throw new Error('Gemini ' + r.status + ': ' + (await r.text()));
  const data = await r.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini: phản hồi rỗng');
  return JSON.parse(text);
}

async function gradeWriting(exercise, essay) {
  const p = provider();
  if (p === 'gemini') return gradeWithGemini(exercise, essay);
  if (p === 'claude') return gradeWithClaude(exercise, essay);
  throw new Error('Chưa cấu hình AI');
}

module.exports = { aiEnabled, gradeWriting, provider };
