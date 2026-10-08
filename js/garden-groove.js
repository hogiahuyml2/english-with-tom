/* EWT Garden — NHỊP ĐIỆU ĐẶC TRƯNG & "PHÒNG THU" của từng khu vườn.
   Mỗi khu có: một bài nhịp (groove) riêng — cồng chiêng Tây Nguyên, chuông chùa Thái, vó lạc đà sa mạc, taiko Nhật, clave Cuba, flamenco…
   cùng loại thảm nền (pad) hợp màu sắc khu vườn và (tuỳ khu) lớp rải nốt arpeggio.
   Cách đọc mẫu nhịp: mỗi ký tự là một nốt móc đơn (1/8). Mẫu dài 2 ô nhịp = đúng một "câu nhạc":
     16 ký tự cho nhịp 4/4, 12 ký tự cho nhịp 3/4 (6/8).   X = đánh mạnh · x = vừa · o = nhẹ · . = nghỉ
   Bass: X/x gốc hợp âm · 5 = quãng 5 · 8 = quãng 8.   Các câu nhạc tự soạn, không trích bản nhạc có bản quyền.
   c = lớp nhịp chính (vào từ đoạn 2) · x = lớp tô điểm (vào ở đoạn cao trào) · f = nhạc cụ đánh luyến (fill) cuối mỗi 4 câu. */
