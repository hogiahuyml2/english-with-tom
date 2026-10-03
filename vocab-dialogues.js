// Hội thoại điền nhiều chỗ trống — tự biên soạn.
// Định dạng mỗi dòng:  Người nói: câu có {đáp án đúng|nhiễu 1|nhiễu 2|nhiễu 3} || bản dịch tiếng Việt
// (đáp án ĐÚNG luôn đứng đầu trong dấu {}, giao diện sẽ tự xáo trộn khi hiển thị)

function parseScript(text) {
  const raw = String(text || '').split('\n').map(s => s.trim()).filter(Boolean);
  if (raw.length < 3) throw new Error('Hội thoại cần ít nhất 3 dòng.');
  if (raw.length > 16) throw new Error('Hội thoại tối đa 16 dòng.');
  const lines = [];
  let blanks = 0;
  raw.forEach((ln, i) => {
    const at = 'Dòng ' + (i + 1) + ': ';
    const m = ln.match(/^([^:{}|]{1,14}):\s*(.+)$/);
    if (!m) throw new Error(at + 'cần dạng "Tên người nói: câu thoại".');
    const [body, vi] = m[2].split('||').map(s => s.trim());
    if (!body) throw new Error(at + 'câu thoại trống.');
    const segs = [];
    let last = 0, mm;
    const re = /\{([^{}]*)\}/g;
    while ((mm = re.exec(body))) {
      if (mm.index > last) segs.push({ t: body.slice(last, mm.index) });
      const opts = mm[1].split('|').map(s => s.trim()).filter(Boolean);
      if (opts.length < 2 || opts.length > 5) throw new Error(at + 'mỗi chỗ trống cần 2–5 lựa chọn (đáp án đúng đứng đầu).');
      if (new Set(opts.map(o => o.toLowerCase())).size !== opts.length) throw new Error(at + 'các lựa chọn bị trùng nhau.');
      segs.push({ opts });
      blanks++;
      last = mm.index + mm[0].length;
    }
    if (last < body.length) segs.push({ t: body.slice(last) });
    if (/[{}]/.test(body.replace(/\{[^{}]*\}/g, ''))) throw new Error(at + 'dấu { } không khớp.');
    lines.push({ sp: m[1].trim(), segs, vi: vi || '' });
  });
  if (blanks < 2) throw new Error('Cần ít nhất 2 chỗ trống trong hội thoại.');
  if (blanks > 12) throw new Error('Tối đa 12 chỗ trống trong 1 hội thoại.');
  return { lines, blanks };
}

