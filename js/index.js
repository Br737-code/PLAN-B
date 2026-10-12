/* =========================================================
   PNG Events Hub - HOME page script
   Place in: js/index.js
   Mobile menu, header shadow, hero search.
   ========================================================= */
(function () {
    'use strict';

    var header = document.querySelector('header');
    var toggle = document.querySelector('.nav-toggle');
    var navList = document.getElementById('nav-list');

    /* ---------- Mobile navigation ---------- */
    if (header && toggle && navList) {
        header.classList.add('js-ready');   // tells the CSS the Menu button can be used

        var setMenu = function (open) {
            navList.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            toggle.textContent = open ? 'Close' : 'Menu';
        };

        toggle.addEventListener('click', function () {
            setMenu(toggle.getAttribute('aria-expanded') !== 'true');
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navList.classList.contains('is-open')) {
                setMenu(false);
                toggle.focus();
            }
        });

        document.addEventListener('click', function (e) {
            if (!header.contains(e.target)) setMenu(false);
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) setMenu(false);
        });
    }

    /* ---------- Header shadow on scroll ---------- */
    if (header) {
        var onScroll = function () {
            header.classList.toggle('is-scrolled', window.scrollY > 8);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---------- Hero search -> events.html?q=... ---------- */
    var form = document.getElementById('hero-search');
    var input = document.getElementById('hero-q');

    if (form && input) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var query = input.value.trim();

            if (!query) {
                form.classList.add('has-error');
                input.setAttribute('aria-invalid', 'true');
                input.focus();
                return;
            }
            window.location.href = 'events.html?q=' + encodeURIComponent(query);
        });

        input.addEventListener('input', function () {
            form.classList.remove('has-error');
            input.removeAttribute('aria-invalid');
        });
    }
})();
