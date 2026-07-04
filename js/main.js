/* English With Tom — header/footer dùng chung + tương tác nhẹ */

/* ===== FAVICON — inject sớm để hiện ngay khi load ===== */
(function () {
  if (!document.querySelector('link[rel="icon"]')) {
    var lnk = document.createElement('link');
    lnk.rel = 'icon'; lnk.type = 'image/png'; lnk.href = '/images/logo-icon.png';
    document.head.appendChild(lnk);
  }
  // Apple Touch Icon (nếu chưa có)
  if (!document.querySelector('link[rel="apple-touch-icon"]')) {
    var atl = document.createElement('link');
    atl.rel = 'apple-touch-icon'; atl.href = '/images/apple-touch-icon.png';
    document.head.appendChild(atl);
  }
})();

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

  var navItemsBefore = [
    { href: 'index.html', label: 'Trang chủ', key: 'home', icon: homeIcon },
    { href: 'dashboard.html', label: 'Tiến trình', key: 'dashboard' },
    { href: 'assigned.html', label: 'Bài tập được giao', key: 'assigned' },
  ];
  var programItems = [
    { href: 'ket.html', label: 'KET', key: 'ket' },
    { href: 'pet.html', label: 'PET', key: 'pet' },
    { href: 'fce.html', label: 'FCE', key: 'fce' },
    { href: 'ielts.html', label: 'IELTS', key: 'ielts' },
    { href: 'aptis.html', label: 'APTIS', key: 'aptis' },
  ];
  var navItemsAfter = [
    { href: 'practice.html', label: 'Luyện tập', key: 'practice' },
    { href: 'vocabulary.html', label: 'Học từ vựng', key: 'vocabulary' },
  ];

  function renderLink(i) {
    var active = i.key === page ? ' class="active"' : '';
    var idAttr = i.id ? ' id="' + i.id + '"' : '';
    return '<a href="' + i.href + '"' + active + idAttr + ' style="position:relative">' + (i.icon || '') + i.label + '</a>';
  }

  var isProgramActive = programItems.some(function (i) { return i.key === page; });
  var programDropdown =
    '<div class="nav-dropdown' + (isProgramActive ? ' active' : '') + '" id="navProgramDropdown">' +
      '<button type="button" class="nav-dropdown-toggle' + (isProgramActive ? ' active' : '') + '" id="navProgramToggle">Chương trình <span class="caret">▾</span></button>' +
      '<div class="nav-dropdown-menu">' + programItems.map(renderLink).join('') + '</div>' +
    '</div>';

  var links = navItemsBefore.map(renderLink).join('') + programDropdown + navItemsAfter.map(renderLink).join('');

  var header = '' +
    '<header class="site-header"><div class="container nav">' +
      '<a class="brand" href="index.html">' +
        '<img class="brand-logo" src="images/logo-icon.png" alt="EWT" onerror="this.outerHTML=\'<span class=&quot;brand-logo&quot;>T</span>\'">' +
        '<span>English With Tom<small>Học tiếng Anh cùng Tom</small></span>' +
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

  /* ===== Dropdown "Chương trình" ===== */
  (function () {
    var dd = document.getElementById('navProgramDropdown');
    var btn = document.getElementById('navProgramToggle');
    if (!dd || !btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      dd.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (dd.classList.contains('open') && !dd.contains(e.target)) dd.classList.remove('open');
    });
  })();

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
        var bellBtn = (user.role === 'teacher' || user.role === 'admin')
          ? '<button type="button" id="navBellBtn" title="Thông báo" style="position:relative;display:inline-grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--primary-soft,#ECE9FE);color:var(--primary,#7B6EF6);border:none;cursor:pointer;font-size:17px;flex-shrink:0;transition:background .15s;" onmouseenter="this.style.background=\'var(--primary,#7B6EF6)\';this.style.color=\'#fff\'" onmouseleave="this.style.background=\'var(--primary-soft,#ECE9FE)\';this.style.color=\'var(--primary,#7B6EF6)\'">🔔</button>' : '';
        actions.innerHTML =
          adminLink + teacherLink + bellBtn +
          '<a href="chat.html" id="navChatBtn" title="Tin nhắn" style="position:relative;display:inline-grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--primary-soft,#ECE9FE);color:var(--primary,#7B6EF6);text-decoration:none;font-size:17px;flex-shrink:0;transition:background .15s;" onmouseenter="this.style.background=\'var(--primary,#7B6EF6)\';this.style.color=\'#fff\'" onmouseleave="this.style.background=\'var(--primary-soft,#ECE9FE)\';this.style.color=\'var(--primary,#7B6EF6)\'">💬</a>' +
          '<a href="account.html" title="Tài khoản" class="nav-account" style="display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--text-muted);text-decoration:none;cursor:pointer;">' +
            '<span style="width:30px;height:30px;border-radius:50%;background:var(--gradient);color:#fff;display:inline-grid;place-items:center;font-weight:600;flex-shrink:0;">' + initials + '</span>' +
            '<span class="nav-account-text">' + user.name + '<br><small style="color:var(--text-faint);">' + (roleLabel[user.role] || user.role) + '</small></span>' +
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

    /* Badge unread cho link Tin nhắn */
    if (user) {
      function refreshUnread() {
        fetch('/api/messages/unread-count', { credentials:'same-origin' })
          .then(function(r){ return r.ok ? r.json() : { count:0 }; })
          .then(function(d){
            var link = document.getElementById('navChatBtn');
            if (!link) return;
            var badge = link.querySelector('.nav-unread-badge');
            if (d.count > 0) {
              if (!badge) {
                badge = document.createElement('span');
                badge.className = 'nav-unread-badge';
                badge.style.cssText = 'position:absolute;top:-5px;right:-8px;background:#ef4444;color:#fff;font-size:10px;font-weight:700;border-radius:999px;min-width:16px;height:16px;padding:0 4px;display:grid;place-items:center;line-height:1;';
                link.appendChild(badge);
              }
              badge.textContent = d.count > 99 ? '99+' : d.count;
            } else if (badge) {
              badge.remove();
            }
          }).catch(function(){});
      }
      refreshUnread();
      setInterval(refreshUnread, 30000);
    }

    /* Chuông thông báo (giáo viên/admin) — badge + dropdown danh sách */
    if (user && (user.role === 'teacher' || user.role === 'admin')) {
      function fmtNotifTime(s){
        if (!s) return '';
        // created_at là ISO 8601 đầy đủ (now() = new Date().toISOString(), đã có T và Z sẵn)
        var d = new Date(s);
        var diffMin = Math.round((Date.now()-d.getTime())/60000);
        if (diffMin < 1) return 'Vừa xong';
        if (diffMin < 60) return diffMin+' phút trước';
        var diffH = Math.round(diffMin/60);
        if (diffH < 24) return diffH+' giờ trước';
        return d.toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit'}) + ' lúc ' + d.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'});
      }
      function escNotif(s){ var d=document.createElement('div'); d.textContent=s==null?'':String(s); return d.innerHTML; }

      function refreshBellBadge(){
        fetch('/api/notifications/unread-count', { credentials:'same-origin' })
          .then(function(r){ return r.ok ? r.json() : { count:0 }; })
          .then(function(d){
            var btn = document.getElementById('navBellBtn');
            if (!btn) return;
            var badge = btn.querySelector('.nav-unread-badge');
            if (d.count > 0) {
              if (!badge) {
                badge = document.createElement('span');
                badge.className = 'nav-unread-badge';
                badge.style.cssText = 'position:absolute;top:-5px;right:-8px;background:#ef4444;color:#fff;font-size:10px;font-weight:700;border-radius:999px;min-width:16px;height:16px;padding:0 4px;display:grid;place-items:center;line-height:1;';
                btn.appendChild(badge);
              }
              badge.textContent = d.count > 99 ? '99+' : d.count;
            } else if (badge) {
              badge.remove();
            }
          }).catch(function(){});
      }
      refreshBellBadge();
      setInterval(refreshBellBadge, 30000);

      var notifPanel = null;
      function buildNotifPanel(){
        if (notifPanel) return notifPanel;
        notifPanel = document.createElement('div');
        notifPanel.className = 'notif-panel';
        notifPanel.id = 'notifPanel';
        notifPanel.innerHTML =
          '<div class="notif-panel-head"><h4>🔔 Thông báo</h4><button type="button" id="notifMarkAllBtn">Đánh dấu đã đọc tất cả</button></div>' +
          '<div class="notif-list" id="notifList"><div class="notif-empty">Đang tải...</div></div>';
        document.body.appendChild(notifPanel);
        document.getElementById('notifMarkAllBtn').addEventListener('click', function(){
          fetch('/api/notifications/read-all', { method:'POST', credentials:'same-origin' })
            .then(function(){ loadNotifList(); refreshBellBadge(); });
        });
        return notifPanel;
      }

      function loadNotifList(){
        var listEl = document.getElementById('notifList');
        fetch('/api/notifications', { credentials:'same-origin' })
          .then(function(r){ return r.ok ? r.json() : { notifications: [] }; })
          .then(function(d){
            var items = d.notifications || [];
            if (!items.length) { listEl.innerHTML = '<div class="notif-empty">Chưa có thông báo nào.</div>'; return; }
            listEl.innerHTML = items.map(function(n){
              var unread = !n.read_at;
              return '<div class="notif-item' + (unread ? ' unread' : '') + '" data-id="' + n.id + '" data-link="' + escNotif(n.link || '') + '">' +
                '<div class="notif-item-title">' + escNotif(n.title) + '</div>' +
                (n.body ? '<div class="notif-item-body">' + escNotif(n.body) + '</div>' : '') +
                '<div class="notif-item-time">' + fmtNotifTime(n.created_at) + '</div>' +
              '</div>';
            }).join('');
            listEl.querySelectorAll('.notif-item').forEach(function(el){
              el.addEventListener('click', function(){
                var id = el.getAttribute('data-id');
                var link = el.getAttribute('data-link');
                fetch('/api/notifications/' + id + '/read', { method:'POST', credentials:'same-origin' })
                  .then(function(){ refreshBellBadge(); if (link) location.href = link; });
              });
            });
          }).catch(function(){ listEl.innerHTML = '<div class="notif-empty">Không tải được thông báo.</div>'; });
      }

      var bellOpen = false;
      function toggleNotifPanel(){
        var panel = buildNotifPanel();
        bellOpen = !bellOpen;
        if (bellOpen) {
          var btn = document.getElementById('navBellBtn');
          var r = btn.getBoundingClientRect();
          var panelWidth = 340;
          var left = Math.min(r.left, window.innerWidth - panelWidth - 12);
          panel.style.left = Math.max(8, left) + 'px';
          panel.style.top  = (r.bottom + 8) + 'px';
          panel.classList.add('open');
          loadNotifList();
        } else {
          panel.classList.remove('open');
        }
      }
      document.addEventListener('click', function(e){
        var btn = document.getElementById('navBellBtn');
        if (!btn) return;
        if (btn.contains(e.target)) { toggleNotifPanel(); return; }
        if (notifPanel && bellOpen && !notifPanel.contains(e.target)) {
          bellOpen = false; notifPanel.classList.remove('open');
        }
      });
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