const RAW = [
  { level: 'KET', title: 'Ở nhà hàng', scene: 'Bạn đi ăn tối và gọi món', script: `
Waiter: Good evening! Here is the {menu|bill|ticket|receipt}. || Chào buổi tối! Đây là thực đơn ạ.
You: Thank you. I would like to {order|borrow|invite|practise} a chicken sandwich, please. || Cảm ơn. Cho tôi gọi một bánh sandwich gà.
Waiter: Would you like anything to drink? || Quý khách muốn uống gì không ạ?
You: A glass of water, please. I am very {hungry|crowded|cloudy|tidy}! || Một ly nước ạ. Tôi đói quá!
Waiter: Here is your food. Enjoy your meal! || Món của quý khách đây. Chúc ngon miệng!
You: It is {delicious|boring|expensive|busy}. Can I have the {bill|passport|luggage|timetable}, please? || Ngon quá. Cho tôi xin hóa đơn nhé?
` },
  { level: 'KET', title: 'Ở cửa hàng quần áo', scene: 'Bạn mua một chiếc áo khoác', script: `
Shop assistant: Hello! Can I help you? || Chào bạn! Tôi giúp gì được cho bạn?
You: Yes, I like this jacket. Can I {try on|wake up|borrow|invite} it? || Vâng, tôi thích cái áo này. Tôi mặc thử được không?
Shop assistant: Of course. What {size|receipt|weather|hobby} are you? || Tất nhiên rồi. Bạn mặc cỡ nào?
You: Medium, please. How much is it? || Cỡ vừa ạ. Cái này giá bao nhiêu?
Shop assistant: It is twenty dollars, and today there is a {discount|journey|delay|headache} of ten percent. || Hai mươi đô, và hôm nay giảm giá mười phần trăm.
You: That is good. It is not too {expensive|delicious|crowded|cloudy}. || Tốt quá. Không đắt lắm.
Shop assistant: Would you like a {receipt|passport|timetable|subject}? || Bạn có lấy biên lai không?
` },
  { level: 'PET', title: 'Phỏng vấn xin việc', scene: 'Bạn đi phỏng vấn cho một công việc mới', script: `
Manager: Thank you for coming to the {interview|exercise|prescription|departure}. Please sit down. || Cảm ơn bạn đã đến phỏng vấn. Mời ngồi.
You: Thank you. I am a little {nervous|jealous|relieved|generous} today. || Cảm ơn. Hôm nay tôi hơi hồi hộp.
Manager: Don't worry. Why did you {apply|recover|celebrate|argue} for this job? || Đừng lo. Tại sao bạn ứng tuyển vị trí này?
You: I enjoy working with people, and my friends say I am very {reliable|embarrassed|disappointed|allergic}. || Tôi thích làm việc với mọi người, và bạn bè nói tôi rất đáng tin cậy.
Manager: How do you manage a tight {deadline|degree|destination|accommodation}? || Bạn xử lý thế nào khi có hạn chót gấp?
You: I make a plan and ask my {colleagues|passwords|devices|injuries} for help. || Tôi lập kế hoạch và nhờ đồng nghiệp giúp đỡ.
Manager: What {salary|diet|scholarship|lecture} are you expecting? || Bạn mong muốn mức lương bao nhiêu?
` },
  { level: 'PET', title: 'Làm thủ tục ở sân bay', scene: 'Bạn chuẩn bị bay đến một thành phố khác', script: `
Officer: Good morning. May I see your {passport|password|prescription|degree}, please? || Chào buổi sáng. Cho tôi xem hộ chiếu của bạn nhé?
You: Here you are. I have one {suitcase|lecture|energy|rubbish} to check in. || Của tôi đây. Tôi có một va li cần ký gửi.
Officer: Your {departure|pollution|wildlife|screen} gate is number twelve. || Cổng khởi hành của bạn là số mười hai.
You: Is there any {delay|degree|energy|salary}? || Chuyến bay có bị chậm không?
Officer: No, boarding starts at nine. || Không, bắt đầu lên máy bay lúc chín giờ.
You: Thank you. I also want to {cancel|graduate|recover|argue} my hotel {reservation|revision|rubbish|lecture} for tomorrow. || Cảm ơn. Tôi cũng muốn hủy việc đặt phòng khách sạn ngày mai.
` },
  { level: 'FCE', title: 'Cuộc họp kinh doanh', scene: 'Bạn họp với đồng nghiệp về kế hoạch năm sau', script: `
Manager: Let us discuss our {budget|exhibition|tradition|routine} for next year. || Hãy bàn về ngân sách năm sau.
Sales: Our main {competitor|audience|habit|generation} has just lowered its prices. || Đối thủ cạnh tranh chính của ta vừa hạ giá.
Manager: We should {negotiate|conserve|inspire|subscribe} with our suppliers to get a better price. || Ta nên đàm phán với nhà cung cấp để có giá tốt hơn.
Sales: Good idea. We also need to {promote|rely|gather|afford} our new product. || Ý hay. Ta cũng cần quảng bá sản phẩm mới.
Manager: Yes. Then our {profit|poverty|drought|gossip} will grow. || Đúng vậy. Khi đó lợi nhuận sẽ tăng.
Sales: And every {customer|journalist|immigrant|generation} will be happier. || Và mọi khách hàng sẽ hài lòng hơn.
` },
  { level: 'FCE', title: 'Trò chuyện về môi trường', scene: 'Hai người bạn nói về biến đổi khí hậu', script: `
Anna: Did you read about the {drought|heritage|masterpiece|exhibition} in the south? || Bạn đọc về đợt hạn hán ở miền nam chưa?
Ben: Yes, it destroyed the crops. We need {sustainable|convenient|delighted|generous} ways to produce food. || Rồi, nó phá hủy mùa màng. Ta cần cách sản xuất lương thực bền vững.
Anna: I agree. Many animals may become {extinct|jealous|nervous|embarrassed} too. || Mình đồng ý. Nhiều loài vật cũng có thể tuyệt chủng.
Ben: We should {conserve|celebrate|apologise|subscribe} water and energy. || Ta nên tiết kiệm nước và năng lượng.
Anna: Governments must act on {climate|routine|gossip|audience} change. || Chính phủ phải hành động vì biến đổi khí hậu.
` },
  { level: 'IELTS', title: 'Speaking Part 3: Giáo dục', scene: 'Giám khảo hỏi bạn về giáo dục', script: `
Examiner: Some people think education should be {compulsory|flexible|obsolete|preventive} until eighteen. What do you think? || Có người cho rằng giáo dục nên bắt buộc đến mười tám tuổi. Bạn nghĩ sao?
You: I agree. A strong {curriculum|landfill|obesity|inflation} gives students useful skills. || Tôi đồng ý. Một chương trình giảng dạy tốt mang lại kỹ năng hữu ích.
Examiner: Is {tuition|erosion|emission|stereotype} too high nowadays? || Học phí ngày nay có quá cao không?
You: In many countries, yes. The government should give more {subsidy|legislation|policy|tax} to families. || Ở nhiều nước thì có. Chính phủ nên trợ cấp nhiều hơn cho các gia đình.
Examiner: What about {vocational|artificial|sedentary|ageing} training? || Còn đào tạo nghề thì sao?
You: It is essential for the {workforce|biodiversity|landfill|nutrition}. || Nó rất cần thiết cho lực lượng lao động.
` },
  { level: 'IELTS', title: 'Speaking Part 3: Công nghệ & việc làm', scene: 'Giám khảo hỏi về tác động của công nghệ', script: `
Examiner: How will {automation|obesity|erosion|deforestation} change the job market? || Tự động hóa sẽ thay đổi thị trường việc làm thế nào?
You: Many routine jobs may become {obsolete|renewable|compulsory|vocational}, but new jobs will appear. || Nhiều việc lặp đi lặp lại có thể trở nên lỗi thời, nhưng sẽ có việc mới.
Examiner: Is {privacy|epidemic|literacy|inflation} a worry for you? || Quyền riêng tư có làm bạn lo lắng không?
You: Yes. Governments should {regulate|import|enrol|outsource} how companies use personal data. || Có. Chính phủ nên quản lý cách các công ty dùng dữ liệu cá nhân.
Examiner: Will {innovation|inequality|urbanisation|diversity} solve these problems? || Sự đổi mới có giải quyết được những vấn đề này không?
You: Not alone. We also need good {policy|erosion|emission|obesity}. || Không chỉ riêng nó. Ta cũng cần chính sách tốt.
` },
];

const SEED_DIALOGUES = RAW.map(d => ({ ...d, script: d.script.trim() }));
module.exports = { SEED_DIALOGUES, parseScript };
