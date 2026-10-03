// Kho từ vựng khởi đầu cho "Góc Từ Vựng" — tự biên soạn cho English With Tom.
// Mỗi dòng: cấp độ | chủ đề | từ | loại từ | nghĩa tiếng Việt | câu ví dụ | dịch câu ví dụ
// Câu ví dụ PHẢI chứa nguyên từ khoá (để game "Tình huống" tạo được chỗ trống).
// Giáo viên có thể thêm từ mới ngay trên web (Góc Từ Vựng → Quản lý kho từ),
// seed này chỉ chèn những từ chưa có (INSERT OR IGNORE) nên không bao giờ ghi đè dữ liệu đã chỉnh.
const RAW = `
KET|Daily Life|wake up|v|thức dậy|I wake up at six o'clock every morning.|Tôi thức dậy lúc sáu giờ mỗi sáng.
KET|Daily Life|neighbour|n|hàng xóm|My neighbour has a very friendly dog.|Hàng xóm của tôi có một chú chó rất thân thiện.
KET|Daily Life|tidy|v|dọn dẹp cho gọn|Please tidy your room before dinner.|Hãy dọn phòng của con trước bữa tối.
KET|Daily Life|busy|adj|bận rộn|I can't talk now because I am busy.|Bây giờ tôi không nói chuyện được vì tôi đang bận.
KET|Daily Life|borrow|v|mượn|Can I borrow your pen, please?|Cho mình mượn cây bút của bạn được không?
KET|Daily Life|usually|adv|thường xuyên|We usually have dinner at seven.|Chúng tôi thường ăn tối lúc bảy giờ.
KET|Food & Drink|menu|n|thực đơn|Could we see the menu, please?|Cho chúng tôi xem thực đơn được không?
KET|Food & Drink|order|v|gọi món|I would like to order a chicken sandwich.|Tôi muốn gọi một cái bánh sandwich gà.
KET|Food & Drink|delicious|adj|ngon|The soup was absolutely delicious.|Món súp ngon tuyệt.
KET|Food & Drink|bill|n|hóa đơn|Can we have the bill, please?|Cho chúng tôi xin hóa đơn nhé?
KET|Food & Drink|hungry|adj|đói|I am very hungry after the football match.|Tôi rất đói sau trận bóng đá.
KET|Food & Drink|vegetable|n|rau củ|You should eat a vegetable with every meal.|Bạn nên ăn rau củ trong mỗi bữa ăn.
KET|Travel|ticket|n|vé|I bought a ticket for the train to Hue.|Tôi đã mua một vé tàu đi Huế.
KET|Travel|luggage|n|hành lý|Please keep your luggage with you at all times.|Vui lòng luôn mang theo hành lý bên mình.
KET|Travel|passport|n|hộ chiếu|Don't forget your passport at the airport.|Đừng quên hộ chiếu của bạn ở sân bay.
KET|Travel|platform|n|sân ga|The train to Da Nang leaves from platform four.|Chuyến tàu đi Đà Nẵng khởi hành từ sân ga số bốn.
KET|Travel|delay|n|sự chậm trễ|There is a two-hour delay because of the storm.|Có sự chậm trễ hai tiếng vì cơn bão.
KET|Travel|journey|n|chuyến đi|The journey from Hanoi to Sapa takes six hours.|Chuyến đi từ Hà Nội đến Sa Pa mất sáu tiếng.
KET|Shopping|cheap|adj|rẻ|This T-shirt is cheap, only ten dollars.|Cái áo thun này rẻ, chỉ mười đô thôi.
KET|Shopping|expensive|adj|đắt|That watch is too expensive for me.|Chiếc đồng hồ đó quá đắt với tôi.
KET|Shopping|size|n|cỡ, kích cỡ|Do you have this jacket in a larger size?|Bạn có cái áo khoác này cỡ lớn hơn không?
KET|Shopping|try on|v|mặc thử|Can I try on these shoes?|Tôi mặc thử đôi giày này được không?
KET|Shopping|discount|n|giảm giá|There is a ten percent discount on all books today.|Hôm nay tất cả sách được giảm giá mười phần trăm.
KET|Shopping|receipt|n|biên lai|Keep the receipt in case you want to change it.|Hãy giữ biên lai phòng khi bạn muốn đổi hàng.
KET|Health|headache|n|đau đầu|I have a terrible headache this morning.|Sáng nay tôi bị đau đầu kinh khủng.
KET|Health|medicine|n|thuốc|Take this medicine twice a day.|Uống thuốc này hai lần mỗi ngày.
KET|Health|temperature|n|nhiệt độ cơ thể|The nurse checked my temperature.|Y tá đã đo nhiệt độ cho tôi.
KET|Health|dentist|n|nha sĩ|I have an appointment with the dentist at three.|Tôi có cuộc hẹn với nha sĩ lúc ba giờ.
KET|Health|rest|v|nghỉ ngơi|You should rest and drink lots of water.|Bạn nên nghỉ ngơi và uống nhiều nước.
KET|Health|ill|adj|ốm, bệnh|My brother is ill, so he can't come to school.|Em trai tôi bị ốm nên không đến trường được.
KET|Free Time|hobby|n|sở thích|My favourite hobby is playing the guitar.|Sở thích yêu thích của tôi là chơi guitar.
KET|Free Time|join|v|tham gia|Would you like to join our football team?|Bạn có muốn tham gia đội bóng của chúng tôi không?
KET|Free Time|invite|v|mời|I want to invite you to my birthday party.|Mình muốn mời bạn đến tiệc sinh nhật của mình.
KET|Free Time|weekend|n|cuối tuần|What are you doing this weekend?|Cuối tuần này bạn định làm gì?
KET|Free Time|boring|adj|chán, nhàm chán|The film was so boring that I fell asleep.|Bộ phim chán đến mức tôi ngủ thiếp đi.
KET|Free Time|practise|v|luyện tập|I practise the piano every evening.|Tôi luyện đàn piano mỗi buổi tối.
KET|School|homework|n|bài tập về nhà|I have a lot of homework tonight.|Tối nay tôi có rất nhiều bài tập về nhà.
KET|School|subject|n|môn học|Maths is my favourite subject.|Toán là môn học yêu thích của tôi.
KET|School|exam|n|kỳ thi|I have an English exam on Friday.|Tôi có một kỳ thi tiếng Anh vào thứ Sáu.
KET|School|classmate|n|bạn cùng lớp|My classmate and I go home together.|Bạn cùng lớp và tôi cùng đi về nhà.
KET|School|timetable|n|thời khóa biểu|Check the timetable to see when the lesson starts.|Hãy xem thời khóa biểu để biết khi nào bài học bắt đầu.
KET|School|mistake|n|lỗi sai|I made a mistake in the test.|Tôi đã mắc một lỗi trong bài kiểm tra.
KET|Weather & Places|weather|n|thời tiết|The weather is lovely today.|Hôm nay thời tiết thật đẹp.
KET|Weather & Places|cloudy|adj|nhiều mây|It is cloudy, so take an umbrella.|Trời nhiều mây nên hãy mang theo ô.
KET|Weather & Places|library|n|thư viện|I study at the library after school.|Tôi học ở thư viện sau giờ học.
KET|Weather & Places|museum|n|bảo tàng|We visited the history museum on Sunday.|Chúng tôi đã tham quan bảo tàng lịch sử vào Chủ nhật.
KET|Weather & Places|crowded|adj|đông đúc|The market is always crowded at the weekend.|Chợ luôn đông đúc vào cuối tuần.
KET|Weather & Places|tourist|n|khách du lịch|Every tourist wants to see Ha Long Bay.|Du khách nào cũng muốn ngắm vịnh Hạ Long.
PET|Work & Jobs|employee|n|nhân viên|Every employee must wear a name badge.|Mỗi nhân viên phải đeo thẻ tên.
PET|Work & Jobs|salary|n|tiền lương|He earns a good salary as an engineer.|Anh ấy kiếm được mức lương tốt khi làm kỹ sư.
PET|Work & Jobs|interview|n|buổi phỏng vấn|She is nervous about her job interview tomorrow.|Cô ấy lo lắng về buổi phỏng vấn xin việc ngày mai.
PET|Work & Jobs|apply|v|nộp đơn, ứng tuyển|I decided to apply for a job at the hotel.|Tôi quyết định nộp đơn xin việc ở khách sạn.
PET|Work & Jobs|colleague|n|đồng nghiệp|My colleague is very helpful and kind.|Đồng nghiệp của tôi rất hay giúp đỡ và tốt bụng.
PET|Work & Jobs|deadline|n|hạn chót|We must finish the report before the deadline.|Chúng ta phải hoàn thành báo cáo trước hạn chót.
PET|Technology|download|v|tải xuống|You can download the app for free.|Bạn có thể tải ứng dụng này miễn phí.
PET|Technology|password|n|mật khẩu|Never share your password with anyone.|Đừng bao giờ chia sẻ mật khẩu với bất kỳ ai.
PET|Technology|screen|n|màn hình|Looking at a screen for too long hurts my eyes.|Nhìn màn hình quá lâu làm mắt tôi đau.
PET|Technology|charge|v|sạc pin|I need to charge my phone before we go out.|Tôi cần sạc điện thoại trước khi chúng ta ra ngoài.
PET|Technology|online|adv|trực tuyến|She enjoys shopping online.|Cô ấy thích mua sắm trực tuyến.
PET|Technology|device|n|thiết bị|This device can translate languages instantly.|Thiết bị này có thể dịch ngôn ngữ ngay lập tức.
PET|Environment|pollution|n|ô nhiễm|Air pollution is a serious problem in big cities.|Ô nhiễm không khí là vấn đề nghiêm trọng ở các thành phố lớn.
PET|Environment|recycle|v|tái chế|We recycle paper, glass and plastic at home.|Ở nhà chúng tôi tái chế giấy, thủy tinh và nhựa.
PET|Environment|rubbish|n|rác|Please put your rubbish in the bin.|Hãy bỏ rác của bạn vào thùng.
PET|Environment|protect|v|bảo vệ|We must protect wild animals and their homes.|Chúng ta phải bảo vệ động vật hoang dã và nơi ở của chúng.
PET|Environment|energy|n|năng lượng|Solar panels give us clean energy.|Các tấm pin mặt trời cho chúng ta năng lượng sạch.
PET|Environment|wildlife|n|động vật hoang dã|The national park is famous for its wildlife.|Vườn quốc gia nổi tiếng với động vật hoang dã.
PET|Feelings|nervous|adj|lo lắng, hồi hộp|I always feel nervous before an exam.|Tôi luôn cảm thấy hồi hộp trước kỳ thi.
PET|Feelings|embarrassed|adj|xấu hổ, ngượng|He felt embarrassed when he forgot her name.|Anh ấy thấy ngượng khi quên tên cô ấy.
PET|Feelings|delighted|adj|rất vui mừng|We are delighted to hear your good news.|Chúng tôi rất vui khi nghe tin tốt của bạn.
PET|Feelings|disappointed|adj|thất vọng|She was disappointed with her test result.|Cô ấy thất vọng với kết quả bài kiểm tra.
PET|Feelings|jealous|adj|ghen tị|He felt jealous of his brother's new bike.|Cậu ấy ghen tị với chiếc xe đạp mới của anh trai.
PET|Feelings|relieved|adj|nhẹ nhõm|I was relieved when the exam was finally over.|Tôi thấy nhẹ nhõm khi kỳ thi cuối cùng cũng kết thúc.
PET|Education|course|n|khóa học|I'm taking a short course in photography.|Tôi đang học một khóa ngắn về nhiếp ảnh.
PET|Education|degree|n|bằng đại học|She has a degree in biology.|Cô ấy có bằng đại học ngành sinh học.
PET|Education|revise|v|ôn tập|I need to revise for my history test.|Tôi cần ôn tập cho bài kiểm tra lịch sử.
PET|Education|scholarship|n|học bổng|He won a scholarship to study abroad.|Anh ấy giành được học bổng du học.
PET|Education|lecture|n|bài giảng|The lecture on climate change was fascinating.|Bài giảng về biến đổi khí hậu rất thú vị.
PET|Education|graduate|v|tốt nghiệp|She will graduate from university next summer.|Cô ấy sẽ tốt nghiệp đại học vào mùa hè tới.
PET|Travel & Transport|departure|n|giờ khởi hành|The departure time is half past nine.|Giờ khởi hành là chín giờ rưỡi.
PET|Travel & Transport|reservation|n|việc đặt chỗ|I made a reservation for four people at eight.|Tôi đã đặt bàn cho bốn người lúc tám giờ.
PET|Travel & Transport|cancel|v|hủy|The airline had to cancel the flight because of fog.|Hãng bay đã phải hủy chuyến vì sương mù.
PET|Travel & Transport|suitcase|n|va li|My suitcase was too heavy to carry.|Va li của tôi nặng quá không xách nổi.
PET|Travel & Transport|destination|n|điểm đến|Our final destination is Phu Quoc Island.|Điểm đến cuối cùng của chúng tôi là đảo Phú Quốc.
PET|Travel & Transport|accommodation|n|chỗ ở|The price includes accommodation and breakfast.|Giá đã bao gồm chỗ ở và bữa sáng.
PET|Health & Fitness|exercise|n|sự tập luyện|Regular exercise keeps you healthy.|Tập luyện đều đặn giúp bạn khỏe mạnh.
PET|Health & Fitness|injury|n|chấn thương|He missed the match because of a knee injury.|Anh ấy bỏ lỡ trận đấu vì chấn thương đầu gối.
PET|Health & Fitness|diet|n|chế độ ăn|A balanced diet includes fruit and vegetables.|Một chế độ ăn cân bằng gồm có trái cây và rau củ.
PET|Health & Fitness|allergic|adj|dị ứng|I'm allergic to peanuts.|Tôi bị dị ứng đậu phộng.
PET|Health & Fitness|recover|v|hồi phục|It took her a week to recover from the flu.|Cô ấy mất một tuần để hồi phục sau cơn cúm.
PET|Health & Fitness|prescription|n|đơn thuốc|The doctor gave me a prescription for the cough.|Bác sĩ kê cho tôi đơn thuốc trị ho.
PET|Social Life|celebrate|v|ăn mừng, kỷ niệm|We celebrate Tet with our whole family.|Chúng tôi đón Tết cùng cả gia đình.
PET|Social Life|argue|v|cãi nhau|They often argue about small things.|Họ thường cãi nhau vì những chuyện nhỏ.
PET|Social Life|apologise|v|xin lỗi|You should apologise for being late.|Bạn nên xin lỗi vì đến muộn.
PET|Social Life|gather|v|tụ họp|Relatives gather at my grandmother's house every Sunday.|Họ hàng tụ họp ở nhà bà tôi mỗi Chủ nhật.
PET|Social Life|generous|adj|hào phóng|My uncle is generous and always helps others.|Chú tôi hào phóng và luôn giúp đỡ người khác.
PET|Social Life|reliable|adj|đáng tin cậy|She is a reliable friend who never lets me down.|Cô ấy là người bạn đáng tin cậy, không bao giờ làm tôi thất vọng.
FCE|Media|headline|n|tiêu đề báo|The headline caught everyone's attention.|Tiêu đề báo đã thu hút sự chú ý của mọi người.
FCE|Media|broadcast|v|phát sóng|The match will be broadcast live tonight.|Trận đấu sẽ được phát sóng trực tiếp tối nay.
FCE|Media|influence|n|sự ảnh hưởng|Social media has a strong influence on teenagers.|Mạng xã hội có ảnh hưởng mạnh đến thanh thiếu niên.
FCE|Media|journalist|n|nhà báo|The journalist interviewed the mayor about the new bridge.|Nhà báo đã phỏng vấn thị trưởng về cây cầu mới.
FCE|Media|advertisement|n|quảng cáo|The advertisement made me want to buy the phone.|Quảng cáo khiến tôi muốn mua chiếc điện thoại.
FCE|Media|subscribe|v|đăng ký theo dõi|I subscribe to a channel about science.|Tôi đăng ký theo dõi một kênh về khoa học.
FCE|Science|experiment|n|thí nghiệm|The students carried out an experiment in the lab.|Các học sinh đã tiến hành một thí nghiệm trong phòng thí nghiệm.
FCE|Science|discover|v|khám phá, phát hiện|Scientists hope to discover a cure for the disease.|Các nhà khoa học hy vọng tìm ra phương thuốc chữa căn bệnh này.
FCE|Science|evidence|n|bằng chứng|There is no evidence that the story is true.|Không có bằng chứng nào cho thấy câu chuyện đó là thật.
FCE|Science|theory|n|lý thuyết|Einstein's theory changed how we see the universe.|Lý thuyết của Einstein đã thay đổi cách chúng ta nhìn vũ trụ.
FCE|Science|invention|n|phát minh|The invention of the telephone changed communication.|Phát minh ra điện thoại đã thay đổi cách giao tiếp.
FCE|Science|research|n|nghiên cứu|Her research focuses on renewable energy.|Nghiên cứu của cô ấy tập trung vào năng lượng tái tạo.
FCE|Society|community|n|cộng đồng|Volunteers help to build a stronger community.|Các tình nguyện viên giúp xây dựng cộng đồng vững mạnh hơn.
FCE|Society|unemployment|n|tình trạng thất nghiệp|Unemployment is rising in some regions.|Tình trạng thất nghiệp đang tăng ở một số khu vực.
FCE|Society|tradition|n|truyền thống|Making banh chung is an old Vietnamese tradition.|Gói bánh chưng là một truyền thống lâu đời của người Việt.
FCE|Society|generation|n|thế hệ|The older generation often worries about young people.|Thế hệ lớn tuổi thường lo lắng cho giới trẻ.
FCE|Society|poverty|n|sự nghèo đói|The charity works to reduce poverty.|Tổ chức từ thiện này nỗ lực giảm nghèo.
FCE|Society|immigrant|n|người nhập cư|Every immigrant works hard to build a new life.|Mỗi người nhập cư đều làm việc chăm chỉ để xây dựng cuộc sống mới.
FCE|Business|customer|n|khách hàng|The customer complained about the late delivery.|Khách hàng phàn nàn về việc giao hàng trễ.
FCE|Business|profit|n|lợi nhuận|The company made a huge profit this year.|Công ty đã thu được lợi nhuận khổng lồ trong năm nay.
FCE|Business|negotiate|v|đàm phán|They tried to negotiate a better price.|Họ cố gắng đàm phán một mức giá tốt hơn.
FCE|Business|budget|n|ngân sách|We have a limited budget for this project.|Chúng tôi có ngân sách hạn chế cho dự án này.
FCE|Business|competitor|n|đối thủ cạnh tranh|Our main competitor has just lowered its prices.|Đối thủ cạnh tranh chính của chúng tôi vừa hạ giá.
FCE|Business|promote|v|quảng bá, thăng chức|The shop uses social media to promote its products.|Cửa hàng dùng mạng xã hội để quảng bá sản phẩm.
FCE|Environment|climate|n|khí hậu|Climate change is affecting farmers worldwide.|Biến đổi khí hậu đang ảnh hưởng đến nông dân trên toàn thế giới.
FCE|Environment|extinct|adj|tuyệt chủng|Many animals will become extinct if we do nothing.|Nhiều loài động vật sẽ tuyệt chủng nếu chúng ta không làm gì.
FCE|Environment|greenhouse|n|nhà kính (hiệu ứng nhà kính)|Greenhouse gases trap heat in the atmosphere.|Khí nhà kính giữ nhiệt trong bầu khí quyển.
FCE|Environment|sustainable|adj|bền vững|We need sustainable ways to produce food.|Chúng ta cần những cách sản xuất lương thực bền vững.
FCE|Environment|drought|n|hạn hán|The drought destroyed most of the crops.|Hạn hán đã phá hủy phần lớn mùa màng.
FCE|Environment|conserve|v|bảo tồn, tiết kiệm|We should conserve water during the dry season.|Chúng ta nên tiết kiệm nước trong mùa khô.
FCE|Relationships|trust|n|lòng tin|Trust is the foundation of any friendship.|Lòng tin là nền tảng của mọi tình bạn.
FCE|Relationships|misunderstanding|n|sự hiểu lầm|It was just a misunderstanding between us.|Đó chỉ là một sự hiểu lầm giữa chúng tôi.
FCE|Relationships|support|v|ủng hộ, hỗ trợ|My parents always support my decisions.|Bố mẹ tôi luôn ủng hộ các quyết định của tôi.
FCE|Relationships|get along|v|hòa thuận|I get along well with my cousins.|Tôi rất hòa thuận với các anh chị em họ.
FCE|Relationships|rely|v|dựa vào, tin cậy|You can rely on me whenever you need help.|Bạn có thể dựa vào tôi bất cứ khi nào cần giúp đỡ.
FCE|Relationships|gossip|n|chuyện ngồi lê đôi mách|I don't like listening to gossip at work.|Tôi không thích nghe chuyện đồn đại ở chỗ làm.
FCE|Arts & Culture|exhibition|n|buổi triển lãm|The photography exhibition opens next week.|Buổi triển lãm nhiếp ảnh sẽ khai mạc vào tuần tới.
FCE|Arts & Culture|masterpiece|n|kiệt tác|The painting is considered a true masterpiece.|Bức tranh được xem là một kiệt tác thực sự.
FCE|Arts & Culture|performance|n|buổi biểu diễn|The dancers gave an amazing performance.|Các vũ công đã có một buổi biểu diễn tuyệt vời.
FCE|Arts & Culture|audience|n|khán giả|The audience clapped for five minutes.|Khán giả đã vỗ tay suốt năm phút.
FCE|Arts & Culture|heritage|n|di sản|Hoi An is part of our cultural heritage.|Hội An là một phần di sản văn hóa của chúng ta.
FCE|Arts & Culture|inspire|v|truyền cảm hứng|Her story will inspire many young artists.|Câu chuyện của cô ấy sẽ truyền cảm hứng cho nhiều nghệ sĩ trẻ.
FCE|Lifestyle|routine|n|thói quen hằng ngày|A morning routine helps me stay focused.|Thói quen buổi sáng giúp tôi tập trung.
FCE|Lifestyle|stress|n|căng thẳng|Too much stress can damage your health.|Quá nhiều căng thẳng có thể gây hại cho sức khỏe.
FCE|Lifestyle|balance|n|sự cân bằng|It is hard to find a balance between work and family.|Thật khó để tìm được sự cân bằng giữa công việc và gia đình.
FCE|Lifestyle|habit|n|thói quen|Biting your nails is a bad habit.|Cắn móng tay là một thói quen xấu.
FCE|Lifestyle|afford|v|đủ khả năng chi trả|We can't afford a new car this year.|Năm nay chúng tôi không đủ tiền mua xe mới.
FCE|Lifestyle|convenient|adj|tiện lợi|Online banking is quick and convenient.|Ngân hàng trực tuyến vừa nhanh vừa tiện lợi.
IELTS|Education|curriculum|n|chương trình giảng dạy|The government plans to reform the school curriculum.|Chính phủ dự định cải cách chương trình giảng dạy ở trường.
IELTS|Education|literacy|n|khả năng đọc viết|Adult literacy programmes help people find better jobs.|Các chương trình xóa mù chữ cho người lớn giúp mọi người tìm được việc tốt hơn.
IELTS|Education|tuition|n|học phí|Tuition fees have risen sharply in recent years.|Học phí đã tăng mạnh trong những năm gần đây.
IELTS|Education|compulsory|adj|bắt buộc|English is a compulsory subject in many countries.|Tiếng Anh là môn học bắt buộc ở nhiều quốc gia.
IELTS|Education|vocational|adj|thuộc dạy nghề|Vocational training prepares students for specific jobs.|Đào tạo nghề chuẩn bị cho học sinh những công việc cụ thể.
IELTS|Education|enrol|v|đăng ký nhập học|Students can enrol in online courses at any time.|Sinh viên có thể đăng ký các khóa học trực tuyến bất cứ lúc nào.
IELTS|Environment|deforestation|n|nạn phá rừng|Deforestation destroys the habitats of many species.|Nạn phá rừng hủy hoại môi trường sống của nhiều loài.
IELTS|Environment|emission|n|khí thải|The factory must reduce its emission of harmful gases.|Nhà máy phải giảm lượng khí thải độc hại.
IELTS|Environment|renewable|adj|tái tạo được|Wind and solar are renewable sources of energy.|Gió và mặt trời là các nguồn năng lượng tái tạo.
IELTS|Environment|biodiversity|n|đa dạng sinh học|Protecting biodiversity is essential for our future.|Bảo vệ đa dạng sinh học là điều thiết yếu cho tương lai của chúng ta.
IELTS|Environment|landfill|n|bãi chôn lấp rác|Most household waste ends up in a landfill.|Phần lớn rác thải sinh hoạt cuối cùng nằm ở bãi chôn lấp.
IELTS|Environment|erosion|n|sự xói mòn|Soil erosion is a serious threat to farming.|Xói mòn đất là mối đe dọa nghiêm trọng đối với nông nghiệp.
IELTS|Technology|innovation|n|sự đổi mới|Innovation drives economic growth.|Sự đổi mới thúc đẩy tăng trưởng kinh tế.
IELTS|Technology|automation|n|tự động hóa|Automation may replace many factory jobs.|Tự động hóa có thể thay thế nhiều việc làm trong nhà máy.
IELTS|Technology|privacy|n|quyền riêng tư|Many people worry about privacy online.|Nhiều người lo lắng về quyền riêng tư trên mạng.
IELTS|Technology|artificial|adj|nhân tạo|Artificial intelligence is changing healthcare.|Trí tuệ nhân tạo đang thay đổi ngành y tế.
IELTS|Technology|obsolete|adj|lỗi thời|Some skills become obsolete as technology advances.|Một số kỹ năng trở nên lỗi thời khi công nghệ phát triển.
IELTS|Technology|digital|adj|thuộc kỹ thuật số|The digital divide separates rich and poor communities.|Khoảng cách số chia rẽ các cộng đồng giàu và nghèo.
IELTS|Health|obesity|n|béo phì|Obesity is linked to heart disease and diabetes.|Béo phì có liên quan đến bệnh tim và tiểu đường.
IELTS|Health|sedentary|adj|ít vận động|A sedentary lifestyle increases health risks.|Lối sống ít vận động làm tăng rủi ro sức khỏe.
IELTS|Health|epidemic|n|dịch bệnh|The epidemic spread quickly across the region.|Dịch bệnh lan nhanh khắp khu vực.
IELTS|Health|nutrition|n|dinh dưỡng|Good nutrition is vital for children's development.|Dinh dưỡng tốt rất quan trọng cho sự phát triển của trẻ.
IELTS|Health|preventive|adj|mang tính phòng ngừa|Preventive care can save governments a lot of money.|Chăm sóc phòng ngừa có thể giúp chính phủ tiết kiệm nhiều tiền.
IELTS|Health|life expectancy|n|tuổi thọ trung bình|Life expectancy has risen steadily over the last century.|Tuổi thọ trung bình đã tăng đều đặn trong thế kỷ qua.
IELTS|Work & Economy|workforce|n|lực lượng lao động|The workforce is getting older in many countries.|Lực lượng lao động đang già đi ở nhiều quốc gia.
IELTS|Work & Economy|income|n|thu nhập|Families on a low income spend more on food.|Các gia đình thu nhập thấp chi nhiều hơn cho thực phẩm.
IELTS|Work & Economy|inflation|n|lạm phát|High inflation reduces people's purchasing power.|Lạm phát cao làm giảm sức mua của người dân.
IELTS|Work & Economy|outsource|v|thuê ngoài|Many firms outsource customer service to other countries.|Nhiều công ty thuê ngoài dịch vụ khách hàng ở các nước khác.
IELTS|Work & Economy|entrepreneur|n|doanh nhân khởi nghiệp|The young entrepreneur launched three new startups.|Doanh nhân trẻ đã tung ra ba công ty khởi nghiệp mới.
IELTS|Work & Economy|flexible|adj|linh hoạt|Flexible working hours improve employees' well-being.|Giờ làm việc linh hoạt cải thiện sức khỏe tinh thần của nhân viên.
IELTS|Society|urbanisation|n|đô thị hóa|Rapid urbanisation puts pressure on housing.|Đô thị hóa nhanh gây áp lực lên nhà ở.
IELTS|Society|inequality|n|sự bất bình đẳng|Income inequality has grown in many countries.|Bất bình đẳng thu nhập đã gia tăng ở nhiều quốc gia.
IELTS|Society|ageing|adj|già hóa|An ageing population needs more healthcare services.|Dân số già hóa cần nhiều dịch vụ y tế hơn.
IELTS|Society|stereotype|n|định kiến|The film challenges the old stereotype that women cannot lead.|Bộ phim thách thức định kiến cũ cho rằng phụ nữ không thể làm lãnh đạo.
IELTS|Society|diversity|n|sự đa dạng|Cultural diversity makes a society richer.|Sự đa dạng văn hóa làm xã hội phong phú hơn.
IELTS|Society|discrimination|n|sự phân biệt đối xử|Laws must protect people against discrimination.|Luật pháp phải bảo vệ con người khỏi sự phân biệt đối xử.
IELTS|Government|legislation|n|luật pháp|New legislation will limit plastic bags.|Luật mới sẽ hạn chế túi nhựa.
IELTS|Government|subsidy|n|khoản trợ cấp|Farmers receive a subsidy from the government.|Nông dân nhận được khoản trợ cấp từ chính phủ.
IELTS|Government|regulate|v|điều tiết, quản lý|The state should regulate advertising to children.|Nhà nước nên điều tiết quảng cáo nhắm đến trẻ em.
IELTS|Government|tax|n|thuế|A higher tax on sugary drinks may improve public health.|Mức thuế cao hơn đối với đồ uống có đường có thể cải thiện sức khỏe cộng đồng.
IELTS|Government|policy|n|chính sách|The new policy aims to reduce traffic.|Chính sách mới nhằm giảm ùn tắc giao thông.
IELTS|Government|ban|v|cấm|Some cities plan to ban cars from the centre.|Một số thành phố dự định cấm ô tô vào trung tâm.
IELTS|Globalisation|globalisation|n|toàn cầu hóa|Globalisation has connected markets around the world.|Toàn cầu hóa đã kết nối các thị trường trên khắp thế giới.
IELTS|Globalisation|tourism|n|ngành du lịch|Tourism brings income but can damage local culture.|Du lịch mang lại thu nhập nhưng có thể làm tổn hại văn hóa địa phương.
IELTS|Globalisation|migration|n|sự di cư|Migration from rural areas to cities is increasing.|Làn sóng di cư từ nông thôn ra thành phố đang gia tăng.
IELTS|Globalisation|multinational|adj|đa quốc gia|Multinational companies employ millions of workers.|Các công ty đa quốc gia thuê hàng triệu lao động.
IELTS|Globalisation|cultural|adj|thuộc văn hóa|Cultural exchange helps people understand each other.|Giao lưu văn hóa giúp mọi người hiểu nhau hơn.
IELTS|Globalisation|import|v|nhập khẩu|The country has to import most of its oil.|Đất nước này phải nhập khẩu phần lớn dầu mỏ.
`;

function parseSeed(raw) {
  const out = [];
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t) continue;
    const parts = t.split('|').map(s => s.trim());
    if (parts.length < 7) continue;
    const [level, topic, word, pos, vi, ex, exVi] = parts;
    out.push({ level, topic, word, pos, vi, ex, exVi });
  }
  return out;
}

module.exports = { SEED_WORDS: parseSeed(RAW), parseSeed };
