/* English With Tom — header/footer dùng chung + tương tác nhẹ */

/* ===== DARK MODE — áp dụng trước khi render để tránh flash ===== */
(function () {
  var saved = localStorage.getItem('ewt-theme');
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

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
        '<img class="brand-logo" src="images/logo-icon.png" alt="EWT" onerror="this.outerHTML=\'<span class=&quot;brand-logo&quot;>T</span>\'">' +
        '<span>English With Tom<small>Luyện tập các kỹ năng ngôn ngữ</small></span>' +
      '</a>' +
      '<nav class="nav-links" id="navLinks">' + links + '</nav>' +
      '<div class="nav-actions" id="navActions">' +
        '<button class="dark-toggle" id="darkToggle" title="Chuyển chế độ sáng/tối" aria-label="Toggle dark mode"></button>' +
        '<a class="btn btn-sm" href="login.html">Đăng nhập</a>' +
        '<a class="btn btn-primary btn-sm" href="login.html#register">Đăng ký</a>' +
        '<button class="menu-toggle" id="menuToggle" aria-label="Menu">☰</button>' +
      '</div>' +
    '</div></header>';

  var footer = '' +
    '<footer class="site-footer"><div class="container">' +
      '<div class="footer-grid">' +
        '<div>' +
          '<img class="footer-seal" src="images/logo-seal.png" alt="English With Tom" onerror="this.outerHTML=\'<div class=&quot;brand&quot; style=&quot;margin-bottom:12px;&quot;><span class=&quot;brand-logo&quot;>T</span><span>English With Tom</span></div>\'">' +
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
      '<div class="footer-contact">' +
        '<div class="fc-inner">' +
          '<div class="fc-founder">' +
            '<img src="images/founder.jpg" alt="Gia Huy" class="fc-avatar" onerror="this.style.display=\'none\'">' +
            '<p class="fc-name">Gia Huy</p>' +
          '</div>' +
          '<div class="fc-links">' +
            '<a href="tel:+84937204068" class="fc-link fc-zalo" title="Zalo">💬</a>' +
            '<a href="https://www.facebook.com/giahuy.tom02/" target="_blank" class="fc-link fc-fb" title="Facebook (Gia Huy)">f</a>' +
            '<a href="https://www.facebook.com/EnglishwTom" target="_blank" class="fc-link fc-fb" title="Facebook (English With Tom)">f</a>' +
            '<a href="https://www.instagram.com/hg_huyy/" target="_blank" class="fc-link fc-ig" title="Instagram (Personal)">@</a>' +
            '<a href="https://www.instagram.com/eng.with.tom/" target="_blank" class="fc-link fc-ig" title="Instagram (Page)">@</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">© 2026 English With Tom</div>' +
    '</div></footer>';

  var h = document.getElementById('site-header');
  var f = document.getElementById('site-footer');
  if (h) h.outerHTML = header;
  if (f) f.outerHTML = footer;

  var toggle = document.getElementById('menuToggle');
  if (toggle) toggle.addEventListener('click', function () {
    document.getElementById('navLinks').classList.toggle('open');
  });

  /* ===== Dark mode toggle ===== */
  function isDark() { return document.documentElement.getAttribute('data-theme') === 'dark'; }
  function updateDarkBtn() {
    var b1 = document.getElementById('darkToggle');
    var b2 = document.getElementById('darkToggle2');
    var icon = isDark() ? '☀️' : '🌙';
    if (b1) b1.textContent = icon;
    if (b2) b2.textContent = icon;
  }
  function applyTheme(dark) {
    // Thêm class transition CHỈ trong lúc chuyển theme, xoá sau 300ms
    document.documentElement.classList.add('theme-transitioning');
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('ewt-theme', dark ? 'dark' : 'light');
    updateDarkBtn();
    setTimeout(function () {
      document.documentElement.classList.remove('theme-transitioning');
    }, 300);
  }
  updateDarkBtn();
  document.addEventListener('click', function (e) {
    if (e.target && (e.target.id === 'darkToggle' || e.target.id === 'darkToggle2')) {
      applyTheme(!isDark());
    }
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
          '<button class="dark-toggle" id="darkToggle2" title="Chuyển chế độ sáng/tối" aria-label="Toggle dark mode">' + (isDark() ? '☀️' : '🌙') + '</button>' +
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

  /* Demo timer removed — each practice page manages its own timer via G_timerTick/G_endTime */
})();

/* ===== PWA: Service Worker + Install Prompt ===== */
(function () {
  // Đăng ký service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(function () {});
  }

  // Bắt sự kiện beforeinstallprompt để hiện nút cài app
  var deferredInstall = null;
  var installDismissed = localStorage.getItem('ewt-pwa-dismissed');
  var dismissedRecently = installDismissed && (Date.now() - Number(installDismissed) < 7 * 24 * 60 * 60 * 1000);

  if (!dismissedRecently) {
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferredInstall = e;
      showInstallBanner();
    });
  }

  function showInstallBanner() {
    if (document.getElementById('pwaInstallBanner')) return;
    var banner = document.createElement('div');
    banner.id = 'pwaInstallBanner';
    banner.innerHTML =
      '<span style="flex:1">📱 <strong>Cài English With Tom</strong> lên màn hình chính — dùng offline!</span>' +
      '<button id="pwaInstallBtn" style="background:#fff;color:#6F58EE;border:none;border-radius:8px;padding:7px 16px;font-weight:700;cursor:pointer;white-space:nowrap;font-size:13px;">Cài ngay</button>' +
      '<button id="pwaInstallClose" style="background:none;border:none;color:rgba(255,255,255,.7);font-size:20px;cursor:pointer;line-height:1;padding:0 0 0 8px;">×</button>';
    banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:linear-gradient(90deg,#6F58EE,#9b59b6);color:#fff;display:flex;align-items:center;gap:12px;padding:14px 16px;z-index:9999;font-size:14px;box-shadow:0 -4px 20px rgba(111,88,238,.3);';
    document.body.appendChild(banner);

    document.getElementById('pwaInstallBtn').onclick = function () {
      if (!deferredInstall) return;
      deferredInstall.prompt();
      deferredInstall.userChoice.then(function () {
        deferredInstall = null;
        banner.remove();
      });
    };
    document.getElementById('pwaInstallClose').onclick = function () {
      banner.remove();
      localStorage.setItem('ewt-pwa-dismissed', Date.now());
    };
  }
})();
