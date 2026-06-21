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

// Rubric KET — bám sát 100% Cambridge A2 Key for Schools Teacher Guide (UCLES 2020)
// Cả Part 1 (email) lẫn Part 2 (story) đều dùng CÙNG 3 tiêu chí: Content, Organisation, Language
// KET KHÔNG có tiêu chí "Communicative Achievement" (chỉ FCE/PET mới có)
function ketRubric(title) {
  const isPart1 = /part\s*1/i.test(title);

  const partIntro = isPart1
    ? `KET (A2 Key) WRITING PART 1 — Email/lời nhắn ngắn (tối thiểu 25 từ).
Đề bài yêu cầu học sinh đề cập ĐỦ 3 Ý cụ thể (bullet points).

BẮT BUỘC trước khi chấm:
1. Đọc kỹ đề, xác định CHÍNH XÁC 3 ý (bullet points) được yêu cầu.
2. Kiểm tra từng ý — học sinh có đề cập không, có rõ ràng không.
3. Content bị hạ điểm nếu thiếu ý hoặc thêm nội dung không liên quan.
4. Organisation: kiểm tra có greeting (Hi/Dear...) và sign-off (Bye/Best wishes...) không — đây là yếu tố tổ chức đặc thù của email.`
    : `KET (A2 Key) WRITING PART 2 — Viết truyện ngắn (tối thiểu 35 từ) dựa theo 3 tranh cho sẵn.

BẮT BUỘC trước khi chấm:
1. Đọc kỹ mô tả tranh trong đề (và hình ảnh nếu có).
2. Kiểm tra học sinh có đề cập ĐỦ CẢ 3 tình huống/bức tranh không — thiếu tranh nào thì hạ Content.
3. Bài phải là CÂU CHUYỆN CÓ TÌNH TIẾT, không phải mô tả rời rạc.
4. Thường bắt đầu bằng câu mở đầu cho sẵn (nếu đề cung cấp) — kiểm tra học sinh có dùng không.`;

  return `${partIntro}

Chấm theo THANG ĐÁNH GIÁ CHÍNH THỨC Cambridge A2 Key for Schools — ĐÚNG 3 TIÊU CHÍ (mỗi tiêu chí 0–5):

═══ CONTENT (Nội dung) ═══
• Band 5: Toàn bộ nội dung liên quan đề. Target reader được thông tin ĐẦY ĐỦ.
• Band 4: Chia sẻ đặc điểm Band 3 và Band 5 — hầu hết ý có mặt, 1 ý chưa hoàn toàn rõ ràng.
• Band 3: Có thể có thiếu sót/không liên quan NHỎ. Target reader NHÌN CHUNG được thông tin.
• Band 2: Chia sẻ đặc điểm Band 1 và Band 3 — thiếu nhiều, thông tin chỉ một phần.
• Band 1: Có nội dung không liên quan và hiểu sai đề. Target reader chỉ được thông tin TỐI THIỂU.
• Band 0: Nội dung HOÀN TOÀN không liên quan. Target reader không được thông tin.
⚠️ KHÔNG trừ điểm Content vì lỗi ngôn ngữ hay tổ chức. Ba tiêu chí hoàn toàn ĐỘC LẬP với nhau.
Ví dụ thực tế từ Cambridge: học sinh viết đủ 2/3 ý rõ ràng, ý thứ 3 bị lỗi ngôn ngữ che khuất → Content 4 (không phải 3).

═══ ORGANISATION (Tổ chức) ═══
• Band 5: Văn bản mạch lạc, liên kết chặt. Dùng linking words cơ bản VÀ một số cohesive devices: đại từ (we/they/them tránh lặp), trình tự thời gian (Last Saturday... First... then... When... Then...), mệnh đề quan hệ.
• Band 4: Chia sẻ đặc điểm Band 3 và Band 5.
• Band 3: Văn bản liên kết bằng linking words phổ biến (and, so, because, but, first of all, then...).
• Band 2: Chia sẻ đặc điểm Band 1 và Band 3.
• Band 1: Văn bản gần như không liên kết; đôi khi có dấu câu hoặc 'and' đơn lẻ.
• Band 0: Dưới mức Band 1.
⚠️ KHÔNG trừ điểm Organisation vì lỗi ngôn ngữ — chỉ đánh giá sự liên kết và tổ chức ý.

═══ LANGUAGE (Ngôn ngữ) ═══
• Band 5: Từ vựng hằng ngày phù hợp ngữ cảnh (đôi khi dùng lặp). Ngữ pháp đơn giản với mức kiểm soát TỐT. Lỗi có thể nhận thấy nhưng NGHĨA VẪN HIỂU ĐƯỢC.
• Band 4: Chia sẻ đặc điểm Band 3 và Band 5.
• Band 3: Từ vựng cơ bản dùng tương đối phù hợp. Ngữ pháp đơn giản với MỘT MỨC ĐỘ kiểm soát nhất định. Lỗi đôi khi CẢN TRỞ nghĩa.
• Band 2: Chia sẻ đặc điểm Band 1 và Band 3.
• Band 1: Chỉ có từ vựng/cụm từ rời rạc. Cấu trúc ngữ pháp đơn giản với kiểm soát rất hạn chế.
• Band 0: Dưới mức Band 1.
⚠️ Cấp độ A2: KHÔNG kỳ vọng ngôn ngữ hoàn hảo. Lỗi chính tả/ngữ pháp nhỏ mà nghĩa VẪN HIỂU được thì KHÔNG làm hạ Band Language xuống dưới 5. Chỉ hạ điểm Language khi lỗi THỰC SỰ cản trở hiểu nghĩa.

overall_score = MEAN 3 tiêu chí, làm tròn về 0.5 gần nhất, thang 0–5. scale_label = "A2 Key (0–5)".
criteria gồm ĐÚNG 3 mục: "Content (Nội dung)", "Organisation (Tổ chức)", "Language (Ngôn ngữ)". Mỗi mục có max=5.

${isPart1
    ? 'suggested_writing: Viết EMAIL TIẾNG ANH 25–40 từ: có greeting phù hợp, đề cập ĐỦ CẢ 3 ý yêu cầu (mỗi ý 1–2 câu ngắn tự nhiên), có sign-off. Dùng từ vựng A2 tự nhiên, đúng format email thân mật. Bám sát ĐÚNG nội dung 3 ý của đề — không thêm thông tin ngoài phạm vi.'
    : 'suggested_writing: Viết CÂU CHUYỆN TIẾNG ANH 35–55 từ: bắt đầu bằng câu mở đầu cho sẵn (nếu có), đề cập ĐỦ CẢ 3 tranh/tình huống theo đúng thứ tự, dùng linking words tự nhiên (Last Saturday... First... then... When... Suddenly...), dùng thì quá khứ đơn là chủ yếu, kết thúc tự nhiên.'}`;
}

