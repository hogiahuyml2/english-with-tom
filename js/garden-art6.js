/* EWT Garden — đồ trang trí 1×1 của 8 khu quốc gia mới lấy từ hình khối cùng tên (cờ, vật phẩm văn hoá). Nạp SAU garden-world8.js. */
(function (root) {
  'use strict';
  var A = root.EWTGardenArt, W = root.EWTGardenWorld; if (!A || !W || !W.ART) return;
  ['krflag', 'kimchijar', 'jangseung', 'dolhareubang', 'trflag', 'turkishtea', 'evileye', 'turkishlamp', 'auflag', 'boomerang', 'kangaroosign', 'caflag', 'maplesyrup', 'totempole', 'canoe',
    'sombrero', 'pinata', 'tacocart', 'altar', 'braball', 'toucanpost', 'victoria', 'ankh', 'scarab', 'obelisk', 'papyrus', 'eyehorus', 'maflag', 'moroccanteapot', 'moroccanlamp', 'carpet']
    .forEach(function (id) { A.DECO[id] = function () { return W.ART[id] ? W.ART[id]({ x: 0, y: 0 }) : ''; }; });
})(typeof window !== 'undefined' ? window : this);
