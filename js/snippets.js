/* 📋 Mẫu nhận xét của giáo viên — chèn nhanh câu nhận xét hay dùng vào ô nhận xét khi chấm bài.
   Dùng: EWTSnippets.watch(['#gTc', '#gpFeedback', 'textarea[data-tc]']) — tự gắn nút "📋 Mẫu nhận xét" phía trên mọi ô khớp (kể cả ô được tạo sau). */
(function (root) {
  'use strict';
  var CSS = '.sn-bar{display:flex;gap:6px;align-items:center;margin:0 0 4px;position:relative}.sn-btn{border:1.5px solid var(--border,#e5e7eb);background:var(--surface,#fff);color:var(--primary,#6F58EE);border-radius:9px;padding:4px 10px;font:700 12.5px inherit;font-family:inherit;cursor:pointer}.sn-btn:hover{background:var(--primary-soft,#f1eefe)}' +
    '.sn-pop{position:absolute;left:0;top:30px;z-index:900;width:min(420px,92vw);max-height:340px;overflow:auto;background:var(--surface,#fff);border:1.5px solid var(--border,#e5e7eb);border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.2);padding:8px}.sn-pop input{width:100%;box-sizing:border-box;padding:7px 10px;border:1.5px solid var(--border,#e5e7eb);border-radius:8px;font:13px inherit;font-family:inherit;margin-bottom:6px;background:var(--surface,#fff);color:var(--text,#222)}' +
    '.sn-it{display:flex;gap:6px;align-items:flex-start;padding:7px 8px;border-radius:8px;cursor:pointer}.sn-it:hover{background:var(--bg-soft,#f6f5fd)}.sn-it .t{flex:1;min-width:0;font-size:13px;line-height:1.45}.sn-it .t b{display:block;font-size:13px}.sn-it .t span{color:var(--text-muted,#6B6880);font-size:12px}.sn-it i{font-style:normal;font-size:11px;background:var(--primary-soft,#f1eefe);color:var(--primary,#6F58EE);border-radius:99px;padding:1px 7px;font-weight:700}.sn-x{border:0;background:none;cursor:pointer;color:#b91c1c;font-size:14px;padding:0 4px}.sn-save{border-top:1px solid var(--border,#e5e7eb);margin-top:6px;padding-top:6px;font-size:12.5px}';
  var LIST = null, LOADING = null, SEL = [], seen = new WeakSet();
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function api(url, method, body) { return fetch(url, { method: method || 'GET', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }).then(function (r) { return r.json(); }); }
  function load(force) { if (LIST && !force) return Promise.resolve(LIST); if (LOADING && !force) return LOADING; LOADING = api('/api/teacher/snippets').then(function (d) { LIST = d.snippets || []; LOADING = null; return LIST; }).catch(function () { LOADING = null; return LIST || []; }); return LOADING; }
  function insert(ta, text) {
    var v = ta.value, s = ta.selectionStart == null ? v.length : ta.selectionStart, e = ta.selectionEnd == null ? v.length : ta.selectionEnd, pre = v.slice(0, s), post = v.slice(e);
    var sep = pre && !/[\s]$/.test(pre) ? ' ' : ''; ta.value = pre + sep + text + (post && !/^\s/.test(post) ? ' ' : '') + post; var pos = (pre + sep + text).length; try { ta.focus(); ta.setSelectionRange(pos, pos); } catch (x) { /* bỏ qua */ }
    ta.dispatchEvent(new Event('input', { bubbles: true })); ta.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function closePop() { var o = document.querySelector('.sn-pop'); if (o) o.remove(); }
  function open(ta, bar) {
    closePop(); var pop = document.createElement('div'); pop.className = 'sn-pop'; bar.appendChild(pop);
    function draw(q) {
      load().then(function (list) {
        q = (q || '').toLowerCase(); var rows = list.filter(function (x) { return !q || (x.title + ' ' + x.body + ' ' + x.tag).toLowerCase().indexOf(q) >= 0; });
        pop.querySelector('.sn-list').innerHTML = rows.length ? rows.map(function (x) { return '<div class="sn-it" data-id="' + x.id + '"><div class="t"><b>' + esc(x.title) + (x.tag ? ' <i>' + esc(x.tag) + '</i>' : '') + '</b><span>' + esc(x.body.length > 110 ? x.body.slice(0, 110) + '…' : x.body) + '</span></div><button type="button" class="sn-x" data-del="' + x.id + '" title="Xoá mẫu này">🗑</button></div>'; }).join('') : '<div style="padding:10px;color:#888;font-size:13px">Chưa có mẫu nào khớp.</div>';
      });
    }
    pop.innerHTML = '<input type="text" placeholder="🔍 Tìm mẫu nhận xét…" class="sn-q"><div class="sn-list"></div><div class="sn-save"><b>＋ Lưu thành mẫu mới</b><input type="text" class="sn-t" placeholder="Tên mẫu (vd: Khen bố cục)" style="margin-top:4px"><button type="button" class="sn-btn sn-do" style="width:100%">💾 Lưu nội dung đang chọn (hoặc cả ô nhận xét)</button></div>';
    draw(''); pop.querySelector('.sn-q').oninput = function () { draw(this.value); };
    pop.onclick = function (ev) {
      var del = ev.target.closest('[data-del]'); if (del) { ev.stopPropagation(); if (!confirm('Xoá mẫu nhận xét này?')) return; api('/api/teacher/snippets/' + del.getAttribute('data-del'), 'DELETE').then(function () { load(true).then(function () { draw(pop.querySelector('.sn-q').value); }); }); return; }
      var it = ev.target.closest('.sn-it'); if (it) { var id = Number(it.getAttribute('data-id')), x = (LIST || []).filter(function (r) { return r.id === id; })[0]; if (x) { insert(ta, x.body); api('/api/teacher/snippets/' + id + '/use', 'POST').catch(function () {}); closePop(); } return; }
      if (ev.target.closest('.sn-do')) {
        var sel = ta.value.slice(ta.selectionStart || 0, ta.selectionEnd || 0).trim() || ta.value.trim(); if (!sel) { alert('Hãy viết hoặc bôi đen nội dung nhận xét trước khi lưu thành mẫu.'); return; }
        api('/api/teacher/snippets', 'POST', { title: pop.querySelector('.sn-t').value, body: sel }).then(function (d) { if (d.error) { alert(d.error); return; } load(true).then(function () { pop.querySelector('.sn-t').value = ''; draw(''); }); });
      }
    };
  }
  function attach(ta) {
    if (seen.has(ta)) return; seen.add(ta);
    var bar = document.createElement('div'); bar.className = 'sn-bar'; bar.innerHTML = '<button type="button" class="sn-btn">📋 Mẫu nhận xét</button><span style="font-size:11.5px;color:#999">chèn nhanh câu nhận xét hay dùng</span>';
    ta.parentNode.insertBefore(bar, ta); bar.querySelector('.sn-btn').onclick = function (e) { e.stopPropagation(); if (bar.querySelector('.sn-pop')) closePop(); else open(ta, bar); };
  }
  function scan() { SEL.forEach(function (s) { try { [].forEach.call(document.querySelectorAll(s), attach); } catch (e) { /* bỏ qua */ } }); }
  function watch(sels) {
    SEL = SEL.concat(sels || []); if (!document.getElementById('snCss')) { var st = document.createElement('style'); st.id = 'snCss'; st.textContent = CSS; document.head.appendChild(st); }
    document.addEventListener('click', function (e) { if (!e.target.closest('.sn-bar')) closePop(); }); var t = 0;
    new MutationObserver(function () { clearTimeout(t); t = setTimeout(scan, 120); }).observe(document.body, { childList: true, subtree: true }); scan();
  }
  root.EWTSnippets = { watch: watch, attach: attach };
})(window);
