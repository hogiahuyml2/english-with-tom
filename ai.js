// Chấm bài Writing bằng AI — hỗ trợ Gemini (Google) hoặc Claude (Anthropic)
// Trả về kết quả chấm + bài viết gợi ý (suggested_writing) theo tiêu chí từng kỳ thi
const Anthropic = require('@anthropic-ai/sdk');

// ── Helper: gọi Gemini với timeout + parse JSON ──────────────────────────────
async function callGemini(url, apiKey, requestBody, timeoutMs) {
  const ctrl  = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs || 90000);
  try {
    const r = await fetch(url, {
      signal : ctrl.signal,
      method : 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body   : JSON.stringify(requestBody)
    });
    clearTimeout(timer);
    if (!r.ok) {
      const errTxt = await r.text().catch(() => '');
      throw new Error('Gemini HTTP ' + r.status + ': ' + errTxt.slice(0, 300));
    }
    const data = await r.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const text  = parts.map(p => p.text || '').join('');
    const finishReason = data?.candidates?.[0]?.finishReason || 'UNKNOWN';
    if (!text) throw new Error('Gemini phản hồi rỗng (finishReason=' + finishReason + ')');
    try {
      return JSON.parse(text);
    } catch (parseErr) {
      throw new Error('Gemini JSON parse thất bại: ' + parseErr.message + ' — snippet: ' + text.slice(0, 150));
    }
  } catch (e) {
    clearTimeout(timer);
    if (e.name === 'AbortError') throw new Error('Gemini timeout sau ' + Math.round((timeoutMs || 90000) / 1000) + 's — thử lại sau');
    throw e;
  }
}

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
Đề bài yêu cầu học sinh đề cập ĐỦ 3 Ý cụ thể (bullet points) — thường in đậm hoặc liệt kê trong đề.

⚠️ ĐỌC ẢNH ĐỀ TRƯỚC — image_content ĐÃ LIỆT KÊ CHÍNH XÁC 3 bullet points từ đề.
BẮT BUỘC trước khi chấm:
1. Dùng image_content để biết chính xác 3 ý học sinh phải đề cập — KHÔNG suy đoán từ title.
2. Kiểm tra từng ý trong image_content — học sinh có đề cập không, rõ ràng không.
3. Content bị hạ điểm nếu thiếu ý hoặc thêm nội dung không liên quan đến 3 ý đó.
4. Organisation: kiểm tra có greeting (Hi/Dear...) và sign-off (Bye/Best wishes...) không.`
    : `KET (A2 Key) WRITING PART 2 — Viết truyện ngắn (tối thiểu 35 từ) dựa theo 3 tranh cho sẵn.

⚠️ ĐỌC ẢNH ĐỀ TRƯỚC — image_content ĐÃ MÔ TẢ NỘI DUNG TỪNG TRANH.
BẮT BUỘC trước khi chấm:
1. Dùng image_content để biết 3 bức tranh mô tả tình huống gì — KHÔNG tự đoán.
2. Kiểm tra học sinh có đề cập ĐỦ CẢ 3 tình huống theo đúng thứ tự không — thiếu tranh nào thì hạ Content.
3. Bài phải là CÂU CHUYỆN CÓ TÌNH TIẾT, không phải mô tả rời rạc.
4. Câu mở đầu cho sẵn (nếu có trong đề): kiểm tra học sinh có dùng không.`;

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
    ? 'suggested_writing: Viết EMAIL TIẾNG ANH 25–40 từ dựa ĐÚNG theo image_content (3 bullet points). Mỗi ý 1–2 câu ngắn tự nhiên, có greeting phù hợp và sign-off. Từ vựng A2. KHÔNG thêm thông tin ngoài 3 ý trong image_content.'
    : 'suggested_writing: Viết CÂU CHUYỆN TIẾNG ANH 35–55 từ dựa ĐÚNG theo image_content (nội dung 3 tranh). Bắt đầu bằng câu mở đầu cho sẵn (nếu có), đề cập ĐỦ CẢ 3 tình huống theo đúng thứ tự, dùng linking words (Last Saturday... First... then... When... Suddenly...), thì quá khứ đơn, kết thúc tự nhiên.'}`;
}

// Rubric FCE — bám sát Assessment Scale chính thức Cambridge B2 First
function fceRubric(title) {
  const isPart1 = /part\s*1/i.test(title);
  const taskHint = isPart1
    ? `FCE Part 1 — ESSAY nghị luận BẮT BUỘC (140–190 từ).

══ YÊU CẦU ĐẶC THÙ FCE PART 1 ══
Đề bài FCE Part 1 luôn có: câu hỏi/tình huống + HAI NOTES bắt buộc (bullet points) + học sinh phải tự thêm 1 điểm riêng.
⚠️ ĐỌC ẢNH ĐỀ TRƯỚC — image_content ĐÃ LIỆT KÊ CHÍNH XÁC 2 notes từ đề.
Bước 1: Dùng image_content để biết 2 notes cụ thể của ĐỀ NÀY — KHÔNG suy đoán hay dùng notes từ bài khác.
Bước 2: Kiểm tra học sinh có (a) thảo luận ĐỦ CẢ 2 notes trong image_content, (b) thêm 1 điểm riêng không.
Bước 3: Content bị hạ điểm nếu thiếu bất kỳ note nào trong image_content.`
    : 'FCE Part 2 — Học sinh chọn một dạng bài (article, review, story, letter, report...). Xác định đúng dạng bài từ đề (text + ảnh nếu có) rồi chấm đúng quy ước dạng bài đó.';

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
  ? 'BẮT BUỘC với Part 1: (a) Dùng ĐÚNG 2 notes trong image_content — mỗi note thành 1 đoạn thân bài riêng. (b) Thêm 1 điểm thứ ba của riêng mình (clearly labelled). (c) Format essay đầy đủ: intro → 2 body paragraphs theo notes → 1 body paragraph own idea → conclusion. (d) KHÔNG bịa notes hay dùng notes ngoài image_content.'
  : 'Bài mẫu phải: (a) đáp ứng đúng yêu cầu của đề (text + ảnh nếu có), (b) dùng đúng format/quy ước của dạng bài, (c) less common lexis và cấu trúc đa dạng, (d) đạt Band 4–5.'}`;
}

// Rubric PET — bám sát 100% Cambridge B1 Assessment Scales (UCLES 2014)
// 4 tiêu chí: Content, Communicative Achievement, Organisation, Language (mỗi tiêu chí 0–5)
// Band 4 = chia sẻ đặc điểm Band 3 và Band 5; Band 2 = chia sẻ đặc điểm Band 1 và Band 3
function petRubric(title) {
  const isPart1 = /part\s*1/i.test(title);

  const partIntro = isPart1
    ? `PET (B1 Preliminary) WRITING PART 1 — Email/thư (~100 từ).

══ YÊU CẦU ĐẶC THÙ PART 1 ══
Đây là dạng bài BẮT BUỘC có notes. Đề bài luôn có các NOTES/CUES mà học sinh PHẢI đề cập đầy đủ.
• Notes thường xuất hiện dưới dạng CHỮ NGHIÊNG hoặc CHÚ THÍCH MŨI TÊN bên cạnh email/thư gốc trong HÌNH ẢNH đề bài (ví dụ: "Me too!", "Tell Charlie", "Yes, but...", "Suggest...").
• Đọc KỸ HÌNH ẢNH đề để xác định đúng notes — chúng thường ở bên lề phải hoặc cuối email gốc.
• Điền đầy đủ vào image_content trước khi chấm.
• Communicative Achievement: kiểm tra register (informal/semi-formal phù hợp người nhận), format email/thư đúng (greeting + sign-off).`
    : `PET (B1 Preliminary) WRITING PART 2 — Article / story / review (~100 từ).
Học sinh tự do phát triển bài theo dạng bài được yêu cầu. Xác định đúng dạng bài (article, story, review...) rồi chấm đúng quy ước dạng bài đó.`;

  return `${partIntro}

Chấm theo THANG ĐÁNH GIÁ CHÍNH THỨC Cambridge B1 Preliminary — ĐÚNG 4 TIÊU CHÍ (mỗi tiêu chí 0–5):
Band chẵn (2, 4) chia sẻ đặc điểm của 2 band lẻ liền kề — KHÔNG phải điểm trung bình; là mức thực hiện "ở giữa" 2 band đó.

═══ CONTENT (Nội dung) ═══
• Band 5: Toàn bộ nội dung liên quan đề. Target reader được thông tin ĐẦY ĐỦ.
• Band 4: Chia sẻ đặc điểm Band 3 và Band 5.
• Band 3: Có thể có thiếu sót/không liên quan NHỎ. Target reader NHÌN CHUNG được thông tin.
• Band 2: Chia sẻ đặc điểm Band 1 và Band 3.
• Band 1: Có nội dung không liên quan và hiểu sai đề. Target reader chỉ được thông tin TỐI THIỂU.
• Band 0: Nội dung HOÀN TOÀN không liên quan. Target reader không được thông tin.
⚠️ KHÔNG trừ điểm Content vì lỗi ngôn ngữ hay tổ chức. 4 tiêu chí hoàn toàn ĐỘC LẬP với nhau.
${isPart1 ? '⚠️ Part 1 đặc thù: thiếu note nào thì hạ Content tương ứng — thiếu 1 note trong 3 → tối đa Band 4; thiếu 2 notes → tối đa Band 2.' : ''}

═══ COMMUNICATIVE ACHIEVEMENT (Hiệu quả giao tiếp) ═══
• Band 5: Dùng đúng quy ước dạng bài để GIỮ SỰ CHÚ Ý của target reader và truyền đạt ý STRAIGHTFORWARD.
• Band 4: Chia sẻ đặc điểm Band 3 và Band 5.
• Band 3: Dùng đúng quy ước dạng bài theo cách NHÌN CHUNG PHÙ HỢP để truyền đạt ý straightforward.
• Band 2: Chia sẻ đặc điểm Band 1 và Band 3.
• Band 1: Tạo ra văn bản truyền đạt ý đơn giản theo cách ĐƠN GIẢN.
• Band 0: Dưới mức Band 1.
⚠️ Đánh giá theo quy ước của dạng bài cụ thể:
  - Email/thư (Part 1): greeting phù hợp, register đúng (informal → bạn bè, semi-formal → người lớn/người không quen), sign-off, câu mở chủ đề.
  - Article (Part 2): tiêu đề hấp dẫn, câu mở thu hút, nội dung thú vị.
  - Story: narrative flow, có climax, dùng thì quá khứ đúng.
  - Review: nêu đối tượng, đánh giá ưu/nhược, khuyến nghị.

═══ ORGANISATION (Tổ chức) ═══
• Band 5: Văn bản NHÌN CHUNG tổ chức tốt và mạch lạc, dùng ĐA DẠNG linking words và cohesive devices.
• Band 4: Chia sẻ đặc điểm Band 3 và Band 5.
• Band 3: Văn bản mạch lạc, liên kết bằng linking words CƠ BẢN và SỐ LƯỢNG HẠN CHẾ cohesive devices (ví dụ: and, so, because, but, first, then, however...).
• Band 2: Chia sẻ đặc điểm Band 1 và Band 3.
• Band 1: Văn bản liên kết bằng linking words phổ biến, tần số cao (basic, high-frequency).
• Band 0: Dưới mức Band 1.
⚠️ KHÔNG trừ điểm Organisation vì lỗi ngôn ngữ — chỉ đánh giá sự liên kết và cấu trúc bài.

