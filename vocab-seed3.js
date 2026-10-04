// Kho từ bổ sung theo CHỦ ĐỀ cho các trò chơi (thể thao, môi trường, giáo dục, ẩm thực, du lịch…) — tự biên soạn cho English With Tom.
// Mỗi dòng: cấp độ | chủ đề | từ | loại từ | nghĩa tiếng Việt | câu ví dụ | dịch câu ví dụ
// Câu ví dụ PHẢI chứa nguyên từ khoá (để game điền từ tạo được chỗ trống). Chỉ chèn từ chưa có (INSERT OR IGNORE).
const { parseSeed } = require('./vocab-seed');
const RAW = `
KET|Sports|team|n|đội|Our school team plays on Saturday mornings.|Đội của trường chúng tôi thi đấu vào sáng thứ Bảy.
KET|Sports|player|n|cầu thủ, người chơi|He is the best player in our football club.|Cậu ấy là cầu thủ giỏi nhất trong câu lạc bộ bóng đá của chúng tôi.
KET|Sports|match|n|trận đấu|We watched the match on TV last night.|Chúng tôi đã xem trận đấu trên TV tối qua.
KET|Sports|win|v|thắng|I hope our team can win the next game.|Tôi hy vọng đội của chúng tôi có thể thắng trận tới.
KET|Sports|lose|v|thua|They did not want to lose the final.|Họ không muốn thua trận chung kết.
KET|Sports|score|v|ghi bàn|Our striker can score from almost any position.|Tiền đạo của chúng tôi có thể ghi bàn từ gần như mọi vị trí.
KET|Sports|goal|n|bàn thắng|The only goal of the game came in the last minute.|Bàn thắng duy nhất của trận đấu đến vào phút cuối.
KET|Sports|ball|n|quả bóng|Please pass the ball to me!|Làm ơn chuyền bóng cho tớ!
KET|Sports|coach|n|huấn luyện viên|Our coach makes us run every morning.|Huấn luyện viên bắt chúng tôi chạy mỗi buổi sáng.
KET|Sports|swim|v|bơi|I learned to swim when I was six.|Tôi học bơi khi tôi sáu tuổi.
KET|Sports|tennis|n|quần vợt|My sister plays tennis twice a week.|Chị tôi chơi quần vợt hai lần một tuần.
KET|Sports|basketball|n|bóng rổ|Basketball is very popular at my school.|Bóng rổ rất phổ biến ở trường tôi.
KET|Sports|stadium|n|sân vận động|Thousands of fans came to the stadium.|Hàng nghìn người hâm mộ đã đến sân vận động.
KET|Sports|fan|n|người hâm mộ|She is a big fan of the national team.|Cô ấy là một người hâm mộ lớn của đội tuyển quốc gia.
KET|Sports|cycling|n|môn đạp xe|Cycling is a good way to stay healthy.|Đạp xe là một cách tốt để giữ gìn sức khoẻ.
PET|Sports|training|n|buổi tập luyện|Training starts at five o'clock every day.|Buổi tập luyện bắt đầu lúc năm giờ mỗi ngày.
PET|Sports|champion|n|nhà vô địch|The young champion won three gold medals.|Nhà vô địch trẻ tuổi đã giành ba huy chương vàng.
PET|Sports|tournament|n|giải đấu|Our school will join the tournament next month.|Trường chúng tôi sẽ tham gia giải đấu vào tháng sau.
PET|Sports|referee|n|trọng tài|The referee blew the whistle and stopped the game.|Trọng tài thổi còi và dừng trận đấu.
PET|Sports|opponent|n|đối thủ|Our opponent was much taller than us.|Đối thủ của chúng tôi cao hơn chúng tôi nhiều.
PET|Sports|compete|v|thi đấu, cạnh tranh|Over two hundred athletes will compete in the race.|Hơn hai trăm vận động viên sẽ thi đấu trong cuộc đua.
PET|Sports|medal|n|huy chương|She was proud to receive a silver medal.|Cô ấy tự hào khi nhận được một tấm huy chương bạc.
PET|Sports|athlete|n|vận động viên|A professional athlete must eat healthy food.|Một vận động viên chuyên nghiệp phải ăn đồ lành mạnh.
PET|Sports|race|n|cuộc đua|He finished the race in under an hour.|Anh ấy hoàn thành cuộc đua trong chưa đầy một giờ.
PET|Sports|goalkeeper|n|thủ môn|The goalkeeper made three amazing saves.|Thủ môn đã có ba pha cứu thua tuyệt vời.
FCE|Sports|defeat|v|đánh bại|Our team managed to defeat the champions.|Đội của chúng tôi đã đánh bại được nhà vô địch.
FCE|Sports|fit|adj|khoẻ mạnh, cân đối|You need to stay fit to play this sport.|Bạn cần giữ cơ thể cân đối để chơi môn thể thao này.
FCE|Sports|stamina|n|sức bền|Marathon runners need great stamina.|Vận động viên marathon cần sức bền rất tốt.
FCE|Sports|spectator|n|khán giả xem thi đấu|Every spectator stood up when the team arrived.|Mọi khán giả đều đứng dậy khi đội bóng đến.
FCE|Sports|penalty|n|quả phạt đền|The goalkeeper saved the penalty.|Thủ môn đã cản phá được quả phạt đền.
FCE|Sports|warm up|v|khởi động|Always warm up before you start to run.|Hãy luôn khởi động trước khi bắt đầu chạy.
IELTS|Sports|rival|n|đối thủ cạnh tranh|The two clubs have been bitter rival teams for many years.|Hai câu lạc bộ đã là đối thủ không đội trời chung suốt nhiều năm.
IELTS|Sports|endurance|n|sức chịu đựng|Cycling long distances builds endurance.|Đạp xe quãng đường dài giúp tăng sức chịu đựng.
IELTS|Sports|sponsor|n|nhà tài trợ|A local company became the main sponsor of the team.|Một công ty địa phương trở thành nhà tài trợ chính của đội.
IELTS|Sports|dedication|n|sự tận tâm|Success in sport requires dedication and hard work.|Thành công trong thể thao đòi hỏi sự tận tâm và chăm chỉ.
KET|Environment|plastic|n|nhựa|Plastic bags can hurt sea animals.|Túi nhựa có thể làm hại động vật biển.
KET|Environment|clean|adj|sạch|We want to keep our beaches clean.|Chúng tôi muốn giữ cho các bãi biển luôn sạch.
KET|Environment|waste|n|rác thải|We should not throw waste into the river.|Chúng ta không nên vứt rác thải xuống sông.
KET|Environment|forest|n|rừng|There is a big forest near my grandmother's village.|Có một khu rừng lớn gần làng của bà tôi.
KET|Environment|save|v|tiết kiệm|We can save water by taking shorter showers.|Chúng ta có thể tiết kiệm nước bằng cách tắm nhanh hơn.
PET|Environment|pollute|v|gây ô nhiễm|Factories that pollute the air should pay a fine.|Các nhà máy gây ô nhiễm không khí nên bị phạt tiền.
PET|Environment|reduce|v|giảm|Cycling to school can reduce traffic.|Đạp xe đến trường có thể giảm bớt giao thông.
PET|Environment|habitat|n|môi trường sống|Many animals lose their habitat when trees are cut down.|Nhiều loài động vật mất môi trường sống khi cây bị đốn.
PET|Environment|solar|adj|thuộc về mặt trời|Many houses now use solar panels to make electricity.|Nhiều ngôi nhà hiện dùng tấm pin mặt trời để tạo ra điện.
PET|Environment|global warming|n|sự nóng lên toàn cầu|Global warming is melting the ice at the North Pole.|Sự nóng lên toàn cầu đang làm tan băng ở Bắc Cực.
FCE|Environment|endangered|adj|có nguy cơ tuyệt chủng|The tiger is an endangered animal.|Hổ là một loài động vật có nguy cơ tuyệt chủng.
FCE|Environment|fossil fuel|n|nhiên liệu hoá thạch|We must use less fossil fuel to protect the planet.|Chúng ta phải dùng ít nhiên liệu hoá thạch hơn để bảo vệ hành tinh.
FCE|Environment|carbon footprint|n|lượng khí thải carbon cá nhân|Flying less is one way to reduce your carbon footprint.|Đi máy bay ít hơn là một cách để giảm lượng khí thải carbon của bạn.
IELTS|Environment|contaminate|v|làm nhiễm bẩn|Chemicals from the factory can contaminate the river.|Hoá chất từ nhà máy có thể làm nhiễm bẩn dòng sông.
IELTS|Environment|ecosystem|n|hệ sinh thái|A coral reef is a fragile ecosystem.|Rạn san hô là một hệ sinh thái mong manh.
IELTS|Environment|afforestation|n|việc trồng rừng|Afforestation helps to absorb carbon dioxide.|Việc trồng rừng giúp hấp thụ khí carbon dioxide.
KET|Education|pupil|n|học sinh|Every pupil must wear a uniform.|Mọi học sinh đều phải mặc đồng phục.
KET|Education|lesson|n|tiết học, bài học|The first lesson starts at half past seven.|Tiết học đầu tiên bắt đầu lúc bảy giờ rưỡi.
KET|Education|dictionary|n|từ điển|Use a dictionary if you don't know a word.|Hãy dùng từ điển nếu bạn không biết một từ.
KET|Education|university|n|trường đại học|My cousin wants to study at university in Hanoi.|Anh họ tôi muốn học đại học ở Hà Nội.
KET|Education|learn|v|học|It is fun to learn new words with friends.|Học từ mới cùng bạn bè thật vui.
KET|Education|mark|n|điểm số|She got a very good mark in maths.|Cô ấy được điểm rất cao môn toán.
PET|Education|pass|v|đỗ, vượt qua|I studied hard to pass the exam.|Tôi đã học chăm chỉ để vượt qua kỳ thi.
PET|Education|fail|v|trượt|Many students fail because they do not revise.|Nhiều học sinh trượt vì không ôn bài.
PET|Education|certificate|n|chứng chỉ|She received a certificate after the course.|Cô ấy nhận được chứng chỉ sau khoá học.
PET|Education|principal|n|hiệu trưởng|The principal gave a speech at the ceremony.|Hiệu trưởng đã phát biểu tại buổi lễ.
FCE|Education|attend|v|tham dự|Students must attend at least ninety per cent of classes.|Học sinh phải tham dự ít nhất chín mươi phần trăm số buổi học.
FCE|Education|assignment|n|bài tập lớn|The assignment is due on Friday.|Bài tập lớn phải nộp vào thứ Sáu.
FCE|Education|tutor|n|gia sư|A private tutor helped him improve his English.|Một gia sư riêng đã giúp cậu ấy cải thiện tiếng Anh.
IELTS|Education|plagiarism|n|sự đạo văn|Plagiarism is taken very seriously at university.|Đạo văn được xem là rất nghiêm trọng ở đại học.
IELTS|Education|dissertation|n|luận văn|She is writing her dissertation on climate change.|Cô ấy đang viết luận văn về biến đổi khí hậu.
IELTS|Education|academic|adj|thuộc học thuật|The school has a very high academic standard.|Ngôi trường có tiêu chuẩn học thuật rất cao.
KET|Food & Drink|breakfast|n|bữa sáng|We have breakfast at seven o'clock.|Chúng tôi ăn sáng lúc bảy giờ.
KET|Food & Drink|chicken|n|thịt gà|My mother cooks chicken with rice on Sundays.|Mẹ tôi nấu gà với cơm vào các ngày Chủ nhật.
KET|Food & Drink|rice|n|cơm, gạo|Vietnamese people eat rice every day.|Người Việt Nam ăn cơm mỗi ngày.
KET|Food & Drink|soup|n|súp, canh|This hot soup is perfect for a cold day.|Món súp nóng này rất hợp cho một ngày lạnh.
KET|Food & Drink|fruit|n|trái cây|Fresh fruit is cheap at this market.|Trái cây tươi ở chợ này rất rẻ.
KET|Food & Drink|thirsty|adj|khát|I am thirsty, so I need some water.|Tôi khát nên cần một ít nước.
KET|Food & Drink|cook|v|nấu ăn|My father likes to cook at the weekend.|Bố tôi thích nấu ăn vào cuối tuần.
KET|Food & Drink|sandwich|n|bánh sandwich|I had a cheese sandwich for lunch.|Tôi đã ăn một cái bánh sandwich phô mai cho bữa trưa.
PET|Food & Drink|recipe|n|công thức nấu ăn|This recipe is easy to follow.|Công thức nấu ăn này rất dễ làm theo.
PET|Food & Drink|ingredient|n|nguyên liệu|Fresh herbs are the key ingredient in this dish.|Rau thơm tươi là nguyên liệu chính của món này.
PET|Food & Drink|spicy|adj|cay|I can't eat this soup because it is too spicy.|Tôi không thể ăn món súp này vì nó quá cay.
PET|Food & Drink|bake|v|nướng bánh|She likes to bake cakes for her friends.|Cô ấy thích nướng bánh cho bạn bè.
PET|Food & Drink|portion|n|khẩu phần|The portion was so big that we shared it.|Khẩu phần lớn đến mức chúng tôi chia nhau ăn.
PET|Food & Drink|vegetarian|n|người ăn chay|My sister is a vegetarian, so she never eats meat.|Chị tôi là người ăn chay nên không bao giờ ăn thịt.
FCE|Food & Drink|cuisine|n|ẩm thực|Vietnamese cuisine is famous all over the world.|Ẩm thực Việt Nam nổi tiếng khắp thế giới.
FCE|Food & Drink|flavour|n|hương vị|The sauce gives the dish a lovely flavour.|Nước sốt mang lại cho món ăn một hương vị tuyệt vời.
FCE|Food & Drink|nutritious|adj|bổ dưỡng|Brown rice is more nutritious than white rice.|Gạo lứt bổ dưỡng hơn gạo trắng.
FCE|Food & Drink|appetite|n|cảm giác thèm ăn|The hot weather made me lose my appetite.|Thời tiết nóng khiến tôi mất cảm giác thèm ăn.
IELTS|Food & Drink|malnutrition|n|tình trạng suy dinh dưỡng|Malnutrition is still a serious problem in some countries.|Suy dinh dưỡng vẫn là một vấn đề nghiêm trọng ở một số quốc gia.
IELTS|Food & Drink|processed|adj|đã qua chế biến|Eating too much processed food is bad for your health.|Ăn quá nhiều thực phẩm qua chế biến có hại cho sức khoẻ.
IELTS|Food & Drink|organic|adj|hữu cơ|More people are buying organic vegetables these days.|Ngày nay ngày càng nhiều người mua rau hữu cơ.
KET|Travel|airport|n|sân bay|We arrived at the airport two hours early.|Chúng tôi đến sân bay sớm hai tiếng.
KET|Travel|hotel|n|khách sạn|The hotel is only five minutes from the beach.|Khách sạn chỉ cách bãi biển năm phút.
KET|Travel|map|n|bản đồ|Can you show me the way on the map?|Bạn chỉ đường cho tôi trên bản đồ được không?
KET|Travel|holiday|n|kỳ nghỉ|We are going on holiday to Phu Quoc in July.|Chúng tôi sẽ đi nghỉ ở Phú Quốc vào tháng Bảy.
KET|Travel|beach|n|bãi biển|The children played on the beach all afternoon.|Bọn trẻ chơi trên bãi biển cả buổi chiều.
KET|Travel|guide|n|hướng dẫn viên|The guide told us about the history of the old town.|Hướng dẫn viên kể cho chúng tôi nghe về lịch sử khu phố cổ.
PET|Travel|flight|n|chuyến bay|Our flight to Singapore leaves at noon.|Chuyến bay đi Singapore của chúng tôi cất cánh lúc trưa.
PET|Travel|check in|v|làm thủ tục|You must check in two hours before the flight.|Bạn phải làm thủ tục trước chuyến bay hai tiếng.
PET|Travel|backpack|n|ba lô|I carried everything in a small backpack.|Tôi mang mọi thứ trong một chiếc ba lô nhỏ.
PET|Travel|sightseeing|n|việc tham quan|We spent the morning sightseeing in the city centre.|Chúng tôi dành buổi sáng để tham quan trung tâm thành phố.
PET|Travel|souvenir|n|quà lưu niệm|I bought a small souvenir for my grandmother.|Tôi đã mua một món quà lưu niệm nhỏ cho bà.
PET|Travel|customs|n|hải quan|We waited in line at customs for an hour.|Chúng tôi xếp hàng chờ ở hải quan cả tiếng.
FCE|Travel|itinerary|n|lịch trình|The itinerary includes two days in Hue.|Lịch trình bao gồm hai ngày ở Huế.
FCE|Travel|excursion|n|chuyến tham quan ngắn|On Friday there is an excursion to the floating market.|Vào thứ Sáu có một chuyến tham quan chợ nổi.
FCE|Travel|resort|n|khu nghỉ dưỡng|The resort has three swimming pools and a spa.|Khu nghỉ dưỡng có ba hồ bơi và một spa.
IELTS|Travel|landmark|n|địa danh nổi tiếng|The old bridge is the most famous landmark in the city.|Cây cầu cũ là địa danh nổi tiếng nhất của thành phố.
IELTS|Travel|ecotourism|n|du lịch sinh thái|Ecotourism protects nature and helps local people.|Du lịch sinh thái bảo vệ thiên nhiên và giúp ích cho người dân địa phương.
KET|Health|healthy|adj|khoẻ mạnh, lành mạnh|Eating fruit every day keeps you healthy.|Ăn trái cây mỗi ngày giúp bạn khoẻ mạnh.
KET|Health|hospital|n|bệnh viện|My aunt works at the children's hospital.|Dì tôi làm việc ở bệnh viện nhi.
KET|Health|doctor|n|bác sĩ|You should see a doctor about that cough.|Bạn nên đi gặp bác sĩ về cơn ho đó.
KET|Health|pain|n|cơn đau|I have a pain in my left leg.|Tôi bị đau ở chân trái.
KET|Health|cough|n|cơn ho|She has had a bad cough for a week.|Cô ấy bị ho nặng một tuần nay.
PET|Health|symptom|n|triệu chứng|A high temperature is a common symptom of flu.|Sốt cao là một triệu chứng thường gặp của bệnh cúm.
PET|Health|infection|n|sự nhiễm trùng|The doctor gave him medicine for the infection.|Bác sĩ cho cậu ấy thuốc để chữa nhiễm trùng.
PET|Health|vaccine|n|vắc-xin|Children get a vaccine to protect them from the disease.|Trẻ em được tiêm vắc-xin để phòng bệnh.
PET|Health|treatment|n|việc điều trị|The treatment lasted for six weeks.|Việc điều trị kéo dài sáu tuần.
FCE|Health|immune|adj|có khả năng miễn dịch|Some people are immune to the disease.|Một số người có khả năng miễn dịch với căn bệnh này.
FCE|Health|chronic|adj|mãn tính|He suffers from chronic back pain.|Anh ấy bị đau lưng mãn tính.
IELTS|Health|wellbeing|n|sức khoẻ và hạnh phúc|Walking in nature improves your mental wellbeing.|Đi bộ giữa thiên nhiên cải thiện sức khoẻ tinh thần của bạn.
KET|Technology|computer|n|máy tính|I use my computer to do my homework.|Tôi dùng máy tính để làm bài tập.
KET|Technology|internet|n|mạng internet|There is no internet in our village.|Làng chúng tôi không có mạng internet.
KET|Technology|website|n|trang web|You can find the answer on the school website.|Bạn có thể tìm câu trả lời trên trang web của trường.
KET|Technology|camera|n|máy ảnh|She took a lot of photos with her new camera.|Cô ấy chụp rất nhiều ảnh bằng chiếc máy ảnh mới.
KET|Technology|keyboard|n|bàn phím|The keyboard on this laptop is very quiet.|Bàn phím của chiếc laptop này rất êm.
PET|Technology|software|n|phần mềm|This software helps you learn English.|Phần mềm này giúp bạn học tiếng Anh.
PET|Technology|battery|n|pin|My phone battery only lasts a few hours.|Pin điện thoại của tôi chỉ dùng được vài tiếng.
PET|Technology|upload|v|tải lên|Please upload your homework before eight o'clock.|Hãy tải bài tập lên trước tám giờ.
PET|Technology|wireless|adj|không dây|I use wireless headphones when I run.|Tôi dùng tai nghe không dây khi chạy bộ.
FCE|Technology|gadget|n|thiết bị nhỏ tiện ích|He loves buying the latest gadget.|Anh ấy thích mua những thiết bị mới nhất.
FCE|Technology|browse|v|duyệt web, lướt xem|I like to browse the internet before bed.|Tôi thích lướt web trước khi đi ngủ.
IELTS|Technology|algorithm|n|thuật toán|A social media algorithm decides what you see.|Thuật toán của mạng xã hội quyết định bạn nhìn thấy gì.
IELTS|Technology|cybersecurity|n|an ninh mạng|Cybersecurity is important for every company.|An ninh mạng quan trọng đối với mọi công ty.
KET|Entertainment|music|n|âm nhạc|I listen to music on the bus every morning.|Tôi nghe nhạc trên xe buýt mỗi sáng.
KET|Entertainment|film|n|bộ phim|We watched a funny film on Saturday night.|Chúng tôi đã xem một bộ phim hài vào tối thứ Bảy.
KET|Entertainment|singer|n|ca sĩ|My favourite singer is coming to Ho Chi Minh City.|Ca sĩ yêu thích của tôi sắp đến thành phố Hồ Chí Minh.
KET|Entertainment|concert|n|buổi hoà nhạc|The concert starts at eight o'clock.|Buổi hoà nhạc bắt đầu lúc tám giờ.
KET|Entertainment|guitar|n|đàn ghi-ta|He can play the guitar and sing at the same time.|Cậu ấy có thể vừa chơi đàn ghi-ta vừa hát.
KET|Entertainment|dance|v|nhảy múa|They dance together at every party.|Họ nhảy cùng nhau ở mọi bữa tiệc.
KET|Entertainment|cartoon|n|phim hoạt hình|The children are watching a cartoon.|Bọn trẻ đang xem phim hoạt hình.
PET|Entertainment|musician|n|nhạc sĩ, nhạc công|The street musician played a beautiful song.|Người nhạc công đường phố chơi một bài hát rất hay.
PET|Entertainment|comedy|n|phim hài, kịch hài|We laughed a lot during the comedy.|Chúng tôi đã cười rất nhiều khi xem bộ phim hài.
PET|Entertainment|festival|n|lễ hội|The music festival lasts for three days.|Lễ hội âm nhạc kéo dài ba ngày.
PET|Entertainment|documentary|n|phim tài liệu|I watched a documentary about wild animals.|Tôi đã xem một bộ phim tài liệu về động vật hoang dã.
FCE|Entertainment|plot|n|cốt truyện|The plot of the film was hard to follow.|Cốt truyện của bộ phim rất khó theo dõi.
FCE|Entertainment|soundtrack|n|nhạc phim|The soundtrack was written by a famous composer.|Nhạc phim do một nhà soạn nhạc nổi tiếng viết.
FCE|Entertainment|talent|n|tài năng|She has a great talent for singing.|Cô ấy có tài năng ca hát tuyệt vời.
FCE|Entertainment|applause|n|tràng vỗ tay|The singer received loud applause at the end.|Ca sĩ nhận được tràng vỗ tay lớn ở phần kết thúc.
IELTS|Entertainment|genre|n|thể loại|Horror is my least favourite genre of film.|Kinh dị là thể loại phim tôi ít thích nhất.
IELTS|Entertainment|blockbuster|n|bom tấn|The new blockbuster earned millions in its first week.|Bom tấn mới kiếm được hàng triệu đô trong tuần đầu tiên.
KET|Family|grandmother|n|bà|My grandmother tells us stories every evening.|Bà tôi kể chuyện cho chúng tôi nghe mỗi buổi tối.
KET|Family|cousin|n|anh chị em họ|My cousin lives next door to us.|Anh họ tôi sống ngay cạnh nhà chúng tôi.
KET|Family|uncle|n|chú, bác, cậu|My uncle drives a taxi in Hanoi.|Chú tôi lái taxi ở Hà Nội.
KET|Family|parents|n|bố mẹ|My parents work in a hospital.|Bố mẹ tôi làm việc ở bệnh viện.
KET|Family|relative|n|họ hàng|Every relative comes to our house at Tet.|Mọi người họ hàng đều đến nhà chúng tôi vào dịp Tết.
KET|Family|friendly|adj|thân thiện|The new girl in my class is very friendly.|Bạn nữ mới trong lớp tôi rất thân thiện.
PET|Family|sibling|n|anh chị em ruột|I have no sibling, so I often feel lonely.|Tôi không có anh chị em ruột nên thường cảm thấy cô đơn.
PET|Family|childhood|n|thời thơ ấu|I spent my childhood in a small village.|Tôi đã trải qua thời thơ ấu ở một ngôi làng nhỏ.
PET|Family|grow up|v|lớn lên|I want to be a doctor when I grow up.|Tôi muốn trở thành bác sĩ khi lớn lên.
PET|Family|polite|adj|lịch sự|It is polite to say thank you.|Nói lời cảm ơn là lịch sự.
FCE|Family|household|n|hộ gia đình|There are five people in our household.|Có năm người trong hộ gia đình chúng tôi.
FCE|Family|upbringing|n|sự nuôi dạy|She had a very strict upbringing.|Cô ấy được nuôi dạy rất nghiêm khắc.
IELTS|Family|nuclear family|n|gia đình hạt nhân|A nuclear family consists of parents and their children.|Gia đình hạt nhân gồm bố mẹ và con cái của họ.
KET|Shopping|money|n|tiền|I saved some money to buy a new bike.|Tôi đã tiết kiệm một ít tiền để mua xe đạp mới.
KET|Shopping|price|n|giá|The price of this phone is too high.|Giá của chiếc điện thoại này quá cao.
KET|Shopping|cash|n|tiền mặt|Do you want to pay by card or in cash?|Bạn muốn trả bằng thẻ hay bằng tiền mặt?
KET|Shopping|pay|v|trả tiền|I will pay for the tickets.|Tôi sẽ trả tiền vé.
PET|Shopping|refund|n|việc hoàn tiền|The shop gave me a refund for the broken lamp.|Cửa hàng hoàn tiền cho tôi vì chiếc đèn bị hỏng.
PET|Shopping|bargain|n|món hời|At only five dollars, this jacket is a bargain.|Chỉ năm đô thì chiếc áo khoác này là một món hời.
PET|Shopping|queue|n|hàng người xếp chờ|There was a long queue outside the shop.|Có một hàng người dài đang xếp chờ bên ngoài cửa hàng.
PET|Shopping|brand|n|thương hiệu|This brand makes very comfortable shoes.|Thương hiệu này làm giày rất êm chân.
FCE|Shopping|purchase|v|mua|You can purchase tickets online.|Bạn có thể mua vé trực tuyến.
FCE|Shopping|spend|v|tiêu (tiền)|Teenagers often spend their pocket money on snacks.|Thanh thiếu niên thường tiêu tiền tiêu vặt vào đồ ăn vặt.
IELTS|Shopping|consumer|n|người tiêu dùng|Today every consumer is more careful about what they buy.|Ngày nay mỗi người tiêu dùng đều cẩn thận hơn về những gì họ mua.
KET|Nature|rain|n|mưa|We stayed at home because of the heavy rain.|Chúng tôi ở nhà vì trời mưa to.
KET|Nature|snow|n|tuyết|The children love playing in the snow.|Bọn trẻ thích chơi trong tuyết.
KET|Nature|wind|n|gió|The wind was so strong that it broke the fence.|Gió mạnh đến mức làm gãy cả hàng rào.
KET|Nature|sunny|adj|nắng|It is a sunny day, so let's go to the park.|Hôm nay trời nắng nên chúng ta ra công viên đi.
KET|Nature|mountain|n|ngọn núi|We climbed the mountain early in the morning.|Chúng tôi leo núi từ sáng sớm.
KET|Nature|river|n|con sông|There is a bridge over the river.|Có một cây cầu bắc qua con sông.
PET|Nature|storm|n|cơn bão|The storm destroyed many houses in the village.|Cơn bão đã phá huỷ nhiều ngôi nhà trong làng.
PET|Nature|thunder|n|tiếng sấm|The baby woke up when she heard the thunder.|Em bé thức giấc khi nghe thấy tiếng sấm.
PET|Nature|flood|n|trận lũ|The flood covered the whole road.|Trận lũ làm ngập cả con đường.
PET|Nature|earthquake|n|trận động đất|The earthquake was felt in three cities.|Trận động đất được cảm nhận ở ba thành phố.
FCE|Nature|volcano|n|núi lửa|The volcano has not erupted for two hundred years.|Ngọn núi lửa đã không phun trào suốt hai trăm năm.
FCE|Nature|tsunami|n|sóng thần|The tsunami reached the coast within an hour.|Sóng thần đã đến bờ biển trong vòng một giờ.
IELTS|Nature|humid|adj|ẩm ướt|The weather in Hue is hot and humid in summer.|Thời tiết ở Huế nóng và ẩm vào mùa hè.
IELTS|Nature|natural disaster|n|thiên tai|A natural disaster can destroy a whole community.|Một trận thiên tai có thể phá huỷ cả một cộng đồng.
KET|Work & Jobs|job|n|công việc|My mother is looking for a new job.|Mẹ tôi đang tìm một công việc mới.
KET|Work & Jobs|office|n|văn phòng|My father works in an office in the city centre.|Bố tôi làm việc ở một văn phòng trong trung tâm thành phố.
KET|Work & Jobs|boss|n|ông chủ, sếp|My boss is very kind to everyone.|Sếp của tôi rất tốt với mọi người.
PET|Work & Jobs|career|n|sự nghiệp|He started his career as a teacher.|Anh ấy bắt đầu sự nghiệp với vai trò giáo viên.
PET|Work & Jobs|manager|n|quản lý|The manager wants to talk to you.|Người quản lý muốn nói chuyện với bạn.
PET|Work & Jobs|experience|n|kinh nghiệm|You need two years of experience for this job.|Bạn cần hai năm kinh nghiệm cho công việc này.
FCE|Work & Jobs|resign|v|từ chức, nghỉ việc|She decided to resign because she wanted a change.|Cô ấy quyết định nghỉ việc vì muốn thay đổi.
FCE|Work & Jobs|promotion|n|sự thăng chức|He worked hard and got a promotion.|Anh ấy làm việc chăm chỉ và được thăng chức.
IELTS|Work & Jobs|qualification|n|bằng cấp, trình độ|You need a teaching qualification for this position.|Bạn cần có bằng cấp sư phạm cho vị trí này.
`;
module.exports = { SEED3: parseSeed(RAW) };
