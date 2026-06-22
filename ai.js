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

// Rubric PET — bám sát 100% Cambridge B1 Assessment Scales (UCLES 2014)
// 4 tiêu chí: Content, Communicative Achievement, Organisation, Language (mỗi tiêu chí 0–5)
// Band 4 = chia sẻ đặc điểm Band 3 và Band 5; Band 2 = chia sẻ đặc điểm Band 1 và Band 3
function petRubric(title) {
  const isPart1 = /part\s*1/i.test(title);

  const partIntro = isPart1
    ? `PET (B1 Preliminary) WRITING PART 1 — Email/thư (~100 từ).

══ YÊU CẦU ĐẶC THÙ PART 1 — BẮT BUỘC ĐỌC TRƯỚC KHI CHẤM ══
Đề bài LUÔN cung cấp NOTES (bullet points) mà học sinh BẮT BUỘC phải đề cập ĐẦY ĐỦ.
Bước 1: Đọc kỹ đề, liệt kê CHÍNH XÁC từng note được yêu cầu.
Bước 2: Kiểm tra từng note — học sinh có đề cập rõ ràng không.
Bước 3: Content bị hạ điểm nếu thiếu note hoặc thêm nội dung không liên quan.
Bước 4: Communicative Achievement — kiểm tra register (informal/semi-formal), format email/thư đúng quy ước (có greeting, sign-off).`
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
    ? 'BẮT BUỘC với Part 1: (a) Đọc kỹ đề, xác định TẤT CẢ các notes được liệt kê. (b) Đề cập ĐẦY ĐỦ từng note theo đúng thứ tự, triển khai mỗi note thành 1–2 câu tự nhiên. (c) Dùng đúng format email/thư (greeting + nội dung theo notes + sign-off). (d) Register phù hợp với người nhận trong đề. (e) KHÔNG bịa thêm nội dung ngoài phạm vi notes.'
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

BẮT BUỘC trước khi chấm:
1. Xác định Task 1 là Academic (biểu đồ/số liệu/diagram) hay General Training (thư).
2. Đọc kỹ đề và hình ảnh (nếu có) — ghi nhận TẤT CẢ xu hướng, số liệu nổi bật, điểm so sánh.
3. Academic: kiểm tra có overview (tổng quan xu hướng chính) không — đây là yêu cầu bắt buộc từ Band 7+.
4. General Training: kiểm tra có đủ bullet points, rõ mục đích thư, đúng tone không.
5. Kiểm tra độ dài: dưới 150 từ → phạt Task Achievement nặng. Dưới 20 từ → Band 1.

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

HƯỚNG DẪN CHẤM ĐỂ ĐẠT ĐỘ CHÍNH XÁC CAO:
• Mỗi tiêu chí được chấm ĐỘC LẬP — không để tiêu chí này ảnh hưởng tiêu chí kia.
• Half-bands (ví dụ: 6.5, 7.5) được sử dụng khi bài "nằm giữa" hai band.
• "A script must fully fit the positive features of the descriptor at a particular level" — nếu bài không đáp ứng hoàn toàn Band 7 thì cho Band 6 hoặc 6.5.
• Chữ in đậm trong PDF là NEGATIVE features — nếu có negative feature của Band X thì không thể đạt Band X+1.

suggested_writing: Viết bài mẫu Task 1 TIẾNG ANH 150–180 từ.
BẮT BUỘC: (a) Phân tích KỸ đề và hình ảnh (nếu có) — ghi nhận TẤT CẢ xu hướng, số liệu, điểm so sánh. (b) Có overview (1–2 câu mô tả xu hướng tổng quát nhất — KHÔNG phải số liệu cụ thể) — đặt ở đoạn 2 (sau intro) hoặc ở cuối. (c) Đoạn thân bài: nhóm và so sánh dữ liệu THEO ĐẶC ĐIỂM/XU HƯỚNG — không liệt kê cơ học từng số. (d) Academic: dùng passive voice và hedging language phù hợp. (e) GT: viết đúng format thư (Dear..., Yours sincerely/faithfully). (f) Đạt Band 7–8.`;
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

HƯỚNG DẪN CHẤM ĐỂ ĐẠT ĐỘ CHÍNH XÁC CAO:
• Mỗi tiêu chí được chấm ĐỘC LẬP — không để tiêu chí này ảnh hưởng tiêu chí kia.
• Half-bands (ví dụ 6.5, 7.5) được dùng khi bài nằm giữa hai band — ví dụ: đáp ứng band 7 nhưng không hoàn toàn đạt band 8 → 7.5.
• "A script must FULLY FIT the positive features of the descriptor at a particular level" — tất cả negative features (in đậm trong PDF) của một band sẽ giới hạn điểm tối đa ở band đó.
• Task 2 có trọng số 2/3 trong IELTS Writing tổng. Điểm toàn bài IELTS Writing (nếu cần tính) = (T1_band × 1/3 + T2_band × 2/3), làm tròn về 0.5 gần nhất.

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

function buildSystem(exercise, hasStudentImage) {
  const hasImage = !!exercise.image_url;
  return `Bạn là giám khảo chấm Writing giàu kinh nghiệm cho các kỳ thi tiếng Anh quốc tế.
${rubricFor(exercise)}
${hasImage ? '\nĐề bài này có kèm HÌNH ẢNH ĐỀ BÀI (hình thứ nhất). Hãy phân tích kỹ nội dung hình (biểu đồ, bản đồ, tranh, sơ đồ...) cùng với phần text để chấm bài chính xác — đặc biệt khi đánh giá Content.' : ''}
${hasStudentImage ? '\n⚠️ HỌC SINH NỘP BÀI BẰNG ẢNH (hình cuối cùng). Đây là ảnh chụp bài viết tay hoặc scan của học sinh. Hãy:\n1. ĐỌC KỸ toàn bộ nội dung chữ viết trong hình ảnh đó.\n2. Tự transcribe (ghi lại) bài viết của học sinh trước khi chấm.\n3. Nếu một số từ khó đọc, cố gắng đoán dựa trên ngữ cảnh — đừng bỏ qua.\n4. Chấm bài dựa trên nội dung đã đọc được từ hình ảnh.' : ''}

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
  ⭐ **KHI VIẾT BÀI MẪU (suggested_writing)**: LUÔN tham khảo từ các kho bài mẫu uy tín sau để đảm bảo bài mẫu đạt chuẩn band cao và đáng tin cậy:
    • Youpass (youpass.io) — kho bài band 8-9 phân loại theo topics
    • IDP IELTS Official — official.ielts.org
    • IELTS Nguyễn Huyền — kho bài phân tích chi tiết criterion
    • IELTS 1984 — model essays Band 7-8 với giải thích
    • The IELTS Workshop — bài mẫu chuẩn Cambridge
    • DOL English — trang web IELTS uy tín
    • IELTS Fighter — bài mẫu band cao
    • Cambridge và British Council official resources
  🎯 Khi viết bài mẫu: tham khảo STRUCTURE, từ vựng Academic, ngữ pháp phức tạp từ các bài trên, rồi viết bài riêng (không copy-paste). Bài mẫu phải thể hiện đặc điểm Band 7-8: lexical range cao, complex structures, smooth cohesion, sophisticated argument.
- suggested_notes: Giải thích TIẾNG VIỆT ngắn gọn (3–5 câu) vì sao bài mẫu đạt điểm cao — nêu cụ thể bài mẫu đã đề cập những notes/điểm nào của đề.
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

const CLAUDE_SCHEMA = {
  type: 'object',
  properties: {
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
    model, max_tokens: 5000, system: buildSystem(exercise, !!studentImage),
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
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: buildSystem(exercise, !!studentImage) }] },
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
- suggested_notes: Giải thích TIẾNG VIỆT 3–5 câu vì sao bài mẫu đạt điểm cao theo rubric Part 4.`;
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