═══ LANGUAGE (Ngôn ngữ) ═══
• Band 5: Dùng ĐA DẠNG từ vựng hằng ngày phù hợp, đôi khi dùng sai less common lexis. Dùng ĐA DẠNG cấu trúc ngữ pháp đơn giản VÀ MỘT SỐ phức tạp với mức kiểm soát TỐT. Lỗi KHÔNG cản trở giao tiếp.
• Band 4: Chia sẻ đặc điểm Band 3 và Band 5.
• Band 3: Dùng từ vựng hằng ngày NHÌN CHUNG phù hợp, đôi khi LẶP từ nhất định. Dùng ngữ pháp đơn giản với mức kiểm soát TỐT. Lỗi có thể nhận thấy nhưng NGHĨA VẪN XÁC ĐỊNH được.
• Band 2: Chia sẻ đặc điểm Band 1 và Band 3.
• Band 1: Dùng từ vựng cơ bản NHÌN CHUNG phù hợp. Dùng ngữ pháp đơn giản với MỘT MỨC ĐỘ kiểm soát. Lỗi đôi khi CẢN TRỞ nghĩa.
• Band 0: Dưới mức Band 1.
⚠️ KHÔNG trừ điểm Language khi lỗi nhỏ mà nghĩa vẫn rõ. Chỉ hạ điểm khi lỗi THỰC SỰ cản trở hiểu nghĩa.

overall_score = MEAN 4 tiêu chí, làm tròn 0.5 gần nhất, thang 0–5. scale_label = "B1 Preliminary (0–5)".
criteria gồm ĐÚNG 4 mục: "Content (Nội dung)", "Communicative Achievement (Hiệu quả giao tiếp)", "Organisation (Tổ chức)", "Language (Ngôn ngữ)". Mỗi mục có max=5.

suggested_writing: Viết bài mẫu TIẾNG ANH ~100 từ đúng dạng bài yêu cầu.
${isPart1
    ? 'BẮT BUỘC với Part 1: (a) Dùng đúng các notes đã liệt kê trong image_content — theo đúng thứ tự, mỗi note triển khai 1–2 câu tự nhiên. (b) Format email/thư đầy đủ: greeting → nội dung theo từng note → sign-off. (c) Register phù hợp người nhận trong đề. (d) KHÔNG bịa thêm nội dung ngoài phạm vi notes. (e) Khoảng 100 từ.'
    : 'Bài mẫu phải: (a) đúng dạng bài yêu cầu (article/story/review), (b) dùng đúng quy ước format của dạng bài đó, (c) nội dung hấp dẫn và phù hợp đề, (d) đạt Band 4–5 trên cả 4 tiêu chí.'}`;
}

// Rubric IELTS — bám sát 100% IELTS Writing Band Descriptors (Updated May 2023, IELTS.org)
// Task 1 dùng "Task Achievement"; Task 2 dùng "Task Response" — hai tiêu chí KHÁC NHAU
// Thang 0–9 (half-bands 0.5 bước); Task 2 có trọng số GẤP ĐÔI Task 1 trong điểm toàn bài
function ieltsRubric(title) {
  const isTask1 = /task\s*1/i.test(title);

  if (isTask1) {
    return `IELTS WRITING TASK 1 — Academic: Mô tả biểu đồ/số liệu/sơ đồ (tối thiểu 150 từ).
General Training: Viết thư (tối thiểu 150 từ).

⚠️ ĐỌC ẢNH ĐỀ TRƯỚC — image_content ĐÃ TRÍCH XUẤT DỮ LIỆU/YÊU CẦU TỪ HÌNH.
BẮT BUỘC trước khi chấm:
1. Dùng image_content để biết chính xác: loại biểu đồ/sơ đồ, tiêu đề, trục, số liệu thực tế, xu hướng — KHÔNG suy đoán từ title bài.
2. Academic: kiểm tra học sinh có đề cập đúng số liệu trong image_content không; có overview không (Band 7+).
3. General Training: kiểm tra có đủ bullet points (dùng image_content), rõ mục đích thư, đúng tone không.
4. Kiểm tra độ dài: dưới 150 từ → phạt Task Achievement nặng. Dưới 20 từ → Band 1.

Chấm ĐÚNG 4 TIÊU CHÍ, mỗi tiêu chí thang 0–9 (half-bands được phép: 0.5, 1.5, 2.5... 8.5):

═══ TASK ACHIEVEMENT (Hoàn thành nhiệm vụ) ═══
⚠️ Task 1 dùng "TASK ACHIEVEMENT" — KHÔNG phải "Task Response" (Task Response chỉ dùng cho Task 2).
• Band 9: Toàn bộ yêu cầu được đáp ứng đầy đủ và phù hợp.
• Band 8: Bao quát tất cả yêu cầu một cách phù hợp, liên quan và đủ. (Academic) Key features được chọn khéo léo, trình bày rõ ràng, minh họa tốt. (GT) Tất cả bullet points trình bày rõ, minh họa phù hợp. Có thể có thiếu sót rất nhỏ.
• Band 7: Bao quát yêu cầu. Nội dung liên quan và chính xác — có thể vài thiếu sót nhỏ. Format phù hợp. (Academic) Có overview rõ ràng, dữ liệu được phân loại, xu hướng/điểm khác biệt chính được xác định. (GT) Tất cả bullet points được bao quát và nêu bật rõ ràng, mục đích thư rõ, tone nhất quán và phù hợp, sai sót rất nhỏ.
• Band 6: Tập trung vào yêu cầu task, format phù hợp. (Academic) Key features được bao quát và nêu bật đầy đủ, có overview, thông tin được chọn và hỗ trợ bằng số liệu. (GT) Tất cả bullet points được bao quát và nêu bật đầy đủ, mục đích nhìn chung rõ, có thể có chút không nhất quán tone. Có thể có thông tin không liên quan/không chính xác. Có thể thiếu một số chi tiết.
• Band 5: Nhìn chung đáp ứng yêu cầu task, format có thể không phù hợp ở một số chỗ. (Academic) Key features không được bao quát đầy đủ, chủ yếu là kể lại cơ học, có thể thiếu số liệu. (GT) Tất cả bullet points có mặt nhưng 1+ có thể chưa đầy đủ, mục đích đôi khi không rõ, tone đôi khi không phù hợp. Xu hướng tập trung vào chi tiết (không nhìn bức tranh tổng thể). Nội dung không liên quan/không chính xác ở khu vực quan trọng làm giảm task achievement. Chi tiết minh họa hạn chế.
• Band 4: Chỉ là một cố gắng để đề cập task. (Academic) Rất ít key features được chọn. (GT) Không phải tất cả bullet points được trình bày, mục đích thư không được giải thích rõ và có thể bị nhầm lẫn, tone có thể không phù hợp. Format có thể không phù hợp. Key features/bullet points có thể không liên quan, lặp lại, không chính xác hoặc không phù hợp.
• Band 3: Response không đáp ứng yêu cầu task (có thể do hiểu sai dữ liệu/sơ đồ/tình huống). Key features/bullet points phần lớn không liên quan. Thông tin hạn chế và có thể lặp lại. Nội dung hầu như không liên quan đến task.
• Band 2: Không đề cập được các yêu cầu task. Rất ít thông điệp liên quan, hoặc toàn bộ response lạc đề.
• Band 1: Không đạt yêu cầu tối thiểu. Responses 20 từ trở xuống → Band 1.
• Band 0: Không tham dự, dùng ngôn ngữ khác tiếng Anh, hoặc toàn bộ được ghi nhớ thuộc lòng.

═══ COHERENCE & COHESION (Mạch lạc & Liên kết) ═══
• Band 9: Thông tin và ý tưởng được sắp xếp theo thứ tự hợp lý. Cohesion được sử dụng sao cho rất hiếm khi thu hút sự chú ý. Paragraphing được quản lý khéo léo. Bất kỳ thiếu sót nào trong coherence hoặc cohesion đều ở mức tối thiểu.
• Band 8: Thông tin và ý tưởng được sắp xếp hợp lý, cohesion được quản lý tốt. Paragraphing được sử dụng đủ và phù hợp. Thiếu sót không thường xuyên trong coherence hoặc cohesion.
• Band 7: Thông tin và ý tưởng được tổ chức hợp lý, có sự tiến triển rõ ràng xuyên suốt. Có thể vài thiếu sót nhỏ. Đa dạng cohesive devices bao gồm reference và substitution, được dùng linh hoạt nhưng có một số không chính xác hoặc over/under use. Paragraphing được sử dụng đủ và phù hợp.
• Band 6: Thông tin và ý tưởng nhìn chung được sắp xếp mạch lạc, có overall progression rõ ràng. Cohesive devices được dùng với một số hiệu quả nhưng cohesion trong/giữa các câu có thể bị lỗi hoặc cơ học do misuse/overuse/omission. Reference và substitution có thể thiếu tính linh hoạt hoặc rõ ràng, gây ra sự lặp lại hoặc lỗi.
• Band 5: Tổ chức có nhưng không hoàn toàn hợp lý, có thể thiếu overall progression. Tuy nhiên vẫn có coherence cơ bản. Mối quan hệ giữa các ý có thể theo dõi được nhưng các câu không liên kết trôi chảy. Có thể limited/overuse cohesive devices với một số không chính xác. Có thể lặp lại do sử dụng reference/substitution không đầy đủ/không chính xác.
• Band 4: Thông tin và ý tưởng có nhưng không sắp xếp mạch lạc, không có sự tiến triển rõ ràng. Mối quan hệ giữa các ý không rõ ràng và/hoặc đánh dấu không đủ. Có một số sử dụng cohesive devices cơ bản, có thể không chính xác hoặc lặp lại. Sử dụng không chính xác hoặc thiếu substitution hoặc referencing.
• Band 3: Không có tổ chức hợp lý rõ ràng. Có thể lệ thuộc quá mức vào input material hoặc memorised language. Sử dụng sequencers hoặc cohesive devices tối thiểu. Khó xác định referencing.
• Band 2: Rất ít bằng chứng về kiểm soát các đặc điểm tổ chức.
• Band 1: Không giao tiếp được bất kỳ thông điệp nào.

