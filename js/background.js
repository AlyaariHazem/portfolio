(function () {
  'use strict';

  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function buildBackground() {
    var host = document.getElementById('bg');
    var canvas = document.getElementById('bgCanvas');
    if (!host || !canvas || !canvas.getContext) {
      return;
    }

    var ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var W = 1;
    var H = 1;
    var nodes = [];
    var connect = 150;
    var c2 = connect * connect;
    var glow = true;
    var raf = 0;
    var running = false;
    var sY = 0;
    var mouse = { tx: 0, ty: 0, x: 0, y: 0 };
    var palette = pickPalette();

    function pickPalette() {
      var root = document.documentElement;
      var dark = root.getAttribute('data-theme') === 'dark' || root.classList.contains('dark');
      return dark
        ? { dot: [107, 163, 199], line: [74, 121, 165] }
        : { dot: [33, 77, 114], line: [26, 74, 110] };
    }

    function size() {
      W = host.clientWidth || window.innerWidth;
      H = host.clientHeight || window.innerHeight;
      canvas.width = Math.max(1, Math.round(W * DPR));
      canvas.height = Math.max(1, Math.round(H * DPR));
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      connect = W < 700 ? 116 : 150;
      c2 = connect * connect;
      glow = W >= 700;
      seed();
    }

    function seed() {
      var count = Math.max(34, Math.min(W < 700 ? 66 : 116, Math.round((W * H) / 14500)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        var depth = 0.3 + Math.random() * 0.85;
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.16,
          vy: (Math.random() - 0.5) * 0.16,
          depth: depth,
          pulse: Math.random() < 0.09 ? Math.random() * 6.283 : -1,
          px: 0,
          py: 0
        });
      }
    }

    function wrap(v, l) {
      v %= l;
      return v < 0 ? v + l : v;
    }

    function render(motion) {
      if (motion) {
        sY = window.pageYOffset || document.documentElement.scrollTop || 0;
        mouse.x += (mouse.tx - mouse.x) * 0.05;
        mouse.y += (mouse.ty - mouse.y) * 0.05;
      } else {
        sY = 0;
        mouse.x = 0;
        mouse.y = 0;
      }

      ctx.clearRect(0, 0, W, H);

      var i;
      var j;
      var n;
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        if (motion) {
          n.x = wrap(n.x + n.vx, W);
          n.y = wrap(n.y + n.vy, H);
        }
        var ox = mouse.x * 26 * n.depth;
        var oy = -sY * 0.16 * n.depth + mouse.y * 26 * n.depth;
        n.px = wrap(n.x + ox, W);
        n.py = wrap(n.y + oy, H);
      }

      var lc = palette.line;
      var lr = lc[0];
      var lg = lc[1];
      var lb = lc[2];
      ctx.lineWidth = 1;
      for (i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        for (j = i + 1; j < nodes.length; j++) {
          var b = nodes[j];
          var dx = a.px - b.px;
          var dy = a.py - b.py;
          if (dx < -connect || dx > connect || dy < -connect || dy > connect) {
            continue;
          }
          var d2 = dx * dx + dy * dy;
          if (d2 < c2) {
            var op = (1 - Math.sqrt(d2) / connect) * 0.5 * ((a.depth + b.depth) * 0.5);
            ctx.strokeStyle = 'rgba(' + lr + ',' + lg + ',' + lb + ',' + op.toFixed(3) + ')';
            ctx.beginPath();
            ctx.moveTo(a.px, a.py);
            ctx.lineTo(b.px, b.py);
            ctx.stroke();
          }
        }
      }

      var dc = palette.dot;
      var dr = dc[0];
      var dg = dc[1];
      var db = dc[2];
      var t = motion ? performance.now() * 0.001 : 0;
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        var r = 1.1 + n.depth * 1.5;
        var op2 = 0.3 + n.depth * 0.35;
        if (motion && n.pulse >= 0) {
          var pp = (Math.sin(t * 1.3 + n.pulse) + 1) * 0.5;
          r += pp * 1.8;
          op2 = Math.min(0.95, op2 + pp * 0.4);
          if (glow) {
            ctx.shadowColor = 'rgba(' + dr + ',' + dg + ',' + db + ',0.85)';
            ctx.shadowBlur = 8 + pp * 12;
          }
        } else if (glow) {
          ctx.shadowBlur = 0;
        }
        ctx.fillStyle = 'rgba(' + dr + ',' + dg + ',' + db + ',' + op2.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(n.px, n.py, r, 0, 6.283);
        ctx.fill();
      }
      if (glow) {
        ctx.shadowBlur = 0;
      }
    }

    function loop() {
      render(true);
      raf = requestAnimationFrame(loop);
    }

    function start() {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    }

    function stop() {
      running = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    size();

    if (RM) {
      render(false);
    } else {
      start();
      if (window.matchMedia && window.matchMedia('(pointer:fine)').matches) {
        window.addEventListener('mousemove', function (e) {
          mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
          mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
        }, { passive: true });
      }
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          stop();
        } else {
          start();
        }
      });
    }

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        size();
        if (RM) {
          render(false);
        }
      }, 180);
    });

    if (window.MutationObserver) {
      new MutationObserver(function () {
        palette = pickPalette();
        if (RM) {
          render(false);
        }
      }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildBackground);
  } else {
    buildBackground();
  }
})();