(function (root) {
  'use strict';
  var GR = {
    // ───── 4/4 ─────
    pulse: { n: 'nhịp tim nhẹ', s: 4, c: { tom: 'X.....o.x.....o.', wood: '..o...o...o...o.' }, x: { shaker: 'o.x.o.x.o.x.o.x.' }, b: 'X.....5.x.....5.', f: 'tom' },
    heart: { n: 'nhịp thở sâu', s: 4, c: { low: 'X.......x.....o.' }, x: { chime: '....o.......o...', shaker: 'o...o...o...o...' }, b: 'X.......5.......', f: 'low' },
    glide: { n: 'nhịp bay lượn', s: 4, c: { tom: 'X.......o.......', wood: '..o...o...o...o.' }, x: { shaker: '.o.o.o.o.o.o.o.o', chime: '..o.......o.....' }, b: 'X.......5.......', f: 'chime' },
    folk: { n: 'nhịp đồng quê', s: 4, c: { kick: 'x...x...x...x...' }, x: { tek: '..x...x...x...x.', shaker: 'o.o.o.o.o.o.o.o.' }, b: 'X...5...x...5...', f: 'tom' },
    bounce: { n: 'nhịp nhảy vui', s: 4, c: { kick: 'X...X...X...X...', clap: '..x...x...x...x.' }, x: { hat: '.x.x.x.x.x.x.x.x', chime: 'o.......o.......' }, b: 'X.x.5.x.X.x.5.x.', f: 'clap' },
    blues: { n: 'nhịp blues', s: 4, c: { kick: 'X.....x.X.x...x.', clap: '..x...x...x...x.' }, x: { shaker: 'x.o.x.o.x.o.x.o.' }, b: 'X.5.x.5.X.5.x.8.', f: 'tom' },
    reggae: { n: 'nhịp reggae biển', s: 4, c: { kick: '....X.......X...', wood: '..x...x...x...x.' }, x: { shaker: '.x.x.x.x.x.x.x.x' }, b: 'X..x..5.x..x..5.', f: 'conga' },
    djembe: { n: 'trống djembe', s: 4, c: { low: 'X..x..x.x..x..x.', conga: '..x...x...x...x.' }, x: { tek: '..o.o...o.o.o...', shaker: 'o.o.o.o.o.o.o.o.' }, b: 'X..x..5.x..x..5.', f: 'conga' },
    township: { n: 'nhịp phố làng', s: 4, c: { kick: 'X...X...X...X...', clap: '..x...x...x...x.' }, x: { shaker: '.x.x.x.x.x.x.x.x', block: 'o..o..o.o..o..o.' }, b: 'X.x.5.x.X.x.5.x.', f: 'clap' },
    gallop: { n: 'vó thú phi', s: 4, c: { hoof: 'x.xx.xx.x.xx.xx.', low: 'X.......x.......' }, x: { shaker: 'o.o.o.o.o.o.o.o.' }, b: 'X..x..5.X..x..5.', f: 'tom' },
    stomp: { n: 'bước chân khổng lồ', s: 4, c: { taiko: 'X.......X...x...' }, x: { tom: '..o...o...o...o.', wood: 'o.o.o.o.o.o.o.o.' }, b: 'X.......5.......', f: 'taiko' },
    caravan: { n: 'vó lạc đà dưới nắng', s: 4, c: { hoof: 'x.x.x.x.x.x.x.x.', low: 'X.......x...x...' }, x: { tek: '..x...x...x.x...', shaker: 'o.o.o.o.o.o.o.o.' }, b: 'X.......5...x...', f: 'low' },
    maqsum: { n: 'trống darbuka', s: 4, c: { low: 'X...x...X...x...', tek: '.x.x..x..x.x..x.' }, x: { sistrum: 'x.......x.......', shaker: 'o.o.o.o.o.o.o.o.' }, b: 'X...x...X...5...', f: 'tek' },
    davul: { n: 'trống davul', s: 4, c: { low: 'X...x.x.X...x.x.', clap: '..x...x...x...x.' }, x: { tek: '.o.o.o.o.o.o.o.o', shaker: 'o.o.o.o.o.o.o.o.' }, b: 'X..x..x.X..x..5.', f: 'low' },
    gnawa: { n: 'krakeb Gnawa', s: 4, c: { low: 'X.....x.X..x....', ching: 'x.xx.xx.x.xx.xx.' }, x: { block: '..o...o...o...o.' }, b: 'X..x..x.X..x....', f: 'low' },
    hasapiko: { n: 'nhịp syrtaki', s: 4, c: { low: 'X...x.x.X...x.x.', clap: '..x...x...x...x.' }, x: { shaker: 'x.x.x.x.x.x.x.x.' }, b: 'X.5.x.5.X.5.x.8.', f: 'tom' },
    tabla: { n: 'trống tabla', s: 4, c: { low: 'X.......X.....x.', bongo: '..x.x.o...x.x.o.' }, x: { tak: 'o.o.o.o.o.o.o.o.', shaker: 'o...o...o...o...' }, b: 'X.......5.......', f: 'bongo' },
    gamelan: { n: 'dàn gamelan', s: 4, c: { gong: 'X...............', gongM: '....x.......x...', tom: 'X.o.x.o.X.o.x.o.' }, x: { chime: 'x.xx.x.xx.xx.x.x', gongH: '..x...x...x...x.' }, b: 'X.......5.......', f: 'tom' },
    vietnam: { n: 'cồng chiêng Tây Nguyên', s: 4, c: { gong: 'X.......x.......', gongM: '..x...x...x...x.', gongH: '....x.x.....x.x.' }, x: { wood: 'o.o.o.o.o.o.o.o.', tom: '..o...o...o...o.' }, b: 'X.......5.......', f: 'tom' },
    temple: { n: 'chuông & trống chùa', s: 4, c: { gong: 'X...............', chime: 'x.......x.......', tom: 'X.....x.x.....x.' }, x: { ching: 'o.x.o.x.o.x.o.x.', wood: 'o...o...o...o...' }, b: 'X.......5.......', f: 'tom' },
    festive: { n: 'trống chiêng lễ hội', s: 4, c: { tom: 'X...x...X.x.x...', gongM: 'X.......X.......' }, x: { ching: '..x...x...x...x.', block: 'o.o.o.o.o.o.o.o.' }, b: 'X...x...X...5...', f: 'tom' },
    taiko: { n: 'trống taiko & mõ', s: 4, c: { taiko: 'X.....o.......x.', wood: 'x...x...x...x...' }, x: { block: '..o.......o.....', chime: '........o.......' }, b: 'X.......5.......', f: 'taiko' },
    janggu: { n: 'trống janggu', s: 4, c: { low: 'X..o..x.o.X..o..', tak: '....x.......x...' }, x: { block: 'o.o.o.o.o.o.o.o.' }, b: 'X.......5...x...', f: 'low' },
    shishi: { n: 'ống tre gõ nhịp', s: 4, c: { wood: 'x.....o.x.....o.' }, x: { block: '..o...o...o...o.', chime: '........x.......' }, b: 'X.......5.......', f: 'block' },
    woodtap: { n: 'mõ & chuông hoa', s: 4, c: { wood: 'x.......x...x...' }, x: { block: '..o.......o.....', chime: 'o.......o.......' }, b: 'X.......5.......', f: 'wood' },
    electro: { n: 'nhịp điện tử', s: 4, c: { kick: 'X...X...X...X...' }, x: { hat: '.x.x.x.x.x.x.x.x', clap: '....x.......x...' }, b: 'X.x.X.x.X.x.X.x.', f: 'clap' },
    lava: { n: 'trống dung nham', s: 4, c: { taiko: 'X.......x..o....', low: '..o...o...o...o.' }, x: { tom: '....x...x...x.x.' }, b: 'X.......5.......', f: 'taiko' },
    sleigh: { n: 'chuông xe tuyết', s: 4, c: { tom: 'X.......x.......' }, x: { shaker: 'x.xx.xx.x.xx.xx.', chime: 'o...o...o...o...' }, b: 'X.......5.......', f: 'chime' },
    samba: { n: 'nhịp samba', s: 4, c: { low: '..X...X...X...X.', block: 'x.x.xx.x.x.xx.x.' }, x: { shaker: 'x.xx.xx.x.xx.xx.', tek: '.x.xx.x..x.xx.x.' }, b: 'X..x..5.X..x..5.', f: 'tek' },
    clog: { n: 'guốc gỗ & chuông tháp', s: 4, c: { wood: 'x...x...x...x...', kick: 'X.......x.......' }, x: { chime: 'o.......o.......', block: '..o...o...o...o.' }, b: 'X...5...X...5...', f: 'wood' },
    clapstick: { n: 'gõ que & didgeridoo', s: 4, c: { wood: 'x.o.x...x.o.x...', low: 'X.......X.......' }, x: { block: 'o.o.o.o.o.o.o.o.', shaker: 'o.o.o.o.o.o.o.o.' }, b: 'X.......5...x...', f: 'low' },
    oompah: { n: 'nhịp oom-pah', s: 4, c: { kick: 'x...x...x...x...', stab: '..x...x...x...x.' }, x: { shaker: 'o.o.o.o.o.o.o.o.', tek: '..o...o...o...o.' }, b: 'X...5...X...5...', f: 'tom' },
    trepak: { n: 'dậm chân trepak', s: 4, c: { kick: 'X..xX..xX..xX.x.', clap: '....x.......x...' }, x: { ching: '..o...o...o...o.' }, b: 'X..xX..xX..xX.x.', f: 'clap' },
    huayno: { n: 'huayno Andes', s: 4, c: { low: 'X..x.xX..x.xX...', tak: '..x...x...x...x.' }, x: { shaker: 'o.xo.xo.xo.xo.xo' }, b: 'X..x..5.x..x..5.', f: 'low' },
    tango: { n: 'tango marcato', s: 4, c: { kick: 'X..x..x.X..x..x.', block: '..x...x...x...x.' }, x: { clap: '....X.......X...' }, b: 'X..x..x.X..x..5.', f: 'block' },
    clave: { n: 'clave son Cuba', s: 4, c: { block: 'x..x..x...x.x...', conga: '..o.o.xx..o.o.xx' }, x: { shaker: 'x.x.x.x.x.x.x.x.', low: 'X.......X.......' }, b: '...X..x....X..x.', f: 'conga' },
    eskista: { n: 'nhịp eskista', s: 4, c: { low: 'X..x..x.X..x.x..', tak: '..o.o...o.o.o...' }, x: { shaker: 'o.o.o.o.o.o.o.o.' }, b: 'X..x..5.X..x.x5.', f: 'low' },
    // ───── 3/4 · 6/8 ─────
    waltz: { n: 'nhịp waltz', s: 3, c: { kick: 'X.....X.....', tek: '..x.x...x.x.' }, x: { shaker: 'o.o.o.o.o.o.' }, b: 'X...5.X...5.', f: 'tek' },
    carousel: { n: 'vòng quay ngựa gỗ', s: 3, c: { kick: 'X.....X.....', stab: '..x.x...x.x.' }, x: { chime: 'o.o.o.o.o.o.', hat: 'x.x.x.x.x.x.' }, b: 'X...5.X...5.', f: 'chime' },
    tarantella: { n: 'tarantella 6/8', s: 3, c: { low: 'X..o..x..o..', tek: '.xx.xx.xx.xx' }, x: { shaker: 'x.xx.xx.xx.x' }, b: 'X..x..5..x..', f: 'tek' },
    jig: { n: 'bodhran jig', s: 3, c: { low: 'X..x.xX..x.x', block: '..x.......x.' }, x: { shaker: 'o.o.o.o.o.o.' }, b: 'X.....5.....', f: 'low' },
    flamenco: { n: 'palmas flamenco 12 nhịp', s: 3, c: { low: 'X.....x.....', clap: '..X..x.x.x.X' }, x: { wood: 'o.o..o.o.o.o' }, b: 'X.....x...5.', f: 'clap' },
    huapango: { n: 'huapango', s: 3, c: { low: 'X..x..x.x.x.', tak: '..x.x...x...' }, x: { shaker: 'o.xo.xo.xo.x' }, b: 'X...5.x...5.', f: 'low' },
    cueca: { n: 'cueca', s: 3, c: { low: 'X.....x.x.x.', clap: '..x.x..x.x..' }, x: { shaker: 'x.xx.xx.xx.x' }, b: 'X..x..5..x..', f: 'clap' },
    shanty: { n: 'dậm chân hải tặc', s: 3, c: { kick: 'X.....X.....', clap: '..x.x...x.x.', wood: 'o.....o.....' }, x: { ching: 'o.o.o.o.o.o.' }, b: 'X.....5.X.5.', f: 'kick' },
    salegy: { n: 'salegy Madagascar', s: 3, c: { low: 'X..x..X..x..', tek: '..x..x..x..x' }, x: { hat: '.x..x..x..x.' }, b: 'X..x..5..x..', f: 'tek' }
  };
  /* khu → [bài nhịp, loại thảm nền hợp màu sắc, nhạc cụ rải nốt (tuỳ chọn)] */
  var ZG = {
    map: ['pulse', 'warm'], cottage: ['folk', 'warm'], hill: ['pulse', 'string'], river: ['pulse', 'glass', 'harp'], pond: ['pulse', 'glass', 'kalimba'], forest: ['pulse', 'choir'],
    palace: ['waltz', 'string', 'harp'], winter: ['sleigh', 'glass', 'bell'], beach: ['reggae', 'warm'], magic: ['glide', 'glass', 'bell'], farm: ['folk', 'warm'], sakura: ['woodtap', 'glass', 'music'],
    autumn: ['pulse', 'choir'], mountain: ['heart', 'drone'], desert: ['caravan', 'drone'], candy: ['bounce', 'glass', 'music'], ocean: ['heart', 'bowl', 'bell'], sky: ['glide', 'glass', 'harp'],
    space: ['heart', 'drone', 'bell'], bamboo: ['shishi', 'glass', 'kalimba'], savanna: ['gallop', 'drone'], jungle: ['djembe', 'drone'], village: ['folk', 'warm'], funfair: ['carousel', 'organ'],
    arctic: ['heart', 'glass', 'music'], pirate: ['shanty', 'drone'], dino: ['stomp', 'drone'], volcano: ['lava', 'drone'], cyber: ['electro', 'organ', 'synth'],
    vietnam: ['vietnam', 'drone'], thailand: ['temple', 'bowl'], japan: ['taiko', 'drone'], china: ['festive', 'string'], india: ['tabla', 'drone'], indonesia: ['gamelan', 'bowl'],
    france: ['waltz', 'string'], italy: ['tarantella', 'string'], netherlands: ['clog', 'organ'], uk: ['folk', 'string'], germany: ['oompah', 'organ'], usa: ['blues', 'warm'],
    greece: ['hasapiko', 'string'], sweden: ['waltz', 'string'], switzerland: ['oompah', 'organ'], korea: ['janggu', 'drone'], turkey: ['davul', 'drone'], australia: ['clapstick', 'drone'],
    canada: ['folk', 'warm'], mexico: ['huapango', 'warm'], brazil: ['samba', 'warm'], egypt: ['maqsum', 'drone'], morocco: ['gnawa', 'drone'], spain: ['flamenco', 'string'],
    russia: ['trepak', 'choir'], ireland: ['jig', 'drone'], norway: ['folk', 'choir'], peru: ['huayno', 'drone'], argentina: ['tango', 'string'], cuba: ['clave', 'warm'],
    chile: ['cueca', 'string'], kenya: ['djembe', 'warm'], southafrica: ['township', 'choir'], ethiopia: ['eskista', 'drone'], madagascar: ['salegy', 'glass']
  };
  root.EWTGroove = { GR: GR, ZG: ZG };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.EWTGroove;
})(typeof window !== 'undefined' ? window : this);
