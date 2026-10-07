/* Phát hiện hai từ vựng có thể bị coi là "cùng đáp án đúng" trong câu hỏi trắc nghiệm (nghĩa trùng / từ đồng nghĩa).
   Dùng chung cho Góc Từ Vựng, trò chơi arcade và câu hỏi kiếm xu của EWT Garden: đáp án nhiễu KHÔNG được xung đột với đáp án đúng. */
(function (root) {
  // Các nhóm từ đồng nghĩa / dễ lẫn: trong một câu hỏi, từ thuộc cùng nhóm không được làm đáp án nhiễu của nhau.
  var GROUPS = [
    ['waste', 'rubbish', 'garbage', 'litter'], ['audience', 'spectator'], ['competitor', 'opponent', 'rival'], ['routine', 'habit'],
    ['save', 'conserve', 'reduce', 'protect'], ['fit', 'healthy'], ['device', 'gadget'], ['money', 'cash'], ['salary', 'income', 'money'],
    ['bake', 'cook'], ['journey', 'excursion', 'trip'], ['itinerary', 'timetable', 'schedule'], ['assignment', 'homework'], ['lesson', 'lecture'],
    ['degree', 'qualification', 'certificate'], ['boss', 'manager'], ['injury', 'pain'], ['medicine', 'prescription'], ['extinct', 'endangered'],
    ['sustainable', 'renewable'], ['tradition', 'heritage'], ['customer', 'consumer'], ['legislation', 'policy'], ['win', 'defeat', 'beat'],
    ['pollute', 'contaminate'], ['attend', 'join'], ['hotel', 'resort', 'accommodation'], ['stamina', 'endurance'], ['journalist', 'reporter'],
    ['wellbeing', 'health'], ['flavour', 'taste'], ['ill', 'sick'], ['pupil', 'student'], ['film', 'movie'], ['purchase', 'buy'],
    ['huge', 'big', 'significant', 'enormous'], ['tiny', 'small'], ['terrible', 'detrimental', 'awful'], ['great', 'beneficial', 'wonderful'],
    ['demonstrate', 'illustrate', 'show'], ['essential', 'crucial', 'important'], ['consider', 'argue', 'think'], ['obtain', 'get'], ['assist', 'help']
  ];
  var IDX = {};
  GROUPS.forEach(function (g, i) { g.forEach(function (w) { (IDX[w] = IDX[w] || []).push(i); }); });
  function norm(s) { return String(s || '').toLowerCase().replace(/[’‘`]/g, "'").replace(/\s+/g, ' ').trim(); }
  // Tách nghĩa tiếng Việt thành các ý nhỏ (bỏ phần trong ngoặc, tách theo , ; / hoặc)
  function bits(m) { return String(m || '').toLowerCase().replace(/\([^)]*\)/g, ' ').split(/[,;\/]|\bhoặc\b/).map(function (x) { return x.replace(/\s+/g, ' ').trim(); }).filter(Boolean); }
  function inside(p, q) { return q.length >= 3 && (' ' + p + ' ').indexOf(' ' + q + ' ') >= 0; }   // q là một cụm từ nguyên vẹn nằm trong p
  function conflict(a, b) {
    var wa = norm(a.word), wb = norm(b.word);
    if (!wa || !wb) return false;
    if (wa === wb) return true;
    var ga = IDX[wa], gb = IDX[wb];
    if (ga && gb && ga.some(function (i) { return gb.indexOf(i) >= 0; })) return true;
    var x = bits(a.vi != null ? a.vi : a.meaning_vi), y = bits(b.vi != null ? b.vi : b.meaning_vi);
    return x.some(function (p) { return y.some(function (q) { return p === q || inside(p, q) || inside(q, p); }); });
  }
  // Dùng cho "Nâng cấp từ vựng": hai từ cùng thay thế một từ cơ bản (hoặc cùng nghĩa cơ bản) thì xung đột
  function basicOf(s) { return norm(s).replace(/^(very|a lot of|really)\s+/, '').replace(/\s+about$/, ''); }
  function sameBasic(a, b) { var x = basicOf(a.basic), y = basicOf(b.basic); return !!x && !!y && (x === y || inside(x, y) || inside(y, x)); }
  var API = { conflict: conflict, sameBasic: sameBasic, GROUPS: GROUPS };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.EWTVocabConflict = API;
})(typeof window !== 'undefined' ? window : this);
