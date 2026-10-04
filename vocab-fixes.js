// Bản sửa nội dung cho dữ liệu khởi đầu đã nạp từ trước (INSERT OR IGNORE không ghi đè).
// Mỗi bản sửa chỉ áp dụng nếu nội dung hiện tại CÒN NGUYÊN như bản gốc — giáo viên đã tự chỉnh thì không đụng vào.
// (Các file vocab-seed*.js / vocab-dialogues.js đã được sửa theo nội dung mới cho database tạo mới.)
const VOCAB_FIXES = [
  { word: 'vegetable', level: 'KET', oldEx: 'You should eat a vegetable with every meal.',
    set: { example_en: 'Try to eat at least one vegetable with every meal.', example_vi: 'Hãy cố gắng ăn ít nhất một loại rau củ trong mỗi bữa ăn.' } },
  { word: 'immigrant', level: 'FCE', oldEx: 'Every immigrant works hard to build a new life.',
    set: { example_en: 'The immigrant family worked hard to build a new life.', example_vi: 'Gia đình nhập cư ấy đã làm việc chăm chỉ để xây dựng cuộc sống mới.' } },
  { word: 'usually', level: 'KET', oldEx: 'We usually have dinner at seven.', set: { meaning_vi: 'thường' } },
  { word: 'go shopping', level: 'KET', oldEx: 'We go shopping on Saturdays.', set: { extra: 'have,play,make' } },
  { word: 'waste time', level: 'PET', oldEx: "Don't waste time on silly games.", set: { extra: 'save,win,keep' } },
  { word: 'raise awareness', level: 'FCE', oldEx: 'The campaign aims to raise awareness of plastic pollution.', set: { extra: 'rise,push,carry' } },
  { word: 'make a contribution', level: 'IELTS', oldEx: 'Volunteers make a contribution to the local community.', set: { extra: 'do,take,put' } },
  { word: 'reach an agreement', level: 'FCE', oldEx: 'The two companies finally reach an agreement.',
    set: { example_en: 'The two companies hope to reach an agreement soon.', example_vi: 'Hai công ty hy vọng sớm đạt được thỏa thuận.' } },
  { word: 'come to a conclusion', level: 'FCE', oldEx: 'After a long talk, we come to a conclusion.',
    set: { example_en: 'Let us talk until we come to a conclusion.', example_vi: 'Hãy trao đổi cho đến khi chúng ta đi đến kết luận.' } },
];

// from → to là một đoạn trong script hội thoại (đáp án đúng luôn đứng đầu trong { })
const DIALOGUE_FIXES = [
  { title: 'Ở nhà hàng', from: 'It is {delicious|boring|expensive|busy}.', to: 'It is {delicious|boring|crowded|busy}.' },
  { title: 'Ở cửa hàng quần áo', from: 'Can I {try on|wake up|borrow|invite} it?', to: 'Can I {try on|wake up|practise|invite} it?' },
  { title: 'Trò chuyện về môi trường', from: '{sustainable|convenient|delighted|generous}', to: '{sustainable|jealous|delighted|generous}' },
  { title: 'Trò chuyện về môi trường', from: 'become {extinct|jealous|nervous|embarrassed}', to: 'become {extinct|relieved|nervous|embarrassed}' },
  { title: 'Speaking Part 3: Giáo dục', from: '{compulsory|flexible|obsolete|preventive}', to: '{compulsory|multinational|obsolete|preventive}' },
  { title: 'Speaking Part 3: Công nghệ & việc làm', from: 'Is {privacy|epidemic|literacy|inflation} a worry for you?', to: 'Is online {privacy|erosion|obesity|landfill} a worry for you?' },
];

function applyFixes(db, log) {
  let n = 0;
  try {
    for (const f of VOCAB_FIXES) {
      const cols = Object.keys(f.set);
      const r = db.prepare('UPDATE vocab_words SET ' + cols.map(c => c + '=?').join(',') + ' WHERE word=? AND level=? AND example_en=? AND (' + cols.map(c => c + ' IS NOT ?').join(' OR ') + ')')
        .run(...cols.map(c => f.set[c]), f.word, f.level, f.oldEx, ...cols.map(c => f.set[c]));
      n += Number(r.changes || 0);
    }
    for (const f of DIALOGUE_FIXES) {
      const r = db.prepare('UPDATE word_dialogues SET script=replace(script,?,?) WHERE title=? AND instr(script,?)>0').run(f.from, f.to, f.title, f.from);
      n += Number(r.changes || 0);
    }
    if (n && log) log('[wordgame] Đã áp dụng ' + n + ' bản sửa nội dung.');
  } catch (e) { console.error('[wordgame] áp dụng bản sửa lỗi:', e.message); }
  return n;
}
module.exports = { VOCAB_FIXES, DIALOGUE_FIXES, applyFixes };
