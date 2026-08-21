/* ==========================================================================
   Логіка сторінки: мова, рендер блоків, форма заявки.
   Контент правиться в content.js — цей файл чіпати не потрібно.
   ========================================================================== */
(function () {
  'use strict';

  var CFG  = window.CONFIG || {};
  var I18N = window.I18N   || {};
  var CONSENT_VERSION = '2026-08-21';

  /* ---------- дрібні помічники ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function dig(obj, path) {
    return path.split('.').reduce(function (o, k) { return (o == null ? o : o[k]); }, obj);
  }
  function icon(d) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  }

  var ICONS = {
    check:  '<path d="M20 6L9 17l-5-5"/>',
    clock:  '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    chevron:'<path d="M6 9l6 6 6-6"/>',
    plus:   '<path d="M12 5v14M5 12h14"/>',
    phone:  '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    mail:   '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/>',
    send:   '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/>',
    chat:   '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5a8.4 8.4 0 0 1-.9-3.9 8.4 8.4 0 0 1 8.4-9 8.4 8.4 0 0 1 8.6 8.4z"/>',
    camera: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    mountain:'<path d="m3 19 6.5-11 4 6.5 2.5-4L21 19z"/>',
    leaf:   '<path d="M11 20A7 7 0 0 1 4 13c0-6 7-9 16-9 0 9-3 16-9 16z"/><path d="M4 21c3-5 6-8 11-10"/>',
    glass:  '<path d="M8 21h8"/><path d="M12 15v6"/><path d="M5 3h14l-1.5 7a5.5 5.5 0 0 1-11 0z"/>',
    wave:   '<path d="M2 9c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/><path d="M2 15c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/>',
    table:  '<path d="M3 11h18"/><path d="M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/><path d="M5 11v8"/><path d="M19 11v8"/>'
  };
  var POINT_ICONS = ['mountain', 'leaf', 'glass', 'wave', 'table'];

  /* ---------- вибір мови ---------- */
  function pickLang() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q && I18N[q]) return q;
    var saved;
    try { saved = localStorage.getItem('gt_lang'); } catch (e) { saved = null; }
    if (saved && I18N[saved]) return saved;
    var nav = (navigator.language || 'en').toLowerCase();
    return (nav.indexOf('uk') === 0 || nav.indexOf('ru') === 0) ? 'ua' : 'en';
  }

  var lang = pickLang();
  var T = I18N[lang];

  function setLang(next) {
    if (!I18N[next] || next === lang) return;
    lang = next;
    T = I18N[lang];
    try { localStorage.setItem('gt_lang', lang); } catch (e) {}
    render();
  }

  /* ---------- рендер ---------- */
  function applyStatic() {
    document.documentElement.lang = T.htmlLang;
    document.title = T.metaTitle;
    var md = $('#metaDesc'); if (md) md.content = T.metaDesc;
    var ot = $('#ogTitle');  if (ot) ot.content = T.metaTitle;
    var od = $('#ogDesc');   if (od) od.content = T.metaDesc;

    $$('[data-i18n]').forEach(function (n) {
      var v = dig(T, n.getAttribute('data-i18n'));
      if (typeof v === 'string') n.textContent = v;
    });
    $$('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
    var y = $('#year'); if (y) y.textContent = String(new Date().getFullYear());
  }

  function renderFacts() {
    var box = $('#facts'); box.innerHTML = '';
    T.facts.forEach(function (f) {
      var d = el('div', 'fact');
      d.appendChild(el('b', null, f.b));
      d.appendChild(el('span', null, f.s));
      box.appendChild(d);
    });
  }

  function renderAbout() {
    var box = $('#aboutPoints'); box.innerHTML = '';
    T.aboutPoints.forEach(function (p, i) {
      var li = el('li');
      li.innerHTML = icon(ICONS[POINT_ICONS[i % POINT_ICONS.length]]);
      var w = el('div');
      w.appendChild(el('b', null, p.b));
      w.appendChild(el('span', null, p.s));
      li.appendChild(w);
      box.appendChild(li);
    });
  }

  /* Час на початку абзацу підсвічуємо, щоб розклад читався з першого погляду */
  function timeParagraph(text) {
    var p = el('p');
    var m = text.match(/^(\d{2}:\d{2})\s*—\s*/);
    if (m) {
      var t = el('span', 'day__time');
      t.innerHTML = icon(ICONS.clock) + '<span>' + m[1] + '</span>';
      p.appendChild(t);
      p.appendChild(document.createTextNode(' ' + text.slice(m[0].length)));
    } else {
      p.textContent = text;
    }
    return p;
  }

  function renderDays() {
    var box = $('#days'); box.innerHTML = '';
    T.days.forEach(function (day, i) {
      var wrap = el('div', 'day' + (i === 0 ? ' is-open' : ''));
      var bodyId = 'day-body-' + i;

      var btn = el('button', 'day__btn');
      btn.type = 'button';
      btn.setAttribute('aria-expanded', String(i === 0));
      btn.setAttribute('aria-controls', bodyId);
      btn.appendChild(el('span', 'day__no', String(i + 1)));

      var ttl = el('span', 'day__ttl');
      ttl.appendChild(el('b', null, day.t));
      ttl.appendChild(el('span', null, day.d));
      btn.appendChild(ttl);

      var chev = el('span', 'day__chev');
      chev.innerHTML = icon(ICONS.chevron);
      btn.appendChild(chev);

      var body = el('div', 'day__body');
      body.id = bodyId;
      day.p.forEach(function (par) { body.appendChild(timeParagraph(par)); });

      btn.addEventListener('click', function () {
        var open = wrap.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
      });

      wrap.appendChild(btn);
      wrap.appendChild(body);
      box.appendChild(wrap);
    });
  }

  function renderIncludes() {
    [['#inclYes', T.inclYesList], ['#inclNo', T.inclNoList]].forEach(function (pair) {
      var box = $(pair[0]); box.innerHTML = '';
      pair[1].forEach(function (txt) {
        var li = el('li');
        li.appendChild(el('i'));
        li.appendChild(el('span', null, txt));
        box.appendChild(li);
      });
    });
  }

  function renderHost() {
    var H = window.HOST || {};
    var sec = $('#host');
    var quote = H.quote && H.quote[lang];
    if (!H.name || !quote) { sec.hidden = true; return; }
    sec.hidden = false;
    $('#hostQuote').textContent = quote;
    $('#hostWho').textContent = H.name + (H.role && H.role[lang] ? ' · ' + H.role[lang] : '');
    var ava = $('#hostAva');
    var photo = (CFG.photos && CFG.photos.host) || '';
    ava.style.backgroundImage = photo ? 'url("' + photo + '")' : '';
    ava.style.backgroundSize = 'cover';
    ava.style.backgroundPosition = 'center';
  }

  function renderReviews() {
    var list = (window.REVIEWS || []).filter(function (r) { return r && r.text && r.text[lang]; });
    var sec = $('#reviews');
    var nav = $('#navReviews');
    /* Немає справжніх відгуків — блока немає. Вигадувати їх не можна. */
    if (!list.length) {
      sec.hidden = true;
      if (nav) nav.hidden = true;
      return;
    }
    sec.hidden = false;
    if (nav) nav.hidden = false;

    var box = $('#reviewsList'); box.innerHTML = '';
    list.forEach(function (r) {
      var card = el('article', 'review');
      card.appendChild(el('p', null, '«' + r.text[lang] + '»'));

      var foot = el('footer');
      if (r.photo) {
        var img = el('img', 'review__ava');
        img.src = r.photo; img.alt = ''; img.loading = 'lazy';
        foot.appendChild(img);
      } else {
        foot.appendChild(el('div', 'review__ava', (r.name || '?').trim().charAt(0).toUpperCase()));
      }
      var who = el('div', 'review__who');
      who.appendChild(el('b', null, r.name || ''));
      var place = r.place && (r.place[lang] || r.place.ua || r.place.en);
      if (place) who.appendChild(el('span', null, place));
      foot.appendChild(who);

      card.appendChild(foot);
      box.appendChild(card);
    });
  }

  function renderFaq() {
    var box = $('#faqList'); box.innerHTML = '';
    T.faq.forEach(function (item, i) {
      var wrap = el('div', 'faq__item');
      var bodyId = 'faq-body-' + i;

      var btn = el('button', 'faq__btn');
      btn.type = 'button';
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', bodyId);
      btn.appendChild(el('span', null, item.q));
      var ic = el('span');
      ic.innerHTML = icon(ICONS.plus);
      btn.appendChild(ic);

      var body = el('div', 'faq__body', item.a);
      body.id = bodyId;

      btn.addEventListener('click', function () {
        var open = wrap.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
      });

      wrap.appendChild(btn);
      wrap.appendChild(body);
      box.appendChild(wrap);
    });
  }

  function contactItems() {
    var c = CFG.contacts || {};
    var out = [];
    if (c.phoneUa)   out.push({ ic:'phone',  label:T.cPhoneUa,  text:c.phoneUa, href:'tel:' + c.phoneUa.replace(/[^\d+]/g, '') });
    if (c.phoneUs)   out.push({ ic:'phone',  label:T.cPhoneUs,  text:c.phoneUs, href:'tel:' + c.phoneUs.replace(/[^\d+]/g, '') });
    if (c.email)     out.push({ ic:'mail',   label:T.cEmail,    text:c.email,   href:'mailto:' + c.email });
    if (c.telegram)  out.push({ ic:'send',   label:T.cTelegram, text:'Telegram',  href:c.telegram });
    if (c.whatsapp)  out.push({ ic:'chat',   label:T.cWhatsapp, text:'WhatsApp',  href:c.whatsapp });
    if (c.instagram) out.push({ ic:'camera', label:T.cInstagram,text:'Instagram', href:c.instagram });
    return out;
  }

  function renderContacts() {
    var items = contactItems();
    var box = $('#contacts'); box.innerHTML = '';
    var ftr = $('#ftrContacts'); ftr.innerHTML = '';

    if (!items.length) {
      box.appendChild(el('li', 'muted', T.contactsEmpty));
      return;
    }
    items.forEach(function (it) {
      var li = el('li');
      var a = el('a');
      a.href = it.href;
      a.setAttribute('aria-label', it.label);
      if (it.href.indexOf('http') === 0) { a.target = '_blank'; a.rel = 'noopener'; }
      a.innerHTML = icon(ICONS[it.ic]) + '<span>' + it.text + '</span>';
      li.appendChild(a);
      box.appendChild(li);

      var li2 = el('li');
      var a2 = el('a', null, it.text);
      a2.href = it.href;
      if (it.href.indexOf('http') === 0) { a2.target = '_blank'; a2.rel = 'noopener'; }
      li2.appendChild(a2);
      ftr.appendChild(li2);
    });
  }

  function renderForm() {
    /* Плейсхолдери й підказки — мовою сторінки */
    $('#fName').placeholder   = T.fNameP;
    $('#fPhone').placeholder  = T.fPhoneP;
    $('#fPeople').placeholder = T.fPeopleP;
    $('#fNote').placeholder   = T.fNoteP;
    $('#submitBtn').textContent = T.fSubmit;

    var sel = $('#fFrom');
    var keep = sel.value;
    sel.innerHTML = '';
    T.fFromOpts.forEach(function (o) {
      var opt = el('option', null, o[1]);
      opt.value = o[0];
      sel.appendChild(opt);
    });
    if (keep) sel.value = keep;

    /* Текст згоди з живими посиланнями на документи */
    $('#consentText').innerHTML = T.fConsent
      .replace('{privacy}', link('privacy.html', T.fConsentPrivacy))
      .replace('{consent}', link('consent.html', T.fConsentDoc));

    /* Тексти помилок оновлюємо, якщо поле вже підсвічене */
    $$('.field__err').forEach(function (n) {
      var k = n.getAttribute('data-err');
      if (n.textContent) n.textContent = errText(k);
    });
  }

  function link(href, text) {
    return '<a href="' + href + '" target="_blank" rel="noopener">' + text + '</a>';
  }

  function errText(key) {
    return { name: T.errName, phone: T.errPhone, consent: T.errConsent }[key] || '';
  }

  function render() {
    applyStatic();
    renderFacts();
    renderAbout();
    renderDays();
    renderIncludes();
    renderHost();
    renderReviews();
    renderFaq();
    renderContacts();
    renderForm();
    setState(formState);
  }

  /* ---------- валідація ---------- */
  function fieldBox(name) { return $('[data-field="' + name + '"]'); }

  function showError(name, on) {
    var box = name === 'consent' ? $('#consentWrap') : fieldBox(name);
    var msg = $('.field__err[data-err="' + name + '"]');
    if (box) box.classList.toggle('has-error', on);
    if (msg) msg.textContent = on ? errText(name) : '';
    if (msg) msg.style.display = on ? 'block' : 'none';
  }

  function checkName()  { return $('#fName').value.trim().length >= 2; }
  function checkPhone() {
    var v = $('#fPhone').value.replace(/[^\d+]/g, '');
    return /^\+?\d{9,15}$/.test(v);
  }
  function checkConsent() { return $('#fConsent').checked; }

  function wireValidation() {
    $('#fName').addEventListener('blur', function () { showError('name', !checkName()); });
    $('#fPhone').addEventListener('blur', function () { showError('phone', !checkPhone()); });
    $('#fName').addEventListener('input', function () { if (checkName()) showError('name', false); });
    $('#fPhone').addEventListener('input', function () { if (checkPhone()) showError('phone', false); });
    $('#fConsent').addEventListener('change', function () { if (checkConsent()) showError('consent', false); });
  }

  /* ---------- відправлення ---------- */
  var formState = null;              /* null | 'ok' | 'err:generic' | 'err:endpoint' */

  function setState(kind) {
    formState = kind;
    var ok = $('#stOk'), er = $('#stErr');
    var isErr = kind && kind.indexOf('err') === 0;
    ok.classList.toggle('is-on', kind === 'ok');
    er.classList.toggle('is-on', !!isErr);
    if (isErr) $('#stErrText').textContent = (kind === 'err:endpoint') ? T.errNoEndpoint : T.errText;
  }

  function wireSubmit() {
    var form = $('#leadForm');
    var btn  = $('#submitBtn');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var bad = false;
      [['name', checkName()], ['phone', checkPhone()], ['consent', checkConsent()]].forEach(function (p) {
        showError(p[0], !p[1]);
        if (!p[1]) bad = true;
      });
      if (bad) {
        setState(null);
        var first = $('.has-error input');
        if (first) first.focus();
        return;
      }

      if (!CFG.formEndpoint) {
        setState('err:endpoint');
        return;
      }

      var payload = {
        name:      $('#fName').value.trim(),
        phone:     $('#fPhone').value.trim(),
        from:      $('#fFrom').value,
        fromLabel: $('#fFrom').options[$('#fFrom').selectedIndex].textContent,
        people:    $('#fPeople').value.trim(),
        note:      $('#fNote').value.trim(),
        marketing: $('#fMarketing').checked,
        /* фіксація факту згоди — вимога закону 2297-VI */
        consent:   true,
        consentVersion: CONSENT_VERSION,
        consentAt: new Date().toISOString(),
        lang:      lang,
        tour:      'madeira-2026-10-27',
        page:      location.href
      };

      btn.disabled = true;
      btn.textContent = T.fSending;
      setState(null);

      fetch(CFG.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (r) {
          if (!r.ok) throw new Error('http ' + r.status);
          return r.json().catch(function () { return {}; });
        })
        .then(function () {
          setState('ok');
          /* Введені дані стираємо тільки після підтвердженого успіху */
          form.reset();
          ['name', 'phone', 'consent'].forEach(function (k) { showError(k, false); });
          renderForm();
          $('#stOk').scrollIntoView({ block: 'center', behavior: 'smooth' });
        })
        .catch(function () {
          /* Дані у формі лишаються — людині не треба набирати все заново */
          setState('err:generic');
        })
        .then(function () {
          btn.disabled = false;
          btn.textContent = T.fSubmit;
        });
    });
  }

  /* ---------- шапка ---------- */
  function wireHeader() {
    var hdr = $('#hdr');
    var onScroll = function () { hdr.classList.toggle('is-stuck', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    $$('.lang button').forEach(function (b) {
      b.addEventListener('click', function () { setLang(b.dataset.lang); });
    });
  }

  /* ---------- нижня панель заявки на мобільному ---------- */
  function wireCtaBar() {
    var bar = $('#ctaBar');
    var form = $('#form');
    if (!bar || !form) return;
    document.body.classList.add('has-cta-bar');

    var toggle = function () {
      var passedHero = window.scrollY > window.innerHeight * 0.6;
      var atForm = form.getBoundingClientRect().top < window.innerHeight;
      bar.classList.toggle('is-on', passedHero && !atForm);
    };
    window.addEventListener('scroll', toggle, { passive: true });
    window.addEventListener('resize', toggle);
    toggle();
  }

  /* ---------- фото замість ілюстрації ---------- */
  function wireHeroPhoto() {
    var src = CFG.photos && CFG.photos.hero;
    if (!src) return;
    var fig = $('#heroArt');
    var svg = $('svg', fig);
    var img = el('img');
    img.src = src;
    img.alt = 'Мадейра';
    img.addEventListener('error', function () { img.remove(); if (svg) svg.style.display = ''; });
    if (svg) svg.style.display = 'none';
    fig.insertBefore(img, fig.firstChild);
  }

  /* ---------- старт ---------- */
  render();
  wireHeader();
  wireValidation();
  wireSubmit();
  wireCtaBar();
  wireHeroPhoto();
})();
