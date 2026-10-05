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
  // Bảng màu người dùng chọn (xem js/galaxy.js)
  var pal = localStorage.getItem('ewt-palette');
  if (pal && /^[a-z]+$/.test(pal)) document.documentElement.setAttribute('data-palette', pal);
})();

(function () {
  var page = document.body.getAttribute('data-page') || '';

  var homeIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px; margin-right:5px;"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>';

  var navItemsBefore = [
    { href: 'index.html', label: 'Trang chủ', key: 'home', icon: homeIcon },
    { href: 'dashboard.html', label: 'Tiến trình', key: 'dashboard' },
    { href: 'assigned.html', label: 'Bài tập được giao', key: 'assigned' },
    { href: 'placement.html', label: 'Kiểm tra đầu vào', key: 'placement' },
  ];
  var programItems = [
    { href: 'ket.html', label: 'KET', key: 'ket' },
    { href: 'pet.html', label: 'PET', key: 'pet' },
    { href: 'fce.html', label: 'FCE', key: 'fce' },
    { href: 'ielts.html', label: 'IELTS', key: 'ielts' },
    { href: 'aptis.html', label: 'APTIS', key: 'aptis' },
    { href: 'school.html', label: 'Tiếng Anh phổ thông', key: 'school' },
  ];
  var navItemsAfter = [
    { href: 'word-hub.html', label: 'Luyện từ', key: 'vocab' },
  ];
  // "Luyện từ" gom tất cả: học & ôn từ, flashcard, trò chơi, luyện câu, bộ từ được giao — dùng chung 1 mục menu + 1 thanh tab
  var VOCAB_TABS = [
    { href: 'word-hub.html', label: '📚 Học & ôn từ', pages: ['word-hub'] },
    { href: 'vocabulary.html', label: '🃏 Flashcard chủ đề', pages: ['vocabulary'] },
    { href: 'arcade.html', label: '🎮 Trò chơi', pages: ['arcade'] },
    { href: 'practice.html', label: '✍️ Luyện câu', pages: ['practice'] },
    { href: 'lesson-vocab.html', label: '📘 Bộ từ được giao', pages: ['lesson-vocab'] }
  ];
  var inVocab = VOCAB_TABS.some(function (t) { return t.pages.indexOf(page) >= 0; });

  function renderLink(i) {
    var active = (i.key === page || (i.key === 'vocab' && inVocab)) ? ' class="active"' : '';
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
        '<button class="dark-toggle" id="paletteToggle" title="Đổi màu & hiệu ứng giao diện" aria-label="Đổi màu giao diện">🎨</button>' +
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
          '<a href="ket.html">KET</a><a href="pet.html">PET</a><a href="fce.html">FCE</a><a href="aptis.html">APTIS</a><a href="ielts.html">IELTS</a><a href="school.html">Tiếng Anh phổ thông</a>' +
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

  // Thanh tab "Luyện từ" dưới header (chỉ ở các trang thuộc nhóm này)
  if (inVocab) {
    var st = document.createElement('style');
    st.textContent = '.vt-bar{background:var(--surface);border-bottom:1px solid var(--border);position:sticky;top:74px;z-index:90}.vt-in{display:flex;gap:6px;overflow-x:auto;padding:8px 20px;scrollbar-width:none}.vt-in::-webkit-scrollbar{display:none}.vt-tab{flex-shrink:0;padding:8px 15px;border-radius:99px;font-size:13.5px;font-weight:700;color:var(--text-muted);border:1.5px solid transparent;white-space:nowrap}.vt-tab:hover{background:var(--primary-soft);color:var(--text)}.vt-tab.on{background:var(--gradient);color:#fff}';
    document.head.appendChild(st);
    var bar = document.createElement('div');
    bar.className = 'vt-bar';
    bar.innerHTML = '<div class="container vt-in">' + VOCAB_TABS.map(function (t) { return '<a class="vt-tab' + (t.pages.indexOf(page) >= 0 ? ' on' : '') + '" href="' + t.href + '">' + t.label + '</a>'; }).join('') + '</div>';
    var hd = document.querySelector('.site-header');
    if (hd && hd.parentNode) hd.parentNode.insertBefore(bar, hd.nextSibling);
    // Chấm đỏ số bộ từ mới được giao mà bạn chưa gửi kết quả
    fetch('/api/lesson-vocab/mine', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      if (!d || !d.sets) return;
      var n = d.sets.filter(function (x) { return !x.sent; }).length;
      var tab = bar.querySelector('a[href="lesson-vocab.html"]');
      if (n && tab) tab.insertAdjacentHTML('beforeend', ' <span style="background:#ef4444;color:#fff;border-radius:99px;padding:1px 7px;font-size:11px;">' + n + '</span>');
    }).catch(function () {});
  }

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
    .then(function (d) { applyAuth(d.user); if (d.user && d.class_nudge) classNudge(); })
    .catch(function () { applyAuth(null); }); // chạy trên GitHub Pages (không có API) -> coi như chưa đăng nhập


  /* ===== Lời nhắc chọn lớp (học sinh chưa chọn lớp / chưa xác nhận là người dùng tự do) ===== */
  function classNudge() {
    var page = location.pathname.split('/').pop();
    if (page === 'login.html' || page === 'account.html' || page === 'placement.html' || page === 'forgot-password.html' || page === 'reset-password.html') return;
    try { if (sessionStorage.getItem('ewtClassNudge')) return; } catch (e) {}
    if (document.getElementById('clsNudge')) return;
    var st = document.createElement('style');
    st.textContent =
      '@keyframes clsIn{0%{opacity:0;transform:translateY(40px) scale(.9)}60%{opacity:1;transform:translateY(-6px) scale(1.02)}100%{opacity:1;transform:none}}' +
      '@keyframes clsGlow{0%,100%{box-shadow:0 10px 30px rgba(123,110,246,.28),0 0 0 0 rgba(123,110,246,.45)}50%{box-shadow:0 14px 36px rgba(123,110,246,.38),0 0 0 9px rgba(123,110,246,0)}}' +
      '@keyframes clsWave{0%,60%,100%{transform:rotate(0)}10%,30%{transform:rotate(16deg)}20%,40%{transform:rotate(-10deg)}50%{transform:rotate(8deg)}}' +
      '@keyframes clsBar{0%{background-position:0 0}100%{background-position:200% 0}}' +
      '@keyframes clsOut{to{opacity:0;transform:translateY(30px) scale(.92)}}' +
      '#clsNudge{position:fixed;right:20px;bottom:calc(20px + env(safe-area-inset-bottom,0px));z-index:9990;width:min(380px,calc(100vw - 32px));background:var(--surface,#fff);color:var(--text,#2E2B45);border-radius:20px;padding:18px 18px 16px;cursor:pointer;overflow:hidden;animation:clsIn .7s cubic-bezier(.2,.9,.3,1.2) both,clsGlow 2.6s ease-in-out 1s infinite;border:1px solid var(--border,#e6e3f5)}' +
      '#clsNudge:before{content:"";position:absolute;left:0;right:0;top:0;height:5px;background:linear-gradient(90deg,#7B6EF6,#6FA8F5,#2E9E7B,#F5A86F,#7B6EF6);background-size:200% 100%;animation:clsBar 3s linear infinite}' +
      '#clsNudge .cn-top{display:flex;gap:12px;align-items:flex-start}' +
      '#clsNudge .cn-ico{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;font-size:25px;background:var(--primary-soft,#ECE9FE)}' +
      '#clsNudge .cn-ico span{display:inline-block;transform-origin:70% 70%;animation:clsWave 2.4s ease-in-out 1.2s infinite}' +
      '#clsNudge h4{margin:0 0 4px;font-size:15.5px;line-height:1.3}' +
      '#clsNudge p{margin:0;font-size:13.5px;line-height:1.55;color:var(--text-muted,#6B6880)}' +
      '#clsNudge .cn-x{position:absolute;top:10px;right:10px;width:26px;height:26px;border:none;border-radius:50%;background:transparent;color:var(--text-faint,#9C99AE);font-size:16px;cursor:pointer;line-height:1}' +
      '#clsNudge .cn-x:hover{background:var(--primary-soft,#ECE9FE);color:var(--text,#2E2B45)}' +
      '#clsNudge .cn-act{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}' +
      '#clsNudge .cn-go{flex:1 1 150px;border:none;border-radius:12px;padding:10px 14px;font-weight:700;font-size:13.5px;color:#fff;cursor:pointer;background:var(--gradient,linear-gradient(135deg,#7B6EF6,#6FA8F5));transition:transform .15s}' +
      '#clsNudge .cn-go:hover{transform:translateY(-2px)}' +
      '#clsNudge .cn-free{flex:1 1 150px;border:1.5px dashed var(--border-strong,#c9c4ee);border-radius:12px;padding:9px 12px;font-weight:600;font-size:13px;color:var(--text-muted,#6B6880);background:transparent;cursor:pointer}' +
      '#clsNudge .cn-free:hover{border-color:var(--primary,#7B6EF6);color:var(--primary,#7B6EF6)}' +
      '#clsNudge.cn-bye{animation:clsOut .35s ease forwards}' +
      '@media (prefers-reduced-motion:reduce){#clsNudge,#clsNudge:before,#clsNudge .cn-ico span{animation:none!important}}' +
      '@media (max-width:520px){#clsNudge{right:16px;left:16px;width:auto}}';
    document.head.appendChild(st);
    var el = document.createElement('div');
    el.id = 'clsNudge'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Nhắc chọn lớp học');
    el.innerHTML =
      '<button class="cn-x" aria-label="Để sau" title="Để sau">✕</button>' +
      '<div class="cn-top"><div class="cn-ico"><span>👋</span></div><div><h4>Chào bạn, bạn học lớp nào nhỉ?</h4>' +
      '<p>Bạn chưa chọn lớp học. Hãy <b>chọn lớp của mình</b> hoặc xác nhận là <b>người dùng tự do</b> để nhận đúng bài tập phù hợp với chương trình đang học nhé!</p></div></div>' +
      '<div class="cn-act"><button class="cn-go">🏫 Chọn lớp ngay</button><button class="cn-free">🙋 Tôi là người dùng tự do</button></div>';
    function bye(remember) {
      if (remember) { try { sessionStorage.setItem('ewtClassNudge', '1'); } catch (e) {} }
      el.classList.add('cn-bye'); setTimeout(function () { el.remove(); }, 380);
    }
    function go() { try { sessionStorage.setItem('ewtClassNudge', '1'); } catch (e) {} location.href = 'account.html#classCard'; }
    el.addEventListener('click', function (e) {
      if (e.target.closest('.cn-x')) { e.stopPropagation(); bye(true); return; }
      if (e.target.closest('.cn-free')) {
        e.stopPropagation(); var b = e.target.closest('.cn-free'); b.disabled = true; b.textContent = 'Đang lưu…';
        fetch('/api/me/class', { method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ group_id: null }) })
          .then(function (r) {
            if (!r.ok) throw 0;
            el.querySelector('h4').textContent = 'Đã ghi nhận! 🎉';
            el.querySelector('p').textContent = 'Bạn đang học tự do. Khi cần vào lớp, bạn có thể đổi bất cứ lúc nào ở Tài khoản → Lớp đang theo học.';
            el.querySelector('.cn-act').remove(); setTimeout(function () { bye(false); }, 3200);
          }).catch(function () { b.disabled = false; b.textContent = 'Chưa lưu được, thử lại'; });
        return;
      }
      go();
    });
    setTimeout(function () { if (document.body) document.body.appendChild(el); }, 900);
  }

  function escNameT(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }
  function applyAuth(user) {
    var actions = document.getElementById('navActions');
    if (actions) {
      if (user) {
        var initials = escNameT((user.name || '?').trim().split(/\s+/).slice(-1)[0].charAt(0).toUpperCase());
        var teacherLink = (user.role === 'teacher' || user.role === 'admin')
          ? '<a class="btn btn-sm" href="teacher.html">Khu vực giáo viên</a>' : '';
        var adminLink = (user.role === 'admin')
          ? '<a class="btn btn-sm" href="admin.html">Quản trị</a>' : '';
        // Chuông thông báo — hiện cho MỌI vai trò đã đăng nhập (học sinh, giáo viên, admin)
        var bellBtn = '<button type="button" id="navBellBtn" title="Thông báo" style="position:relative;display:inline-grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--primary-soft,#ECE9FE);color:var(--primary,#7B6EF6);border:none;cursor:pointer;font-size:17px;flex-shrink:0;transition:background .15s;" onmouseenter="this.style.background=\'var(--primary,#7B6EF6)\';this.style.color=\'#fff\'" onmouseleave="this.style.background=\'var(--primary-soft,#ECE9FE)\';this.style.color=\'var(--primary,#7B6EF6)\'">🔔</button>';
        actions.innerHTML =
          adminLink + teacherLink + bellBtn +
          '<a href="chat.html" id="navChatBtn" title="Tin nhắn" style="position:relative;display:inline-grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--primary-soft,#ECE9FE);color:var(--primary,#7B6EF6);text-decoration:none;font-size:17px;flex-shrink:0;transition:background .15s;" onmouseenter="this.style.background=\'var(--primary,#7B6EF6)\';this.style.color=\'#fff\'" onmouseleave="this.style.background=\'var(--primary-soft,#ECE9FE)\';this.style.color=\'var(--primary,#7B6EF6)\'">💬</a>' +
          '<a href="account.html" title="Tài khoản" class="nav-account" style="display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--text-muted);text-decoration:none;cursor:pointer;">' +
            '<span style="width:30px;height:30px;border-radius:50%;background:var(--gradient);color:#fff;display:inline-grid;place-items:center;font-weight:600;flex-shrink:0;">' + initials + '</span>' +
            '<span class="nav-account-text">' + escNameT(user.name) + '<br><small style="color:var(--text-faint);">' + (roleLabel[user.role] || user.role) + '</small></span>' +
          '</a>' +
          '<button class="dark-toggle" id="paletteToggle" title="Đổi màu & hiệu ứng giao diện" aria-label="Đổi màu giao diện">🎨</button>' +
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

    /* Chuông thông báo (mọi vai trò: học sinh, giáo viên, admin) — badge + dropdown danh sách */
    if (user) {
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
            btn.classList.toggle('has-unread', d.count > 0); // chuông sáng đỏ + nhấp nháy khi có thông báo mới
            var badge = btn.querySelector('.nav-unread-badge');
            if (d.count > 0) {
              if (!badge) {
                badge = document.createElement('span');
                badge.className = 'nav-unread-badge';
                badge.style.cssText = 'position:absolute;top:-5px;right:-8px;background:#fff;color:#ef4444;font-size:10px;font-weight:700;border-radius:999px;min-width:16px;height:16px;padding:0 4px;display:grid;place-items:center;line-height:1;box-shadow:0 0 0 2px #ef4444;';
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

/* Hiệu ứng galaxy/stars + bộ chọn bảng màu */
(function () {
  var s = document.createElement('script');
  s.src = 'js/galaxy.js?v=5';
  s.async = true;
  document.head.appendChild(s);
})();

/* Bộ nhập liệu từ file: nút "Tải file mẫu" + "Nhập từ file" cho các ô nhập của giáo viên (xem templates.js) */
window.ewtImportKit = function (mount, o) {
  if (!mount) return null;
  var val = function (v) { return typeof v === 'function' ? v() : v; };
  mount.classList.add('ik');
  mount.innerHTML = '<a class="ik-btn" download>⬇️ Tải file mẫu Excel</a><label class="ik-btn ik-up">📤 Nhập từ file<input type="file" hidden accept=".xlsx,.docx,.csv,.txt"></label><span class="ik-msg" role="status"></span>';
  var a = mount.querySelector('a'), inp = mount.querySelector('input'), msg = mount.querySelector('.ik-msg');
  function refresh() { a.setAttribute('href', '/api/templates/' + val(o.template) + '.xlsx'); a.setAttribute('download', ''); }
  refresh();
  function say(cls, t) { msg.className = 'ik-msg ' + cls; msg.textContent = t; }
  inp.onchange = function () {
    var f = inp.files && inp.files[0]; inp.value = ''; if (!f) return;
    say('', '⏳ Đang đọc "' + f.name + '"…');
    var fd = new FormData(); fd.append('file', f);
    fetch('/api/import/parse?kind=' + encodeURIComponent(val(o.kind) || val(o.template)), { method: 'POST', credentials: 'same-origin', body: fd })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) throw new Error(d.error || 'Không đọc được file.'); return d; }); })
      .then(function (d) {
        var t = document.getElementById(o.target); if (!t) return;
        t.value = (o.append && t.value.trim() ? t.value.replace(/\s+$/, '') + '\n' : '') + d.text;
        t.dispatchEvent(new Event('input', { bubbles: true }));
        say('ok', '✅ Đã đọc ' + d.count + (o.unit || ' dòng') + ' từ file — hãy xem lại trong ô bên cạnh rồi bấm nút lưu/nhập.');
        if (o.onDone) o.onDone(d);
      }).catch(function (e) { say('err', '⚠️ ' + e.message); });
  };
  return { refresh: refresh };
};
