'use strict';
// Câu Ngữ pháp / Từ vựng dạng TRẮC NGHIỆM (phong cách TOEIC Part 5) + chuyển các câu điền từ của KET/FCE sang trắc nghiệm.
// Nguồn: (1) TOEIC Bridge Sample Test (ETS) — Part IV; (2) Hellenic American Union, Revised B2 Practice Exams for the TOEIC Test, Test 1 — Part 5;
// (3) câu điền từ KET/FCE đã có trong ngân hàng (đáp án gốc là đáp án chính thức; 3 phương án nhiễu được thêm vào và đã kiểm tra là SAI về ngữ pháp/nghĩa).
// Hai file TOEIC không kèm đáp án nên đáp án do người biên soạn giải (key: 'assistant') — các mục này nằm trong danh sách "chờ duyệt" để giáo viên rà lại.
const { cloze } = require('./lib');

const TB = 'TOEIC Bridge Sample Test (ETS), Part IV';
const TH = 'Hellenic American Union – Revised B2 Practice Exams for the TOEIC Test, Test 1, Part 5';
const g = (id, lv, text, opts, ans, src) => cloze(id, 'grammar', lv, text, opts, ans, src, 'assistant');
const v = (id, lv, text, opts, ans, src) => cloze(id, 'vocab', lv, text, opts, ans, src, 'assistant');

