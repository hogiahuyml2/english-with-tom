// Vocabulary flashcard data — Part 1/3: Topics 1-8
// Format per word: { w: word, ipa: IPA (British), vi: Vietnamese meaning, ex: example sentence }
// Part 2 will add topics 9-16, Part 3 will add topics 17-25

var VOCAB_TOPICS = [

  /* ─────────────────────────────────────────────────── */
  /* 1. EDUCATION                                        */
  /* ─────────────────────────────────────────────────── */
  {
    id: 'education',
    label: '🎓 Education',
    sub: 'Giáo dục',
    words: [
      { w: 'student',      ipa: '/ˈstjuːdənt/',      vi: 'học sinh / sinh viên',       ex: 'She is a diligent student who always does her homework.' },
      { w: 'teacher',      ipa: '/ˈtiːtʃə/',          vi: 'giáo viên',                  ex: 'Our teacher explains grammar in a very clear way.' },
      { w: 'classroom',    ipa: '/ˈklɑːsruːm/',       vi: 'phòng học',                  ex: 'The classroom has thirty desks and a large whiteboard.' },
      { w: 'homework',     ipa: '/ˈhəʊmwɜːk/',        vi: 'bài tập về nhà',             ex: 'I need to finish my homework before dinner.' },
      { w: 'exam',         ipa: '/ɪɡˈzæm/',           vi: 'kỳ thi',                     ex: 'She studied hard for her final exam.' },
      { w: 'university',   ipa: '/ˌjuːnɪˈvɜːsɪti/',  vi: 'trường đại học',             ex: 'He wants to study medicine at university.' },
      { w: 'degree',       ipa: '/dɪˈɡriː/',          vi: 'bằng cấp',                   ex: 'She received her degree in economics last June.' },
      { w: 'graduate',     ipa: '/ˈɡrædʒuət/',        vi: 'tốt nghiệp',                 ex: 'He will graduate from high school next year.' },
      { w: 'scholarship',  ipa: '/ˈskɒləʃɪp/',        vi: 'học bổng',                   ex: 'She won a scholarship to study abroad.' },
      { w: 'library',      ipa: '/ˈlaɪbrəri/',        vi: 'thư viện',                   ex: 'I borrowed three books from the library.' },
      { w: 'lecture',      ipa: '/ˈlektʃə/',          vi: 'bài giảng',                  ex: 'The lecture on history lasted two hours.' },
      { w: 'assignment',   ipa: '/əˈsaɪnmənt/',       vi: 'bài tập được giao',          ex: 'The assignment is due next Monday.' },
      { w: 'curriculum',   ipa: '/kəˈrɪkjʊləm/',      vi: 'chương trình học',           ex: 'The new curriculum includes more science lessons.' },
      { w: 'subject',      ipa: '/ˈsʌbdʒɪkt/',        vi: 'môn học',                    ex: 'Maths is her favourite subject at school.' },
      { w: 'course',       ipa: '/kɔːs/',             vi: 'khoá học',                   ex: 'He is taking an online English course.' },
      { w: 'certificate',  ipa: '/səˈtɪfɪkɪt/',       vi: 'chứng chỉ',                  ex: 'She passed the exam and received a certificate.' },
      { w: 'vocabulary',   ipa: '/vəˈkæbjʊləri/',     vi: 'từ vựng',                    ex: 'Learning new vocabulary every day is very helpful.' },
      { w: 'grammar',      ipa: '/ˈɡræmə/',           vi: 'ngữ pháp',                   ex: 'Good grammar is essential for clear writing.' },
      { w: 'textbook',     ipa: '/ˈtekstbʊk/',        vi: 'sách giáo khoa',             ex: 'Please open your textbook to page fifteen.' },
      { w: 'notebook',     ipa: '/ˈnəʊtbʊk/',         vi: 'vở ghi chép',               ex: 'I write all my notes in a blue notebook.' },
      { w: 'principal',    ipa: '/ˈprɪnsɪpəl/',       vi: 'hiệu trưởng',               ex: 'The principal gave a speech at the ceremony.' },
      { w: 'tutor',        ipa: '/ˈtjuːtə/',          vi: 'gia sư',                     ex: 'She has a private tutor for mathematics.' },
      { w: 'revision',     ipa: '/rɪˈvɪʒən/',         vi: 'ôn tập',                     ex: 'Revision before the exam is very important.' },
      { w: 'attendance',   ipa: '/əˈtendəns/',        vi: 'sự hiện diện / điểm danh',   ex: 'Good attendance is required to pass the course.' },
      { w: 'discipline',   ipa: '/ˈdɪsɪplɪn/',        vi: 'kỷ luật',                    ex: 'Good discipline helps students focus in class.' },
      { w: 'knowledge',    ipa: '/ˈnɒlɪdʒ/',          vi: 'kiến thức',                  ex: 'Reading books expands your knowledge greatly.' },
      { w: 'skill',        ipa: '/skɪl/',             vi: 'kỹ năng',                    ex: 'Writing is a skill that takes practice.' },
      { w: 'essay',        ipa: '/ˈeseɪ/',            vi: 'bài luận',                   ex: 'She wrote a five-paragraph essay on climate change.' },
      { w: 'semester',     ipa: '/sɪˈmestə/',         vi: 'học kỳ',                     ex: 'The new semester starts in September.' },
      { w: 'school',       ipa: '/skuːl/',            vi: 'trường học',                 ex: 'He walks to school every morning.' }
    ]
  },

  /* ─────────────────────────────────────────────────── */
  /* 2. JOBS & CAREERS                                   */
  /* ─────────────────────────────────────────────────── */
  {
    id: 'jobs',
    label: '💼 Jobs & Careers',
    sub: 'Nghề nghiệp',
    words: [
      { w: 'career',        ipa: '/kəˈrɪə/',           vi: 'sự nghiệp',                  ex: 'She is building a successful career in medicine.' },
      { w: 'profession',    ipa: '/prəˈfeʃən/',         vi: 'nghề nghiệp (chuyên môn)',   ex: 'Teaching is a respected profession worldwide.' },
      { w: 'salary',        ipa: '/ˈsæləri/',           vi: 'lương (tháng)',              ex: 'He negotiated a higher salary with his employer.' },
      { w: 'interview',     ipa: '/ˈɪntəvjuː/',         vi: 'phỏng vấn',                  ex: 'She prepared carefully for her job interview.' },
      { w: 'employer',      ipa: '/ɪmˈplɔɪə/',          vi: 'người sử dụng lao động',     ex: 'The employer offered her a full-time contract.' },
      { w: 'employee',      ipa: '/ɪmˈplɔɪiː/',         vi: 'nhân viên',                  ex: 'Every employee received a bonus this year.' },
      { w: 'promote',       ipa: '/prəˈməʊt/',          vi: 'thăng chức',                 ex: 'She was promoted to manager after two years.' },
      { w: 'resign',        ipa: '/rɪˈzaɪn/',           vi: 'từ chức / từ bỏ',            ex: 'He decided to resign from his position.' },
      { w: 'retire',        ipa: '/rɪˈtaɪə/',           vi: 'nghỉ hưu',                   ex: 'She plans to retire at the age of sixty.' },
      { w: 'application',   ipa: '/ˌæplɪˈkeɪʃən/',      vi: 'đơn xin việc',               ex: 'He sent his application to five companies.' },
      { w: 'qualification', ipa: '/ˌkwɒlɪfɪˈkeɪʃən/',   vi: 'bằng cấp / năng lực',       ex: 'A degree is a useful qualification for this job.' },
      { w: 'contract',      ipa: '/ˈkɒntrækt/',         vi: 'hợp đồng',                   ex: 'She signed a two-year contract with the firm.' },
      { w: 'overtime',      ipa: '/ˈəʊvətaɪm/',         vi: 'làm thêm giờ',               ex: 'He often works overtime to meet deadlines.' },
      { w: 'colleague',     ipa: '/ˈkɒliːɡ/',           vi: 'đồng nghiệp',                ex: 'She gets along well with all her colleagues.' },
      { w: 'manager',       ipa: '/ˈmænɪdʒə/',          vi: 'người quản lý',              ex: 'The manager held a team meeting every Monday.' },
      { w: 'deadline',      ipa: '/ˈdedlaɪn/',          vi: 'hạn chót',                   ex: 'We must finish the project before the deadline.' },
      { w: 'freelance',     ipa: '/ˈfriːlɑːns/',        vi: 'làm việc tự do',             ex: 'She works as a freelance graphic designer.' },
      { w: 'internship',    ipa: '/ˈɪntɜːnʃɪp/',        vi: 'thực tập',                   ex: 'He completed a summer internship at a law firm.' },
      { w: 'unemployment',  ipa: '/ˌʌnɪmˈplɔɪmənt/',    vi: 'tình trạng thất nghiệp',     ex: 'Unemployment rose sharply during the pandemic.' },
      { w: 'experience',    ipa: '/ɪkˈspɪəriəns/',      vi: 'kinh nghiệm',                ex: 'Work experience is highly valued by employers.' },
      { w: 'occupation',    ipa: '/ˌɒkjʊˈpeɪʃən/',      vi: 'nghề nghiệp',                ex: 'Please state your occupation on the form.' },
      { w: 'workshop',      ipa: '/ˈwɜːkʃɒp/',          vi: 'hội thảo / lớp học thực hành', ex: 'She attended a workshop on leadership skills.' },
      { w: 'promotion',     ipa: '/prəˈməʊʃən/',        vi: 'sự thăng chức',              ex: 'Hard work and dedication often lead to promotion.' },
      { w: 'teamwork',      ipa: '/ˈtiːmwɜːk/',         vi: 'làm việc nhóm',              ex: 'Good teamwork is essential in any workplace.' },
      { w: 'office',        ipa: '/ˈɒfɪs/',             vi: 'văn phòng',                  ex: 'She works in a large open-plan office.' },
      { w: 'volunteer',     ipa: '/ˌvɒlənˈtɪə/',        vi: 'tình nguyện viên',           ex: 'She volunteers at a local charity every weekend.' },
      { w: 'recruit',       ipa: '/rɪˈkruːt/',          vi: 'tuyển dụng',                 ex: 'The company plans to recruit twenty new staff.' },
      { w: 'benefit',       ipa: '/ˈbenɪfɪt/',          vi: 'phúc lợi',                   ex: 'The job offers good benefits including health insurance.' },
      { w: 'training',      ipa: '/ˈtreɪnɪŋ/',          vi: 'đào tạo',                    ex: 'New employees must complete a week of training.' },
      { w: 'wage',          ipa: '/weɪdʒ/',             vi: 'lương (theo giờ/tuần)',       ex: 'The minimum wage was increased this year.' }
    ]
  },

  /* ─────────────────────────────────────────────────── */
  /* 3. ENVIRONMENT                                      */
  /* ─────────────────────────────────────────────────── */
  {
    id: 'environment',
    label: '🌿 Environment',
    sub: 'Môi trường',
    words: [
      { w: 'pollution',       ipa: '/pəˈluːʃən/',          vi: 'ô nhiễm',                    ex: 'Air pollution is a serious problem in big cities.' },
      { w: 'climate',         ipa: '/ˈklaɪmɪt/',           vi: 'khí hậu',                    ex: 'The climate is changing rapidly around the world.' },
      { w: 'recycle',         ipa: '/riːˈsaɪkəl/',         vi: 'tái chế',                    ex: 'We should recycle paper, glass, and plastic.' },
      { w: 'renewable',       ipa: '/rɪˈnjuːəbəl/',        vi: 'có thể tái tạo',             ex: 'Solar energy is a clean, renewable resource.' },
      { w: 'deforestation',   ipa: '/ˌdiːˌfɒrɪˈsteɪʃən/', vi: 'nạn phá rừng',              ex: 'Deforestation destroys the habitat of many animals.' },
      { w: 'greenhouse gas',  ipa: '/ˈɡriːnhaʊs ɡæs/',    vi: 'khí nhà kính',              ex: 'Greenhouse gases trap heat in the atmosphere.' },
      { w: 'ecosystem',       ipa: '/ˈiːkəʊˌsɪstəm/',      vi: 'hệ sinh thái',              ex: 'The coral reef is a fragile ecosystem.' },
      { w: 'biodiversity',    ipa: '/ˌbaɪəʊdaɪˈvɜːsɪti/', vi: 'đa dạng sinh học',          ex: 'Biodiversity is vital for a healthy planet.' },
      { w: 'emission',        ipa: '/ɪˈmɪʃən/',            vi: 'khí thải',                   ex: 'Car emissions contribute greatly to air pollution.' },
      { w: 'habitat',         ipa: '/ˈhæbɪtæt/',           vi: 'môi trường sống',            ex: 'Pandas are losing their natural habitat.' },
      { w: 'conservation',    ipa: '/ˌkɒnsəˈveɪʃən/',      vi: 'bảo tồn',                    ex: 'Wildlife conservation is important for future generations.' },
      { w: 'drought',         ipa: '/draʊt/',              vi: 'hạn hán',                    ex: 'The drought caused crops to fail across the region.' },
      { w: 'flood',           ipa: '/flʌd/',               vi: 'lũ lụt',                     ex: 'Heavy rain caused severe floods in many villages.' },
      { w: 'erosion',         ipa: '/ɪˈrəʊʒən/',           vi: 'sự xói mòn',                 ex: 'Soil erosion damages farmland and pollutes rivers.' },
      { w: 'fossil fuel',     ipa: '/ˈfɒsəl fjuːəl/',      vi: 'nhiên liệu hóa thạch',       ex: 'Burning fossil fuels releases carbon dioxide.' },
      { w: 'ozone layer',     ipa: '/ˈəʊzəʊn ˈleɪə/',      vi: 'tầng ô-dôn',                ex: 'The ozone layer protects us from ultraviolet rays.' },
      { w: 'sustainable',     ipa: '/səˈsteɪnəbəl/',       vi: 'bền vững',                   ex: 'We need sustainable solutions to our energy problems.' },
      { w: 'carbon footprint',ipa: '/ˈkɑːbən ˈfʊtprɪnt/',  vi: 'dấu chân carbon',            ex: 'Flying less can reduce your carbon footprint.' },
      { w: 'waste',           ipa: '/weɪst/',              vi: 'rác thải',                   ex: 'Industrial waste is polluting local rivers.' },
      { w: 'extinct',         ipa: '/ɪkˈstɪŋkt/',          vi: 'tuyệt chủng',                ex: 'Many species are becoming extinct due to hunting.' },
      { w: 'atmosphere',      ipa: '/ˈætməsfɪə/',          vi: 'khí quyển',                  ex: 'The atmosphere protects Earth from harmful radiation.' },
      { w: 'reforestation',   ipa: '/ˌriːˌfɒrɪˈsteɪʃən/', vi: 'tái trồng rừng',            ex: 'Reforestation programmes help restore damaged ecosystems.' },
      { w: 'solar panel',     ipa: '/ˈsəʊlə ˈpænəl/',      vi: 'tấm pin mặt trời',           ex: 'Solar panels convert sunlight into electricity.' },
      { w: 'wind turbine',    ipa: '/ˈwɪnd ˈtɜːbaɪn/',     vi: 'tuabin gió',                ex: 'Wind turbines generate clean, renewable electricity.' },
      { w: 'contamination',   ipa: '/kənˌtæmɪˈneɪʃən/',    vi: 'sự ô nhiễm / nhiễm bẩn',    ex: 'Water contamination poses a serious risk to public health.' },
      { w: 'degrade',         ipa: '/dɪˈɡreɪd/',           vi: 'phân hủy / suy thoái',       ex: 'Plastic takes hundreds of years to degrade.' },
      { w: 'acid rain',       ipa: '/ˈæsɪd reɪn/',         vi: 'mưa axit',                   ex: 'Acid rain damages forests, lakes, and buildings.' },
      { w: 'wildlife',        ipa: '/ˈwaɪldlaɪf/',         vi: 'động vật hoang dã',          ex: 'We must protect wildlife from illegal hunting.' },
      { w: 'overpopulation',  ipa: '/ˌəʊvəˌpɒpjʊˈleɪʃən/',vi: 'dân số quá mức',            ex: 'Overpopulation puts enormous pressure on natural resources.' },
      { w: 'landfill',        ipa: '/ˈlændfɪl/',           vi: 'bãi chôn lấp rác',           ex: 'Reducing landfill waste is a key environmental goal.' }
    ]
  },

  /* ─────────────────────────────────────────────────── */
  /* 4. COLOURS & SHAPES                                 */
  /* ─────────────────────────────────────────────────── */
  {
    id: 'colours',
    label: '🎨 Colours & Shapes',
    sub: 'Màu sắc & Hình dạng',
    words: [
      { w: 'crimson',      ipa: '/ˈkrɪmzən/',      vi: 'màu đỏ thẫm',             ex: 'She wore a crimson dress to the party.' },
      { w: 'scarlet',      ipa: '/ˈskɑːlɪt/',      vi: 'màu đỏ tươi',             ex: 'The scarlet tulips bloomed beautifully in the garden.' },
      { w: 'navy',         ipa: '/ˈneɪvi/',         vi: 'xanh hải quân',           ex: 'He wore a navy blue suit to the interview.' },
      { w: 'turquoise',    ipa: '/ˈtɜːkwɔɪz/',     vi: 'xanh ngọc lam',           ex: 'The turquoise sea looked stunning in the sunlight.' },
      { w: 'lavender',     ipa: '/ˈlævəndə/',       vi: 'màu tím hoa oải hương',   ex: 'The bedroom was painted a soft lavender colour.' },
      { w: 'ivory',        ipa: '/ˈaɪvəri/',        vi: 'màu ngà voi',             ex: 'The wedding dress was made of ivory silk.' },
      { w: 'beige',        ipa: '/beɪʒ/',           vi: 'màu be',                  ex: 'The walls were painted beige and cream white.' },
      { w: 'bronze',       ipa: '/brɒnz/',          vi: 'màu đồng',                ex: 'His skin turned bronze after a week in the sun.' },
      { w: 'amber',        ipa: '/ˈæmbə/',          vi: 'màu hổ phách',            ex: 'The traffic light turned amber before switching to red.' },
      { w: 'transparent',  ipa: '/trænsˈpærənt/',   vi: 'trong suốt',              ex: 'The glass vase is completely transparent.' },
      { w: 'opaque',       ipa: '/əʊˈpeɪk/',        vi: 'đục / không trong suốt',  ex: 'The frosted glass is opaque and lets in soft light.' },
      { w: 'vivid',        ipa: '/ˈvɪvɪd/',         vi: 'sặc sỡ / rực rỡ',        ex: 'The painting used vivid shades of orange and yellow.' },
      { w: 'pale',         ipa: '/peɪl/',           vi: 'nhạt màu',                ex: 'She looked pale after hearing the bad news.' },
      { w: 'shade',        ipa: '/ʃeɪd/',           vi: 'sắc độ / tông màu',       ex: 'This shade of green looks perfect on the wall.' },
      { w: 'hue',          ipa: '/hjuː/',           vi: 'màu sắc / sắc thái màu',  ex: 'The sunset showed every hue of orange and pink.' },
      { w: 'tint',         ipa: '/tɪnt/',           vi: 'màu nhạt / sắc nhẹ',      ex: 'She added a blue tint to her hair.' },
      { w: 'circle',       ipa: '/ˈsɜːkəl/',        vi: 'hình tròn',               ex: 'Draw a circle in the centre of the page.' },
      { w: 'square',       ipa: '/skweə/',          vi: 'hình vuông',              ex: 'Cut the paper into four equal squares.' },
      { w: 'triangle',     ipa: '/ˈtraɪæŋɡəl/',     vi: 'hình tam giác',           ex: 'A triangle has three sides and three angles.' },
      { w: 'rectangle',    ipa: '/ˈrektæŋɡəl/',     vi: 'hình chữ nhật',           ex: 'A door is usually shaped like a rectangle.' },
      { w: 'oval',         ipa: '/ˈəʊvəl/',         vi: 'hình bầu dục',            ex: 'The dining table has a smooth oval shape.' },
      { w: 'sphere',       ipa: '/sfɪə/',           vi: 'hình cầu',                ex: 'A football is shaped like a sphere.' },
      { w: 'cube',         ipa: '/kjuːb/',          vi: 'hình lập phương',         ex: 'An ice cube melts quickly in warm water.' },
      { w: 'cone',         ipa: '/kəʊn/',           vi: 'hình nón',                ex: 'An ice cream cone is a popular summer treat.' },
      { w: 'cylinder',     ipa: '/ˈsɪlɪndə/',       vi: 'hình trụ',                ex: 'A tin can is shaped like a cylinder.' },
      { w: 'diagonal',     ipa: '/daɪˈæɡənəl/',     vi: 'đường chéo',              ex: 'Draw a diagonal line from corner to corner.' },
      { w: 'horizontal',   ipa: '/ˌhɒrɪˈzɒntəl/',   vi: 'nằm ngang',               ex: 'The horizon is a horizontal line in the distance.' },
      { w: 'vertical',     ipa: '/ˈvɜːtɪkəl/',      vi: 'thẳng đứng',              ex: 'The fence posts must be perfectly vertical.' },
      { w: 'symmetrical',  ipa: '/sɪˈmetrɪkəl/',    vi: 'đối xứng',                ex: 'A butterfly\'s wings are perfectly symmetrical.' },
      { w: 'angular',      ipa: '/ˈæŋɡjʊlə/',       vi: 'có góc cạnh',             ex: 'The building has a very angular, modern design.' }
    ]
  },

  /* ─────────────────────────────────────────────────── */
  /* 5. FOOD & DRINK                                     */
  /* ─────────────────────────────────────────────────── */
  {
    id: 'food',
    label: '🍜 Food & Drink',
    sub: 'Ăn uống',
    words: [
      { w: 'cuisine',       ipa: '/kwɪˈziːn/',        vi: 'ẩm thực',                  ex: 'Italian cuisine is popular all over the world.' },
      { w: 'ingredient',    ipa: '/ɪnˈɡriːdiənt/',    vi: 'nguyên liệu',              ex: 'Add all the ingredients to the mixing bowl.' },
      { w: 'recipe',        ipa: '/ˈresɪpi/',          vi: 'công thức nấu ăn',         ex: 'She followed her grandmother\'s recipe for soup.' },
      { w: 'appetiser',     ipa: '/ˈæpɪtaɪzə/',       vi: 'món khai vị',              ex: 'We ordered a green salad as an appetiser.' },
      { w: 'main course',   ipa: '/meɪn kɔːs/',        vi: 'món chính',                ex: 'The main course was grilled salmon with vegetables.' },
      { w: 'dessert',       ipa: '/dɪˈzɜːt/',          vi: 'món tráng miệng',          ex: 'She ordered chocolate cake for dessert.' },
      { w: 'beverage',      ipa: '/ˈbevərɪdʒ/',        vi: 'đồ uống',                  ex: 'What beverage would you like with your meal?' },
      { w: 'portion',       ipa: '/ˈpɔːʃən/',          vi: 'khẩu phần',                ex: 'The portions at this restaurant are very generous.' },
      { w: 'seasoning',     ipa: '/ˈsiːzənɪŋ/',        vi: 'gia vị',                   ex: 'Add seasoning to taste before serving the dish.' },
      { w: 'marinade',      ipa: '/ˈmærɪneɪd/',        vi: 'nước ướp',                 ex: 'Leave the chicken in the marinade overnight.' },
      { w: 'garnish',       ipa: '/ˈɡɑːnɪʃ/',          vi: 'đồ trang trí món ăn',      ex: 'Add a sprig of parsley as a garnish.' },
      { w: 'simmer',        ipa: '/ˈsɪmə/',            vi: 'đun nhỏ lửa',              ex: 'Simmer the sauce for twenty minutes on low heat.' },
      { w: 'boil',          ipa: '/bɔɪl/',             vi: 'đun sôi',                  ex: 'Boil the pasta for ten minutes until tender.' },
      { w: 'roast',         ipa: '/rəʊst/',            vi: 'nướng (lò)',                ex: 'She roasted the chicken with garlic and herbs.' },
      { w: 'fry',           ipa: '/fraɪ/',             vi: 'chiên / xào',              ex: 'He fried the eggs in a little butter.' },
      { w: 'chop',          ipa: '/tʃɒp/',             vi: 'thái nhỏ',                 ex: 'Chop the onions finely before adding them to the pan.' },
      { w: 'slice',         ipa: '/slaɪs/',            vi: 'cắt lát',                  ex: 'She sliced the bread into thin, even pieces.' },
      { w: 'mince',         ipa: '/mɪns/',             vi: 'băm nhỏ',                  ex: 'Mince the garlic and add it to the hot oil.' },
      { w: 'blend',         ipa: '/blend/',            vi: 'xay nhuyễn / trộn',        ex: 'Blend all the fruits together to make a smoothie.' },
      { w: 'ferment',       ipa: '/fəˈment/',          vi: 'lên men',                  ex: 'Wine is made from fermented grapes.' },
      { w: 'nutritious',    ipa: '/njuːˈtrɪʃəs/',      vi: 'bổ dưỡng',                 ex: 'Vegetables are healthy and very nutritious.' },
      { w: 'calorie',       ipa: '/ˈkæləri/',          vi: 'calo',                     ex: 'This meal contains about five hundred calories.' },
      { w: 'protein',       ipa: '/ˈprəʊtiːn/',        vi: 'chất đạm',                 ex: 'Meat and beans are excellent sources of protein.' },
      { w: 'carbohydrate',  ipa: '/ˌkɑːbəʊˈhaɪdreɪt/',vi: 'tinh bột / carbohydrate',  ex: 'Bread and pasta are high in carbohydrates.' },
      { w: 'dairy',         ipa: '/ˈdeəri/',           vi: 'sản phẩm từ sữa',          ex: 'She avoids dairy products because of her intolerance.' },
      { w: 'organic',       ipa: '/ɔːˈɡænɪk/',         vi: 'hữu cơ',                   ex: 'He prefers to buy organic vegetables from the market.' },
      { w: 'vegetarian',    ipa: '/ˌvedʒɪˈteəriən/',   vi: 'ăn chay (có trứng/sữa)',   ex: 'She has been vegetarian for five years.' },
      { w: 'vegan',         ipa: '/ˈviːɡən/',          vi: 'thuần chay',               ex: 'The vegan menu offers many delicious options.' },
      { w: 'spice',         ipa: '/spaɪs/',            vi: 'gia vị cay / đặc trưng',   ex: 'Cumin is a common spice in Indian cooking.' },
      { w: 'gluten-free',   ipa: '/ˈɡluːtənˈfriː/',    vi: 'không chứa gluten',        ex: 'The bakery sells gluten-free bread and cakes.' }
    ]
  },

  /* ─────────────────────────────────────────────────── */
  /* 6. FAMILY & RELATIONSHIPS                           */
  /* ─────────────────────────────────────────────────── */
  {
    id: 'family',
    label: '👨‍👩‍👧 Family & Relationships',
    sub: 'Gia đình & Các mối quan hệ',
    words: [
      { w: 'sibling',         ipa: '/ˈsɪblɪŋ/',          vi: 'anh chị em ruột',            ex: 'She has two siblings, a brother and a sister.' },
      { w: 'relative',        ipa: '/ˈrelətɪv/',          vi: 'họ hàng',                    ex: 'We visited our relatives during the holidays.' },
      { w: 'ancestor',        ipa: '/ˈænsestə/',          vi: 'tổ tiên',                    ex: 'She researched her ancestors in old church records.' },
      { w: 'descendant',      ipa: '/dɪˈsendənt/',        vi: 'con cháu / hậu duệ',         ex: 'He is a descendant of a famous explorer.' },
      { w: 'spouse',          ipa: '/spaʊs/',             vi: 'vợ / chồng',                 ex: 'Her spouse is a doctor at the city hospital.' },
      { w: 'fiancé',          ipa: '/fiˈɒnseɪ/',          vi: 'hôn phu / vị hôn phu',       ex: 'She introduced her fiancé to her parents last week.' },
      { w: 'orphan',          ipa: '/ˈɔːfən/',            vi: 'trẻ mồ côi',                 ex: 'The charity provides support to orphans in rural areas.' },
      { w: 'guardian',        ipa: '/ˈɡɑːdiən/',          vi: 'người giám hộ',              ex: 'His uncle became his legal guardian after the accident.' },
      { w: 'household',       ipa: '/ˈhaʊshəʊld/',        vi: 'hộ gia đình',                ex: 'There are five people in their household.' },
      { w: 'upbringing',      ipa: '/ˈʌpˌbrɪŋɪŋ/',       vi: 'cách nuôi dạy',              ex: 'Her upbringing taught her to be honest and respectful.' },
      { w: 'divorce',         ipa: '/dɪˈvɔːs/',           vi: 'ly hôn',                     ex: 'The couple decided to get a divorce last year.' },
      { w: 'marriage',        ipa: '/ˈmærɪdʒ/',           vi: 'hôn nhân',                   ex: 'Their marriage has lasted for over thirty years.' },
      { w: 'bonding',         ipa: '/ˈbɒndɪŋ/',           vi: 'sự gắn kết',                 ex: 'Family bonding activities strengthen relationships.' },
      { w: 'affection',       ipa: '/əˈfekʃən/',          vi: 'tình cảm yêu thương',        ex: 'She shows affection by giving hugs to her children.' },
      { w: 'trust',           ipa: '/trʌst/',             vi: 'sự tin tưởng',               ex: 'Trust is the foundation of any good relationship.' },
      { w: 'respect',         ipa: '/rɪˈspekt/',          vi: 'sự tôn trọng',               ex: 'We should always show respect to our elders.' },
      { w: 'conflict',        ipa: '/ˈkɒnflɪkt/',         vi: 'mâu thuẫn',                  ex: 'They resolved the conflict by talking calmly together.' },
      { w: 'support',         ipa: '/səˈpɔːt/',           vi: 'sự hỗ trợ',                  ex: 'Family support is crucial during difficult times.' },
      { w: 'nurture',         ipa: '/ˈnɜːtʃə/',           vi: 'nuôi dưỡng / chăm sóc',      ex: 'Good parents nurture their children\'s talents and confidence.' },
      { w: 'reunion',         ipa: '/riːˈjuːniən/',       vi: 'cuộc đoàn tụ',               ex: 'The whole family had a reunion at Christmas.' },
      { w: 'generation',      ipa: '/ˌdʒenəˈreɪʃən/',    vi: 'thế hệ',                     ex: 'Three generations of the family live in one house.' },
      { w: 'inheritance',     ipa: '/ɪnˈherɪtəns/',       vi: 'di sản / tài sản thừa kế',   ex: 'He received a small inheritance from his grandfather.' },
      { w: 'adopted',         ipa: '/əˈdɒptɪd/',          vi: 'được nhận nuôi',             ex: 'Their adopted daughter joined the family at age three.' },
      { w: 'stepparent',      ipa: '/ˈstepˌpeərənt/',     vi: 'cha / mẹ kế',               ex: 'She has a kind stepparent who supports her studies.' },
      { w: 'childcare',       ipa: '/ˈtʃaɪldkeə/',        vi: 'chăm sóc trẻ em',            ex: 'Good childcare is essential for working parents.' },
      { w: 'elderly',         ipa: '/ˈeldəli/',           vi: 'người cao tuổi',             ex: 'She takes care of her elderly grandmother every day.' },
      { w: 'twin',            ipa: '/twɪn/',              vi: 'sinh đôi',                   ex: 'The twins look exactly alike and share the same room.' },
      { w: 'extended family', ipa: '/ɪkˈstendɪd ˈfæmɪli/',vi: 'gia đình mở rộng',          ex: 'In Vietnam, the extended family often lives together.' },
      { w: 'only child',      ipa: '/ˈəʊnli tʃaɪld/',    vi: 'con một',                    ex: 'As an only child, she received all her parents\' attention.' },
      { w: 'parenthood',      ipa: '/ˈpeərənthʊd/',       vi: 'việc làm cha mẹ',            ex: 'Parenthood brings great joy and responsibility.' }
    ]
  },

  /* ─────────────────────────────────────────────────── */
  /* 7. HEALTH & BODY                                    */
  /* ─────────────────────────────────────────────────── */
  {
    id: 'health',
    label: '💊 Health & Body',
    sub: 'Sức khỏe & Cơ thể',
    words: [
      { w: 'symptom',       ipa: '/ˈsɪmptəm/',         vi: 'triệu chứng',               ex: 'Fever and cough are common symptoms of flu.' },
      { w: 'diagnosis',     ipa: '/ˌdaɪəɡˈnəʊsɪs/',    vi: 'chẩn đoán',                 ex: 'The doctor gave her a diagnosis after the blood test.' },
      { w: 'prescription',  ipa: '/prɪˈskrɪpʃən/',     vi: 'đơn thuốc',                 ex: 'The pharmacist filled her prescription immediately.' },
      { w: 'surgery',       ipa: '/ˈsɜːdʒəri/',         vi: 'phẫu thuật',                ex: 'He had surgery on his knee last month.' },
      { w: 'recovery',      ipa: '/rɪˈkʌvəri/',         vi: 'sự hồi phục',               ex: 'Her recovery from the illness was surprisingly quick.' },
      { w: 'immune',        ipa: '/ɪˈmjuːn/',           vi: 'miễn dịch',                 ex: 'A healthy diet helps keep the immune system strong.' },
      { w: 'vaccine',       ipa: '/ˈvæksiːn/',          vi: 'vắc-xin',                   ex: 'The vaccine protects against several dangerous diseases.' },
      { w: 'chronic',       ipa: '/ˈkrɒnɪk/',           vi: 'mãn tính',                  ex: 'She manages a chronic back condition with daily exercise.' },
      { w: 'therapy',       ipa: '/ˈθerəpi/',           vi: 'liệu pháp / trị liệu',      ex: 'He attends weekly therapy sessions for anxiety.' },
      { w: 'nutrition',     ipa: '/njuːˈtrɪʃən/',       vi: 'dinh dưỡng',                ex: 'Good nutrition is important for children\'s development.' },
      { w: 'obesity',       ipa: '/əʊˈbiːsɪti/',        vi: 'béo phì',                   ex: 'Obesity is linked to many serious health problems.' },
      { w: 'hygiene',       ipa: '/ˈhaɪdʒiːn/',         vi: 'vệ sinh',                   ex: 'Good hand hygiene prevents the spread of disease.' },
      { w: 'allergy',       ipa: '/ˈælədʒi/',           vi: 'dị ứng',                    ex: 'She has a severe allergy to peanuts.' },
      { w: 'fracture',      ipa: '/ˈfræktʃə/',          vi: 'gãy xương',                 ex: 'He suffered a fracture in his right arm.' },
      { w: 'pulse',         ipa: '/pʌls/',              vi: 'mạch đập',                  ex: 'The nurse checked his pulse every thirty minutes.' },
      { w: 'inflammation',  ipa: '/ˌɪnfləˈmeɪʃən/',     vi: 'viêm / tình trạng viêm',    ex: 'The injury caused swelling and inflammation.' },
      { w: 'antibiotics',   ipa: '/ˌæntibaɪˈɒtɪks/',    vi: 'kháng sinh',                ex: 'The doctor prescribed antibiotics for the infection.' },
      { w: 'sedentary',     ipa: '/ˈsedəntəri/',        vi: 'ít vận động',               ex: 'A sedentary lifestyle increases the risk of heart disease.' },
      { w: 'fatigue',       ipa: '/fəˈtiːɡ/',           vi: 'sự mệt mỏi / kiệt sức',     ex: 'Fatigue can result from a lack of sleep.' },
      { w: 'migraine',      ipa: '/ˈmiːɡreɪn/',         vi: 'đau nửa đầu',               ex: 'She suffered a severe migraine that lasted all day.' },
      { w: 'organ',         ipa: '/ˈɔːɡən/',            vi: 'cơ quan (nội tạng)',         ex: 'The heart is the most vital organ in the body.' },
      { w: 'virus',         ipa: '/ˈvaɪrəs/',           vi: 'vi-rút',                    ex: 'The virus spreads quickly in crowded places.' },
      { w: 'bacteria',      ipa: '/bækˈtɪəriə/',        vi: 'vi khuẩn',                  ex: 'Some bacteria are helpful, but others cause disease.' },
      { w: 'mental health', ipa: '/ˈmentl helθ/',        vi: 'sức khỏe tâm thần',         ex: 'Schools should teach children about mental health.' },
      { w: 'blood pressure',ipa: '/blʌd ˈpreʃə/',        vi: 'huyết áp',                  ex: 'He monitors his blood pressure every morning.' },
      { w: 'inhale',        ipa: '/ɪnˈheɪl/',           vi: 'hít vào',                   ex: 'Breathe in deeply and inhale through your nose.' },
      { w: 'exhale',        ipa: '/eksˈheɪl/',          vi: 'thở ra',                    ex: 'Slowly exhale through your mouth for five seconds.' },
      { w: 'digest',        ipa: '/daɪˈdʒest/',         vi: 'tiêu hóa',                  ex: 'It takes several hours to digest a large meal.' },
      { w: 'heartbeat',     ipa: '/ˈhɑːtbiːt/',         vi: 'nhịp tim',                  ex: 'Exercise makes your heartbeat faster and stronger.' },
      { w: 'wound',         ipa: '/wuːnd/',             vi: 'vết thương',                ex: 'He cleaned and bandaged the wound carefully.' }
    ]
  },

  /* ─────────────────────────────────────────────────── */
  /* 8. TRAVEL & TRANSPORT                               */
  /* ─────────────────────────────────────────────────── */
  {
    id: 'travel',
    label: '✈️ Travel & Transport',
    sub: 'Du lịch & Phương tiện',
    words: [
      { w: 'destination',  ipa: '/ˌdestɪˈneɪʃən/',   vi: 'điểm đến',                   ex: 'Paris is her dream travel destination.' },
      { w: 'itinerary',    ipa: '/aɪˈtɪnərəri/',      vi: 'lịch trình',                  ex: 'The travel agent prepared a detailed itinerary.' },
      { w: 'accommodation',ipa: '/əˌkɒməˈdeɪʃən/',    vi: 'chỗ ở',                       ex: 'We booked accommodation near the city centre.' },
      { w: 'departure',    ipa: '/dɪˈpɑːtʃə/',        vi: 'sự khởi hành',               ex: 'Our departure is scheduled for six in the morning.' },
      { w: 'arrival',      ipa: '/əˈraɪvəl/',         vi: 'sự đến nơi',                 ex: 'The arrival of the train was delayed by an hour.' },
      { w: 'passport',     ipa: '/ˈpɑːspɔːt/',        vi: 'hộ chiếu',                   ex: 'Always keep your passport in a safe place.' },
      { w: 'visa',         ipa: '/ˈviːzə/',           vi: 'thị thực',                   ex: 'She applied for a student visa to study in the UK.' },
      { w: 'customs',      ipa: '/ˈkʌstəmz/',         vi: 'hải quan',                   ex: 'You must declare certain goods at customs.' },
      { w: 'luggage',      ipa: '/ˈlʌɡɪdʒ/',          vi: 'hành lý',                    ex: 'She packed her luggage the night before the trip.' },
      { w: 'boarding',     ipa: '/ˈbɔːdɪŋ/',          vi: 'lên phương tiện / lên máy bay', ex: 'Please proceed to the boarding gate immediately.' },
      { w: 'transit',      ipa: '/ˈtrænsɪt/',         vi: 'quá cảnh',                   ex: 'We had a three-hour transit stop in Singapore.' },
      { w: 'turbulence',   ipa: '/ˈtɜːbjʊləns/',      vi: 'nhiễu loạn không khí',        ex: 'The plane experienced turbulence over the mountains.' },
      { w: 'scenic',       ipa: '/ˈsiːnɪk/',          vi: 'có phong cảnh đẹp',           ex: 'The scenic route along the coast was breathtaking.' },
      { w: 'excursion',    ipa: '/ɪkˈskɜːʃən/',       vi: 'chuyến tham quan',            ex: 'We booked a day excursion to the nearby waterfall.' },
      { w: 'souvenir',     ipa: '/ˌsuːvəˈnɪə/',       vi: 'đồ lưu niệm',                ex: 'She bought souvenirs for her family at the market.' },
      { w: 'currency',     ipa: '/ˈkʌrənsi/',         vi: 'tiền tệ',                    ex: 'He exchanged currency at the airport before the trip.' },
      { w: 'immigration',  ipa: '/ˌɪmɪˈɡreɪʃən/',     vi: 'xuất nhập cảnh',             ex: 'They waited in a long queue at the immigration desk.' },
      { w: 'hostel',       ipa: '/ˈhɒstəl/',          vi: 'nhà nghỉ / ký túc xá khách',  ex: 'Backpackers often stay in cheap but friendly hostels.' },
      { w: 'shuttle',      ipa: '/ˈʃʌtəl/',           vi: 'xe / tàu đưa đón',            ex: 'A free shuttle bus runs between the hotel and airport.' },
      { w: 'commute',      ipa: '/kəˈmjuːt/',         vi: 'đi lại hàng ngày',            ex: 'Her daily commute takes about forty minutes.' },
      { w: 'motorway',     ipa: '/ˈməʊtəweɪ/',        vi: 'đường cao tốc',               ex: 'The motorway was closed due to an accident.' },
      { w: 'junction',     ipa: '/ˈdʒʌŋkʃən/',        vi: 'ngã tư / điểm giao lộ',       ex: 'Turn left at the next junction.' },
      { w: 'ferry',        ipa: '/ˈferi/',            vi: 'phà',                        ex: 'They took a ferry across the wide river.' },
      { w: 'timetable',    ipa: '/ˈtaɪmˌteɪbəl/',     vi: 'lịch tàu / xe',              ex: 'Always check the timetable before you travel.' },
      { w: 'delayed',      ipa: '/dɪˈleɪd/',          vi: 'bị trễ / bị chậm',           ex: 'The flight was delayed by two hours due to fog.' },
      { w: 'check in',     ipa: '/tʃek ɪn/',          vi: 'làm thủ tục / nhận phòng',   ex: 'Please check in at least two hours before departure.' },
      { w: 'overhead',     ipa: '/ˌəʊvəˈhed/',        vi: 'phía trên đầu (ngăn hành lý)', ex: 'Please stow your bag in the overhead compartment.' },
      { w: 'hitchhike',    ipa: '/ˈhɪtʃhaɪk/',        vi: 'đi nhờ xe',                  ex: 'He hitchhiked across the country during his gap year.' },
      { w: 'landmark',     ipa: '/ˈlændmɑːk/',        vi: 'địa danh / mốc nổi tiếng',   ex: 'Big Ben is one of London\'s most famous landmarks.' },
      { w: 'expedition',   ipa: '/ˌekspɪˈdɪʃən/',     vi: 'cuộc thám hiểm',             ex: 'He joined an expedition to the Arctic last year.' }
    ]
  }

  // ── Part 3 will add topics 17-25 (Hobbies → Personality) ──

  /* ─────────────────────────────────────────────────── */
  /* 9. TECHNOLOGY                                       */
  /* ─────────────────────────────────────────────────── */
  ,{
    id: 'technology',
    label: '💻 Technology',
    sub: 'Công nghệ',
    words: [
      { w: 'software',        ipa: '/ˈsɒftweə/',          vi: 'phần mềm',                    ex: 'She uses specialist software to edit videos.' },
      { w: 'hardware',        ipa: '/ˈhɑːdweə/',           vi: 'phần cứng',                   ex: 'The new hardware makes the computer run much faster.' },
      { w: 'database',        ipa: '/ˈdeɪtəbeɪs/',         vi: 'cơ sở dữ liệu',               ex: 'All customer records are stored in a secure database.' },
      { w: 'algorithm',       ipa: '/ˈælɡərɪðəm/',         vi: 'thuật toán',                  ex: 'The search engine uses a very complex algorithm.' },
      { w: 'artificial intelligence', ipa: '/ˌɑːtɪˈfɪʃəl ɪnˈtelɪdʒəns/', vi: 'trí tuệ nhân tạo', ex: 'Artificial intelligence is transforming many industries.' },
      { w: 'bandwidth',       ipa: '/ˈbændwɪdθ/',          vi: 'băng thông',                  ex: 'Streaming video requires a high bandwidth connection.' },
      { w: 'encryption',      ipa: '/ɪnˈkrɪpʃən/',         vi: 'mã hóa',                      ex: 'Encryption keeps your personal data safe online.' },
      { w: 'browser',         ipa: '/ˈbraʊzə/',            vi: 'trình duyệt web',              ex: 'She opened a browser and searched for directions.' },
      { w: 'download',        ipa: '/ˈdaʊnləʊd/',          vi: 'tải xuống',                   ex: 'He downloaded the app on his smartphone.' },
      { w: 'upload',          ipa: '/ˈʌpləʊd/',            vi: 'tải lên',                     ex: 'She uploaded her photos to social media.' },
      { w: 'wireless',        ipa: '/ˈwaɪələs/',           vi: 'không dây',                   ex: 'The office has a fast wireless network.' },
      { w: 'streaming',       ipa: '/ˈstriːmɪŋ/',          vi: 'phát trực tuyến',             ex: 'Streaming services have largely replaced DVD players.' },
      { w: 'backup',          ipa: '/ˈbækʌp/',             vi: 'sao lưu',                     ex: 'Always make a backup of your important files.' },
      { w: 'update',          ipa: '/ˈʌpdeɪt/',            vi: 'cập nhật',                    ex: 'Please install the latest software update.' },
      { w: 'firewall',        ipa: '/ˈfaɪəwɔːl/',          vi: 'tường lửa',                   ex: 'A firewall protects the network from intruders.' },
      { w: 'processor',       ipa: '/ˈprəʊsesə/',          vi: 'bộ xử lý',                    ex: 'The new processor is twice as fast as the old one.' },
      { w: 'storage',         ipa: '/ˈstɔːrɪdʒ/',          vi: 'bộ nhớ lưu trữ',              ex: 'She bought extra storage space for her laptop.' },
      { w: 'cloud',           ipa: '/klaʊd/',              vi: 'điện toán đám mây',            ex: 'All files are saved to the cloud automatically.' },
      { w: 'network',         ipa: '/ˈnetwɜːk/',           vi: 'mạng lưới / mạng máy tính',   ex: 'The company has a highly secure internal network.' },
      { w: 'password',        ipa: '/ˈpɑːswɜːd/',          vi: 'mật khẩu',                    ex: 'Use a strong password to protect your account.' },
      { w: 'notification',    ipa: '/ˌnəʊtɪfɪˈkeɪʃən/',    vi: 'thông báo',                   ex: 'She turned off phone notifications during class.' },
      { w: 'interface',       ipa: '/ˈɪntəfeɪs/',          vi: 'giao diện',                   ex: 'The app has a clean and user-friendly interface.' },
      { w: 'pixel',           ipa: '/ˈpɪksəl/',            vi: 'điểm ảnh',                    ex: 'The screen has a resolution of over two million pixels.' },
      { w: 'digital',         ipa: '/ˈdɪdʒɪtəl/',          vi: 'kỹ thuật số',                 ex: 'We now live in a fully digital age.' },
      { w: 'virtual',         ipa: '/ˈvɜːtʃuəl/',          vi: 'ảo / trực tuyến',             ex: 'She attended a virtual meeting from home.' },
      { w: 'programme',       ipa: '/ˈprəʊɡræm/',          vi: 'chương trình (máy tính)',      ex: 'He wrote a programme to sort the data automatically.' },
      { w: 'social media',    ipa: '/ˈsəʊʃəl ˈmiːdiə/',    vi: 'mạng xã hội',                 ex: 'Social media connects people all around the world.' },
      { w: 'cybersecurity',   ipa: '/ˌsaɪbəsɪˈkjʊərɪti/',  vi: 'an ninh mạng',                ex: 'Cybersecurity is increasingly important for businesses.' },
      { w: 'innovation',      ipa: '/ˌɪnəˈveɪʃən/',        vi: 'sự đổi mới / sáng tạo',       ex: 'Technology drives innovation in every industry.' },
      { w: 'automation',      ipa: '/ˌɔːtəˈmeɪʃən/',       vi: 'tự động hóa',                 ex: 'Automation has replaced many manual factory jobs.' }
    ]
  },

  /* ─────────────────────────────────────────────────── */
  /* 10. SPORTS & ACTIVITIES                             */
  /* ─────────────────────────────────────────────────── */
  {
    id: 'sports',
    label: '⚽ Sports & Activities',
    sub: 'Thể thao & Hoạt động',
    words: [
      { w: 'athlete',       ipa: '/ˈæθliːt/',          vi: 'vận động viên',              ex: 'She is a talented athlete who trains every day.' },
      { w: 'championship',  ipa: '/ˈtʃæmpiənʃɪp/',     vi: 'giải vô địch',               ex: 'They won the national championship last year.' },
      { w: 'tournament',    ipa: '/ˈtɔːnəmənt/',        vi: 'giải đấu',                   ex: 'He entered a tennis tournament at the weekend.' },
      { w: 'opponent',      ipa: '/əˈpəʊnənt/',         vi: 'đối thủ',                    ex: 'She defeated her opponent in three sets.' },
      { w: 'referee',       ipa: '/ˌrefəˈriː/',         vi: 'trọng tài',                  ex: 'The referee blew the whistle to end the match.' },
      { w: 'spectator',     ipa: '/spekˈteɪtə/',        vi: 'khán giả',                   ex: 'Thousands of spectators watched the final match.' },
      { w: 'trophy',        ipa: '/ˈtrəʊfi/',           vi: 'cúp / chiến lợi phẩm',        ex: 'They lifted the trophy after winning the final.' },
      { w: 'stadium',       ipa: '/ˈsteɪdiəm/',         vi: 'sân vận động',                ex: 'The new stadium holds fifty thousand people.' },
      { w: 'coach',         ipa: '/kəʊtʃ/',             vi: 'huấn luyện viên',             ex: 'The coach trained the team every morning.' },
      { w: 'penalty',       ipa: '/ˈpenəlti/',          vi: 'phạt đền / hình phạt',        ex: 'He scored from the penalty spot in extra time.' },
      { w: 'sprint',        ipa: '/sprɪnt/',            vi: 'chạy nước rút',               ex: 'She won the hundred-metre sprint in under twelve seconds.' },
      { w: 'endurance',     ipa: '/ɪnˈdjʊərəns/',       vi: 'sức bền',                    ex: 'Marathon running requires exceptional endurance.' },
      { w: 'warm up',       ipa: '/wɔːm ʌp/',           vi: 'khởi động',                  ex: 'Always warm up for ten minutes before exercising.' },
      { w: 'fitness',       ipa: '/ˈfɪtnɪs/',           vi: 'thể lực / sức khoẻ',         ex: 'Regular exercise greatly improves your fitness.' },
      { w: 'injury',        ipa: '/ˈɪndʒəri/',          vi: 'chấn thương',                ex: 'He suffered a knee injury during training.' },
      { w: 'medal',         ipa: '/ˈmedəl/',            vi: 'huy chương',                 ex: 'She won a gold medal at the Olympic Games.' },
      { w: 'league',        ipa: '/liːɡ/',              vi: 'giải đấu / liên đoàn',        ex: 'The team was promoted to the top league.' },
      { w: 'substitute',    ipa: '/ˈsʌbstɪtjuːt/',     vi: 'cầu thủ dự bị',              ex: 'The substitute came on in the second half.' },
      { w: 'strategy',      ipa: '/ˈstrætədʒi/',        vi: 'chiến lược',                 ex: 'The team\'s strategy was to defend and counter-attack.' },
      { w: 'stamina',       ipa: '/ˈstæmɪnə/',          vi: 'sức chịu đựng',              ex: 'Cyclists need a great deal of stamina.' },
      { w: 'compete',       ipa: '/kəmˈpiːt/',          vi: 'thi đấu',                    ex: 'She competed against athletes from twenty countries.' },
      { w: 'score',         ipa: '/skɔː/',              vi: 'ghi bàn / điểm số',           ex: 'He scored two goals in the first half.' },
      { w: 'defeat',        ipa: '/dɪˈfiːt/',           vi: 'đánh bại',                   ex: 'They defeated the home team three goals to one.' },
      { w: 'record',        ipa: '/ˈrekɔːd/',           vi: 'kỷ lục',                     ex: 'She broke the world record for the high jump.' },
      { w: 'circuit',       ipa: '/ˈsɜːkɪt/',           vi: 'đường đua / vòng đua',        ex: 'The racing car completed thirty laps of the circuit.' },
      { w: 'gymnastics',    ipa: '/dʒɪmˈnæstɪks/',      vi: 'thể dục dụng cụ',            ex: 'She has been doing gymnastics since the age of five.' },
      { w: 'rowing',        ipa: '/ˈrəʊɪŋ/',            vi: 'chèo thuyền',                ex: 'They took up rowing on the river at weekends.' },
      { w: 'martial arts',  ipa: '/ˈmɑːʃəl ɑːts/',      vi: 'võ thuật',                   ex: 'He practises martial arts three times a week.' },
      { w: 'swimming pool', ipa: '/ˈswɪmɪŋ puːl/',      vi: 'bể bơi',                     ex: 'The hotel has a large outdoor swimming pool.' },
      { w: 'perseverance',  ipa: '/ˌpɜːsɪˈvɪərəns/',    vi: 'sự kiên trì',                ex: 'Success in sport requires perseverance and hard work.' }
    ]
  },

  /* ─────────────────────────────────────────────────── */
  /* 11. ANIMALS & NATURE                                */
  /* ─────────────────────────────────────────────────── */
  {
    id: 'animals',
    label: '🦁 Animals & Nature',
    sub: 'Động vật & Thiên nhiên',
    words: [
      { w: 'mammal',         ipa: '/ˈmæməl/',           vi: 'động vật có vú',              ex: 'A whale is the largest mammal on Earth.' },
      { w: 'reptile',        ipa: '/ˈreptaɪl/',          vi: 'bò sát',                      ex: 'A crocodile is a large and dangerous reptile.' },
      { w: 'amphibian',      ipa: '/æmˈfɪbiən/',         vi: 'lưỡng cư',                    ex: 'A frog is an amphibian that lives in water and on land.' },
      { w: 'predator',       ipa: '/ˈpredətə/',          vi: 'thú săn mồi',                 ex: 'The lion is a powerful and skilled predator.' },
      { w: 'prey',           ipa: '/preɪ/',              vi: 'con mồi',                     ex: 'Rabbits are common prey for foxes and owls.' },
      { w: 'camouflage',     ipa: '/ˈkæməflɑːʒ/',        vi: 'ngụy trang',                  ex: 'The chameleon uses camouflage to hide from predators.' },
      { w: 'hibernate',      ipa: '/ˈhaɪbəneɪt/',        vi: 'ngủ đông',                    ex: 'Bears hibernate during the cold winter months.' },
      { w: 'migrate',        ipa: '/maɪˈɡreɪt/',         vi: 'di cư',                       ex: 'Many birds migrate south in the autumn.' },
      { w: 'endangered',     ipa: '/ɪnˈdeɪndʒəd/',       vi: 'có nguy cơ tuyệt chủng',      ex: 'The snow leopard is an endangered species.' },
      { w: 'carnivore',      ipa: '/ˈkɑːnɪvɔː/',         vi: 'động vật ăn thịt',            ex: 'Tigers are carnivores that hunt large prey.' },
      { w: 'herbivore',      ipa: '/ˈhɜːbɪvɔː/',         vi: 'động vật ăn cỏ',              ex: 'Cows and sheep are herbivores.' },
      { w: 'omnivore',       ipa: '/ˈɒmnɪvɔː/',          vi: 'động vật ăn tạp',             ex: 'Bears are omnivores that eat both plants and meat.' },
      { w: 'nocturnal',      ipa: '/nɒkˈtɜːnəl/',        vi: 'hoạt động về đêm',            ex: 'Owls are nocturnal birds that hunt at night.' },
      { w: 'domesticated',   ipa: '/dəˈmestɪkeɪtɪd/',    vi: 'được thuần hoá',              ex: 'Dogs were domesticated thousands of years ago.' },
      { w: 'venom',          ipa: '/ˈvenəm/',            vi: 'nọc độc',                     ex: 'Some snakes have extremely deadly venom.' },
      { w: 'fur',            ipa: '/fɜː/',               vi: 'bộ lông (thú)',                ex: 'The polar bear\'s thick fur keeps it warm in the Arctic.' },
      { w: 'feather',        ipa: '/ˈfeðə/',             vi: 'lông vũ (chim)',               ex: 'The bird displayed its bright blue feathers.' },
      { w: 'scales',         ipa: '/skeɪlz/',            vi: 'vảy cá / vảy bò sát',         ex: 'A fish is covered in small, shiny scales.' },
      { w: 'spawn',          ipa: '/spɔːn/',             vi: 'đẻ trứng (cá, ếch)',           ex: 'Salmon swim upstream to spawn every year.' },
      { w: 'burrow',         ipa: '/ˈbʌrəʊ/',            vi: 'hang (đào trong đất)',         ex: 'Rabbits live in underground burrows.' },
      { w: 'flock',          ipa: '/flɒk/',              vi: 'đàn (chim)',                  ex: 'A large flock of birds flew overhead at sunset.' },
      { w: 'herd',           ipa: '/hɜːd/',              vi: 'đàn (gia súc / voi)',          ex: 'A herd of elephants crossed the wide river.' },
      { w: 'pack',           ipa: '/pæk/',               vi: 'bầy (chó sói)',               ex: 'A pack of wolves howled in the distance.' },
      { w: 'swarm',          ipa: '/swɔːm/',             vi: 'bầy (côn trùng)',             ex: 'A swarm of bees surrounded the hive.' },
      { w: 'breed',          ipa: '/briːd/',             vi: 'giống loài / sinh sản',        ex: 'This breed of dog is known for being very friendly.' },
      { w: 'instinct',       ipa: '/ˈɪnstɪŋkt/',         vi: 'bản năng',                    ex: 'Survival instinct drives all animals to find food.' },
      { w: 'territory',      ipa: '/ˈterɪtəri/',         vi: 'lãnh thổ',                    ex: 'Male lions defend their territory fiercely.' },
      { w: 'aquatic',        ipa: '/əˈkwætɪk/',          vi: 'thuộc về môi trường nước',    ex: 'Dolphins are aquatic mammals, not fish.' },
      { w: 'savanna',        ipa: '/səˈvænə/',           vi: 'thảo nguyên',                 ex: 'Many large animals roam the African savanna.' },
      { w: 'pollinate',      ipa: '/ˈpɒlɪneɪt/',         vi: 'thụ phấn',                    ex: 'Bees pollinate flowers as they collect nectar.' }
    ]
  },

  /* ─────────────────────────────────────────────────── */
  /* 12. WEATHER & SEASONS                               */
  /* ─────────────────────────────────────────────────── */
  {
    id: 'weather',
    label: '🌦️ Weather & Seasons',
    sub: 'Thời tiết & Mùa',
    words: [
      { w: 'temperature',    ipa: '/ˈtemprətʃə/',        vi: 'nhiệt độ',                    ex: 'The temperature reached thirty-five degrees today.' },
      { w: 'humidity',       ipa: '/hjuːˈmɪdɪti/',       vi: 'độ ẩm',                       ex: 'High humidity makes hot weather feel much worse.' },
      { w: 'forecast',       ipa: '/ˈfɔːkɑːst/',         vi: 'dự báo thời tiết',            ex: 'The weather forecast predicted heavy rain tonight.' },
      { w: 'thunderstorm',   ipa: '/ˈθʌndəstɔːm/',       vi: 'bão sấm sét',                 ex: 'A violent thunderstorm hit the city last night.' },
      { w: 'lightning',      ipa: '/ˈlaɪtnɪŋ/',          vi: 'tia sét / tia chớp',          ex: 'Lightning struck a tall tree in the park.' },
      { w: 'blizzard',       ipa: '/ˈblɪzəd/',           vi: 'bão tuyết',                   ex: 'The blizzard closed roads across the north of the country.' },
      { w: 'heatwave',       ipa: '/ˈhiːtweɪv/',         vi: 'đợt nắng nóng',               ex: 'A heatwave swept across Europe in July.' },
      { w: 'frost',          ipa: '/frɒst/',             vi: 'sương giá',                   ex: 'There was a heavy frost on the ground this morning.' },
      { w: 'sleet',          ipa: '/sliːt/',             vi: 'mưa đá / mưa tuyết lẫn',      ex: 'The cold rain turned to sleet in the evening.' },
      { w: 'hurricane',      ipa: '/ˈhʌrɪkən/',          vi: 'bão cuồng phong',             ex: 'The hurricane caused widespread damage to the coast.' },
      { w: 'tornado',        ipa: '/tɔːˈneɪdəʊ/',        vi: 'lốc xoáy',                    ex: 'A tornado destroyed several buildings in the town.' },
      { w: 'fog',            ipa: '/fɒɡ/',               vi: 'sương mù',                    ex: 'Thick fog severely reduced visibility on the motorway.' },
      { w: 'dew',            ipa: '/djuː/',              vi: 'sương mai',                   ex: 'The grass was covered in dew early in the morning.' },
      { w: 'precipitation',  ipa: '/prɪˌsɪpɪˈteɪʃən/',   vi: 'lượng mưa',                   ex: 'February had the highest precipitation of the year.' },
      { w: 'breeze',         ipa: '/briːz/',             vi: 'gió nhẹ',                     ex: 'A cool breeze blew in gently from the sea.' },
      { w: 'gale',           ipa: '/ɡeɪl/',              vi: 'gió mạnh',                    ex: 'The gale brought down several large trees overnight.' },
      { w: 'overcast',       ipa: '/ˈəʊvəkɑːst/',        vi: 'âm u / nhiều mây',            ex: 'The sky was overcast all day with no sunshine.' },
      { w: 'drizzle',        ipa: '/ˈdrɪzəl/',           vi: 'mưa phùn',                    ex: 'There was a light drizzle throughout the afternoon.' },
      { w: 'monsoon',        ipa: '/mɒnˈsuːn/',          vi: 'mùa mưa / gió mùa',           ex: 'The monsoon season brings heavy rain to Asia.' },
      { w: 'avalanche',      ipa: '/ˈævəlɑːntʃ/',        vi: 'lở tuyết',                    ex: 'The avalanche buried the mountain road completely.' },
      { w: 'celsius',        ipa: '/ˈselsiəs/',          vi: 'độ Celsius',                  ex: 'Water freezes at zero degrees Celsius.' },
      { w: 'seasonal',       ipa: '/ˈsiːzənəl/',         vi: 'theo mùa',                    ex: 'Seasonal changes in temperature affect agriculture.' },
      { w: 'mild',           ipa: '/maɪld/',             vi: 'ôn hoà / ấm áp nhẹ',          ex: 'The weather in spring is usually mild and pleasant.' },
      { w: 'scorching',      ipa: '/ˈskɔːtʃɪŋ/',         vi: 'nóng như thiêu đốt',          ex: 'It was a scorching hot day at the beach.' },
      { w: 'chilly',         ipa: '/ˈtʃɪli/',            vi: 'lạnh nhẹ',                    ex: 'It was chilly outside, so she put on a coat.' },
      { w: 'cloudy',         ipa: '/ˈklaʊdi/',           vi: 'nhiều mây',                   ex: 'It was a cloudy day with very little sunshine.' },
      { w: 'sunny',          ipa: '/ˈsʌni/',             vi: 'có nắng',                     ex: 'We had a beautiful sunny afternoon for the picnic.' },
      { w: 'windy',          ipa: '/ˈwɪndi/',            vi: 'nhiều gió',                   ex: 'It was so windy that umbrellas kept blowing inside out.' },
      { w: 'snowy',          ipa: '/ˈsnəʊi/',            vi: 'có tuyết',                    ex: 'The children played happily in the snowy garden.' },
      { w: 'icy',            ipa: '/ˈaɪsi/',             vi: 'đóng băng / trơn trượt',      ex: 'Drive carefully — the roads are very icy this morning.' }
    ]
  },

  /* ─────────────────────────────────────────────────── */
  /* 13. SHOPPING & MONEY                                */
  /* ─────────────────────────────────────────────────── */
  {
    id: 'shopping',
    label: '🛍️ Shopping & Money',
    sub: 'Mua sắm & Tài chính',
    words: [
      { w: 'budget',       ipa: '/ˈbʌdʒɪt/',          vi: 'ngân sách',                   ex: 'She set a monthly budget for food and clothing.' },
      { w: 'bargain',      ipa: '/ˈbɑːɡɪn/',          vi: 'món hời / sự mặc cả',          ex: 'He found a real bargain at the weekend market.' },
      { w: 'receipt',      ipa: '/rɪˈsiːt/',           vi: 'biên lai / hóa đơn',           ex: 'Keep your receipt in case you need to return the item.' },
      { w: 'refund',       ipa: '/ˈriːfʌnd/',          vi: 'hoàn tiền',                   ex: 'She asked for a refund when the item was faulty.' },
      { w: 'discount',     ipa: '/ˈdɪskaʊnt/',         vi: 'giảm giá',                    ex: 'They offered a twenty per cent discount in the sale.' },
      { w: 'cashier',      ipa: '/kæˈʃɪə/',            vi: 'thu ngân',                    ex: 'The cashier scanned all the items very quickly.' },
      { w: 'invoice',      ipa: '/ˈɪnvɔɪs/',           vi: 'hóa đơn (doanh nghiệp)',       ex: 'The company sent an invoice for five hundred pounds.' },
      { w: 'purchase',     ipa: '/ˈpɜːtʃɪs/',          vi: 'mua / sự mua hàng',           ex: 'She made several online purchases this week.' },
      { w: 'mortgage',     ipa: '/ˈmɔːɡɪdʒ/',          vi: 'vay mua nhà / thế chấp',       ex: 'They took out a mortgage to buy their first home.' },
      { w: 'investment',   ipa: '/ɪnˈvestmənt/',       vi: 'đầu tư',                      ex: 'Property is often seen as a safe long-term investment.' },
      { w: 'savings',      ipa: '/ˈseɪvɪŋz/',          vi: 'tiền tiết kiệm',              ex: 'She put some of her savings into a bank account.' },
      { w: 'instalment',   ipa: '/ɪnˈstɔːlmənt/',      vi: 'trả góp',                     ex: 'He paid for the sofa in monthly instalments.' },
      { w: 'auction',      ipa: '/ˈɔːkʃən/',           vi: 'cuộc đấu giá',                ex: 'She sold the painting at a public auction.' },
      { w: 'wholesale',    ipa: '/ˈhəʊlseɪl/',         vi: 'bán sỉ',                      ex: 'They buy goods wholesale and sell them at retail price.' },
      { w: 'retail',       ipa: '/ˈriːteɪl/',          vi: 'bán lẻ',                      ex: 'The retail price is much higher than the online price.' },
      { w: 'checkout',     ipa: '/ˈtʃekaʊt/',          vi: 'quầy thanh toán',              ex: 'There was a long queue at the checkout.' },
      { w: 'trolley',      ipa: '/ˈtrɒli/',            vi: 'xe đẩy hàng (siêu thị)',       ex: 'She pushed the trolley around the supermarket.' },
      { w: 'loyalty card', ipa: '/ˈlɔɪəlti kɑːd/',    vi: 'thẻ tích điểm',               ex: 'Use your loyalty card to earn points on every purchase.' },
      { w: 'haggle',       ipa: '/ˈhæɡəl/',            vi: 'mặc cả',                      ex: 'Tourists often haggle for souvenirs at the market.' },
      { w: 'overdraft',    ipa: '/ˈəʊvədrɑːft/',       vi: 'thấu chi',                    ex: 'He went into his overdraft at the end of the month.' },
      { w: 'transaction',  ipa: '/trænˈzækʃən/',       vi: 'giao dịch',                   ex: 'The bank blocked a suspicious transaction on his account.' },
      { w: 'credit',       ipa: '/ˈkredɪt/',           vi: 'tín dụng',                    ex: 'She paid for the holiday using a credit card.' },
      { w: 'debit',        ipa: '/ˈdebɪt/',            vi: 'ghi nợ / thẻ ghi nợ',         ex: 'The amount was debited from her account instantly.' },
      { w: 'counterfeit',  ipa: '/ˈkaʊntəfɪt/',        vi: 'hàng giả / tiền giả',         ex: 'The police seized counterfeit notes worth millions.' },
      { w: 'donate',       ipa: '/dəʊˈneɪt/',          vi: 'quyên góp',                   ex: 'He donated ten per cent of his income to charity.' },
      { w: 'expense',      ipa: '/ɪkˈspens/',          vi: 'chi phí',                     ex: 'Travel expenses are reimbursed by the company.' },
      { w: 'afford',       ipa: '/əˈfɔːd/',            vi: 'đủ khả năng chi trả',          ex: 'They could not afford to buy a new car this year.' },
      { w: 'economise',    ipa: '/ɪˈkɒnəmaɪz/',        vi: 'tiết kiệm tiền',              ex: 'She had to economise carefully after losing her job.' },
      { w: 'profit',       ipa: '/ˈprɒfɪt/',           vi: 'lợi nhuận',                   ex: 'The company made a large profit last quarter.' },
      { w: 'currency',     ipa: '/ˈkʌrənsi/',          vi: 'tiền tệ',                     ex: 'The euro is the currency used in most of Europe.' }
    ]
  },

  /* ─────────────────────────────────────────────────── */
  /* 14. HOME & FURNITURE                                */
  /* ─────────────────────────────────────────────────── */
  {
    id: 'home',
    label: '🏠 Home & Furniture',
    sub: 'Nhà cửa & Nội thất',
    words: [
      { w: 'furniture',    ipa: '/ˈfɜːnɪtʃə/',       vi: 'đồ nội thất',                  ex: 'They bought new furniture for the living room.' },
      { w: 'appliance',    ipa: '/əˈplaɪəns/',        vi: 'thiết bị gia dụng',            ex: 'The kitchen has all the latest modern appliances.' },
      { w: 'renovation',   ipa: '/ˌrenəˈveɪʃən/',     vi: 'sự cải tạo / tu sửa',          ex: 'The old house is undergoing a major renovation.' },
      { w: 'landlord',     ipa: '/ˈlændlɔːd/',        vi: 'chủ nhà (cho thuê)',            ex: 'The landlord increased the rent by ten per cent.' },
      { w: 'tenant',       ipa: '/ˈtenənt/',          vi: 'người thuê nhà',               ex: 'The tenant signed a one-year rental contract.' },
      { w: 'utility bill', ipa: '/juːˈtɪlɪti bɪl/',  vi: 'hoá đơn tiện ích (điện, nước)',ex: 'Utility bills include gas, electricity, and water.' },
      { w: 'plumbing',     ipa: '/ˈplʌmɪŋ/',          vi: 'hệ thống ống nước',            ex: 'The plumbing in the bathroom needs repairing.' },
      { w: 'insulation',   ipa: '/ˌɪnsjʊˈleɪʃən/',    vi: 'cách nhiệt / cách âm',         ex: 'Good insulation keeps the house warm in winter.' },
      { w: 'attic',        ipa: '/ˈætɪk/',            vi: 'gác mái',                      ex: 'Old boxes were stored in the dusty attic.' },
      { w: 'basement',     ipa: '/ˈbeɪsmənt/',        vi: 'tầng hầm',                     ex: 'The washing machine is kept in the basement.' },
      { w: 'hallway',      ipa: '/ˈhɔːlweɪ/',         vi: 'hành lang / lối vào',           ex: 'Shoes are left in the hallway by the front door.' },
      { w: 'wardrobe',     ipa: '/ˈwɔːdrəʊb/',        vi: 'tủ quần áo',                   ex: 'She organised her wardrobe neatly by colour.' },
      { w: 'bookshelf',    ipa: '/ˈbʊkʃelf/',         vi: 'giá sách',                     ex: 'The bookshelf is filled with novels and textbooks.' },
      { w: 'curtain',      ipa: '/ˈkɜːtən/',          vi: 'rèm cửa',                      ex: 'She drew the curtains to block out the bright light.' },
      { w: 'carpet',       ipa: '/ˈkɑːpɪt/',          vi: 'thảm trải sàn',                ex: 'The carpet in the bedroom is soft and warm.' },
      { w: 'ceiling',      ipa: '/ˈsiːlɪŋ/',          vi: 'trần nhà',                     ex: 'The ceiling in the old hall is very high.' },
      { w: 'chimney',      ipa: '/ˈtʃɪmni/',          vi: 'ống khói',                     ex: 'Smoke rose gently from the chimney on a cold evening.' },
      { w: 'balcony',      ipa: '/ˈbælkəni/',         vi: 'ban công',                     ex: 'She had breakfast on the balcony every morning.' },
      { w: 'extension',    ipa: '/ɪkˈstenʃən/',       vi: 'phần xây thêm',                ex: 'They built a rear extension to add a new bedroom.' },
      { w: 'socket',       ipa: '/ˈsɒkɪt/',           vi: 'ổ cắm điện',                   ex: 'Plug the lamp into the socket near the door.' },
      { w: 'faucet',       ipa: '/ˈfɔːsɪt/',          vi: 'vòi nước',                     ex: 'The faucet drips and needs a new washer.' },
      { w: 'staircase',    ipa: '/ˈsteəkeɪs/',        vi: 'cầu thang',                    ex: 'The staircase leads to the three upstairs bedrooms.' },
      { w: 'porch',        ipa: '/pɔːtʃ/',            vi: 'hiên nhà',                     ex: 'She sat on the porch and read her book in the sun.' },
      { w: 'fireplace',    ipa: '/ˈfaɪəpleɪs/',       vi: 'lò sưởi',                      ex: 'They sat by the fireplace on a cold winter night.' },
      { w: 'radiator',     ipa: '/ˈreɪdieɪtə/',       vi: 'két sưởi',                     ex: 'The radiator in the bedroom is not working properly.' },
      { w: 'shed',         ipa: '/ʃed/',              vi: 'nhà kho / lán',                ex: 'He keeps all his gardening tools in the shed.' },
      { w: 'garage',       ipa: '/ˈɡærɑːʒ/',          vi: 'nhà để xe',                    ex: 'The car is parked safely in the garage overnight.' },
      { w: 'threshold',    ipa: '/ˈθreʃhəʊld/',       vi: 'ngưỡng cửa',                   ex: 'He stepped over the threshold into his new home.' },
      { w: 'ventilation',  ipa: '/ˌventɪˈleɪʃən/',    vi: 'thông gió',                    ex: 'Good ventilation prevents damp and mould from forming.' },
      { w: 'loft',         ipa: '/lɒft/',             vi: 'gác lửng',                     ex: 'They converted the loft into an extra bedroom.' }
    ]
  },

  /* ─────────────────────────────────────────────────── */
  /* 15. CLOTHES & FASHION                               */
  /* ─────────────────────────────────────────────────── */
  {
    id: 'clothes',
    label: '👗 Clothes & Fashion',
    sub: 'Quần áo & Thời trang',
    words: [
      { w: 'garment',          ipa: '/ˈɡɑːmənt/',          vi: 'y phục / trang phục',         ex: 'The garment was made from fine Italian wool.' },
      { w: 'fabric',           ipa: '/ˈfæbrɪk/',           vi: 'vải',                         ex: 'She chose a soft cotton fabric for the summer dress.' },
      { w: 'thread',           ipa: '/θred/',              vi: 'chỉ may',                     ex: 'The button came loose because the thread broke.' },
      { w: 'tailor',           ipa: '/ˈteɪlə/',            vi: 'thợ may',                     ex: 'The tailor adjusted the suit to fit perfectly.' },
      { w: 'accessory',        ipa: '/əkˈsesəri/',         vi: 'phụ kiện',                    ex: 'A scarf can be the perfect accessory for any outfit.' },
      { w: 'jewellery',        ipa: '/ˈdʒuːəlri/',         vi: 'đồ trang sức',                ex: 'She wore gold jewellery to the formal dinner.' },
      { w: 'collar',           ipa: '/ˈkɒlə/',             vi: 'cổ áo',                       ex: 'His shirt has a stiff, starched white collar.' },
      { w: 'sleeve',           ipa: '/sliːv/',             vi: 'tay áo',                      ex: 'The dress has long sleeves for cold weather.' },
      { w: 'zipper',           ipa: '/ˈzɪpə/',             vi: 'khoá kéo',                    ex: 'The zipper on her bag is broken and needs replacing.' },
      { w: 'heel',             ipa: '/hiːl/',              vi: 'gót giày',                    ex: 'She wore high heels to the evening event.' },
      { w: 'sole',             ipa: '/səʊl/',              vi: 'đế giày',                     ex: 'The soles of his shoes wore thin after years of use.' },
      { w: 'casual',           ipa: '/ˈkæʒuəl/',           vi: 'thường ngày / bình thường',    ex: 'She wore casual clothes to the weekend market.' },
      { w: 'formal',           ipa: '/ˈfɔːməl/',           vi: 'trang trọng',                 ex: 'Formal attire is required for the award ceremony.' },
      { w: 'vintage',          ipa: '/ˈvɪntɪdʒ/',          vi: 'phong cách cổ điển',           ex: 'She loves wearing vintage dresses from the 1960s.' },
      { w: 'trend',            ipa: '/trend/',             vi: 'xu hướng thời trang',          ex: 'Wide-leg trousers are a popular trend this season.' },
      { w: 'pattern',          ipa: '/ˈpætən/',            vi: 'họa tiết',                    ex: 'Her blouse had a beautiful floral pattern.' },
      { w: 'stripe',           ipa: '/straɪp/',            vi: 'sọc',                         ex: 'He wore a blue and white striped shirt.' },
      { w: 'plaid',            ipa: '/plæd/',              vi: 'kẻ ô vuông',                  ex: 'She bought a cosy plaid scarf at the market.' },
      { w: 'linen',            ipa: '/ˈlɪnɪn/',            vi: 'vải lanh',                    ex: 'Linen is a light, breathable fabric for hot weather.' },
      { w: 'velvet',           ipa: '/ˈvelvɪt/',           vi: 'nhung',                       ex: 'The queen wore a deep crimson velvet gown.' },
      { w: 'denim',            ipa: '/ˈdenɪm/',            vi: 'vải bò (jeans)',               ex: 'She always wears denim jeans at the weekend.' },
      { w: 'brand',            ipa: '/brænd/',             vi: 'thương hiệu',                 ex: 'He prefers to buy clothes from well-known brands.' },
      { w: 'second-hand',      ipa: '/ˈsekənd hænd/',      vi: 'đồ cũ / qua sử dụng',         ex: 'She bought a second-hand coat from the charity shop.' },
      { w: 'sustainable fashion', ipa: '/səˈsteɪnəbəl ˈfæʃən/', vi: 'thời trang bền vững',    ex: 'Sustainable fashion reduces waste and environmental damage.' },
      { w: 'alteration',       ipa: '/ˌɔːltəˈreɪʃən/',     vi: 'sửa quần áo',                 ex: 'She took the dress to the tailor for alterations.' },
      { w: 'boutique',         ipa: '/buːˈtiːk/',          vi: 'cửa hàng thời trang nhỏ',     ex: 'She found a beautiful dress in a small boutique.' },
      { w: 'catwalk',          ipa: '/ˈkætwɔːk/',          vi: 'sàn diễn thời trang',         ex: 'Models walked the catwalk at the fashion show.' },
      { w: 'outfit',           ipa: '/ˈaʊtfɪt/',           vi: 'bộ trang phục',               ex: 'She planned her outfit carefully for the interview.' },
      { w: 'embroidery',       ipa: '/ɪmˈbrɔɪdəri/',       vi: 'thêu thùa / hoa văn thêu',    ex: 'The traditional dress had beautiful hand embroidery.' },
      { w: 'hem',              ipa: '/hem/',               vi: 'đường gấu (quần áo)',          ex: 'The hem of her skirt needs to be taken up by two centimetres.' }
    ]
  },

  /* ─────────────────────────────────────────────────── */
  /* 16. FEELINGS & EMOTIONS                             */
  /* ─────────────────────────────────────────────────── */
  {
    id: 'feelings',
    label: '😊 Feelings & Emotions',
    sub: 'Cảm xúc & Tâm trạng',
    words: [
      { w: 'anxious',      ipa: '/ˈæŋkʃəs/',          vi: 'lo lắng',                     ex: 'She felt anxious before the important presentation.' },
      { w: 'relieved',     ipa: '/rɪˈliːvd/',          vi: 'nhẹ nhõm',                    ex: 'He was relieved to hear the good news at last.' },
      { w: 'frustrated',   ipa: '/frʌˈstreɪtɪd/',      vi: 'bực bội / thất vọng',          ex: 'She felt frustrated when the computer crashed again.' },
      { w: 'overwhelmed',  ipa: '/ˌəʊvəˈwelmd/',       vi: 'choáng ngợp',                 ex: 'He felt overwhelmed by the enormous amount of work.' },
      { w: 'content',      ipa: '/kənˈtent/',          vi: 'hài lòng / thỏa mãn',          ex: 'She is content with her simple but happy life.' },
      { w: 'melancholy',   ipa: '/ˈmelənkɒli/',        vi: 'u sầu / buồn man mác',         ex: 'A sense of melancholy filled the empty room.' },
      { w: 'ecstatic',     ipa: '/ɪkˈstætɪk/',         vi: 'vô cùng hân hoan / phấn khởi', ex: 'She was ecstatic when she received the job offer.' },
      { w: 'envious',      ipa: '/ˈenviəs/',           vi: 'ghen tị',                     ex: 'He was envious of his colleague\'s success.' },
      { w: 'ashamed',      ipa: '/əˈʃeɪmd/',           vi: 'xấu hổ',                      ex: 'She felt ashamed of her rude behaviour.' },
      { w: 'nostalgic',    ipa: '/nɒˈstældʒɪk/',       vi: 'hoài niệm',                   ex: 'Looking at old photos made him feel nostalgic.' },
      { w: 'indifferent',  ipa: '/ɪnˈdɪfərənt/',       vi: 'thờ ơ / dửng dưng',           ex: 'She seemed indifferent to the outcome of the vote.' },
      { w: 'tense',        ipa: '/tens/',              vi: 'căng thẳng',                  ex: 'The atmosphere in the room was very tense.' },
      { w: 'delighted',    ipa: '/dɪˈlaɪtɪd/',         vi: 'vô cùng vui mừng',             ex: 'She was delighted to see her old friend again.' },
      { w: 'horrified',    ipa: '/ˈhɒrɪfaɪd/',         vi: 'kinh hoàng',                  ex: 'He was horrified by the news of the accident.' },
      { w: 'lonely',       ipa: '/ˈləʊnli/',           vi: 'cô đơn',                      ex: 'She felt lonely after moving to a new city alone.' },
      { w: 'embarrassed',  ipa: '/ɪmˈbærəst/',         vi: 'bối rối / xấu hổ',             ex: 'He was embarrassed when he forgot her name.' },
      { w: 'optimistic',   ipa: '/ˌɒptɪˈmɪstɪk/',      vi: 'lạc quan',                    ex: 'She remained optimistic despite facing many difficulties.' },
      { w: 'pessimistic',  ipa: '/ˌpesɪˈmɪstɪk/',      vi: 'bi quan',                     ex: 'He had a pessimistic view of the future.' },
      { w: 'resentful',    ipa: '/rɪˈzentfəl/',        vi: 'oán giận',                    ex: 'She felt resentful about being overlooked for promotion.' },
      { w: 'sympathetic',  ipa: '/ˌsɪmpəˈθetɪk/',      vi: 'thông cảm',                   ex: 'Her colleague was very sympathetic when she was upset.' },
      { w: 'grateful',     ipa: '/ˈɡreɪtfəl/',         vi: 'biết ơn',                     ex: 'She was deeply grateful for their kindness and support.' },
      { w: 'curious',      ipa: '/ˈkjʊəriəs/',         vi: 'tò mò',                       ex: 'Children are naturally curious about the world around them.' },
      { w: 'bored',        ipa: '/bɔːd/',              vi: 'buồn chán',                   ex: 'He felt bored during the very long meeting.' },
      { w: 'confident',    ipa: '/ˈkɒnfɪdənt/',        vi: 'tự tin',                      ex: 'She spoke in a confident and clear voice during the debate.' },
      { w: 'jealous',      ipa: '/ˈdʒeləs/',           vi: 'ghen tuông / đố kỵ',           ex: 'He was jealous of his brother\'s achievements.' },
      { w: 'guilty',       ipa: '/ˈɡɪlti/',            vi: 'cảm thấy có lỗi',              ex: 'She felt guilty about breaking her promise.' },
      { w: 'proud',        ipa: '/praʊd/',             vi: 'tự hào',                      ex: 'Her parents were very proud of her exam results.' },
      { w: 'terrified',    ipa: '/ˈterɪfaɪd/',         vi: 'vô cùng sợ hãi',              ex: 'He was absolutely terrified of spiders.' },
      { w: 'homesick',     ipa: '/ˈhəʊmsɪk/',          vi: 'nhớ nhà',                     ex: 'She felt homesick during her first month studying abroad.' },
      { w: 'motivated',    ipa: '/ˈməʊtɪveɪtɪd/',      vi: 'có động lực',                 ex: 'He felt highly motivated after the inspiring talk.' }
    ]
  }

  /* ─────────────────────────────────────────────────── */
  /* 17. HOBBIES & FREE TIME                             */
  /* ─────────────────────────────────────────────────── */
  ,{
    id: 'hobbies',
    label: '🎮 Hobbies & Free Time',
    sub: 'Sở thích & Thời gian rảnh',
    words: [
      { w: 'pastime',      ipa: '/ˈpɑːstaɪm/',       vi: 'thú tiêu khiển',              ex: 'Reading is her favourite pastime on rainy days.' },
      { w: 'craft',        ipa: '/krɑːft/',           vi: 'thủ công / nghề thủ công',    ex: 'She enjoys making crafts with recycled materials.' },
      { w: 'knitting',     ipa: '/ˈnɪtɪŋ/',           vi: 'đan lát',                     ex: 'She learned knitting from her grandmother.' },
      { w: 'photography',  ipa: '/fəˈtɒɡrəfi/',       vi: 'nhiếp ảnh',                   ex: 'He took up photography as a hobby last year.' },
      { w: 'gardening',    ipa: '/ˈɡɑːdənɪŋ/',        vi: 'làm vườn',                    ex: 'She spends her weekends gardening.' },
      { w: 'hiking',       ipa: '/ˈhaɪkɪŋ/',          vi: 'đi bộ đường dài',             ex: 'They went hiking in the mountains last summer.' },
      { w: 'camping',      ipa: '/ˈkæmpɪŋ/',          vi: 'cắm trại',                    ex: 'The family enjoys camping by the lake.' },
      { w: 'drawing',      ipa: '/ˈdrɔːɪŋ/',          vi: 'vẽ bằng bút',                 ex: 'She has been drawing portraits since childhood.' },
      { w: 'painting',     ipa: '/ˈpeɪntɪŋ/',         vi: 'vẽ tranh màu',                ex: 'He paints landscapes in watercolour at weekends.' },
      { w: 'sculpture',    ipa: '/ˈskʌlptʃə/',        vi: 'điêu khắc',                   ex: 'She studies sculpture at art college.' },
      { w: 'pottery',      ipa: '/ˈpɒtəri/',          vi: 'làm đồ gốm',                  ex: 'He makes pottery bowls in his small workshop.' },
      { w: 'board game',   ipa: '/ˈbɔːd ɡeɪm/',       vi: 'trò chơi cờ bàn',             ex: 'They play board games on Friday evenings.' },
      { w: 'baking',       ipa: '/ˈbeɪkɪŋ/',          vi: 'làm bánh',                    ex: 'He loves baking fresh bread and cakes at home.' },
      { w: 'cycling',      ipa: '/ˈsaɪklɪŋ/',         vi: 'đạp xe',                      ex: 'Cycling is a great way to explore the countryside.' },
      { w: 'fishing',      ipa: '/ˈfɪʃɪŋ/',           vi: 'câu cá',                      ex: 'He goes fishing by the river every Sunday.' },
      { w: 'bird-watching',ipa: '/ˈbɜːd ˌwɒtʃɪŋ/',    vi: 'quan sát chim',               ex: 'Bird-watching requires patience and a good pair of binoculars.' },
      { w: 'collecting',   ipa: '/kəˈlektɪŋ/',        vi: 'sưu tầm',                     ex: 'She has been collecting vintage stamps for years.' },
      { w: 'origami',      ipa: '/ˌɒrɪˈɡɑːmi/',       vi: 'nghệ thuật gấp giấy',          ex: 'She taught the children origami at the workshop.' },
      { w: 'calligraphy',  ipa: '/kəˈlɪɡrəfi/',       vi: 'thư pháp',                    ex: 'He practises calligraphy every morning.' },
      { w: 'DIY',          ipa: '/ˌdiː aɪ ˈwaɪ/',     vi: 'tự làm (do-it-yourself)',      ex: 'He spent the weekend doing DIY in the kitchen.' },
      { w: 'volunteering', ipa: '/ˌvɒlənˈtɪərɪŋ/',    vi: 'làm tình nguyện',             ex: 'She finds volunteering at the shelter very rewarding.' },
      { w: 'singing',      ipa: '/ˈsɪŋɪŋ/',           vi: 'ca hát',                      ex: 'She joins a choir and loves singing every Tuesday.' },
      { w: 'dancing',      ipa: '/ˈdɑːnsɪŋ/',         vi: 'nhảy / khiêu vũ',             ex: 'She has been dancing ballet since the age of six.' },
      { w: 'reading',      ipa: '/ˈriːdɪŋ/',          vi: 'đọc sách',                    ex: 'Reading before bed helps him relax completely.' },
      { w: 'creative writing', ipa: '/kriˈeɪtɪv ˈraɪtɪŋ/', vi: 'viết sáng tác',          ex: 'She writes short stories in her spare time.' },
      { w: 'yoga',         ipa: '/ˈjəʊɡə/',           vi: 'yoga',                        ex: 'She practises yoga for thirty minutes every morning.' },
      { w: 'meditation',   ipa: '/ˌmedɪˈteɪʃən/',     vi: 'thiền định',                  ex: 'Meditation helps reduce stress and improve focus.' },
      { w: 'travelling',   ipa: '/ˈtrævəlɪŋ/',        vi: 'đi du lịch (sở thích)',        ex: 'Travelling to new countries is her greatest passion.' },
      { w: 'gaming',       ipa: '/ˈɡeɪmɪŋ/',          vi: 'chơi trò chơi điện tử',        ex: 'He enjoys online gaming with friends at weekends.' },
      { w: 'astronomy',    ipa: '/əˈstrɒnəmi/',        vi: 'thiên văn học (nghiệp dư)',    ex: 'She has a telescope and loves amateur astronomy.' }
    ]
  },

  /* ─────────────────────────────────────────────────── */
  /* 18. CITIES & PLACES                                 */
  /* ─────────────────────────────────────────────────── */
  {
    id: 'cities',
    label: '🏙️ Cities & Places',
    sub: 'Địa điểm & Đô thị',
    words: [
      { w: 'metropolis',    ipa: '/mɪˈtrɒpəlɪs/',      vi: 'đô thị lớn',                  ex: 'London is one of the world\'s great metropolises.' },
      { w: 'suburb',        ipa: '/ˈsʌbɜːb/',          vi: 'vùng ngoại ô',                ex: 'She lives in a quiet suburb outside the city.' },
      { w: 'downtown',      ipa: '/ˈdaʊntaʊn/',        vi: 'trung tâm thành phố',          ex: 'They met for coffee in a café downtown.' },
      { w: 'outskirts',     ipa: '/ˈaʊtskɜːts/',       vi: 'vùng ven đô',                 ex: 'The factory is located on the outskirts of town.' },
      { w: 'neighbourhood', ipa: '/ˈneɪbəhʊd/',        vi: 'khu phố / vùng lân cận',       ex: 'It is a safe and very friendly neighbourhood.' },
      { w: 'district',      ipa: '/ˈdɪstrɪkt/',        vi: 'quận / khu vực',              ex: 'The shopping district is very busy at weekends.' },
      { w: 'monument',      ipa: '/ˈmɒnjʊmənt/',       vi: 'tượng đài / di tích',          ex: 'The war monument stands in the centre of the square.' },
      { w: 'cathedral',     ipa: '/kəˈθiːdrəl/',       vi: 'nhà thờ lớn',                 ex: 'The cathedral took over a hundred years to build.' },
      { w: 'museum',        ipa: '/mjuːˈziəm/',        vi: 'bảo tàng',                    ex: 'They spent the afternoon at the history museum.' },
      { w: 'gallery',       ipa: '/ˈɡæləri/',          vi: 'phòng trưng bày nghệ thuật',   ex: 'She visited an art gallery in the city centre.' },
      { w: 'fountain',      ipa: '/ˈfaʊntɪn/',         vi: 'đài phun nước',               ex: 'Children played around the fountain in the square.' },
      { w: 'avenue',        ipa: '/ˈævənjuː/',         vi: 'đại lộ',                      ex: 'The parade marched down the main avenue.' },
      { w: 'alley',         ipa: '/ˈæli/',             vi: 'ngõ hẻm',                     ex: 'The old market was reached through a narrow alley.' },
      { w: 'harbour',       ipa: '/ˈhɑːbə/',           vi: 'cảng / bến tàu',              ex: 'Fishing boats returned to the harbour at dawn.' },
      { w: 'pier',          ipa: '/pɪə/',              vi: 'cầu cảng',                    ex: 'They walked to the end of the pier to watch the sunset.' },
      { w: 'plaza',         ipa: '/ˈplɑːzə/',          vi: 'quảng trường',                ex: 'The festival was held in the central plaza.' },
      { w: 'skyscraper',    ipa: '/ˈskaɪˌskreɪpə/',    vi: 'toà nhà chọc trời',           ex: 'The new skyscraper dominates the city skyline.' },
      { w: 'slum',          ipa: '/slʌm/',             vi: 'khu ổ chuột',                 ex: 'The city is working to improve conditions in slum areas.' },
      { w: 'rural',         ipa: '/ˈrʊərəl/',          vi: 'thuộc nông thôn',             ex: 'Life in rural areas is much quieter than in cities.' },
      { w: 'urban',         ipa: '/ˈɜːbən/',           vi: 'thuộc thành thị',             ex: 'Urban transport systems need significant improvement.' },
      { w: 'historic',      ipa: '/hɪˈstɒrɪk/',        vi: 'mang tính lịch sử',           ex: 'The historic old town attracts millions of tourists.' },
      { w: 'cosmopolitan',  ipa: '/ˌkɒzməˈpɒlɪtən/',   vi: 'đa văn hoá / quốc tế',        ex: 'London is a truly cosmopolitan city.' },
      { w: 'congestion',    ipa: '/kənˈdʒestʃən/',     vi: 'tắc nghẽn giao thông',         ex: 'Traffic congestion is a major problem in the capital.' },
      { w: 'infrastructure',ipa: '/ˈɪnfrəˌstrʌktʃə/',  vi: 'cơ sở hạ tầng',              ex: 'Improving infrastructure is key to economic growth.' },
      { w: 'pedestrian',    ipa: '/pɪˈdestriən/',      vi: 'người đi bộ',                 ex: 'The bridge is open to pedestrians only.' },
      { w: 'roundabout',    ipa: '/ˈraʊndəbaʊt/',      vi: 'vòng xoay giao thông',         ex: 'Take the second exit at the roundabout.' },
      { w: 'overpass',      ipa: '/ˈəʊvəpɑːs/',        vi: 'cầu vượt',                    ex: 'The new overpass reduced congestion in the city centre.' },
      { w: 'borough',       ipa: '/ˈbʌrə/',            vi: 'quận (đơn vị hành chính)',     ex: 'She lives in a borough to the north of the city.' },
      { w: 'skyline',       ipa: '/ˈskaɪlaɪn/',        vi: 'đường chân trời thành phố',    ex: 'The city skyline is breathtaking at sunset.' },
      { w: 'landmark',      ipa: '/ˈlændmɑːk/',        vi: 'địa danh / mốc nổi tiếng',    ex: 'The Eiffel Tower is Paris\'s most iconic landmark.' }
    ]
  },

  /* ─────────────────────────────────────────────────── */
  /* 19. SCIENCE & RESEARCH                              */
  /* ─────────────────────────────────────────────────── */
  {
    id: 'science',
    label: '🔬 Science & Research',
    sub: 'Khoa học & Nghiên cứu',
    words: [
      { w: 'hypothesis',    ipa: '/haɪˈpɒθɪsɪs/',      vi: 'giả thuyết',                  ex: 'The scientist tested her hypothesis with an experiment.' },
      { w: 'experiment',    ipa: '/ɪkˈsperɪmənt/',     vi: 'thí nghiệm',                  ex: 'They conducted an experiment to test the new drug.' },
      { w: 'evidence',      ipa: '/ˈevɪdəns/',         vi: 'bằng chứng',                  ex: 'The evidence strongly supports the theory.' },
      { w: 'laboratory',    ipa: '/ləˈbɒrətəri/',      vi: 'phòng thí nghiệm',            ex: 'She works in a university laboratory every day.' },
      { w: 'observation',   ipa: '/ˌɒbzəˈveɪʃən/',     vi: 'sự quan sát',                 ex: 'Careful observation is essential in scientific research.' },
      { w: 'conclusion',    ipa: '/kənˈkluːʒən/',      vi: 'kết luận',                    ex: 'They drew a clear conclusion from the collected data.' },
      { w: 'theory',        ipa: '/ˈθɪəri/',           vi: 'lý thuyết',                   ex: 'Einstein\'s theory changed our understanding of physics.' },
      { w: 'data',          ipa: '/ˈdeɪtə/',           vi: 'dữ liệu',                     ex: 'The data was collected over a period of five years.' },
      { w: 'microscope',    ipa: '/ˈmaɪkrəskəʊp/',     vi: 'kính hiển vi',                ex: 'She examined the bacteria under a microscope.' },
      { w: 'telescope',     ipa: '/ˈtelɪskəʊp/',       vi: 'kính thiên văn',              ex: 'He used a telescope to observe distant stars.' },
      { w: 'molecule',      ipa: '/ˈmɒlɪkjuːl/',       vi: 'phân tử',                     ex: 'A water molecule consists of two hydrogen and one oxygen atom.' },
      { w: 'atom',          ipa: '/ˈætəm/',            vi: 'nguyên tử',                   ex: 'An atom is the smallest unit of a chemical element.' },
      { w: 'gravity',       ipa: '/ˈɡrævɪti/',         vi: 'lực hút / trọng lực',          ex: 'Gravity keeps the planets in orbit around the sun.' },
      { w: 'evolution',     ipa: '/ˌiːvəˈluːʃən/',     vi: 'tiến hoá',                    ex: 'Darwin\'s theory of evolution changed biology forever.' },
      { w: 'genetics',      ipa: '/dʒɪˈnetɪks/',       vi: 'di truyền học',               ex: 'Genetics explains how traits pass from parents to children.' },
      { w: 'chromosome',    ipa: '/ˈkrəʊməsəʊm/',      vi: 'nhiễm sắc thể',               ex: 'Humans have forty-six chromosomes in each cell.' },
      { w: 'radiation',     ipa: '/ˌreɪdiˈeɪʃən/',     vi: 'bức xạ',                      ex: 'Radiation from the sun can damage skin cells.' },
      { w: 'chemical',      ipa: '/ˈkemɪkəl/',         vi: 'hoá chất',                    ex: 'Some chemicals are dangerous if not handled carefully.' },
      { w: 'compound',      ipa: '/ˈkɒmpaʊnd/',        vi: 'hợp chất',                    ex: 'Water is a compound of hydrogen and oxygen.' },
      { w: 'element',       ipa: '/ˈelɪmənt/',         vi: 'nguyên tố hoá học',            ex: 'Gold is a chemical element with the symbol Au.' },
      { w: 'reaction',      ipa: '/riˈækʃən/',         vi: 'phản ứng hoá học',             ex: 'The chemical reaction produced a bright blue flame.' },
      { w: 'fossil',        ipa: '/ˈfɒsəl/',           vi: 'hoá thạch',                   ex: 'The fossil was over sixty-five million years old.' },
      { w: 'orbit',         ipa: '/ˈɔːbɪt/',           vi: 'quỹ đạo',                     ex: 'The satellite travels in orbit around the Earth.' },
      { w: 'biodegradable', ipa: '/ˌbaɪəʊdɪˈɡreɪdəbəl/',vi: 'có thể phân huỷ sinh học',   ex: 'Biodegradable packaging is better for the environment.' },
      { w: 'quantum',       ipa: '/ˈkwɒntəm/',         vi: 'lượng tử',                    ex: 'Quantum physics describes the behaviour of subatomic particles.' },
      { w: 'variable',      ipa: '/ˈveəriəbəl/',       vi: 'biến số (trong thí nghiệm)',   ex: 'Change only one variable at a time in an experiment.' },
      { w: 'peer review',   ipa: '/pɪə rɪˈvjuː/',      vi: 'đánh giá đồng nghiệp',         ex: 'All research papers must pass peer review before publication.' },
      { w: 'breakthrough',  ipa: '/ˈbreɪkθruː/',       vi: 'bước đột phá',                ex: 'The new vaccine was a major scientific breakthrough.' },
      { w: 'specimen',      ipa: '/ˈspesɪmɪn/',        vi: 'mẫu vật',                     ex: 'The scientist collected specimens from the rainforest.' },
      { w: 'dissect',       ipa: '/dɪˈsekt/',          vi: 'phẫu tích / mổ xẻ',           ex: 'Biology students dissected a frog in the lab.' }
    ]
  },

  /* ─────────────────────────────────────────────────── */
  /* 20. ART & MUSIC                                     */
  /* ─────────────────────────────────────────────────── */
  {
    id: 'art',
    label: '🎵 Art & Music',
    sub: 'Nghệ thuật & Âm nhạc',
    words: [
      { w: 'melody',       ipa: '/ˈmelɪdi/',          vi: 'giai điệu',                   ex: 'The melody of the song stayed in her head all day.' },
      { w: 'rhythm',       ipa: '/ˈrɪðəm/',           vi: 'nhịp điệu',                   ex: 'The dancer moved in perfect rhythm with the music.' },
      { w: 'harmony',      ipa: '/ˈhɑːməni/',         vi: 'hoà âm',                      ex: 'The choir sang in beautiful three-part harmony.' },
      { w: 'lyrics',       ipa: '/ˈlɪrɪks/',          vi: 'lời bài hát',                 ex: 'The lyrics of the song express deep emotion.' },
      { w: 'composer',     ipa: '/kəmˈpəʊzə/',        vi: 'nhạc sĩ sáng tác',            ex: 'Beethoven was one of history\'s greatest composers.' },
      { w: 'conductor',    ipa: '/kənˈdʌktə/',        vi: 'nhạc trưởng',                 ex: 'The conductor led the orchestra with great passion.' },
      { w: 'orchestra',    ipa: '/ˈɔːkɪstrə/',        vi: 'dàn nhạc giao hưởng',         ex: 'She plays violin in a professional orchestra.' },
      { w: 'instrument',   ipa: '/ˈɪnstrʊmənt/',      vi: 'nhạc cụ',                     ex: 'He can play three instruments: piano, guitar, and flute.' },
      { w: 'exhibition',   ipa: '/ˌeksɪˈbɪʃən/',      vi: 'triển lãm',                   ex: 'She visited a photography exhibition at the gallery.' },
      { w: 'canvas',       ipa: '/ˈkænvəs/',          vi: 'vải canvas / tranh canvas',    ex: 'She painted a large landscape on canvas.' },
      { w: 'portrait',     ipa: '/ˈpɔːtrɪt/',         vi: 'bức chân dung',               ex: 'He commissioned a portrait of his entire family.' },
      { w: 'abstract',     ipa: '/ˈæbstrækt/',        vi: 'trừu tượng',                  ex: 'Abstract art does not represent real objects directly.' },
      { w: 'masterpiece',  ipa: '/ˈmɑːstəpiːs/',      vi: 'kiệt tác',                    ex: 'The Mona Lisa is considered Leonardo\'s greatest masterpiece.' },
      { w: 'genre',        ipa: '/ˈʒɒnrə/',           vi: 'thể loại nghệ thuật / âm nhạc', ex: 'Jazz is her favourite musical genre.' },
      { w: 'debut',        ipa: '/ˈdeɪbjuː/',         vi: 'ra mắt / lần đầu xuất hiện',  ex: 'The young musician made her debut at the concert hall.' },
      { w: 'encore',       ipa: '/ˈɒŋkɔː/',           vi: 'biểu diễn thêm (encore)',      ex: 'The audience demanded an encore after the performance.' },
      { w: 'solo',         ipa: '/ˈsəʊləʊ/',          vi: 'màn độc tấu / biểu diễn một mình', ex: 'She performed a beautiful violin solo.' },
      { w: 'chorus',       ipa: '/ˈkɔːrəs/',          vi: 'điệp khúc / ca đoàn',         ex: 'Everyone sang along when the chorus began.' },
      { w: 'mural',        ipa: '/ˈmjʊərəl/',         vi: 'tranh tường',                 ex: 'The mural on the building depicted local history.' },
      { w: 'rehearsal',    ipa: '/rɪˈhɜːsəl/',        vi: 'buổi tập dượt',               ex: 'The cast had a final rehearsal before opening night.' },
      { w: 'inspiration',  ipa: '/ˌɪnspɪˈreɪʃən/',    vi: 'nguồn cảm hứng',              ex: 'Nature is a constant source of inspiration for artists.' },
      { w: 'critic',       ipa: '/ˈkrɪtɪk/',          vi: 'nhà phê bình',                ex: 'The critic gave the film a very positive review.' },
      { w: 'narrative',    ipa: '/ˈnærətɪv/',         vi: 'mạch truyện / tường thuật',    ex: 'The painting tells a powerful visual narrative.' },
      { w: 'acoustic',     ipa: '/əˈkuːstɪk/',        vi: 'âm học / không khuếch đại',   ex: 'She prefers acoustic music to electronic sounds.' },
      { w: 'tempo',        ipa: '/ˈtempəʊ/',          vi: 'nhịp độ (âm nhạc)',            ex: 'The conductor increased the tempo in the final movement.' },
      { w: 'palette',      ipa: '/ˈpælɪt/',           vi: 'bảng màu / bảng pha màu',     ex: 'The artist used a warm palette of reds and oranges.' },
      { w: 'texture',      ipa: '/ˈtekstʃə/',         vi: 'kết cấu / chất liệu',         ex: 'The painting has a rich, layered texture.' },
      { w: 'composition',  ipa: '/ˌkɒmpəˈzɪʃən/',     vi: 'bố cục / tác phẩm sáng tác',  ex: 'The composition of the photograph is very balanced.' },
      { w: 'improvise',    ipa: '/ˈɪmprəvaɪz/',       vi: 'ứng tấu / ứng khẩu',          ex: 'Jazz musicians often improvise during a performance.' },
      { w: 'premiere',     ipa: '/ˈpremɪeə/',         vi: 'buổi ra mắt đầu tiên',         ex: 'The film\'s premiere was held in London.' }
    ]
  },

  /* ─────────────────────────────────────────────────── */
  /* 21. LITERATURE & LANGUAGE                           */
  /* ─────────────────────────────────────────────────── */
  {
    id: 'literature',
    label: '📚 Literature & Language',
    sub: 'Văn học & Ngôn ngữ',
    words: [
      { w: 'novel',          ipa: '/ˈnɒvəl/',          vi: 'tiểu thuyết',                 ex: 'She spent the weekend reading a gripping novel.' },
      { w: 'fiction',        ipa: '/ˈfɪkʃən/',         vi: 'văn xuôi hư cấu',             ex: 'Science fiction is his favourite reading genre.' },
      { w: 'non-fiction',    ipa: '/ˌnɒnˈfɪkʃən/',     vi: 'văn xuôi phi hư cấu',         ex: 'She prefers non-fiction books about history.' },
      { w: 'poetry',         ipa: '/ˈpəʊɪtri/',        vi: 'thơ ca',                      ex: 'She studied poetry and literature at university.' },
      { w: 'stanza',         ipa: '/ˈstænzə/',         vi: 'khổ thơ',                     ex: 'The poem has five stanzas of four lines each.' },
      { w: 'metaphor',       ipa: '/ˈmetəfə/',         vi: 'ẩn dụ',                       ex: 'The author uses a powerful metaphor to describe grief.' },
      { w: 'simile',         ipa: '/ˈsɪmɪli/',         vi: 'so sánh (dùng as / like)',    ex: '"As brave as a lion" is an example of a simile.' },
      { w: 'narrator',       ipa: '/nəˈreɪtə/',        vi: 'người kể chuyện',             ex: 'The narrator tells the story in the first person.' },
      { w: 'plot',           ipa: '/plɒt/',            vi: 'cốt truyện',                  ex: 'The plot of the novel is complex but very exciting.' },
      { w: 'protagonist',    ipa: '/prəˈtæɡənɪst/',    vi: 'nhân vật chính',              ex: 'The protagonist overcomes many obstacles in the story.' },
      { w: 'setting',        ipa: '/ˈsetɪŋ/',          vi: 'bối cảnh câu chuyện',         ex: 'The setting of the story is Victorian London.' },
      { w: 'dialogue',       ipa: '/ˈdaɪəlɒɡ/',        vi: 'đối thoại',                   ex: 'The dialogue between the two characters feels very realistic.' },
      { w: 'theme',          ipa: '/θiːm/',            vi: 'chủ đề',                      ex: 'Love and loss are major themes in the novel.' },
      { w: 'dialect',        ipa: '/ˈdaɪəlekt/',       vi: 'thổ ngữ / phương ngữ',        ex: 'The characters speak in a strong regional dialect.' },
      { w: 'fluent',         ipa: '/ˈfluːənt/',        vi: 'lưu loát',                    ex: 'She is fluent in three languages.' },
      { w: 'bilingual',      ipa: '/baɪˈlɪŋɡwəl/',     vi: 'song ngữ',                    ex: 'He was raised in a bilingual household.' },
      { w: 'accent',         ipa: '/ˈæksənt/',         vi: 'giọng / trọng âm',            ex: 'She has a clear and pleasant southern accent.' },
      { w: 'idiom',          ipa: '/ˈɪdiəm/',          vi: 'thành ngữ',                   ex: '"It\'s raining cats and dogs" is a common idiom.' },
      { w: 'proverb',        ipa: '/ˈprɒvɜːb/',        vi: 'tục ngữ',                     ex: '"Actions speak louder than words" is a well-known proverb.' },
      { w: 'synonym',        ipa: '/ˈsɪnənɪm/',        vi: 'từ đồng nghĩa',               ex: '"Happy" and "joyful" are synonyms.' },
      { w: 'antonym',        ipa: '/ˈæntənɪm/',        vi: 'từ trái nghĩa',               ex: '"Hot" and "cold" are antonyms.' },
      { w: 'punctuation',    ipa: '/ˌpʌŋktʃuˈeɪʃən/',  vi: 'dấu câu',                     ex: 'Correct punctuation makes writing much clearer.' },
      { w: 'paraphrase',     ipa: '/ˈpærəfreɪz/',      vi: 'diễn giải lại',               ex: 'He paraphrased the article in his own words.' },
      { w: 'context',        ipa: '/ˈkɒntekst/',       vi: 'ngữ cảnh',                    ex: 'You can guess a word\'s meaning from its context.' },
      { w: 'infer',          ipa: '/ɪnˈfɜː/',          vi: 'suy luận / suy ra',            ex: 'She could infer the meaning from the surrounding text.' },
      { w: 'autobiography',  ipa: '/ˌɔːtəbaɪˈɒɡrəfi/', vi: 'tự truyện',                   ex: 'He wrote an autobiography about his life in the arts.' },
      { w: 'bibliography',   ipa: '/ˌbɪbliˈɒɡrəfi/',   vi: 'thư mục tài liệu tham khảo',  ex: 'Include a bibliography at the end of your essay.' },
      { w: 'preface',        ipa: '/ˈprefɪs/',         vi: 'lời tựa',                     ex: 'The author explains her inspiration in the preface.' },
      { w: 'anthology',      ipa: '/ænˈθɒlədʒi/',      vi: 'tuyển tập',                   ex: 'She published an anthology of short stories.' },
      { w: 'alliteration',   ipa: '/əˌlɪtəˈreɪʃən/',   vi: 'điệp âm (tu từ)',             ex: '"Peter Piper picked a peck" is a famous example of alliteration.' }
    ]
  },

  /* ─────────────────────────────────────────────────── */
  /* 22. BUSINESS & ECONOMY                              */
  /* ─────────────────────────────────────────────────── */
  {
    id: 'business',
    label: '📈 Business & Economy',
    sub: 'Kinh doanh & Kinh tế',
    words: [
      { w: 'entrepreneur',  ipa: '/ˌɒntrəprəˈnɜː/',   vi: 'doanh nhân / người khởi nghiệp', ex: 'She became a successful entrepreneur at age twenty-five.' },
      { w: 'revenue',       ipa: '/ˈrevənjuː/',        vi: 'doanh thu',                   ex: 'The company\'s revenue doubled this financial year.' },
      { w: 'expenditure',   ipa: '/ɪkˈspendɪtʃə/',    vi: 'chi tiêu / khoản chi',         ex: 'Government expenditure on education increased this year.' },
      { w: 'deficit',       ipa: '/ˈdefɪsɪt/',        vi: 'thâm hụt',                    ex: 'The country has a large and growing trade deficit.' },
      { w: 'surplus',       ipa: '/ˈsɜːpləs/',        vi: 'thặng dư',                    ex: 'The company reported a healthy budget surplus.' },
      { w: 'inflation',     ipa: '/ɪnˈfleɪʃən/',      vi: 'lạm phát',                    ex: 'High inflation reduces the purchasing power of money.' },
      { w: 'recession',     ipa: '/rɪˈseʃən/',        vi: 'suy thoái kinh tế',            ex: 'The country entered a recession after the financial crisis.' },
      { w: 'merger',        ipa: '/ˈmɜːdʒə/',         vi: 'sự sáp nhập',                 ex: 'The merger of the two companies created a global giant.' },
      { w: 'acquisition',   ipa: '/ˌækwɪˈzɪʃən/',     vi: 'sự mua lại công ty',           ex: 'The acquisition was completed for two billion dollars.' },
      { w: 'shareholder',   ipa: '/ˈʃeəˌhəʊldə/',     vi: 'cổ đông',                     ex: 'Shareholders voted in favour of the new chief executive.' },
      { w: 'dividend',      ipa: '/ˈdɪvɪdend/',       vi: 'cổ tức',                      ex: 'The company paid a dividend of fifty pence per share.' },
      { w: 'stock market',  ipa: '/ˈstɒk ˌmɑːkɪt/',   vi: 'thị trường chứng khoán',       ex: 'The stock market fell sharply on Monday morning.' },
      { w: 'bankruptcy',    ipa: '/ˈbæŋkrʌptsi/',     vi: 'phá sản',                     ex: 'The firm filed for bankruptcy after losing its main client.' },
      { w: 'startup',       ipa: '/ˈstɑːtʌp/',        vi: 'công ty khởi nghiệp',          ex: 'She founded a successful tech startup last year.' },
      { w: 'venture capital',ipa: '/ˈventʃə ˈkæpɪtl/', vi: 'vốn đầu tư mạo hiểm',         ex: 'The startup secured venture capital funding.' },
      { w: 'supply chain',  ipa: '/səˈplaɪ tʃeɪn/',   vi: 'chuỗi cung ứng',              ex: 'The pandemic disrupted global supply chains severely.' },
      { w: 'demand',        ipa: '/dɪˈmɑːnd/',        vi: 'cầu (kinh tế)',                ex: 'High demand for the product led to a price increase.' },
      { w: 'supply',        ipa: '/səˈplaɪ/',         vi: 'cung (kinh tế)',               ex: 'When supply falls and demand stays high, prices rise.' },
      { w: 'monopoly',      ipa: '/məˈnɒpəli/',       vi: 'độc quyền',                   ex: 'The government broke up the company\'s monopoly.' },
      { w: 'competition',   ipa: '/ˌkɒmpɪˈtɪʃən/',    vi: 'cạnh tranh',                  ex: 'Healthy competition drives innovation and lower prices.' },
      { w: 'market share',  ipa: '/ˈmɑːkɪt ʃeə/',     vi: 'thị phần',                    ex: 'The company increased its market share to thirty per cent.' },
      { w: 'consumer',      ipa: '/kənˈsjuːmə/',      vi: 'người tiêu dùng',             ex: 'Consumer confidence rose in the third quarter.' },
      { w: 'export',        ipa: '/ˈekspɔːt/',        vi: 'xuất khẩu',                   ex: 'The country\'s main export is electronic equipment.' },
      { w: 'import',        ipa: '/ˈɪmpɔːt/',         vi: 'nhập khẩu',                   ex: 'Oil is the country\'s largest and most expensive import.' },
      { w: 'tariff',        ipa: '/ˈtærɪf/',          vi: 'thuế quan',                   ex: 'The government imposed new tariffs on imported steel.' },
      { w: 'GDP',           ipa: '/ˌdʒiː diː ˈpiː/',  vi: 'tổng sản phẩm quốc nội',      ex: 'GDP grew by three per cent last year.' },
      { w: 'interest rate', ipa: '/ˈɪntrəst reɪt/',   vi: 'lãi suất',                    ex: 'The central bank raised interest rates to control inflation.' },
      { w: 'fiscal',        ipa: '/ˈfɪskəl/',         vi: 'thuộc tài chính ngân sách',    ex: 'The government announced new fiscal policies.' },
      { w: 'subsidy',       ipa: '/ˈsʌbsɪdi/',        vi: 'trợ cấp / trợ giá',           ex: 'The government provides subsidies to farmers.' },
      { w: 'outsource',     ipa: '/ˌaʊtˈsɔːs/',       vi: 'thuê ngoài',                  ex: 'Many companies outsource their customer service.' }
    ]
  },

  /* ─────────────────────────────────────────────────── */
  /* 23. COMMUNICATION                                   */
  /* ─────────────────────────────────────────────────── */
  {
    id: 'communication',
    label: '💬 Communication',
    sub: 'Giao tiếp',
    words: [
      { w: 'verbal',         ipa: '/ˈvɜːbəl/',         vi: 'bằng lời nói',                ex: 'He expressed his thanks in verbal form.' },
      { w: 'non-verbal',     ipa: '/ˌnɒnˈvɜːbəl/',     vi: 'phi ngôn ngữ',                ex: 'Non-verbal communication includes gestures and facial expressions.' },
      { w: 'persuade',       ipa: '/pəˈsweɪd/',        vi: 'thuyết phục',                 ex: 'She persuaded her friend to try the new restaurant.' },
      { w: 'negotiate',      ipa: '/nɪˈɡəʊʃieɪt/',     vi: 'đàm phán',                    ex: 'They negotiated a new contract over several weeks.' },
      { w: 'debate',         ipa: '/dɪˈbeɪt/',         vi: 'tranh luận / cuộc tranh luận', ex: 'The students debated the topic for a full hour.' },
      { w: 'express',        ipa: '/ɪkˈspres/',        vi: 'diễn đạt / bày tỏ',           ex: 'He found it difficult to express his feelings clearly.' },
      { w: 'interpret',      ipa: '/ɪnˈtɜːprɪt/',      vi: 'diễn giải / thông dịch',       ex: 'She interpreted the speech for the foreign delegates.' },
      { w: 'translate',      ipa: '/trænsˈleɪt/',      vi: 'dịch thuật',                  ex: 'He translated the document from French into English.' },
      { w: 'clarify',        ipa: '/ˈklærɪfaɪ/',       vi: 'làm rõ',                      ex: 'Please clarify what you mean by that statement.' },
      { w: 'summarise',      ipa: '/ˈsʌməraɪz/',       vi: 'tóm tắt',                     ex: 'She summarised the main points of the long article.' },
      { w: 'elaborate',      ipa: '/ɪˈlæbəreɪt/',      vi: 'giải thích chi tiết',          ex: 'Could you elaborate a little more on your last point?' },
      { w: 'interrupt',      ipa: '/ˌɪntəˈrʌpt/',      vi: 'ngắt lời',                    ex: 'It is rude to interrupt someone while they are speaking.' },
      { w: 'feedback',       ipa: '/ˈfiːdbæk/',        vi: 'phản hồi / góp ý',            ex: 'Her teacher gave helpful feedback on her essay.' },
      { w: 'assert',         ipa: '/əˈsɜːt/',          vi: 'khẳng định',                  ex: 'She asserted her right to speak at the meeting.' },
      { w: 'imply',          ipa: '/ɪmˈplaɪ/',         vi: 'ám chỉ / ngụ ý',              ex: 'His tone implied that he was not happy with the result.' },
      { w: 'acknowledge',    ipa: '/əkˈnɒlɪdʒ/',       vi: 'thừa nhận / ghi nhận',         ex: 'She acknowledged that the mistake was entirely hers.' },
      { w: 'emphasis',       ipa: '/ˈemfəsɪs/',        vi: 'sự nhấn mạnh',                ex: 'He placed great emphasis on the importance of teamwork.' },
      { w: 'rhetoric',       ipa: '/ˈretərɪk/',        vi: 'hùng biện',                   ex: 'The politician used powerful rhetoric to win votes.' },
      { w: 'tone',           ipa: '/təʊn/',            vi: 'giọng điệu',                  ex: 'The tone of his email was very formal and polite.' },
      { w: 'jargon',         ipa: '/ˈdʒɑːɡən/',        vi: 'thuật ngữ chuyên ngành',       ex: 'Medical jargon can be very confusing for patients.' },
      { w: 'fluency',        ipa: '/ˈfluːənsi/',       vi: 'sự lưu loát',                 ex: 'His English fluency improved rapidly with daily practice.' },
      { w: 'correspondence', ipa: '/ˌkɒrɪˈspɒndəns/',  vi: 'thư từ / liên lạc',           ex: 'She handled all business correspondence by email.' },
      { w: 'gesture',        ipa: '/ˈdʒestʃə/',        vi: 'cử chỉ',                      ex: 'A warm smile is a universal gesture of friendliness.' },
      { w: 'articulate',     ipa: '/ɑːˈtɪkjʊlɪt/',    vi: 'diễn đạt rõ ràng / lưu loát', ex: 'She is a very articulate and confident public speaker.' },
      { w: 'convey',         ipa: '/kənˈveɪ/',         vi: 'truyền đạt',                  ex: 'He struggled to convey his ideas clearly in writing.' },
      { w: 'concise',        ipa: '/kənˈsaɪs/',        vi: 'ngắn gọn / súc tích',          ex: 'Please keep your answers concise and to the point.' },
      { w: 'coherent',       ipa: '/kəʊˈhɪərənt/',     vi: 'mạch lạc / nhất quán',         ex: 'Her argument was well-structured and very coherent.' },
      { w: 'misunderstand',  ipa: '/ˌmɪsʌndəˈstænd/', vi: 'hiểu nhầm',                   ex: 'She misunderstood his instructions and took the wrong route.' },
      { w: 'anecdote',       ipa: '/ˈænɪkdəʊt/',       vi: 'câu chuyện ngắn / giai thoại', ex: 'She began her speech with a funny anecdote.' },
      { w: 'diplomatic',     ipa: '/ˌdɪpləˈmætɪk/',    vi: 'khéo léo / ngoại giao',        ex: 'He was diplomatic in the way he delivered the bad news.' }
    ]
  },

  /* ─────────────────────────────────────────────────── */
  /* 24. SOCIAL ISSUES                                   */
  /* ─────────────────────────────────────────────────── */
  {
    id: 'social',
    label: '🌍 Social Issues',
    sub: 'Vấn đề xã hội',
    words: [
      { w: 'poverty',          ipa: '/ˈpɒvəti/',          vi: 'đói nghèo',                   ex: 'Poverty remains a serious global challenge.' },
      { w: 'inequality',       ipa: '/ˌɪnɪˈkwɒlɪti/',    vi: 'bất bình đẳng',               ex: 'Income inequality has grown in many countries.' },
      { w: 'discrimination',   ipa: '/dɪˌskrɪmɪˈneɪʃən/', vi: 'sự phân biệt đối xử',         ex: 'Discrimination based on race or gender is illegal.' },
      { w: 'racism',           ipa: '/ˈreɪsɪzəm/',        vi: 'phân biệt chủng tộc',          ex: 'Racism has no place in a fair and equal society.' },
      { w: 'gender equality',  ipa: '/ˈdʒendə ɪˈkwɒlɪti/',vi: 'bình đẳng giới',              ex: 'Gender equality benefits everyone in society.' },
      { w: 'human rights',     ipa: '/ˈhjuːmən raɪts/',   vi: 'nhân quyền',                  ex: 'Every person deserves to have basic human rights.' },
      { w: 'migration',        ipa: '/maɪˈɡreɪʃən/',      vi: 'di cư',                       ex: 'Migration has shaped the culture of many great cities.' },
      { w: 'refugee',          ipa: '/ˌrefjʊˈdʒiː/',      vi: 'người tị nạn',                ex: 'The charity helps refugees find homes and employment.' },
      { w: 'asylum',           ipa: '/əˈsaɪləm/',         vi: 'nơi tị nạn / xin tị nạn',     ex: 'She applied for asylum after fleeing the conflict.' },
      { w: 'homelessness',     ipa: '/ˈhəʊmləsnɪs/',      vi: 'tình trạng vô gia cư',         ex: 'Homelessness is increasing in many major cities.' },
      { w: 'addiction',        ipa: '/əˈdɪkʃən/',         vi: 'nghiện / sự phụ thuộc',        ex: 'Addiction to drugs and alcohol can destroy families.' },
      { w: 'domestic violence',ipa: '/dəˈmestɪk ˈvaɪələns/', vi: 'bạo lực gia đình',          ex: 'Domestic violence is underreported in many communities.' },
      { w: 'cyberbullying',    ipa: '/ˈsaɪbəˌbʊliɪŋ/',    vi: 'bắt nạt trực tuyến',          ex: 'Cyberbullying causes serious harm to young people.' },
      { w: 'corruption',       ipa: '/kəˈrʌpʃən/',        vi: 'tham nhũng',                  ex: 'Corruption undermines trust in public institutions.' },
      { w: 'protest',          ipa: '/ˈprəʊtest/',        vi: 'biểu tình',                   ex: 'Thousands attended the protest in the capital city.' },
      { w: 'campaign',         ipa: '/kæmˈpeɪn/',         vi: 'chiến dịch',                  ex: 'She led a successful campaign for better healthcare.' },
      { w: 'charity',          ipa: '/ˈtʃærɪti/',         vi: 'tổ chức từ thiện',             ex: 'The charity provides hot meals for homeless people.' },
      { w: 'welfare',          ipa: '/ˈwelfeə/',          vi: 'phúc lợi xã hội',             ex: 'The government increased welfare payments for families.' },
      { w: 'integration',      ipa: '/ˌɪntɪˈɡreɪʃən/',    vi: 'hội nhập',                    ex: 'Integration of immigrants into society takes time and support.' },
      { w: 'inclusion',        ipa: '/ɪnˈkluːʒən/',       vi: 'sự hoà nhập',                 ex: 'Inclusion means ensuring everyone has equal opportunities.' },
      { w: 'prejudice',        ipa: '/ˈpredʒʊdɪs/',       vi: 'định kiến',                   ex: 'Prejudice often comes from ignorance and lack of exposure.' },
      { w: 'stereotype',       ipa: '/ˈsteriəˌtaɪp/',     vi: 'hình mẫu cố định / định kiến', ex: 'Stereotypes are often inaccurate and deeply harmful.' },
      { w: 'tolerance',        ipa: '/ˈtɒlərəns/',        vi: 'sự khoan dung',               ex: 'Tolerance and respect are essential in a diverse society.' },
      { w: 'empathy',          ipa: '/ˈempəθi/',          vi: 'sự đồng cảm',                 ex: 'Empathy is the ability to understand another person\'s feelings.' },
      { w: 'activism',         ipa: '/ˈæktɪvɪzəm/',       vi: 'hoạt động xã hội / chủ nghĩa hoạt động', ex: 'Her activism helped bring about real and lasting change.' },
      { w: 'legislation',      ipa: '/ˌledʒɪˈsleɪʃən/',   vi: 'luật pháp / lập pháp',        ex: 'New legislation was passed to protect workers\' rights.' },
      { w: 'sanitation',       ipa: '/ˌsænɪˈteɪʃən/',     vi: 'vệ sinh môi trường',           ex: 'Improved sanitation reduces the spread of disease.' },
      { w: 'cohesion',         ipa: '/kəʊˈhiːʒən/',       vi: 'sự gắn kết (xã hội)',          ex: 'Social cohesion is vital for a stable and peaceful society.' },
      { w: 'vulnerable',       ipa: '/ˈvʌlnərəbəl/',      vi: 'dễ bị tổn thương',             ex: 'Vulnerable groups need extra protection and support.' },
      { w: 'rehabilitation',   ipa: '/ˌriːəˌbɪlɪˈteɪʃən/',vi: 'phục hồi / tái hòa nhập',     ex: 'Rehabilitation programmes help former prisoners reintegrate.' }
    ]
  },

  /* ─────────────────────────────────────────────────── */
  /* 25. PERSONALITY & CHARACTER                         */
  /* ─────────────────────────────────────────────────── */
  {
    id: 'personality',
    label: '🧠 Personality & Character',
    sub: 'Tính cách & Con người',
    words: [
      { w: 'ambitious',      ipa: '/æmˈbɪʃəs/',         vi: 'có tham vọng',                ex: 'She is ambitious and always sets very high goals.' },
      { w: 'diligent',       ipa: '/ˈdɪlɪdʒənt/',        vi: 'chăm chỉ / cần cù',           ex: 'He is a diligent student who never misses a deadline.' },
      { w: 'empathetic',     ipa: '/ˌempəˈθetɪk/',       vi: 'giàu lòng đồng cảm',          ex: 'She is very empathetic and always listens carefully.' },
      { w: 'extrovert',      ipa: '/ˈekstrəvɜːt/',       vi: 'người hướng ngoại',            ex: 'He is an extrovert who loves meeting new people.' },
      { w: 'introvert',      ipa: '/ˈɪntrəvɜːt/',        vi: 'người hướng nội',             ex: 'She is an introvert who prefers quiet evenings at home.' },
      { w: 'resilient',      ipa: '/rɪˈzɪliənt/',        vi: 'kiên cường / không nản lòng', ex: 'She remained resilient despite facing many setbacks.' },
      { w: 'compassionate',  ipa: '/kəmˈpæʃənɪt/',       vi: 'giàu lòng trắc ẩn',           ex: 'He is compassionate and always helps those in need.' },
      { w: 'stubborn',       ipa: '/ˈstʌbən/',           vi: 'bướng bỉnh / cứng đầu',       ex: 'He is so stubborn that he never changes his mind.' },
      { w: 'impulsive',      ipa: '/ɪmˈpʌlsɪv/',         vi: 'bốc đồng',                    ex: 'She made an impulsive decision to quit her job.' },
      { w: 'modest',         ipa: '/ˈmɒdɪst/',           vi: 'khiêm tốn',                   ex: 'Despite great success, he remained very modest.' },
      { w: 'arrogant',       ipa: '/ˈærəɡənt/',          vi: 'kiêu ngạo / ngạo mạn',         ex: 'His arrogant attitude made him unpopular at work.' },
      { w: 'generous',       ipa: '/ˈdʒenərəs/',         vi: 'rộng lượng / hào phóng',       ex: 'She is generous and always offers to help others.' },
      { w: 'selfish',        ipa: '/ˈselfɪʃ/',           vi: 'ích kỷ',                      ex: 'He was selfish and never considered others\' feelings.' },
      { w: 'honest',         ipa: '/ˈɒnɪst/',            vi: 'trung thực',                  ex: 'She is always honest, even when the truth is difficult.' },
      { w: 'deceitful',      ipa: '/dɪˈsiːtfəl/',        vi: 'gian dối / lừa đảo',          ex: 'His deceitful behaviour seriously damaged his reputation.' },
      { w: 'reliable',       ipa: '/rɪˈlaɪəbəl/',        vi: 'đáng tin cậy',                ex: 'She is reliable and always keeps her promises.' },
      { w: 'indecisive',     ipa: '/ˌɪndɪˈsaɪsɪv/',      vi: 'thiếu quyết đoán',            ex: 'He is indecisive and struggles to make up his mind.' },
      { w: 'adaptable',      ipa: '/əˈdæptəbəl/',        vi: 'dễ thích nghi',               ex: 'She is very adaptable and copes well with change.' },
      { w: 'creative',       ipa: '/kriˈeɪtɪv/',         vi: 'sáng tạo',                    ex: 'He is a creative thinker who comes up with original ideas.' },
      { w: 'analytical',     ipa: '/ˌænəˈlɪtɪkəl/',      vi: 'có tư duy phân tích',          ex: 'She has an analytical mind and is great at solving problems.' },
      { w: 'sociable',       ipa: '/ˈsəʊʃəbəl/',         vi: 'thân thiện / hoà đồng',        ex: 'He is very sociable and makes friends easily.' },
      { w: 'reserved',       ipa: '/rɪˈzɜːvd/',          vi: 'kín đáo / dè dặt',            ex: 'She is quiet and reserved in large social groups.' },
      { w: 'patient',        ipa: '/ˈpeɪʃənt/',          vi: 'kiên nhẫn',                   ex: 'Teaching young children requires a great deal of patience.' },
      { w: 'witty',          ipa: '/ˈwɪti/',             vi: 'hài hước / dí dỏm',           ex: 'She is witty and always manages to make people laugh.' },
      { w: 'pessimist',      ipa: '/ˈpesɪmɪst/',         vi: 'người bi quan',               ex: 'He is a natural pessimist who always expects the worst.' },
      { w: 'optimist',       ipa: '/ˈɒptɪmɪst/',         vi: 'người lạc quan',              ex: 'She is an optimist who always sees the bright side of life.' },
      { w: 'perfectionist',  ipa: '/pəˈfekʃənɪst/',      vi: 'người cầu toàn',              ex: 'He is a perfectionist and checks his work many times.' },
      { w: 'temperamental',  ipa: '/ˌtempərəˈmentəl/',    vi: 'thất thường / hay thay đổi tâm trạng', ex: 'She is temperamental and reacts strongly to small setbacks.' },
      { w: 'charismatic',    ipa: '/ˌkærɪzˈmætɪk/',      vi: 'có sức hút / thu hút người khác', ex: 'The charismatic leader inspired everyone in the room.' },
      { w: 'conscientious',  ipa: '/ˌkɒnʃiˈenʃəs/',      vi: 'có lương tâm / chu đáo',       ex: 'She is conscientious and takes great care with every task.' }
    ]
  }
];