═══ LEXICAL RESOURCE (Vốn từ vựng) ═══
• Band 9: Đầy đủ tính linh hoạt và sử dụng chính xác trong phạm vi task. Từ vựng đa dạng được sử dụng chính xác và phù hợp với kiểm soát lexical features rất tự nhiên và sophisticated. Lỗi chính tả/word formation cực kỳ hiếm và tác động tối thiểu đến giao tiếp.
• Band 8: Wide resource được dùng trôi chảy và linh hoạt để truyền đạt ý chính xác trong phạm vi task. Có kỹ năng sử dụng uncommon và/hoặc idiomatic items khi phù hợp, mặc dù có thể có inaccuracies không thường xuyên trong word choice và collocation. Lỗi chính tả và/hoặc word formation có thể xảy ra nhưng tác động tối thiểu.
• Band 7: Resource đủ để cho phép một mức độ linh hoạt và chính xác. Có khả năng sử dụng less common và/hoặc idiomatic items. Ý thức về style và collocation, mặc dù có inappropriacies. Chỉ một vài lỗi chính tả và/hoặc word formation và không làm giảm overall clarity.
• Band 6: Resource nhìn chung đầy đủ và phù hợp cho task. Ý nghĩa nhìn chung rõ dù range hơi hạn chế hoặc thiếu chính xác trong word choice. Ví dụ complex structures không có cùng level of accuracy như trong simple structures. Risk-taker sẽ có range từ vựng rộng hơn nhưng inaccuracy/inappropriacy cao hơn. Một số lỗi chính tả và/hoặc word formation nhưng không cản trở giao tiếp.
• Band 5: Resource hạn chế nhưng minimally adequate cho task. Simple vocabulary có thể dùng chính xác nhưng range không cho phép nhiều biến thể trong diễn đạt. Có thể có frequent lapses trong appropriacy của word choice, và thiếu linh hoạt rõ ràng trong frequent simplifications và/hoặc repetitions. Lỗi chính tả và/hoặc word formation có thể noticeable và có thể gây khó khăn cho reader.
• Band 4: Resource hạn chế và không đủ hoặc không liên quan đến task. Vocabulary cơ bản và có thể dùng lặp lại. Có thể sử dụng lexical chunks không phù hợp (memorised phrases, formulaic language và/hoặc language từ input material). Word choice không phù hợp và/hoặc lỗi trong word formation và/hoặc chính tả có thể cản trở ý nghĩa.
• Band 3: Resource không đủ (có thể do response quá ngắn). Possible over-dependence on input material hoặc memorised language.
• Band 2: Kiểm soát word choice và/hoặc chính tả rất hạn chế, lỗi chiếm ưu thế, có thể cản trở ý nghĩa nghiêm trọng.
• Band 1: Resource cực kỳ hạn chế với rất ít recognisable strings, ngoài memorised phrases. Không có kiểm soát word formation và/hoặc chính tả rõ ràng.

═══ GRAMMATICAL RANGE & ACCURACY (Phạm vi & Độ chính xác ngữ pháp) ═══
• Band 9: Wide range of structures trong phạm vi task được dùng với full flexibility và control. Punctuation và grammar được dùng phù hợp xuyên suốt. Lỗi cực kỳ hiếm và tác động tối thiểu.
• Band 8: Wide range of structures được dùng linh hoạt và chính xác. Đa số câu error-free, punctuation được quản lý tốt. Lỗi không thường xuyên, không hệ thống và inappropriacies xảy ra nhưng tác động tối thiểu.
• Band 7: Variety of complex structures được dùng với một mức độ linh hoạt và chính xác. Grammar và punctuation nhìn chung được kiểm soát tốt, error-free sentences frequent. Một vài lỗi có thể tồn tại nhưng không cản trở giao tiếp.
• Band 6: Mix của simple và complex sentence forms nhưng tính linh hoạt hạn chế. Ví dụ complex structures không có cùng level of accuracy như simple structures. Lỗi grammar và punctuation xảy ra nhưng hiếm khi cản trở giao tiếp.
• Band 5: Range of structures hạn chế và hơi lặp lại. Complex sentences mặc dù được cố gắng nhưng có xu hướng có lỗi, accuracy cao nhất ở simple sentences. Lỗi grammatical có thể frequent và gây khó khăn cho reader. Punctuation có thể có lỗi.
• Band 4: Phạm vi cấu trúc rất hạn chế. Subordinate clauses hiếm và simple sentences chiếm ưu thế. Một số structures được tạo ra chính xác nhưng lỗi grammatical frequent và có thể cản trở ý nghĩa. Punctuation thường có lỗi hoặc không đủ.
• Band 3: Sentence forms được cố gắng nhưng lỗi trong grammar và punctuation chiếm ưu thế (ngoại trừ memorised phrases hoặc từ input material). Điều này ngăn hầu hết ý nghĩa đi qua.
• Band 2: Ít hoặc không có bằng chứng về sentence forms (ngoại trừ memorised phrases). Độ dài có thể không đủ để cung cấp bằng chứng về kiểm soát sentence forms.
• Band 1: Không có ngôn ngữ có thể đánh giá được.

overall_score = MEAN 4 tiêu chí (Task Achievement + C&C + LR + GRA) / 4, làm tròn về 0.5 gần nhất, thang 0–9.
scale_label = "IELTS Task 1 Band (0–9)"
criteria gồm ĐÚNG 4 mục: "Task Achievement (Hoàn thành nhiệm vụ)", "Coherence & Cohesion (Mạch lạc & Liên kết)", "Lexical Resource (Vốn từ vựng)", "Grammatical Range & Accuracy (Ngữ pháp)". Mỗi mục max=9.

HƯỚNG DẪN CHẤM CHUẨN IELTS — HOLISTIC BEST FIT:
• Nguyên tắc cốt lõi: Chọn band MÔ TẢ ĐÚNG NHẤT tổng thể bài viết. KHÔNG yêu cầu bài phải hoàn hảo 100% ở mọi đặc điểm của một band mới được band đó — đây là "holistic best fit", không phải checklist.
• Mỗi tiêu chí chấm ĐỘC LẬP — không để tiêu chí này ảnh hưởng tiêu chí kia.
• Half-bands (6.5, 7.5) dùng khi bài "nằm giữa" hai band liền kề — KHÔNG dùng half-band để phạt bài đang ở band mạnh.
• Lỗi nhỏ KHÔNG tự động hạ band: 1–2 lỗi collocation, spelling lẻ tẻ, hoặc 1 câu awkward không ảnh hưởng giao tiếp → giữ nguyên band, KHÔNG hạ xuống.
• Band 7 Task 1: Có overview rõ (không nhất thiết phải xuất sắc), data được nhóm và so sánh (không nhất thiết hoàn hảo), LR có less common lexis dù đôi chỗ không chính xác, GRA có complex structures dù có vài lỗi → cho Band 7. Không hạ xuống 6.5 chỉ vì "overview chưa sophisticated" hay "1 lỗi grammar".
• Band 8 Task 1: Overview sắc bén, data grouping thông minh và efficient, LR dùng uncommon lexis tự nhiên với chỉ infrequent errors, GRA rare errors → cho Band 8. Không hạ xuống 7.5 chỉ vì có 1–2 lỗi nhỏ không hệ thống.
• Biên độ chấm: Nếu còn nghi ngờ giữa Band 7 và Band 7.5, hãy xét ĐỘ MẠNH tổng thể — bài có nhiều điểm tích cực hơn tiêu cực → band cao hơn.

suggested_writing: Viết bài mẫu Task 1 TIẾNG ANH 150–180 từ DỰA TRÊN image_content.
BẮT BUỘC: (a) Dùng ĐÚNG số liệu/dữ liệu đã trích trong image_content — không bịa số, không dùng số liệu từ bài khác. (b) Có overview (1–2 câu xu hướng tổng quát — KHÔNG phải số liệu cụ thể) đặt sau intro hoặc ở cuối. (c) Thân bài: nhóm và so sánh dữ liệu THEO ĐẶC ĐIỂM/XU HƯỚNG — không liệt kê cơ học. (d) Academic: passive voice, hedging language. (e) GT: format thư (Dear..., Yours sincerely/faithfully). (f) Đạt Band 7–8.`;
  }

  // Task 2
  return `IELTS WRITING TASK 2 — Academic & General Training: Viết bài luận (tối thiểu 250 từ).
Task 2 có TRỌNG SỐ GẤP ĐÔI Task 1 trong điểm Writing tổng (Task 1 × 1/3 + Task 2 × 2/3).

BẮT BUỘC trước khi chấm:
1. Đọc kỹ đề bài — xác định DẠNG CÂU HỎI: Opinion Essay / Discussion Essay / Problem-Solution / Two-part Question / Advantages-Disadvantages.
2. Kiểm tra học sinh có TRẢ LỜI ĐÚNG yêu cầu câu hỏi không (có position rõ ràng không?).
3. Kiểm tra độ dài: dưới 250 từ → phạt Task Response. Dưới 20 từ → Band 1.
4. Kiểm tra có đủ BODY PARAGRAPHS với main ideas được develop và support không.

Chấm ĐÚNG 4 TIÊU CHÍ, mỗi tiêu chí thang 0–9 (half-bands được phép: 0.5, 1.5... 8.5):

═══ TASK RESPONSE (Đáp ứng yêu cầu đề) ═══
⚠️ Task 2 dùng "TASK RESPONSE" — KHÔNG phải "Task Achievement" (Task Achievement chỉ dùng cho Task 1).
• Band 9: Prompt được đề cập và khám phá sâu sắc. Vị trí rõ ràng và được phát triển đầy đủ, trả lời trực tiếp câu hỏi. Ý tưởng liên quan, được extend đầy đủ và hỗ trợ tốt. Thiếu sót trong nội dung hoặc hỗ trợ cực kỳ hiếm.
• Band 8: Prompt được đề cập phù hợp và đủ. Vị trí rõ ràng và được phát triển tốt. Ý tưởng liên quan, được extend tốt và hỗ trợ tốt. Có thể có thiếu sót không thường xuyên trong nội dung.
• Band 7: Main parts của prompt được đề cập phù hợp. Vị trí rõ ràng và được phát triển. Main ideas được extend và hỗ trợ nhưng có thể có xu hướng over-generalise hoặc thiếu focus và precision trong supporting ideas/material.
• Band 6: Main parts được đề cập (mặc dù một số có thể được bao quát đầy đủ hơn những phần khác). Format phù hợp. Vị trí trực tiếp liên quan đến prompt mặc dù kết luận có thể không rõ ràng, không justified hoặc lặp lại. Main ideas liên quan nhưng một số phát triển chưa đủ hoặc thiếu rõ ràng, một số supporting arguments và evidence có thể ít liên quan hoặc không đủ.
• Band 5: Main parts không được đề cập đầy đủ. Format có thể không phù hợp ở một số chỗ. Người viết diễn đạt vị trí nhưng phát triển không phải lúc nào cũng rõ ràng. Một số main ideas được đưa ra nhưng hạn chế và không được phát triển đủ và/hoặc có thể có chi tiết không liên quan. Có thể có lặp lại.
• Band 4: Prompt chỉ được đề cập một cách tối thiểu, hoặc câu trả lời tiếp tuyến — có thể do hiểu sai prompt. Format có thể không phù hợp. Vị trí có thể phân biệt được nhưng reader phải đọc kỹ để tìm. Main ideas khó xác định và những ideas có thể xác định được có thể thiếu liên quan, rõ ràng và/hoặc hỗ trợ. Phần lớn response có thể lặp lại.
• Band 3: Không có phần nào của prompt được đề cập đầy đủ, hoặc prompt bị hiểu sai. Không có vị trí liên quan nào có thể xác định được. Rất ít ý tưởng, và những ý đó có thể không liên quan hoặc phát triển không đủ. Nội dung hầu như không liên quan đến prompt.
• Band 2: Không có vị trí nào có thể xác định. Có thể thoáng thấy một hoặc hai ý tưởng không có phát triển. Responses 20 từ trở xuống → Band 1.
• Band 1: Writing không giao tiếp được bất kỳ thông điệp nào và có vẻ là của người hầu như không biết viết.
• Band 0: Không tham dự, dùng ngôn ngữ khác tiếng Anh, hoặc toàn bộ được ghi nhớ thuộc lòng.