// Rubric FCE — bám sát Assessment Scale chính thức Cambridge B2 First
function fceRubric(title) {
  const isPart1 = /part\s*1/i.test(title);
  const taskHint = isPart1
    ? `FCE Part 1 — ESSAY nghị luận BẮT BUỘC (140–190 từ).

══ YÊU CẦU ĐẶC THÙ FCE PART 1 ══
Đề bài FCE Part 1 luôn có cấu trúc: câu hỏi/tình huống + HAI NOTES cho sẵn (bullet points) mà học sinh BẮT BUỘC phải thảo luận. Ngoài ra, học sinh phải tự thêm MỘT ĐIỂM thứ ba của riêng mình.
Bước 1: ĐỌC KỸ đề để xác định CHÍNH XÁC 2 notes được liệt kê.
Bước 2: Kiểm tra học sinh có (a) thảo luận ĐỦ CẢ 2 notes, (b) thêm 1 điểm riêng không.
Bước 3: Content bị hạ điểm nếu thiếu bất kỳ note bắt buộc nào.`
    : 'FCE Part 2 — Học sinh chọn một dạng bài (article, review, story, letter, report...). Xác định đúng dạng bài từ đề rồi chấm đúng quy ước dạng bài đó.';

  return `${taskHint}

Chấm theo THANG ĐÁNH GIÁ CHÍNH THỨC Cambridge B2 First với 4 tiêu chí, MỖI tiêu chí 0–5.
Band chẵn (2, 4) chia sẻ đặc điểm của 2 band lẻ liền kề — KHÔNG phải điểm trung bình; đó là mức thực hiện "ở giữa" 2 band đó.

═══ CONTENT (Nội dung) ═══
• Band 5: Toàn bộ nội dung liên quan nhiệm vụ. Người đọc được thông tin ĐẦY ĐỦ.
• Band 3: Có thể có một số điểm không liên quan hoặc bỏ sót NHỎ. Người đọc NHÌN CHUNG được thông tin.
• Band 1: Có thể có nội dung không liên quan và hiểu sai nhiệm vụ. Người đọc chỉ được thông tin TỐI THIỂU.
• Band 0: Nội dung HOÀN TOÀN không liên quan. Người đọc không được thông tin.
⚠️ KHÔNG trừ điểm Content vì lý do Language hay Organisation. CHỈ trừ khi thực sự thiếu/sai yêu cầu nội dung đề.

═══ COMMUNICATIVE ACHIEVEMENT (Hiệu quả giao tiếp) ═══
• Band 5: Dùng đúng quy ước dạng bài MỘT CÁCH HIỆU QUẢ để thu hút người đọc và truyền đạt ý đơn giản LẪN phức tạp phù hợp.
• Band 3: Dùng đúng quy ước dạng bài để thu hút và truyền đạt ý ĐƠN GIẢN.
• Band 1: Dùng quy ước dạng bài theo cách NHÌN CHUNG PHÙ HỢP để truyền đạt ý đơn giản.
• Band 0: Dưới mức Band 1.
⚠️ Đánh giá đúng quy ước của dạng bài cụ thể: essay → thesis+argument structure; article → engaging opener+title; review → evaluation+recommendation; letter → register phù hợp+opening/closing.

═══ ORGANISATION (Tổ chức) ═══
• Band 5: Văn bản được tổ chức TỐT VÀ MẠCH LẠC, dùng ĐA DẠNG cohesive devices và mô hình tổ chức có hiệu quả.
• Band 3: Văn bản NHÌN CHUNG tổ chức tốt và mạch lạc, dùng đa dạng linking words và cohesive devices.
• Band 1: Văn bản kết nối và mạch lạc, dùng linking words CƠ BẢN và SỐ LƯỢNG HẠN CHẾ cohesive devices.
• Band 0: Dưới mức Band 1.
⚠️ Bài có cấu trúc đoạn rõ ràng + linking words đa dạng xứng đáng ít nhất Band 3. KHÔNG trừ điểm vì "thiếu phức tạp" nếu bài mạch lạc.

═══ LANGUAGE (Ngôn ngữ) ═══
• Band 5: Dùng đa dạng từ vựng kể cả LESS COMMON LEXIS phù hợp. Dùng đa dạng cấu trúc ngữ pháp đơn giản VÀ phức tạp với sự kiểm soát VÀ LINH HOẠT. CÓ THỂ có lỗi nhỏ nhưng KHÔNG cản trở giao tiếp.
• Band 3: Dùng đa dạng từ vựng hàng ngày phù hợp, đôi khi dùng không đúng less common lexis. Dùng đa dạng cấu trúc đơn giản và MỘT SỐ phức tạp với degree of control tốt. LỖI KHÔNG cản trở giao tiếp.
• Band 1: Dùng từ vựng hàng ngày nhìn chung phù hợp, đôi khi LẶP LẠI một số từ. Dùng ngữ pháp đơn giản với degree of control tốt. Lỗi RÕ RÀNG nhưng VẪN XÁC ĐỊNH được nghĩa.
• Band 0: Dưới mức Band 1.
⚠️ KHÔNG trừ điểm Language chỉ vì "có thể dùng từ phức tạp hơn" — nếu từ đang dùng đúng và phù hợp thì giữ điểm. CHỈ hạ điểm khi lỗi thực sự cản trở hiểu nghĩa HOẶC từ vựng/ngữ pháp quá đơn điệu.

overall_score = MEAN của 4 tiêu chí (Content + Comm.Ach. + Organisation + Language) / 4, làm tròn đến 0.5 gần nhất, thang 0–5.
scale_label = "B2 First (0–5)"

suggested_writing: Viết bài mẫu TIẾNG ANH 140–190 từ, đúng dạng bài của ĐỀ NÀY.
${isPart1
  ? 'BẮT BUỘC với Part 1: (a) Đọc kỹ đề, xác định chính xác 2 notes cho sẵn. (b) Thảo luận ĐẦY ĐỦ cả 2 notes đó trong bài mẫu, mỗi note thành 1 đoạn thân bài riêng. (c) Thêm 1 điểm thứ ba của riêng mình (clearly labelled). (d) Dùng đúng format essay, có introduction và conclusion. KHÔNG bịa notes ngoài những gì đề yêu cầu.'
  : 'Bài mẫu phải: (a) đáp ứng đúng yêu cầu cụ thể của đề, (b) dùng đúng format/quy ước của dạng bài, (c) thể hiện less common lexis và cấu trúc đa dạng, (d) đạt Band 4–5 trên cả 4 tiêu chí.'}`;
}

