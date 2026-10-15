/* EWT City — ÂM THANH MÔI TRƯỜNG tạo bằng WebAudio (không cần file âm thanh): chim hót ban ngày, dế ban đêm, tiếng mưa, tiếng nước / sóng, gió.
   Bật cùng nút nhạc nền 🔊. API: EWTAmbient.set(on) · EWTAmbient.tick({ night:0..1, weather:'clear|cloud|rain|snow', water:0..1, rainy }) mỗi ~1,5 giây. */
(function (root) {
  'use strict';
  var ctx = null, master = null, on = false, bus = {}, nextBird = 0, nextCricket = 0, ok = true;
  function ensure() {
    if (ctx) return true; if (!ok) return false;
    try {
      var AC = root.AudioContext || root.webkitAudioContext; if (!AC) { ok = false; return false; }
      ctx = new AC(); master = ctx.createGain(); master.gain.value = .5; master.connect(ctx.destination);
      var len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0), i, last = 0;
      for (i = 0; i < len; i++) { var wn = Math.random() * 2 - 1; last = (last + .02 * wn) / 1.02; d[i] = wn * .5 + last * 3; }
      var mk = function (type, freq, q) { var s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; var f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; if (q) f.Q.value = q; var g = ctx.createGain(); g.gain.value = 0; s.connect(f); f.connect(g); g.connect(master); s.start(); return g; };
      bus.rain = mk('highpass', 1400); bus.water = mk('lowpass', 520); bus.wind = mk('bandpass', 380, .7);
    } catch (e) { ok = false; ctx = null; return false; }
    return true;
  }
  function chirp(t0) {
    var n = 2 + Math.floor(Math.random() * 3), f0 = 2200 + Math.random() * 1600, i;
    for (i = 0; i < n; i++) {
      var t = t0 + i * (.11 + Math.random() * .05), o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * (1.25 + Math.random() * .35), t + .07);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.05, t + .015); g.gain.exponentialRampToValueAtTime(.0008, t + .09); o.connect(g); g.connect(master); o.start(t); o.stop(t + .1);
    }
  }
  function cricket(t0) {
    var i, n = 3 + Math.floor(Math.random() * 3);
    for (i = 0; i < n; i++) { var t = t0 + i * .07, o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = 4200 + Math.random() * 300; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.022, t + .01); g.gain.linearRampToValueAtTime(0, t + .05); o.connect(g); g.connect(master); o.start(t); o.stop(t + .06); }
  }
  var API = {
    set: function (v) { on = !!v; if (on) { if (ensure() && ctx.state === 'suspended') ctx.resume(); } else if (ctx) { ['rain', 'water', 'wind'].forEach(function (k) { if (bus[k]) bus[k].gain.setTargetAtTime(0, ctx.currentTime, .3); }); } },
    tick: function (o) {
      if (!on || !ensure()) return; if (ctx.state === 'suspended') ctx.resume(); o = o || {};
      var t = ctx.currentTime, night = o.night || 0, wea = o.weather || 'clear', rainy = wea === 'rain';
      bus.rain.gain.setTargetAtTime(rainy ? .16 : 0, t, .6); bus.water.gain.setTargetAtTime((o.water || 0) * (rainy ? .1 : .07) + (rainy ? .05 : 0), t, .8); bus.wind.gain.setTargetAtTime(wea === 'cloud' || wea === 'snow' ? .05 : .02, t, 1);
      if (!rainy && night < .4 && t >= nextBird) { chirp(t + .05); nextBird = t + 1.2 + Math.random() * 4.5; }
      if (!rainy && night > .6 && t >= nextCricket) { cricket(t + .05); nextCricket = t + .5 + Math.random() * 1.2; }
    }
  };
  root.EWTAmbient = API;
})(typeof window !== 'undefined' ? window : this);
