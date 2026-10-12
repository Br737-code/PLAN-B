/* =========================================================
   PNG Events Hub - EVENTS page script
   Place in: js/events.js
   Keyword search + category filter + header shadow.
   Also reads ?q=... sent from the home page search.
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

    /* ---------- Events search + filter (events.html) ---------- */
    var container = document.getElementById('eventsContainer');
    if (!container) return;

    var cards = Array.prototype.slice.call(container.querySelectorAll('.event-card'));
    var searchInput = document.getElementById('searchInput');
    var statusEl = document.getElementById('searchStatus');
    var buttons = document.querySelectorAll('.filter-btn');

    var state = { category: 'all', query: '' };

    // "No results" message, created once and placed after the cards
    var empty = document.createElement('p');
    empty.className = 'no-results';
    empty.hidden = true;
    container.insertAdjacentElement('afterend', empty);

    // Pre-compute searchable text for each card
    var index = cards.map(function (card) {
        return card.textContent.replace(/\s+/g, ' ').toLowerCase();
    });

    function apply() {
        var terms = state.query.toLowerCase().split(/\s+/).filter(Boolean);
        var shown = 0;

        cards.forEach(function (card, i) {
            var catOk = state.category === 'all' || card.dataset.category === state.category;
            var textOk = terms.every(function (t) { return index[i].indexOf(t) !== -1; });
            var visible = catOk && textOk;
            card.hidden = !visible;
            if (visible) shown++;
        });

        if (statusEl) {
            statusEl.textContent = 'Showing ' + shown + ' of ' + cards.length + ' events';
        }

        if (shown === 0) {
            empty.textContent = state.query
                ? 'No events match \u201C' + state.query + '\u201D. Try another word or choose All Events.'
                : 'No events in this category yet.';
            empty.hidden = false;
        } else {
            empty.hidden = true;
        }
    }

    buttons.forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(btn.classList.contains('active')));
        btn.addEventListener('click', function () {
            buttons.forEach(function (b) {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            state.category = btn.dataset.category;
            apply();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            state.query = searchInput.value.trim();
            apply();
        });
    }

    // Search sent from the home page: events.html?q=lae
    var q = new URLSearchParams(window.location.search).get('q');
    if (q && searchInput) {
        searchInput.value = q;
        state.query = q.trim();
    }
    apply();
})();