// Rubric PET — phân biệt Part 1 (notes bắt buộc) và Part 2 (tự do sáng tạo)
function petRubric(title) {
  if (/part\s*1/i.test(title)) {
    return `PET (B1 Preliminary) WRITING PART 1 — Email/thư (~100 từ).

══ YÊU CẦU ĐẶC THÙ PART 1 ══
Đề bài LUÔN cung cấp các NOTES (gạch đầu dòng / bullet points) mà học sinh BẮT BUỘC phải đề cập ĐẦY ĐỦ.
Bước 1: ĐỌC KỸ nội dung đề để xác định CHÍNH XÁC từng note được liệt kê.
Bước 2: Kiểm tra học sinh có bao quát ĐỦ TẤT CẢ các notes đó không.
Bước 3: Chỉ cho điểm Content cao nếu ĐẦY ĐỦ notes — thiếu note nào thì trừ Content tương ứng.

Chấm theo 4 tiêu chí Cambridge (mỗi tiêu chí max 5):
• Content: Band 5 = đề cập đủ và rõ ràng TẤT CẢ notes. Band 3 = đề cập hầu hết, thiếu chi tiết nhỏ. Band 1 = thiếu nhiều notes. Band 0 = không liên quan đề.
• Communicative Achievement: đúng format email/thư, register phù hợp (informal nếu viết cho bạn, semi-formal nếu viết cho người lớn hơn/không quen), có mở/kết bài đúng quy ước.
• Organisation: cấu trúc rõ ràng, linking words phù hợp, chuyển ý mượt.
• Language: từ vựng đa dạng B1, cấu trúc ngữ pháp đúng, lỗi không cản trở hiểu nghĩa.
overall_score = MEAN 4 tiêu chí, làm tròn 0.5, thang 0–5. scale_label = "B1 Preliminary Part 1 (0–5)".

suggested_writing: Viết bài mẫu EMAIL/THƯ TIẾNG ANH ~100 từ.
BẮT BUỘC: (a) Đọc kỹ đề và xác định TẤT CẢ các notes được liệt kê. (b) Đề cập ĐẦY ĐỦ từng note theo đúng thứ tự, triển khai mỗi note thành 1–2 câu tự nhiên. (c) Dùng đúng format và register. (d) KHÔNG bịa thêm nội dung ngoài phạm vi notes của đề.`;
  }

  return `PET (B1 Preliminary) WRITING PART 2 — Article / câu chuyện / review (~100 từ).
Chấm theo 4 tiêu chí Content, Communicative Achievement, Organisation, Language (mỗi tiêu chí max 5). overall_score = MEAN 4 tiêu chí, thang 0–5. scale_label = "B1 Preliminary Part 2 (0–5)".
suggested_writing: Viết bài mẫu TIẾNG ANH ~100 từ đúng dạng bài yêu cầu (article/story/review), đáp ứng đúng đề bài, đạt điểm cao.`;
}