═══ COHERENCE & COHESION (Mạch lạc & Liên kết) ═══
• Band 9: Cohesion được sử dụng sao cho rất hiếm khi thu hút sự chú ý. Paragraphing được quản lý khéo léo. Thiếu sót trong coherence hoặc cohesion ở mức tối thiểu.
• Band 8: Thông tin và ý tưởng được sắp xếp hợp lý theo thứ tự, cohesion được quản lý tốt. Paragraphing được quản lý khéo léo. Thiếu sót không thường xuyên.
• Band 7: Thông tin và ý tưởng được tổ chức hợp lý, có sự tiến triển rõ ràng xuyên suốt response (có vài thiếu sót nhỏ). Đa dạng cohesive devices bao gồm reference và substitution, dùng linh hoạt nhưng có một số inaccuracies hoặc some over/under use. Paragraphing nhìn chung được dùng hiệu quả để hỗ trợ overall coherence, trình tự ý tưởng trong paragraph nhìn chung hợp lý.
• Band 6: Thông tin nhìn chung được sắp xếp mạch lạc, overall progression rõ ràng. Cohesive devices dùng với hiệu quả nhất định nhưng cohesion trong/giữa câu có thể bị lỗi hoặc cơ học. Reference và substitution có thể thiếu linh hoạt. Paragraphing có thể không phải lúc nào cũng hợp lý và/hoặc central topic có thể không phải lúc nào cũng rõ.
• Band 5: Tổ chức có nhưng không hoàn toàn hợp lý, có thể thiếu overall progression, nhưng vẫn có cảm giác coherence. Mối quan hệ giữa các ý có thể theo dõi được nhưng các câu không liên kết trôi chảy. Có thể limited/overuse cohesive devices với một số inaccuracy. Paragraphing có thể không đủ hoặc thiếu.
• Band 4: Thông tin và ý tưởng có nhưng không sắp xếp mạch lạc, không có sự tiến triển rõ ràng. Mối quan hệ giữa các ý không rõ ràng. Có một số cohesive devices cơ bản. Inaccurate use hoặc thiếu substitution/referencing.
• Band 3: Không có tổ chức hợp lý rõ ràng. Không có paragraphing và/hoặc không có central topic rõ trong paragraphs. Sử dụng sequencers hoặc cohesive devices tối thiểu.
• Band 2: Any attempts at paragraphing are unhelpful. Rất ít relevant message, hoặc toàn bộ response lạc đề. Rất ít bằng chứng về kiểm soát organisational features.

═══ LEXICAL RESOURCE (Vốn từ vựng) ═══
• Band 9: Full flexibility và precise use widely evident. Wide range of vocabulary chính xác và phù hợp với very natural and sophisticated control. Minor errors cực kỳ hiếm.
• Band 8: Wide resource được dùng trôi chảy và linh hoạt để truyền đạt ý chính xác. Kỹ năng sử dụng uncommon và/hoặc idiomatic items khi phù hợp, mặc dù có thể có inaccuracies không thường xuyên trong word choice và collocation. Lỗi chính tả và/hoặc word formation có thể xảy ra nhưng tác động tối thiểu.
• Band 7: Resource đủ để cho phép flexibility và precision. Có khả năng sử dụng less common và/hoặc idiomatic items. Ý thức về style và collocation, mặc dù có inappropriacies. Chỉ một vài lỗi chính tả/word formation và không làm giảm overall clarity.
• Band 6: Resource nhìn chung đầy đủ và phù hợp cho task. Ý nghĩa nhìn chung rõ dù range hơi hạn chế hoặc thiếu precision trong word choice. Complex structures không có cùng level of accuracy như simple structures. Risk-takers: range từ vựng rộng hơn nhưng inaccuracy/inappropriacy cao hơn. Một số lỗi chính tả/word formation nhưng không cản trở giao tiếp.
• Band 5: Resource hạn chế nhưng minimally adequate. Simple vocabulary có thể dùng chính xác nhưng range không cho phép nhiều biến thể. Frequent lapses trong appropriacy of word choice. Lỗi chính tả/word formation có thể noticeable và có thể gây khó khăn cho reader.
• Band 4: Resource hạn chế và không đủ hoặc không liên quan đến task. Vocabulary cơ bản và có thể lặp lại. Sử dụng lexical chunks không phù hợp. Word choice không phù hợp và/hoặc lỗi có thể cản trở ý nghĩa.
• Band 3: Resource không đủ. Possible over-dependence trên input material hoặc memorised language.
• Band 2: Kiểm soát word choice và/hoặc chính tả rất hạn chế, lỗi chiếm ưu thế, có thể cản trở ý nghĩa nghiêm trọng.
• Band 1: Resource cực kỳ hạn chế. Không có kiểm soát word formation và/hoặc chính tả rõ ràng.

═══ GRAMMATICAL RANGE & ACCURACY (Phạm vi & Độ chính xác ngữ pháp) ═══
• Band 9: Wide range of structures được dùng với full flexibility và control. Punctuation và grammar được dùng phù hợp xuyên suốt. Lỗi cực kỳ hiếm.
• Band 8: Wide range of structures linh hoạt và chính xác. Đa số câu error-free, punctuation được quản lý tốt. Lỗi không thường xuyên, không hệ thống và tác động tối thiểu.
• Band 7: Variety of complex structures với flexibility và accuracy. Grammar và punctuation nhìn chung được kiểm soát tốt, error-free sentences frequent. Một vài lỗi có thể tồn tại nhưng không cản trở giao tiếp.
• Band 6: Mix của simple và complex sentence forms nhưng flexibility hạn chế. Complex structures không có cùng accuracy như simple. Lỗi grammar và punctuation xảy ra nhưng hiếm khi cản trở giao tiếp.
• Band 5: Range of structures hạn chế và hơi lặp lại. Complex sentences có xu hướng có lỗi, accuracy cao nhất ở simple sentences. Lỗi grammatical có thể frequent và gây khó khăn cho reader. Punctuation có thể có lỗi.
• Band 4: Phạm vi cấu trúc rất hạn chế. Subordinate clauses hiếm và simple sentences chiếm ưu thế. Lỗi grammatical frequent và có thể cản trở ý nghĩa. Punctuation thường có lỗi hoặc không đủ.
• Band 3: Sentence forms được cố gắng nhưng lỗi grammar và punctuation chiếm ưu thế. Ngăn hầu hết ý nghĩa.
• Band 2: Ít hoặc không có bằng chứng về sentence forms. Độ dài không đủ. Không có kiểm soát word formation/chính tả.
• Band 1: Không có ngôn ngữ có thể đánh giá được.

overall_score = MEAN 4 tiêu chí (Task Response + C&C + LR + GRA) / 4, làm tròn về 0.5 gần nhất, thang 0–9.
scale_label = "IELTS Task 2 Band (0–9)"
criteria gồm ĐÚNG 4 mục: "Task Response (Đáp ứng yêu cầu đề)", "Coherence & Cohesion (Mạch lạc & Liên kết)", "Lexical Resource (Vốn từ vựng)", "Grammatical Range & Accuracy (Ngữ pháp)". Mỗi mục max=9.

HƯỚNG DẪN CHẤM CHUẨN IELTS — HOLISTIC BEST FIT:
• Nguyên tắc cốt lõi: Chọn band MÔ TẢ ĐÚNG NHẤT tổng thể bài viết. KHÔNG yêu cầu bài phải hoàn hảo 100% ở mọi đặc điểm của một band — đây là "holistic best fit", không phải checklist cứng.
• Mỗi tiêu chí chấm ĐỘC LẬP — không để tiêu chí này ảnh hưởng tiêu chí kia.
• Half-bands (6.5, 7.5, 8.5) dùng khi bài "nằm giữa" hai band liền kề — KHÔNG dùng half-band để phạt bài mạnh.
• Lỗi nhỏ KHÔNG tự động hạ band: 1–2 lỗi collocation, spelling lẻ tẻ, 1 câu thiếu precision, supporting idea chưa thật sắc bén → giữ band, KHÔNG hạ xuống.
• Band 7 Task 2: Position rõ ràng, main ideas được develop (dù có chỗ over-generalise), C&C có progression rõ (dù vài lỗi cohesive device), LR dùng less common lexis (dù đôi chỗ inappropriacy), GRA có complex structures với "a few errors" → cho Band 7. KHÔNG hạ xuống 6.5 chỉ vì "supporting ideas chưa đủ specific" hay "1–2 lỗi grammar".
• Band 8 Task 2: Position rõ và phát triển tốt (dù "may have occasional lapses"), C&C quản lý tốt (dù thiếu sót không thường xuyên), LR dùng uncommon/idiomatic items với infrequent inaccuracies, GRA đa số câu error-free với lỗi không hệ thống → cho Band 8. KHÔNG hạ xuống 7.5 chỉ vì có 1–2 lỗi nhỏ không cản trở giao tiếp.
• Biên độ chấm: Khi còn nghi ngờ giữa hai band, xét tổng thể — bài có nhiều điểm tích cực hơn tiêu cực → chọn band cao hơn (hoặc half-band giữa). Đừng tìm lý do để hạ điểm.
• Task 2 có trọng số 2/3 trong IELTS Writing tổng. Điểm toàn bài = (T1_band × 1/3 + T2_band × 2/3), làm tròn về 0.5 gần nhất.

suggested_writing: Viết bài luận mẫu Task 2 TIẾNG ANH 250–280 từ, đạt Band 7–8.
BẮT BUỘC: (a) Xác định dạng câu hỏi và trả lời ĐÚNG yêu cầu (opinion → rõ ràng agree/disagree; discussion → discuss both views + own opinion; problem-solution → nêu vấn đề + giải pháp cụ thể). (b) Introduction: paraphrase đề + thesis statement. (c) Body: 2 đoạn, mỗi đoạn có topic sentence rõ ràng + examples/evidence cụ thể + linking ideas. (d) Conclusion: tổng kết + restate position. (e) Không viết OFF-TOPIC, không lặp lại ý không cần thiết. (f) Dùng đa dạng cấu trúc ngữ pháp và từ vựng học thuật.`;
}

// Rubric riêng cho từng kỳ thi
function rubricFor(exercise) {
  const program = exercise.program;
  if (program === 'KET') return ketRubric(exercise.title || '');
  if (program === 'FCE') return fceRubric(exercise.title || '');
  if (program === 'PET') return petRubric(exercise.title || '');
  if (program === 'IELTS') return ieltsRubric(exercise.title || '');
  if (program === 'APTIS') {
    const t = (exercise.title || '').toLowerCase();
    // Part 1 — Word-level (scale 0–3, chỉ 1 tiêu chí)
    if (/component\s*1|part\s*1/i.test(exercise.title)) {
      return `APTIS Writing PART 1 — Word-level Writing (5 tin nhắn ngắn, chỉ từ đơn lẻ).