const extra = [
  // ───── Ngữ pháp (TOEIC Bridge) ─────
  g('tb-52', 'A1', 'Jack was unable to find ____ keys this morning.', ['his', 'himself', 'him', 'he'], 'A', TB),
  g('tb-54', 'A2', 'The homework assignment was short, so everyone finished it ____.', ['quickening', 'quickest', 'quickly', 'quicken'], 'C', TB),
  g('tb-55', 'A2', 'Pedro has just moved ____ a lovely apartment on Seventh Avenue.', ['into', 'with', 'up', 'on'], 'A', TB),
  g('tb-56', 'A2', 'Ms. Burton went to the bakery ____ a cake.', ['to buy', 'bought', 'will buy', 'buying'], 'A', TB),
  g('tb-57', 'B1', 'The teacher asked Thomas to get the books from the top shelf ____ he was the tallest student.', ['but', 'except', 'since', 'so that'], 'C', TB),
  g('tb-58', 'B1', 'Lexington Florists sells beautiful flower ____ for any occasion.', ['arrange', 'arranged', 'arranges', 'arrangements'], 'D', TB),
  g('tb-59', 'A2', 'Yesterday Mayumi received a letter ____ her cousin Yuki, who is working in Italy.', ['at', 'from', 'of', 'toward'], 'B', TB),
  g('tb-60', 'A2', 'The Springfield area will have ____ skies and sunshine tomorrow.', ['clearly', 'more clearly', 'clears', 'clear'], 'D', TB),
  g('tb-62', 'B1', 'Steven always feels ____ after a walk along the beach.', ['relax', 'relaxing', 'relaxed', 'relaxes'], 'C', TB),
  g('tb-64', 'B1', 'At Luigi’s Restaurant, dessert is ____ in the price of the meal.', ['include', 'inclusion', 'including', 'included'], 'D', TB),
  g('tb-66', 'B1', 'Living in France has been a wonderful ____ for Min Sung.', ['experience', 'experienced', 'experiences', 'experiencing'], 'A', TB),
  g('tb-68', 'A2', 'When Paul and Barbara had finished hanging up the decorations for the party, Fatima asked ____ to help with the food.', ['themselves', 'they', 'them', 'their'], 'C', TB),
  g('tb-70', 'B1', 'The retirement ____ for Ms. Lopez will take place on May 23.', ['celebration', 'celebrates', 'celebrated', 'celebrate'], 'A', TB),
  g('tb-71', 'B1', 'Carlos wants to go hiking ____ swimming this weekend.', ['although', 'for example', 'instead of', 'however'], 'C', TB),
  g('tb-72', 'B1', 'Dr. Bauer’s office is ____ located in the center of town.', ['convenience', 'conveniently', 'conveniences', 'convenient'], 'B', TB),
  g('tb-74', 'B1', 'Employees should pay attention ____ their supervisor explains the safety information.', ['when', 'during', 'such', 'what'], 'A', TB),
  g('tb-76', 'A2', 'When the package arrives, please look at it ____ to make sure it is not damaged.', ['carefulness', 'carefully', 'caring', 'care'], 'B', TB),
  g('tb-78', 'A2', 'Kyung Mi shaped the pizza dough into a ____ circle before she added the tomato sauce.', ['perfection', 'perfectly', 'perfect', 'perfecting'], 'C', TB),
  g('tb-80', 'B1', 'Enrique felt ____ that he was chosen to receive the science award.', ['honors', 'to honor', 'honoring', 'honored'], 'D', TB),
  // ───── Ngữ pháp (Hellenic B2 / TOEIC) ─────
  g('th-103', 'B2', '____ how hard Cohen trains, he always seems to finish in second place.', ['However', 'No matter', 'Despite that', 'Even though'], 'B', TH),
  g('th-104', 'B1', 'World leaders are struggling to find effective ways to deal with the ____ crisis.', ['economic', 'economics', 'economical', 'economically'], 'A', TH),
  g('th-105', 'B1', 'All managers are required ____ Baxter’s online management training course.', ['take', 'taken', 'taking', 'to take'], 'D', TH),
  g('th-106', 'B1', 'Mr. Taylor has requested next Monday afternoon off ____ take his child to the dentist.', ['to', 'that', 'so that', 'because of'], 'A', TH),
  g('th-107', 'B2', 'Besides ____ in charge of production, Alice Wilson also manages the design team.', ['to be', 'being', 'she is', 'from being'], 'B', TH),
  g('th-110', 'B1', 'The hotel’s award-winning restaurant features simple ____ delicious local dishes.', ['so', 'but', 'for', 'nor'], 'B', TH),
  g('th-111', 'B1', 'The screensaver not only displays the time, it ____ displays useful information such as weather forecasts.', ['also', 'both', 'either', 'instead'], 'A', TH),
  g('th-112', 'B2', 'DNP has succeeded in ____ its business into a million-dollar operation in under two years.', ['transform', 'to transform', 'transforming', 'the transforming'], 'C', TH),
  g('th-113', 'B2', 'Too much exercise can cause muscle strain, ____ can lead to more serious injuries.', ['they', 'what', 'those', 'which'], 'D', TH),
  g('th-115', 'B2', 'County Airport ____ if Urban Airlines had not stepped in.', ['would close', 'will be closed', 'had been closed', 'would have closed'], 'D', TH),
  g('th-116', 'B2', 'Rovers fans want their new stadium ____ in time for the new season.', ['finish', 'to finish', 'finished', 'will finish'], 'C', TH),
  g('th-119', 'B1', 'Any damaged product ____ if it is received by the company within ten days of purchase.', ['could replace', 'will be replaced', 'should be replacing', 'might have replaced'], 'B', TH),
  g('th-121', 'B1', 'Yoka has released a new video game that is quickly proving to be ____ its competitors’.', ['popular than', 'as popular as', 'more popular', 'too popular'], 'B', TH),
  g('th-122', 'B1', 'The start date for the Highway 19 bridge project has been pushed back ____ recent weather conditions.', ['as', 'since', 'due to', 'because'], 'C', TH),
  g('th-123', 'B1', 'All employees ____ are unable to attend the meeting should contact management immediately.', ['who', 'when', 'whose', 'whoever'], 'A', TH),
  g('th-125', 'B1', 'More people are submitting their CVs online this year than ____.', ['late', 'last', 'soon', 'ahead'], 'B', TH),
  g('th-128', 'B2', 'Miller said she resigned because she ____ for working overtime.', ['had not paid', 'was not to pay', 'would not pay', 'had not been paid'], 'D', TH),
  g('th-130', 'A2', 'Many people are afraid ____ speaking in front of an audience.', ['at', 'of', 'with', 'from'], 'B', TH),
  // ───── Từ vựng (TOEIC) ─────
  v('tb-51', 'A2', 'Feng’s family is ____ about visiting friends in Canada next summer.', ['saying', 'planning', 'thinking', 'leaving'], 'C', TB),
  v('tb-53', 'A1', 'These boxes are small and ____ to lift.', ['easy', 'happy', 'gentle', 'cheap'], 'A', TB),
  v('tb-61', 'B1', 'Ms. Jones was ____ hired to manage the marketing department.', ['exactly', 'closely', 'recently', 'strongly'], 'C', TB),
  v('tb-63', 'A2', 'Yanxuan ____ not to join the tennis team because she did not have enough time to practice.', ['realized', 'decided', 'felt', 'wondered'], 'B', TB),
  v('tb-65', 'B1', 'Singer Linda Hahn will star in a special ____ at the Towlen Theater on November 5.', ['performance', 'admission', 'attendance', 'reservation'], 'A', TB),
  v('tb-67', 'A2', 'I think you will find this travel guide ____ for your trip to Australia.', ['actual', 'useful', 'able', 'likely'], 'B', TB),
  v('tb-69', 'B1', 'The vase broke because it was handled ____ by the moving company workers.', ['currently', 'evenly', 'roughly', 'hardly'], 'C', TB),
  v('tb-73', 'B1', 'Discounted tickets for the baseball game will be sold ____ on the team’s Web site.', ['lately', 'deeply', 'only', 'solidly'], 'C', TB),
  v('tb-75', 'B1', 'Dunley, Inc., has achieved ____ over the years by creating unique computer products.', ['benefit', 'increase', 'public', 'success'], 'D', TB),
  v('tb-77', 'B1', 'A good fence will ____ animals from eating the vegetables in the garden.', ['prevent', 'last', 'avoid', 'finish'], 'A', TB),
  v('tb-79', 'B1', 'There are colorful photographs of India ____ the book.', ['onto', 'throughout', 'along', 'between'], 'B', TB),
  v('th-101', 'B1', 'Business success often ____ on convincing customers to buy a particular product or service.', ['finds', 'bases', 'agrees', 'depends'], 'D', TH),
  v('th-102', 'B1', 'Scientists have been ____ research on the health effects of using cellular phones.', ['putting up', 'holding on', 'carrying out', 'going through'], 'C', TH),
  v('th-108', 'B1', 'The Amazon rain forest provides a safe ____ for many kinds of animals that are found nowhere else on Earth.', ['survival', 'condition', 'population', 'environment'], 'D', TH),
  v('th-114', 'B2', 'Automobile companies ____ have high manufacturing costs.', ['sharply', 'typically', 'practically', 'completely'], 'B', TH),
  v('th-117', 'B2', 'Supermarket giant Foodex plans to ____ its main competitor, Earthfood, in a deal worth more than $2 billion.', ['call off', 'take over', 'break out', 'cut down on'], 'B', TH),
  v('th-118', 'B1', 'The world’s largest ____ of geothermal electricity is the United States of America.', ['leader', 'author', 'designer', 'producer'], 'D', TH),
  v('th-120', 'B1', 'The office is responsible for ensuring that company money is used ____.', ['highly', 'greatly', 'properly', 'generally'], 'C', TH),
  v('th-124', 'B2', 'Unless we find new suppliers, we will soon ____ rising costs.', ['deal', 'face', 'view', 'make'], 'B', TH),
  v('th-126', 'B1', 'Before you sign the contract, you need to carefully ____ all the facts.', ['think', 'expect', 'believe', 'consider'], 'D', TH),
  v('th-129', 'B1', 'Any ____ between 80 and 89 will result in a grade of “B”.', ['class', 'score', 'school', 'student'], 'B', TH),
];

