/* =========================================================
   PNG Events Hub - ABOUT page script
   Place in: js/about.js
   FAQ accordion + header shadow.
   ========================================================= */
(function () {
    'use strict';

    /* ---------- Header shadow on scroll ---------- */
    var header = document.querySelector('header');
    if (header) {
        var onScroll = function () {
            header.classList.toggle('is-scrolled', window.scrollY > 8);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---------- FAQ accordion ---------- */
    document.querySelectorAll('.faq-question').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var open = btn.getAttribute('aria-expanded') === 'true';
            var answer = document.getElementById(btn.getAttribute('aria-controls'));
            btn.setAttribute('aria-expanded', String(!open));
            if (answer) answer.hidden = open;
        });
    });
})();