Thang điểm: 0–3. Tiêu chí DUY NHẤT: Task Fulfilment & Communicative Competence.
⚠️ Spelling, capitalisation, grammar KHÔNG được tính ở Part 1. Chỉ đánh giá xem câu trả lời có INTELLIGIBLE và ĐÚNG YÊU CẦU không.
• 3 (above A1): TẤT CẢ 5 câu intelligible, task hoàn toàn đạt.
• 2 (A1.2): 3–4 câu intelligible; 1–2 câu lỗi cản trở hiểu.
• 1 (A1.1): 1–2 câu intelligible; 2–3 câu lỗi cản trở hiểu.
• 0 (A0): Không có câu nào intelligible.
overall_score = điểm 0–3 này. scale_label = "APTIS Part 1 (0–3)".
criteria gồm 1 mục: name="Task Fulfilment & Communicative Competence", max=3.
suggested_writing: Viết 5 câu trả lời mẫu TIẾNG ANH — mỗi câu là 1 từ/cụm từ ngắn, đúng và intelligible với từng câu hỏi trong đề, đạt điểm 3.`;
    }
    // Part 2 — Short Text (scale 0–5)
    if (/component\s*2|part\s*2/i.test(exercise.title)) {
      return `APTIS Writing PART 2 — Short Text Writing (20–30 từ, form filling).
Thang điểm: 0–5. Tiêu chí: Task Fulfilment/Topic Relevance + Grammatical Range & Accuracy + Punctuation + Vocabulary Range & Accuracy + Cohesion.
• 5 (B1+): Vượt trội so với A2 — likely above A2 level.
• 4 (A2.2): On topic. Simple grammar, errors do NOT impede. Mostly accurate punctuation/spelling. Vocab sufficient. Some simple connectors used.
• 3 (A2.1): On topic. Simple grammar, errors impede PARTS. Noticeable mistakes. Vocab mostly sufficient, inappropriate choices. Sentences listed, NO connectors.
• 2 (A1.2): Not fully on topic. Grammar limited to words/phrases; errors impede. Little punctuation; common spelling mistakes. Vocab insufficient. No cohesion.
• 1 (A1.1): Few words/phrases only. Errors make meaning unintelligible.
• 0 (A0): No meaningful language or completely off-topic.
overall_score = điểm 0–5 này. scale_label = "APTIS Part 2 (0–5)".
criteria gồm 5 mục: Task Fulfilment, Grammar, Punctuation, Vocabulary, Cohesion (mỗi mục đánh giá riêng, tổng thành band).
suggested_writing: Viết đoạn văn mẫu TIẾNG ANH 20–30 từ đúng yêu cầu đề, on topic, dùng simple connectors, đạt điểm 4–5.`;
    }
    // Part 3 — Group Chat (scale 0–5)
    if (/component\s*3|part\s*3/i.test(exercise.title)) {
      return `APTIS Writing PART 3 — Group Chat Replies (30–40 từ/reply, 3 replies).
Thang điểm: 0–5. Tiêu chí: Task Fulfilment/Topic Relevance + Punctuation + Grammatical Range & Accuracy + Vocabulary Range & Accuracy + Cohesion.
⚠️ Band phụ thuộc vào SỐ REPLIES on-topic: Band 4 = cả 3; Band 3 = 2/3; Band 2 = ít nhất 2; Band 1 = chỉ 1.
• 5 (B2+): Above B1 level — vượt trội so với các mô tả dưới.
• 4 (B1.2): CẢ 3 on topic. Simple grammar; errors with complex. Mostly accurate spelling/punctuation. Vocab sufficient. Simple cohesive devices.
• 3 (B1.1): 2/3 on topic. [Cùng đặc điểm ngôn ngữ như Band 4.]
• 2 (A2.2): Ít nhất 2/3 on topic. Simple grammar — errors sometimes impede. Noticeable mistakes. Vocab insufficient; inappropriate choices impede. Lists of sentences — not organised.
• 1 (A2.1): 1/3 on topic. [Cùng đặc điểm ngôn ngữ như Band 2.]
• 0: Below A2. No meaningful language.
overall_score = điểm 0–5 này. scale_label = "APTIS Part 3 (0–5)".
criteria gồm 3 mục: Reply 1, Reply 2, Reply 3 — mỗi mục đánh giá on-topic + quality, cho điểm 0–5, tổng hợp thành band tổng thể.
suggested_writing: Viết 3 replies mẫu TIẾNG ANH (30–40 từ mỗi reply), on topic, mạch lạc, đạt Band 4–5.`;
    }
    // Part 4 — Formal & Informal Email (scale 0–6)
    return `APTIS Writing PART 4 — Formal & Informal Email Writing.
Task 1: Email ngắn 40–50 từ — informal register (viết cho bạn bè/người thân gần gũi).
Task 2: Email dài 120–150 từ — formal register (viết cho công ty/người lạ).
Thang điểm: 0–6. Tiêu chí: Task Fulfilment & Register + Grammatical Range & Accuracy + Vocabulary Range & Accuracy + Punctuation + Fluency & Cohesion.
⚠️ REGISTER là tiêu chí TRỌNG YẾU: Task 1 PHẢI casual/informal; Task 2 PHẢI formal. Thiếu register → hạ điểm nặng.
• 6 (C2): Likely above C1 level.
• 5 (C1): On topic + HAI registers RÕ RÀNG KHÁC NHAU. Complex grammar range; minor errors. Vocab range; some awkward usage. Range of cohesive devices clearly indicating links.
• 4 (B2.2): On topic + register phù hợp NHẤT QUÁN Ở CẢ 2 emails. Some complex grammar; errors do NOT lead to misunderstanding. Minor punctuation/spelling. Sufficient vocab. LIMITED cohesive devices.
• 3 (B2.1): Partially on topic + register phù hợp NHẤT QUÁN Ở 1/2 email. [Cùng đặc điểm ngôn ngữ như Band 4.]
• 2 (B1.2): Partially on topic + register KHÔNG PHÙ HỢP Ở CẢ 2. Simple grammar; errors with complex. Mostly accurate punctuation/spelling. Limited vocab — errors impede in PARTS. Only simple cohesive devices.
• 1 (B1.1): Not on topic + KHÔNG CÓ nhận thức về register. Simple grammar; errors with complex. Mostly accurate punctuation. Limited vocab — impede in MOST text. Only simple cohesive devices.
• 0 (A1/A2): Below B1 or no meaningful language.
overall_score = điểm 0–6 này (thang 0–6). scale_label = "APTIS Part 4 (0–6)".
criteria gồm 2 mục: "Task 1 — Informal Email (0–6)" và "Task 2 — Formal Email (0–6)", kết hợp thành band tổng hợp.
suggested_writing: Viết email mẫu TIẾNG ANH cho Task 2 (120–150 từ, FORMAL register, đáp ứng đúng yêu cầu đề, đạt Band 4–5).`;
  }
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

function ieltsSuggestedWritingGuide(title) {
  const isTask1 = /task\s*1/i.test(title);
  if (isTask1) {
    return `
⭐ KHI VIẾT BÀI MẪU IELTS TASK 1 — THAM KHẢO NGUỒN UY TÍN SAU:
Các nguồn chuẩn để học structure, từ vựng và cách nhóm dữ liệu:
  • IELTS Simon (ielts-simon.com) — chuẩn mực về overview + data grouping đơn giản, hiệu quả
  • IDP IELTS Official (ielts.org) — sample answers Band 7-9, chuẩn Cambridge chính thức
  • IELTS Liz (ieltsliz.com) — model answers Band 9 kèm phân tích từng câu
  • IELTS Advantage (ieltsadvantage.com) — hướng dẫn academic vocabulary cho Task 1
  • Magoosh IELTS Blog — model answers kèm score breakdown
  • E2 IELTS (e2language.com) — model essays Band 7.5-8.5 có phân tích

Cách dùng để viết bài mẫu Task 1:
  (a) Overview: tham khảo structure "The chart shows... Overall, it is clear that..." từ IELTS Simon / IELTS Liz — 1-2 câu, KHÔNG có số liệu cụ thể.
  (b) Body 1: nhóm xu hướng cao nhất/nổi bật nhất; Body 2: nhóm xu hướng đối lập/còn lại — học cách nhóm từ IELTS Advantage.
  (c) Academic vocabulary: passive ("can be seen", "is illustrated"), hedging ("approximately", "roughly", "around"), comparison ("compared to", "while", "whereas", "in contrast").
  (d) Dùng đúng số liệu từ image_content — KHÔNG bịa số.
  (e) Viết bài RIÊNG (không copy), đạt Band 7-8.`;
  }
  return `
⭐ KHI VIẾT BÀI MẪU IELTS TASK 2 — THAM KHẢO NGUỒN UY TÍN SAU:
Các nguồn chuẩn để học structure, argument development và lexical resource:
  • IELTS Simon (ielts-simon.com) — "4-sentence introduction", "3-sentence paragraph" structures, Band 9 essays
  • IDP IELTS Official (ielts.org) — Band 9 model answers chính thức
  • IELTS Liz (ieltsliz.com) — model essays Band 9 + phân tích Task Response chi tiết
  • IELTS Nguyễn Huyền (YouTube/blog) — lexical resource band 8-9 tiếng Việt phân tích
  • IELTS 1984 (blog) — model essays Band 7-8 với breakdown từng tiêu chí
  • The IELTS Workshop (theieltsworkshop.com) — cấu trúc đoạn body chuẩn Cambridge
  • DOL English — từ vựng học thuật và topic vocabulary band cao
  • IELTS Fighter — model essays theo topic phân loại rõ ràng

Cách dùng để viết bài mẫu Task 2:
  (a) Introduction: paraphrase đề (KHÔNG copy) + thesis statement rõ ràng — học từ IELTS Simon "4-sentence intro".
  (b) Body paragraphs: mỗi đoạn = topic sentence + explanation + example/evidence + link back — học IELTS Liz / The IELTS Workshop.
  (c) Lexical resource: dùng less common lexis phù hợp topic này (tham khảo DOL English / IELTS Nguyễn Huyền), tránh lặp từ, tránh từ quá đơn giản.
  (d) Argument: develop ideas thực chất — không over-generalise, không liệt kê ý không có evidence — học IELTS 1984 / IELTS Fighter.
  (e) Conclusion: restate position + summary — ngắn gọn, không thêm ý mới.
  (f) Viết bài RIÊNG (không copy từ nguồn), đạt Band 7-8.`;
}

function buildSystem(exercise, hasStudentImage) {
  const hasImage = !!exercise.image_url;
  const isIelts  = exercise.program === 'IELTS';
  return `Bạn là giám khảo chấm Writing giàu kinh nghiệm cho các kỳ thi tiếng Anh quốc tế.
${rubricFor(exercise)}${isIelts ? ieltsSuggestedWritingGuide(exercise.title || '') : ''}
${hasImage ? '\nĐề bài này có kèm HÌNH ẢNH ĐỀ BÀI (hình thứ nhất). Hãy phân tích kỹ nội dung hình (biểu đồ, bản đồ, tranh, sơ đồ...) cùng với phần text để chấm bài chính xác — đặc biệt khi đánh giá Content.' : ''}
${hasStudentImage ? '\n⚠️ HỌC SINH NỘP BÀI BẰNG ẢNH (hình cuối cùng). Đây là ảnh chụp bài viết tay hoặc scan của học sinh. Hãy:\n1. ĐỌC KỸ toàn bộ nội dung chữ viết trong hình ảnh đó.\n2. Tự transcribe (ghi lại) bài viết của học sinh trước khi chấm.\n3. Nếu một số từ khó đọc, cố gắng đoán dựa trên ngữ cảnh — đừng bỏ qua.\n4. Chấm bài dựa trên nội dung đã đọc được từ hình ảnh.' : ''}

