/* =========================================================
   PNG Events Hub - CONTACT page script
   Place in: js/contact.js
   Registration form validation + header shadow
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

    var form = document.getElementById('registration-form');
    if (!form) return;

    var statusBox = document.getElementById('form-status');
    var message = document.getElementById('message');
    var counter = document.getElementById('message-count');

    /* Each rule returns an error string, or '' when the field is valid */
    var rules = {
        fullname: function (el) {
            var v = el.value.trim();
            if (!v) return 'Enter your full name.';
            if (v.length < 2) return 'Your name must be at least 2 characters.';
            return '';
        },
        email: function (el) {
            var v = el.value.trim();
            if (!v) return 'Enter your email address.';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Enter a valid email, like name@example.com.';
            return '';
        },
        phone: function (el) {
            var v = el.value.replace(/[\s-]/g, '');
            if (!v) return 'Enter your phone number.';
            v = v.replace(/^\+?675/, '');            // allow +675 or 675 prefix
            if (!/^\d{7,8}$/.test(v)) return 'Enter 7 or 8 digits. You can start with +675.';
            return '';
        },
        event: function (el) {
            return el.value ? '' : 'Choose an event from the list.';
        },
        attendees: function (el) {
            var v = el.value.trim();
            if (!v) return 'Enter the number of attendees.';
            var n = Number(v);
            if (!Number.isInteger(n) || n < 1 || n > 20) return 'Enter a whole number from 1 to 20.';
            return '';
        },
        consent: function (el) {
            return el.checked ? '' : 'Tick the box to agree to be contacted.';
        }
    };

    function check(el) {
        var rule = rules[el.name];
        if (!rule) return true;
        var error = rule(el);
        var out = document.getElementById(el.id + '-error');
        if (out) out.textContent = error;
        if (error) el.setAttribute('aria-invalid', 'true');
        else el.removeAttribute('aria-invalid');
        return !error;
    }

    function fields() {
        return Array.prototype.filter.call(form.elements, function (el) { return rules[el.name]; });
    }

    function showStatus(type, text) {
        statusBox.className = 'form-status ' + (type === 'success' ? 'is-success' : 'is-error');
        statusBox.textContent = text;
        statusBox.focus();
        statusBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function clearStatus() {
        statusBox.className = 'form-status';
        statusBox.textContent = '';
    }

    /* Live feedback: validate when leaving a field, re-check as they fix it */
    fields().forEach(function (el) {
        var evt = (el.tagName === 'SELECT' || el.type === 'checkbox') ? 'change' : 'blur';
        el.addEventListener(evt, function () { check(el); });
        el.addEventListener('input', function () {
            if (el.getAttribute('aria-invalid') === 'true') check(el);
        });
    });

    /* Message character counter */
    function updateCount() {
        if (message && counter) {
            counter.textContent = message.value.length + ' / ' + message.maxLength + ' characters';
        }
    }
    if (message) message.addEventListener('input', updateCount);

    /* Submit */
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearStatus();

        var firstBad = null;
        fields().forEach(function (el) {
            if (!check(el) && !firstBad) firstBad = el;
        });

        if (firstBad) {
            showStatus('error', 'Please fix the highlighted fields and send the form again.');
            firstBad.focus();
            return;
        }

        var name = form.elements.fullname.value.trim();
        var email = form.elements.email.value.trim();
        var count = Number(form.elements.attendees.value);
        var sel = form.elements.event;
        var eventName = sel.options[sel.selectedIndex].text;

        var text = (sel.value === 'general')
            ? 'Thank you, ' + name + '. Your message has been sent. We will reply to ' + email + '.'
            : 'Thank you, ' + name + '. Your registration for ' + eventName + ' (' + count +
              (count === 1 ? ' attendee' : ' attendees') + ') has been received. A confirmation will be sent to ' + email + '.';

        form.reset();
        fields().forEach(function (el) {
            el.removeAttribute('aria-invalid');
            var out = document.getElementById(el.id + '-error');
            if (out) out.textContent = '';
        });
        updateCount();
        showStatus('success', text);
    });

    /* Clear form button */
    form.addEventListener('reset', function () {
        clearStatus();
        fields().forEach(function (el) {
            el.removeAttribute('aria-invalid');
            var out = document.getElementById(el.id + '-error');
            if (out) out.textContent = '';
        });
        // reset happens after this event, so update the counter next tick
        setTimeout(updateCount, 0);
    });

    updateCount();
})();
