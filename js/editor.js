/* =====================================================================
   RichEditor — lightweight WYSIWYG dùng contenteditable + execCommand
   Không cần thư viện ngoài. Dùng chung trên toàn trang EWT.
   ===================================================================== */
(function (global) {
  'use strict';

  /* ── Loại bỏ script/event-handler (XSS cơ bản) ── */
  function sanitize(html) {
    return (html || '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, '')
      .replace(/javascript\s*:/gi, '');
  }

  /* ── Đếm từ từ plain text ── */
  function countWords(text) {
    var t = (text || '').trim();
    return t ? t.split(/\s+/).length : 0;
  }

  /* ── Lấy plain text từ HTML ── */
  function stripTags(html) {
    var d = document.createElement('div');
    d.innerHTML = html || '';
    return d.innerText || d.textContent || '';
  }

  /* ─────────────────────────────────────────────────────────────────
     TOOLBAR PRESETS
     'full'    → giáo viên tạo/chỉnh sửa đề (toàn bộ công cụ)
     'writer'  → học sinh viết bài essay/email (không cần strike/hi-lite)
     'minimal' → ô reply ngắn (chỉ bold/italic/underline + màu)
  ──────────────────────────────────────────────────────────────── */
  var PRESETS = {
    full: [
      { cmd:'bold',           icon:'<b>B</b>',          tip:'In đậm (Ctrl+B)' },
      { cmd:'italic',         icon:'<i>I</i>',          tip:'In nghiêng (Ctrl+I)' },
      { cmd:'underline',      icon:'<u>U</u>',          tip:'Gạch dưới (Ctrl+U)' },
      { cmd:'strikeThrough',  icon:'<s>S</s>',          tip:'Gạch ngang' },
      { sep:true },
      { type:'foreColor', icon:'<span class="re-ci-text">A</span>', tip:'Màu chữ', default:'#e53e3e' },
      { type:'hiliteColor', icon:'<span class="re-ci-hl">A</span>', tip:'Màu nền/highlight', default:'#ffd43b' },
      { sep:true },
      { cmd:'insertUnorderedList', icon:'<svg width="14" height="14" viewBox="0 0 14 14"><circle cx="2" cy="4" r="1.5" fill="currentColor"/><rect x="5" y="3" width="8" height="2" rx="1" fill="currentColor"/><circle cx="2" cy="10" r="1.5" fill="currentColor"/><rect x="5" y="9" width="8" height="2" rx="1" fill="currentColor"/></svg>', tip:'Danh sách bullet' },
      { cmd:'insertOrderedList',   icon:'<svg width="14" height="14" viewBox="0 0 14 14"><text x="0" y="5" font-size="5" fill="currentColor" font-family="sans-serif">1.</text><text x="0" y="11" font-size="5" fill="currentColor" font-family="sans-serif">2.</text><rect x="6" y="3" width="7" height="2" rx="1" fill="currentColor"/><rect x="6" y="9" width="7" height="2" rx="1" fill="currentColor"/></svg>', tip:'Danh sách số' },
      { sep:true },
      { cmd:'justifyLeft',   icon:'<svg width="14" height="12" viewBox="0 0 14 12"><rect x="0" y="0" width="14" height="2" rx="1" fill="currentColor"/><rect x="0" y="5" width="9" height="2" rx="1" fill="currentColor"/><rect x="0" y="10" width="14" height="2" rx="1" fill="currentColor"/></svg>', tip:'Căn trái' },
      { cmd:'justifyCenter', icon:'<svg width="14" height="12" viewBox="0 0 14 12"><rect x="0" y="0" width="14" height="2" rx="1" fill="currentColor"/><rect x="3" y="5" width="8" height="2" rx="1" fill="currentColor"/><rect x="0" y="10" width="14" height="2" rx="1" fill="currentColor"/></svg>', tip:'Căn giữa' },
      { sep:true },
      { cmd:'removeFormat', icon:'<svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>', tip:'Xoá định dạng' },
    ],
    writer: [
      { cmd:'bold',      icon:'<b>B</b>',  tip:'In đậm (Ctrl+B)' },
      { cmd:'italic',    icon:'<i>I</i>',  tip:'In nghiêng (Ctrl+I)' },
      { cmd:'underline', icon:'<u>U</u>',  tip:'Gạch dưới (Ctrl+U)' },
      { sep:true },
      { type:'foreColor', icon:'<span class="re-ci-text">A</span>', tip:'Màu chữ', default:'#e53e3e' },
      { sep:true },
      { cmd:'insertUnorderedList', icon:'<svg width="14" height="14" viewBox="0 0 14 14"><circle cx="2" cy="4" r="1.5" fill="currentColor"/><rect x="5" y="3" width="8" height="2" rx="1" fill="currentColor"/><circle cx="2" cy="10" r="1.5" fill="currentColor"/><rect x="5" y="9" width="8" height="2" rx="1" fill="currentColor"/></svg>', tip:'Bullet points' },
      { cmd:'insertOrderedList',   icon:'<svg width="14" height="14" viewBox="0 0 14 14"><text x="0" y="5" font-size="5" fill="currentColor" font-family="sans-serif">1.</text><text x="0" y="11" font-size="5" fill="currentColor" font-family="sans-serif">2.</text><rect x="6" y="3" width="7" height="2" rx="1" fill="currentColor"/><rect x="6" y="9" width="7" height="2" rx="1" fill="currentColor"/></svg>', tip:'Danh sách số' },
      { sep:true },
      { cmd:'removeFormat', icon:'<svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>', tip:'Xoá định dạng' },
    ],
    minimal: [
      { cmd:'bold',      icon:'<b>B</b>',  tip:'In đậm' },
      { cmd:'italic',    icon:'<i>I</i>',  tip:'In nghiêng' },
      { cmd:'underline', icon:'<u>U</u>',  tip:'Gạch dưới' },
      { sep:true },
      { type:'foreColor', icon:'<span class="re-ci-text">A</span>', tip:'Màu chữ', default:'#e53e3e' },
      { sep:true },
      { cmd:'removeFormat', icon:'<svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>', tip:'Xoá định dạng' },
    ]
  };

  /* ─────────────────────────────────────────────────────────────────
     CLASS RichEditor
  ──────────────────────────────────────────────────────────────── */
  function RichEditor(targetOrId, opts) {
    opts = opts || {};
    var target = typeof targetOrId === 'string'
      ? document.getElementById(targetOrId)
      : targetOrId;
    if (!target) { console.warn('[RichEditor] element not found:', targetOrId); return; }

    this._target   = target;
    this._opts     = opts;
    this._body     = null;
    this._wrap     = null;
    this._btns     = [];
    this._syncTimer = null;

    this._build();
  }

  /* ── Build DOM ── */
  RichEditor.prototype._build = function () {
    var self   = this;
    var target = this._target;
    var opts   = this._opts;

    /* Wrapper */
    var wrap = document.createElement('div');
    wrap.className = 're-wrap' + (opts.wrapClass ? ' ' + opts.wrapClass : '');

    /* Toolbar */
    var preset = opts.toolbar || 'writer';
    var btns   = typeof preset === 'string' ? (PRESETS[preset] || PRESETS.writer) : preset;
    var tb     = this._buildToolbar(btns);
    wrap.appendChild(tb);

    /* Editable body */
    var body = document.createElement('div');
    body.className   = 're-body';
    body.contentEditable = 'true';
    body.spellcheck  = true;
    var mh = opts.minHeight || target.style.minHeight || '120px';
    body.style.minHeight = mh;
    var ph = opts.placeholder || target.placeholder || target.getAttribute('placeholder') || '';
    if (ph) body.setAttribute('data-placeholder', ph);

    /* Pre-load existing value */
    var init = target.value || '';
    if (init) body.innerHTML = sanitize(init);

    wrap.appendChild(body);
    this._body = body;
    this._wrap = wrap;

    /* Insert wrap right after the original target; hide target */
    target.parentNode.insertBefore(wrap, target.nextSibling);
    target.style.display = 'none';
    target.setAttribute('data-re', '1');

    /* Sync body → hidden target (debounced 60ms) */
    body.addEventListener('input', function () {
      clearTimeout(self._syncTimer);
      self._syncTimer = setTimeout(function () {
        target.value = self.getHTML();
        /* Fire custom event so external listeners still work */
        var ev = new Event('re-input', { bubbles: true });
        target.dispatchEvent(ev);
        if (opts.onChange) opts.onChange(self);
      }, 60);
    });

    /* Toolbar active-state on caret move */
    body.addEventListener('keyup',    function () { self._refreshState(); });
    body.addEventListener('mouseup',  function () { self._refreshState(); });
    body.addEventListener('touchend', function () { self._refreshState(); });
  };

  /* ── Build Toolbar DOM ── */
  RichEditor.prototype._buildToolbar = function (btns) {
    var self = this;
    var bar  = document.createElement('div');
    bar.className = 're-toolbar';

    btns.forEach(function (b) {
      if (b.sep) {
        var s = document.createElement('span');
        s.className = 're-sep';
        bar.appendChild(s);
        return;
      }

      if (b.type === 'foreColor' || b.type === 'hiliteColor') {
        /* Color-picker button */
        var lbl = document.createElement('label');
        lbl.className = 're-btn re-color-wrap';
        lbl.title     = b.tip || '';
        lbl.innerHTML = b.icon || 'A';

        var inp = document.createElement('input');
        inp.type      = 'color';
        inp.className = 're-color-inp';
        inp.value     = b.default || '#000000';
        inp.addEventListener('input', function (e) {
          self._body.focus();
          document.execCommand(b.type, false, e.target.value);
          self._body.dispatchEvent(new Event('input', { bubbles: true }));
        });
        lbl.appendChild(inp);
        bar.appendChild(lbl);
        return;
      }

      /* Regular command button */
      var btn = document.createElement('button');
      btn.type      = 'button';
      btn.className = 're-btn';
      btn.title     = b.tip || '';
      btn.innerHTML = b.icon || b.cmd;
      btn.dataset.cmd = b.cmd;

      btn.addEventListener('mousedown', function (e) {
        e.preventDefault(); /* keep editor focused */
        self._body.focus();
        document.execCommand(b.cmd, false, null);
        self._body.dispatchEvent(new Event('input', { bubbles: true }));
        setTimeout(function () { self._refreshState(); }, 10);
      });

      bar.appendChild(btn);
      self._btns.push({ el: btn, cmd: b.cmd });
    });

    return bar;
  };

  /* ── Update active states on toolbar buttons ── */
  RichEditor.prototype._refreshState = function () {
    this._btns.forEach(function (item) {
      try {
        var on = document.queryCommandState(item.cmd);
        item.el.classList.toggle('active', on);
      } catch (e) { /* ignored */ }
    });
  };

  /* ── Public API ── */
  RichEditor.prototype.getHTML = function () {
    return this._body ? sanitize(this._body.innerHTML) : '';
  };

  RichEditor.prototype.getText = function () {
    if (!this._body) return '';
    return this._body.innerText !== undefined ? this._body.innerText : (this._body.textContent || '');
  };

  RichEditor.prototype.wordCount = function () {
    return countWords(this.getText());
  };

  RichEditor.prototype.setHTML = function (html) {
    if (!this._body) return;
    this._body.innerHTML = sanitize(html || '');
    this._target.value   = html || '';
  };

  RichEditor.prototype.clear = function () {
    this.setHTML('');
  };

  RichEditor.prototype.focus = function () {
    if (this._body) this._body.focus();
  };

  RichEditor.prototype.destroy = function () {
    if (this._wrap) this._wrap.remove();
    if (this._target) {
      this._target.style.display = '';
      this._target.removeAttribute('data-re');
    }
  };

  /* ── Static helpers ── */
  RichEditor.stripTags  = stripTags;
  RichEditor.countWords = countWords;
  RichEditor.sanitize   = sanitize;

  global.RichEditor = RichEditor;

})(window);
