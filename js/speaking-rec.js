/* Ghi âm WAV 16 kHz mono ngay trên trình duyệt (chạy được trên Chrome, Safari iPhone, Firefox…) + đọc câu hỏi bằng giọng máy.
   Dùng WAV để AI chấm được trên mọi thiết bị (không phụ thuộc định dạng riêng của từng trình duyệt). */
(function () {
  'use strict';
  var stream = null, ctx = null, src = null, proc = null, mute = null, chunks = [], rate = 48000, recording = false, onLevel = null, startedAt = 0, peak = 0;

  function supported() { return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && (window.AudioContext || window.webkitAudioContext)); }

  function openMic() {
    if (stream && stream.getAudioTracks().some(function (t) { return t.readyState === 'live'; })) return Promise.resolve(stream);
    return navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true } }).then(function (s) {
      stream = s;
      var AC = window.AudioContext || window.webkitAudioContext;
      ctx = ctx || new AC();
      if (ctx.state === 'suspended') ctx.resume();
      rate = ctx.sampleRate;
      src = ctx.createMediaStreamSource(s);
      proc = ctx.createScriptProcessor(4096, 1, 1);
      mute = ctx.createGain(); mute.gain.value = 0;
      proc.onaudioprocess = function (e) {
        var d = e.inputBuffer.getChannelData(0), s2 = 0, i;
        for (i = 0; i < d.length; i++) s2 += d[i] * d[i];
        var rms = Math.sqrt(s2 / d.length); if (rms > peak) peak = rms;
        if (onLevel) onLevel(rms);
        if (recording) chunks.push(new Float32Array(d));
      };
      src.connect(proc); proc.connect(mute); mute.connect(ctx.destination);
      return s;
    });
  }
  function closeMic() {
    try { if (proc) { proc.disconnect(); proc.onaudioprocess = null; } if (src) src.disconnect(); } catch (e) {}
    if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
    stream = null; src = null; proc = null;
    try { if (ctx) ctx.close(); } catch (e) {} ctx = null;
  }
  function setLevelCb(fn) { onLevel = fn; }

  function start() {
    if (!stream) return Promise.reject(new Error('Chưa bật micro'));
    if (ctx && ctx.state === 'suspended') ctx.resume();
    chunks = []; peak = 0; recording = true; startedAt = Date.now();
    return Promise.resolve();
  }

  function toWav(f32, inRate) {
    var outRate = 16000, ratio = inRate / outRate, n = Math.floor(f32.length / ratio), out = new Int16Array(n), i, j, a, b, s, cnt;
    for (i = 0; i < n; i++) {
      a = Math.floor(i * ratio); b = Math.min(f32.length, Math.floor((i + 1) * ratio)); s = 0; cnt = 0;
      for (j = a; j < b; j++) { s += f32[j]; cnt++; }
      var v = cnt ? s / cnt : 0; v = Math.max(-1, Math.min(1, v));
      out[i] = v < 0 ? v * 0x8000 : v * 0x7fff;
    }
    var buf = new ArrayBuffer(44 + out.length * 2), dv = new DataView(buf);
    function w(o, t) { for (var k = 0; k < t.length; k++) dv.setUint8(o + k, t.charCodeAt(k)); }
    w(0, 'RIFF'); dv.setUint32(4, 36 + out.length * 2, true); w(8, 'WAVE'); w(12, 'fmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true);
    dv.setUint32(24, outRate, true); dv.setUint32(28, outRate * 2, true); dv.setUint16(32, 2, true); dv.setUint16(34, 16, true); w(36, 'data'); dv.setUint32(40, out.length * 2, true);
    for (i = 0; i < out.length; i++) dv.setInt16(44 + i * 2, out[i], true);
    return { blob: new Blob([buf], { type: 'audio/wav' }), dur: out.length / outRate };
  }
  function stop() {
    recording = false;
    var total = 0, i; chunks.forEach(function (c) { total += c.length; });
    var all = new Float32Array(total), o = 0; chunks.forEach(function (c) { all.set(c, o); o += c.length; }); chunks = [];
    var r = toWav(all, rate); r.peak = peak; return r;
  }
  function discard() { recording = false; chunks = []; }

  /* Giọng đọc của "giám khảo" (Web Speech API) */
  var voice = null;
  function pickVoice() {
    if (!window.speechSynthesis) return null;
    var vs = speechSynthesis.getVoices() || [];
    var pref = ['Daniel', 'Google UK English Female', 'Google UK English Male', 'Serena', 'Kate', 'Samantha'];
    for (var i = 0; i < pref.length; i++) { var m = vs.filter(function (v) { return v.name.indexOf(pref[i]) === 0 && /^en/i.test(v.lang); })[0]; if (m) return m; }
    return vs.filter(function (v) { return /^en-GB/i.test(v.lang); })[0] || vs.filter(function (v) { return /^en/i.test(v.lang); })[0] || null;
  }
  function speak(text) {
    return new Promise(function (resolve) {
      if (!window.speechSynthesis || !text) return resolve(false);
      try {
        speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text);
        voice = voice || pickVoice(); if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = 'en-GB';
        u.rate = 0.92; u.pitch = 1;
        var done = false, fin = function (ok) { if (done) return; done = true; clearTimeout(tm); resolve(ok); };
        var tm = setTimeout(function () { fin(false); }, Math.max(6000, text.length * 120));
        u.onend = function () { fin(true); }; u.onerror = function () { fin(false); };
        speechSynthesis.speak(u);
      } catch (e) { resolve(false); }
    });
  }
  function cancelSpeech() { try { speechSynthesis.cancel(); } catch (e) {} }
  if (window.speechSynthesis) { speechSynthesis.onvoiceschanged = function () { voice = pickVoice(); }; }

  window.EWTRec = { supported: supported, openMic: openMic, closeMic: closeMic, setLevelCb: setLevelCb, start: start, stop: stop, discard: discard, speak: speak, cancelSpeech: cancelSpeech, isRecording: function () { return recording; } };
})();
