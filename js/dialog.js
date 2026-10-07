/* English With Tom — hộp thoại thông báo / xác nhận / nhập liệu hoà cùng giao diện
   (thay alert / confirm / prompt trắng của trình duyệt).
   Dùng:  await ewtAlert('Nội dung')            → hiện thông báo
          await ewtConfirm('Xoá nhé?')          → true / false
          await ewtPrompt('Tên lớp:', 'mặc định') → chuỗi hoặc null
   Màu sắc lấy từ biến CSS của trang (sáng/tối/bảng màu galaxy); trang Vườn có kiểu gỗ-kem riêng. */
(function () {
  if (window.EWTDialog) return;
  var doc = document;

  // Phông có dấu tiếng Việt đầy đủ
  try {
    if (!doc.querySelector('link[href*="Be+Vietnam+Pro"]')) {
      var lk = doc.createElement('link'); lk.rel = 'stylesheet';
      lk.href = 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap';
      doc.head.appendChild(lk);
    }
  } catch (e) {}

  var css = '' +
    '.ewtd-ov{position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;' +
      'padding:max(16px,env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) max(16px,env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left));' +
      'background:rgba(30,24,60,.46);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);animation:ewtdFade .16s ease-out;' +
      'font-family:"Be Vietnam Pro",var(--font,system-ui),-apple-system,"Segoe UI",Roboto,"Noto Sans","Helvetica Neue",Arial,sans-serif;-webkit-text-size-adjust:100%}' +
    '.ewtd-card{position:relative;width:100%;max-width:430px;max-height:calc(100vh - 32px);max-height:calc(100dvh - 32px);display:flex;flex-direction:column;overflow:hidden;' +
      'border-radius:22px;background:var(--surface,#fff);color:var(--text,#2E2B45);border:1.5px solid var(--border,#E8E6F2);' +
      'box-shadow:0 24px 60px rgba(40,30,110,.38),0 2px 0 rgba(255,255,255,.35) inset;animation:ewtdPop .22s cubic-bezier(.2,1.2,.4,1)}' +
    /* họa tiết chấm + vầng sáng cùng tông màu chủ đạo */
    '.ewtd-card::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.10;background-image:radial-gradient(var(--primary,#7B6EF6) 1.3px,transparent 1.7px);background-size:18px 18px}' +
    '.ewtd-card::after{content:"";position:absolute;right:-60px;top:-70px;width:200px;height:200px;border-radius:50%;pointer-events:none;opacity:.22;background:radial-gradient(circle,var(--primary-2,#6FA8F5),transparent 68%)}' +
    '.ewtd-head{position:relative;z-index:1;display:flex;align-items:center;gap:12px;padding:16px 20px 12px;background:var(--gradient,linear-gradient(135deg,#6F58EE,#4F8BF0));color:#fff}' +
    '.ewtd-head::after{content:"✦  ✧   ✦";position:absolute;right:16px;top:8px;font-size:12px;letter-spacing:4px;opacity:.55;pointer-events:none}' +
    '.ewtd-ic{flex:none;width:42px;height:42px;border-radius:14px;display:grid;place-items:center;font-size:23px;line-height:1;background:rgba(255,255,255,.2);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.35)}' +
    '.ewtd-title{font-size:16.5px;font-weight:800;line-height:1.3;letter-spacing:.1px;margin:0;color:#fff;word-break:break-word}' +
    '.ewtd-body{position:relative;z-index:1;padding:18px 22px 6px;overflow:auto;-webkit-overflow-scrolling:touch}' +
    '.ewtd-msg{font-size:15px;line-height:1.6;font-weight:500;white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;margin:0;color:var(--text,#2E2B45)}' +
    '.ewtd-in{display:block;width:100%;margin-top:14px;padding:11px 13px;border-radius:12px;border:2px solid var(--border,#E8E6F2);background:var(--bg-soft,#F8F7FF);color:var(--text,#2E2B45);' +
      'font:600 16px/1.4 "Be Vietnam Pro",var(--font,system-ui),sans-serif;outline:none;transition:border-color .15s,box-shadow .15s;-webkit-appearance:none;appearance:none}' +
    'textarea.ewtd-in{min-height:96px;resize:vertical}' +
    '.ewtd-in:focus{border-color:var(--primary,#7B6EF6);box-shadow:0 0 0 4px rgba(123,110,246,.18)}' +
    '.ewtd-btns{position:relative;z-index:1;display:flex;justify-content:flex-end;gap:10px;padding:16px 20px 20px;flex-wrap:wrap}' +
    '.ewtd-btn{min-height:44px;min-width:104px;padding:10px 20px;border-radius:13px;cursor:pointer;font:800 14.5px/1.2 "Be Vietnam Pro",var(--font,system-ui),sans-serif;border:2px solid var(--border,#E8E6F2);' +
      'background:var(--surface,#fff);color:var(--text-muted,#6B6880);transition:transform .1s,filter .15s,background .15s;-webkit-tap-highlight-color:transparent;touch-action:manipulation}' +
    '.ewtd-btn:hover{background:var(--primary-soft,#ECE9FE);color:var(--primary,#7B6EF6)}' +
    '.ewtd-btn:active{transform:translateY(1px) scale(.98)}' +
    '.ewtd-btn:focus-visible{outline:3px solid var(--primary-2,#6FA8F5);outline-offset:2px}' +
    '.ewtd-btn.ok{background:var(--gradient,linear-gradient(135deg,#6F58EE,#4F8BF0));color:#fff;border-color:transparent;box-shadow:0 6px 16px rgba(95,80,230,.32)}' +
    '.ewtd-btn.ok:hover{filter:brightness(1.07);color:#fff;background:var(--gradient,linear-gradient(135deg,#6F58EE,#4F8BF0))}' +
    /* các sắc thái: lỗi / nguy hiểm / thành công / cảnh báo */
    '.ewtd-card.danger .ewtd-head,.ewtd-card.error .ewtd-head{background:linear-gradient(135deg,#E5566D,#F08A5D)}' +
    '.ewtd-card.danger .ewtd-btn.ok,.ewtd-card.error .ewtd-btn.ok{background:linear-gradient(135deg,#E5566D,#F08A5D);box-shadow:0 6px 16px rgba(229,86,109,.34)}' +
    '.ewtd-card.danger .ewtd-btn.ok:hover,.ewtd-card.error .ewtd-btn.ok:hover{background:linear-gradient(135deg,#E5566D,#F08A5D)}' +
    '.ewtd-card.success .ewtd-head{background:linear-gradient(135deg,#2E9E7B,#5CC8A0)}' +
    '.ewtd-card.success .ewtd-btn.ok{background:linear-gradient(135deg,#2E9E7B,#5CC8A0);box-shadow:0 6px 16px rgba(46,158,123,.32)}' +
    '.ewtd-card.success .ewtd-btn.ok:hover{background:linear-gradient(135deg,#2E9E7B,#5CC8A0)}' +
    '.ewtd-card.warn .ewtd-head{background:linear-gradient(135deg,#E0A026,#F2C25B);color:#3b2a05}' +
    '.ewtd-card.warn .ewtd-title{color:#3b2a05}.ewtd-card.warn .ewtd-ic{background:rgba(255,255,255,.4)}' +
    '.ewtd-card.warn .ewtd-btn.ok{background:linear-gradient(135deg,#E0A026,#F2C25B);color:#3b2a05;box-shadow:0 6px 16px rgba(224,160,38,.34)}' +
    '.ewtd-card.warn .ewtd-btn.ok:hover{background:linear-gradient(135deg,#E0A026,#F2C25B);color:#3b2a05}' +
    /* giao diện tối */
    '[data-theme="dark"] .ewtd-ov{background:rgba(4,3,14,.62)}' +
    '[data-theme="dark"] .ewtd-card{box-shadow:0 24px 60px rgba(0,0,0,.6),0 0 0 1px rgba(168,151,248,.18)}' +
    '[data-theme="dark"] .ewtd-card::before{opacity:.13}' +
    /* Vườn: gỗ + kem, hoa lá */
    '.ewtd-ov.garden{background:rgba(24,48,40,.5)}' +
    '.garden .ewtd-card{background:linear-gradient(180deg,#FFF8E8,#FFE9BE);border:4px solid #C98E55;color:#5A3A1A;border-radius:26px;box-shadow:0 18px 44px rgba(60,32,8,.5),inset 0 2px 0 rgba(255,255,255,.8),inset 0 -4px 0 rgba(201,142,85,.35)}' +
    '.garden .ewtd-card::before{opacity:.2;background-image:radial-gradient(#E6A94F 1.6px,transparent 2px),radial-gradient(#7CC464 1.4px,transparent 1.8px);background-size:22px 22px,22px 22px;background-position:0 0,11px 11px}' +
    '.garden .ewtd-card::after{background:radial-gradient(circle,#FFE08A,transparent 68%);opacity:.5}' +
    '.garden .ewtd-head{background:linear-gradient(180deg,#8FD36B,#4FA050);color:#fff;border-bottom:4px solid #C98E55}' +
    '.garden .ewtd-head::after{content:"🌿 🌼 🍃";letter-spacing:2px;font-size:14px;opacity:.9}' +
    '.garden .ewtd-title{text-shadow:0 2px 0 rgba(30,90,40,.45)}' +
    '.garden .ewtd-msg{color:#5A3A1A;font-weight:600}' +
    '.garden .ewtd-in{background:#FFFDF6;border:3px solid #E2B77E;color:#5A3A1A}.garden .ewtd-in:focus{border-color:#4FA050;box-shadow:0 0 0 4px rgba(79,160,80,.22)}' +
    '.garden .ewtd-btn{background:#FFF3D6;border:3px solid #D9A766;color:#8A5A2B;border-radius:15px;box-shadow:0 4px 0 #C98E55}' +
    '.garden .ewtd-btn:hover{background:#FFE7B8;color:#6B4219}.garden .ewtd-btn:active{transform:translateY(3px);box-shadow:0 1px 0 #C98E55}' +
    '.garden .ewtd-btn.ok{background:linear-gradient(180deg,#7CD05B,#4FA050);border-color:#2F7E3F;color:#fff;box-shadow:0 4px 0 #2F7E3F;text-shadow:0 1px 0 rgba(0,0,0,.25)}' +
    '.garden .ewtd-btn.ok:hover{background:linear-gradient(180deg,#8BDB68,#58AE58);color:#fff;filter:none}.garden .ewtd-btn.ok:active{box-shadow:0 1px 0 #2F7E3F}' +
    '.garden .ewtd-card.danger .ewtd-head,.garden .ewtd-card.error .ewtd-head{background:linear-gradient(180deg,#F58A6A,#DC5B4A)}' +
    '.garden .ewtd-card.danger .ewtd-btn.ok,.garden .ewtd-card.error .ewtd-btn.ok{background:linear-gradient(180deg,#F58A6A,#DC5B4A);border-color:#A63A2D;box-shadow:0 4px 0 #A63A2D}' +
    '.garden .ewtd-card.warn .ewtd-head{background:linear-gradient(180deg,#FFD36B,#EFA93A);color:#5A3A1A}' +
    '.garden .ewtd-card.warn .ewtd-title{color:#5A3A1A;text-shadow:none}' +
    '.garden .ewtd-card.warn .ewtd-btn.ok{background:linear-gradient(180deg,#FFD36B,#EFA93A);border-color:#B87A1B;box-shadow:0 4px 0 #B87A1B;color:#5A3A1A;text-shadow:none}' +
    /* điện thoại */
    '@media (max-width:480px){.ewtd-ov{align-items:flex-end}.ewtd-card{max-width:none;border-radius:22px 22px 18px 18px}' +
      '.ewtd-btns{flex-direction:column-reverse;gap:8px;padding:14px 16px calc(16px + env(safe-area-inset-bottom,0px))}.ewtd-btn{width:100%;min-height:48px}.ewtd-body{padding:16px 18px 4px}}' +
    '@keyframes ewtdFade{from{opacity:0}to{opacity:1}}' +
    '@keyframes ewtdPop{from{opacity:0;transform:translateY(14px) scale(.94)}to{opacity:1;transform:none}}' +
    '@media (prefers-reduced-motion:reduce){.ewtd-ov,.ewtd-card{animation:none}}';

  var st = doc.createElement('style'); st.setAttribute('data-ewtd', '1'); st.textContent = css;
  (doc.head || doc.documentElement).appendChild(st);

  var queue = [], busy = false;

  function isGarden() { return !!doc.querySelector('.gd-stage') || /garden\.html/.test(location.pathname); }

  function guess(kind, msg) {
    var m = String(msg || '');
    if (kind === 'prompt') return { cls: '', ic: '✏️', title: 'Nhập thông tin' };
    if (kind === 'confirm') {
      if (/(^|\s)(Xoá|xoá|Xóa|xóa|Huỷ|Hủy|Gỡ|Rời|Thoát|Từ chối|không thể hoàn tác|KHÔNG|Bỏ mọi|Vô hiệu)/.test(m)) return { cls: 'danger', ic: '⚠️', title: 'Bạn chắc chứ?' };
      return { cls: '', ic: '❓', title: 'Xác nhận' };
    }
    if (/^\s*(✅|Đã |Thành công|Gửi thành công)/.test(m)) return { cls: 'success', ic: '✅', title: 'Thành công' };
    if (/^\s*(⏰)/.test(m)) return { cls: 'warn', ic: '⏰', title: 'Hết giờ' };
    if (/(^|\s)(Lỗi|lỗi|thất bại|Không thể|không thể|Không |không được|Không được)/.test(m)) return { cls: 'error', ic: '😟', title: 'Có chút trục trặc' };
    if (/(Vui lòng|Hãy |cần đăng nhập|chưa|Bạn cần)/.test(m)) return { cls: 'warn', ic: '💡', title: 'Lưu ý nhé' };
    return { cls: '', ic: '💬', title: 'Thông báo' };
  }

  function next() {
    if (busy || !queue.length) return;
    busy = true;
    var q = queue.shift(), g = guess(q.kind, q.msg), o = q.opts || {};
    var prevFocus = doc.activeElement;
    var ov = doc.createElement('div'); ov.className = 'ewtd-ov' + (isGarden() ? ' garden' : '');
    ov.setAttribute('role', q.kind === 'alert' ? 'alertdialog' : 'dialog'); ov.setAttribute('aria-modal', 'true');
    var card = doc.createElement('div'); card.className = 'ewtd-card ' + (o.tone || g.cls);
    var head = doc.createElement('div'); head.className = 'ewtd-head';
    var ic = doc.createElement('div'); ic.className = 'ewtd-ic'; ic.textContent = o.icon || g.ic;
    var tt = doc.createElement('h3'); tt.className = 'ewtd-title'; tt.textContent = o.title || g.title; tt.id = 'ewtdT' + Date.now();
    head.appendChild(ic); head.appendChild(tt);
    var body = doc.createElement('div'); body.className = 'ewtd-body';
    var msg = doc.createElement('p'); msg.className = 'ewtd-msg'; msg.textContent = String(q.msg == null ? '' : q.msg); body.appendChild(msg);
    ov.setAttribute('aria-labelledby', tt.id);
    var inp = null;
    if (q.kind === 'prompt') {
      inp = doc.createElement(o.multiline ? 'textarea' : 'input'); inp.className = 'ewtd-in';
      if (!o.multiline) inp.type = 'text';
      inp.value = q.def == null ? '' : String(q.def); inp.setAttribute('autocomplete', 'off'); inp.setAttribute('autocapitalize', 'off'); inp.spellcheck = false;
      body.appendChild(inp);
    }
    var btns = doc.createElement('div'); btns.className = 'ewtd-btns';
    var bC = null, bO = doc.createElement('button'); bO.type = 'button'; bO.className = 'ewtd-btn ok';
    bO.textContent = o.okText || (q.kind === 'alert' ? 'Đã hiểu' : (card.className.indexOf('danger') > -1 ? 'Đồng ý' : 'Đồng ý'));
    if (q.kind !== 'alert') { bC = doc.createElement('button'); bC.type = 'button'; bC.className = 'ewtd-btn'; bC.textContent = o.cancelText || 'Huỷ'; btns.appendChild(bC); }
    btns.appendChild(bO);
    card.appendChild(head); card.appendChild(body); card.appendChild(btns); ov.appendChild(card);
    doc.body.appendChild(ov);
    var prevOv = doc.body.style.overflow; doc.body.style.overflow = 'hidden';

    var closed = false;
    function done(val) {
      if (closed) return; closed = true;
      doc.removeEventListener('keydown', onKey, true);
      doc.body.style.overflow = prevOv;
      if (ov.parentNode) ov.parentNode.removeChild(ov);
      try { if (prevFocus && prevFocus.focus && doc.contains(prevFocus)) prevFocus.focus(); } catch (e) {}
      busy = false; q.res(val); next();
    }
    function accept() { done(q.kind === 'prompt' ? inp.value : (q.kind === 'confirm' ? true : undefined)); }
    function cancel() { done(q.kind === 'prompt' ? null : (q.kind === 'confirm' ? false : undefined)); }
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cancel(); }
      else if (e.key === 'Enter' && !(e.target && e.target.tagName === 'TEXTAREA') && !(e.target && e.target === bC)) { e.preventDefault(); e.stopPropagation(); accept(); }
      else if (e.key === 'Tab') {
        var f = [inp, bC, bO].filter(Boolean), i = f.indexOf(doc.activeElement);
        e.preventDefault(); f[(i + (e.shiftKey ? f.length - 1 : 1)) % f.length].focus();
      }
    }
    doc.addEventListener('keydown', onKey, true);
    bO.onclick = accept; if (bC) bC.onclick = cancel;
    if (q.kind === 'alert') ov.addEventListener('mousedown', function (e) { if (e.target === ov) cancel(); });
    setTimeout(function () { try { if (inp) { inp.focus(); inp.select(); } else bO.focus(); } catch (e) {} }, 30);
  }

  function ask(kind, msg, def, opts) {
    return new Promise(function (res) { queue.push({ kind: kind, msg: msg, def: def, opts: opts, res: res }); next(); });
  }

  window.EWTDialog = {
    alert: function (m, o) { return ask('alert', m, null, o); },
    confirm: function (m, o) { return ask('confirm', m, null, o); },
    prompt: function (m, d, o) { return ask('prompt', m, d, o); }
  };
  window.ewtAlert = window.EWTDialog.alert;
  window.ewtConfirm = window.EWTDialog.confirm;
  window.ewtPrompt = window.EWTDialog.prompt;
})();
