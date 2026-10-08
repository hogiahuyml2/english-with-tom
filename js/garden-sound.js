/* EWT Garden — NHẠC NỀN & ÂM THANH theo từng khu vườn.
   Toàn bộ do trình duyệt TỰ TẠO (Web Audio) — không tải tệp âm thanh nào, không dùng bản nhạc có bản quyền.
   Mỗi khu có "giai điệu riêng" (thang âm + nhạc cụ + nhịp + âm thanh môi trường): khu Nhật dùng đàn koto + sáo,
   khu Ấn Độ có sitar + tanpura, khu Indonesia có gamelan, bãi biển có sóng vỗ... Sự kiện (Tết, Trung thu, Giáng sinh) thêm lớp nhạc lễ hội.
   Dùng:  EWTSound.scene('japan', { night:false, events:['tet'] });  EWTSound.sfx('place');  EWTSound.toggle(true);
   Bộ phát (Engine) tách riêng để kiểm thử: EWTSound.Engine(ctx, destination). */
(function (root) {
  'use strict';
  var GV = root.EWTGroove || (typeof require !== 'undefined' ? require('./garden-groove.js') : { GR: {}, ZG: {} }), GR = GV.GR, ZG = GV.ZG;
  var SC = { pmaj: [0, 2, 4, 7, 9], pmin: [0, 3, 5, 7, 10], maj: [0, 2, 4, 5, 7, 9, 11], dor: [0, 2, 3, 5, 7, 9, 10], mix: [0, 2, 4, 5, 7, 9, 10], lyd: [0, 2, 4, 6, 7, 9, 11],
    hira: [0, 2, 3, 7, 8], yo: [0, 2, 5, 7, 9], pelog: [0, 1, 3, 7, 8], hijaz: [0, 1, 4, 5, 7, 8, 10], bhai: [0, 1, 4, 5, 7, 8, 11], blues: [0, 3, 5, 6, 7, 10], hmin: [0, 2, 3, 5, 7, 8, 11], ambassel: [0, 1, 5, 7, 8], bati: [0, 4, 5, 7, 11], whole: [0, 2, 4, 6, 8, 10], phryg: [0, 1, 3, 5, 7, 8, 10], min: [0, 2, 3, 5, 7, 8, 10] };
  /* Hồ sơ âm nhạc từng khu: sc thang âm · r nốt gốc (MIDI) · bpm · sig số phách/ô nhịp · lead nhạc cụ chính · l2 nhạc cụ phụ · pad nền · bass · d mật độ nốt (0–1) · rh nhịp · amb âm thanh môi trường */
  var PROF = {
    map: { sc: 'pmaj', r: 60, bpm: 84, sig: 4, lead: 'kalimba', pad: 'warm', d: .45, amb: ['birds'] },
    cottage: { sc: 'pmaj', r: 60, bpm: 88, sig: 4, lead: 'pluck', pad: 'warm', bass: 1, d: .5, amb: ['birds'] },
    hill: { sc: 'pmaj', r: 67, bpm: 90, sig: 4, lead: 'flute', pad: 'warm', d: .4, amb: ['wind', 'birds'] },
    river: { sc: 'pmaj', r: 62, bpm: 80, sig: 4, lead: 'harp', pad: 'glass', d: .5, amb: ['brook'] },
    pond: { sc: 'pmaj', r: 65, bpm: 78, sig: 4, lead: 'kalimba', pad: 'glass', d: .4, amb: ['brook', 'night'] },
    forest: { sc: 'dor', r: 62, bpm: 80, sig: 4, lead: 'flute', l2: 'harp', pad: 'warm', d: .35, amb: ['birds', 'wind'] },
    palace: { sc: 'maj', r: 60, bpm: 96, sig: 3, lead: 'harp', l2: 'music', pad: 'warm', bass: 1, d: .6, amb: [] },
    winter: { sc: 'pmaj', r: 64, bpm: 78, sig: 4, lead: 'music', pad: 'glass', d: .4, amb: ['wind'] },
    beach: { sc: 'pmaj', r: 57, bpm: 100, sig: 4, lead: 'pluck', pad: null, bass: 1, d: .55, rh: 'shaker', amb: ['waves', 'birds'] },
    magic: { sc: 'lyd', r: 60, bpm: 78, sig: 4, lead: 'bell', pad: 'glass', d: .5, amb: ['sparkle'] },
    farm: { sc: 'maj', r: 67, bpm: 100, sig: 4, lead: 'banjo', pad: null, bass: 1, d: .6, rh: 'oom', amb: ['birds'] },
    sakura: { sc: 'hira', r: 57, bpm: 70, sig: 4, lead: 'koto', l2: 'flute', pad: null, d: .4, rh: 'wood', amb: ['wind', 'chimes'] },
    autumn: { sc: 'pmin', r: 57, bpm: 72, sig: 4, lead: 'flute', pad: 'warm', d: .4, amb: ['wind'] },
    mountain: { sc: 'pmaj', r: 62, bpm: 74, sig: 4, lead: 'horn', l2: 'flute', pad: 'warm', d: .25, amb: ['wind'] },
    desert: { sc: 'hijaz', r: 62, bpm: 84, sig: 4, lead: 'oud', pad: 'warm', bass: 1, d: .45, rh: 'tab', amb: ['wind', 'sun', 'caravan'] },
    candy: { sc: 'maj', r: 72, bpm: 112, sig: 4, lead: 'kalimba', l2: 'music', pad: null, bass: 1, d: .65, amb: ['sparkle'] },
    ocean: { sc: 'pmaj', r: 62, bpm: 72, sig: 4, lead: 'bell', pad: 'glass', d: .3, amb: ['deepwaves'] },
    sky: { sc: 'lyd', r: 65, bpm: 80, sig: 4, lead: 'harp', pad: 'glass', d: .45, amb: ['wind'] },
    space: { sc: 'whole', r: 60, bpm: 72, sig: 4, lead: 'bell', pad: 'glass', d: .3, amb: ['space'] },
    bamboo: { sc: 'yo', r: 62, bpm: 72, sig: 4, lead: 'flute', l2: 'koto', pad: null, d: .35, rh: 'wood', amb: ['wind', 'birds', 'chimes'] },
    savanna: { sc: 'pmin', r: 64, bpm: 96, sig: 4, lead: 'kalimba', pad: null, bass: 1, d: .5, rh: 'tab', amb: ['birds', 'night'] },
    jungle: { sc: 'pmin', r: 62, bpm: 104, sig: 4, lead: 'marimba', pad: null, bass: 1, d: .55, rh: 'shaker', amb: ['birds', 'night', 'brook'] },
    village: { sc: 'maj', r: 65, bpm: 92, sig: 4, lead: 'pluck', l2: 'flute', pad: 'warm', bass: 1, d: .5, amb: ['birds'] },
    funfair: { sc: 'maj', r: 72, bpm: 112, sig: 3, lead: 'accord', l2: 'bell', pad: null, bass: 1, d: .7, rh: 'oom', amb: [] },
    arctic: { sc: 'whole', r: 64, bpm: 72, sig: 4, lead: 'music', pad: 'glass', d: .25, amb: ['wind', 'wind'] },
    pirate: { sc: 'min', r: 57, bpm: 108, sig: 3, lead: 'accord', pad: null, bass: 1, d: .55, rh: 'oom', amb: ['waves'] },
    dino: { sc: 'pmin', r: 60, bpm: 76, sig: 4, lead: 'horn', pad: null, bass: 1, d: .4, rh: 'tab', amb: ['night', 'birds'] },
    volcano: { sc: 'phryg', r: 62, bpm: 72, sig: 4, lead: 'horn', l2: 'oud', pad: 'warm', bass: 1, d: .4, rh: 'drum', amb: ['fire'] },
    cyber: { sc: 'pmin', r: 57, bpm: 120, sig: 4, lead: 'synth', pad: 'glass', bass: 1, d: .8, rh: 'tick', amb: ['hum'] },
    vietnam: { sc: 'yo', r: 67, bpm: 76, sig: 4, lead: 'dan', l2: 'koto', pad: null, d: .45, rh: 'wood', amb: ['birds'] },
    thailand: { sc: 'pmaj', r: 62, bpm: 88, sig: 4, lead: 'marimba', l2: 'bell', pad: null, d: .6, rh: 'gong', amb: ['birds', 'temple'] },
    japan: { sc: 'hira', r: 57, bpm: 78, sig: 4, lead: 'koto', l2: 'flute', pad: null, d: .35, rh: 'wood', amb: ['wind', 'temple'] },
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
    egypt: { sc: 'hijaz', r: 60, bpm: 80, sig: 4, lead: 'oud', l2: 'flute', pad: null, d: .45, rh: 'tab', amb: ['wind', 'sun'] },
    morocco: { sc: 'hijaz', r: 57, bpm: 92, sig: 4, lead: 'oud', l2: 'banjo', pad: null, bass: 1, d: .5, rh: 'tab', amb: ['wind'] },
    spain: { sc: 'hijaz', r: 52, bpm: 150, sig: 3, lead: 'oud', l2: 'mandolin', pad: null, bass: 1, d: .6, rh: 'clap', amb: [] },
    russia: { sc: 'hmin', r: 57, bpm: 112, sig: 4, lead: 'balalaika', l2: 'accord', pad: null, bass: 1, d: .55, rh: 'drum', amb: ['wind'] },
    ireland: { sc: 'mix', r: 62, bpm: 150, sig: 3, lead: 'whistle', l2: 'harp', pad: null, d: .6, rh: 'jig', amb: ['wind', 'birds'] },
    norway: { sc: 'dor', r: 55, bpm: 100, sig: 4, lead: 'fiddle', l2: 'music', pad: 'warm', d: .5, amb: ['wind', 'waves'] },
    peru: { sc: 'pmin', r: 57, bpm: 104, sig: 4, lead: 'panpipe', l2: 'charango', pad: null, d: .55, rh: 'drum', amb: ['wind'] },
    argentina: { sc: 'hmin', r: 57, bpm: 120, sig: 4, lead: 'bandoneon', l2: 'pluck', pad: null, bass: 1, d: .6, rh: 'tango', amb: [] },
    cuba: { sc: 'maj', r: 60, bpm: 112, sig: 4, lead: 'marimba', l2: 'pluck', pad: null, bass: 1, d: .65, rh: 'conga', amb: ['waves'] },
    chile: { sc: 'maj', r: 62, bpm: 132, sig: 3, lead: 'pluck', l2: 'flute', pad: null, bass: 1, d: .6, rh: 'tick', amb: ['wind', 'waves'] },
    kenya: { sc: 'pmaj', r: 60, bpm: 108, sig: 4, lead: 'kalimba', l2: 'marimba', pad: null, d: .65, rh: 'djembe', amb: ['birds'] },
    southafrica: { sc: 'pmaj', r: 57, bpm: 100, sig: 4, lead: 'marimba', l2: 'harp', pad: 'warm', bass: 1, d: .6, rh: 'djembe', amb: ['birds'] },
    ethiopia: { sc: 'ambassel', r: 59, bpm: 92, sig: 4, lead: 'masenqo', l2: 'kalimba', pad: null, d: .5, rh: 'tab', amb: ['wind'] },
    madagascar: { sc: 'pmaj', r: 62, bpm: 150, sig: 3, lead: 'valiha', l2: 'kalimba', pad: null, d: .7, rh: 'salegy', amb: ['birds', 'waves'] }
  };
  /* Giai điệu "đặc trưng quốc gia" soạn riêng cho từng khu quốc gia: mỗi câu dài 2 ô nhịp, dạng "bước:cao độ(nửa cung so với nốt gốc):độ dài" — câu A và câu B xen kẽ.
     Mỗi khu dùng thang âm + nhạc cụ + nhịp điệu của nước đó (flamenco 12 phách, jig 6/8 Ai-len, tango, son Cuba, salegy Madagascar, thang âm 5 nốt Andes/Ethiopia...). Đây là các câu nhạc tự soạn, không trích bản nhạc có bản quyền. */
  var MEL = {
    vietnam: ['0:7:3 3:9:1 4:12:2 6:9:1 7:7:1 8:5:3 11:2:1 12:0:4', '0:12:3 3:14:1 4:12:2 6:9:1 7:7:1 8:9:3 11:7:1 12:5:2 14:0:2'],
    thailand: ['0:7:1 1:9:1 2:12:1 3:9:1 4:7:2 6:4:1 7:2:1 8:4:1 9:7:1 10:9:2 12:12:3', '0:12:1 1:14:1 2:16:1 3:14:1 4:12:2 6:9:1 7:7:1 8:9:1 9:12:1 10:14:2 12:12:3'],
    japan: ['0:7:3 4:8:2 6:7:1 7:3:1 8:2:3 12:0:4', '0:12:3 4:14:2 6:15:1 7:14:1 8:12:2 10:8:2 12:7:4'],
    china: ['0:9:2 2:12:2 4:14:1 5:12:1 6:9:2 8:7:1 9:9:1 10:12:2 12:9:4', '0:14:2 2:16:2 4:19:1 5:16:1 6:14:2 8:12:1 9:14:1 10:16:2 12:12:4'],
    india: ['0:0:2 2:1:1 3:4:2 5:5:1 6:7:3 9:5:1 10:4:1 11:1:1 12:0:3', '0:7:2 2:8:1 3:11:2 5:12:1 6:11:2 8:8:1 9:7:1 10:5:1 11:4:1 12:0:3'],
    indonesia: ['0:7:2 2:8:2 4:7:2 6:3:2 8:1:2 10:3:2 12:0:4', '0:12:2 2:13:2 4:12:2 6:8:2 8:7:2 10:3:2 12:0:4'],
    france: ['0:12:2 2:11:1 3:9:2 5:7:1 6:9:2 8:7:1 9:5:2 11:4:1', '0:7:2 2:9:1 3:11:2 5:12:1 6:11:2 8:9:1 9:7:2 11:5:1'],
    italy: ['0:7:1 1:8:1 2:11:1 3:12:1 4:11:1 5:8:1 6:7:1 7:8:1 8:11:1 9:12:2 11:7:1', '0:12:1 1:11:1 2:8:1 3:7:1 4:8:1 5:11:1 6:12:1 7:14:1 8:12:1 9:11:1 10:8:2'],
    netherlands: ['0:12:2 2:14:2 4:16:2 6:14:2 8:12:2 10:9:2 12:7:4', '0:7:2 2:9:2 4:11:2 6:12:2 8:14:2 10:12:2 12:7:4'],
    uk: ['0:7:2 2:9:1 3:10:1 4:12:2 6:10:1 7:9:1 8:7:2 10:5:1 11:3:1 12:2:3', '0:12:2 2:14:1 3:15:1 4:17:2 6:15:1 7:14:1 8:12:2 10:10:1 11:9:1 12:7:3'],
    germany: ['0:7:1 1:7:1 2:9:2 4:11:2 6:12:2 8:11:1 9:9:1 10:7:2 12:4:1 13:5:1 14:7:2', '0:12:1 1:12:1 2:14:2 4:16:2 6:17:2 8:16:1 9:14:1 10:12:2 12:7:2 14:4:2'],
    usa: ['0:7:1 1:10:1 2:12:2 4:10:1 5:7:1 6:6:1 7:5:2 9:3:1 10:0:2 12:3:1 13:5:1 14:7:2', '0:12:1 1:15:1 2:17:2 4:15:1 5:12:1 6:10:1 7:7:2 9:5:1 10:3:1 11:0:1 12:3:1 13:0:3'],
    greece: ['0:7:1 1:8:1 2:7:1 3:5:1 4:4:2 6:1:1 7:0:1 8:1:1 9:4:1 10:5:1 11:7:2 13:5:1 14:4:2', '0:12:1 1:13:1 2:12:1 3:10:1 4:8:2 6:7:1 7:5:1 8:7:1 9:8:1 10:10:1 11:12:2 13:8:1 14:7:2'],
    sweden: ['0:7:3 3:9:1 4:10:1 5:9:1 6:7:3 9:5:1 10:3:1 11:2:1', '0:12:3 3:10:1 4:9:1 5:7:1 6:5:3 9:3:1 10:2:1 11:0:1'],
    switzerland: ['0:0:3 3:4:1 4:7:3 7:4:1 8:7:2 10:9:2 12:7:4', '0:7:3 3:12:1 4:16:3 7:12:1 8:9:2 10:7:2 12:4:4'],
    korea: ['0:7:3 3:9:1 4:12:2 6:9:1 7:7:1 8:5:2 10:7:2 12:9:1 13:7:1 14:5:2', '0:12:3 3:14:1 4:12:2 6:9:2 8:7:2 10:5:2 12:2:1 13:0:3'],
    turkey: ['0:7:1 1:8:1 2:7:1 3:5:2 5:4:1 6:5:1 7:7:2 9:8:1 10:7:1 11:5:1 12:4:3', '0:12:1 1:13:1 2:12:1 3:10:2 5:8:1 6:10:1 7:12:2 9:13:1 10:12:1 11:10:1 12:8:3'],
    australia: ['0:7:2 2:9:2 4:12:3 7:9:1 8:7:2 10:4:2 12:0:4', '0:12:2 2:14:2 4:16:3 7:14:1 8:12:2 10:9:2 12:7:4'],
    canada: ['0:7:2 2:9:1 3:11:1 4:12:2 6:11:1 7:9:1 8:7:2 10:4:2 12:7:2 14:5:2', '0:12:2 2:14:1 3:16:1 4:17:2 6:16:1 7:14:1 8:12:2 10:9:2 12:7:2 14:0:2'],
    mexico: ['0:12:1 1:12:1 2:11:1 3:9:2 5:7:1 6:9:1 7:11:1 8:12:2 10:9:1 11:7:1', '0:7:1 1:7:1 2:9:1 3:11:2 5:12:1 6:14:1 7:12:1 8:11:2 10:9:1 11:7:1'],
    brazil: ['0:7:1 2:9:1 3:12:1 5:9:1 6:7:1 8:4:1 10:7:1 11:9:2 13:12:1 14:9:2', '0:12:1 2:14:1 3:16:1 5:14:1 6:12:1 8:9:1 10:12:1 11:14:2 13:16:1 14:12:2'],
    egypt: ['0:7:2 2:8:1 3:7:1 4:5:2 6:4:2 8:5:1 9:7:1 10:8:2 12:7:3', '0:12:2 2:13:1 3:12:1 4:10:2 6:8:2 8:7:1 9:8:1 10:10:2 12:12:3'],
    morocco: ['0:4:2 2:5:1 3:7:1 4:8:2 6:7:1 7:5:1 8:4:2 10:1:1 11:0:1 12:1:3', '0:12:2 2:13:1 3:12:1 4:10:2 6:8:2 8:7:1 9:8:1 10:7:2 12:4:3'],
    spain: ['0:12:2 2:13:1 3:12:1 4:10:2 6:8:1 7:7:1 8:5:2 10:4:1 11:0:1', '0:7:1 1:8:1 2:7:2 4:5:1 5:4:1 6:5:2 8:7:1 9:8:1 10:7:1 11:12:1'],
    russia: ['0:7:2 2:8:1 3:7:1 4:5:2 6:3:2 8:2:1 9:3:1 10:5:2 12:3:2 14:0:2', '0:12:2 2:11:1 3:12:1 4:8:2 6:7:2 8:5:1 9:7:1 10:8:2 12:7:2 14:0:2'],
    ireland: ['0:7:1 1:9:1 2:7:1 3:4:1 4:2:1 5:4:1 6:7:1 7:9:1 8:12:1 9:9:1 10:7:1 11:9:1', '0:12:1 1:14:1 2:12:1 3:9:1 4:7:1 5:9:1 6:12:2 8:9:1 9:7:1 10:4:1 11:2:1'],
    norway: ['0:0:2 2:3:1 3:5:1 4:7:2 6:5:1 7:3:1 8:2:2 10:3:1 11:2:1 12:0:3', '0:7:2 2:10:1 3:9:1 4:7:2 6:5:1 7:7:1 8:5:2 10:3:1 11:2:1 12:0:3'],
    peru: ['0:12:2 2:10:1 3:7:1 4:5:2 6:7:1 7:5:1 8:3:2 10:5:1 11:3:1 12:0:3', '0:7:2 2:10:1 3:12:1 4:15:2 6:12:1 7:10:1 8:7:2 10:5:1 11:3:1 12:0:3'],
    argentina: ['0:7:2 2:8:1 3:11:1 4:12:3 7:11:1 8:8:2 10:7:1 11:5:1 12:3:3', '0:12:2 2:11:1 3:8:1 4:7:3 7:5:1 8:3:2 10:5:1 11:7:1 12:0:3'],
    cuba: ['0:7:1 1:7:1 3:9:1 4:12:2 6:9:1 7:7:1 8:4:2 10:7:1 11:9:1 12:7:2 14:4:2', '0:12:1 1:12:1 3:14:1 4:16:2 6:14:1 7:12:1 8:9:2 10:12:1 11:14:1 12:12:2 14:7:2'],
    chile: ['0:7:1 1:9:1 2:11:1 3:12:2 5:11:1 6:9:1 7:7:1 8:9:2 10:7:1 11:4:1', '0:12:1 1:11:1 2:9:1 3:7:2 5:9:1 6:11:1 7:12:1 8:14:2 10:12:1 11:7:1'],
    kenya: ['0:7:1 1:9:1 2:12:1 3:9:1 4:7:1 5:4:1 6:7:2 8:9:1 9:12:1 10:14:1 11:12:1 12:9:1 13:7:1 14:4:2', '0:12:1 1:14:1 2:16:1 3:14:1 4:12:1 5:9:1 6:12:2 8:14:1 9:16:1 10:19:1 11:16:1 12:14:1 13:12:1 14:9:2'],
    southafrica: ['0:7:2 2:9:1 3:12:1 4:9:2 6:7:1 7:4:1 8:7:2 10:9:2 12:12:3', '0:12:2 2:14:1 3:16:1 4:14:2 6:12:1 7:9:1 8:7:2 10:4:2 12:0:3'],
    ethiopia: ['0:7:2 2:8:1 3:7:1 4:5:3 7:1:1 8:0:2 10:1:1 11:5:1 12:7:3', '0:12:2 2:13:1 3:12:1 4:8:3 7:7:1 8:5:2 10:7:1 11:8:1 12:12:3'],
    madagascar: ['0:7:1 1:9:1 2:12:1 3:9:1 4:7:2 6:4:1 7:7:1 8:9:1 9:12:1 10:14:2', '0:12:1 1:14:1 2:16:1 3:14:1 4:12:2 6:9:1 7:12:1 8:14:1 9:16:1 10:19:2']
  };
  /* hệ số cân bằng âm lượng từng khu (đo bằng cách dựng thử từng cảnh nhạc) để khu nào cũng nghe vừa tai như nhau */
  var TRIM = {"map":1.46,"cottage":1.12,"hill":0.94,"river":1.16,"pond":1.21,"forest":0.87,"palace":1.32,"winter":1.18,"beach":0.92,"magic":1.11,"farm":1.23,"sakura":1.03,"autumn":0.97,"mountain":0.59,"desert":1.24,"candy":1.05,"ocean":1.03,"sky":1.21,"space":0.92,"bamboo":0.85,"savanna":1.28,"jungle":1.44,"village":1.08,"funfair":0.92,"arctic":1.26,"pirate":0.88,"dino":0.67,"volcano":0.67,"cyber":1.18,"vietnam":1.25,"thailand":1.46,"japan":1.18,"china":1.37,"india":1.52,"indonesia":1.17,"france":1.15,"italy":1.11,"netherlands":1.14,"uk":1.24,"germany":0.98,"usa":1.09,"greece":0.97,"sweden":1.37,"switzerland":0.52,"korea":1.15,"turkey":1.04,"australia":0.6,"canada":0.96,"mexico":1.04,"brazil":1.08,"egypt":1.07,"morocco":1.13,"spain":1.05,"russia":1.37,"ireland":0.98,"norway":1.21,"peru":0.59,"argentina":1.01,"cuba":0.97,"chile":0.78,"kenya":1.11,"southafrica":1.61,"ethiopia":0.98,"madagascar":0.86};
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
    whistle: function (E, d, f, t, dur, v) { sustain(E, d, f * 2, t, Math.max(.28, dur * .9), v * .5, { type: 'sine', type2: 'triangle', det: 1.003, att: .03, vib: 5.5, vd: 5, breath: 1, cut: 5200 }); },
    panpipe: function (E, d, f, t, dur, v) { sustain(E, d, f, t, Math.max(.4, dur), v * .8, { type: 'sine', type2: 'triangle', det: 1.001, att: .07, vib: 0, vd: 0, breath: 1, cut: 3200 }); },
    charango: function (E, d, f, t, dur, v) { var n = Math.max(2, Math.min(4, Math.round(dur / .1))), k; for (k = 0; k < n; k++) pluckV(E, d, f * 2, t + k * .06, .2, v * (k ? .5 : .8), { type: 'triangle', type2: 'square', cut: 6200, q: 2 }); },
    balalaika: function (E, d, f, t, dur, v) { var n = Math.max(3, Math.min(7, Math.round(dur / .07))), k; for (k = 0; k < n; k++) pluckV(E, d, f, t + k * .06, .16, v * (k ? .5 : .85), { type: 'triangle', type2: 'sawtooth', cut: 4200, q: 2 }); },
    bandoneon: function (E, d, f, t, dur, v) { sustain(E, d, f, t, Math.max(.35, dur), v * .55, { type: 'sawtooth', type2: 'square', det: 1.008, att: .05, cut: 1700, vib: 5, vd: 6 }); },
    valiha: function (E, d, f, t, dur, v) { pluckV(E, d, f, t, 1.3, v * .9, { type: 'triangle', cut: 6000, q: 2 }); partials(E, d, f, t, .8, v * .25, [2, 3.01], [1, .5]); },
    fiddle: function (E, d, f, t, dur, v) { sustain(E, d, f, t, Math.max(.3, dur), v * .5, { type: 'sawtooth', att: .04, cut: 2900, vib: 6, vd: 9 }); },
    masenqo: function (E, d, f, t, dur, v) { sustain(E, d, f, t, Math.max(.5, dur), v * .5, { type: 'sawtooth', type2: 'square', det: 1.01, att: .09, cut: 1900, vib: 5, vd: 22 }); },
    dan: function (E, d, f, t, dur, v) { var c = E.ctx, g = g0(c, d, t, v * .75, Math.max(.9, dur * 1.4), .02), o = c.createOscillator(), l = c.createOscillator(), lg = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(f * .955, t); o.frequency.exponentialRampToValueAtTime(f, t + .16); l.frequency.value = 4.2; lg.gain.value = 14; l.connect(lg); lg.connect(o.detune); o.connect(g); o.start(t); l.start(t); o.stop(t + dur * 1.4 + 1); l.stop(t + dur * 1.4 + 1); partials(E, d, f, t, .5, v * .2, [2, 3], [1, .5]); }
  };
  function drumV(E, d, t, v, f0, f1, dur) { var c = E.ctx, o = c.createOscillator(), g = g0(c, d, t, v, dur || .22, .004); o.type = 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + (dur || .22) * .9); o.connect(g); o.start(t); o.stop(t + (dur || .22) + .05); }
  function noiseV(E, d, t, v, dur, type, f, q) { var c = E.ctx, n = c.createBufferSource(), fl = c.createBiquadFilter(), g = g0(c, d, t, v, dur, .003); n.buffer = E.white; fl.type = type; fl.frequency.value = f; fl.Q.value = q || .7; n.connect(fl); fl.connect(g); n.start(t, Math.random() * 1.5); n.stop(t + dur + .02); }
  function padV(E, d, freqs, t, dur, v, kind) {
    var c = E.ctx, lp = c.createBiquadFilter(), g = c.createGain(), type = 'sawtooth', cut = 900, rise = Math.min(1.4, dur * .4), k, j, out = lp;
    if (kind === 'glass') { type = 'triangle'; cut = 2400; } else if (kind === 'drone') { type = 'triangle'; cut = 700; rise = Math.min(2.2, dur * .5); }
    else if (kind === 'organ') { type = 'square'; cut = 1100; v *= .7; } else if (kind === 'string') { type = 'sawtooth'; cut = 1500; rise = Math.min(1.8, dur * .5); v *= .8; }
    if (kind === 'bowl') { rise = Math.min(1.6, dur * .4); freqs.forEach(function (f) { [[1, 1], [2.76, .22], [5.4, .08]].forEach(function (q) { for (j = -1; j <= 1; j += 2) { var gb = g0(c, d, t, v * q[1] * .5, dur + 1, rise); osc(c, 'sine', f * q[0] * (1 + j * .002), t, dur + 1.3, gb); } }); }); return; }
    lp.type = 'lowpass'; lp.frequency.value = cut; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + rise); g.gain.setValueAtTime(v, t + dur * .6); g.gain.exponentialRampToValueAtTime(.0001, t + dur + 1.2);
    if (kind === 'choir') { [700, 1150].forEach(function (fc) { var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = fc; bp.Q.value = 3; lp.connect(bp); bp.connect(g); }); } else lp.connect(g);
    g.connect(d);
    freqs.forEach(function (f) { for (j = -1; j <= 1; j += 2) osc(c, type, f * (1 + j * .004), t, dur + 1.3, lp); });
  }
  /* các tiếng gõ/trống: (E, đích, thời điểm, độ mạnh, {r: nốt gốc của hợp âm hiện tại, cp: nốt hợp âm trung}) */
  var HIT = {
    kick: function (E, d, t, v) { drumV(E, d, t, .15 * v, 160, 70, .16); },
    taiko: function (E, d, t, v) { drumV(E, d, t, .22 * v, 120, 48, .3); },
    tom: function (E, d, t, v) { drumV(E, d, t, .14 * v, 220, 110, .17); },
    low: function (E, d, t, v) { drumV(E, d, t, .16 * v, 150, 80, .2); },
    conga: function (E, d, t, v) { drumV(E, d, t, .13 * v, 270, 180, .12); },
    bongo: function (E, d, t, v) { drumV(E, d, t, .09 * v, 430, 310, .08); },
    tek: function (E, d, t, v) { noiseV(E, d, t, .05 * v, .05, 'bandpass', 2400, 2); },
    tak: function (E, d, t, v) { noiseV(E, d, t, .045 * v, .04, 'bandpass', 3400, 3); },
    hat: function (E, d, t, v) { noiseV(E, d, t, .028 * v, .03, 'highpass', 7500); },
    shaker: function (E, d, t, v) { noiseV(E, d, t, .032 * v, .06, 'highpass', 6800); },
    wood: function (E, d, t, v) { drumV(E, d, t, .11 * v, 900, 520, .08); },
    block: function (E, d, t, v) { drumV(E, d, t, .08 * v, 1500, 1000, .05); },
    clap: function (E, d, t, v) { noiseV(E, d, t, .07 * v, .05, 'bandpass', 2600, 1.5); },
    ching: function (E, d, t, v) { noiseV(E, d, t, .035 * v, .13, 'highpass', 9000); partials(E, d, 3300, t, .25, .018 * v, [1, 1.5], [1, .5]); },
    sistrum: function (E, d, t, v) { var k; for (k = 0; k < 4; k++) noiseV(E, d, t + k * .03, .022 * v, .03, 'highpass', 6200); },
    hoof: function (E, d, t, v) { drumV(E, d, t, .08 * v, 560, 380, .05); drumV(E, d, t + .07, .06 * v, 480, 330, .05); },
    crash: function (E, d, t, v) { noiseV(E, d, t, .05 * v, .7, 'highpass', 5500); },
    gong: function (E, d, t, v, o) { VO.gamelan(E, d, mtof(o.r - 24), t, 3, .12 * v); },
    gongM: function (E, d, t, v, o) { VO.gamelan(E, d, mtof(o.r - 12 + (o.fifth ? 7 : 0)), t, 1.6, .1 * v); },
    gongH: function (E, d, t, v, o) { VO.gamelan(E, d, mtof(o.r), t, 1.1, .08 * v); },
    chime: function (E, d, t, v, o) { VO.bell(E, d, mtof(o.r + 24), t, 1.2, .045 * v); },
    stab: function (E, d, t, v, o) { VO.accord(E, d, mtof(o.cp), t, .3, .055 * v); }
  };

  /* Dựng "bài nhạc" dài từ hai câu A, B: các câu biến thể C…J + 2 nửa bài (nửa sau dịch bậc) → 32 đoạn × 2 ô nhịp */
  function buildForm(sc) {
    var L = sc.L, span = sc.bar * 2, lo = -3, hi = 2 * L + 3;
    var cl = function (d) { return Math.max(lo, Math.min(hi, d)); }, bys = function (x, y) { return x.s - y.s; };
    var clone = function (a) { return a.map(function (e) { return { s: e.s, deg: e.deg, len: e.len }; }); };
    var avg = function (a) { var t = 0; a.forEach(function (e) { t += e.deg; }); return a.length ? Math.round(t / a.length) : 0; };
    var shift = function (a, k) { return clone(a).map(function (e) { e.deg = cl(e.deg + k); return e; }); };
    var invert = function (a) { var m = avg(a); return clone(a).map(function (e) { e.deg = cl(2 * m - e.deg); return e; }); };
    var retro = function (a) { return clone(a).map(function (e) { e.s = Math.max(0, Math.min(span - 1, span - e.s - e.len)); return e; }).sort(bys); };
    var orn = function (a) { var occ = {}, out = clone(a); a.forEach(function (e) { occ[e.s] = 1; }); a.forEach(function (e) { if (e.len >= 2 && e.s > 0 && !occ[e.s - 1]) { out.push({ s: e.s - 1, deg: cl(e.deg + (e.s % 2 ? 1 : -1)), len: 1 }); occ[e.s - 1] = 1; } }); return out.sort(bys); };
    var answer = function (x, y) { var h = span / 2; return clone(x).filter(function (e) { return e.s < h; }).concat(clone(y).filter(function (e) { return e.s >= h; })).sort(bys); };
    var cad = function (a) { var o = clone(a); if (o.length) { var e = o[o.length - 1]; e.deg = Math.round(e.deg / L) * L; e.len = Math.max(e.len, 2); } return o; };
    var A = sc.A, B = sc.B, C = shift(B, 2), D = invert(A), E = orn(A), F = answer(A, B), G = retro(B), H = shift(A, -2), I = answer(B, A);
    var base = [
      { ph: A }, { ph: A }, { ph: B }, { ph: cad(A) },
      { ph: C, alt: 1 }, { ph: D, alt: 1 }, { ph: C, alt: 1 }, { ph: cad(B), alt: 1 },
      { ph: E, hi: 1 }, { ph: F, hi: 1 }, { ph: E, hi: 1 }, { ph: cad(B), hi: 1 },
      { ph: G }, { ph: H }, { ph: I }, { ph: cad(A) }
    ];
    // nửa sau: cùng cấu trúc nhưng dịch lên/xuống vài bậc → nghe như chuyển giọng, không lặp y nguyên
    var second = base.map(function (f, i) { var k = [1, 2, -1, 0][Math.floor(i / 4)]; return { ph: i % 4 === 3 ? cad(shift(f.ph, k)) : shift(f.ph, k), alt: f.alt, hi: f.hi }; });
    // đổi vai: câu cuối nửa sau là bản đảo của B để kết thúc khác lạ
    second[14] = { ph: invert(B) };
    var form = base.concat(second), unitSec = sc.step * span, sec = 2, ks = [[1, 2, -1, 0], [2, -2, 1, 3], [0, 3, -2, 1]];
    // bài nhanh thì ghép thêm đoạn biến tấu cho đủ ~2,5 phút mới quay lại từ đầu
    while (form.length * unitSec < 150 && form.length < 96) {
      var kk = ks[(sec - 2) % ks.length], from = sec % 2 ? base : second;
      form = form.concat(from.map(function (f, i) { var q = shift(f.ph, kk[Math.floor(i / 4)]); if (i % 3 === 0 && i % 4 !== 3) q = orn(q); return { ph: i % 4 === 3 ? cad(q) : q, alt: f.alt, hi: f.hi }; }));
      sec++;
    }
    return form;
  }

  /* Chọn hợp âm cho từng câu sao cho chứa nhiều nốt mạnh của giai điệu nhất → thảm nền, bass và chiêng luôn "ăn" với giai điệu */
  function fitChords(sc) {
    var L = sc.L, tri = L === 5 ? [0, 2, 3] : [0, 2, 4], out = [], prev = -1;
    sc.form.forEach(function (f, i) {
      if (sc.drone) { out.push(0); return; }
      var best = 0, bs = -99, c, pos = i % 4;
      for (c = 0; c < L; c++) {
        var set = {}, sco = 0; tri.forEach(function (k) { set[(c + k) % L] = 1; });
        f.ph.forEach(function (e, j) { var dg = ((e.deg % L) + L) % L, w = (e.s % sc.bar === 0 ? 3 : e.s % 2 === 0 ? 2 : 1) * (e.len >= 2 ? 1.4 : 1); if (j === 0 || j === f.ph.length - 1) w *= 1.6; if (set[dg]) sco += w; });
        if (c === 0 && (pos === 0 || pos === 3)) sco += 2.4; if (c === prev) sco -= .9;
        if (sco > bs) { bs = sco; best = c; }
      }
      out.push(best); prev = best;
    });
    return out;
  }
  /* sơ đồ năng lượng: mở đầu nhẹ → vào nhịp → cao trào → dịu lại, mỗi 4 câu một nấc */
  var ENG = [1, 2, 2, 3, 2, 3, 3, 2];
  function energy(fi, cyc, nUnits) { var g = Math.floor(fi / 4), e = ENG[g % ENG.length]; if (g === 0) e = cyc === 0 ? 1 : 2; if (g === Math.floor((nUnits - 1) / 4)) e = Math.min(e, 2); return e; }

  /* ───── cảnh nhạc ───── */
  P.scene = function (key, o) {
    o = o || {}; var E = this, c = E.ctx, now = c.currentTime, p = PROF[key] || PROF.map, ev = (o.events || []).join('+'), sk = key + '|' + ev + '|' + (o.night ? 'n' : 'd');
    if (E.cur && E.cur.sk === sk) return;
    if (E.cur) E.fade(E.cur);
    var sc = { sk: sk, key: key, p: p, night: !!o.night, ev: o.events || [], R: rng(hash(key) + 17), mus: c.createGain(), amb: c.createGain(), srcs: [], t0: now + .25, n: 0, ph: null, ev2: {} };
    sc.trim = TRIM[key] || 1; sc.mus.gain.setValueAtTime(.0001, now); sc.mus.gain.linearRampToValueAtTime(E.opt.mus ? sc.trim : 0, now + 1.6); sc.mus.connect(E.bus);
    sc.amb.gain.setValueAtTime(.0001, now); sc.amb.gain.linearRampToValueAtTime(E.opt.amb ? sc.trim : 0, now + 2.2); sc.amb.connect(E.out);
    var S = SC[p.sc], L = S.length; sc.S = S; sc.L = L; sc.step = 30 / p.bpm; sc.bar = p.sig * 2;
    var zg = ZG[key] || ['pulse', 'warm']; sc.gr = GR[zg[0]]; if (!sc.gr || sc.gr.s !== p.sig) sc.gr = GR[p.sig === 3 ? 'waltz' : 'pulse'] || { s: p.sig, n: '', c: {}, x: {}, b: '', f: 'tom' };
    sc.pad = zg[1] || 'warm'; sc.arp = zg[2] || null; sc.drone = sc.pad === 'drone';
    // độ "mạnh" của từng phách theo nhịp trống → giai điệu tự sinh sẽ rơi đúng vào các điểm nhấn của nhịp điệu
    var span0 = sc.bar * 2, acc = [], ai; for (ai = 0; ai < span0; ai++) { acc[ai] = 0; Object.keys(sc.gr.c).forEach(function (v) { var ch0 = sc.gr.c[v].charAt(ai); acc[ai] += ch0 === 'X' ? 3 : ch0 === 'x' ? 2 : ch0 === 'o' ? .5 : 0; }); }
    // hai câu nhạc (A, B) cùng nhịp, khác cao độ → lặp lại có biến tấu, dễ nhớ như một "chủ đề"
    var mk = function (R, base) {
      var on = [], deg = base, s0, ev2 = [];
      for (s0 = 0; s0 < span0; s0++) { var pr = s0 === 0 ? 1 : acc[s0] >= 2 ? .8 : s0 % 2 === 0 ? p.d * .95 : p.d * .4; if (R() < pr) on.push(s0); }
      if (on.length < 4) on = [0, Math.floor(span0 * .3), Math.floor(span0 * .55), Math.floor(span0 * .8)];
      on.forEach(function (st, i) {
        var tgt = base + Math.round(2.2 * Math.sin(Math.PI * st / span0)), r = R(); deg += deg < tgt ? (r < .66 ? 1 : -1) : deg > tgt ? (r < .66 ? -1 : 1) : (r < .5 ? 1 : -1); if (R() < .12) deg += R() < .5 ? 2 : -2;
        deg = Math.max(-3, Math.min(L + 3, deg)); var gap = (i + 1 < on.length ? on[i + 1] : span0) - st; ev2.push({ s: st, deg: deg, len: Math.max(1, Math.min(4, gap >= 3 ? gap - 1 : gap)) });
      });
      return ev2;
    };
    var pm = function (str) { return String(str).trim().split(/\s+/).map(function (x) { var q = x.split(':'); return { s: +q[0], st: +q[1], len: +q[2] || 1 }; }); };
    if (MEL[key]) { sc.A = pm(MEL[key][0]); sc.B = pm(MEL[key][1] || MEL[key][0]); } else { sc.A = mk(sc.R, 2); sc.B = mk(sc.R, 3); }
    // đổi sang "bậc thang âm" để biến tấu (dịch bậc, đảo, đọc ngược, thêm nốt luyến…) rồi ghép thành bài dài 32 đoạn ≈ 2–3 phút mới lặp lại
    var toDeg = function (e) { if (e.st == null) return e; var o = Math.floor(e.st / 12), pc = ((e.st % 12) + 12) % 12, bi = 0, bd = 99, q; for (q = 0; q < L; q++) { var dd = Math.abs(S[q] - pc); if (dd < bd) { bd = dd; bi = q; } } return { s: e.s, deg: o * L + bi, len: e.len }; };
    sc.A = sc.A.map(toDeg); sc.B = sc.B.map(toDeg); sc.form = buildForm(sc); sc.chords = fitChords(sc);
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
      else if (a === 'sun') { tone(mtof(p.r + 31), .012, mtof(p.r + 31) * 1.006); loop(E.pink, 'bandpass', 3000, 2, .012, .08, .008); }
      else if (a === 'tanpura') { /* dây đàn tanpura do sự kiện nốt thấp tạo ra */ }
    });
  };

  /* ───── bộ lập lịch: gọi pump(T) để sinh các nốt đến thời điểm T ───── */
  P.pump = function (T) {
    var E = this, sc = E.cur; if (!sc || sc.dead) return; var p = sc.p, S = sc.S, L = sc.L, V = VO[p.lead] || VO.pluck, V2 = p.l2 ? VO[p.l2] : null, st = sc.step;
    var note = function (deg, oct) { var o = Math.floor(deg / L), i = ((deg % L) + L) % L; return p.r + S[i] + 12 * (o + (oct || 0)); };
    var tri = function (c0) { var i3 = L === 5 ? [0, 2, 3] : [0, 2, 4]; return i3.map(function (k) { return c0 + k; }); };
    while (sc.t0 + sc.n * st < T) {
      var n = sc.n, t = sc.t0 + n * st, s = n % sc.bar, u2 = sc.bar * 2, s2 = n % u2, unit = Math.floor(n / u2), fi = unit % sc.form.length, cyc = Math.floor(unit / sc.form.length), fe = sc.form[fi], phrase = fe.ph, hiO = (fe.hi && cyc % 2 === 1) ? 1 : 0, VV = (fe.alt && V2 && cyc % 2 === 0) ? V2 : V;
      var e = energy(fi, cyc, sc.form.length), gr = sc.gr, chd = sc.chords[fi], eg = e === 1 ? .8 : e === 2 ? 1 : 1.15, fif = L === 5 ? 3 : 4;
      var ho = { r: note(chd, 0), cp: note(chd + (L === 5 ? 2 : 2), 1), fifth: sc.drone ? 1 : 0 };
      var hit = function (voice, ch, mul) { var f = HIT[voice]; if (!f || ch === '.' || ch === undefined || ch === '') return; var vel = (ch === 'X' ? 1.3 : ch === 'x' ? 1 : .5) * eg * (mul || 1) * (.92 + sc.R() * .16); f(E, sc.mus, t, vel, ho); };
      // 1) thảm nền: đổi hợp âm mỗi câu nhạc (2 ô nhịp)
      if (s2 === 0) { var pf = sc.drone ? [mtof(note(0, -2)), mtof(note(0, -2) + 7), mtof(note(0, -1))] : tri(chd).map(function (d) { return mtof(note(d, -1)); }); padV(E, sc.mus, pf, t, st * u2, sc.pad === 'bowl' ? .07 : .05, sc.pad); }
      // 2) bass bám đúng các điểm nhấn của nhịp trống
      if (e >= 1 && gr.b) { var bc = gr.b.charAt(s2); if (bc !== '.' && !(e === 1 && bc !== 'X')) { var bd = bc === '5' ? chd + fif : chd; pluckV(E, sc.mus, mtof(note(bd, bc === '8' ? -1 : -2)), t, bc === 'X' ? .7 : .45, (bc === 'X' ? .16 : .12) * (p.bass ? 1.1 : .85), { type: 'triangle', cut: 700 }); } }
      // 3) nhịp điệu đặc trưng của khu: lớp chính từ đoạn 2, lớp tô điểm ở cao trào
      if (e >= 1) Object.keys(gr.c).forEach(function (v) { hit(v, gr.c[v].charAt(s2), e === 1 ? .8 : 1); });
      if (e >= 2) Object.keys(gr.x).forEach(function (v) { hit(v, gr.x[v].charAt(s2), e === 3 ? 1.1 : .9); });
      // 4) luyến láy cuối mỗi 4 câu rồi "nổ" vào câu mới → các đoạn nối khít nhau
      if (e >= 2 && fi % 4 === 3 && s2 >= u2 - 4) { var fv = gr.f || 'tom', fvel = .55 + (s2 - (u2 - 4)) * .2; if (HIT[fv]) { HIT[fv](E, sc.mus, t, fvel * eg, ho); if (s2 >= u2 - 2) HIT[fv](E, sc.mus, t + st * .5, fvel * eg * .85, ho); } }
      if (e >= 2 && fi % 4 === 0 && s2 === 0 && !gr.c.gong) { HIT.crash(E, sc.mus, t, eg, ho); HIT.chime(E, sc.mus, t, 1, ho); }
      // 5) rải nốt arpeggio theo hợp âm (khu có chọn)
      if (sc.arp && VO[sc.arp] && e >= (sc.pad === 'organ' || sc.key === 'magic' ? 1 : 2) && s % (sc.key === 'cyber' ? 1 : 2) === 0) { var t3 = tri(chd), ai2 = (s2 / (sc.key === 'cyber' ? 1 : 2)) | 0; VO[sc.arp](E, sc.mus, mtof(note(t3[[0, 1, 2, 1][ai2 % 4]], 1)), t, st * 1.6, .06 * eg); }
      // 6) giai điệu chính: cao trào thì nhạc cụ phụ đệm thêm quãng 8 cao
      phrase.forEach(function (e0) { if (e0.s === s2) { var f = mtof(note(e0.deg, hiO)), len = e0.len * st; VV(E, sc.mus, f, t, len, .16 * (s2 === 0 ? 1.1 : .9)); if (V2 && (e >= 3 ? 1 : sc.R() < .38 * (e >= 2 ? 1 : .4))) V2(E, sc.mus, mtof(note(e0.deg + (sc.R() < .5 ? 2 : -1), 1 + hiO)), t + st * .5, len, e >= 3 ? .09 : .08); } });
      // lớp nhạc sự kiện
      sc.ev.forEach(function (id) {
        if (id === 'tet') { if (s % 4 === 0) drumV(E, sc.mus, t, .12, 150, 60, .22); if (s === 2) noiseV(E, sc.mus, t, .04, .04, 'bandpass', 3200, 3); if (s === 0 && Math.floor(n / sc.bar) % 4 === 0) VO.gamelan(E, sc.mus, mtof(p.r - 12), t, 3, .1); if (sc.R() < .22) VO.bell(E, sc.mus, mtof(p.r + 24 + [0, 2, 4, 7, 9][Math.floor(sc.R() * 5)]), t, 1, .05); }
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
      if (nx.cam === undefined) { nx.cam = T + 1; nx.tem = T + 4; nx.chm = T + 2; }
      if (nx.cam <= T && amb.indexOf('caravan') >= 0) { var tc = Math.max(nx.cam, E.ctx.currentTime), fc = 820 + R() * 260; partials(E, sc.amb, fc, tc, .5, .03, [1, 1.51, 2.36], [1, .5, .25]); partials(E, sc.amb, fc * 1.19, tc + .22, .5, .025, [1, 1.51, 2.36], [1, .5, .25]); nx.cam = T + 1.6 + R() * 2.6; }
      if (nx.tem <= T && amb.indexOf('temple') >= 0) { var tm = Math.max(nx.tem, E.ctx.currentTime); VO.gamelan(E, sc.amb, mtof(p.r + 12), tm, 3.2, .06); if (R() < .4) partials(E, sc.amb, mtof(p.r + 24), tm + .3, 4, .03, [1, 2.71, 5], [1, .3, .1]); nx.tem = T + 6 + R() * 6; }
      if (nx.chm <= T && amb.indexOf('chimes') >= 0) { var tq = Math.max(nx.chm, E.ctx.currentTime), cn = 2 + Math.floor(R() * 3), cq; for (cq = 0; cq < cn; cq++) VO.music(E, sc.amb, mtof(84 + SC.pmaj[Math.floor(R() * 5)]), tq + cq * .12, 1, .03); nx.chm = T + 1.8 + R() * 3.5; }
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
  var NAMES = { pluck: 'đàn dây gảy', koto: 'đàn koto', harp: 'đàn hạc', banjo: 'đàn banjo', oud: 'đàn oud', sitar: 'đàn sitar', mandolin: 'đàn mandolin', kalimba: 'đàn kalimba', marimba: 'đàn marimba', bell: 'chuông', music: 'hộp nhạc', gamelan: 'gamelan', carillon: 'chuông tháp', flute: 'sáo', horn: 'kèn alphorn', erhu: 'đàn nhị', accord: 'đàn accordion', synth: 'synthesizer', dan: 'đàn bầu', whistle: 'sáo tin whistle', panpipe: 'sáo pan Andes', charango: 'đàn charango', balalaika: 'đàn balalaika', bandoneon: 'đàn bandoneon', valiha: 'đàn valiha', fiddle: 'vĩ cầm dân gian', masenqo: 'đàn masenqo' };
  var AMBN = { waves: 'sóng vỗ', deepwaves: 'sóng biển sâu', wind: 'gió', brook: 'suối chảy', fire: 'lửa & dung nham', space: 'không gian', hum: 'tiếng máy', tanpura: 'dây tanpura', birds: 'chim hót', night: 'dế đêm', sparkle: 'ánh lấp lánh', sun: 'nắng sa mạc', caravan: 'chuông lạc đà', temple: 'chuông chùa', chimes: 'chuông gió' };
  function describe(key) { var p = PROF[key] || PROF.map, a = [NAMES[p.lead]]; if (p.l2 && p.l2 !== p.lead) a.push(NAMES[p.l2]); var gn = GR[(ZG[key] || [])[0]], m = a.join(' + ') + (gn ? ' + ' + gn.n : ''), e = (p.amb || []).filter(function (x, i, r) { return AMBN[x] && r.indexOf(x) === i; }).map(function (x) { return AMBN[x]; }); return m + (e.length ? ' · ' + e.join(', ') : ''); }
  var API = {
    Engine: Engine, PROF: PROF, GR: GR, ZG: ZG, SC: SC, describe: describe,
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
