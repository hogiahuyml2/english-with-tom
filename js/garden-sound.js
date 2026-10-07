/* EWT Garden — NHẠC NỀN & ÂM THANH theo từng khu vườn.
   Toàn bộ do trình duyệt TỰ TẠO (Web Audio) — không tải tệp âm thanh nào, không dùng bản nhạc có bản quyền.
   Mỗi khu có "giai điệu riêng" (thang âm + nhạc cụ + nhịp + âm thanh môi trường): khu Nhật dùng đàn koto + sáo,
   khu Ấn Độ có sitar + tanpura, khu Indonesia có gamelan, bãi biển có sóng vỗ... Sự kiện (Tết, Trung thu, Giáng sinh) thêm lớp nhạc lễ hội.
   Dùng:  EWTSound.scene('japan', { night:false, events:['tet'] });  EWTSound.sfx('place');  EWTSound.toggle(true);
   Bộ phát (Engine) tách riêng để kiểm thử: EWTSound.Engine(ctx, destination). */
(function (root) {
  'use strict';
  var SC = { pmaj: [0, 2, 4, 7, 9], pmin: [0, 3, 5, 7, 10], maj: [0, 2, 4, 5, 7, 9, 11], dor: [0, 2, 3, 5, 7, 9, 10], mix: [0, 2, 4, 5, 7, 9, 10], lyd: [0, 2, 4, 6, 7, 9, 11],
    hira: [0, 2, 3, 7, 8], yo: [0, 2, 5, 7, 9], pelog: [0, 1, 3, 7, 8], hijaz: [0, 1, 4, 5, 7, 8, 10], bhai: [0, 1, 4, 5, 7, 8, 11], blues: [0, 3, 5, 6, 7, 10], hmin: [0, 2, 3, 5, 7, 8, 11], whole: [0, 2, 4, 6, 8, 10], phryg: [0, 1, 3, 5, 7, 8, 10], min: [0, 2, 3, 5, 7, 8, 10] };
  /* Hồ sơ âm nhạc từng khu: sc thang âm · r nốt gốc (MIDI) · bpm · sig số phách/ô nhịp · lead nhạc cụ chính · l2 nhạc cụ phụ · pad nền · bass · d mật độ nốt (0–1) · rh nhịp · amb âm thanh môi trường */
  var PROF = {
    map: { sc: 'pmaj', r: 60, bpm: 84, sig: 4, lead: 'kalimba', pad: 'warm', d: .45, amb: ['birds'] },
    cottage: { sc: 'pmaj', r: 60, bpm: 88, sig: 4, lead: 'pluck', pad: 'warm', bass: 1, d: .5, amb: ['birds'] },
    hill: { sc: 'pmaj', r: 67, bpm: 90, sig: 4, lead: 'flute', pad: 'warm', d: .4, amb: ['wind', 'birds'] },
    river: { sc: 'pmaj', r: 62, bpm: 80, sig: 4, lead: 'harp', pad: 'glass', d: .5, amb: ['brook'] },
    pond: { sc: 'pmaj', r: 65, bpm: 72, sig: 4, lead: 'kalimba', pad: 'glass', d: .4, amb: ['brook', 'night'] },
    forest: { sc: 'dor', r: 62, bpm: 76, sig: 4, lead: 'flute', l2: 'harp', pad: 'warm', d: .35, amb: ['birds', 'wind'] },
    palace: { sc: 'maj', r: 60, bpm: 96, sig: 3, lead: 'harp', l2: 'music', pad: 'warm', bass: 1, d: .6, amb: [] },
    winter: { sc: 'pmaj', r: 64, bpm: 70, sig: 4, lead: 'music', pad: 'glass', d: .4, amb: ['wind'] },
    beach: { sc: 'pmaj', r: 57, bpm: 100, sig: 4, lead: 'pluck', pad: null, bass: 1, d: .55, rh: 'shaker', amb: ['waves', 'birds'] },
    magic: { sc: 'lyd', r: 60, bpm: 66, sig: 4, lead: 'bell', pad: 'glass', d: .5, amb: ['sparkle'] },
    farm: { sc: 'maj', r: 67, bpm: 100, sig: 4, lead: 'banjo', pad: null, bass: 1, d: .6, rh: 'oom', amb: ['birds'] },
    sakura: { sc: 'hira', r: 57, bpm: 70, sig: 4, lead: 'koto', l2: 'flute', pad: null, d: .4, rh: 'wood', amb: ['wind'] },
    autumn: { sc: 'pmin', r: 57, bpm: 72, sig: 4, lead: 'flute', pad: 'warm', d: .4, amb: ['wind'] },
    mountain: { sc: 'pmaj', r: 62, bpm: 60, sig: 4, lead: 'horn', l2: 'flute', pad: 'warm', d: .25, amb: ['wind'] },
    desert: { sc: 'hijaz', r: 62, bpm: 84, sig: 4, lead: 'oud', pad: 'warm', bass: 1, d: .45, rh: 'tab', amb: ['wind'] },
    candy: { sc: 'maj', r: 72, bpm: 112, sig: 4, lead: 'kalimba', l2: 'music', pad: null, bass: 1, d: .65, amb: ['sparkle'] },
    ocean: { sc: 'pmaj', r: 62, bpm: 60, sig: 4, lead: 'bell', pad: 'glass', d: .3, amb: ['deepwaves'] },
    sky: { sc: 'lyd', r: 65, bpm: 72, sig: 4, lead: 'harp', pad: 'glass', d: .45, amb: ['wind'] },
    space: { sc: 'whole', r: 60, bpm: 60, sig: 4, lead: 'bell', pad: 'glass', d: .3, amb: ['space'] },
    bamboo: { sc: 'yo', r: 62, bpm: 72, sig: 4, lead: 'flute', l2: 'koto', pad: null, d: .35, rh: 'wood', amb: ['wind', 'birds'] },
    savanna: { sc: 'pmin', r: 64, bpm: 96, sig: 4, lead: 'kalimba', pad: null, bass: 1, d: .5, rh: 'tab', amb: ['birds', 'night'] },
    jungle: { sc: 'pmin', r: 62, bpm: 104, sig: 4, lead: 'marimba', pad: null, bass: 1, d: .55, rh: 'shaker', amb: ['birds', 'night', 'brook'] },
    village: { sc: 'maj', r: 65, bpm: 92, sig: 4, lead: 'pluck', l2: 'flute', pad: 'warm', bass: 1, d: .5, amb: ['birds'] },
    funfair: { sc: 'maj', r: 72, bpm: 112, sig: 3, lead: 'accord', l2: 'bell', pad: null, bass: 1, d: .7, rh: 'oom', amb: [] },
    arctic: { sc: 'whole', r: 64, bpm: 56, sig: 4, lead: 'music', pad: 'glass', d: .25, amb: ['wind', 'wind'] },
    pirate: { sc: 'min', r: 57, bpm: 108, sig: 3, lead: 'accord', pad: null, bass: 1, d: .55, rh: 'oom', amb: ['waves'] },
    dino: { sc: 'pmin', r: 60, bpm: 76, sig: 4, lead: 'horn', pad: null, bass: 1, d: .4, rh: 'tab', amb: ['night', 'birds'] },
    volcano: { sc: 'phryg', r: 62, bpm: 72, sig: 4, lead: 'horn', l2: 'oud', pad: 'warm', bass: 1, d: .4, rh: 'drum', amb: ['fire'] },
    cyber: { sc: 'pmin', r: 57, bpm: 120, sig: 4, lead: 'synth', pad: 'glass', bass: 1, d: .8, rh: 'tick', amb: ['hum'] },
    vietnam: { sc: 'yo', r: 67, bpm: 76, sig: 4, lead: 'dan', l2: 'koto', pad: null, d: .45, rh: 'wood', amb: ['birds'] },
    thailand: { sc: 'pmaj', r: 62, bpm: 88, sig: 4, lead: 'marimba', l2: 'bell', pad: null, d: .6, rh: 'gong', amb: ['birds'] },
    japan: { sc: 'hira', r: 57, bpm: 66, sig: 4, lead: 'koto', l2: 'flute', pad: null, d: .35, rh: 'wood', amb: ['wind'] },
    china: { sc: 'pmaj', r: 62, bpm: 80, sig: 4, lead: 'erhu', l2: 'koto', pad: null, d: .5, rh: 'gong', amb: [] },
    india: { sc: 'bhai', r: 62, bpm: 76, sig: 4, lead: 'sitar', pad: null, d: .55, rh: 'tab', amb: ['tanpura'] },
    indonesia: { sc: 'pelog', r: 62, bpm: 80, sig: 4, lead: 'gamelan', l2: 'gamelan', pad: null, d: .6, rh: 'gong', amb: ['brook', 'birds'] },
    france: { sc: 'maj', r: 67, bpm: 120, sig: 3, lead: 'accord', pad: null, bass: 1, d: .65, rh: 'oom', amb: [] },
    italy: { sc: 'hmin', r: 57, bpm: 132, sig: 3, lead: 'mandolin', pad: null, bass: 1, d: .7, rh: 'oom', amb: [] },
    netherlands: { sc: 'maj', r: 72, bpm: 80, sig: 4, lead: 'carillon', pad: null, d: .5, amb: ['wind'] },
    uk: { sc: 'dor', r: 62, bpm: 84, sig: 4, lead: 'harp', l2: 'flute', pad: 'warm', d: .5, amb: ['wind'] },
    germany: { sc: 'maj', r: 65, bpm: 104, sig: 4, lead: 'accord', pad: null, bass: 1, d: .6, rh: 'oom', amb: [] },
    usa: { sc: 'blues', r: 67, bpm: 96, sig: 4, lead: 'banjo', pad: null, bass: 1, d: .6, rh: 'shaker', amb: ['night'] },
    greece: { sc: 'hijaz', r: 57, bpm: 108, sig: 4, lead: 'oud', pad: null, bass: 1, d: .65, rh: 'tab', amb: ['waves'] },
    sweden: { sc: 'dor', r: 57, bpm: 90, sig: 3, lead: 'erhu', l2: 'music', pad: null, d: .45, amb: ['wind', 'birds'] },
    switzerland: { sc: 'maj', r: 60, bpm: 76, sig: 4, lead: 'horn', l2: 'music', pad: 'warm', d: .35, rh: 'cow', amb: ['wind'] },
    korea: { sc: 'yo', r: 62, bpm: 72, sig: 4, lead: 'koto', l2: 'flute', pad: null, d: .4, rh: 'wood', amb: ['wind', 'birds'] },
    turkey: { sc: 'hijaz', r: 62, bpm: 96, sig: 4, lead: 'oud', l2: 'flute', pad: null, bass: 1, d: .55, rh: 'tab', amb: ['birds'] },
    australia: { sc: 'pmaj', r: 57, bpm: 84, sig: 4, lead: 'horn', l2: 'marimba', pad: null, d: .4, rh: 'wood', amb: ['wind', 'birds'] },
    canada: { sc: 'maj', r: 60, bpm: 88, sig: 4, lead: 'pluck', l2: 'flute', pad: 'warm', bass: 1, d: .45, amb: ['wind', 'birds'] },
    mexico: { sc: 'maj', r: 62, bpm: 112, sig: 3, lead: 'mandolin', l2: 'accord', pad: null, bass: 1, d: .65, rh: 'oom', amb: [] },
    brazil: { sc: 'pmaj', r: 60, bpm: 100, sig: 4, lead: 'banjo', l2: 'marimba', pad: null, bass: 1, d: .6, rh: 'shaker', amb: ['birds', 'night'] },
    egypt: { sc: 'hijaz', r: 60, bpm: 80, sig: 4, lead: 'oud', l2: 'flute', pad: null, d: .45, rh: 'tab', amb: ['wind'] },
    morocco: { sc: 'hijaz', r: 57, bpm: 92, sig: 4, lead: 'oud', l2: 'banjo', pad: null, bass: 1, d: .5, rh: 'tab', amb: ['wind'] }
  };
  /* hệ số cân bằng âm lượng từng khu (đo bằng cách dựng thử từng cảnh nhạc) để khu nào cũng nghe vừa tai như nhau */
  var TRIM = {"map":1.26,"cottage":0.89,"hill":0.56,"river":1.12,"pond":1.12,"forest":0.79,"palace":1,"winter":1.12,"beach":0.79,"magic":1,"farm":1.12,"sakura":2.24,"autumn":0.71,"mountain":0.79,"desert":1.12,"candy":1.26,"ocean":0.79,"sky":1.12,"space":0.79,"bamboo":1.26,"savanna":1.58,"jungle":1.78,"village":0.89,"funfair":0.79,"arctic":1,"pirate":0.79,"dino":0.55,"volcano":0.79,"cyber":1.12,"vietnam":2.51,"thailand":1.58,"japan":2.24,"china":1.58,"india":2,"indonesia":1.41,"france":0.79,"italy":1,"netherlands":1.58,"uk":1.12,"germany":0.79,"usa":1.41,"greece":0.89,"sweden":2,"switzerland":0.79};
  var CHORDS = [[0, 3, 4, 0], [0, 4, 3, 4], [0, 2, 3, 4]];
  var mtof = function (m) { return 440 * Math.pow(2, (m - 69) / 12); };
  function hash(str) { var h = 2166136261, i; for (i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619); return h >>> 0; }
  function rng(seed) { var s = (seed % 2147483646) + 1; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

  function Engine(ctx, dest) {
    var E = this, i;
    E.ctx = ctx; E.vol = .5; E.opt = { mus: 1, amb: 1, fx: 1 }; E.cur = null;
    E.out = ctx.createGain(); E.out.gain.value = .5;
    var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -20; comp.knee.value = 24; comp.ratio.value = 3.5; comp.attack.value = .01; comp.release.value = .25;
    E.out.connect(comp); comp.connect(dest);
    E.bus = ctx.createGain(); E.bus.gain.value = 1;
    E.fxBus = ctx.createGain(); E.fxBus.gain.value = .8; E.fxBus.connect(E.out);
    // vang (reverb) tự tạo từ nhiễu tắt dần
    var conv = ctx.createConvolver(), len = Math.floor(ctx.sampleRate * 1.9), buf = ctx.createBuffer(2, len, ctx.sampleRate), ch, k;
    for (ch = 0; ch < 2; ch++) { var d = buf.getChannelData(ch); for (k = 0; k < len; k++) d[k] = (Math.random() * 2 - 1) * Math.pow(1 - k / len, 2.6); }
    conv.buffer = buf; var wet = ctx.createGain(); wet.gain.value = .32; E.bus.connect(E.out); E.bus.connect(conv); conv.connect(wet); wet.connect(E.out);
    // nhiễu dùng chung
    var nl = ctx.sampleRate * 2; E.white = ctx.createBuffer(1, nl, ctx.sampleRate); E.pink = ctx.createBuffer(1, nl, ctx.sampleRate);
    var w = E.white.getChannelData(0), p = E.pink.getChannelData(0), b0 = 0, b1 = 0, b2 = 0, x;
    for (k = 0; k < nl; k++) { x = Math.random() * 2 - 1; w[k] = x; b0 = .99765 * b0 + x * .099046; b1 = .963 * b1 + x * .2965164; b2 = .57 * b2 + x * 1.0526913; p[k] = (b0 + b1 + b2 + x * .1848) * .18; }
  }
  var P = Engine.prototype;
  P.setVol = function (v) { this.vol = v; this.out.gain.setTargetAtTime(Math.pow(v, 1.6) * .85, this.ctx.currentTime, .05); };

  /* ───── nhạc cụ ───── */
  function g0(c, d, t, v, dur, att) { var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(.0002, v), t + (att || .006)); g.gain.exponentialRampToValueAtTime(.0001, t + dur); g.connect(d); return g; }
  function osc(c, type, f, t, dur, to) { var o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); o.start(t); o.stop(t + dur + .06); if (to) o.connect(to); return o; }
  function pluckV(E, d, f, t, dur, v, o) { o = o || {}; var c = E.ctx, lp = c.createBiquadFilter(), g = g0(c, d, t, v, dur); lp.type = 'lowpass'; lp.Q.value = o.q || 1; lp.frequency.setValueAtTime(o.cut || 3200, t); lp.frequency.exponentialRampToValueAtTime(Math.max(400, f * 2), t + Math.min(dur, 1.2)); lp.connect(g); osc(c, o.type || 'triangle', f, t, dur, lp); if (o.type2) osc(c, o.type2, f * (o.det || 1.003), t, dur, lp); }
  function partials(E, d, f, t, dur, v, parts, gains, decs) { var c = E.ctx, k; for (k = 0; k < parts.length; k++) { var dd = dur * (decs ? decs[k] : 1 / (1 + k * .5)); osc(c, 'sine', f * parts[k], t, dd, g0(c, d, t, v * gains[k], dd, .004)); } }
  function sustain(E, d, f, t, dur, v, o) { o = o || {}; var c = E.ctx, g = c.createGain(), lp = c.createBiquadFilter(), a = o.att || .08; lp.type = 'lowpass'; lp.frequency.value = o.cut || 1800; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + a); g.gain.setValueAtTime(v, t + Math.max(a, dur - .12)); g.gain.exponentialRampToValueAtTime(.0001, t + dur + .08); lp.connect(g); g.connect(d);
    var a1 = osc(c, o.type || 'sine', f, t, dur + .1, lp), a2 = o.type2 ? osc(c, o.type2, f * (o.det || 1.004), t, dur + .1, lp) : null;
    if (o.vib) { var l = c.createOscillator(), lg = c.createGain(); l.frequency.value = o.vib; lg.gain.value = o.vd || 8; l.connect(lg); lg.connect(a1.detune); if (a2) lg.connect(a2.detune); l.start(t); l.stop(t + dur + .1); }
    if (o.breath) { var n = c.createBufferSource(), bp = c.createBiquadFilter(), bg = g0(c, d, t, v * .35, dur, a); n.buffer = E.white; n.loop = true; bp.type = 'bandpass'; bp.frequency.value = f * 2; bp.Q.value = 2; n.connect(bp); bp.connect(bg); n.start(t); n.stop(t + dur + .1); } }
  var VO = {
    pluck: function (E, d, f, t, dur, v) { pluckV(E, d, f, t, Math.min(dur * 1.6, 1.4), v * .9, { type: 'triangle', type2: 'sine', cut: 3600 }); },
    koto: function (E, d, f, t, dur, v) { pluckV(E, d, f, t, 1.5, v, { type: 'sawtooth', cut: 4200, q: 3 }); pluckV(E, d, f * 2, t, .5, v * .3, { type: 'sine', cut: 6000 }); },
    harp: function (E, d, f, t, dur, v) { pluckV(E, d, f, t, 1.8, v * .9, { type: 'triangle', cut: 5000 }); partials(E, d, f, t, 1.1, v * .3, [2], [1]); },
    banjo: function (E, d, f, t, dur, v) { pluckV(E, d, f, t, .6, v, { type: 'sawtooth', type2: 'square', cut: 5200, q: 2 }); },
    oud: function (E, d, f, t, dur, v) { pluckV(E, d, f, t, 1.1, v, { type: 'sawtooth', cut: 2600, q: 4 }); pluckV(E, d, f * 1.002, t, 1, v * .5, { type: 'triangle', cut: 2000 }); },
    sitar: function (E, d, f, t, dur, v) { pluckV(E, d, f, t, 1.7, v * .8, { type: 'sawtooth', cut: 5600, q: 8 }); partials(E, d, f, t, 1.4, v * .25, [2.01, 3.02], [1, .6]); },
    mandolin: function (E, d, f, t, dur, v) { var n = Math.max(2, Math.min(5, Math.round(dur / .09))), k; for (k = 0; k < n; k++) pluckV(E, d, f, t + k * .075, .22, v * (k ? .55 : .9), { type: 'triangle', type2: 'square', cut: 5000 }); },
    kalimba: function (E, d, f, t, dur, v) { partials(E, d, f, t, 1.2, v, [1, 4.02], [1, .22], [1, .35]); },
    marimba: function (E, d, f, t, dur, v) { partials(E, d, f, t, .7, v, [1, 3.9, 9.2], [1, .35, .08], [1, .3, .1]); },
    bell: function (E, d, f, t, dur, v) { partials(E, d, f, t, 2.6, v * .8, [1, 2.76, 5.4, 8.93], [1, .5, .22, .1], [1, .6, .35, .2]); },
    music: function (E, d, f, t, dur, v) { partials(E, d, f, t, 1.8, v * .85, [1, 3.01, 5.2], [1, .32, .1], [1, .4, .2]); },
    gamelan: function (E, d, f, t, dur, v) { partials(E, d, f, t, 1.9, v * .9, [1, 2.4, 4.08], [1, .45, .2], [1, .5, .3]); },
    carillon: function (E, d, f, t, dur, v) { partials(E, d, f, t, 2.2, v * .75, [1, 2.0, 2.99, 4.2], [1, .5, .35, .15], [1, .6, .4, .25]); },
    flute: function (E, d, f, t, dur, v) { sustain(E, d, f, t, Math.max(.5, dur), v * .75, { type: 'sine', type2: 'triangle', det: 1.002, att: .09, vib: 5, vd: 7, breath: 1, cut: 4000 }); },
    horn: function (E, d, f, t, dur, v) { sustain(E, d, f / 2, t, Math.max(1.2, dur * 1.6), v * .8, { type: 'triangle', type2: 'sine', att: .18, cut: 900, vib: 4, vd: 5 }); },
    erhu: function (E, d, f, t, dur, v) { sustain(E, d, f, t, Math.max(.6, dur), v * .55, { type: 'sawtooth', att: .1, cut: 2300, vib: 5.5, vd: 16 }); },
    accord: function (E, d, f, t, dur, v) { sustain(E, d, f, t, Math.max(.3, dur), v * .5, { type: 'sawtooth', type2: 'square', det: 1.006, att: .035, cut: 2000, vib: 4.5, vd: 4 }); },
    synth: function (E, d, f, t, dur, v) { pluckV(E, d, f, t, Math.max(.18, dur * .7), v * .6, { type: 'square', cut: 3200, q: 4 }); },
    dan: function (E, d, f, t, dur, v) { var c = E.ctx, g = g0(c, d, t, v * .75, Math.max(.9, dur * 1.4), .02), o = c.createOscillator(), l = c.createOscillator(), lg = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(f * .955, t); o.frequency.exponentialRampToValueAtTime(f, t + .16); l.frequency.value = 4.2; lg.gain.value = 14; l.connect(lg); lg.connect(o.detune); o.connect(g); o.start(t); l.start(t); o.stop(t + dur * 1.4 + 1); l.stop(t + dur * 1.4 + 1); partials(E, d, f, t, .5, v * .2, [2, 3], [1, .5]); }
  };
  function drumV(E, d, t, v, f0, f1, dur) { var c = E.ctx, o = c.createOscillator(), g = g0(c, d, t, v, dur || .22, .004); o.type = 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + (dur || .22) * .9); o.connect(g); o.start(t); o.stop(t + (dur || .22) + .05); }
  function noiseV(E, d, t, v, dur, type, f, q) { var c = E.ctx, n = c.createBufferSource(), fl = c.createBiquadFilter(), g = g0(c, d, t, v, dur, .003); n.buffer = E.white; fl.type = type; fl.frequency.value = f; fl.Q.value = q || .7; n.connect(fl); fl.connect(g); n.start(t, Math.random() * 1.5); n.stop(t + dur + .02); }
  function padV(E, d, freqs, t, dur, v, kind) { var c = E.ctx, lp = c.createBiquadFilter(), g = c.createGain(), k; lp.type = 'lowpass'; lp.frequency.value = kind === 'glass' ? 2400 : 900; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + Math.min(1.4, dur * .4)); g.gain.setValueAtTime(v, t + dur * .6); g.gain.exponentialRampToValueAtTime(.0001, t + dur + 1.2); lp.connect(g); g.connect(d);
    freqs.forEach(function (f) { var j; for (j = -1; j <= 1; j += 2) osc(c, kind === 'glass' ? 'triangle' : 'sawtooth', f * (1 + j * .004), t, dur + 1.3, lp); }); }

  /* ───── cảnh nhạc ───── */
  P.scene = function (key, o) {
    o = o || {}; var E = this, c = E.ctx, now = c.currentTime, p = PROF[key] || PROF.map, ev = (o.events || []).join('+'), sk = key + '|' + ev + '|' + (o.night ? 'n' : 'd');
    if (E.cur && E.cur.sk === sk) return;
    if (E.cur) E.fade(E.cur);
    var sc = { sk: sk, key: key, p: p, night: !!o.night, ev: o.events || [], R: rng(hash(key) + 17), mus: c.createGain(), amb: c.createGain(), srcs: [], t0: now + .25, n: 0, ph: null, ev2: {} };
    sc.trim = TRIM[key] || 1; sc.mus.gain.setValueAtTime(.0001, now); sc.mus.gain.linearRampToValueAtTime(E.opt.mus ? sc.trim : 0, now + 1.6); sc.mus.connect(E.bus);
    sc.amb.gain.setValueAtTime(.0001, now); sc.amb.gain.linearRampToValueAtTime(E.opt.amb ? sc.trim : 0, now + 2.2); sc.amb.connect(E.out);
    var S = SC[p.sc], L = S.length; sc.S = S; sc.L = L; sc.step = 30 / p.bpm; sc.bar = p.sig * 2;
    // hai câu nhạc (A, B) cùng nhịp, khác cao độ → lặp lại có biến tấu, dễ nhớ như một "chủ đề"
    var mk = function (R, base) { var ev2 = [], deg = base, s; for (s = 0; s < sc.bar * 2; s++) { var strong = (s % 2 === 0) ? 1 : .55, big = (s % sc.bar === 0) ? 1.4 : 1; if (R() < p.d * strong * big * 1.15) { var r = R(); deg += r < .38 ? 1 : r < .76 ? -1 : r < .88 ? 2 : r < .96 ? -2 : (R() < .5 ? 3 : -3); deg = Math.max(-3, Math.min(L + 3, deg)); ev2.push({ s: s, deg: deg, len: R() < .3 ? 3 : R() < .5 ? 2 : 1 }); } } if (!ev2.length) ev2.push({ s: 0, deg: base, len: 3 }); return ev2; };
    sc.A = mk(sc.R, 2); sc.B = mk(sc.R, 3); sc.prog = CHORDS[hash(key) % CHORDS.length];
    E.amb(sc); E.cur = sc;
    sc.next = { bird: now + 1.5 + sc.R() * 3, drop: now + 2, fire: now + 1, spark: now + 2 };
  };
  P.fade = function (sc) { var c = this.ctx, t = c.currentTime; sc.dead = true; sc.mus.gain.cancelScheduledValues(t); sc.mus.gain.setValueAtTime(sc.mus.gain.value, t); sc.mus.gain.linearRampToValueAtTime(.0001, t + 1.4); sc.amb.gain.cancelScheduledValues(t); sc.amb.gain.setValueAtTime(sc.amb.gain.value, t); sc.amb.gain.linearRampToValueAtTime(.0001, t + 1.4);
    setTimeout(function () { sc.srcs.forEach(function (s) { try { s.stop(); } catch (e) {} }); try { sc.mus.disconnect(); sc.amb.disconnect(); } catch (e) {} }, 1800); };
  P.setOpt = function (o) { var E = this; Object.keys(o).forEach(function (k) { E.opt[k] = o[k]; }); var sc = E.cur; if (!sc) return; var t = E.ctx.currentTime; sc.mus.gain.setTargetAtTime(E.opt.mus ? sc.trim : 0, t, .15); sc.amb.gain.setTargetAtTime(E.opt.amb ? sc.trim : 0, t, .25); E.fxBus.gain.setTargetAtTime(E.opt.fx ? .8 : 0, t, .05); };
  // âm thanh môi trường liên tục (sóng, gió, suối, lửa...)
  P.amb = function (sc) {
    var E = this, c = E.ctx, t = c.currentTime, p = sc.p;
    var loop = function (buf, type, f, q, gain, lfoHz, lfoDepth, lfoTarget) {
      var n = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(); n.buffer = buf; n.loop = true; fl.type = type; fl.frequency.value = f; fl.Q.value = q || .7; g.gain.value = gain; n.connect(fl); fl.connect(g); g.connect(sc.amb); n.start(t, Math.random() * 1.5); sc.srcs.push(n);
      if (lfoHz) { var l = c.createOscillator(), lg = c.createGain(); l.frequency.value = lfoHz; l.type = 'sine'; lg.gain.value = lfoDepth; l.connect(lg); lg.connect(lfoTarget === 'f' ? fl.frequency : g.gain); l.start(t); sc.srcs.push(l); }
    };
    var tone = function (f, gain, f2) { var o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = f; g.gain.value = gain; o.connect(g); g.connect(sc.amb); o.start(t); sc.srcs.push(o); if (f2) { var o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = f2; o2.connect(g); o2.start(t); sc.srcs.push(o2); } };
    (p.amb || []).forEach(function (a, i) {
      if (a === 'waves') { loop(E.pink, 'lowpass', 520, .5, .16, .11 + i * .02, .12); loop(E.white, 'highpass', 2600, .5, .02, .13, .02); }
      else if (a === 'deepwaves') loop(E.pink, 'lowpass', 300, .5, .2, .07, .14);
      else if (a === 'wind') loop(E.pink, 'bandpass', 520, 1.3, .1, .06 + i * .03, 260, 'f');
      else if (a === 'brook') { loop(E.white, 'bandpass', 1900, .5, .035, .7, .012); loop(E.pink, 'lowpass', 900, .5, .03); }
      else if (a === 'fire') loop(E.pink, 'lowpass', 190, .5, .13, .09, .05);
      else if (a === 'space') { tone(55, .05, 55.4); tone(82.5, .03, 82.9); loop(E.pink, 'bandpass', 700, 3, .02, .05, .015); }
      else if (a === 'hum') { tone(60, .035, 120.4); loop(E.white, 'highpass', 5000, .5, .006); }
      else if (a === 'tanpura') { /* dây đàn tanpura do sự kiện nốt thấp tạo ra */ }
    });
  };

  /* ───── bộ lập lịch: gọi pump(T) để sinh các nốt đến thời điểm T ───── */
  P.pump = function (T) {
    var E = this, sc = E.cur; if (!sc || sc.dead) return; var p = sc.p, S = sc.S, L = sc.L, V = VO[p.lead] || VO.pluck, V2 = p.l2 ? VO[p.l2] : null, st = sc.step;
    var note = function (deg, oct) { var o = Math.floor(deg / L), i = ((deg % L) + L) % L; return p.r + S[i] + 12 * (o + (oct || 0)); };
    var tri = function (c0) { var i3 = L === 5 ? [0, 2, 3] : [0, 2, 4]; return i3.map(function (k) { return c0 + k; }); };
    while (sc.t0 + sc.n * st < T) {
      var n = sc.n, t = sc.t0 + n * st, s = n % sc.bar, bar = Math.floor(n / sc.bar), ph = bar % 4, seq = (Math.floor(bar / 2) % 4), phrase = (seq === 1 || seq === 3) ? sc.A : (seq === 2 ? sc.B : sc.A);
      if (s === 0 && bar % 2 === 0 && p.pad) { var ch = sc.prog[Math.floor(bar / 2) % 4]; padV(E, sc.mus, tri(ch).map(function (d) { return mtof(note(d, -1)); }), t, st * sc.bar * 2, .05, p.pad); }
      if (p.bass && (s === 0 || (p.sig === 4 && s === 4) || (p.rh === 'oom' && p.sig === 3 && s === 0))) { var ch2 = sc.prog[Math.floor(bar / 2) % 4]; pluckV(E, sc.mus, mtof(note(ch2, -2)), t, .5, .17, { type: 'triangle', cut: 700 }); }
      if (p.rh === 'oom') { if (p.sig === 3 && (s === 2 || s === 4)) VO.accord(E, sc.mus, mtof(note(sc.prog[Math.floor(bar / 2) % 4] + 2, 0)), t, st * 1.6, .055); if (p.sig === 4 && (s === 2 || s === 6)) VO.accord(E, sc.mus, mtof(note(sc.prog[Math.floor(bar / 2) % 4] + 2, 0)), t, st * 1.6, .05); }
      if (p.rh === 'shaker') noiseV(E, sc.mus, t, s % 2 ? .02 : .04, .06, 'highpass', 6800);
      if (p.rh === 'wood' && s === 0) { drumV(E, sc.mus, t, .12, 900, 520, .08); }
      if (p.rh === 'tick') { if (s % 2 === 0) noiseV(E, sc.mus, t, .035, .03, 'highpass', 8000); if (s === 4) drumV(E, sc.mus, t, .12, 140, 60, .16); }
      if (p.rh === 'tab') { if (s === 0 || s === 5) drumV(E, sc.mus, t, .15, 190, 95, .2); if (s === 3 || s === 7) noiseV(E, sc.mus, t, .05, .05, 'bandpass', 2400, 2); }
      if (p.rh === 'drum') { if (s === 0 || s === 4) drumV(E, sc.mus, t, .22, 120, 48, .3); }
      if (p.rh === 'gong' && s === 0 && bar % 4 === 0) VO.gamelan(E, sc.mus, mtof(p.r - 24), t, 3, .12);
      if (p.rh === 'cow' && s % sc.bar === 3 && sc.R() < .35) partials(E, sc.mus, 820 + sc.R() * 100, t, .5, .05, [1, 1.51, 2.4], [1, .6, .3]);
      phrase.forEach(function (e) { if (e.s === s) { var f = mtof(note(e.deg, 0)), len = e.len * st; V(E, sc.mus, f, t, len, .16 * (s === 0 ? 1.1 : .9)); if (V2 && sc.R() < .38) V2(E, sc.mus, mtof(note(e.deg + (sc.R() < .5 ? 2 : -1), 1)), t + st * .5, len, .08); } });
      // lớp nhạc sự kiện
      sc.ev.forEach(function (id) {
        if (id === 'tet') { if (s % 4 === 0) drumV(E, sc.mus, t, .12, 150, 60, .22); if (s === 2) noiseV(E, sc.mus, t, .04, .04, 'bandpass', 3200, 3); if (s === 0 && bar % 4 === 0) VO.gamelan(E, sc.mus, mtof(p.r - 12), t, 3, .1); if (sc.R() < .22) VO.bell(E, sc.mus, mtof(p.r + 24 + [0, 2, 4, 7, 9][Math.floor(sc.R() * 5)]), t, 1, .05); }
        if (id === 'trungthu') { if (sc.R() < .3) VO.music(E, sc.mus, mtof(p.r + 24 + [0, 2, 4, 7, 9][Math.floor(sc.R() * 5)]), t, 1, .055); if (s === 0) drumV(E, sc.mus, t, .08, 260, 150, .14); }
        if (id === 'noel') { if (s % 2 === 0) { var k; for (k = 0; k < 3; k++) noiseV(E, sc.mus, t + k * .035, .028, .05, 'highpass', 7200); } if (sc.R() < .22) VO.bell(E, sc.mus, mtof(p.r + 24 + [0, 2, 4, 7, 9][Math.floor(sc.R() * 5)]), t, 1, .05); }
      });
      sc.n++;
    }
    // âm thanh môi trường rời rạc: chim, dế, giọt nước, tách lửa, lấp lánh, dây tanpura
    var amb = p.amb || [], now = T - .6, R = sc.R, nx = sc.next, a;
    if (E.opt.amb) {
      if (nx.bird <= T) { var tb = Math.max(nx.bird, E.ctx.currentTime); if (!sc.night && amb.indexOf('birds') >= 0) { var cnt = 2 + Math.floor(R() * 3), b; for (b = 0; b < cnt; b++) { var f0 = 2600 + R() * 1800, o = E.ctx.createOscillator(), g = g0(E.ctx, sc.amb, tb + b * .13, .028, .09, .01); o.type = 'sine'; o.frequency.setValueAtTime(f0, tb + b * .13); o.frequency.exponentialRampToValueAtTime(f0 * (R() < .5 ? 1.35 : .8), tb + b * .13 + .08); o.connect(g); o.start(tb + b * .13); o.stop(tb + b * .13 + .12); } } else if (sc.night && amb.indexOf('night') >= 0) { var q; for (q = 0; q < 8; q++) { var go = g0(E.ctx, sc.amb, tb + q * .07, .012, .05, .005), oc = E.ctx.createOscillator(); oc.type = 'sine'; oc.frequency.value = 4300; oc.connect(go); oc.start(tb + q * .07); oc.stop(tb + q * .07 + .06); } } nx.bird = T + 2 + R() * 4.5; }
      if (nx.drop <= T && amb.indexOf('brook') >= 0) { var td = Math.max(nx.drop, E.ctx.currentTime), fd = 700 + R() * 900, od = E.ctx.createOscillator(), gd = g0(E.ctx, sc.amb, td, .02, .12, .004); od.type = 'sine'; od.frequency.setValueAtTime(fd, td); od.frequency.exponentialRampToValueAtTime(fd * 1.6, td + .08); od.connect(gd); od.start(td); od.stop(td + .15); nx.drop = T + .6 + R() * 2.2; }
      if (nx.fire <= T && amb.indexOf('fire') >= 0) { noiseV(E, sc.amb, Math.max(nx.fire, E.ctx.currentTime), .05 + R() * .04, .04, 'highpass', 1800 + R() * 1500); nx.fire = T + .15 + R() * .5; }
      if (nx.spark <= T && (amb.indexOf('sparkle') >= 0 || amb.indexOf('space') >= 0)) { VO.bell(E, sc.amb, mtof(84 + SC.pmaj[Math.floor(R() * 5)] + (R() < .3 ? 12 : 0)), Math.max(nx.spark, E.ctx.currentTime), 1.4, .035); nx.spark = T + 1.2 + R() * 3.5; }
      if (nx.tan === undefined) nx.tan = T;
      if (nx.tan <= T && amb.indexOf('tanpura') >= 0) { var tt = Math.max(nx.tan, E.ctx.currentTime); [[p.r - 24 + 7, 0], [p.r - 24 + 12, .55], [p.r - 24 + 12, 1.1], [p.r - 24, 1.65]].forEach(function (x) { pluckV(E, sc.amb, mtof(x[0]), tt + x[1], 2.2, .06, { type: 'sawtooth', cut: 1300, q: 3 }); }); nx.tan = T + 2.2 + R() * .4; }
    }
  };

  /* ───── hiệu ứng ngắn (đặt đồ, tưới, thu hoạch, nhận quà...) ───── */
  var FXN = { place: [[300, 160, .1, 'sine', .3]], water: [[620, 820, .07, 'sine', .22], [780, 1000, .07, 'sine', .22, .08], [900, 1250, .09, 'sine', .2, .16]],
    harvest: [[784, 784, .22, 'sine', .22], [988, 988, .22, 'sine', .2, .09], [1319, 1319, .35, 'sine', .2, .18]], coin: [[1319, 1319, .12, 'square', .08], [1760, 1760, .3, 'square', .08, .08]],
    reward: [[880, 880, .25, 'sine', .2], [1109, 1109, .25, 'sine', .2, .08], [1319, 1319, .25, 'sine', .2, .16], [1760, 1760, .5, 'sine', .22, .24]],
    levelup: [[523, 523, .3, 'triangle', .25], [659, 659, .3, 'triangle', .25, .12], [784, 784, .3, 'triangle', .25, .24], [1047, 1047, .6, 'triangle', .28, .36]],
    err: [[190, 130, .22, 'triangle', .22]], event: [], click: [[1000, 900, .04, 'sine', .12]], send: [[660, 880, .12, 'sine', .2], [990, 1320, .2, 'sine', .2, .1]] };
  P.sfx = function (name) {
    var E = this, c = E.ctx, t = c.currentTime + .005, a = FXN[name]; if (!a || !E.opt.fx) return;
    a.forEach(function (x) { var o = c.createOscillator(), g = g0(c, E.fxBus, t + (x[5] || 0), x[4], x[2], .004); o.type = x[3]; o.frequency.setValueAtTime(x[0], t + (x[5] || 0)); if (x[1] !== x[0]) o.frequency.exponentialRampToValueAtTime(x[1], t + (x[5] || 0) + x[2]); o.connect(g); o.start(t + (x[5] || 0)); o.stop(t + (x[5] || 0) + x[2] + .05); });
    if (name === 'place') noiseV(E, E.fxBus, t, .08, .05, 'lowpass', 1800);
    if (name === 'event') VO.bell(E, E.fxBus, 1047, t, 1.4, .14);
  };

  /* ───── điều khiển trong trang (có AudioContext thật) ───── */
  var S = { on: false, ctx: null, eng: null, timer: null, want: null, pref: { on: 0, vol: .5, mus: 1, amb: 1, fx: 1 } };
  function load() { try { var j = JSON.parse(localStorage.getItem('ewt-garden-snd') || 'null'); if (j && typeof j === 'object') Object.keys(S.pref).forEach(function (k) { if (j[k] !== undefined) S.pref[k] = j[k]; }); } catch (e) {} }
  function save() { try { localStorage.setItem('ewt-garden-snd', JSON.stringify(S.pref)); } catch (e) {} }
  function ensure() {
    if (S.eng) return true; var AC = root.AudioContext || root.webkitAudioContext; if (!AC) return false;
    try { S.ctx = new AC(); S.eng = new Engine(S.ctx, S.ctx.destination); S.eng.setVol(S.pref.vol); S.eng.setOpt({ mus: S.pref.mus, amb: S.pref.amb, fx: S.pref.fx }); } catch (e) { S.eng = null; return false; }
    return true;
  }
  function loop() { if (!S.on || !S.eng) return; try { S.eng.pump(S.ctx.currentTime + 1.2); } catch (e) { /* bỏ qua lỗi âm thanh */ } }
  function start() {
    if (!ensure()) return false; S.on = true; S.pref.on = 1; save();
    var go = function () { if (S.want) S.eng.scene(S.want.key, S.want.o); clearInterval(S.timer); S.timer = setInterval(loop, 140); loop(); };
    if (S.ctx.state === 'suspended') S.ctx.resume().then(go).catch(go); else go();
    return true;
  }
  function stop() { S.on = false; S.pref.on = 0; save(); clearInterval(S.timer); if (S.eng && S.eng.cur) { S.eng.fade(S.eng.cur); S.eng.cur = null; } }
  var NAMES = { pluck: 'đàn dây gảy', koto: 'đàn koto', harp: 'đàn hạc', banjo: 'đàn banjo', oud: 'đàn oud', sitar: 'đàn sitar', mandolin: 'đàn mandolin', kalimba: 'đàn kalimba', marimba: 'đàn marimba', bell: 'chuông', music: 'hộp nhạc', gamelan: 'gamelan', carillon: 'chuông tháp', flute: 'sáo', horn: 'kèn alphorn', erhu: 'đàn nhị', accord: 'đàn accordion', synth: 'synthesizer', dan: 'đàn bầu' };
  var AMBN = { waves: 'sóng vỗ', deepwaves: 'sóng biển sâu', wind: 'gió', brook: 'suối chảy', fire: 'lửa & dung nham', space: 'không gian', hum: 'tiếng máy', tanpura: 'dây tanpura', birds: 'chim hót', night: 'dế đêm', sparkle: 'ánh lấp lánh' };
  function describe(key) { var p = PROF[key] || PROF.map, a = [NAMES[p.lead]]; if (p.l2 && p.l2 !== p.lead) a.push(NAMES[p.l2]); var m = a.join(' + '), e = (p.amb || []).filter(function (x, i, r) { return AMBN[x] && r.indexOf(x) === i; }).map(function (x) { return AMBN[x]; }); return m + (e.length ? ' · ' + e.join(', ') : ''); }
  var API = {
    Engine: Engine, PROF: PROF, SC: SC, describe: describe,
    init: function () { load(); },
    state: function () { return { on: S.on, wantOn: !!S.pref.on, vol: S.pref.vol, mus: S.pref.mus, amb: S.pref.amb, fx: S.pref.fx, ok: !!(root.AudioContext || root.webkitAudioContext) }; },
    toggle: function (on) { if (on === undefined) on = !S.on; if (on) return start(); stop(); return false; },
    scene: function (key, o) { S.want = { key: key, o: o || {} }; if (S.on && S.eng) S.eng.scene(key, o || {}); },
    sfx: function (n) { if (S.on && S.eng && S.ctx.state === 'running') S.eng.sfx(n); },
    set: function (k, v) { S.pref[k] = v; save(); if (!S.eng) return; if (k === 'vol') S.eng.setVol(v); else S.eng.setOpt((function () { var o = {}; o[k] = v; return o; })()); },
    // kiểm tra nhanh: có đang phát ra âm thanh thật không (mức âm lượng trung bình trong ~0,6 giây)
    probe: function () { return new Promise(function (res) { if (!S.eng) return res({ ctx: 'none' }); var an = S.ctx.createAnalyser(), buf, mx = 0, n = 0; an.fftSize = 2048; S.eng.out.connect(an); buf = new Float32Array(an.fftSize); var iv = setInterval(function () { an.getFloatTimeDomainData(buf); var i, s2 = 0; for (i = 0; i < buf.length; i++) s2 += buf[i] * buf[i]; mx = Math.max(mx, Math.sqrt(s2 / buf.length)); n++; if (n >= 8) { clearInterval(iv); try { S.eng.out.disconnect(an); } catch (e) {} res({ ctx: S.ctx.state, rms: +mx.toFixed(4), scene: S.eng.cur && S.eng.cur.sk }); } }, 80); }); },
    suspend: function () { if (S.ctx && S.ctx.state === 'running') S.ctx.suspend(); }, resume: function () { if (S.on && S.ctx && S.ctx.state === 'suspended') S.ctx.resume(); }
  };
  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', function () { if (document.hidden) API.suspend(); else API.resume(); });
  root.EWTSound = API;
})(typeof window !== 'undefined' ? window : this);
