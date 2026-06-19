
!(function($) {
  "use strict";

  // Hero typed
  if ($('.typed').length) {
    var typed_strings = $(".typed").data('typed-items');
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  // Smooth scroll for the navigation menu and links with .scrollto classes
  function getFixedHeaderOffset() {
    var topbar = document.querySelector('.main-topbar');
    return topbar ? topbar.offsetHeight : 56;
  }

  function scrollToTarget(target, animate) {
    if (!target.length) {
      return false;
    }

    var scrollto = target.offset().top - getFixedHeaderOffset() - 16;

    if (animate) {
      $('html, body').stop(true).animate({
        scrollTop: scrollto
      }, 1500, 'easeInOutExpo');
    } else {
      $('html, body').scrollTop(scrollto);
    }

    return true;
  }

  function scrollToSectionHash(hash, animate) {
    var target = $(hash);
    if (!target.length) {
      return false;
    }

    if (history.replaceState) {
      history.replaceState(null, '', hash);
    } else {
      window.location.hash = hash;
    }

    scrollToTarget(target, animate);

    // Deferred sections replace placeholders after load — keep scroll aligned
    var main = document.getElementById('main');
    if (!main) {
      return true;
    }

    var realignCount = 0;
    var realignTimer = setInterval(function() {
      scrollToTarget($(hash), false);
      realignCount += 1;
      if (realignCount >= 10) {
        clearInterval(realignTimer);
      }
    }, 250);

    var observer = new MutationObserver(function() {
      scrollToTarget($(hash), false);
    });

    observer.observe(main, { childList: true, subtree: true });

    setTimeout(function() {
      observer.disconnect();
      clearInterval(realignTimer);
      scrollToTarget($(hash), false);
    }, 3000);

    return true;
  }

  $(document).on('click', '.nav-menu a, .scrollto', function(e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      if (!this.hash) {
        return;
      }

      e.preventDefault();

      if (scrollToSectionHash(this.hash, true)) {
        if ($(this).parents('.nav-menu, .mobile-nav').length) {
          $('.nav-menu .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
        }
      }

      return false;
    }
  });

  // Activate smooth scroll on page load with hash links in the url
  $(document).ready(function() {
    if (window.location.hash) {
      scrollToSectionHash(window.location.hash, true);
    }
  });

  $(document).on('click', '.mobile-nav-toggle', function(e) {
    $('body').toggleClass('mobile-nav-active');
    $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
  });

  $(document).click(function(e) {
    var container = $(".mobile-nav-toggle");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      if ($('body').hasClass('mobile-nav-active')) {
        $('body').removeClass('mobile-nav-active');
        $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      }
    }
  });

  // Navigation active state + back-to-top (single throttled scroll handler)
  var nav_sections = $('section');
  var main_nav = $('.nav-menu, .mobile-nav');
  var backToTop = $('.back-to-top');
  var scrollTicking = false;

  function onWindowScroll() {
    var cur_pos = $(window).scrollTop() + 200;

    nav_sections.each(function() {
      var top = $(this).offset().top,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        if (cur_pos <= bottom) {
          main_nav.find('li').removeClass('active');
        }
        main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
      }
      if (cur_pos < 320) {
        main_nav.find('li').removeClass('active');
        main_nav.find('a[href="#hero"]').parent('li').addClass('active');
      }
    });

    backToTop.toggleClass('is-visible', $(window).scrollTop() > 100);
    scrollTicking = false;
  }

  $(window).on('scroll', function() {
    if (!scrollTicking) {
      scrollTicking = true;
      window.requestAnimationFrame(onWindowScroll);
    }
  });

  onWindowScroll();

  $('.back-to-top').click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 1500, 'easeInOutExpo');
    return false;
  });

})(jQuery);