══ BƯỚC 1 — ĐỌC ẢNH ĐỀ VÀ ĐIỀN image_content (BẮT BUỘC TRƯỚC MỌI THỨ) ══
Đọc KỸ toàn bộ hình ảnh đề bài (nếu có) VÀ text đề. Điền vào image_content theo loại bài:

• Bài có NOTES/CUES bắt buộc (PET Part 1, FCE Part 1, KET Part 1):
  → Liệt kê NGUYÊN VĂN từng note/bullet point từ ảnh (thường là chú thích mũi tên/in nghiêng bên lề email, hoặc bullet points).
  → Ví dụ: ["Me too!", "Tell Charlie which sport", "Yes, but...", "Suggest what to bring"]

• Bài có BIỂU ĐỒ / SỐ LIỆU (IELTS Task 1 Academic):
  → Liệt kê: loại biểu đồ, tiêu đề, trục X/Y (đơn vị), TẤT CẢ số liệu nổi bật, xu hướng chính.
  → Ví dụ: ["Type: Bar chart", "Title: Internet users 1990-2020", "Y-axis: millions", "UK: 1990=5, 2000=20, 2010=50, 2020=65", "US: 1990=15, 2000=100, 2010=220, 2020=300", "Trend: Both countries grew rapidly, US always higher"]

• Bài có TRANH / ẢNH MÔ TẢ (KET Part 2, APTIS Part 3 group chat):
  → Mô tả ngắn gọn từng tranh/panel/message theo thứ tự.
  → Ví dụ KET Part 2: ["Picture 1: Boy finds lost puppy in park", "Picture 2: He puts up Found posters", "Picture 3: Family reunited with dog"]
  → Ví dụ APTIS chat: ["Tom: Do you prefer working from home?", "Sarah: Yes, I love the flexibility! What about you?", "Alex: Not really, I miss socialising in the office."]

• Bài có MAP / SƠ ĐỒ / PROCESS (IELTS Task 1):
  → Liệt kê các đặc điểm/thay đổi chính từ ảnh.

• Đề KHÔNG có ảnh HOẶC ảnh không định nghĩa yêu cầu bài (IELTS Task 2 essay, FCE/PET Part 2 open task):
  → Để image_content = []

⚠️ TUYỆT ĐỐI không tự bịa dữ liệu/notes hay lấy từ bài khác. Nếu ảnh mờ/không rõ, ghi "(không đọc được rõ)" thay vì đoán.

══ BƯỚC 2 — CHẤM BÀI HỌC SINH ══
• Dùng image_content làm chuẩn: học sinh có đề cập đúng và đủ các yêu cầu trong image_content không.
• Thiếu/sai → phản ánh trong điểm Content và comment, ghi rõ phần nào bị thiếu/sai.

══ BƯỚC 3 — VIẾT BÀI MẪU (suggested_writing) ══
• Nếu image_content không rỗng: bài mẫu PHẢI bám sát từng mục trong image_content theo đúng thứ tự.
• KHÔNG bịa thêm nội dung ngoài image_content (trừ intro, outro, own idea của FCE Part 1).
• Nếu image_content rỗng: viết theo yêu cầu text đề bài.

Quy tắc chung:
- Mọi nhận xét (comment, summary, suggestions, suggested_notes) viết bằng TIẾNG VIỆT, cụ thể, mang tính xây dựng, kèm ví dụ ngắn.
- criteria: danh sách tiêu chí, mỗi tiêu chí gồm name (song ngữ), score, max, comment.
- summary: 2–3 câu tổng quan bằng tiếng Việt.
- suggestions: 3–5 gợi ý cải thiện cụ thể bằng tiếng Việt.
- suggested_writing: BÀI MẪU HOÀN CHỈNH bằng TIẾNG ANH, đúng độ dài và format yêu cầu. Bám sát yêu cầu đề (image_content nếu có), KHÔNG viết generic. Đạt Band/Level cao nhất phù hợp kỳ thi.
- suggested_notes: Giải thích TIẾNG VIỆT ngắn gọn (3–5 câu) vì sao bài mẫu đạt điểm cao — nêu cụ thể bài mẫu đã đề cập những notes/điểm nào của đề.
- error_list: Danh sách LỖI CHI TIẾT để học sinh take notes — liệt kê 5–12 lỗi quan trọng nhất, bao gồm ĐỦ 4 loại (nếu bài có):
  • category: "Grammar" | "Vocabulary" | "Punctuation" | "Style/Register"
  • error: copy NGUYÊN VĂN đoạn sai từ bài học sinh (1–10 từ), hoặc mô tả ngắn nếu là lỗi cấu trúc/style.
  • correction: cách viết/diễn đạt ĐÚNG bằng tiếng Anh.
  • explanation: giải thích TẠI SAO sai — 2–3 câu tiếng Việt, cụ thể, có thể ghi vào vở. Ví dụ: "Động từ 'go' cần chia ở thì Simple Past vì câu có trạng từ 'yesterday'. Dạng quá khứ của 'go' là 'went', không phải 'goed'."
  • rule: quy tắc/pattern ngắn để nhớ lâu — tiếng Việt, ≤ 15 từ. Ví dụ: "yesterday/last week/ago → dùng V-ed (Simple Past)".
  Lưu ý: Bao gồm lỗi punctuation (thiếu dấu phẩy sau mệnh đề if, dấu câu cuối câu...) và style (quá informal trong formal writing, lặp từ, câu quá ngắn/đơn giản...) — không chỉ grammar và vocabulary.
${hasStudentImage ? '- annotations: [] (bài nộp bằng ảnh — không thể highlight trực tiếp).' : `- annotations: Xác định 4–8 LỖI QUAN TRỌNG NHẤT trong bài. Mỗi lỗi gồm:
  • text: COPY NGUYÊN VĂN đúng từng ký tự (kể cả lỗi chính tả) đoạn sai từ bài học sinh, 1–7 từ, ĐỦ NGẮN để khoanh đúng chỗ sai.
  • type: "grammar" | "vocabulary" | "cohesion" | "spelling"
  • correction: cách viết đúng (tiếng Anh)
  • explanation: lý do ngắn (tiếng Việt, ≤ 12 từ)
  ⚠️ Trường text phải khớp CHÍNH XÁC ký tự trong bài — không được paraphrase hay sửa lỗi trong text, chỉ ghi lại nguyên văn.`}`;
}

function buildUserText(exercise, essay) {
  return `KỲ THI: ${exercise.program} — Kỹ năng: ${exercise.skill}\n` +
    `ĐỀ BÀI: ${exercise.title}\n${exercise.content || ''}\n\n` +
    `BÀI VIẾT CỦA HỌC SINH:\n"""\n${essay}\n"""`;
}

// ===== Claude (Anthropic SDK) =====
const ANNOTATION_ITEM_SCHEMA = {
  type: 'object',
  properties: {
    text:        { type: 'string' },
    type:        { type: 'string' },
    correction:  { type: 'string' },
    explanation: { type: 'string' }
  },
  required: ['text', 'type', 'correction', 'explanation'],
  additionalProperties: false
};

const ERROR_NOTE_SCHEMA = {
  type: 'object',
  properties: {
    category:    { type: 'string' },
    error:       { type: 'string' },
    correction:  { type: 'string' },
    explanation: { type: 'string' },
    rule:        { type: 'string' }
  },
  required: ['category', 'error', 'correction', 'explanation', 'rule'],
  additionalProperties: false
};

const CLAUDE_SCHEMA = {
  type: 'object',
  properties: {
    image_content:    { type: 'array', items: { type: 'string' } },
    overall_score:    { type: 'number' },
    scale_label:      { type: 'string' },
    criteria: {
      type: 'array',
      items: {
        type: 'object',
        properties: { name: { type: 'string' }, score: { type: 'number' }, max: { type: 'number' }, comment: { type: 'string' } },
        required: ['name', 'score', 'max', 'comment'], additionalProperties: false
      }
    },
    summary:          { type: 'string' },
    suggestions:      { type: 'array', items: { type: 'string' } },
    suggested_writing:{ type: 'string' },
    suggested_notes:  { type: 'string' },
    error_list:       { type: 'array', items: ERROR_NOTE_SCHEMA },
    annotations:      { type: 'array', items: ANNOTATION_ITEM_SCHEMA }
  },
  required: ['overall_score', 'scale_label', 'criteria', 'summary', 'suggestions', 'suggested_writing', 'suggested_notes', 'annotations'],
  additionalProperties: false
};

async function gradeWithClaude(exercise, essay, imageData, studentImage) {
  const client = new Anthropic();
  const model  = process.env.ANTHROPIC_MODEL || 'claude-opus-4-8';
  const contentParts = [];
  if (imageData) {
    contentParts.push({ type: 'image', source: { type: 'base64', media_type: imageData.mimeType, data: imageData.base64 } });
  }
  if (studentImage) {
    contentParts.push({ type: 'text', text: '--- HÌNH ẢNH BÀI LÀM CỦA HỌC SINH (đọc chữ viết từ hình này để chấm) ---' });
    contentParts.push({ type: 'image', source: { type: 'base64', media_type: studentImage.mimeType, data: studentImage.base64 } });
  }
  contentParts.push({ type: 'text', text: buildUserText(exercise, studentImage ? '(học sinh nộp bài bằng ảnh — xem hình ảnh bài làm ở trên)' : essay) });
  const resp = await client.messages.create({
    model, max_tokens: 12000, system: buildSystem(exercise, !!studentImage),
    messages: [{ role: 'user', content: contentParts }],
    output_config: { format: { type: 'json_schema', schema: CLAUDE_SCHEMA } }
  });
  const block = resp.content.find(b => b.type === 'text');
  if (!block || !block.text) throw new Error('Claude: phản hồi rỗng hoặc không có text block');
  try {
    return JSON.parse(block.text);
  } catch (parseErr) {
    throw new Error('Claude JSON parse thất bại: ' + parseErr.message + ' — snippet: ' + block.text.slice(0, 150));
  }
}

// ===== Gemini (Google) — REST =====
const GEMINI_SCHEMA = {
  type: 'OBJECT',
  properties: {
    overall_score:    { type: 'NUMBER' },
    scale_label:      { type: 'STRING' },
    criteria: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: { name: { type: 'STRING' }, score: { type: 'NUMBER' }, max: { type: 'NUMBER' }, comment: { type: 'STRING' } },
        required: ['name', 'score', 'max', 'comment']
      }
    },
    summary:          { type: 'STRING' },
    suggestions:      { type: 'ARRAY', items: { type: 'STRING' } },
    suggested_writing:{ type: 'STRING' },
    suggested_notes:  { type: 'STRING' },
    image_content:    { type: 'ARRAY', items: { type: 'STRING' } },
    error_list: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          category:    { type: 'STRING' },
          error:       { type: 'STRING' },
          correction:  { type: 'STRING' },
          explanation: { type: 'STRING' },
          rule:        { type: 'STRING' }
        },
        required: ['category', 'error', 'correction', 'explanation', 'rule']
      }
    },
    annotations: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          text:        { type: 'STRING' },
          type:        { type: 'STRING' },
          correction:  { type: 'STRING' },
          explanation: { type: 'STRING' }
        },
        required: ['text', 'type', 'correction', 'explanation']
      }
    }
  },
  required: ['overall_score', 'scale_label', 'criteria', 'summary', 'suggestions', 'suggested_writing', 'suggested_notes', 'annotations']
};

async function gradeWithGemini(exercise, essay, imageData, studentImage) {
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const url   = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const parts = [];
  if (imageData) {
    parts.push({ inline_data: { mime_type: imageData.mimeType, data: imageData.base64 } });
  }
  if (studentImage) {
    parts.push({ text: '--- HÌNH ẢNH BÀI LÀM CỦA HỌC SINH (đọc chữ viết từ hình này để chấm) ---' });
    parts.push({ inline_data: { mime_type: studentImage.mimeType, data: studentImage.base64 } });
  }
  parts.push({ text: buildUserText(exercise, studentImage ? '(học sinh nộp bài bằng ảnh — xem hình ảnh bài làm ở trên)' : essay) });

  const baseBody = {
    system_instruction: { parts: [{ text: buildSystem(exercise, !!studentImage) }] },
    contents: [{ role: 'user', parts }],
    generationConfig: { responseMimeType: 'application/json', responseSchema: GEMINI_SCHEMA }
  };

  // Lần 1: có thinking (chính xác hơn); Lần 2: không thinking (nhanh hơn, dùng làm fallback)
  const attempts = [
    { maxOutputTokens: 10000, thinkingBudget: 8000 },
    { maxOutputTokens: 8000,  thinkingBudget: 0    }
  ];
  let lastErr;
  for (let i = 0; i < attempts.length; i++) {
    const cfg = attempts[i];
    try {
      return await callGemini(url, process.env.GEMINI_API_KEY, {
        ...baseBody,
        generationConfig: { ...baseBody.generationConfig, maxOutputTokens: cfg.maxOutputTokens, thinkingConfig: { thinkingBudget: cfg.thinkingBudget } }
      }, 90000);
    } catch (e) {
      lastErr = e;
      if (i < attempts.length - 1) console.warn('[AI] grading attempt ' + (i + 1) + ' failed: ' + e.message + ' — retrying...');
    }
  }
  throw lastErr;
}

async function gradeWriting(exercise, essay, studentImage) {
  const p         = provider();
  const imageData = await fetchImageBase64(exercise.image_url);
  if (p === 'gemini') return gradeWithGemini(exercise, essay, imageData, studentImage || null);
  if (p === 'claude') return gradeWithClaude(exercise, essay, imageData, studentImage || null);
  throw new Error('Chưa cấu hình AI');
}

// ============================================================
// APTIS WRITING FULL TEST — chấm 4 components cùng lúc
// Bám sát 100% APTIS ESOL General Candidate Guide (British Council 2023)
// ============================================================

function buildAptisSystem() {
  return `Bạn là giám khảo chấm Writing của British Council, chuyên kỳ thi APTIS ESOL General.