// Rubric riêng cho từng kỳ thi
function rubricFor(exercise) {
  const program = exercise.program;
  if (program === 'KET') return ketRubric(exercise.title || '');
  if (program === 'FCE') return fceRubric(exercise.title || '');
  if (program === 'PET') return petRubric(exercise.title || '');
  if (program === 'IELTS') return `Chấm theo thang BAND IELTS từ 0 đến 9 (bước 0.5). Dùng 4 tiêu chí (mỗi tiêu chí max 9): Task Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy. overall_score là band tổng (trung bình 4 tiêu chí, làm tròn 0.5). scale_label = "IELTS Band (0–9)".
suggested_writing: Xác định đây là Task 1 hay Task 2 dựa trên tên đề. Task 1: viết bài mẫu TIẾNG ANH 150–180 từ mô tả biểu đồ/số liệu trong đề (dựa vào dữ liệu thực trong nội dung đề và hình ảnh nếu có). Task 2: viết bài luận TIẾNG ANH 250–280 từ đạt Band 7–8.`;
  if (program === 'APTIS') return `Chấm theo chuẩn APTIS General/Advanced của British Council. Dùng các tiêu chí phù hợp (Content/Task Achievement, Vocabulary, Grammar, Organisation). overall_score trên thang 0–5. scale_label = "APTIS (0–5)".
suggested_writing: Viết bài mẫu TIẾNG ANH đúng độ dài yêu cầu của component APTIS, đạt điểm cao theo rubric APTIS.`;
  return `Chấm theo thang điểm phù hợp với kỳ thi ${program}. Dùng các tiêu chí hợp lý (Content, Organisation, Language). overall_score trên thang 0–5. scale_label mô tả ngắn thang điểm.
suggested_writing: Viết bài mẫu TIẾNG ANH đáp ứng đúng yêu cầu đề và đạt điểm cao.`;
}

