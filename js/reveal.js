(function () {
  'use strict';

  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function inViewport(el) {
    var rect = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < vh * 0.92 && rect.bottom > vh * 0.04;
  }

  function revealOne(el, io) {
    if (el.classList.contains('in')) {
      return;
    }

    var sibs = Array.prototype.slice.call(
      el.parentNode.querySelectorAll(':scope > .reveal')
    );
    var pos = sibs.indexOf(el);
    el.style.transitionDelay = (Math.max(0, pos) * 0.07).toFixed(2) + 's';
    el.classList.add('in');

    if (io) {
      io.unobserve(el);
    }
  }

  function reveals() {
    var items = document.querySelectorAll('.reveal:not(.in)');
    if (!items.length) {
      return;
    }

    if (RM || !('IntersectionObserver' in window)) {
      items.forEach(function (it) {
        revealOne(it);
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) {
          return;
        }
        revealOne(e.target, io);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });

    items.forEach(function (it) {
      if (inViewport(it)) {
        revealOne(it, io);
        return;
      }
      io.observe(it);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', reveals);
  } else {
    reveals();
  }

  /* Re-scan when Angular renders sections */
  var main = document.getElementById('main');
  if (main && window.MutationObserver) {
    var rescanTimer;
    new MutationObserver(function () {
      clearTimeout(rescanTimer);
      rescanTimer = setTimeout(reveals, 80);
    }).observe(main, { childList: true, subtree: true });
  }

  /* Safety net: never leave reveal content permanently hidden */
  window.setTimeout(reveals, 1200);
})();
