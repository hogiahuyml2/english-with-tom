/* EWT Garden — đồ trang trí 1×1 của các khu quốc gia mới (mới thêm: 12 khu châu Mỹ / châu Âu / châu Phi) lấy từ hình khối cùng tên (cờ, vật phẩm văn hoá). Nạp SAU garden-world11.js. */
(function (root) {
  'use strict';
  var A = root.EWTGardenArt, W = root.EWTGardenWorld; if (!A || !W || !W.ART) return;
  ['krflag', 'kimchijar', 'jangseung', 'dolhareubang', 'trflag', 'turkishtea', 'evileye', 'turkishlamp', 'auflag', 'boomerang', 'kangaroosign', 'caflag', 'maplesyrup', 'totempole', 'canoe',
    'sombrero', 'pinata', 'tacocart', 'altar', 'braball', 'toucanpost', 'victoria', 'ankh', 'scarab', 'obelisk', 'papyrus', 'eyehorus', 'maflag', 'moroccanteapot', 'moroccanlamp', 'carpet',
    'flamencofan', 'paellapan', 'ruflag', 'matryoshka', 'ieflag', 'celticharp', 'noflag', 'vikingship', 'troll', 'panflute', 'quipu', 'mategourd', 'bandoneon', 'cuflag', 'congadrum', 'clflag', 'copihue',
    'maasaishield', 'safarijeep', 'vuvuzela', 'proteaflower', 'jebena', 'meskelcross', 'mgflag', 'vanilla']
    .forEach(function (id) { A.DECO[id] = function () { return W.ART[id] ? W.ART[id]({ x: 0, y: 0 }) : ''; }; });
})(typeof window !== 'undefined' ? window : this);