// Fetch image from URL → base64 (dùng chung cho cả grading và hints)
async function fetchImageBase64(url) {
  if (!url) return null;
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    const buf  = await r.arrayBuffer();
    const mime = (r.headers.get('content-type') || 'image/jpeg').split(';')[0].trim();
    return { base64: Buffer.from(buf).toString('base64'), mimeType: mime };
  } catch (e) {
    console.warn('fetchImageBase64 failed:', e.message);
    return null;
  }
}

function buildSystem(exercise) {
  const hasImage = !!exercise.image_url;
  return `Bạn là giám khảo chấm Writing giàu kinh nghiệm cho các kỳ thi tiếng Anh quốc tế.
${rubricFor(exercise)}
${hasImage ? '\nĐề bài này có kèm HÌNH ẢNH. Hãy phân tích kỹ nội dung hình (biểu đồ, bản đồ, tranh, sơ đồ...) cùng với phần text để chấm bài chính xác — đặc biệt khi đánh giá Content.' : ''}

BƯỚC BẮT BUỘC TRƯỚC KHI CHẤM:
1. Đọc toàn bộ đề bài (text + hình nếu có).
2. Xác định xem đề có NOTES/BULLET POINTS bắt buộc không (thường xuất hiện ở PET Part 1, FCE Part 1). Nếu có, liệt kê ra trong đầu từng note một.
3. Khi chấm Content: kiểm tra từng note xem học sinh có đề cập không — thiếu note nào thì phải phản ánh trong điểm và comment.
4. Khi viết suggested_writing: nếu đề có notes bắt buộc, bài mẫu PHẢI đề cập ĐẦY ĐỦ TỪNG NOTE — không được bỏ sót hay tự sáng tạo nội dung ngoài phạm vi notes.

Quy tắc chung:
- Mọi nhận xét (comment, summary, suggestions, suggested_notes) viết bằng TIẾNG VIỆT, cụ thể, mang tính xây dựng, kèm ví dụ ngắn.
- criteria: danh sách tiêu chí, mỗi tiêu chí gồm name (song ngữ), score, max, comment.
- summary: 2–3 câu tổng quan bằng tiếng Việt.
- suggestions: 3–5 gợi ý cải thiện cụ thể bằng tiếng Việt.
- suggested_writing: BÀI MẪU HOÀN CHỈNH bằng TIẾNG ANH, đúng độ dài và format yêu cầu. Bám sát yêu cầu đề (notes nếu có, số liệu hình nếu có), KHÔNG viết generic.
- suggested_notes: Giải thích TIẾNG VIỆT ngắn gọn (3–5 câu) vì sao bài mẫu đạt điểm cao — nêu cụ thể bài mẫu đã đề cập những notes/điểm nào của đề.`;
}

