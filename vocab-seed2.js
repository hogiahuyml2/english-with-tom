// Kho Collocations (cụm từ đi cùng nhau) + "Nâng cấp từ vựng" (từ đơn giản → từ mạnh hơn) — tự biên soạn.
// Collocation: colloc | cấp | chủ đề | cụm từ | loại | nghĩa | câu ví dụ (chứa đúng cụm) | dịch | từ cần điền | đáp án nhiễu (cách nhau bằng ,)
// Nâng cấp:    upgrade | cấp | chủ đề | từ mạnh | loại | nghĩa | câu dùng từ mạnh | dịch | từ cơ bản | (để trống) | câu dùng từ cơ bản
const RAW = `
colloc|KET|Everyday Verbs|have breakfast|phr|ăn sáng|I usually have breakfast at seven.|Tôi thường ăn sáng lúc bảy giờ.|have|make,do,play|
colloc|KET|Everyday Verbs|do homework|phr|làm bài tập về nhà|I do homework after dinner.|Tôi làm bài tập về nhà sau bữa tối.|do|make,have,play|
colloc|KET|Everyday Verbs|take a photo|phr|chụp ảnh|Can you take a photo of us, please?|Bạn chụp giúp chúng tôi một tấm ảnh được không?|take|make,do,paint|
colloc|KET|Everyday Verbs|make a mistake|phr|mắc lỗi|Everyone can make a mistake sometimes.|Ai cũng có lúc mắc lỗi.|make|do,take,have|
colloc|KET|Everyday Verbs|play football|phr|chơi bóng đá|They play football every Sunday.|Họ chơi bóng đá vào mỗi Chủ nhật.|play|do,go,make|
colloc|KET|Everyday Verbs|go shopping|phr|đi mua sắm|We go shopping on Saturdays.|Chúng tôi đi mua sắm vào các ngày thứ Bảy.|go|do,play,make|
colloc|KET|Everyday Verbs|ride a bike|phr|đi xe đạp|My brother can ride a bike very fast.|Anh trai tôi có thể đi xe đạp rất nhanh.|ride|drive,fly,sail|
colloc|KET|Everyday Verbs|take a shower|phr|tắm vòi sen|I take a shower every morning.|Tôi tắm vòi sen mỗi sáng.|take|make,do,play|
colloc|KET|Everyday Verbs|do the dishes|phr|rửa bát|Who will do the dishes tonight?|Tối nay ai sẽ rửa bát?|do|make,take,play|
colloc|KET|Everyday Verbs|tell a joke|phr|kể chuyện cười|He likes to tell a joke at parties.|Anh ấy thích kể chuyện cười ở các bữa tiệc.|tell|say,speak,talk|
colloc|KET|Everyday Verbs|say hello|phr|chào hỏi|Don't forget to say hello to your teacher.|Đừng quên chào thầy cô nhé.|say|tell,speak,talk|
colloc|KET|Everyday Verbs|pay attention|phr|chú ý|Please pay attention in class.|Hãy chú ý trong giờ học.|pay|make,take,do|
colloc|PET|Life Choices|make a decision|phr|đưa ra quyết định|She needs to make a decision by Friday.|Cô ấy cần đưa ra quyết định trước thứ Sáu.|make|do,give,get|
colloc|PET|Life Choices|take a risk|phr|chấp nhận rủi ro|You have to take a risk to succeed.|Bạn phải chấp nhận rủi ro thì mới thành công.|take|make,do,give|
colloc|PET|Life Choices|keep a secret|phr|giữ bí mật|Can you keep a secret?|Bạn giữ bí mật được không?|keep|hold,carry,put|
colloc|PET|Life Choices|break a promise|phr|thất hứa|He never wants to break a promise.|Anh ấy không bao giờ muốn thất hứa.|break|tear,cut,crush|
colloc|PET|Life Choices|catch a cold|phr|bị cảm lạnh|If you go out in the rain, you may catch a cold.|Nếu ra ngoài trời mưa, bạn có thể bị cảm lạnh.|catch|hold,take,make|
colloc|PET|Life Choices|earn money|phr|kiếm tiền|She works at a café to earn money.|Cô ấy làm ở quán cà phê để kiếm tiền.|earn|spend,waste,lend|
colloc|PET|Life Choices|waste time|phr|lãng phí thời gian|Don't waste time on silly games.|Đừng lãng phí thời gian vào những trò chơi vớ vẩn.|waste|spend,save,pass|
colloc|PET|Life Choices|heavy traffic|phr|giao thông đông đúc|We were late because of heavy traffic.|Chúng tôi đến muộn vì kẹt xe.|heavy|strong,big,hard|
colloc|PET|Life Choices|strong coffee|phr|cà phê đậm|I can't sleep after drinking strong coffee.|Tôi không ngủ được sau khi uống cà phê đậm.|strong|heavy,hard,big|
colloc|PET|Life Choices|fast food|phr|đồ ăn nhanh|Fast food is cheap but not very healthy.|Đồ ăn nhanh rẻ nhưng không tốt cho sức khỏe lắm.|fast|quick,rapid,speedy|
colloc|PET|Life Choices|do research|phr|nghiên cứu, tìm hiểu|You should do research before buying a laptop.|Bạn nên tìm hiểu kỹ trước khi mua máy tính xách tay.|do|make,take,have|
colloc|PET|Life Choices|give advice|phr|cho lời khuyên|My grandfather likes to give advice.|Ông tôi thích cho lời khuyên.|give|make,tell,say|
colloc|FCE|Work & Society|raise awareness|phr|nâng cao nhận thức|The campaign aims to raise awareness of plastic pollution.|Chiến dịch nhằm nâng cao nhận thức về ô nhiễm nhựa.|raise|rise,lift,grow|
colloc|FCE|Work & Society|meet a deadline|phr|kịp hạn chót|It was hard to meet a deadline with so little time.|Rất khó để kịp hạn chót khi có quá ít thời gian.|meet|touch,catch,follow|
colloc|FCE|Work & Society|reach an agreement|phr|đạt được thỏa thuận|The two companies finally reach an agreement.|Hai công ty cuối cùng đã đạt được thỏa thuận.|reach|arrive,come,go|
colloc|FCE|Work & Society|take responsibility|phr|chịu trách nhiệm|Managers must take responsibility for their decisions.|Các quản lý phải chịu trách nhiệm về quyết định của mình.|take|make,do,give|
colloc|FCE|Work & Society|pose a threat|phr|gây ra mối đe dọa|Plastic bags pose a threat to sea animals.|Túi nhựa gây ra mối đe dọa cho động vật biển.|pose|put,place,set|
colloc|FCE|Work & Society|gain experience|phr|tích lũy kinh nghiệm|Interns gain experience while they work.|Thực tập sinh tích lũy kinh nghiệm trong lúc làm việc.|gain|win,earn,take|
colloc|FCE|Work & Society|come to a conclusion|phr|đi đến kết luận|After a long talk, we come to a conclusion.|Sau cuộc trò chuyện dài, chúng tôi đi đến kết luận.|come|go,fall,run|
colloc|FCE|Work & Society|draw attention|phr|thu hút sự chú ý|The bright poster will draw attention to the event.|Tấm áp phích sáng màu sẽ thu hút sự chú ý đến sự kiện.|draw|pull,carry,push|
colloc|FCE|Work & Society|launch a product|phr|tung ra sản phẩm|The company plans to launch a product next spring.|Công ty dự định tung ra một sản phẩm vào mùa xuân tới.|launch|throw,drop,send|
colloc|FCE|Work & Society|cast doubt|phr|làm dấy lên nghi ngờ|The new evidence may cast doubt on his story.|Bằng chứng mới có thể làm dấy lên nghi ngờ về câu chuyện của anh ta.|cast|pour,drop,hold|
colloc|FCE|Work & Society|sharp increase|phr|sự tăng mạnh|There was a sharp increase in house prices.|Giá nhà đã tăng mạnh.|sharp|heavy,thick,hard|
colloc|FCE|Work & Society|deeply grateful|phr|vô cùng biết ơn|I am deeply grateful for your help.|Tôi vô cùng biết ơn sự giúp đỡ của bạn.|deeply|highly,heavily,widely|
colloc|IELTS|Academic Writing|conduct research|phr|tiến hành nghiên cứu|Scientists conduct research in many fields.|Các nhà khoa học tiến hành nghiên cứu trong nhiều lĩnh vực.|conduct|lead,hold,play|
colloc|IELTS|Academic Writing|play a role|phr|đóng vai trò|Education can play a role in reducing crime.|Giáo dục có thể đóng vai trò trong việc giảm tội phạm.|play|do,make,give|
colloc|IELTS|Academic Writing|tackle a problem|phr|giải quyết một vấn đề|Governments must tackle a problem like air pollution.|Chính phủ phải giải quyết những vấn đề như ô nhiễm không khí.|tackle|catch,hold,fight|
colloc|IELTS|Academic Writing|make a contribution|phr|đóng góp|Volunteers make a contribution to the local community.|Các tình nguyện viên đóng góp cho cộng đồng địa phương.|make|do,give,put|
colloc|IELTS|Academic Writing|draw a conclusion|phr|rút ra kết luận|It is difficult to draw a conclusion from one study.|Rất khó để rút ra kết luận chỉ từ một nghiên cứu.|draw|make,take,give|
colloc|IELTS|Academic Writing|lift a ban|phr|dỡ bỏ lệnh cấm|The government decided to lift a ban on imports.|Chính phủ quyết định dỡ bỏ lệnh cấm nhập khẩu.|lift|raise,carry,hold|
colloc|IELTS|Academic Writing|run a business|phr|điều hành một doanh nghiệp|It is not easy to run a business alone.|Điều hành một doanh nghiệp một mình không dễ.|run|do,make,hold|
colloc|IELTS|Academic Writing|bring about change|phr|tạo ra sự thay đổi|Technology can bring about change in education.|Công nghệ có thể tạo ra sự thay đổi trong giáo dục.|bring|take,carry,give|
colloc|IELTS|Academic Writing|heated debate|phr|cuộc tranh luận gay gắt|The new law caused a heated debate.|Đạo luật mới gây ra một cuộc tranh luận gay gắt.|heated|warm,boiling,burning|
colloc|IELTS|Academic Writing|gain access to|phr|có được quyền tiếp cận|Many students gain access to books through libraries.|Nhiều sinh viên có được sách thông qua thư viện.|gain|win,take,catch|
colloc|IELTS|Academic Writing|meet demand|phr|đáp ứng nhu cầu|Farms must produce more to meet demand.|Các trang trại phải sản xuất nhiều hơn để đáp ứng nhu cầu.|meet|touch,catch,hold|
colloc|IELTS|Academic Writing|take into account|phr|xem xét, cân nhắc|We must take into account the cost of living.|Chúng ta phải cân nhắc chi phí sinh hoạt.|take|put,bring,carry|
upgrade|KET|Simple → Better|exhausted|adj|kiệt sức|I was exhausted after the long walk.|Tôi kiệt sức sau chuyến đi bộ dài.|tired||I was very tired after the long walk.
upgrade|KET|Simple → Better|huge|adj|khổng lồ|They have a huge garden.|Họ có một khu vườn khổng lồ.|big||They have a very big garden.
upgrade|KET|Simple → Better|great|adj|tuyệt vời|That was a great film.|Đó là một bộ phim tuyệt vời.|good||That was a good film.
upgrade|KET|Simple → Better|lovely|adj|đáng yêu, dễ chịu|What a lovely day!|Thật là một ngày dễ chịu!|nice||What a nice day!
upgrade|KET|Simple → Better|enjoy|v|thích, tận hưởng|I enjoy playing tennis with my friends.|Tôi thích chơi quần vợt với bạn bè.|like||I like playing tennis with my friends.
upgrade|KET|Simple → Better|terrible|adj|tồi tệ|The weather was terrible yesterday.|Hôm qua thời tiết thật tồi tệ.|very bad||The weather was very bad yesterday.
upgrade|KET|Simple → Better|tiny|adj|nhỏ xíu|She lives in a tiny flat.|Cô ấy sống trong một căn hộ nhỏ xíu.|very small||She lives in a very small flat.
upgrade|KET|Simple → Better|starving|adj|đói meo|I'm starving, so let's eat now.|Tôi đói meo rồi, ăn ngay thôi.|very hungry||I'm very hungry, so let's eat now.
upgrade|PET|Simple → Better|thrilled|adj|vô cùng phấn khích|She was thrilled with her gift.|Cô ấy vô cùng phấn khích với món quà.|happy||She was happy with her gift.
upgrade|PET|Simple → Better|furious|adj|giận dữ|Dad was furious when he saw the mess.|Bố giận dữ khi thấy đống bừa bộn.|angry||Dad was angry when he saw the mess.
upgrade|PET|Simple → Better|fascinating|adj|hấp dẫn, lôi cuốn|The museum was fascinating.|Bảo tàng thật hấp dẫn.|interesting||The museum was interesting.
upgrade|PET|Simple → Better|essential|adj|thiết yếu|Water is essential for life.|Nước là thiết yếu cho sự sống.|important||Water is important for life.
upgrade|PET|Simple → Better|challenging|adj|đầy thử thách|The exam was challenging but fair.|Bài thi đầy thử thách nhưng công bằng.|difficult||The exam was difficult but fair.
upgrade|PET|Simple → Better|freezing|adj|lạnh cóng|It was freezing outside, so we stayed home.|Bên ngoài lạnh cóng nên chúng tôi ở nhà.|very cold||It was very cold outside, so we stayed home.
upgrade|PET|Simple → Better|boiling|adj|nóng như thiêu|It's boiling in this room!|Trong phòng này nóng như thiêu!|very hot||It's very hot in this room!
upgrade|PET|Simple → Better|terrified|adj|khiếp sợ|He was terrified of the dark.|Cậu ấy khiếp sợ bóng tối.|very scared||He was very scared of the dark.
upgrade|PET|Simple → Better|stunning|adj|đẹp mê hồn|The view from the hotel is stunning.|Khung cảnh từ khách sạn đẹp mê hồn.|very beautiful||The view from the hotel is very beautiful.
upgrade|PET|Simple → Better|hilarious|adj|cực kỳ hài hước|His story was hilarious.|Câu chuyện của anh ấy cực kỳ hài hước.|very funny||His story was very funny.
upgrade|FCE|Formal Choices|demonstrate|v|chứng minh, cho thấy|The experiment will demonstrate how plants grow.|Thí nghiệm sẽ cho thấy cây cối lớn lên như thế nào.|show||The experiment will show how plants grow.
upgrade|FCE|Formal Choices|obtain|v|đạt được, thu được|You can obtain a visa at the embassy.|Bạn có thể xin được thị thực ở đại sứ quán.|get||You can get a visa at the embassy.
upgrade|FCE|Formal Choices|assist|v|hỗ trợ|Volunteers assist elderly people at the centre.|Các tình nguyện viên hỗ trợ người lớn tuổi tại trung tâm.|help||Volunteers help elderly people at the centre.
upgrade|FCE|Formal Choices|consider|v|cân nhắc|We should consider all the options.|Chúng ta nên cân nhắc mọi lựa chọn.|think about||We should think about all the options.
upgrade|FCE|Formal Choices|purchase|v|mua (trang trọng)|Customers can purchase tickets online.|Khách hàng có thể mua vé trực tuyến.|buy||Customers can buy tickets online.
upgrade|FCE|Formal Choices|sufficient|adj|đủ, đầy đủ|We have sufficient time to finish.|Chúng ta có đủ thời gian để hoàn thành.|enough||We have enough time to finish.
upgrade|FCE|Formal Choices|approximately|adv|khoảng, xấp xỉ|The journey takes approximately two hours.|Chuyến đi mất khoảng hai tiếng.|about||The journey takes about two hours.
upgrade|FCE|Formal Choices|require|v|đòi hỏi, yêu cầu|This job will require good computer skills.|Công việc này đòi hỏi kỹ năng máy tính tốt.|need||This job will need good computer skills.
upgrade|FCE|Formal Choices|attempt|v|cố gắng, thử|Many people attempt to learn three languages.|Nhiều người cố gắng học ba ngôn ngữ.|try||Many people try to learn three languages.
upgrade|FCE|Formal Choices|ensure|v|đảm bảo|We must ensure that everyone is safe.|Chúng ta phải đảm bảo mọi người đều an toàn.|make sure||We must make sure that everyone is safe.
upgrade|IELTS|Band 7+ Writing|significant|adj|đáng kể|There was a significant increase in sales.|Doanh số đã tăng đáng kể.|big||There was a big increase in sales.
upgrade|IELTS|Band 7+ Writing|numerous|adj|rất nhiều|Numerous studies link sleep to memory.|Rất nhiều nghiên cứu liên hệ giấc ngủ với trí nhớ.|a lot of||A lot of studies link sleep to memory.
upgrade|IELTS|Band 7+ Writing|detrimental|adj|có hại|Smoking is detrimental to health.|Hút thuốc có hại cho sức khỏe.|very bad||Smoking is very bad for health.
upgrade|IELTS|Band 7+ Writing|beneficial|adj|có lợi|Regular exercise is beneficial for the heart.|Tập thể dục đều đặn có lợi cho tim.|good||Regular exercise is good for the heart.
upgrade|IELTS|Band 7+ Writing|illustrate|v|minh họa, cho thấy|The chart will illustrate the main trend.|Biểu đồ sẽ minh họa xu hướng chính.|show||The chart will show the main trend.
upgrade|IELTS|Band 7+ Writing|soar|v|tăng vọt|House prices continue to soar in big cities.|Giá nhà tiếp tục tăng vọt ở các thành phố lớn.|go up quickly||House prices continue to go up quickly in big cities.
upgrade|IELTS|Band 7+ Writing|plummet|v|giảm mạnh|Sales often plummet during the winter.|Doanh số thường giảm mạnh vào mùa đông.|fall sharply||Sales often fall sharply during the winter.
upgrade|IELTS|Band 7+ Writing|crucial|adj|then chốt, cực kỳ quan trọng|Sleep is crucial for learning.|Giấc ngủ cực kỳ quan trọng cho việc học.|very important||Sleep is very important for learning.
upgrade|IELTS|Band 7+ Writing|argue|v|lập luận, cho rằng|Some people argue that cars should be banned.|Một số người cho rằng nên cấm ô tô.|think||Some people think that cars should be banned.
upgrade|IELTS|Band 7+ Writing|improve|v|cải thiện|Public healthcare will improve in the next decade.|Y tế công sẽ được cải thiện trong thập kỷ tới.|get better||Public healthcare will get better in the next decade.
`;

function parseSeed2(raw) {
  const out = [];
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t) continue;
    const p = t.split('|').map(s => s.trim());
    if (p.length < 11) continue;
    const [kind, level, topic, word, pos, vi, ex, exVi, basic, extra, exampleBasic] = p;
    out.push({ kind, level, topic, word, pos, vi, ex, exVi, basic, extra, exampleBasic });
  }
  return out;
}
module.exports = { SEED2: parseSeed2(RAW), parseSeed2 };