// Câu điền từ có sẵn → trắc nghiệm: id → các phương án nhiễu (đáp án đúng = accept[0] của câu gốc)
const convert = {
  // A1
  'ket1-r5-26': ['an', 'two', 'these'], 'ket1-r5-29': ['at', 'of', 'by'], 'ket2-r5-25': ['with', 'at', 'of'], 'ket3-r5-25': ['an', 'the', 'some'],
  'ket4-r5-27': ['I', 'my', 'mine'], 'ket4-r5-28': ['an', 'two', 'much'], 'ket5-r5-28': ['an', 'two', 'many'],
  // A2
  'ket1-r5-27': ['on', 'at', 'for'], 'ket1-r5-28': ['who', 'what', 'where'], 'ket1-r5-30': ['who', 'whose', 'where'],
  'ket2-r5-26': ['so', 'very', 'enough'], 'ket2-r5-27': ['more', 'much', 'very'], 'ket2-r5-28': ['how', 'whose', 'whether'], 'ket2-r5-29': ['am', 'did', 'was'], 'ket2-r5-30': ['from', 'in', 'for'],
  'ket3-r5-27': ['for', 'of', 'in'], 'ket3-r5-28': ['at', 'on', 'in'], 'ket3-r5-29': ['am', 'was', 'do'],
  'ket4-r5-25': ['many', 'more', 'lot'], 'ket4-r5-26': ['in', 'on', 'for'], 'ket4-r5-29': ['do', 'have', 'can'], 'ket4-r5-30': ['to', 'with', 'of'],
  'ket5-r5-26': ['for', 'of', 'in'], 'ket5-r5-27': ['from', 'in', 'for'], 'ket5-r5-29': ['that', 'then', 'as'],
  'ket6-r5-25': ['for', 'of', 'at'], 'ket6-r5-27': ['make', 'tell', 'say'], 'ket6-r5-28': ['of', 'at', 'about'], 'ket6-r5-30': ['at', 'in', 'by'],
  // B2 (FCE)
  'fce-how-1': ['most', 'all', 'once'], 'fce-how-3': ['on', 'off', 'out'], 'fce-how-7': ['up', 'on', 'off'], 'fce-how-8': ['better', 'prefer', 'like'],
  'fce-house-5': ['turned', 'came', 'got'], 'fce-house-6': ['despite', 'because', 'unless'], 'fce-house-7': ["don't", 'no', 'never'],
  'fce-vol-1': ['who', 'whose', 'what'], 'fce-vol-5': ['for', 'so', 'more'], 'fce-vol-7': ['anything', 'everything', 'some'], 'fce-vol-8': ['make', 'do', 'put'],
};
// Gán lại bậc cho câu dễ nhất để có đủ câu mức A1 (đều là câu dễ nhất trong đề KET)
const relabel = {
  'ket4-r4-20': 'A1', 'ket5-r4-21': 'A1', 'ket6-r4-24': 'A1', 'ket4-r4-24': 'A1',
  'ket1-r1-3': 'A1', 'ket2-r1-1': 'A1', 'ket2-r1-3': 'A1', 'ket3-r1-5': 'A1', 'ket5-r1-4': 'A1', 'ket6-r1-1': 'A1',
};

function apply(items) {
  const byId = new Map(items.map((i) => [i.id, i]));
  for (const [id, wrong] of Object.entries(convert)) {
    const it = byId.get(id); if (!it || it.type !== 'fill') throw new Error('convert: không thấy câu điền từ ' + id);
    const right = it.accept[0]; const opts = [right, ...wrong];
    if (new Set(opts.map((o) => o.toLowerCase())).size !== opts.length) throw new Error('convert: phương án trùng ở ' + id);
    it.type = 'mcq'; it.opts = opts; it.a = 0; it.q = 'Choose the word or phrase that best fills the gap.'; delete it.accept; it.converted = true;
  }
  for (const [id, lv] of Object.entries(relabel)) { const it = byId.get(id); if (!it) throw new Error('relabel: không thấy ' + id); it.lv = lv; }
  // câu điền từ ngữ pháp chưa chuyển → dự phòng (đề ngữ pháp chỉ dùng trắc nghiệm)
  for (const it of items) if (it.type === 'fill' && it.sk === 'grammar') it.spare = true;
  return items.concat(extra);
}
module.exports = { apply, extra, convert, relabel };
