/* EWT City — ĐỒ HOẠ phần 3: nhiều kiểu NHÀ Ở (nhà trệt, nhà sàn, nhà ống, biệt thự, dinh thự, chung cư…), TOÀ CAO ỐC & nhà chọc trời hiện đại,
   cửa hàng, công trình dịch vụ, nhà máy, vui chơi, học đường, danh thắng thế giới. Dựng bằng vài "khuôn" tham số (house / tower / shop) + một số công trình riêng. */
(function (root) {
  'use strict';
  var A = root.EWTCityArt; if (!A) return;
  var ART = A.ART, shade = A.shade, INK = 'rgba(40,28,60,.38)', TAU = Math.PI * 2;
  var def = function (name, fn) { ART[name] = fn; };
  var dot = function (g, x, y, r, c) { g.ell(x, y, r, r, c); };
  var smoke = function (g, cx, cy, z) { var p = g.P(cx, cy, z); g.meta.smoke.push([p[0], p[1]]); };
  var lot = function (g, rw, rh, col) { g.keep = true; g.poly(g.faceT(0, 0, rw, rh, 0), col || '#8ED067', false); g.keep = false; };
  var beacon = function (g, cx, cy, z) { var p = g.P(cx, cy, z); g.ell(p[0], p[1], 2.4, 2.4, '#FF5A5A'); g.meta.beacon = p; };
  var sign = function (g, cx, cy, z, w, col, txt) { var s = g.P(cx, cy, z); g.poly([[s[0] - w, s[1] - 7], [s[0] + w, s[1] - 7], [s[0] + w, s[1] + 5], [s[0] - w, s[1] + 5]], col, INK); if (txt) { g.c.fillStyle = '#fff'; g.c.font = 'bold 8px sans-serif'; g.c.textAlign = 'center'; g.c.fillText(txt, s[0], s[1] + 2.5); } };
  var shadowAt = function (g, cx, cy, r) { var p = g.P(cx, cy, 0); g.ell(p[0], p[1] + 2, r, r * .42, 'rgba(30,60,30,.22)'); };

  /* ═════════ KHUÔN NHÀ Ở ═════════ */
  // o: wall, roof (màu), rt (kiểu mái: gable | hip | flat | pyr), zb (cao tường), rh (cao mái), nx/ny (cửa sổ), door, along, lot, extra(g, x0,y0,w,h,top)
  function house(g, rw, rh, o) {
    var x0 = o.x0 == null ? .12 : o.x0, y0 = o.y0 == null ? .12 : o.y0, w = rw - 2 * x0, h = rh - 2 * y0, zb = o.zb, top = zb;
    if (o.lot !== false) lot(g, rw, rh, o.lot);
    g.box(x0, y0, w, h, 0, zb, o.wall);
    if (o.up) { var u = o.up; g.box(x0 + u.i, y0 + u.i, w - 2 * u.i, h - 2 * u.i, zb, zb + u.z, u.wall || o.wall); top = zb + u.z; g.winsL(x0 + u.i, y0 + u.i, w - 2 * u.i, h - 2 * u.i, zb + 3, top - 2, u.nx || 2, 1, { m: .28 }); g.winsR(x0 + u.i, y0 + u.i, w - 2 * u.i, h - 2 * u.i, zb + 3, top - 2, 1, 1, { m: .28 }); x0 += u.i; y0 += u.i; w -= 2 * u.i; h -= 2 * u.i; }
    if (o.rt === 'hip') g.hip(x0, y0, w, h, top, top + (o.rh || 12), o.roof, o.hin == null ? .22 : o.hin);
    else if (o.rt === 'pyr') g.hip(x0, y0, w, h, top, top + (o.rh || 18), o.roof, .5);
    else if (o.rt === 'flat') g.flat(x0, y0, w, h, top, o.roof || '#E8E8E8', '#fff');
    else g.gable(x0, y0, w, h, top, top + (o.rh || 12), o.along !== false, o.roof, { wall: o.wall });
    var z1 = zb - 2, bx = o.up ? x0 - o.up.i : x0, by = o.up ? y0 - o.up.i : y0, bw = o.up ? w + 2 * o.up.i : w, bh = o.up ? h + 2 * o.up.i : h;
    g.winsL(bx, by, bw, bh, 4, z1, o.nx || 2, o.ny || 1, { m: .28 }); g.winsR(bx, by, bw, bh, 4, z1, o.nxr || 1, o.ny || 1, { m: .28 });
    g.doorL(bx, by, bw, bh, o.dt || .5, 0, .2, 9, o.door || '#7A4B2A');
    if (o.extra) o.extra(g, bx, by, bw, bh, top);
    if (o.smoke) smoke(g, rw * .7, rh * .35, top + (o.rh || 12));
  }
  var CREAM = '#F5E6C8', PEACH = '#F6CBA2', MINT = '#C4E5CC', SKY = '#C3DCF3', LILAC = '#DCCFF2', WHITE = '#F2F2F2', YEL = '#F4DD8E', ROSE = '#F3B9B9';
  var RED = '#D95A42', BLUE = '#4F80BA', BRN = '#9A6A45', TEAL = '#3E9C94', GREY = '#6B7686', ORG = '#E58A3C', WINE = '#B8485E', GRN = '#5B8F4F';

  def('onefloor', function (g, rw, rh, lv) { house(g, rw, rh, { wall: lv > 1 ? YEL : CREAM, roof: lv === 3 ? TEAL : RED, rt: 'hip', zb: 12 + lv * 2, rh: 9, nx: 2, hin: .3, smoke: 1, extra: function (g, x, y, w, h) { g.box(x + .05, y + h - .02, w - .1, .14, 0, 2, '#D9CFB8'); } }); });
  def('logcabin', function (g, rw, rh, lv) {
    house(g, rw, rh, { wall: '#B58555', roof: '#7A4B2A', rt: 'gable', zb: 14 + lv * 2, rh: 13, nx: 1, door: '#4A2E18', lot: '#7FC46A', smoke: 1, extra: function (g, x, y, w, h, top) { var j; for (j = 1; j < 4; j++) { var z = j * (14 + lv * 2) / 4; g.line(g.P(x, y + h, z), g.P(x + w, y + h, z), 'rgba(60,35,15,.5)', 1.1); g.line(g.P(x + w, y + h, z), g.P(x + w, y, z), 'rgba(60,35,15,.4)', 1.1); } g.tree(rw * .85, rh * .8, .6, 'pine'); } }); });
  def('stilthouse', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#8ED067'); var z = 20; [[.2, .2], [.8, .2], [.2, .8], [.8, .8], [.5, .2], [.5, .8]].forEach(function (q) { var a = g.P(q[0], q[1], 0), b = g.P(q[0], q[1], z); g.line(a, b, '#8A5A33', 2.6); });
    g.box(.12, .12, rw - .24, rh - .24, z, z + 3, '#C9A06A'); g.box(.2, .2, rw - .4, rh - .4, z + 3, z + 20, '#D9B885'); g.winsL(.2, .2, rw - .4, rh - .4, z + 6, z + 18, 2, 1, { m: .3 }); g.winsR(.2, .2, rw - .4, rh - .4, z + 6, z + 18, 1, 1, { m: .3 });
    g.gable(.2, .2, rw - .4, rh - .4, z + 20, z + 33, false, '#C69C5E', { wall: '#D9B885' }); g.line(g.P(.5, rh - .1, z), g.P(.5, rh + .15, 0), '#8A5A33', 2); for (var k = 0; k < 4; k++) g.line(g.P(.4, rh - .1 + k * .06, z - k * 5), g.P(.62, rh - .1 + k * .06, z - k * 5), '#8A5A33', 1.4);
  });
  def('tubehouse', function (g, rw, rh, lv) {
    var z = 52 + lv * 6, wall = lv === 1 ? '#F4D9A8' : lv === 2 ? '#BFE0D3' : '#F3C7C7'; lot(g, rw, rh, '#B9B3A6'); g.box(.12, .1, rw - .24, rh - .2, 0, z, wall); g.flat(.12, .1, rw - .24, rh - .2, z, '#C9C4B8', '#E8E4D8');
    g.winsL(.12, .1, rw - .24, rh - .2, 14, z - 4, 1, 3, { m: .22 }); g.winsR(.12, .1, rw - .24, rh - .2, 14, z - 4, 2, 3, { m: .22 }); g.doorL(.12, .1, rw - .24, rh - .2, .5, 0, .34, 12, '#8A5A33'); g.box(.12, rh - .1, rw - .24, .12, z * .34, z * .34 + 3, '#6B7686'); g.box(.12, rh - .1, rw - .24, .12, z * .68, z * .68 + 3, '#6B7686');
    g.box(rw * .55, rh * .35, .22, .22, z, z + 10, '#7A9CC6'); g.cyl(rw * .28, rh * .6, .1, z, z + 8, '#5B7FA8'); g.poly([g.P(.4, rh + .02, z * .34 + 3), g.P(rw - .4, rh + .02, z * .34 + 3), g.P(rw - .35, rh + .12, z * .34 + 3), g.P(.35, rh + .12, z * .34 + 3)], '#3FA55B', INK);
  });
  def('japhouse', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B8D8A0'); g.box(.15, .2, rw - .3, rh - .4, 0, 14, '#F2EAD8'); g.winsL(.15, .2, rw - .3, rh - .4, 3, 12, 3, 1, { m: .15, col: '#E9E2CC' }); g.winsR(.15, .2, rw - .3, rh - .4, 3, 12, 2, 1, { m: .2, col: '#E9E2CC' });
    g.hip(.05, .1, rw - .1, rh - .2, 14, 26, '#4A4F5C', .18); g.hip(.0, .0, rw, rh, 12, 16, '#5C6272', .05); g.doorL(.15, .2, rw - .3, rh - .4, .5, 0, .24, 9, '#8A5A33'); g.tree(rw * .85, rh * .85, .6, 'cherry'); g.box(.2, rh - .18, .35, .12, 0, 3, '#B9B3A6');
  });
  def('chalet', function (g, rw, rh, lv) {
    house(g, rw, rh, { wall: '#EAD9B8', roof: '#6B4A2E', rt: 'gable', zb: 16 + lv * 2, rh: 20, along: false, nx: 2, ny: 1, door: '#5A3A22', lot: '#A8D88E', extra: function (g, x, y, w, h, top) { g.box(x - .05, y + h - .02, w + .1, .18, 8, 10, '#8A5A33'); var k; for (k = 0; k < 5; k++) { var p = g.P(x + .05 + k * w / 4.4, y + h + .12, 8); g.line(p, [p[0], p[1] + 8], '#8A5A33', 1.2); } g.tree(rw * .85, rh * .85, .65, 'pine'); } });
  });
  def('rowhouses', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); var n = Math.max(2, Math.round(rw)), cols = [PEACH, SKY, MINT, YEL, ROSE, LILAC], roofs = [RED, BLUE, TEAL, WINE, ORG, GRN], zb = 28 + lv * 3, i;
    for (i = 0; i < n; i++) { var x0 = .08 + i * (rw - .16) / n, w = (rw - .16) / n - .02; g.box(x0, .12, w, rh - .24, 0, zb, cols[(i + lv) % 6]); g.hip(x0, .12, w, rh - .24, zb, zb + 11, roofs[(i * 2 + lv) % 6], .25); g.winsL(x0, .12, w, rh - .24, 11, zb - 2, 1, 2, { m: .26 }); g.doorL(x0, .12, w, rh - .24, .5, 0, .34, 9, '#5C3A22'); g.awnL(x0, .12, w, rh - .24, .15, .85, 10, 2, .1, roofs[(i + 2) % 6], '#fff'); }
    g.winsR(.08, .12, rw - .16, rh - .24, 5, zb - 3, 1, 2, { m: .3 });
  });
  def('modernvilla', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#8ED067'); g.box(.2, .25, rw - .9, rh - .6, 0, 24, '#F0F0F0'); g.box(.5, .45, rw - .9, rh - .9, 24, 44, '#DDE3EA'); g.flat(.2, .25, rw - .9, rh - .6, 24, '#E8E8E8', '#fff'); g.flat(.5, .45, rw - .9, rh - .9, 44, '#C9CED6', '#E8E8E8');
    g.glassL(.2, .25, rw - .9, rh - .6, 3, 22, 1, '#7FC0E8'); g.glassR(.2, .25, rw - .9, rh - .6, 3, 22, 1, '#5FA8D8'); g.glassL(.5, .45, rw - .9, rh - .9, 26, 42, 1, '#7FC0E8'); g.glassR(.5, .45, rw - .9, rh - .9, 26, 42, 1, '#5FA8D8'); g.box(rw - .75, .35, .55, rh - .8, 0, 14, '#B9856A');
    g.poly([g.P(.3, rh - .25, .3), g.P(rw - .9, rh - .25, .3), g.P(rw - .9, rh - .02, .3), g.P(.3, rh - .02, .3)], '#5BC6E8', INK); g.tree(.15, .2, .7); g.tree(rw - .15, rh - .15, .8, 'cherry'); g.doorL(.2, .25, rw - .9, rh - .6, .8, 0, .16, 11, '#3E2B1E');
  });
  def('frenchvilla', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#9ED67A'); var z = 30; g.box(.3, .3, rw - .6, rh - .65, 0, z, '#F3E8CF'); g.hip(.25, .25, rw - .5, rh - .55, z, z + 18, '#5C6B80', .2); g.box(.3, .3, .3, rh - .65, 0, z + 6, '#EADFC4'); g.hip(.25, .25, .4, rh - .55, z + 6, z + 22, '#5C6B80', .35);
    g.winsL(.3, .3, rw - .6, rh - .65, 5, z - 2, 4, 2, { m: .22, col: '#8FB8D8' }); g.winsR(.3, .3, rw - .6, rh - .65, 5, z - 2, 3, 2, { m: .22 }); g.doorL(.3, .3, rw - .6, rh - .65, .5, 0, .16, 12, '#5A3A22'); var k; for (k = 0; k < 3; k++) g.box(.5 + k * .35, rh - .26, .22, .22, 0, 3, '#D9D3C4');
    g.box(.3, rh - .38, rw - .6, .1, 14, 16, '#2F3640', { noT: true }); [[.2, .15], [rw - .2, rh - .15]].forEach(function (q) { g.tree(q[0], q[1], .7, null); }); g.box(rw - .55, .45, .12, .12, z + 14, z + 26, '#B25A3C'); smoke(g, rw - .5, .5, z + 28);
  });
  def('medvilla', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#9ED67A'); var z = 26; g.box(.25, .3, rw - .5, rh - .6, 0, z, '#FBEFD8'); g.box(.25, .3, .6, rh - .6, 0, z + 12, '#F7E4C4'); g.hip(.25, .3, rw - .5, rh - .6, z, z + 10, '#D9693F', .25); g.hip(.25, .3, .6, rh - .6, z + 12, z + 22, '#D9693F', .3);
    g.winsL(.25, .3, rw - .5, rh - .6, 5, z - 3, 4, 1, { m: .25, col: '#7FB6D8' }); g.winsR(.25, .3, rw - .5, rh - .6, 5, z - 3, 2, 1, { m: .25 }); g.doorL(.25, .3, rw - .5, rh - .6, .62, 0, .2, 11, '#6B3A22'); g.poly([g.P(rw - .5, rh - .45, .4), g.P(rw - .05, rh - .45, .4), g.P(rw - .05, rh - .08, .4), g.P(rw - .5, rh - .08, .4)], '#5BC6E8', INK);
    g.tree(rw * .2, rh - .12, .8, null); g.tree(rw * .85, .2, .75, 'pine'); g.box(.28, rh - .3, rw - .9, .1, 0, 3, '#E6D5B0');
  });
  def('beachvilla', function (g, rw, rh, lv) {
    g.poly(g.faceT(0, 0, rw, rh, 0), '#F3E0AE', false); var z = 24; g.box(.25, .25, rw - .5, rh - .8, 0, z, '#FFFFFF'); g.box(.45, .4, rw - .9, rh - 1.1, z, z + 18, '#E8F4F8'); g.flat(.25, .25, rw - .5, rh - .8, z, '#F0F0F0', '#fff'); g.flat(.45, .4, rw - .9, rh - 1.1, z + 18, '#7FD0E0', '#fff');
    g.glassL(.25, .25, rw - .5, rh - .8, 3, z - 3, 1, '#7FC0E8'); g.glassR(.25, .25, rw - .5, rh - .8, 3, z - 3, 1, '#5FA8D8'); g.winsL(.45, .4, rw - .9, rh - 1.1, z + 3, z + 16, 2, 1, { m: .25 }); g.poly([g.P(.3, rh - .5, .3), g.P(rw - .3, rh - .5, .3), g.P(rw - .3, rh - .05, .3), g.P(.3, rh - .05, .3)], '#4FC3E8', INK);
    var p = g.P(rw * .8, .3, z + 18); g.line(p, [p[0], p[1] - 14], '#8A5A33', 1.6); g.ell(p[0], p[1] - 16, 8, 3, '#E9573F'); g.tree(rw - .2, rh - .2, .7, 'palm');
  });
  def('redfarmhouse', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#A8DA7C'); var z = 22; g.box(.25, .3, rw - .5, rh - .6, 0, z, '#E9573F'); g.gable(.25, .3, rw - .5, rh - .6, z, z + 18, true, '#8A5A33', { wall: '#E9573F' }); g.winsL(.25, .3, rw - .5, rh - .6, 4, z - 3, 3, 1, { m: .25, col: '#FFF3C4' }); g.winsR(.25, .3, rw - .5, rh - .6, 4, z - 3, 2, 1, { m: .25, col: '#FFF3C4' });
    g.doorL(.25, .3, rw - .5, rh - .6, .5, 0, .2, 10, '#fff'); g.cyl(rw - .35, .45, .22, 0, 40, '#C9D1D9', '#E4E8EE'); g.box(.2, rh - .22, rw - .4, .06, 0, 5, '#fff'); g.tree(.2, .18, .7, null); smoke(g, rw * .3, rh * .4, z + 10);
  });
  def('lakehouse', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#9ED67A'); var z = 22; g.poly(g.faceT(.0, rh * .62, rw, rh * .38, 0), '#5BC6E8', INK); g.box(.25, .2, rw - .5, rh * .55, 0, z, '#D9B885'); g.gable(.25, .2, rw - .5, rh * .55, z, z + 16, true, '#4F6B52', { wall: '#D9B885' }); g.winsL(.25, .2, rw - .5, rh * .55, 4, z - 3, 3, 1, { m: .2 }); g.winsR(.25, .2, rw - .5, rh * .55, 4, z - 3, 2, 1, { m: .25 });
    g.box(.2, rh * .78, rw * .6, .08, 0, 3, '#8A5A33'); g.box(rw * .78, rh * .72, .5, .18, 1, 4, '#C9863E'); g.doorL(.25, .2, rw - .5, rh * .55, .5, 0, .18, 9, '#5A3A22'); g.tree(rw - .2, .2, .8, 'pine'); smoke(g, rw * .35, rh * .3, z + 18);
  });
  def('glasshouse', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#9ED67A'); g.box(.2, .3, rw - .4, rh - .7, 0, 30, '#DCE8F2'); g.box(.2, .3, rw - .4, rh - .7, 0, 30, '#CFE3F2'); g.glassL(.2, .3, rw - .4, rh - .7, 2, 28, 2, '#8FD0F0'); g.glassR(.2, .3, rw - .4, rh - .7, 2, 28, 2, '#6FB8E0'); g.flat(.12, .22, rw - .24, rh - .54, 32, '#4A5468', '#2F3640');
    g.box(rw * .3, rh * .3, .6, .5, 32, 44, '#8A9AB0'); g.glassL(rw * .3, rh * .3, .6, .5, 34, 42, 1, '#9FDBF5'); g.poly([g.P(.3, rh - .35, .3), g.P(rw - .3, rh - .35, .3), g.P(rw - .3, rh - .05, .3), g.P(.3, rh - .05, .3)], '#4FC3E8', INK); g.tree(.15, .2, .8, 'cherry'); g.tree(rw - .15, rh * .5, .6, null);
  });
  def('mansion', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#8ED067'); var z = 34; g.box(.3, .35, rw - .6, rh - .75, 0, z, '#F2E3C6'); g.box(rw * .35, .25, rw * .3, rh - .55, 0, z + 12, '#EAD6B0'); g.hip(.25, .3, rw - .5, rh - .65, z, z + 16, '#6B4A3A', .25); g.hip(rw * .35 - .05, .2, rw * .3 + .1, rh - .5, z + 12, z + 34, '#6B4A3A', .3);
    g.winsL(.3, .35, rw - .6, rh - .75, 6, z - 3, 6, 2, { m: .22, col: '#8FB8D8' }); g.winsR(.3, .35, rw - .6, rh - .75, 6, z - 3, 3, 2, { m: .22 }); g.doorL(rw * .35, .25, rw * .3, rh - .55, .5, 0, .26, 14, '#4A2E18'); var k; for (k = 0; k < 4; k++) g.cyl(rw * .36 + k * rw * .09, rh - .22, .06, 0, 22, '#F4EEE0');
    g.box(rw * .33, rh - .3, rw * .34, .14, 20, 24, '#E8DFCB'); g.tree(.15, rh - .12, .9, null); g.tree(rw - .15, rh - .12, .9, 'cherry'); g.tree(.15, .2, .8, 'pine'); g.poly([g.P(rw * .4, rh + .02, .2), g.P(rw * .6, rh + .02, .2), g.P(rw * .6, rh + .0, .2)], '#C9B88A', false); smoke(g, rw - .5, .6, z + 18);
  });

  /* ═════════ KHUÔN CAO ỐC / NHÀ CAO TẦNG ═════════ */
  // o: wall, g1 g2 (kính trái/phải), tiers [[inset, zTop]...], floor (px/tầng), style 'glass'|'win', base (cao chân đế), bcol, crown, cc (màu đỉnh), band (dải ngang màu), door
  function tower(g, rw, rh, o) {
    var m = o.m == null ? .15 : o.m, x = m, y = m, w = rw - 2 * m, h = rh - 2 * m, z0 = 0, i, j;
    if (o.lot) lot(g, rw, rh, o.lot);
    if (o.base) { g.box(.05, .05, rw - .1, rh - .1, 0, o.base, o.bcol || '#E8E4DC'); g.winsL(.05, .05, rw - .1, rh - .1, 4, o.base - 3, Math.max(2, Math.round(rw * 1.4)), 1, { m: .2, col: '#9FD8F5' }); g.winsR(.05, .05, rw - .1, rh - .1, 4, o.base - 3, Math.max(2, Math.round(rh * 1.4)), 1, { m: .2, col: '#8CC8EB' }); z0 = o.base; }
    o.tiers.forEach(function (t, ti) {
      var ins = t[0], zt = t[1], xx = x + ins, yy = y + ins, ww = w - 2 * ins, hh = h - 2 * ins, rows = Math.max(2, Math.round((zt - z0 - 6) / (o.floor || 14)));
      g.box(xx, yy, ww, hh, z0, zt, o.wall);
      if (o.style === 'win') { var nx = Math.max(2, Math.round(ww * 2)), nyr = Math.max(2, Math.round(hh * 2)); g.winsL(xx, yy, ww, hh, z0 + (ti ? 3 : 10), zt - 3, nx, rows, { m: .2, col: o.g1 || '#9FD8F5' }); g.winsR(xx, yy, ww, hh, z0 + (ti ? 3 : 10), zt - 3, nyr, rows, { m: .2, col: o.g2 || '#8CC8EB' }); }
      else { g.glassL(xx, yy, ww, hh, z0 + (ti || o.base ? 3 : 12), zt - 3, rows, o.g1 || '#6FB5E3'); g.glassR(xx, yy, ww, hh, z0 + (ti || o.base ? 3 : 12), zt - 3, rows, o.g2 || '#4F96CC'); }
      if (o.band) { for (j = 1; j < 3; j++) { var bz = z0 + (zt - z0) * j / 3; g.quadL(xx, yy, ww, hh, 0, 1, bz - 1.5, bz + 1.5, o.band); g.quadR(xx, yy, ww, hh, 0, 1, bz - 1.5, bz + 1.5, shade(o.band, .85)); } }
      if (ti < o.tiers.length - 1) g.flat(xx, yy, ww, hh, zt, shade(o.wall, 1.05), null);
      z0 = zt; o._last = [xx, yy, ww, hh, zt];
    });
    var L = o._last, cx = L[0] + L[2] / 2, cy = L[1] + L[3] / 2, zt = L[4], cc = o.cc || '#8A94A4', c = o.crown || 'antenna';
    if (c === 'antenna') { g.flat(L[0], L[1], L[2], L[3], zt, '#B8C3D2', '#E2E8F0'); g.box(cx - .18, cy - .15, .36, .3, zt, zt + 8, '#9FAABA'); g.line(g.P(cx, cy, zt + 8), g.P(cx, cy, zt + (o.ant || 50)), '#6B7686', 1.8); beacon(g, cx, cy, zt + (o.ant || 50)); }
    else if (c === 'spire') { g.hip(L[0], L[1], L[2], L[3], zt, zt + (o.ch || 26), cc, .42); g.line(g.P(cx, cy, zt + (o.ch || 26)), g.P(cx, cy, zt + (o.ch || 26) + (o.ant || 48)), '#9AA4B2', 1.8); beacon(g, cx, cy, zt + (o.ch || 26) + (o.ant || 48)); }
    else if (c === 'pyr') { g.hip(L[0], L[1], L[2], L[3], zt, zt + (o.ch || 30), cc, .5); beacon(g, cx, cy, zt + (o.ch || 30) + 4); }
    else if (c === 'dome') { g.flat(L[0], L[1], L[2], L[3], zt, '#E8E8E8', '#fff'); var p = g.P(cx, cy, zt); g.ell(p[0], p[1] - 6, L[2] * 12, L[2] * 9, cc, INK); g.ell(p[0] - L[2] * 3, p[1] - 10, L[2] * 3, L[2] * 2, 'rgba(255,255,255,.35)'); g.line([p[0], p[1] - 6 - L[2] * 9], [p[0], p[1] - 6 - L[2] * 9 - 22], '#8A94A4', 1.6); beacon(g, cx, cy, zt + L[2] * 9 + 22); }
    else if (c === 'helipad') { g.flat(L[0], L[1], L[2], L[3], zt, '#6B7280', '#E2E8F0'); var hp = g.P(cx, cy, zt); g.ell(hp[0], hp[1], 12, 6, 'rgba(255,255,255,.18)'); g.c.fillStyle = '#FFE066'; g.c.font = 'bold 10px sans-serif'; g.c.textAlign = 'center'; g.c.fillText('H', hp[0], hp[1] + 3.5); g.line(g.P(L[0] + .1, L[1] + .1, zt), g.P(L[0] + .1, L[1] + .1, zt + 26), '#6B7686', 1.6); beacon(g, L[0] + .1, L[1] + .1, zt + 26); }
    else if (c === 'crown') { var s1 = .12; g.box(L[0] + s1, L[1] + s1, L[2] - 2 * s1, L[3] - 2 * s1, zt, zt + 14, shade(o.wall, 1.1)); g.box(L[0] + .3, L[1] + .3, L[2] - .6, L[3] - .6, zt + 14, zt + 28, shade(o.wall, 1.2)); g.hip(L[0] + .35, L[1] + .35, L[2] - .7, L[3] - .7, zt + 28, zt + 52, cc, .4); g.line(g.P(cx, cy, zt + 52), g.P(cx, cy, zt + 82), '#E2B33C', 1.8); beacon(g, cx, cy, zt + 82); }
    else if (c === 'ring') { g.flat(L[0], L[1], L[2], L[3], zt, '#B8C3D2', '#E2E8F0'); var rp = g.P(cx, cy, zt + 16); g.ell(rp[0], rp[1], L[2] * 22, L[2] * 11, 'rgba(120,200,240,.65)', INK); g.line(g.P(cx, cy, zt), rp, '#9AA4B2', 3); g.line(rp, [rp[0], rp[1] - 40], '#9AA4B2', 1.6); beacon(g, cx, cy, zt + 60); }
    else g.flat(L[0], L[1], L[2], L[3], zt, '#C9D1DA', '#E8EDF2');
    if (o.door !== false) g.doorL(o.base ? .05 : x, o.base ? .05 : y, o.base ? rw - .1 : w, o.base ? rh - .1 : h, .5, 0, .22, 10, o.door || '#1F3A5F');
    if (o.after) o.after(g, rw, rh, o._last);
  }
  var H = function (lv, a, b) { return (a + (b - a) * (lv - 1) / 2) * 1.5; };   // cao theo cấp công trình 1..3 (nhân 1,5: nhà cao tầng phải thật cao)

  /* ── nhà ở cao tầng ── */
  def('lowrise', function (g, rw, rh, lv) { var z = H(lv, 56, 74); tower(g, rw, rh, { wall: '#F0E2C8', tiers: [[0, z]], style: 'win', floor: 15, crown: 'flat', g1: '#A7DDF5', band: '#E9573F', door: '#4C6FA8', after: function (g, rw, rh, L) { g.tree(.2, rh - .1, .55); } }); });
  def('midrise', function (g, rw, rh, lv) { var z = H(lv, 100, 130); tower(g, rw, rh, { wall: '#DCE3EC', tiers: [[0, z]], style: 'win', floor: 14, crown: 'antenna', ant: 26, band: '#4F80BA', base: 16, bcol: '#F3F0E8' }); });
  def('twinapt', function (g, rw, rh, lv) {
    var z = H(lv, 100, 124); lot(g, rw, rh, '#B9B3A6'); g.box(.08, .08, rw - .16, rh - .16, 0, 14, '#F3F0E8'); var a = (rw - .5) / 2;
    [[.2, '#DCE3EC'], [.3 + a, '#E9E2D2']].forEach(function (q, i) { var x = q[0]; g.box(x, .3, a, rh - .6, 14, z + i * 14, q[1]); g.winsL(x, .3, a, rh - .6, 17, z + i * 14 - 3, 3, 7, { m: .2 }); g.winsR(x, .3, a, rh - .6, 17, z + i * 14 - 3, 3, 7, { m: .2 }); g.flat(x, .3, a, rh - .6, z + i * 14, '#C9CED6', '#E8E8E8'); });
    g.doorL(.08, .08, rw - .16, rh - .16, .5, 0, .2, 9, '#3E5C86'); g.line(g.P(.2 + a / 2, rh / 2, z + 14), g.P(.2 + a / 2, rh / 2, z + 36), '#6B7686', 1.4); beacon(g, .2 + a / 2, rh / 2, z + 36); g.tree(.2, rh - .1, .55); g.tree(rw - .2, rh - .1, .55, 'cherry');
  });
  def('glasscondo', function (g, rw, rh, lv) { var z = H(lv, 170, 210); tower(g, rw, rh, { wall: '#9DB7D5', tiers: [[0, z * .7], [.25, z]], g1: '#7FC8F0', g2: '#4FA4DA', floor: 11, crown: 'helipad', base: 14, bcol: '#EDEFF2' }); });
  def('pencil', function (g, rw, rh, lv) { var z = H(lv, 260, 330); tower(g, rw, rh, { m: .2, wall: '#C9D7E8', tiers: [[0, z]], g1: '#8FD0F5', g2: '#5AA8DC', floor: 12, crown: 'spire', ch: 20, ant: 60, cc: '#9FB2CC', lot: '#B9B3A6', band: '#FFFFFF' }); });
  def('terracetower', function (g, rw, rh, lv) {
    var z = H(lv, 170, 220); tower(g, rw, rh, { wall: '#F0EDE4', tiers: [[0, z * .4], [.2, z * .7], [.4, z]], style: 'win', floor: 14, crown: 'flat', base: 12, bcol: '#E8E4DC',
      after: function (g, rw, rh, L) { [[.15, .4], [.35, .7]].forEach(function (q) { var zz = z * q[1] + 12, k; for (k = 0; k < 4; k++) g.tree(rw * (.3 + k * .15), rh - .05 - q[0] * 1.4, .4, k % 2 ? 'cherry' : null, zz); }); g.tree(rw * .5, rh * .5, .5, null, z + 12); }
    });
  });
  def('skyresi', function (g, rw, rh, lv) { var z = H(lv, 230, 290); tower(g, rw, rh, { wall: '#E4D9C4', tiers: [[0, z * .6], [.2, z * .85], [.45, z]], style: 'win', g1: '#CFE9F7', floor: 14, crown: 'spire', ch: 24, ant: 54, cc: '#C9A96A', base: 14, bcol: '#CFC4AE', band: '#C9A96A' }); });
  def('ecotower', function (g, rw, rh, lv) {
    var z = H(lv, 200, 250); tower(g, rw, rh, { wall: '#EAF2E4', tiers: [[0, z]], g1: '#9ED6C0', g2: '#6FB8A0', floor: 15, crown: 'flat', base: 12, bcol: '#DDE8D2',
      after: function (g, rw, rh, L) { var k, j; for (j = 1; j < 6; j++) for (k = 0; k < 3; k++) g.tree(.4 + k * (rw - .8) / 2.4, rh - .06, .26, k % 2 ? null : 'cherry', 12 + j * (z - 14) / 6); g.tree(rw * .3, rh * .4, .45, null, z); g.tree(rw * .65, rh * .55, .5, 'cherry', z); var p = g.P(rw * .5, rh * .5, z + 6); g.line([p[0] - 8, p[1]], [p[0] + 8, p[1] - 6], '#6B7686', 1.2); dot(g, p[0], p[1] - 3, 2, '#F5D547'); }
    });
  });
  def('landmarkres', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); g.box(.05, .05, rw - .1, rh - .1, 0, 20, '#EDEFF2'); var a = (rw - .8) / 3, z = H(lv, 280, 340), i;
    [[.35, .35, z], [.35 + a + .1, .35, z - 40], [.35 + (a + .1) * 2, .35, z - 80]].forEach(function (q, n) { var x = q[0], zt = q[2]; g.box(x, .35, a, rh - .7, 20, zt, n === 1 ? '#CFD8E4' : '#DCE3EC'); g.glassL(x, .35, a, rh - .7, 22, zt - 3, Math.round((zt - 24) / 13), '#7FC8F0'); g.glassR(x, .35, a, rh - .7, 22, zt - 3, Math.round((zt - 24) / 13), '#58A8DE'); g.hip(x, .35, a, rh - .7, zt, zt + 18, '#9FB2CC', .4); g.line(g.P(x + a / 2, rh / 2, zt + 18), g.P(x + a / 2, rh / 2, zt + 18 + 30 - n * 8), '#9AA4B2', 1.6); });
    beacon(g, .35 + a / 2, rh / 2, z + 48); g.doorL(.05, .05, rw - .1, rh - .1, .5, 0, .2, 10, '#1F3A5F'); g.tree(.2, rh - .1, .6); g.tree(rw - .2, rh - .1, .6, 'cherry'); g.tree(rw * .5, rh - .08, .5);
  });

  /* ── cao ốc thương mại / văn phòng ── */
  def('glassoffice', function (g, rw, rh, lv) { var z = H(lv, 130, 170); tower(g, rw, rh, { wall: '#AFC6DD', tiers: [[0, z]], g1: '#78BFEA', g2: '#4A9AD2', floor: 12, crown: 'helipad', base: 10, bcol: '#E8EDF2' }); });
  def('officepark', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); [[.15, .2, 1.1, 34], [1.4, .2, 1.2, 46], [.15, rh * .55, 1.0, 28]].forEach(function (q, n) { var w = Math.min(q[2], rw - q[0] - .1), h = n === 2 ? rh * .38 : rh * .45; g.box(q[0], q[1], w, h, 0, q[3], '#CED7E3'); g.glassL(q[0], q[1], w, h, 4, q[3] - 3, Math.round(q[3] / 12), '#6FB5E3'); g.glassR(q[0], q[1], w, h, 4, q[3] - 3, Math.round(q[3] / 12), '#4F96CC'); g.flat(q[0], q[1], w, h, q[3], '#B8C3D2', '#E2E8F0'); });
    g.tree(rw * .5, rh - .1, .6); g.tree(rw - .2, rh - .15, .6, 'cherry'); g.tree(.2, rh - .1, .55, null);
  });
  def('twinoffice', function (g, rw, rh, lv) {
    var z = H(lv, 170, 220); lot(g, rw, rh, '#B9B3A6'); g.box(.08, .08, rw - .16, rh - .16, 0, 16, '#E8EDF2'); var a = (rw - .6) / 2;
    [[.2, z], [.4 + a, z - 30]].forEach(function (q) { g.box(q[0], .4, a, rh - .8, 16, q[1], '#B8CCE2'); g.glassL(q[0], .4, a, rh - .8, 18, q[1] - 3, Math.round((q[1] - 18) / 12), '#79C0EC'); g.glassR(q[0], .4, a, rh - .8, 18, q[1] - 3, Math.round((q[1] - 18) / 12), '#4C98D0'); g.hip(q[0], .4, a, rh - .8, q[1], q[1] + 16, '#8FA3BD', .4); g.line(g.P(q[0] + a / 2, rh / 2, q[1] + 16), g.P(q[0] + a / 2, rh / 2, q[1] + 46), '#9AA4B2', 1.6); beacon(g, q[0] + a / 2, rh / 2, q[1] + 46); });
    g.box(.2 + a - .02, rh * .38, .24, rh * .24, z * .62, z * .62 + 9, '#CFE3F2'); g.doorL(.08, .08, rw - .16, rh - .16, .5, 0, .2, 10, '#1F3A5F');
  });
  def('skyoffice', function (g, rw, rh, lv) { var z = H(lv, 280, 340); tower(g, rw, rh, { wall: '#9FB9D8', tiers: [[0, z * .5], [.22, z * .8], [.5, z]], g1: '#74BDEA', g2: '#4592CC', floor: 11, crown: 'spire', ch: 22, ant: 60, cc: '#7E9BBE', base: 14, bcol: '#E2E6EC' }); });
  def('spiraltower', function (g, rw, rh, lv) {
    var z = H(lv, 300, 350), n = 9, i, w = rw - .6, h = rh - .6; lot(g, rw, rh, '#B9B3A6'); g.box(.1, .1, rw - .2, rh - .2, 0, 12, '#E8EDF2');
    for (i = 0; i < n; i++) { var z0 = 12 + i * (z - 12) / n, z1 = 12 + (i + 1) * (z - 12) / n, sh = Math.sin(i * .7) * .32, sc = 1 - i * .035, ww = w * sc, hh = h * sc, x = (rw - ww) / 2 + sh, y = (rh - hh) / 2 - sh * .5; g.box(x, y, ww, hh, z0, z1, i % 2 ? '#A7C4E2' : '#B9D2EA'); g.glassL(x, y, ww, hh, z0 + 2, z1 - 2, 2, '#76BEEA'); g.glassR(x, y, ww, hh, z0 + 2, z1 - 2, 2, '#4C98D0'); if (i === n - 1) { g.hip(x, y, ww, hh, z1, z1 + 22, '#9FB2CC', .45); g.line(g.P(rw / 2 + sh, rh / 2 - sh * .5, z1 + 22), g.P(rw / 2 + sh, rh / 2 - sh * .5, z1 + 70), '#9AA4B2', 1.6); beacon(g, rw / 2 + sh, rh / 2 - sh * .5, z1 + 70); } }
    g.doorL(.1, .1, rw - .2, rh - .2, .5, 0, .22, 10, '#1F3A5F');
  });
  def('needletower', function (g, rw, rh, lv) {
    var z = H(lv, 330, 380); lot(g, rw, rh, '#B9B3A6'); g.box(.15, .15, rw - .3, rh - .3, 0, 20, '#E8EDF2'); g.cyl(rw / 2, rh / 2, .2, 20, z, '#C9D6E6', '#DDE6F0'); [40, 90, 140, 190, 240, 290].forEach(function (zz) { if (zz < z - 20) { var p = g.P(rw / 2, rh / 2, zz); g.line([p[0] - 8, p[1]], [p[0] + 8, p[1]], 'rgba(255,255,255,.7)', 1.2); } });
    var q = g.P(rw / 2, rh / 2, z), pz = q[1]; g.ell(q[0], pz + 2, 28, 10, '#9AB4D0', INK); g.ell(q[0], pz - 2, 28, 10, '#BBD3EA', INK); g.ell(q[0], pz - 8, 18, 6, '#6FB5E3'); g.ell(q[0], pz - 14, 10, 3.5, '#DDE6F0', INK); g.line([q[0], pz - 16], [q[0], pz - 62], '#9AA4B2', 1.8); beacon(g, rw / 2, rh / 2, z + 66); g.doorL(.15, .15, rw - .3, rh - .3, .5, 0, .2, 10, '#1F3A5F');
  });
  def('worldtrade', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); g.box(.06, .06, rw - .12, rh - .12, 0, 18, '#E4E8EE'); var a = (rw - 1.2) / 2, z = H(lv, 330, 380), br = z * .62;
    [[.35, z], [.85 + a, z - 28]].forEach(function (q) { g.box(q[0], .5, a, rh - 1, 18, q[1], '#A9C1DC'); g.glassL(q[0], .5, a, rh - 1, 20, q[1] - 3, Math.round((q[1] - 20) / 12), '#74BDEA'); g.glassR(q[0], .5, a, rh - 1, 20, q[1] - 3, Math.round((q[1] - 20) / 12), '#4592CC'); g.hip(q[0], .5, a, rh - 1, q[1], q[1] + 20, '#7E9BBE', .42); g.line(g.P(q[0] + a / 2, rh / 2, q[1] + 20), g.P(q[0] + a / 2, rh / 2, q[1] + 56), '#9AA4B2', 1.8); beacon(g, q[0] + a / 2, rh / 2, q[1] + 56); });
    g.box(.35 + a, rh * .36, .5, rh * .28, br, br + 14, '#CFE3F2'); g.winsL(.35 + a, rh * .36, .5, rh * .28, br + 2, br + 12, 2, 1, { m: .2 }); g.doorL(.06, .06, rw - .12, rh - .12, .5, 0, .2, 12, '#1F3A5F'); g.tree(.2, rh - .1, .7); g.tree(rw - .2, rh - .1, .7, 'cherry');
  });
  def('megaspire', function (g, rw, rh, lv) { var z = H(lv, 360, 410); tower(g, rw, rh, { wall: '#B3C6DC', tiers: [[0, z * .3], [.28, z * .55], [.55, z * .78], [.85, z]], g1: '#74BDEA', g2: '#4592CC', floor: 11, crown: 'spire', ch: 16, ant: 58, cc: '#E2B33C', base: 16, bcol: '#E4E8EE', band: '#E2B33C', m: .2 }); });
  def('bankhq', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); var z = H(lv, 90, 120); g.box(.15, .15, rw - .3, rh - .3, 0, z, '#EFE6D2'); g.winsL(.15, .15, rw - .3, rh - .3, 20, z - 4, 4, 4, { m: .2 }); g.winsR(.15, .15, rw - .3, rh - .3, 20, z - 4, 4, 4, { m: .2 }); var k; for (k = 0; k < 4; k++) g.cyl(.3 + k * (rw - .8) / 3, rh - .08, .08, 0, 18, '#F4EEE0'); g.box(.1, rh - .12, rw - .2, .2, 17, 22, '#D9CFB8');
    g.flat(.15, .15, rw - .3, rh - .3, z, '#C9B88A', '#E8DFCB'); g.doorL(.15, .15, rw - .3, rh - .3, .5, 0, .24, 14, '#B8860B'); sign(g, rw / 2, rh - .02, 26, 14, '#2F6B4F', 'BANK');
  });
  def('coworking', function (g, rw, rh, lv) { var z = H(lv, 90, 120); tower(g, rw, rh, { wall: '#F4EFE4', tiers: [[0, z * .6], [.3, z]], g1: '#B8E0F2', g2: '#98CCE8', floor: 13, crown: 'flat', band: '#F29A2E', base: 10, bcol: '#E8D6B8', after: function (g, rw, rh, L) { g.tree(L[0] + .2, L[1] + .2, .4, null, L[4]); g.tree(L[0] + L[2] - .2, L[1] + L[3] - .2, .4, 'cherry', L[4]); } }); });
  def('conventioncenter', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); var z = 34; g.box(.1, .1, rw - .2, rh - .3, 0, z, '#E4E8EE'); g.glassL(.1, .1, rw - .2, rh - .3, 4, z - 4, 2, '#8FD0F0'); g.glassR(.1, .1, rw - .2, rh - .3, 4, z - 4, 2, '#6FB8E0'); var p = g.P(rw / 2, rh * .45, z); g.poly([g.P(.1, .1, z), g.P(rw - .1, .1, z), g.P(rw - .1, rh - .2, z), g.P(.1, rh - .2, z)], '#C9D6E6', INK); g.ell(p[0], p[1] - 12, rw * 20, rh * 8, '#DCE8F4', INK); g.ell(p[0] - 10, p[1] - 17, rw * 8, rh * 3, 'rgba(255,255,255,.4)');
    g.doorL(.1, .1, rw - .2, rh - .3, .5, 0, .3, 16, '#1F3A5F'); sign(g, rw / 2, rh - .2, z - 6, 24, '#7A4BC7', 'EXPO'); g.tree(.2, rh - .1, .6); g.tree(rw - .2, rh - .1, .6, 'cherry');
  });
  def('pyramidhotel', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#E8D9A8'); var z = 28; g.box(.1, .1, rw - .2, rh - .2, 0, z, '#E8C879'); g.hip(.1, .1, rw - .2, rh - .2, z, z + 90, '#8FD0F0', .5); g.hip(.1, .1, rw - .2, rh - .2, z, z + 90, 'rgba(255,255,255,0)', .5);
    g.winsL(.1, .1, rw - .2, rh - .2, 4, z - 3, 5, 1, { m: .2 }); g.winsR(.1, .1, rw - .2, rh - .2, 4, z - 3, 5, 1, { m: .2 }); g.doorL(.1, .1, rw - .2, rh - .2, .5, 0, .24, 12, '#6B3A22'); g.line(g.P(rw / 2, rh / 2, z + 90), g.P(rw / 2, rh / 2, z + 110), '#E2B33C', 1.6); beacon(g, rw / 2, rh / 2, z + 110); g.tree(.15, rh - .1, .7, 'palm'); g.tree(rw - .15, rh - .1, .7, 'palm');
  });
  def('grandresort', function (g, rw, rh, lv) {
    g.poly(g.faceT(0, 0, rw, rh, 0), '#F3E0AE', false); var z = 44; g.box(.15, .15, rw - .3, 1.0, 0, z, '#FFFFFF'); g.box(.15, .15, 1.0, rh - .3, 0, z - 8, '#F7F3EA'); g.winsL(.15, .15, rw - .3, 1.0, 5, z - 3, 6, 3, { m: .2, col: '#A7DDF5' }); g.winsR(.15, .15, rw - .3, 1.0, 5, z - 3, 1, 3, { m: .2 }); g.winsL(.15, .15, 1.0, rh - .3, 5, z - 11, 1, 3, { m: .2 });
    g.hip(.15, .15, rw - .3, 1.0, z, z + 10, '#5BC6E8', .2); g.poly([g.P(1.4, 1.4, .3), g.P(rw - .3, 1.4, .3), g.P(rw - .3, rh - .3, .3), g.P(1.4, rh - .3, .3)], '#4FC3E8', INK); g.doorL(.15, .15, rw - .3, 1.0, .5, 0, .2, 12, '#6B3A22'); [[1.5, rh - .4], [rw - .4, 1.7], [rw - .4, rh - .4]].forEach(function (q) { g.tree(q[0], q[1], .75, 'palm'); }); sign(g, rw / 2, 1.18, z - 8, 20, '#D9693F', 'RESORT');
  });

  /* ═════════ CỬA HÀNG & NHÀ HÀNG ═════════ */
  function shop(g, rw, rh, o) {
    var x = .1, y = .1, w = rw - .2, h = rh - .2, z = o.z || 22; if (o.lot !== false) lot(g, rw, rh, o.lot || '#B9B3A6');
    g.box(x, y, w, h, 0, z, o.wall); g.winsL(x, y, w, h, 3, 12, Math.max(1, Math.round(w * 2)), 1, { m: .15, col: o.glass || '#BFE6F5' }); if (o.up) g.winsL(x, y, w, h, 13, z - 2, Math.max(1, Math.round(w * 1.6)), 1, { m: .25 }); g.winsR(x, y, w, h, 3, z - 2, Math.max(1, Math.round(h * 1.4)), 1, { m: .25 });
    g.awnL(x, y, w, h, .08, .92, 14, 3, .2, o.awn[0], o.awn[1]); g.doorL(x, y, w, h, .5, 0, .2, 9, o.door || '#2F4E74'); if (o.roof === 'hip') g.hip(x, y, w, h, z, z + 10, o.rc || '#B8485E', .25); else g.flat(x, y, w, h, z, o.rc || '#D9D3C4', '#fff');
    if (o.txt) sign(g, x + w / 2, y + h, z + 2, Math.min(18, 6 + w * 5), o.sc || '#E9573F', o.txt); if (o.extra) o.extra(g, rw, rh, z);
  }
  def('minimart', function (g, rw, rh, lv) { shop(g, rw, rh, { wall: '#F4F0E4', awn: ['#2E9E7F', '#fff'], txt: '24h', sc: '#2E9E7F', z: 20 }); });
  def('flowershop', function (g, rw, rh, lv) { shop(g, rw, rh, { wall: '#FBE3EC', awn: ['#E8618C', '#fff'], z: 20, extra: function (g, rw, rh) { var i; for (i = 0; i < 6; i++) { var p = g.P(.2 + i * .12, rh - .02, 2); g.line(p, [p[0], p[1] - 4], '#2E8A4F', 1.1); dot(g, p[0], p[1] - 6, 2.2, ['#FF6B8A', '#FFD84A', '#B77CFF', '#fff'][i % 4]); } } }); });
  def('pharmacy', function (g, rw, rh, lv) { shop(g, rw, rh, { wall: '#F2F7F2', awn: ['#2E9E5F', '#fff'], z: 24, roof: 'hip', rc: '#2E9E5F', extra: function (g, rw, rh, z) { var p = g.P(rw / 2, rh - .02, z + 14); g.c.fillStyle = '#2E9E5F'; g.c.fillRect(p[0] - 2.5, p[1] - 8, 5, 16); g.c.fillRect(p[0] - 8, p[1] - 2.5, 16, 5); } }); });
  def('noodleshop', function (g, rw, rh, lv) { shop(g, rw, rh, { wall: '#F5E0B8', awn: ['#B8485E', '#F2C21B'], roof: 'hip', rc: '#9A6A45', z: 22, txt: 'PHỞ', sc: '#B8485E', extra: function (g, rw, rh, z) { smoke(g, rw * .75, rh * .5, z + 8); var p = g.P(.3, rh + .1, 0); g.box(.2, rh - .02, .3, .22, 0, 5, '#C9863E'); } }); });
  def('restaurant', function (g, rw, rh, lv) { shop(g, rw, rh, { wall: '#F6E8D2', awn: ['#7A4BC7', '#fff'], up: 1, z: 30, txt: 'FOOD', sc: '#7A4BC7', extra: function (g, rw, rh) { [[.35, rh + .2], [.9, rh + .2], [1.5, rh + .2]].forEach(function (q) { var p = g.P(q[0], q[1], 4); g.ell(p[0], p[1], 5, 2.4, '#fff', INK); g.line([p[0], p[1]], [p[0], p[1] + 5], '#8A5A33', 1.4); }); } }); });
  def('boutique', function (g, rw, rh, lv) { shop(g, rw, rh, { wall: '#EFE4F6', awn: ['#B8485E', '#fff'], z: 24, roof: 'hip', rc: '#8A6BB8', txt: 'MODE', sc: '#8A6BB8' }); });
  def('supermarket', function (g, rw, rh, lv) { shop(g, rw, rh, { wall: '#F4F6F9', awn: ['#E9573F', '#fff'], z: 26, glass: '#CFEAF7', txt: 'MARKET', sc: '#E9573F', lot: '#A8B0BA', extra: function (g, rw, rh, z) { [[.3, rh + .25], [.7, rh + .25]].forEach(function (q) { g.box(q[0], q[1], .08, .04, 0, 3, '#B8C0CC'); }); g.box(.15, rh - .02, rw - .3, .02, 0, 1, 'rgba(255,255,255,.6)'); } }); });
  def('petrolstation', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#8E96A3'); g.box(.12, .12, rw * .42, rh - .24, 0, 16, '#F4F0E4'); g.winsL(.12, .12, rw * .42, rh - .24, 3, 13, 2, 1, { m: .2 }); g.flat(.12, .12, rw * .42, rh - .24, 16, '#E9573F', '#fff'); var cz = 32, cx = rw * .58;
    g.box(cx - .05, .2, rw * .4, rh - .5, cz, cz + 4, '#E9573F'); [[cx + .12, rh * .35], [cx + rw * .4 - .25, rh * .35], [cx + .12, rh * .65], [cx + rw * .4 - .25, rh * .65]].forEach(function (q) { var a = g.P(q[0], q[1], 0), b = g.P(q[0], q[1], cz); g.line(a, b, '#CFD6DE', 2); }); [[cx + .3, rh * .5]].forEach(function (q) { g.box(q[0], q[1] - .12, .14, .22, 0, 10, '#2F4E74'); g.box(q[0] + .4, q[1] - .12, .14, .22, 0, 10, '#2F4E74'); }); sign(g, cx + .2, rh * .5, cz + 12, 12, '#2F4E74', 'GAS');
  });
  def('nightmarket', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#6F7683'); var i, cols = ['#E9573F', '#F2C21B', '#4F80BA', '#2E9E7F', '#B8485E', '#F29A2E'];
    for (i = 0; i < 6; i++) { var x = .15 + (i % 3) * (rw - .3) / 3, y = .2 + Math.floor(i / 3) * (rh - .4) / 2, w = (rw - .3) / 3 - .08; g.box(x, y + .1, w, .3, 0, 8, '#8A5A33'); g.hip(x - .03, y, w + .06, .5, 12, 22, cols[i], .2); g.line(g.P(x, y + .1, 12), g.P(x, y + .1, 0), '#6B4A2E', 1.2); g.line(g.P(x + w, y + .1, 12), g.P(x + w, y + .1, 0), '#6B4A2E', 1.2); var p = g.P(x + w / 2, y + .55, 18); g.ell(p[0], p[1], 3.2, 3.8, '#FFD54A', INK); g.glow.push({ c: p, r: 9 }); }
    var t = g.P(rw / 2, rh / 2, 34); g.line(g.P(.1, rh / 2, 30), g.P(rw - .1, rh / 2, 30), '#6B4A2E', 1); for (i = 0; i < 6; i++) { var q = g.P(.25 + i * (rw - .5) / 5, rh / 2, 28); g.ell(q[0], q[1] + 3, 2.6, 3.2, i % 2 ? '#FF6B6B' : '#FFD54A', INK); g.glow.push({ c: [q[0], q[1] + 3], r: 8 }); }
  });
  def('coffeehouse', function (g, rw, rh, lv) { shop(g, rw, rh, { wall: '#EAD9C2', awn: ['#6B4A2E', '#F4EEE0'], up: 1, z: 26, roof: 'hip', rc: '#6B4A2E', txt: 'CAFE', sc: '#6B4A2E', extra: function (g, rw, rh) { [[.4, rh + .22], [1.1, rh + .22]].forEach(function (q) { var p = g.P(q[0], q[1], 4); g.ell(p[0], p[1], 5, 2.4, '#F4EEE0', INK); }); } }); });
  def('department', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); var z = 56; g.box(.1, .1, rw - .2, rh - .3, 0, z, '#F2E8D9'); g.winsL(.1, .1, rw - .2, rh - .3, 16, z - 4, 6, 3, { m: .22 }); g.winsR(.1, .1, rw - .2, rh - .3, 16, z - 4, 4, 3, { m: .22 }); g.glassL(.1, .1, rw - .2, rh - .3, 3, 14, 1, '#9FD8F5'); g.flat(.1, .1, rw - .2, rh - .3, z, '#D9CFB8', '#fff');
    g.box(rw * .36, rh * .3, rw * .28, .5, z, z + 14, '#E4DACA'); g.doorL(.1, .1, rw - .2, rh - .3, .5, 0, .24, 12, '#2F4E74'); g.awnL(.1, .1, rw - .2, rh - .3, .2, .8, 15, 4, .3, '#B8485E', '#F2C21B'); sign(g, rw / 2, rh - .25, z - 4, 24, '#B8485E', 'DEPT STORE');
  });
  def('cinema2', function (g, rw, rh, lv) { shop(g, rw, rh, { wall: '#8A6BB8', awn: ['#E9573F', '#F2C21B'], z: 30, glass: '#7FC0E8', txt: 'CINEMA', sc: '#E9573F', up: 0 }); });

  /* ═════════ DỊCH VỤ CÔNG ═════════ */
  def('postoffice', function (g, rw, rh, lv) { shop(g, rw, rh, { wall: '#F2E6CE', awn: ['#2F5DA8', '#F2C21B'], z: 26, roof: 'hip', rc: '#2F5DA8', txt: 'POST', sc: '#2F5DA8', lot: '#A8D88E', extra: function (g, rw, rh) { g.box(rw - .3, rh - .05, .14, .14, 0, 9, '#E9573F'); } }); });
  def('hospital', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); var z = 46; g.box(.12, .12, rw - .24, rh - .24, 0, z, '#F4F7FA'); g.box(rw * .35, .05, rw * .3, rh - .1, 0, z + 14, '#EAF0F6'); g.winsL(.12, .12, rw - .24, rh - .24, 5, z - 3, 5, 3, { m: .22 }); g.winsR(.12, .12, rw - .24, rh - .24, 5, z - 3, 4, 3, { m: .22 }); g.flat(.12, .12, rw - .24, rh - .24, z, '#D5DEE8', '#fff'); g.flat(rw * .35, .05, rw * .3, rh - .1, z + 14, '#C9D4E0', '#fff');
    var p = g.P(rw / 2, rh - .05, z + 6); g.c.fillStyle = '#E9573F'; g.c.fillRect(p[0] - 3, p[1] - 11, 6, 22); g.c.fillRect(p[0] - 11, p[1] - 3, 22, 6); g.doorL(.12, .12, rw - .24, rh - .24, .5, 0, .26, 12, '#2F8FD8'); g.box(rw * .8, rh * .3, .5, .4, z, z + 4, '#FFE066'); g.tree(.2, rh - .1, .6); g.tree(rw - .2, rh - .1, .6, 'cherry');
  });
  def('cityhall', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#A8D88E'); var z = 40; g.box(.15, .2, rw - .3, rh - .5, 0, z, '#F2EBDC'); g.winsL(.15, .2, rw - .3, rh - .5, 6, z - 4, 5, 2, { m: .22 }); g.winsR(.15, .2, rw - .3, rh - .5, 6, z - 4, 3, 2, { m: .22 }); g.flat(.15, .2, rw - .3, rh - .5, z, '#D9CFB8', '#fff'); var k; for (k = 0; k < 5; k++) g.cyl(.4 + k * (rw - 1) / 4, rh - .25, .09, 0, 30, '#FBF6EA'); g.box(.3, rh - .35, rw - .6, .16, 30, 36, '#E8DFCB');
    g.cyl(rw / 2, rh * .35, .5, z, z + 14, '#F2EBDC'); var p = g.P(rw / 2, rh * .35, z + 14); g.ell(p[0], p[1] - 4, 16, 11, '#4F80BA', INK); g.ell(p[0] - 5, p[1] - 8, 5, 3, 'rgba(255,255,255,.4)'); g.line([p[0], p[1] - 14], [p[0], p[1] - 34], '#6B7686', 1.4); g.poly([[p[0], p[1] - 34], [p[0] + 12, p[1] - 31], [p[0], p[1] - 27]], '#E9573F', false); g.doorL(.15, .2, rw - .3, rh - .5, .5, 0, .22, 13, '#4A2E18');
  });
  def('courthouse', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); var z = 34; g.box(.15, .25, rw - .3, rh - .55, 0, z, '#EDE6D6'); var k; for (k = 0; k < 4; k++) g.cyl(.35 + k * (rw - .9) / 3, rh - .25, .09, 0, 30, '#FBF6EA'); g.poly([g.P(.15, rh - .25, z - 2), g.P(rw - .15, rh - .25, z - 2), g.P(rw / 2, rh - .25, z + 16)], '#E2DACA', INK); g.flat(.15, .25, rw - .3, rh - .55, z, '#CFC6B2', '#fff'); g.winsL(.15, .25, rw - .3, rh - .55, 6, 28, 4, 1, { m: .25 }); g.doorL(.15, .25, rw - .3, rh - .55, .5, 0, .2, 12, '#4A2E18');
    var p = g.P(rw / 2, .5, z); g.line([p[0], p[1]], [p[0], p[1] - 14], '#8A94A4', 1.6); g.line([p[0] - 8, p[1] - 12], [p[0] + 8, p[1] - 12], '#C9A96A', 1.6);
  });
  def('railstation', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#9AA2AE'); var z = 30; g.box(.1, .15, rw - .2, rh * .5, 0, z, '#E9DCC0'); g.winsL(.1, .15, rw - .2, rh * .5, 5, z - 4, 6, 2, { m: .2 }); g.winsR(.1, .15, rw - .2, rh * .5, 5, z - 4, 2, 2, { m: .2 }); g.hip(.05, .1, rw - .1, rh * .5 + .1, z, z + 14, '#7A5A48', .15); var cp = g.P(rw / 2, rh * .15 + rh * .5, z + 10); g.ell(cp[0], cp[1], 9, 9, '#fff', INK); g.line([cp[0], cp[1]], [cp[0], cp[1] - 6], '#333', 1.2); g.line([cp[0], cp[1]], [cp[0] + 4, cp[1]], '#333', 1.2);
    g.doorL(.1, .15, rw - .2, rh * .5, .5, 0, .24, 13, '#4A2E18'); g.box(.1, rh * .72, rw - .2, rh * .22, 0, 2, '#6B7280'); g.line(g.P(.1, rh * .78, 3), g.P(rw - .1, rh * .78, 3), '#C9CED6', 1.4); g.line(g.P(.1, rh * .88, 3), g.P(rw - .1, rh * .88, 3), '#C9CED6', 1.4); g.box(.3, rh * .7, rw - .6, .1, 14, 17, '#B8C0CC');
  });
  def('busdepot', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#8E96A3'); g.box(.1, .1, rw * .5, rh - .2, 0, 20, '#F4F0E4'); g.winsL(.1, .1, rw * .5, rh - .2, 4, 17, 3, 1, { m: .2 }); g.flat(.1, .1, rw * .5, rh - .2, 20, '#2F4E74', '#fff'); g.box(rw * .55, .2, rw * .4, rh - .4, 20, 24, '#2F4E74'); [.6, .9].forEach(function (u) { var a = g.P(rw * u, .3, 0), b = g.P(rw * u, .3, 20); g.line(a, b, '#CFD6DE', 2); var a2 = g.P(rw * u, rh - .3, 0), b2 = g.P(rw * u, rh - .3, 20); g.line(a2, b2, '#CFD6DE', 2); }); g.box(rw * .62, rh * .4, .9, .38, 3, 15, '#F2C21B'); g.winsL(rw * .62, rh * .4, .9, .38, 6, 13, 3, 1, { m: .15 }); sign(g, rw * .3, rh - .1, 24, 12, '#2F4E74', 'BUS');
  });
  def('metroentry', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#9AA2AE'); g.box(.2, .25, rw - .4, rh - .5, 0, 16, '#BFE6F5'); g.glassL(.2, .25, rw - .4, rh - .5, 2, 14, 1, '#8FD0F0'); g.glassR(.2, .25, rw - .4, rh - .5, 2, 14, 1, '#6FB8E0'); g.flat(.2, .25, rw - .4, rh - .5, 16, '#4A5468', '#2F3640'); var p = g.P(rw / 2, rh * .5, 16); g.line(p, [p[0], p[1] - 24], '#6B7686', 1.8); g.ell(p[0], p[1] - 28, 8, 8, '#E9573F', INK); g.c.fillStyle = '#fff'; g.c.font = 'bold 10px sans-serif'; g.c.textAlign = 'center'; g.c.fillText('M', p[0], p[1] - 24.5); g.doorL(.2, .25, rw - .4, rh - .5, .5, 0, .5, 10, '#2F3640');
  });
  def('recyclecenter', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#9AA2AE'); g.box(.1, .15, rw - .2, rh - .5, 0, 22, '#7FBF73'); g.hip(.05, .1, rw - .1, rh - .4, 22, 32, '#4F8A47', .15); g.doorL(.1, .15, rw - .2, rh - .5, .5, 0, .4, 14, '#2F5D2A'); [['#2E86DE', .2], ['#F2C21B', .55], ['#E9573F', .9]].forEach(function (q) { g.box(q[1], rh - .3, .3, .22, 0, 9, q[0]); }); var p = g.P(rw / 2, rh - .3, 26); g.c.fillStyle = '#fff'; g.c.font = 'bold 14px sans-serif'; g.c.textAlign = 'center'; g.c.fillText('♻', p[0], p[1]);
  });
  def('waterplant', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#9AA2AE'); g.box(.1, .1, rw * .5, rh - .2, 0, 20, '#DCE8F2'); g.glassL(.1, .1, rw * .5, rh - .2, 3, 17, 1, '#8FD0F0'); g.flat(.1, .1, rw * .5, rh - .2, 20, '#B8C3D2', '#fff'); g.cyl(rw * .75, rh * .3, .3, 0, 26, '#CFE3F2', '#E4F0FA'); g.cyl(rw * .75, rh * .7, .3, 0, 26, '#CFE3F2', '#E4F0FA'); g.poly([g.P(rw * .52, rh * .15, .4), g.P(rw - .05, rh * .15, .4), g.P(rw - .05, rh * .85, .4), g.P(rw * .52, rh * .85, .4)], 'rgba(79,195,232,.5)', false); var w = g.P(rw * .75, rh * .5, 30); g.meta.water.push([w[0], w[1] + 22]);
  });
  def('solarfarm', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#A8D88E'); var i, j; for (j = 0; j < 3; j++) for (i = 0; i < 3; i++) { var x = .15 + i * (rw - .3) / 3, y = .2 + j * (rh - .4) / 3, w = (rw - .3) / 3 - .08, h = (rh - .4) / 3 - .1; g.poly([g.P(x, y + h, 2), g.P(x + w, y + h, 2), g.P(x + w, y, 12), g.P(x, y, 12)], '#2F5DA8', INK); g.line(g.P(x + w * .5, y + h, 2), g.P(x + w * .5, y, 12), 'rgba(255,255,255,.45)', .9); g.line(g.P(x, y + h * .5, 7), g.P(x + w, y + h * .5, 7), 'rgba(255,255,255,.45)', .9); }
  });
  def('windturbines', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#A8D88E'); [[.3, .4], [.75, .75]].forEach(function (q, n) { var cx = rw * q[0], cy = rh * q[1], p = g.P(cx, cy, 0); g.ell(p[0], p[1] + 2, 7, 3, 'rgba(30,60,30,.22)'); g.poly([[p[0] - 3, p[1]], [p[0] + 3, p[1]], [p[0] + 1.4, p[1] - 56], [p[0] - 1.4, p[1] - 56]], '#F4F6FA', INK); var t = g.P(cx, cy, 56); g.ell(t[0], t[1], 3, 3, '#E4E8EE', INK); g.meta.rot.push([t[0], t[1], 'turbine', 22 + n * 2, n]); });
  });
  def('commcenter', function (g, rw, rh, lv) { shop(g, rw, rh, { wall: '#F6E7C8', awn: ['#F29A2E', '#fff'], up: 1, z: 32, roof: 'hip', rc: '#E58A3C', txt: 'CENTER', sc: '#F29A2E', lot: '#A8D88E' }); });
  def('tvtower', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); g.box(.25, .25, rw - .5, rh - .5, 0, 16, '#E8EDF2'); var p = g.P(rw / 2, rh / 2, 16), p2 = g.P(rw / 2, rh / 2, 190); g.poly([[p[0] - 12, p[1]], [p[0] + 12, p[1]], [p2[0] + 2.4, p2[1]], [p2[0] - 2.4, p2[1]]], '#DDE6F0', INK); [60, 110].forEach(function (zz) { var q = g.P(rw / 2, rh / 2, zz); g.ell(q[0], q[1], 10, 4, '#B9C6D8', INK); g.ell(q[0], q[1] - 3, 7, 2.6, '#6FB5E3'); }); var d = g.P(rw / 2, rh / 2, 150); g.ell(d[0], d[1], 17, 6, '#B9C6D8', INK); g.ell(d[0], d[1] - 4, 17, 6, '#DDE6F0', INK); g.ell(d[0], d[1] - 8, 11, 4, '#6FB5E3'); g.line(p2, g.P(rw / 2, rh / 2, 250), '#E9573F', 1.8); beacon(g, rw / 2, rh / 2, 250);
  });

  /* ═════════ VUI CHƠI · HỌC ĐƯỜNG · CÔNG NGHIỆP · QUỐC TẾ ═════════ */
  def('bowling', function (g, rw, rh, lv) { shop(g, rw, rh, { wall: '#3A4A8C', awn: ['#F2C21B', '#E9573F'], z: 26, txt: 'BOWL', sc: '#F2C21B', glass: '#9FB8F5', extra: function (g, rw, rh, z) { var p = g.P(rw / 2, rh * .5, z); for (var k = 0; k < 3; k++) g.poly([[p[0] - 4 + k * 4, p[1] - 3], [p[0] - 1 + k * 4, p[1] - 3], [p[0] + k * 4 - 2.5, p[1] - 14]], '#fff', INK); } }); });
  def('hauntedhouse', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#6D7A5E'); g.box(.2, .25, rw - .4, rh - .5, 0, 30, '#7A6A8A'); g.hip(.15, .2, rw - .3, rh - .4, 30, 52, '#3A2E48', .3); g.box(.25, .3, .4, .4, 30, 56, '#6A5A7A'); g.hip(.2, .25, .5, .5, 56, 72, '#2E2440', .4); g.winsL(.2, .25, rw - .4, rh - .5, 6, 26, 3, 1, { m: .22, col: '#FFD54A' }); g.winsR(.2, .25, rw - .4, rh - .5, 6, 26, 2, 1, { m: .22, col: '#FFD54A' }); g.doorL(.2, .25, rw - .4, rh - .5, .5, 0, .2, 11, '#2A1F33'); var p = g.P(rw * .8, rh * .7, 0); g.line(p, [p[0], p[1] - 12], '#4A3A52', 2); g.ell(p[0], p[1] - 14, 4, 4, '#F6F1FF', INK);
  });
  def('skaterink', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); g.poly(g.faceT(.1, .1, rw - .2, rh - .2, 1), '#8A93A0', INK); [[.25, .3, .7, .5, 10], [rw - 1.1, rh - .85, .8, .55, 8]].forEach(function (q) { g.poly([g.P(q[0], q[1] + q[3], 1), g.P(q[0] + q[2], q[1] + q[3], 1), g.P(q[0] + q[2], q[1], q[4]), g.P(q[0], q[1], q[4])], '#C9CED6', INK); }); g.box(rw * .45, rh * .45, .5, .2, 1, 6, '#E9573F'); var p = g.P(rw * .55, rh * .35, 8); g.ell(p[0], p[1], 3, 3, '#F2C98A'); g.line([p[0], p[1] + 2], [p[0], p[1] + 9], '#2F80ED', 2);
  });
  def('karaoke', function (g, rw, rh, lv) { shop(g, rw, rh, { wall: '#4A2E6B', awn: ['#FF4FA3', '#fff'], z: 28, glass: '#C9A8F2', txt: 'KARAOKE', sc: '#FF4FA3', extra: function (g, rw, rh, z) { var p = g.P(rw / 2, rh * .5, z + 6); g.c.fillStyle = '#FFD54A'; g.c.font = 'bold 12px sans-serif'; g.c.textAlign = 'center'; g.c.fillText('♪', p[0] - 5, p[1]); g.c.fillText('♫', p[0] + 6, p[1] - 4); } }); });
  def('languagecenter', function (g, rw, rh, lv) { shop(g, rw, rh, { wall: '#FDF3DC', awn: ['#2F80ED', '#fff'], up: 1, z: 32, roof: 'hip', rc: '#2F80ED', txt: 'ABC', sc: '#2F80ED', lot: '#A8D88E', extra: function (g, rw, rh) { g.tree(rw - .15, rh - .1, .55, 'cherry'); } }); });
  def('techlab', function (g, rw, rh, lv) { tower(g, rw, rh, { wall: '#E4ECF4', tiers: [[0, H(lv, 50, 70)]], g1: '#8FE0D0', g2: '#5FC4B2', floor: 14, crown: 'dome', cc: '#9FDBF5', lot: '#B9B3A6' }); });
  def('artschool', function (g, rw, rh, lv) { shop(g, rw, rh, { wall: '#FFF1E0', awn: ['#E9573F', '#F2C21B'], up: 1, z: 30, roof: 'hip', rc: '#B8485E', txt: 'ART', sc: '#B8485E', lot: '#A8D88E' }); });
  def('datacenter', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#8E96A3'); var z = 34; g.box(.1, .1, rw - .2, rh - .2, 0, z, '#3F4A5C'); var j; for (j = 0; j < 4; j++) { g.quadL(.1, .1, rw - .2, rh - .2, .08, .92, 6 + j * 7, 9 + j * 7, '#5CE0FF'); g.glow.push([g.pl(.1, .1, rw - .2, rh - .2, .1, 7 + j * 7), g.pl(.1, .1, rw - .2, rh - .2, .9, 7 + j * 7), g.pl(.1, .1, rw - .2, rh - .2, .9, 10 + j * 7), g.pl(.1, .1, rw - .2, rh - .2, .1, 10 + j * 7)]); } g.flat(.1, .1, rw - .2, rh - .2, z, '#2F3A4A', '#6B7686'); [.3, .55, .8].forEach(function (u) { g.box(rw * u - .2, rh * .4, .4, .35, z, z + 8, '#9FAABA'); }); g.doorL(.1, .1, rw - .2, rh - .2, .5, 0, .24, 10, '#1F2733');
  });
  def('textilemill', function (g, rw, rh, lv) { lot(g, rw, rh, '#9AA2AE'); g.box(.1, .15, rw - .2, rh - .3, 0, 22, '#C9785B'); [0, 1, 2].forEach(function (k) { g.gable(.1 + k * (rw - .2) / 3, .15, (rw - .2) / 3, rh - .3, 22, 34, false, '#6B7686', { wall: '#C9785B' }); }); g.winsL(.1, .15, rw - .2, rh - .3, 5, 18, 5, 1, { m: .2 }); g.cyl(rw - .3, .3, .16, 0, 54, '#B25A3C', '#C9785B'); smoke(g, rw - .3, .3, 54); g.doorL(.1, .15, rw - .2, rh - .3, .4, 0, .3, 12, '#4A2E18'); });
  def('brewery', function (g, rw, rh, lv) { lot(g, rw, rh, '#9AA2AE'); g.box(.1, .15, rw - .2, rh - .3, 0, 20, '#E8D8B0'); g.hip(.05, .1, rw - .1, rh - .2, 20, 30, '#8A5A33', .2); [[.35, .35], [.7, .6]].forEach(function (q) { g.cyl(rw * q[0] + .3, rh * q[1], .24, 0, 38, '#C9863E', '#E8B060'); }); g.cyl(.4, .3, .18, 20, 54, '#8A8F99', '#B8BDC8'); smoke(g, .4, .3, 54); g.doorL(.1, .15, rw - .2, rh - .3, .5, 0, .24, 11, '#4A2E18'); });
  def('cementplant', function (g, rw, rh, lv) { lot(g, rw, rh, '#A8A397'); g.cyl(rw * .3, rh * .35, .32, 0, 52, '#CFCFCF', '#E4E4E4'); g.cyl(rw * .65, rh * .35, .32, 0, 52, '#CFCFCF', '#E4E4E4'); g.box(.2, rh * .6, rw - .4, rh * .3, 0, 16, '#8E96A3'); g.line(g.P(rw * .3, rh * .35, 50), g.P(rw * .5, rh * .72, 18), '#6B7686', 2.4); g.cyl(rw * .85, rh * .75, .12, 0, 48, '#8A8F99', '#B8BDC8'); smoke(g, rw * .85, rh * .75, 48); });
  def('refinery', function (g, rw, rh, lv) { lot(g, rw, rh, '#9A9F94'); [[.2, .25, 62], [.4, .2, 74], [.6, .3, 56]].forEach(function (q) { g.cyl(rw * q[0] + .1, rh * q[1] + .2, .16, 0, q[2], '#D4D8DE', '#EEF1F4'); [14, 30, 46].forEach(function (zz) { if (zz < q[2]) { var p = g.P(rw * q[0] + .1, rh * q[1] + .2, zz); g.line([p[0] - 6, p[1]], [p[0] + 6, p[1]], '#8A94A4', 1.2); } }); }); g.cyl(rw * .3, rh * .7, .34, 0, 14, '#CFD6DE', '#E4E8EE'); g.cyl(rw * .65, rh * .72, .3, 0, 14, '#CFD6DE', '#E4E8EE'); var f = g.P(rw * .85, rh * .15, 76); g.line(g.P(rw * .85, rh * .15, 0), f, '#6B7686', 2); g.ell(f[0], f[1] - 5, 3, 6, '#FF8A1F'); g.glow.push({ c: [f[0], f[1] - 5], r: 12 }); smoke(g, rw * .4, rh * .25, 74); });
  def('castle', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#8ED067'); g.box(.2, .3, rw - .4, rh - .6, 0, 40, '#C9C4B8'); var k; for (k = 0; k < 7; k++) g.box(.22 + k * (rw - .56) / 6, rh - .35, .16, .1, 40, 46, '#B8B2A6'); [[.1, .15], [rw - .5, .15], [.1, rh - .55], [rw - .5, rh - .55]].forEach(function (q) { g.cyl(q[0] + .2, q[1] + .2, .24, 0, 58, '#D4CFC4', '#E4DFD4'); g.hip(q[0], q[1], .4, .4, 58, 78, '#B8485E', .5); }); g.box(rw * .4, rh * .4, rw * .2, .6, 40, 74, '#CFCABD'); g.hip(rw * .4, rh * .4, rw * .2, .6, 74, 96, '#4F80BA', .45); g.doorL(.2, .3, rw - .4, rh - .6, .5, 0, .3, 18, '#4A2E18'); var p = g.P(rw / 2, rh * .55, 96); g.line(p, [p[0], p[1] - 16], '#6B7686', 1.4); g.poly([[p[0], p[1] - 16], [p[0] + 11, p[1] - 13], [p[0], p[1] - 9]], '#E9573F', false);
  });
  def('colosseum', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#E8D9A8'); g.cyl(rw / 2, rh / 2, Math.min(rw, rh) * .46, 0, 36, '#E3CFA2', '#C9A96A'); var p = g.P(rw / 2, rh / 2, 36), rx = Math.min(rw, rh) * .46 * 40, ry = rx * .5; g.ell(p[0], p[1], rx * .72, ry * .72, '#C9A06A', INK); g.ell(p[0], p[1] + 2, rx * .5, ry * .5, '#E8D9A8'); var i; for (i = 0; i < 12; i++) { var a = i * TAU / 12 + .26; g.poly([[p[0] + Math.cos(a) * rx * .96 - 2.4, p[1] + 22 + Math.sin(a) * ry * .96], [p[0] + Math.cos(a) * rx * .96 + 2.4, p[1] + 22 + Math.sin(a) * ry * .96], [p[0] + Math.cos(a) * rx * .96 + 2.4, p[1] + 12 + Math.sin(a) * ry * .96], [p[0] + Math.cos(a) * rx * .96 - 2.4, p[1] + 12 + Math.sin(a) * ry * .96]], '#8A6A3A', false); }
  });
  def('sphinx', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#E8D9A8'); g.box(.15, .25, rw - .3, rh - .5, 0, 16, '#D9BB77'); g.box(.15, .3, .5, rh - .6, 16, 30, '#D9BB77'); var p = g.P(.4, rh / 2, 30); g.ell(p[0], p[1] - 8, 10, 12, '#E2C98A', INK); g.poly([[p[0] - 12, p[1] - 14], [p[0] - 4, p[1] - 26], [p[0] + 4, p[1] - 26], [p[0] + 12, p[1] - 14], [p[0] + 9, p[1] + 2], [p[0] - 9, p[1] + 2]], '#3E6FB8', INK); g.ell(p[0], p[1] - 8, 7, 9, '#E8D2A0'); dot(g, p[0] - 2.4, p[1] - 10, .9, '#333'); dot(g, p[0] + 2.4, p[1] - 10, .9, '#333'); g.box(rw - .55, .35, .4, rh - .7, 16, 22, '#C9A96A');
  });
  def('stonehenge', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#A8D88E'); var i; for (i = 0; i < 8; i++) { var a = i * TAU / 8, cx = rw / 2 + Math.cos(a) * rw * .34, cy = rh / 2 + Math.sin(a) * rh * .34; g.box(cx - .1, cy - .08, .2, .16, 0, 26 + (i % 3) * 3, '#9A9EA6'); if (i % 2 === 0) { var b = i * TAU / 8 + TAU / 16, nx = rw / 2 + Math.cos(a + TAU / 8) * rw * .34, ny = rh / 2 + Math.sin(a + TAU / 8) * rh * .34; g.box(Math.min(cx, nx) - .1, Math.min(cy, ny) - .08, Math.abs(nx - cx) + .2, Math.abs(ny - cy) + .16, 26, 32, '#8A8E96'); } }
  });
  def('moai', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#A8D88E'); [[.3, .5, 1], [.7, .45, .85]].forEach(function (q) { var p = g.P(rw * q[0], rh * q[1], 0), s = q[2]; g.ell(p[0], p[1] + 2, 8 * s, 3.4 * s, 'rgba(30,60,30,.22)'); g.poly([[p[0] - 6 * s, p[1]], [p[0] + 6 * s, p[1]], [p[0] + 7 * s, p[1] - 22 * s], [p[0] + 9 * s, p[1] - 34 * s], [p[0] - 9 * s, p[1] - 34 * s], [p[0] - 7 * s, p[1] - 22 * s]], '#8F8C84', INK); g.poly([[p[0] - 6 * s, p[1] - 24 * s], [p[0] + 6 * s, p[1] - 24 * s], [p[0] + 3 * s, p[1] - 22 * s], [p[0] - 3 * s, p[1] - 22 * s]], '#6F6C66', false); g.ell(p[0], p[1] - 32 * s, 9 * s, 3 * s, '#9D9A92', INK); });
  });
  /* ═════════ ĐỢT CAO TẦNG: tháp ở, trụ sở công ty, nhà máy ống khói, tháp công nghiệp… (cao 400–900 px) ═════════ */
  var stripes = function (g, cx, cy, z0, z1, r, c1, c2) { var n = Math.max(2, Math.round((z1 - z0) / 24)), i; for (i = 0; i < n; i++) g.cyl(cx, cy, r, z0 + i * (z1 - z0) / n, z0 + (i + 1) * (z1 - z0) / n, i % 2 ? c1 : c2, shade(i % 2 ? c1 : c2, 1.12)); };
  def('towerblock', function (g, rw, rh, lv) { var z = H(lv, 250, 300); tower(g, rw, rh, { wall: '#E8D9C0', tiers: [[0, z]], style: 'win', floor: 15, crown: 'antenna', ant: 70, band: '#B8485E', base: 20, bcol: '#F3F0E8', g1: '#B8E0F2' }); });
  def('slimtower', function (g, rw, rh, lv) { var z = H(lv, 330, 400); tower(g, rw, rh, { m: .22, wall: '#F3C7D0', tiers: [[0, z]], g1: '#FFDDE6', g2: '#E9A8BA', floor: 12, crown: 'spire', ch: 24, ant: 80, cc: '#D98BA3', lot: '#B9B3A6', band: '#FFFFFF' }); });
  def('luxtower', function (g, rw, rh, lv) { var z = H(lv, 330, 400); tower(g, rw, rh, { wall: '#EFE6D2', tiers: [[0, z * .45], [.25, z * .75], [.55, z]], style: 'win', g1: '#F7E6B0', g2: '#E5CF86', floor: 14, crown: 'crown', cc: '#C9A44A', base: 16, bcol: '#D9C99A', band: '#C9A44A' }); });
  def('skygarden', function (g, rw, rh, lv) {
    var z = H(lv, 380, 440); tower(g, rw, rh, { wall: '#EEF1E6', tiers: [[0, z * .3], [.15, z * .5], [.3, z * .7], [.45, z * .86], [.62, z]], style: 'win', floor: 14, crown: 'flat', base: 12, bcol: '#DDE8D2', g1: '#C8EBD5',
      after: function (g, rw, rh, L) { [[.15, .3], [.3, .5], [.45, .7], [.6, .86]].forEach(function (q) { var zz = z * q[1] + 12, k; for (k = 0; k < 3; k++) { g.tree(rw * (.3 + k * .2), rh - .1 - q[0] * 1.3, .36, k % 2 ? 'cherry' : null, zz); } }); g.tree(rw * .5, rh * .5, .5, null, z + 12); }
    });
  });
  def('cloudtower', function (g, rw, rh, lv) { var z = H(lv, 480, 560); tower(g, rw, rh, { wall: '#C9D7E8', tiers: [[0, z * .35], [.18, z * .62], [.4, z * .85], [.7, z]], g1: '#9AD8F8', g2: '#62AEE0', floor: 12, crown: 'spire', ch: 30, ant: 110, cc: '#9FB2CC', base: 18, bcol: '#EDEFF2', band: '#FFFFFF' }); });
  def('hqtower', function (g, rw, rh, lv) { var z = H(lv, 280, 340); tower(g, rw, rh, { wall: '#3E4C63', tiers: [[0, z * .55], [.3, z]], g1: '#5C7FA8', g2: '#3E5F88', floor: 11, crown: 'helipad', base: 16, bcol: '#CFD6DE', band: '#9FB2CC' }); });
  def('techhq', function (g, rw, rh, lv) { var z = H(lv, 230, 280); tower(g, rw, rh, { wall: '#CFEFE6', tiers: [[0, z]], g1: '#8FE8D0', g2: '#5CC8B0', floor: 10, crown: 'ring', base: 14, bcol: '#EDEFF2', band: '#2F80ED' }); });
  def('bankskyscraper', function (g, rw, rh, lv) { var z = H(lv, 260, 320); tower(g, rw, rh, { wall: '#E4DCC8', tiers: [[0, z * .62], [.2, z]], style: 'win', g1: '#D9EAF5', floor: 16, crown: 'crown', cc: '#B8860B', base: 18, bcol: '#CFC4AE', band: '#B8860B' }); });
  def('mediatower', function (g, rw, rh, lv) {
    var z = H(lv, 300, 360); tower(g, rw, rh, { m: .2, wall: '#B9C6D8', tiers: [[0, z]], g1: '#8FD0F5', g2: '#5AA8DC', floor: 12, crown: 'antenna', ant: 150, base: 14, bcol: '#EDEFF2', after: function (g, rw, rh, L) { var p = g.P(rw / 2, rh / 2, z + 60); g.ell(p[0], p[1], 14, 5, '#E8EDF2', INK); g.ell(p[0], p[1] - 5, 14, 5, '#FFFFFF', INK); g.ell(p[0], p[1] - 9, 8, 3, '#E9573F'); } });
  });
  def('hotelskyline', function (g, rw, rh, lv) { var z = H(lv, 280, 340); tower(g, rw, rh, { wall: '#F3E3C3', tiers: [[0, z * .7], [.3, z]], style: 'win', g1: '#A7DDF5', floor: 14, crown: 'pyr', ch: 50, cc: '#B8485E', base: 22, bcol: '#B8485E', band: '#B8485E', after: function (g, rw, rh) { sign(g, rw / 2, rh - .1, 28, 22, '#B8485E', 'HOTEL'); } }); });
  def('shoptower', function (g, rw, rh, lv) { var z = H(lv, 200, 250); tower(g, rw, rh, { wall: '#F2E6F6', tiers: [[0, z]], g1: '#C9A8F2', g2: '#A88AD8', floor: 12, crown: 'flat', base: 30, bcol: '#F8F2FB', band: '#7A4BC7', after: function (g, rw, rh) { sign(g, rw / 2, rh - .1, 34, 22, '#7A4BC7', 'SHOP'); } }); });
  def('financecentre', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); g.box(.05, .05, rw - .1, rh - .1, 0, 22, '#EDEFF2'); var z = H(lv, 460, 520), a = (rw - 1.2) / 3;
    [[.4, z], [.4 + a + .15, z * .82], [.4 + (a + .15) * 2, z * .64]].forEach(function (q, n) { var x = q[0], zt = q[1]; g.box(x, .45, a, rh - .9, 22, zt, ['#9DB7D5', '#A9C1DC', '#B9CFE6'][n]); g.glassL(x, .45, a, rh - .9, 24, zt - 3, Math.round((zt - 24) / 13), '#74BDEA'); g.glassR(x, .45, a, rh - .9, 24, zt - 3, Math.round((zt - 24) / 13), '#4592CC'); g.hip(x, .45, a, rh - .9, zt, zt + 24, '#8FA3BD', .42); g.line(g.P(x + a / 2, rh / 2, zt + 24), g.P(x + a / 2, rh / 2, zt + 24 + 48), '#9AA4B2', 1.6); beacon(g, x + a / 2, rh / 2, zt + 72); });
    g.doorL(.05, .05, rw - .1, rh - .1, .5, 0, .2, 12, '#1F3A5F'); g.tree(.2, rh - .1, .7); g.tree(rw - .2, rh - .1, .7, 'cherry');
  });
  def('infinitytower', function (g, rw, rh, lv) { var z = H(lv, 560, 620); tower(g, rw, rh, { m: .2, wall: '#B3C6DC', tiers: [[0, z * .25], [.25, z * .45], [.5, z * .64], [.75, z * .82], [1.0, z]], g1: '#7AC4F0', g2: '#4896D0', floor: 11, crown: 'spire', ch: 30, ant: 140, cc: '#E2B33C', base: 20, bcol: '#E4E8EE', band: '#E2B33C' }); });
  def('hospitaltower', function (g, rw, rh, lv) { var z = H(lv, 150, 190); tower(g, rw, rh, { wall: '#F4F7FA', tiers: [[0, z]], style: 'win', g1: '#BFE6F5', floor: 15, crown: 'helipad', base: 22, bcol: '#EAF0F6', band: '#E9573F', after: function (g, rw, rh, L) { var p = g.P(rw / 2, rh - .1, z * .5); g.c.fillStyle = '#E9573F'; g.c.fillRect(p[0] - 3, p[1] - 11, 6, 22); g.c.fillRect(p[0] - 11, p[1] - 3, 22, 6); } }); });
  def('cityhalltower', function (g, rw, rh, lv) { var z = H(lv, 170, 210); tower(g, rw, rh, { wall: '#F2EBDC', tiers: [[0, z * .7], [.3, z]], style: 'win', floor: 16, crown: 'dome', cc: '#4F80BA', base: 20, bcol: '#E8DFCB', band: '#C9A96A', after: function (g, rw, rh, L) { var c = g.P(rw / 2, rh - .08, z * .8); g.ell(c[0], c[1], 7, 7, '#fff', INK); g.line([c[0], c[1]], [c[0], c[1] - 4], '#333', 1.2); g.line([c[0], c[1]], [c[0] + 3, c[1]], '#333', 1.2); } }); });
  def('uniskytower', function (g, rw, rh, lv) { var z = H(lv, 200, 250); tower(g, rw, rh, { wall: '#C9785B', tiers: [[0, z * .5], [.3, z]], style: 'win', g1: '#F2E6D0', floor: 15, crown: 'spire', ch: 30, cc: '#8A5A33', ant: 40, base: 20, bcol: '#B8664A', band: '#F2E6D0' }); });
  def('researchtower', function (g, rw, rh, lv) { var z = H(lv, 220, 270); tower(g, rw, rh, { wall: '#E4ECF4', tiers: [[0, z]], g1: '#8FE0D0', g2: '#5FC4B2', floor: 12, crown: 'dome', cc: '#9FDBF5', base: 16, bcol: '#EDEFF2', band: '#2FB36D' }); });
  def('smokestackfactory', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#9AA2AE'); g.box(.1, .3, rw - .2, rh - .45, 0, 28, '#C9785B'); [0, 1, 2].forEach(function (k) { g.gable(.1 + k * (rw - .2) / 3, .3, (rw - .2) / 3, rh - .45, 28, 42, false, '#6B7686', { wall: '#C9785B' }); }); g.winsL(.1, .3, rw - .2, rh - .45, 5, 24, 5, 1, { m: .2 }); g.doorL(.1, .3, rw - .2, rh - .45, .3, 0, .3, 12, '#4A2E18');
    [[.45, .2, 360], [.75, .15, 320]].forEach(function (q) { stripes(g, rw * q[0] + .1, rh * q[1] + .1, 0, q[2], .17, '#E9573F', '#F4F4F4'); smoke(g, rw * q[0] + .1, rh * q[1] + .1, q[2]); });
  });
  def('silotower', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B8B08A'); [[.3, .3, 300], [.7, .3, 340], [.3, .7, 380], [.7, .7, 320]].forEach(function (q) { g.cyl(rw * q[0], rh * q[1], .26, 0, q[2], '#D4D8DE', '#EEF1F4'); [60, 130, 200, 270].forEach(function (zz) { if (zz < q[2] - 10) { var p = g.P(rw * q[0], rh * q[1], zz); g.line([p[0] - 8, p[1]], [p[0] + 8, p[1]], '#9AA4B2', 1.1); } }); g.hip(rw * q[0] - .25, rh * q[1] - .25, .5, .5, q[2], q[2] + 14, '#9AA4B2', .5); });
    g.line(g.P(rw * .3, rh * .3, 290), g.P(rw * .7, rh * .7, 300), '#6B7686', 2.4);
  });
  def('coolingtowers', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#9AA2AE'); [[.28, .32, 1], [.7, .6, .85]].forEach(function (q, n) { var p = g.P(rw * q[0], rh * q[1], 0), s = q[2]; g.ell(p[0], p[1] + 2, 36 * s, 14 * s, 'rgba(30,40,50,.22)'); var c = g.c; c.beginPath(); c.moveTo(p[0] - 34 * s, p[1]); c.bezierCurveTo(p[0] - 22 * s, p[1] - 90 * s, p[0] - 20 * s, p[1] - 150 * s, p[0] - 30 * s, p[1] - 240 * s); c.lineTo(p[0] + 30 * s, p[1] - 240 * s); c.bezierCurveTo(p[0] + 20 * s, p[1] - 150 * s, p[0] + 22 * s, p[1] - 90 * s, p[0] + 34 * s, p[1]); c.closePath(); var gr = c.createLinearGradient(p[0] - 34 * s, 0, p[0] + 34 * s, 0); gr.addColorStop(0, '#C9CED6'); gr.addColorStop(.5, '#EEF1F4'); gr.addColorStop(1, '#AEB6C2'); c.fillStyle = gr; c.fill(); c.strokeStyle = INK; c.lineWidth = 1.1; c.stroke(); g.ext(p[0] - 36 * s, p[1] - 244 * s, 4); g.ext(p[0] + 36 * s, p[1] + 4, 4); g.ell(p[0], p[1] - 240 * s, 30 * s, 9 * s, '#8A94A4', INK); smoke(g, rw * q[0], rh * q[1], 240 * s); });
    stripes(g, rw * .5, rh * .15, 0, 400, .12, '#E9573F', '#F4F4F4'); smoke(g, rw * .5, rh * .15, 400); g.box(.2, rh * .7, .8, .5, 0, 18, '#8E96A3');
  });
  def('chemtower', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#A8A397'); var z = 420; g.cyl(rw * .4, rh * .5, .3, 0, z, '#CFD6DE', '#E4E8EE'); var i; for (i = 1; i < 6; i++) { var p = g.P(rw * .4, rh * .5, i * z / 6); g.ell(p[0], p[1], 15, 6, '#9AA4B2', INK); } g.cyl(rw * .75, rh * .35, .16, 0, 260, '#B8C3D2', '#D4DBE4'); g.cyl(rw * .75, rh * .7, .2, 0, 120, '#C9D1D9', '#E4E8EE'); g.line(g.P(rw * .4, rh * .5, 300), g.P(rw * .75, rh * .35, 240), '#6B7686', 2.2); g.line(g.P(rw * .4, rh * .5, 120), g.P(rw * .75, rh * .7, 100), '#6B7686', 2.2);
    var f = g.P(rw * .4, rh * .5, z); g.line([f[0], f[1]], [f[0], f[1] - 40], '#6B7686', 2); g.ell(f[0], f[1] - 46, 4, 8, '#FF8A1F'); g.ell(f[0], f[1] - 44, 2, 5, '#FFD54A'); g.glow.push({ c: [f[0], f[1] - 46], r: 14 }); smoke(g, rw * .4, rh * .5, z + 10);
  });
  def('skyfactory', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#9AA2AE'); var z = H(lv, 150, 190); g.box(.1, .1, rw - .2, rh - .2, 0, z, '#B8664A'); g.winsL(.1, .1, rw - .2, rh - .2, 10, z - 4, 6, Math.round(z / 16), { m: .2, col: '#FFE9A8' }); g.winsR(.1, .1, rw - .2, rh - .2, 10, z - 4, 5, Math.round(z / 16), { m: .2, col: '#FFE9A8' }); g.flat(.1, .1, rw - .2, rh - .2, z, '#8E96A3', '#E2E8F0'); g.doorL(.1, .1, rw - .2, rh - .2, .5, 0, .3, 12, '#2F3640');
    [[.3, .3], [.65, .55]].forEach(function (q) { g.cyl(rw * q[0], rh * q[1], .3, z, z + 30, '#C9D1D9', '#E4E8EE'); }); [[.8, .2, 230], [.15, .75, 200]].forEach(function (q) { stripes(g, rw * q[0], rh * q[1], z, z + q[2], .15, '#E9573F', '#F4F4F4'); smoke(g, rw * q[0], rh * q[1], z + q[2]); });
  });
  def('rocketlab', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); var z = 560, cx = rw * .62, cy = rh * .5; g.box(.2, .3, .9, rh - .6, 0, 30, '#E4E8EE'); g.glassL(.2, .3, .9, rh - .6, 4, 27, 1, '#8FD0F0'); var p = g.P(cx, cy, 0), q = g.P(cx, cy, z); [-9, 9].forEach(function (d) { g.line([p[0] + d * 1.6, p[1] + 3], [q[0] + d * .4, q[1]], '#8A94A4', 2.4); }); var j; for (j = 1; j < 14; j++) { var a = g.P(cx, cy, j * z / 14); g.line([a[0] - 8, a[1]], [a[0] + 8, a[1]], '#8A94A4', 1.2); g.line([a[0] - 8, a[1]], [a[0] + 8, a[1] - z / 14], '#8A94A4', 1); }
    var rx = rw * .38; g.cyl(rx + .7, cy, .22, 0, 420, '#F4F6FA', '#FFFFFF'); var t = g.P(rx + .7, cy, 420); g.poly([[t[0] - 11, t[1]], [t[0] + 11, t[1]], [t[0], t[1] - 54]], '#E9573F', INK); [-1, 1].forEach(function (d) { var b = g.P(rx + .7, cy, 0); g.poly([[b[0] + d * 10, b[1] - 40], [b[0] + d * 26, b[1] + 2], [b[0] + d * 10, b[1] - 8]], '#E9573F', INK); }); g.ell(g.P(rx + .7, cy, 280)[0], g.P(rx + .7, cy, 280)[1], 4, 4, '#4FA8E8'); beacon(g, cx, cy, z + 6);
  });
  def('droptower', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); var z = 440, p = g.P(.5, .5, 0), q = g.P(.5, .5, z); g.poly([[p[0] - 6, p[1]], [p[0] + 6, p[1]], [q[0] + 3, q[1]], [q[0] - 3, q[1]]], '#E9573F', INK); [100, 200, 300].forEach(function (zz) { var a = g.P(.5, .5, zz); g.line([a[0] - 6, a[1]], [a[0] + 6, a[1]], '#F4F4F4', 2); }); var r = g.P(.5, .5, 300); g.ell(r[0], r[1], 15, 6, '#F2C21B', INK); g.ell(r[0], r[1] - 3, 15, 6, '#FFE066', INK); [-10, -3, 4, 11].forEach(function (d) { dot(g, r[0] + d, r[1] - 8, 2.2, '#4F80BA'); }); g.ell(q[0], q[1], 8, 3, '#F2C21B', INK); beacon(g, .5, .5, z + 8);
  });
  def('skypod', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); var z = H(lv, 380, 440); g.box(.15, .15, rw - .3, rh - .3, 0, 18, '#E8EDF2'); var p = g.P(rw / 2, rh / 2, 18), q = g.P(rw / 2, rh / 2, z); g.poly([[p[0] - 14, p[1]], [p[0] + 14, p[1]], [q[0] + 4, q[1]], [q[0] - 4, q[1]]], '#DDE6F0', INK);
    var pod = g.P(rw / 2, rh / 2, z * .7); g.ell(pod[0], pod[1], 20, 7, '#B9C6D8', INK); g.ell(pod[0], pod[1] - 5, 20, 7, '#DDE6F0', INK); g.ell(pod[0], pod[1] - 11, 13, 4.5, '#6FB5E3'); var p2 = g.P(rw / 2, rh / 2, z * .9); g.ell(p2[0], p2[1], 9, 3.4, '#B9C6D8', INK); g.line(q, g.P(rw / 2, rh / 2, z + 130), '#E9573F', 1.8); beacon(g, rw / 2, rh / 2, z + 130); g.doorL(.15, .15, rw - .3, rh - .3, .5, 0, .22, 10, '#1F3A5F');
  });
})(typeof window !== 'undefined' ? window : this);