Bài thi APTIS Writing gồm 4 Parts (components), MỖI PART có thang điểm RIÊNG và tiêu chí RIÊNG.
Chấm từng component theo đúng thang và tiêu chí bên dưới, sau đó mới tính điểm toàn bài.

════════════════════════════════════════════════
PART 1 — Word-level Writing (chỉ từ đơn lẻ, 5 tin nhắn)
Thang điểm: 0–3
Tiêu chí DUY NHẤT: Task Fulfilment & Communicative Competence
⚠️ QUAN TRỌNG: Spelling, capitalisation, grammar KHÔNG được tính ở Part 1 — chỉ đánh giá xem câu trả lời có INTELLIGIBLE (hiểu được) và ĐÚNG YÊU CẦU không.
• 3 (above A1): TẤT CẢ 5 câu trả lời đều intelligible. Học sinh hoàn thành task hoàn toàn.
• 2 (A1.2): 3–4 câu intelligible. 1–2 câu bị lỗi cản trở hiểu nghĩa.
• 1 (A1.1): 1–2 câu intelligible. 2–3 câu bị lỗi cản trở hiểu nghĩa.
• 0 (A0): Không có câu nào intelligible.

════════════════════════════════════════════════
PART 2 — Short Text Writing (20–30 từ, form filling)
Thang điểm: 0–5
Tiêu chí: Task Fulfilment/Topic Relevance + Grammatical Range & Accuracy + Punctuation + Vocabulary Range & Accuracy + Cohesion
• 5 (B1+): Likely above A2 level — vượt trội so với các mô tả dưới.
• 4 (A2.2): On topic. Simple grammar structures — errors do NOT impede understanding. Mostly accurate punctuation/spelling. Vocab sufficient. Some simple connectors/cohesive devices used.
• 3 (A2.1): On topic. Simple grammar — errors impede understanding in PARTS. Noticeable punctuation/spelling mistakes. Vocab mostly sufficient but inappropriate choices noticeable. List of sentences with NO connectors.
• 2 (A1.2): Not fully on topic. Grammar limited to words/phrases; errors impede understanding. Little/no accurate punctuation; common spelling mistakes. Vocab limited to basic words — insufficient for task. No cohesion.
• 1 (A1.1): Response limited to a few words/phrases. Grammar and vocab errors so serious meaning is unintelligible.
• 0 (A0): No meaningful language OR completely off-topic (memorised script/guessing).

════════════════════════════════════════════════
PART 3 — Three Written Parts (30–40 từ/reply, social media-type)
Thang điểm: 0–5
Tiêu chí: Task Fulfilment/Topic Relevance + Punctuation + Grammatical Range & Accuracy + Vocabulary Range & Accuracy + Cohesion
Đánh giá DỰA TRÊN SỐ CÂU TRẢ LỜI ON-TOPIC trong tổng 3 replies:
• 5 (B2+): Likely above B1 level — vượt trội so với các mô tả dưới.
• 4 (B1.2): CẢ 3 replies on topic. Control of simple grammar; errors occur with complex structures. Punctuation/spelling mostly accurate; errors do NOT impede. Vocab sufficient. Simple cohesive devices linking sentences.
• 3 (B1.1): 2/3 replies on topic. [Cùng đặc điểm ngôn ngữ như Band 4.]
• 2 (A2.2): Ít nhất 2/3 replies on topic. Simple grammar — errors common, sometimes impede. Noticeable spelling/punctuation. Vocab insufficient; inappropriate choices sometimes impede. Responses are LISTS of sentences, not organised as cohesive texts.
• 1 (A2.1): 1/3 reply on topic. [Cùng đặc điểm ngôn ngữ như Band 2.]
• 0: Below A2. No meaningful language. Off-topic.

════════════════════════════════════════════════
PART 4 — Formal & Informal Email Writing
Task 1: Email ngắn 40–50 từ (informal — viết cho bạn/người thân gần gũi)
Task 2: Email dài 120–150 từ (formal — viết cho công ty/người lạ)
Thang điểm: 0–6
Tiêu chí: Task Fulfilment & Register + Grammatical Range & Accuracy + Vocabulary Range & Accuracy + Punctuation + Fluency & Cohesion
⚠️ REGISTER là tiêu chí trọng yếu: Task 1 PHẢI informal (thân mật), Task 2 PHẢI formal (trang trọng).
• 6 (C2): Likely above C1 level.
• 5 (C1): On topic + HAI REGISTERS RÕ RÀNG KHÁC NHAU (clearly different). Range of COMPLEX grammar used accurately; minor errors. Range of vocab; some awkward usage. Range of cohesive devices clearly indicating links.
• 4 (B2.2): On topic + REGISTER PHÙ HỢP NHẤT QUÁN Ở CẢ 2 emails. Some complex grammar accurately; errors do NOT lead to misunderstanding. Minor punctuation/spelling errors. Sufficient vocab range. LIMITED number of cohesive devices.
• 3 (B2.1): Partially on topic + REGISTER PHÙ HỢP NHẤT QUÁN Ở 1/2 email. [Cùng đặc điểm ngôn ngữ như Band 4.]
• 2 (B1.2): Partially on topic + REGISTER KHÔNG PHÙ HỢP Ở CẢ 2 emails. Simple grammar control; errors with complex structures. Mostly accurate punctuation/spelling; errors do NOT impede. Limited vocab — errors impede in PARTS. Only simple cohesive devices.
• 1 (B1.1): Not on topic + KHÔNG CÓ BẰNG CHỨNG nhận thức về register. Simple grammar; errors with complex. Mostly accurate punctuation. Limited vocab — errors impede in MOST text. Only simple cohesive devices.
• 0 (A1/A2): Below B1. No meaningful language. Off-topic.

════════════════════════════════════════════════
TÍNH ĐIỂM TOÀN BÀI:
Chuẩn hóa về thang 0–5:
  C1_norm = (C1_score / 3) × 5
  C2_norm = C2_score  (đã 0–5)
  C3_norm = C3_score  (đã 0–5)
  C4_norm = (C4_score / 6) × 5
overall_score = (C1_norm×10% + C2_norm×20% + C3_norm×30% + C4_norm×40%), thang 0–5, làm tròn 0.5.
scale_label = "APTIS Writing (0–5)"

Quy tắc JSON output:
- criteria: ĐÚNG 4 mục, mỗi mục là 1 component:
  • name: "Part 1 — Word-level Writing (0–3)" | score: [0–3] | max: 3
  • name: "Part 2 — Short Text Writing (0–5)" | score: [0–5] | max: 5
  • name: "Part 3 — Group Chat Replies (0–5)" | score: [0–5] | max: 5
  • name: "Part 4 — Formal & Informal Email (0–6)" | score: [0–6] | max: 6
  Mỗi comment: giải thích TIẾNG VIỆT cụ thể vì sao cho điểm đó, dẫn ví dụ từ bài làm.
