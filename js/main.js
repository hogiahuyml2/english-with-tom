/* English With Tom — header/footer dùng chung + tương tác nhẹ */
(function () {
  var page = document.body.getAttribute('data-page') || '';

  var homeIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px; margin-right:5px;"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>';

  var navItems = [
    { href: 'index.html', label: 'Trang chủ', key: 'home', icon: homeIcon },
    { href: 'dashboard.html', label: 'Tiến trình', key: 'dashboard' },
    { href: 'assigned.html', label: 'Bài tập được giao', key: 'assigned' },
    { href: 'ket.html', label: 'KET', key: 'ket' },
    { href: 'pet.html', label: 'PET', key: 'pet' },
    { href: 'fce.html', label: 'FCE', key: 'fce' },
    { href: 'ielts.html', label: 'IELTS', key: 'ielts' },
    { href: 'aptis.html', label: 'APTIS', key: 'aptis' },
    { href: 'practice.html', label: 'Luyện tập', key: 'practice' },
    { href: 'vocabulary.html', label: 'Học từ vựng', key: 'vocabulary' },
  ];

  var links = navItems.map(function (i) {
    var active = i.key === page ? ' class="active"' : '';
    return '<a href="' + i.href + '"' + active + '>' + (i.icon || '') + i.label + '</a>';
  }).join('');

  var header = '' +
    '<header class="site-header"><div class="container nav">' +
      '<a class="brand" href="index.html">' +
        '<span class="brand-logo">T</span>' +
        '<span>English With Tom<small>Luyện tập các kỹ năng ngôn ngữ</small></span>' +
      '</a>' +
      '<nav class="nav-links" id="navLinks">' + links + '</nav>' +
      '<div class="nav-actions" id="navActions">' +
        '<a class="btn btn-sm" href="login.html">Đăng nhập</a>' +
        '<a class="btn btn-primary btn-sm" href="login.html#register">Đăng ký</a>' +
        '<button class="menu-toggle" id="menuToggle" aria-label="Menu">☰</button>' +
      '</div>' +
    '</div></header>';

  var footer = '' +
    '<footer class="site-footer"><div class="container">' +
      '<div class="footer-grid">' +
        '<div>' +
          '<div class="brand" style="margin-bottom:12px;"><span class="brand-logo">T</span><span>English With Tom</span></div>' +
          '<p>Nền tảng luyện thi KET, PET, FCE, APTIS và IELTS với hệ thống chấm điểm tự động.</p>' +
        '</div>' +
        '<div><h4>Chương trình</h4>' +
          '<a href="ket.html">KET</a><a href="pet.html">PET</a><a href="fce.html">FCE</a><a href="aptis.html">APTIS</a><a href="ielts.html">IELTS</a>' +
        '</div>' +
        '<div><h4>Tài khoản</h4>' +
          '<a href="login.html">Đăng nhập</a><a href="dashboard.html">Tiến trình học</a><a href="exercises.html">Ngân hàng đề</a><a href="assigned.html">Bài tập được giao</a>' +
        '</div>' +
        '<div><h4>Giáo viên</h4>' +
          '<a href="teacher.html">Quản lý đề</a><a href="teacher.html">Giao bài tập</a><a href="teacher.html">Chấm bài</a>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">© 2026 English With Tom · Bản demo giao diện</div>' +
    '</div></footer>';

  var h = document.getElementById('site-header');
  var f = document.getElementById('site-footer');
  if (h) h.outerHTML = header;
  if (f) f.outerHTML = footer;

  var toggle = document.getElementById('menuToggle');
  if (toggle) toggle.addEventListener('click', function () {
    document.getElementById('navLinks').classList.toggle('open');
  });

  /* ===== Trạng thái đăng nhập + chặn quyền ===== */
  var roleLabel = { student: 'Học sinh', teacher: 'Giáo viên', admin: 'Quản trị' };
  fetch('/api/me', { credentials: 'same-origin' })
    .then(function (r) { return r.ok ? r.json() : { user: null }; })
    .then(function (d) { applyAuth(d.user); })
    .catch(function () { applyAuth(null); }); // chạy trên GitHub Pages (không có API) -> coi như chưa đăng nhập

  function applyAuth(user) {
    var actions = document.getElementById('navActions');
    if (actions) {
      if (user) {
        var initials = (user.name || '?').trim().split(/\s+/).slice(-1)[0].charAt(0).toUpperCase();
        var teacherLink = (user.role === 'teacher' || user.role === 'admin')
          ? '<a class="btn btn-sm" href="teacher.html">Khu vực giáo viên</a>' : '';
        var adminLink = (user.role === 'admin')
          ? '<a class="btn btn-sm" href="admin.html">Quản trị</a>' : '';
        actions.innerHTML =
          adminLink + teacherLink +
          '<a href="account.html" title="Tài khoản" style="display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--text-muted);text-decoration:none;cursor:pointer;">' +
            '<span style="width:30px;height:30px;border-radius:50%;background:var(--gradient);color:#fff;display:inline-grid;place-items:center;font-weight:600;">' + initials + '</span>' +
            '<span>' + user.name + '<br><small style="color:var(--text-faint);">' + (roleLabel[user.role] || user.role) + '</small></span>' +
          '</a>' +
          '<button class="btn btn-sm" id="logoutBtn">Đăng xuất</button>' +
          '<button class="menu-toggle" id="menuToggle2" aria-label="Menu">☰</button>';
        var lo = document.getElementById('logoutBtn');
        if (lo) lo.onclick = function () {
          fetch('/api/logout', { method: 'POST', credentials: 'same-origin' })
            .then(function () { location.href = 'index.html'; });
        };
        var mt2 = document.getElementById('menuToggle2');
        if (mt2) mt2.onclick = function () { document.getElementById('navLinks').classList.toggle('open'); };
      }
    }

    /* Chặn truy cập theo vai trò */
    var guard = document.body.getAttribute('data-guard');
    if (guard === 'auth' && !user) {
      location.href = 'login.html?next=' + encodeURIComponent(location.pathname.split('/').pop());
    } else if (guard === 'teacher' && (!user || user.role === 'student')) {
      location.href = 'login.html?next=teacher.html';
    } else if (guard === 'admin' && (!user || user.role !== 'admin')) {
      location.href = 'login.html?next=admin.html';
    }
  }

  /* Đồng hồ đếm ngược demo cho trang làm bài */
  var t = document.getElementById('timer');
  if (t) {
    var secs = 20 * 60;
    setInterval(function () {
      secs = Math.max(0, secs - 1);
      var m = Math.floor(secs / 60), s = secs % 60;
      t.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }, 1000);
  }
})();
