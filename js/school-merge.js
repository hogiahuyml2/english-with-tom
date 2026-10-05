/* Ghép bài học do giáo viên/admin chỉnh sửa hoặc tạo mới (lưu trong DB) vào danh sách bài học có sẵn (data/school).
   SchoolExtra.ready(cb): tải /api/school/extra rồi cập nhật window.SCHOOL_INDEX; sau khi file lớp được nạp gọi SchoolExtra.applyLessons(). */
(function () {
  var X = window.SchoolExtra = { lessons: {}, hidden: [], loaded: false };
  function meta(id, L) { return { id: id, grade: L.grade, icon: L.icon, title: L.title, sub: L.sub, level: L.level, summary: L.summary, q: (L.quiz || []).length }; }
  function rebuild(extraIdx) {
    var base = (X.baseIndex || []).filter(function (l) { return X.hidden.indexOf(l.id) < 0; });
    base = base.map(function (l) { return X.lessons[l.id] ? meta(l.id, X.lessons[l.id]) : l; });
    Object.keys(X.lessons).forEach(function (id) { if (!base.some(function (l) { return l.id === id; })) base.push(meta(id, X.lessons[id])); });
    var order = base.map(function (l, i) { return [l, i]; });
    order.sort(function (a, b) { return a[0].grade - b[0].grade || a[1] - b[1]; });
    window.SCHOOL_INDEX = order.map(function (x) { return x[0]; });
  }
  X.ready = function (cb) {
    if (X.loaded) return cb();
    X.baseIndex = (window.SCHOOL_INDEX || []).slice();
    fetch('/api/school/extra', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      if (d) { X.lessons = d.lessons || {}; X.hidden = d.hidden || []; rebuild(); }
      X.loaded = true; cb();
    }).catch(function () { X.loaded = true; cb(); });
  };
  X.applyLessons = function () {
    var S = window.SCHOOL = window.SCHOOL || { lessons: {} };
    X.hidden.forEach(function (id) { delete S.lessons[id]; });
    Object.keys(X.lessons).forEach(function (id) { S.lessons[id] = Object.assign({ id: id }, X.lessons[id]); });
  };
  X.addPreview = function (id, L) { X.lessons[id] = L; X.hidden = X.hidden.filter(function (h) { return h !== id; }); rebuild(); };
})();
