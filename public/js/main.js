
!(function($) {
  "use strict";

  function getFixedHeaderOffset() {
    var header = document.querySelector('#header.site-header, #header');
    return header ? header.offsetHeight : 72;
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
    return true;
  }

  $(document).on('click', '.nav-menu a, .mobile-nav a, .scrollto', function(e) {
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
      }

      return false;
    }
  });

  $(document).ready(function() {
    if (window.location.hash) {
      scrollToSectionHash(window.location.hash, true);
    }
  });

  var nav_sections = $('section');
  var main_nav = $('.nav-menu, .mobile-nav');
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

    scrollTicking = false;
  }

  $(window).on('scroll', function() {
    if (!scrollTicking) {
      scrollTicking = true;
      window.requestAnimationFrame(onWindowScroll);
    }
  });

  onWindowScroll();

})(jQuery);
