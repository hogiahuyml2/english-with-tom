/* Thành tích & huy hiệu — danh mục + vẽ huy hiệu SVG. Dùng chung trình duyệt (window.EWTBadges) và máy chủ (require).
   Mỗi thành tích có 1–3 bậc (đồng / bạc / vàng). Mở khoá bậc nào thì nhận xu 🪙 và (có thể) một món cho nhân vật. */
(function (root) {
  'use strict';
  // metric: tên chỉ số do máy chủ tính (achievements.js). tiers: ngưỡng từng bậc. rw: phần thưởng từng bậc { coins, item } (item = khoá món nhân vật trong js/avatar.js)
  var LIST = [
    { id: 'streak', icon: '🔥', name: 'Lửa học tập', text: 'Học liên tiếp {n} ngày', metric: 'best_streak', unit: 'ngày', tiers: [3, 7, 30], rw: [{ coins: 10 }, { coins: 25, item: 'hat_party' }, { coins: 60, item: 'hat_crown' }], link: 'word-hub.html', how: 'Ôn từ mỗi ngày ở mục Luyện từ' },
    { id: 'words', icon: '📚', name: 'Kho từ vựng', text: 'Thuộc {n} từ', metric: 'words_learned', unit: 'từ', tiers: [25, 100, 300], rw: [{ coins: 10 }, { coins: 25, item: 'glasses_heart' }, { coins: 60, item: 'hat_wizard' }], link: 'word-hub.html', how: 'Học và ôn từ ở mục Luyện từ' },
    { id: 'reviews', icon: '🧠', name: 'Ôn tập chăm chỉ', text: 'Ôn {n} lượt từ vựng', metric: 'total_reviews', unit: 'lượt', tiers: [100, 500, 2000], rw: [{ coins: 10 }, { coins: 25, item: 'neck_pearls' }, { coins: 60 }], link: 'word-hub.html', how: 'Ôn từ ở mục Luyện từ' },
    { id: 'dict', icon: '🎧', name: 'Tai thính', text: 'Hoàn thành {n} lượt chép chính tả', metric: 'dictation_runs', unit: 'lượt', tiers: [3, 10, 30], rw: [{ coins: 10 }, { coins: 25, item: 'phones_on' }, { coins: 60 }], link: 'dictation.html', how: 'Luyện ở mục Chép chính tả' },
    { id: 'perfect_dict', icon: '✍️', name: 'Chép chuẩn từng chữ', text: 'Chép đúng 100% {n} câu', metric: 'dictation_perfect', unit: 'câu', tiers: [10, 50, 150], rw: [{ coins: 10 }, { coins: 25, item: 'glasses_sun' }, { coins: 60 }], link: 'dictation.html', how: 'Chép chính tả thật chính xác' },
    { id: 'homework', icon: '📝', name: 'Siêng làm bài', text: 'Nộp {n} bài tập khác nhau', metric: 'exercises_done', unit: 'bài', tiers: [5, 20, 60], rw: [{ coins: 10 }, { coins: 25, item: 'outfit_overalls' }, { coins: 60, item: 'hat_grad' }], link: 'exercises.html', how: 'Làm bài ở mục Chương trình hoặc Bài tập được giao' },
    { id: 'ontime', icon: '⏰', name: 'Đúng hẹn', text: 'Nộp đúng hạn {n} bài được giao', metric: 'ontime', unit: 'bài', tiers: [3, 10, 30], rw: [{ coins: 10 }, { coins: 25, item: 'neck_medal' }, { coins: 60 }], link: 'assigned.html', how: 'Nộp bài giáo viên giao trước hạn' },
    { id: 'high', icon: '🌟', name: 'Điểm cao', text: 'Đạt từ 80% ở {n} bài', metric: 'high_scores', unit: 'bài', tiers: [3, 10, 30], rw: [{ coins: 10 }, { coins: 25 }, { coins: 60, item: 'outfit_vest' }], link: 'exercises.html', how: 'Làm bài cẩn thận để đạt từ 80%' },
    { id: 'perfect', icon: '💯', name: 'Hoàn hảo', text: 'Đạt điểm tuyệt đối ở {n} bài', metric: 'perfect_scores', unit: 'bài', tiers: [1, 5, 15], rw: [{ coins: 15 }, { coins: 30 }, { coins: 80, item: 'held_trophy' }], link: 'exercises.html', how: 'Làm đúng toàn bộ một bài trắc nghiệm' },
    { id: 'fixer', icon: '🛠️', name: 'Thợ sửa lỗi', text: 'Nắm chắc {n} câu trong Sổ lỗi sai', metric: 'mistakes_fixed', unit: 'câu', tiers: [5, 25, 100], rw: [{ coins: 10 }, { coins: 25, item: 'held_star' }, { coins: 80, item: 'outfit_hero' }], link: 'notebook.html', how: 'Ôn lại các câu sai trong Sổ lỗi sai' },
    { id: 'placement', icon: '🎯', name: 'Biết mình biết ta', text: 'Hoàn thành Kiểm tra đầu vào', metric: 'placement_done', unit: 'lần', tiers: [1], rw: [{ coins: 30 }], link: 'placement.html', how: 'Làm bài Kiểm tra đầu vào' },
    { id: 'arcade', icon: '🎮', name: 'Game thủ', text: 'Chơi {n} ván trò chơi từ vựng', metric: 'arcade_plays', unit: 'ván', tiers: [5, 25, 100], rw: [{ coins: 10 }, { coins: 25 }, { coins: 60 }], link: 'arcade.html', how: 'Chơi trò chơi ở mục Luyện từ' },
    { id: 'level', icon: '⭐', name: 'Lên cấp', text: 'Đạt cấp {n} ở Luyện từ', metric: 'level', unit: 'cấp', tiers: [3, 7, 15], rw: [{ coins: 10 }, { coins: 30 }, { coins: 80 }], link: 'word-hub.html', how: 'Tích XP khi học từ và chơi game' },
    { id: 'style', icon: '🎭', name: 'Phong cách riêng', text: 'Tạo nhân vật của riêng bạn', metric: 'has_avatar', unit: '', tiers: [1], rw: [{ coins: 15 }], link: 'avatar.html', how: 'Tạo và lưu nhân vật' },
    { id: 'class', icon: '🏫', name: 'Thành viên lớp', text: 'Tham gia một lớp học', metric: 'in_class', unit: '', tiers: [1], rw: [{ coins: 10 }], link: 'account.html#classCard', how: 'Chọn lớp của bạn ở Tài khoản' }
  ];
  var TIER_NAME = ['Đồng', 'Bạc', 'Vàng'];
  // màu từng hạng: [sáng, tối, viền, ruy-băng]
  var COL = { 0: ['#E8B07A', '#B3703A', '#8A4F1F', '#E76F51'], 1: ['#EEF2F7', '#A9B4C4', '#7C8798', '#6FA8F5'], 2: ['#FFE27A', '#F2A81D', '#B9770E', '#EF4444'], '-1': ['#E5E7EB', '#C4C9D2', '#9CA3AF', '#CBD5E1'] };

  function find(id) { for (var i = 0; i < LIST.length; i++) if (LIST[i].id === id) return LIST[i]; return null; }
  // chỉ số hạng hiển thị (0 đồng, 1 bạc, 2 vàng) của bậc thứ i trong danh sách có n bậc: thành tích 1 bậc luôn là vàng
  function look(n, i) { return n === 1 ? 2 : (n === 2 ? (i === 0 ? 1 : 2) : i); }
  function textOf(a, i) { return a.text.replace('{n}', a.tiers[i]); }
  var UID = 0;
  // tier = số bậc đã mở khoá (0 = chưa có); hiển thị huy hiệu của bậc cao nhất đã mở (hoặc bản khoá)
  function render(a, got, size) {
    var n = a.tiers.length, idx = got > 0 ? look(n, got - 1) : -1, c = COL[idx], id = 'bd' + (++UID), locked = got <= 0;
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" width="' + (size || 96) + '" height="' + Math.round((size || 96) * 140 / 120) + '" role="img" aria-label="' + a.name + (locked ? ' (chưa mở khoá)' : '') + '">';
    s += '<defs><linearGradient id="' + id + 'g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient><radialGradient id="' + id + 's" cx=".3" cy=".25" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>';
    s += '<path d="M34 78 L22 130 L40 120 L48 136 L58 86Z" fill="' + c[3] + '"/><path d="M86 78 L98 130 L80 120 L72 136 L62 86Z" fill="' + shade(c[3], -0.18) + '"/>';
    s += '<circle cx="60" cy="52" r="44" fill="' + c[2] + '"/><circle cx="60" cy="52" r="40" fill="url(#' + id + 'g)"/><circle cx="60" cy="52" r="32" fill="none" stroke="' + c[2] + '" stroke-width="2" stroke-dasharray="3 4" opacity=".55"/>';
    s += '<circle cx="60" cy="52" r="40" fill="url(#' + id + 's)"/>';
    s += '<text x="60" y="66" text-anchor="middle" font-size="40" ' + (locked ? 'opacity=".3" style="filter:grayscale(1)"' : '') + '>' + a.icon + '</text>';
    if (locked) s += '<g transform="translate(60 96)"><circle r="11" fill="#6B7280"/><rect x="-5" y="-2" width="10" height="8" rx="2" fill="#fff"/><path d="M-3.5 -2 v-3 a3.5 3.5 0 0 1 7 0 v3" fill="none" stroke="#fff" stroke-width="2"/></g>';
    else { var stars = ''; for (var k = 0; k < n; k++) stars += '<path transform="translate(' + (60 + (k - (n - 1) / 2) * 17) + ' 100) scale(.55)" d="M0-11 3-3.5 11-3 5 2.5 7 10 0 5.5-7 10-5 2.5-11-3-3-3.5Z" fill="' + (k < got ? '#FDE047' : '#D1D5DB') + '" stroke="' + (k < got ? '#B9770E' : '#9CA3AF') + '" stroke-width="1.5"/>'; s += stars; }
    return s + '</svg>';
  }
  function shade(h, f) { var a = [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16); }), t = f < 0 ? 0 : 255, k = Math.abs(f); return '#' + a.map(function (v) { v = Math.round(v + (t - v) * k); return (v < 16 ? '0' : '') + v.toString(16); }).join(''); }

  var API = { LIST: LIST, TIER_NAME: TIER_NAME, find: find, look: look, textOf: textOf, render: render };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.EWTBadges = API;
})(typeof window !== 'undefined' ? window : this);