function buildUserText(exercise, essay) {
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

async function gradeWithClaude(exercise, essay, imageData) {
  const client = new Anthropic();
  const model  = process.env.ANTHROPIC_MODEL || 'claude-opus-4-8';
  const contentParts = [];
  if (imageData) {
    contentParts.push({ type: 'image', source: { type: 'base64', media_type: imageData.mimeType, data: imageData.base64 } });
  }
  contentParts.push({ type: 'text', text: buildUserText(exercise, essay) });
  const resp = await client.messages.create({
    model, max_tokens: 5000, system: buildSystem(exercise),
    messages: [{ role: 'user', content: contentParts }],
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

async function gradeWithGemini(exercise, essay, imageData) {
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const url   = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const parts = [];
  if (imageData) {
    parts.push({ inline_data: { mime_type: imageData.mimeType, data: imageData.base64 } });
  }
  parts.push({ text: buildUserText(exercise, essay) });
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: buildSystem(exercise) }] },
      contents: [{ role: 'user', parts }],
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
  const resParts = data?.candidates?.[0]?.content?.parts || [];
  const text = resParts.map(p => p.text || '').join('');
  if (!text) throw new Error('Gemini: phản hồi rỗng (finishReason=' + (data?.candidates?.[0]?.finishReason) + ')');
  return JSON.parse(text);
}

async function gradeWriting(exercise, essay) {
  const p         = provider();
  const imageData = await fetchImageBase64(exercise.image_url);
  if (p === 'gemini') return gradeWithGemini(exercise, essay, imageData);
  if (p === 'claude') return gradeWithClaude(exercise, essay, imageData);
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

// ============================================================
// WRITING HINTS — gợi ý làm bài theo đề cụ thể
// ============================================================

const HINTS_CLAUDE_SCHEMA = {
  type: 'object',
  properties: {
    task_type:      { type: 'string' },
    outline:        { type: 'string' },
    key_vocabulary: { type: 'array', items: { type: 'string' } },
    useful_phrases: { type: 'array', items: { type: 'string' } },
    criteria_tips:  { type: 'array', items: { type: 'string' } },
    dos_and_donts:  { type: 'array', items: { type: 'string' } },
    time_guide:     { type: 'string' }
  },
  required: ['task_type','outline','key_vocabulary','useful_phrases','criteria_tips','dos_and_donts','time_guide'],
  additionalProperties: false
};

const HINTS_GEMINI_SCHEMA = {
  type: 'OBJECT',
  properties: {
    task_type:      { type: 'STRING' },
    outline:        { type: 'STRING' },
    key_vocabulary: { type: 'ARRAY', items: { type: 'STRING' } },
    useful_phrases: { type: 'ARRAY', items: { type: 'STRING' } },
    criteria_tips:  { type: 'ARRAY', items: { type: 'STRING' } },
    dos_and_donts:  { type: 'ARRAY', items: { type: 'STRING' } },
    time_guide:     { type: 'STRING' }
  },
  required: ['task_type','outline','key_vocabulary','useful_phrases','criteria_tips','dos_and_donts','time_guide']
};

function buildHintsSystem(exercise) {
  const hasImage = !!exercise.image_url;
  return `Bạn là giáo viên luyện thi ${exercise.program} giàu kinh nghiệm. Hãy tạo GỢI Ý LÀM BÀI cụ thể và chính xác nhất cho đề bài này.
${hasImage ? 'Đề bài có kèm HÌNH ẢNH — đọc kỹ hình (biểu đồ, bản đồ, tranh, dữ liệu...) và đưa ra gợi ý DỰA TRÊN NỘI DUNG THỰC TẾ CỦA HÌNH.' : ''}

═══ QUY TRÌNH BẮT BUỘC TRƯỚC KHI TẠO GỢI Ý ═══
1. Đọc toàn bộ đề bài (text + hình nếu có).
2. Xác định: đề có NOTES/BULLET POINTS bắt buộc không?
   • Nếu CÓ (PET Part 1, FCE Part 1): liệt kê ra từng note — outline PHẢI xây dựng quanh từng note đó, không được tự thêm/bỏ.
   • Nếu KHÔNG: dàn bài theo cấu trúc phù hợp dạng bài.
3. Mọi gợi ý phải xuất phát TỪ ĐỀ NÀY — không gợi ý chung chung áp dụng được cho mọi đề.

task_type: Loại bài viết theo đề (ví dụ: "FCE Part 1 — Essay (2 notes bắt buộc)", "IELTS Task 1 — Bar Chart", "KET Part 1 — Email", "PET Part 1 — Email (3 notes bắt buộc)"...).
outline: Dàn bài CHI TIẾT bằng TIẾNG VIỆT.
  • Nếu đề có NOTES: mỗi note = 1 mục trong dàn bài, ghi rõ "Note 1: [tên note] — viết 3–4 câu về...". KHÔNG thêm điểm ngoài notes (trừ FCE Part 1 cần thêm 1 điểm riêng).
  • Nếu đề có SỐ LIỆU/BIỂU ĐỒ: gợi ý cụ thể điểm nào cần đề cập, số liệu nào nổi bật, xu hướng gì cần so sánh.
  • Nêu số câu gợi ý cho mỗi phần.
key_vocabulary: 8–10 từ/cụm tiếng Anh CỤ THỂ CHO CHỦ ĐỀ/NỘI DUNG của đề này. Dạng "từ/cụm (nghĩa tiếng Việt)".
useful_phrases: 6–8 câu/cụm phù hợp DẠNG BÀI này. Nếu có notes bắt buộc thì ưu tiên cụm giúp triển khai các notes đó.
criteria_tips: Đúng 4 gợi ý tiếng Việt — mỗi gợi ý ứng với 1 tiêu chí chấm. Bắt đầu "[Tên tiêu chí]: ..." và giải thích CỤ THỂ cần làm gì trong ĐỀ NÀY. Với Content: nhắc học sinh phải bao gồm đủ các notes bắt buộc (nếu có).
dos_and_donts: 5–6 lưu ý tiếng Việt — mix ✅ DOs và ❌ DON'Ts. Nếu đề có notes bắt buộc thì PHẢI có: "❌ Không bỏ sót bất kỳ note nào của đề — thiếu note sẽ bị trừ điểm Content nặng".
time_guide: Gợi ý phân bổ thời gian tiếng Việt phù hợp với kỳ thi và dạng bài.`;
}

async function getWritingHints(exercise) {
  const p         = provider();
  const sysPrompt = buildHintsSystem(exercise);
  const userText  = `KỲ THI: ${exercise.program} — Kỹ năng: ${exercise.skill}\nĐỀ BÀI: ${exercise.title}\n\n${exercise.content || ''}`;
  const imageData = await fetchImageBase64(exercise.image_url);

  if (p === 'gemini') {
    const model  = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const url    = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const parts  = [];
    if (imageData) parts.push({ inline_data: { mime_type: imageData.mimeType, data: imageData.base64 } });
    parts.push({ text: userText });
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: sysPrompt }] },
        contents: [{ role: 'user', parts }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: HINTS_GEMINI_SCHEMA,
          maxOutputTokens: 3000,
          thinkingConfig: { thinkingBudget: 0 }
        }
      })
    });
    if (!r.ok) throw new Error('Gemini ' + r.status + ': ' + (await r.text()));
    const data = await r.json();
    const resParts = data?.candidates?.[0]?.content?.parts || [];
    const text = resParts.map(pp => pp.text || '').join('');
    if (!text) throw new Error('Gemini: phản hồi rỗng');
    return JSON.parse(text);
  }

  if (p === 'claude') {
    const client       = new Anthropic();
    const model        = process.env.ANTHROPIC_MODEL || 'claude-opus-4-8';
    const contentParts = [];
    if (imageData) contentParts.push({ type: 'image', source: { type: 'base64', media_type: imageData.mimeType, data: imageData.base64 } });
    contentParts.push({ type: 'text', text: userText });
    const resp = await client.messages.create({
      model, max_tokens: 3000, system: sysPrompt,
      messages: [{ role: 'user', content: contentParts }],
      output_config: { format: { type: 'json_schema', schema: HINTS_CLAUDE_SCHEMA } }
    });
    const block = resp.content.find(b => b.type === 'text');
    return JSON.parse(block.text);
  }

  throw new Error('Chưa cấu hình AI');
}

module.exports = { aiEnabled, gradeWriting, gradeAptisWriting, getWritingHints, provider };
