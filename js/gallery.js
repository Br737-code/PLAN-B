/* =========================================================
   PNG Events Hub - GALLERY lightbox
   Place in: js/gallery.js
   Uses the native <dialog>: Esc closes, focus is handled by
   the browser. Adds arrows, keyboard and swipe navigation.
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

    var thumbs = Array.prototype.slice.call(document.querySelectorAll('.gallery-thumb'));
    var dialog = document.getElementById('lightbox');
    if (!thumbs.length || !dialog) return;

    var img = document.getElementById('lightbox-img');
    var caption = document.getElementById('lightbox-caption');
    var closeBtn = dialog.querySelector('.lightbox-close');
    var prevBtn = dialog.querySelector('.lightbox-prev');
    var nextBtn = dialog.querySelector('.lightbox-next');
    var current = 0;

    function show(i) {
        current = (i + thumbs.length) % thumbs.length;          // wrap around
        var thumb = thumbs[current];
        var thumbImg = thumb.querySelector('img');
        img.src = thumb.dataset.full || thumbImg.src;
        img.alt = thumbImg ? thumbImg.alt : '';
        caption.textContent = thumb.dataset.caption || '';
    }

    function open(i) {
        show(i);
        if (typeof dialog.showModal === 'function') dialog.showModal();
        else dialog.setAttribute('open', '');
        document.body.classList.add('lightbox-open');
    }

    function close() {
        if (typeof dialog.close === 'function') dialog.close();
        else dialog.removeAttribute('open');
    }

    thumbs.forEach(function (thumb, i) {
        thumb.addEventListener('click', function () { open(i); });
    });

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { show(current - 1); });
    nextBtn.addEventListener('click', function () { show(current + 1); });

    // Return focus to the photo that was opened
    dialog.addEventListener('close', function () {
        document.body.classList.remove('lightbox-open');
        thumbs[current].focus();
    });

    // Click on the dark area (not the photo or buttons) closes it
    dialog.addEventListener('click', function (e) {
        if (e.target === dialog) close();
    });

    // Arrow keys
    document.addEventListener('keydown', function (e) {
        if (!dialog.open) return;
        if (e.key === 'ArrowLeft') show(current - 1);
        if (e.key === 'ArrowRight') show(current + 1);
    });

    // Swipe left/right on touch screens
    var startX = null;
    dialog.addEventListener('touchstart', function (e) {
        startX = e.changedTouches[0].clientX;
    }, { passive: true });
    dialog.addEventListener('touchend', function (e) {
        if (startX === null) return;
        var dx = e.changedTouches[0].clientX - startX;
        startX = null;
        if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    }, { passive: true });
})();
