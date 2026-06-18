// Chấm bài Writing bằng Claude (Anthropic) — theo thang band IELTS
const Anthropic = require('@anthropic-ai/sdk');

function aiEnabled() { return !!process.env.ANTHROPIC_API_KEY; }

// Model mặc định Opus 4.8 (tốt nhất). Đổi qua biến ANTHROPIC_MODEL để tiết kiệm chi phí.
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-4-8';

// Một tiêu chí chấm: band (0–9, bước 0.5) + nhận xét tiếng Việt
const criterion = {
  type: 'object',
  properties: {
    band: { type: 'number' },
    comment: { type: 'string' }
  },
  required: ['band', 'comment'],
  additionalProperties: false
};

const SCHEMA = {
  type: 'object',
  properties: {
    overall_band: { type: 'number' },
    task_response: criterion,
    coherence_cohesion: criterion,
    lexical_resource: criterion,
    grammatical_range_accuracy: criterion,
    summary: { type: 'string' },
    suggestions: { type: 'array', items: { type: 'string' } }
  },
  required: ['overall_band', 'task_response', 'coherence_cohesion',
    'lexical_resource', 'grammatical_range_accuracy', 'summary', 'suggestions'],
  additionalProperties: false
};

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

async function gradeWriting(exercise, essay) {
  const client = new Anthropic(); // tự đọc ANTHROPIC_API_KEY từ môi trường
  const user =
    `ĐỀ BÀI (${exercise.program} — ${exercise.skill}): ${exercise.title}\n` +
    `${exercise.content || ''}\n\n` +
    `BÀI VIẾT CỦA HỌC SINH:\n"""\n${essay}\n"""`;

  const resp = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: SYSTEM,
    messages: [{ role: 'user', content: user }],
    output_config: { format: { type: 'json_schema', schema: SCHEMA } }
  });

  const textBlock = resp.content.find(b => b.type === 'text');
  return JSON.parse(textBlock.text);
}

module.exports = { aiEnabled, gradeWriting, MODEL };
