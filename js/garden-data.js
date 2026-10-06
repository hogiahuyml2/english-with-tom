/* EWT Garden — dữ liệu dùng chung cho trình duyệt và máy chủ (giá, thời gian lớn, mức vườn…).
   Máy chủ luôn kiểm tra lại theo bảng này, nên sửa giá/thời gian ở đây là đủ. */
(function (root) {
  'use strict';
  var MIN = 60 * 1000;
  // kind: plant (hoa, lớn theo thời gian), tree (cây, lớn chậm), deco (trang trí), ground (nền)
  // cost = xu; lvl = cấp vườn cần có; grow = phút để nở/ra quả; y = xu nhận khi thu hoạch; b = điểm đẹp của vườn
  var ITEMS = [
    { id: 'daisy', name: 'Cúc họa mi', kind: 'plant', cost: 0, lvl: 1, grow: 5, y: 0, b: 1, c: '#FFFFFF', c2: '#FFD23F', free: 1 },
    { id: 'tulip', name: 'Tulip', kind: 'plant', cost: 10, lvl: 1, grow: 20, y: 4, b: 2, c: '#F4577A', c2: '#FFB3C6' },
    { id: 'pansy', name: 'Păng-xê', kind: 'plant', cost: 12, lvl: 1, grow: 25, y: 5, b: 2, c: '#8E5FC4', c2: '#F7D54A' },
    { id: 'rose', name: 'Hoa hồng', kind: 'plant', cost: 30, lvl: 2, grow: 45, y: 8, b: 3, c: '#E5334B', c2: '#FF8FA3' },
    { id: 'sunflower', name: 'Hướng dương', kind: 'plant', cost: 40, lvl: 2, grow: 60, y: 10, b: 3, c: '#FFC933', c2: '#7A4A22' },
    { id: 'lavender', name: 'Oải hương', kind: 'plant', cost: 60, lvl: 3, grow: 75, y: 12, b: 4, c: '#9B7BE0', c2: '#C9B6F2' },
    { id: 'lotus', name: 'Sen hồng', kind: 'plant', cost: 90, lvl: 3, grow: 90, y: 15, b: 5, c: '#FF8FB8', c2: '#FFE0EC' },
    { id: 'hydrangea', name: 'Cẩm tú cầu', kind: 'plant', cost: 140, lvl: 4, grow: 120, y: 20, b: 6, c: '#5B9BF0', c2: '#B9D5FF' },
    { id: 'orchid', name: 'Hoa lan', kind: 'plant', cost: 220, lvl: 5, grow: 180, y: 28, b: 8, c: '#E26BC8', c2: '#FFD6F4' },
    { id: 'starflower', name: 'Hoa ánh sao', kind: 'plant', cost: 400, lvl: 6, grow: 240, y: 45, b: 12, c: '#38D6C4', c2: '#FFF48A' },
    { id: 'pine', name: 'Cây thông', kind: 'tree', cost: 80, lvl: 2, grow: 300, y: 30, b: 9, c: '#2E8B57', c2: '#1F6B41' },
    { id: 'apple', name: 'Cây táo', kind: 'tree', cost: 120, lvl: 3, grow: 360, y: 36, b: 10, c: '#4CAF50', c2: '#E5334B' },
    { id: 'lemon', name: 'Cây chanh', kind: 'tree', cost: 160, lvl: 4, grow: 400, y: 42, b: 11, c: '#5FBF55', c2: '#FFE14D' },
    { id: 'cherry', name: 'Hoa anh đào', kind: 'tree', cost: 300, lvl: 4, grow: 480, y: 60, b: 14, c: '#FFB7D0', c2: '#FF7FAE' },
    { id: 'palm', name: 'Cây dừa', kind: 'tree', cost: 450, lvl: 6, grow: 540, y: 75, b: 15, c: '#3FAE4A', c2: '#8A5A2E' },
    { id: 'path', name: 'Lối đi đá', kind: 'ground', cost: 0, lvl: 1, b: 1, free: 1 },
    { id: 'rock', name: 'Hòn đá', kind: 'deco', cost: 0, lvl: 1, b: 1, free: 1 },
    { id: 'bush', name: 'Bụi cây', kind: 'deco', cost: 0, lvl: 1, b: 1, free: 1 },
    { id: 'fence', name: 'Hàng rào gỗ', kind: 'deco', cost: 0, lvl: 1, b: 1, free: 1 },
    { id: 'sign', name: 'Biển EWT Garden', kind: 'deco', cost: 20, lvl: 1, b: 2 },
    { id: 'bench', name: 'Ghế gỗ', kind: 'deco', cost: 30, lvl: 2, b: 3 },
    { id: 'lamp', name: 'Đèn vườn', kind: 'deco', cost: 40, lvl: 2, b: 3 },
    { id: 'mailbox', name: 'Hộp thư', kind: 'deco', cost: 30, lvl: 2, b: 2 },
    { id: 'birdhouse', name: 'Nhà chim', kind: 'deco', cost: 50, lvl: 2, b: 4 },
    { id: 'picnic', name: 'Khăn picnic', kind: 'deco', cost: 50, lvl: 3, b: 4 },
    { id: 'gnome', name: 'Chú lùn', kind: 'deco', cost: 90, lvl: 3, b: 5 },
    { id: 'pond', name: 'Ao nhỏ', kind: 'deco', cost: 100, lvl: 3, b: 6 },
    { id: 'arch', name: 'Cổng hoa', kind: 'deco', cost: 200, lvl: 4, b: 9 },
    { id: 'swing', name: 'Xích đu', kind: 'deco', cost: 300, lvl: 5, b: 10 },
    { id: 'fountain', name: 'Đài phun nước', kind: 'deco', cost: 500, lvl: 5, b: 14 },
    { id: 'windmill', name: 'Cối xay gió', kind: 'deco', cost: 650, lvl: 6, b: 15 },
    { id: 'greenhouse', name: 'Nhà kính', kind: 'deco', cost: 900, lvl: 7, b: 18 }
  ];
  var PETS = [
    { id: 'bird', name: 'Chim sẻ', cost: 60, lvl: 1 }, { id: 'cat', name: 'Mèo con', cost: 80, lvl: 1 }, { id: 'dog', name: 'Cún con', cost: 100, lvl: 1 },
    { id: 'duck', name: 'Vịt vàng', cost: 80, lvl: 2 }, { id: 'bunny', name: 'Thỏ trắng', cost: 90, lvl: 2 }, { id: 'butterfly', name: 'Bướm', cost: 50, lvl: 2 },
    { id: 'turtle', name: 'Rùa nhỏ', cost: 120, lvl: 3 }, { id: 'hamster', name: 'Chuột hamster', cost: 90, lvl: 3 }, { id: 'fox', name: 'Cáo nhỏ', cost: 300, lvl: 5 }
  ];
  var LEVELS = [
    { n: 1, at: 0, title: 'Mầm non' }, { n: 2, at: 10, title: 'Vườn nhỏ xinh' }, { n: 3, at: 30, title: 'Vườn hoa' }, { n: 4, at: 60, title: 'Vườn rực rỡ' }, { n: 5, at: 100, title: 'Vườn mơ ước' },
    { n: 6, at: 160, title: 'Vườn cổ tích' }, { n: 7, at: 240, title: 'Vườn thượng uyển' }, { n: 8, at: 340, title: 'Vườn thần tiên' }, { n: 9, at: 480, title: 'Vườn huyền thoại' }, { n: 10, at: 650, title: 'Khu vườn của Tom' }
  ];
  var SIZES = [{ n: 5, cost: 0 }, { n: 6, cost: 80 }, { n: 7, cost: 200 }, { n: 8, cost: 400 }, { n: 9, cost: 700 }, { n: 10, cost: 1000 }];
  var RULES = {
    waterFree: 10,        // lượt tưới miễn phí mỗi ngày
    waterMax: 3,          // số lần tưới tối đa cho mỗi cây trong một chu kỳ
    waterCut: 0.25,       // mỗi lần tưới rút ngắn 25% thời gian lớn
    yieldCapDay: 40,      // xu tối đa nhận từ thu hoạch mỗi ngày
    feedXu: 1, feedCapDay: 5, // cho thú cưng ăn: +1 xu / con, tối đa 5 xu mỗi ngày
    quizWater: 1, quizCapDay: 150, // trả lời đúng: +1 lượt tưới và được lật thẻ thưởng (xem FLIP); tối đa 150 câu đúng được thưởng mỗi ngày
    maxPets: 6, sellBack: 0.5
  };
  // Thẻ thưởng khi trả lời đúng: lật 1 trong 3 thẻ. Thẻ thường 20–100 xu; thẻ lớn +500 / +1000 xu; thẻ nhân ×2 / ×3 số xu hiện có (có mức tối đa).
  var FLIP = { cards: 3, normal: [[20, 34], [30, 26], [40, 16], [50, 10], [60, 6], [80, 3.5], [100, 1.5]],
    types: [['coin', 60], ['b500', 14], ['b1000', 7], ['x2', 12], ['x3', 7]], big: { b500: 500, b1000: 1000 }, mult: { x2: 2, x3: 3 }, multCap: 2000, multMin: 100 };
  var BY = {}; ITEMS.forEach(function (i) { BY[i.id] = i; });
  var PBY = {}; PETS.forEach(function (i) { PBY[i.id] = i; });

  function levelOf(beauty) { var l = 1; LEVELS.forEach(function (x) { if (beauty >= x.at) l = x.n; }); return l; }
  function nextLevel(beauty) { for (var i = 0; i < LEVELS.length; i++) if (beauty < LEVELS[i].at) return LEVELS[i]; return null; }
  function petSlots(level) { return Math.min(RULES.maxPets, 1 + Math.floor(level / 2) + 1); }
  // Giai đoạn cây: 0 hạt, 1 mầm, 2 nụ, 3 nở. Thời gian lớn bị rút ngắn theo số lần tưới.
  function growMs(item, waters) { return item.grow * MIN * (1 - Math.min(waters || 0, RULES.waterMax) * RULES.waterCut); }
  function stageOf(item, tile, now) {
    if (!item || (item.kind !== 'plant' && item.kind !== 'tree')) return 3;
    var tot = growMs(item, tile.w), el = Math.max(0, now - (tile.at || 0)), r = tot > 0 ? el / tot : 1;
    return r >= 1 ? 3 : r >= 0.6 ? 2 : r >= 0.25 ? 1 : 0;
  }
  function remainMs(item, tile, now) { return Math.max(0, growMs(item, tile.w) - (now - (tile.at || 0))); }
  function beautyOf(state) {
    var b = 0; (state.tiles || []).forEach(function (t) { if (t && BY[t.k]) b += BY[t.k].b; });
    (state.pets || []).forEach(function (p) { b += 5; }); b += (state.size - 5) * 4; return b;
  }

  var API = { ITEMS: ITEMS, PETS: PETS, LEVELS: LEVELS, SIZES: SIZES, RULES: RULES, FLIP: FLIP, BY: BY, PBY: PBY, levelOf: levelOf, nextLevel: nextLevel, petSlots: petSlots, growMs: growMs, stageOf: stageOf, remainMs: remainMs, beautyOf: beautyOf, MIN: MIN };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.EWTGardenData = API;
})(typeof window !== 'undefined' ? window : this);
