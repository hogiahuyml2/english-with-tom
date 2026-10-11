// Tự suy ra lớp của đề/bộ từ cho học sinh vào lớp muộn.
// Quy tắc: nếu đề của giáo viên X đã được giao cho >= 50% các bạn còn lại trong lớp của giáo viên X thì coi là đề của lớp đó.
// (cứu trường hợp giáo viên tick từng học sinh thay vì chọn lớp, hoặc đề giao trước khi có tính năng ghi nhớ lớp)
module.exports = function infer(db, spec, userId) {
  const links = [];
  const groups = db.prepare('SELECT g.id, g.name, g.teacher_id FROM group_members gm JOIN groups g ON g.id=gm.group_id WHERE gm.user_id=?').all(userId);
  for (const g of groups) {
    const others = db.prepare('SELECT user_id FROM group_members WHERE group_id=? AND user_id IS NOT NULL AND user_id<>?').all(g.id, userId).map((r) => Number(r.user_id));
    if (others.length) {
      for (const t of db.prepare('SELECT id FROM ' + spec.tests + ' WHERE teacher_id=?').all(g.teacher_id)) {
        if (db.prepare('SELECT 1 x FROM ' + spec.grp + ' WHERE ' + spec.idcol + '=? AND group_id=?').get(t.id, g.id)) continue;
        const have = new Set(db.prepare('SELECT user_id FROM ' + spec.assign + ' WHERE ' + spec.idcol + '=?').all(t.id).map((r) => Number(r.user_id)));
        if (have.has(Number(userId))) continue;
        const hit = others.filter((u) => have.has(u)).length;
        if (hit >= 1 && hit / others.length >= 0.5) db.prepare('INSERT OR IGNORE INTO ' + spec.grp + ' (' + spec.idcol + ',group_id) VALUES (?,?)').run(t.id, g.id);
      }
    }
    links.push(g);
  }
  return links; // các lớp của học sinh — người gọi chạy hook giao bài cho từng lớp
};
