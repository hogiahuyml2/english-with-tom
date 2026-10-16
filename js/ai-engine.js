/* Chọn bộ máy chấm AI (chỉ giáo viên): Gemini Flash / Gemini Pro / Claude Haiku / Claude Sonnet. Lưu theo tài khoản giáo viên.
   Dùng: <span id="aiEngineBox"></span> + <script src="js/ai-engine.js"></script> */
(function () {
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mount(box) {
    fetch('/api/teacher/ai-engine', { credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (d) {
      if (!d || !d.options) return;
      var cur = d.engine, o = d.options;
      box.innerHTML = '<label style="display:inline-flex;gap:6px;align-items:center;font-size:13px;flex-wrap:wrap">🤖 Chấm bằng: <select id="aiEngineSel" style="padding:5px 8px;border-radius:8px;border:1px solid #b9c3d6;font:inherit">' +
        o.map(function (x) { return '<option value="' + x.id + '"' + (x.id === cur ? ' selected' : '') + (x.ready ? '' : ' disabled') + '>' + esc(x.label) + (x.ready ? '' : ' (chưa cấu hình)') + ' — ' + esc(x.note) + '</option>'; }).join('') +
        '</select><span id="aiEngineMsg" style="color:#2a7a3b"></span></label>';
      var sel = box.querySelector('#aiEngineSel'), msg = box.querySelector('#aiEngineMsg');
      sel.onchange = function () {
        fetch('/api/teacher/ai-engine', { method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ engine: sel.value }) })
          .then(function (r) { return r.json(); }).then(function (j) { msg.textContent = j.ok ? '✓ đã lưu' : (j.error || 'Lỗi'); setTimeout(function () { msg.textContent = ''; }, 2000); });
      };
    }).catch(function () {});
  }
  function go() { var b = document.querySelectorAll('.aiEngineBox,#aiEngineBox'); for (var i = 0; i < b.length; i++) mount(b[i]); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
