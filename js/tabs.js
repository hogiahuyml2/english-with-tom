/* EWT — chia mục lớn thành các TAB nhỏ (đỡ phải cuộn dài).
   Dùng: <div data-ewt-tabs="tên"> bao các khối con, mỗi khối có data-tab-title="📋 Tên tab". Tab đang chọn được nhớ theo từng trang. */
(function () {
  'use strict';
  var css = '.ewt-tabs{display:flex;gap:6px;overflow-x:auto;margin:0 0 16px;padding:6px;background:var(--surface,#fff);border:1px solid var(--border,#e5e7eb);border-radius:16px;position:sticky;top:8px;z-index:20;scrollbar-width:none;box-shadow:0 6px 18px rgba(60,40,10,.08)}' +
    '.ewt-tabs::-webkit-scrollbar{display:none}' +
    '.ewt-tab{flex:none;border:0;background:transparent;color:var(--text-muted,#64748b);font:700 14px inherit;font-family:inherit;padding:10px 16px;border-radius:12px;cursor:pointer;white-space:nowrap;min-height:42px}' +
    '.ewt-tab:hover{background:var(--primary-soft,#eef);color:var(--primary,#6F58EE)}' +
    '.ewt-tab.on{background:linear-gradient(135deg,var(--primary,#6F58EE),var(--primary-2,var(--primary,#6F58EE)));color:#fff;box-shadow:0 4px 12px rgba(111,88,238,.35)}' +
    '.ewt-pane-x{display:none}.ewt-pane-x.on{display:block;animation:ewtTabIn .18s ease}@keyframes ewtTabIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}' +
    '@media(max-width:640px){.ewt-tab{padding:9px 12px;font-size:13px}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function init(box) {
    var panes = Array.prototype.filter.call(box.children, function (c) { return c.hasAttribute('data-tab-title'); });
    if (panes.length < 2) return;
    var key = 'ewt-tab:' + location.pathname + ':' + (box.getAttribute('data-ewt-tabs') || ''), bar = document.createElement('div');
    bar.className = 'ewt-tabs'; bar.setAttribute('role', 'tablist');
    panes.forEach(function (p, i) { p.classList.add('ewt-pane-x'); p.setAttribute('role', 'tabpanel'); var b = document.createElement('button'); b.type = 'button'; b.className = 'ewt-tab'; b.setAttribute('role', 'tab'); b.setAttribute('data-i', i); b.textContent = p.getAttribute('data-tab-title'); bar.appendChild(b); });
    box.insertBefore(bar, box.firstChild);
    function show(i, save) {
      if (!panes[i]) i = 0;
      Array.prototype.forEach.call(bar.children, function (b, k) { b.classList.toggle('on', k === i); b.setAttribute('aria-selected', k === i); });
      panes.forEach(function (p, k) { p.classList.toggle('on', k === i); });
      if (save) { try { localStorage.setItem(key, String(i)); } catch (e) {} }
      try { window.dispatchEvent(new Event('resize')); } catch (e) {}   // để biểu đồ/khung co giãn tính lại kích thước
      box.dispatchEvent(new CustomEvent('ewt-tab', { detail: { index: i, pane: panes[i] } }));
    }
    bar.addEventListener('click', function (e) { var b = e.target.closest('.ewt-tab'); if (b) show(+b.getAttribute('data-i'), true); });
    var start = 0; try { start = parseInt(localStorage.getItem(key), 10) || 0; } catch (e) {}
    show(start, false);
  }
  function boot() { Array.prototype.forEach.call(document.querySelectorAll('[data-ewt-tabs]'), init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