- summary: 2–3 câu tổng quan tiếng Việt — điểm mạnh và yếu chính từng component.
- suggestions: 4–5 gợi ý cải thiện tiếng Việt, ưu tiên component điểm thấp nhất.
- suggested_writing: Bài mẫu TIẾNG ANH cho Part 4 Task 2 (120–150 từ, formal register, đáp ứng đúng đề bài cụ thể, KHÔNG generic). BẮT BUỘC dùng đúng formal register.
- suggested_notes: Giải thích TIẾNG VIỆT 3–5 câu vì sao bài mẫu đạt điểm cao theo rubric Part 4.
- image_content: [] (APTIS không có ảnh đề — để mảng rỗng)
- error_list: Liệt kê 5–10 lỗi nổi bật nhất từ TOÀN BỘ 4 parts, ưu tiên lỗi lặp đi lặp lại. Mỗi lỗi gồm: category (Grammar/Vocabulary/Punctuation/Style), error (copy nguyên văn), correction (cách đúng), explanation (2–3 câu tiếng Việt), rule (quy tắc ≤15 từ tiếng Anh).`;
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
    const baseBody = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: { responseMimeType: 'application/json', responseSchema: GEMINI_SCHEMA }
    };
    // Retry: lần 1 không thinking (APTIS đã phức tạp, không cần), lần 2 fallback token nhỏ hơn
    const attempts = [
      { maxOutputTokens: 10000, thinkingBudget: 0 },
      { maxOutputTokens: 7000,  thinkingBudget: 0 }
    ];
    let lastErr;
    for (let i = 0; i < attempts.length; i++) {
      const cfg = attempts[i];
      try {
        return await callGemini(url, process.env.GEMINI_API_KEY, {
          ...baseBody,
          generationConfig: { ...baseBody.generationConfig, maxOutputTokens: cfg.maxOutputTokens, thinkingConfig: { thinkingBudget: cfg.thinkingBudget } }
        }, 90000);
      } catch (e) {
        lastErr = e;
        if (i < attempts.length - 1) console.warn('[AI] APTIS grading attempt ' + (i + 1) + ' failed: ' + e.message + ' — retrying...');
      }
    }
    throw lastErr;
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
    if (!block || !block.text) throw new Error('Claude: phản hồi rỗng');
    try { return JSON.parse(block.text); } catch (e) { throw new Error('Claude JSON parse thất bại: ' + e.message); }
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
    image_content:    { type: 'array', items: { type: 'string' } },
    outline:        { type: 'string' },
    key_vocabulary: { type: 'array', items: { type: 'string' } },
    useful_phrases: { type: 'array', items: { type: 'string' } },
    criteria_tips:  { type: 'array', items: { type: 'string' } },
    dos_and_donts:  { type: 'array', items: { type: 'string' } },
    time_guide:     { type: 'string' }
  },
  required: ['task_type','image_content','outline','key_vocabulary','useful_phrases','criteria_tips','dos_and_donts','time_guide'],
  additionalProperties: false
};

const HINTS_GEMINI_SCHEMA = {
  type: 'OBJECT',
  properties: {
    task_type:      { type: 'STRING' },
    image_content:    { type: 'ARRAY', items: { type: 'STRING' } },
    outline:        { type: 'STRING' },
    key_vocabulary: { type: 'ARRAY', items: { type: 'STRING' } },
    useful_phrases: { type: 'ARRAY', items: { type: 'STRING' } },
    criteria_tips:  { type: 'ARRAY', items: { type: 'STRING' } },
    dos_and_donts:  { type: 'ARRAY', items: { type: 'STRING' } },
    time_guide:     { type: 'STRING' }
  },
  required: ['task_type','image_content','outline','key_vocabulary','useful_phrases','criteria_tips','dos_and_donts','time_guide']
};

function buildHintsSystem(exercise) {
  const hasImage = !!exercise.image_url;
  const isIelts  = exercise.program === 'IELTS';
  const isTask1  = isIelts && /task\s*1/i.test(exercise.title || '');
  const isTask2  = isIelts && !isTask1;

  const ieltsHintsGuide = !isIelts ? '' : `
══ NGUỒN THAM KHẢO ĐỂ TẠO GỢI Ý IELTS ══
${isTask1 ? `IELTS Task 1 — dàn bài, từ vựng và useful phrases tham khảo từ:
  • IELTS Simon (ielts-simon.com) — overview structure, data grouping pattern đơn giản chuẩn Band 7-8
  • IELTS Liz (ieltsliz.com) — academic vocabulary cho từng loại biểu đồ, mẫu câu intro/overview
  • IELTS Advantage (ieltsadvantage.com) — dynamic vs static chart vocabulary
  • E2 IELTS — model answers kèm Band score phân tích
Khi tạo dàn bài: học cách NHÓM DỮ LIỆU từ image_content (không liệt kê hết); overview pattern "Overall, it is clear that..."; academic phrases "rose significantly", "saw a sharp decline", "remained relatively stable".` : `IELTS Task 2 — dàn bài, từ vựng và useful phrases tham khảo từ:
  • IELTS Simon (ielts-simon.com) — "4-sentence introduction", paragraph structure Band 9
  • IELTS Liz (ieltsliz.com) — model essays Band 9, topic vocabulary theo chủ đề
  • IELTS 1984 (blog) — argument development, topic sentences chuẩn Band 7-8
  • The IELTS Workshop (theieltsworkshop.com) — body paragraph structure: claim + explanation + example
  • DOL English / IELTS Nguyễn Huyền — lexical resource, academic collocation, less common vocabulary
  • IELTS Fighter — topic vocabulary phân loại theo chủ đề
Khi tạo dàn bài: gợi ý ideas CỤ THỂ (không chung chung), mỗi body paragraph gợi ý topic sentence + 1 example cụ thể; useful phrases phải là less common lexis Band 7+.`}`;

  return `Bạn là giáo viên luyện thi Cambridge/IELTS/APTIS giàu kinh nghiệm. Nhiệm vụ: tạo GỢI Ý LÀM BÀI chính xác và cụ thể cho ĐỀ BÀI CỤ THỂ NÀY.${ieltsHintsGuide}

══ BƯỚC 1 — ĐỌC ẢNH ĐỀ VÀ ĐIỀN image_content (BẮT BUỘC ĐẦU TIÊN) ══
${hasImage ? '⚠️ ĐỀ CÓ HÌNH ẢNH — ĐỌC KỸ HÌNH TRƯỚC KHI LÀM BẤT CỨ ĐIỀU GÌ.' : ''}
Điền image_content theo loại bài (mảng các string tiếng Anh):

• Bài có NOTES/CUES bắt buộc (PET Part 1, FCE Part 1, KET Part 1):
  → Liệt kê nguyên văn từng note/bullet point từ ảnh (chú thích mũi tên/in nghiêng bên lề email, hoặc bullet points).
  → PET Part 1: notes là những ghi chú ngắn CẠNH email gốc, KHÔNG phải nội dung email gốc.
  → Ví dụ: ["Me too!", "Tell Charlie which sport", "Yes, but...", "Suggest what to bring"]

• Bài có BIỂU ĐỒ / SỐ LIỆU (IELTS Task 1 Academic):
  → Loại biểu đồ, tiêu đề, trục, TẤT CẢ số liệu/xu hướng chính thấy trong ảnh.
  → Ví dụ: ["Type: Line graph", "Title: Electricity consumption 1990-2020", "Y: terawatt-hours", "Country A: rose from 100 to 350", "Country B: fell from 200 to 150", "Crossover: around 2005"]

• Bài có TRANH (KET Part 2) hoặc GROUP CHAT (APTIS Part 3):
  → KET: mô tả ngắn gọn từng bức tranh theo thứ tự.
  → APTIS: ghi lại nội dung từng tin nhắn chat theo thứ tự.

• Bài có MAP / SƠ ĐỒ / PROCESS DIAGRAM (IELTS Task 1):
  → Liệt kê các thay đổi/đặc điểm chính thấy trong ảnh.

• Đề không có ảnh HOẶC ảnh không định nghĩa yêu cầu (IELTS Task 2, FCE/PET Part 2):
  → image_content = []

⚠️ KHÔNG tự bịa dữ liệu/notes — nếu ảnh không rõ, ghi "(không đọc rõ)".

══ BƯỚC 2 — TẠO GỢI Ý DỰA TRÊN image_content ══

task_type: Tên dạng bài + thông tin nổi bật (ví dụ: "PET Part 1 — Email (4 notes bắt buộc)", "IELTS Task 1 — Bar Chart", "KET Part 2 — Picture Story (3 tranh)").

outline: Dàn bài CHI TIẾT bằng TIẾNG VIỆT — XÂY DỰNG HOÀN TOÀN TỪ image_content:
  • image_content KHÔNG rỗng (notes): mỗi item = 1 mục. Viết rõ "[item nguyên văn] — cần viết: [giải thích cụ thể + ví dụ content 2–3 câu]". Đúng thứ tự. KHÔNG thêm ý ngoài (trừ FCE Part 1 thêm 1 own idea).
  • image_content KHÔNG rỗng (biểu đồ): dàn bài gồm intro → overview → 2 đoạn body nhóm theo xu hướng/đặc điểm, gợi ý cụ thể số liệu nào nêu ở đoạn nào.
  • image_content KHÔNG rỗng (tranh/chat): dàn bài theo từng tranh/message, gợi ý nội dung viết cho từng cái.
  • image_content rỗng: dàn bài chuẩn theo dạng bài (IELTS Task 2 4 đoạn, PET/FCE Part 2 mở bài/thân/kết...).

key_vocabulary: 8–10 từ/cụm tiếng Anh CỤ THỂ cho chủ đề/nội dung ĐỀ NÀY (từ ảnh + text đề). Dạng "từ/cụm (nghĩa tiếng Việt)". Không dùng từ chung chung áp dụng mọi đề.

useful_phrases: 6–8 cụm/câu tiếng Anh mẫu. Ưu tiên cụm triển khai trực tiếp từng item trong image_content.

criteria_tips: Đúng 4 gợi ý — mỗi gợi ý ứng 1 tiêu chí chấm chính thức của kỳ thi này, bắt đầu "[Tên tiêu chí]: ...". CỤ THỂ cho đề này.
  • Tiêu chí Content/Task Achievement: nhắc đáp ứng đủ TẤT CẢ yêu cầu trong image_content (nếu có), nêu rõ rủi ro thiếu sót.

dos_and_donts: 5–6 lưu ý mix ✅ DOs và ❌ DON'Ts. CỤ THỂ cho đề này — không viết chung chung.
  • Nếu image_content không rỗng: PHẢI có "❌ Không bỏ sót hay tự bịa — chỉ viết đúng những gì thấy trong đề (image_content)".

time_guide: Gợi ý phân bổ thời gian phù hợp kỳ thi + dạng bài này.`;
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
    const baseBody = {
      system_instruction: { parts: [{ text: sysPrompt }] },
      contents: [{ role: 'user', parts }],
      generationConfig: { responseMimeType: 'application/json', responseSchema: HINTS_GEMINI_SCHEMA }
    };
    // Lần 1: có thinking; Lần 2: không thinking (fallback nhanh hơn)
    const attempts = [
      { maxOutputTokens: 5000, thinkingBudget: 8000 },
      { maxOutputTokens: 4000, thinkingBudget: 0    }
    ];
    let lastErr;
    for (let i = 0; i < attempts.length; i++) {
      const cfg = attempts[i];
      try {
        return await callGemini(url, process.env.GEMINI_API_KEY, {
          ...baseBody,
          generationConfig: { ...baseBody.generationConfig, maxOutputTokens: cfg.maxOutputTokens, thinkingConfig: { thinkingBudget: cfg.thinkingBudget } }
        }, 80000);
      } catch (e) {
        lastErr = e;
        if (i < attempts.length - 1) console.warn('[AI] hints attempt ' + (i + 1) + ' failed: ' + e.message + ' — retrying...');
      }
    }
    throw lastErr;
  }

  if (p === 'claude') {
    const client       = new Anthropic();
    const model        = process.env.ANTHROPIC_MODEL || 'claude-opus-4-8';
    const contentParts = [];
    if (imageData) contentParts.push({ type: 'image', source: { type: 'base64', media_type: imageData.mimeType, data: imageData.base64 } });
    contentParts.push({ type: 'text', text: userText });
    const resp = await client.messages.create({
      model, max_tokens: 8000, system: sysPrompt,
      messages: [{ role: 'user', content: contentParts }],
      output_config: { format: { type: 'json_schema', schema: HINTS_CLAUDE_SCHEMA } }
    });
    const block = resp.content.find(b => b.type === 'text');
    if (!block || !block.text) throw new Error('Claude hints: phản hồi rỗng');
    try { return JSON.parse(block.text); } catch (e) { throw new Error('Claude hints JSON parse thất bại: ' + e.message); }
  }

  throw new Error('Chưa cấu hình AI');
}

module.exports = { aiEnabled, gradeWriting, gradeAptisWriting, getWritingHints, provider };
