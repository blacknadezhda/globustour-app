/* ==========================================================================
   Логіка сторінки: мова, рендер секцій, форма заявки.
   Контент правиться в content.js — цей файл чіпати не потрібно.
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.CONFIG || {};
  var I18N = window.I18N || {};
  var CONSENT_VERSION = '2026-08-21';

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]; }); }

  var ICONS = {
    check:  '<path d="M20 6L9 17l-5-5"/>',
    minus:  '<path d="M5 12h14"/>',
    chev:   '<path d="M6 9l6 6 6-6"/>',
    plus:   '<path d="M12 5v14M5 12h14"/>',
    cal:    '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    pin:    '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    back:   '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
    bed:    '<path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/><path d="M3 18h18"/><path d="M7 10V7h10v3"/>',
    fork:   '<path d="M7 3v8a2 2 0 0 0 4 0V3"/><path d="M9 11v10"/><path d="M17 3c-1.7 1.2-2.5 3-2.5 5.5S15.3 13 17 14v7"/>',
    bus:    '<rect x="3" y="5" width="18" height="12" rx="3"/><path d="M3 11h18"/><circle cx="7.5" cy="19" r="1.5"/><circle cx="16.5" cy="19" r="1.5"/>',
    camera: '<rect x="3" y="6" width="18" height="14" rx="3"/><circle cx="12" cy="13" r="3.5"/><path d="M8 6l1.5-2h5L16 6"/>',
    users:  '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6"/><path d="M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
    plane:  '<path d="M21 15.5 3 9.8l3-2.3 4.6 1.2L15 4.5l2.6.7-2.6 4.6 5.7 1.6z"/><path d="M8 19h9"/>',
    mount:  '<path d="m3 19 6.5-11 4 6.5 2.5-4L21 19z"/>',
    sun:    '<circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.6M12 19.4V22M2 12h2.6M19.4 12H22M4.9 4.9l1.9 1.9M17.2 17.2l1.9 1.9M19.1 4.9l-1.9 1.9M6.8 17.2l-1.9 1.9"/>',
    wave:   '<path d="M2 9c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/><path d="M2 15c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/>',
    phone:  '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    mail:   '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/>',
    send:   '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/>',
    chat:   '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5a8.4 8.4 0 0 1-.9-3.9 8.4 8.4 0 0 1 8.4-9 8.4 8.4 0 0 1 8.6 8.4z"/>',
    insta:  '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    image:  '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8.5" cy="9.5" r="1.8"/><path d="m4 18 5-5 4 4 3-2.5 4 3.5"/>'
  };
  function ic(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }

  /* ---------- мова ---------- */
  function pick() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q && I18N[q]) return q;
    var sv; try { sv = localStorage.getItem('gt_lang'); } catch (e) {}
    if (sv && I18N[sv]) return sv;
    var n = (navigator.language || 'en').toLowerCase();
    return (n.indexOf('uk') === 0 || n.indexOf('ru') === 0) ? 'ua' : 'en';
  }
  var lang = pick(), T = I18N[lang];
  function setLang(next) {
    if (!I18N[next] || next === lang) return;
    lang = next; T = I18N[next];
    try { localStorage.setItem('gt_lang', next); } catch (e) {}
    render();
  }

  /* ---------- фото-слот ---------- */
  function photo(slot, cls) {
    var src = (CFG.photos || {})[slot] || '';
    var box = el('div', 'ph' + (cls ? ' ' + cls : ''));
    box.dataset.slot = slot;
    if (src) {
      var img = el('img');
      img.src = src; img.alt = ''; img.loading = 'lazy';
      box.appendChild(img);
    } else {
      box.classList.add('ph--empty');
      box.innerHTML = '<div class="ph__cap">' + ic('image') +
        '<span class="ph__hint">' + esc(T.photoHint) + '</span>' +
        '<span class="ph__txt">' + esc((T.photoSlots || {})[slot] || '') + '</span></div>';
    }
    return box;
  }

  function contacts() {
    var c = CFG.contacts || {}, out = [];
    if (c.phoneUa)   out.push({ ic:'phone', label:T.cPhoneUa,   text:c.phoneUa,  href:'tel:' + c.phoneUa.replace(/[^\d+]/g,'') });
    if (c.phoneUs)   out.push({ ic:'phone', label:T.cPhoneUs,   text:c.phoneUs,  href:'tel:' + c.phoneUs.replace(/[^\d+]/g,'') });
    if (c.email)     out.push({ ic:'mail',  label:T.cEmail,     text:c.email,    href:'mailto:' + c.email });
    if (c.telegram)  out.push({ ic:'send',  label:T.cTelegram,  text:'Telegram', href:c.telegram });
    if (c.whatsapp)  out.push({ ic:'chat',  label:T.cWhatsapp,  text:'WhatsApp', href:c.whatsapp });
    if (c.instagram) out.push({ ic:'insta', label:T.cInstagram, text:'Instagram',href:c.instagram });
    return out;
  }

  function tmP(t) {
    var m = t.match(/^(\d{2}:\d{2})\s*—\s*/);
    return m ? '<p><span class="tm">' + m[1] + '</span> ' + esc(t.slice(m[0].length)) + '</p>' : '<p>' + esc(t) + '</p>';
  }

  /* ---------- секції ---------- */
  function renderHero() {
    var hero = $('#hero');
    hero.innerHTML = '';
    var img = photo('hero', 'hero__ph');
    hero.appendChild(img);

    var over = el('div', 'hero__over');
    over.innerHTML = '<div class="wrap">' +
      '<h1 class="hero__word">' + esc(T.heroWord) + '<sup>2026</sup></h1>' +
      '<p class="hero__sub">' + esc(T.heroLead) + '</p>' +
      '<div class="hero__cta">' +
        '<a class="btn btn--primary" href="#form">' + esc(T.heroCta) + '</a>' +
        '<a class="btn btn--onphoto" href="#program">' + esc(T.heroCta2) + '</a>' +
      '</div></div>';
    hero.appendChild(over);

    if (img.classList.contains('ph--empty')) {
      hero.appendChild(el('div', 'hero__note', T.photoHint + ' · ' + T.photoSlots.hero));
    }
  }

  function renderWhy() {
    var cs = contacts().filter(function (c) { return c.href.indexOf('http') === 0; });
    $('#why').innerHTML = '<div class="wrap"><div class="why"><div>' +
      '<span class="tag">' + esc(T.nav.about) + '</span>' +
      '<h2 style="margin:16px 0">' + esc(T.whyTitle) + '</h2>' +
      '<p class="lead">' + esc(T.whyText) + '</p>' +
      (cs.length ? '<div class="why__soc">' + cs.map(function (c) {
        return '<a href="' + esc(c.href) + '" target="_blank" rel="noopener" aria-label="' + esc(c.label) + '">' + ic(c.ic) + '</a>';
      }).join('') + '</div>' : '') +
      '</div><div class="why__cards">' + T.whyCards.map(function (c) {
        return '<div class="why__c"><i>' + ic(c.ic) + '</i><div><b>' + esc(c.b) + '</b><span>' + esc(c.s) + '</span></div></div>';
      }).join('') + '</div></div>' +
      '<div class="stats">' + T.stats.map(function (s) {
        return '<div><i>' + ic(s.ic) + '</i><b>' + esc(s.n) + ' ' + esc(s.a) + '</b><span>' + esc(s.b) + '</span></div>';
      }).join('') + '</div></div>';
  }

  function renderSpots() {
    $('#spots').innerHTML = '<div class="wrap"><div class="spots">' +
      '<div class="spots__head"><h2>' + esc(T.spotsTitle) + '</h2><p>' + esc(T.spotsLead) + '</p></div>' +
      '<div class="spots__g" id="spotsG"></div>' +
      '<div class="spots__foot"><a class="btn btn--ghost btn--sm" href="#program">' + esc(T.spotsMore) + '</a></div>' +
      '</div></div>';
    var g = $('#spotsG');
    T.spots.forEach(function (s) {
      var card = el('div', 'spot');
      card.appendChild(photo(s.ph));
      var badge = el('div', 'spot__badge', s.d);
      var t = el('div', 'spot__t');
      t.innerHTML = '<b>' + esc(s.b) + '</b><span class="spot__m">' + ic('pin') + esc(s.m) + '</span>';
      card.appendChild(badge);
      card.appendChild(t);
      g.appendChild(card);
    });
  }

  function renderProgram() {
    $('#program').innerHTML = '<div class="wrap"><div class="sec__head"><span class="tag">' + esc(T.nav.program) +
      '</span><h2 style="margin-top:16px">' + esc(T.programTitle) + '</h2><p>' + esc(T.programLead) + '</p></div>' +
      '<div class="days" id="days"></div></div>';
    var days = $('#days');
    T.days.forEach(function (d, i) {
      var w = el('div', 'day' + (i === 0 ? ' is-open' : ''));
      var id = 'day-' + i;
      w.innerHTML = '<button class="day__b" type="button" aria-expanded="' + (i === 0) + '" aria-controls="' + id + '">' +
        '<span class="day__n">' + esc(T.dayWord + ' ' + (i + 1)) + '</span>' +
        '<span class="day__t"><b>' + esc(d.t) + '</b><span>' + esc(d.d) + '</span></span>' +
        '<span class="day__c">' + ic('chev') + '</span></button>' +
        '<div class="day__body" id="' + id + '">' + d.p.map(tmP).join('') + '</div>';
      var b = w.querySelector('.day__b');
      b.addEventListener('click', function () { b.setAttribute('aria-expanded', String(w.classList.toggle('is-open'))); });
      days.appendChild(w);
    });
  }

  function renderIncludes() {
    $('#includes').innerHTML = '<div class="wrap"><div class="sec__head"><span class="tag">' + esc(T.nav.includes) +
      '</span><h2 style="margin-top:16px">' + esc(T.inclYes) + '</h2></div>' +
      '<div class="incl">' + T.inclCards.map(function (c) {
        return '<div class="incl__i"><i>' + ic(c.ic) + '</i><b>' + esc(c.b) + '</b><p>' + esc(c.s) + '</p></div>';
      }).join('') + '</div>' +
      '<div class="extra"><h3>' + ic('minus') + esc(T.inclNo) + '</h3><ul>' +
        T.inclNoList.map(function (x) { return '<li><i></i><span>' + esc(x) + '</span></li>'; }).join('') + '</ul></div>' +
      '<p class="note">' + esc(T.inclNote) + '</p>' +
      (CFG.price ? '<div class="price"><span>' + esc(T.priceTitle) + '</span><b>' + esc(CFG.price) +
        '</b><p>' + esc(T.priceNote) + '</p></div>' : '') + '</div>';
  }

  function renderUs() {
    var U = window.ABOUT_US || {}, us = $('#us');
    if (!U.text || !U.text[lang]) { us.hidden = true; return; }
    us.hidden = false;
    us.innerHTML = '<div class="wrap"><div class="sec__head"><span class="tag">' + esc(T.nav.us) +
      '</span><h2 style="margin-top:16px">' + esc(T.usTitle) + '</h2><p>' + esc(U.text[lang]) + '</p></div><div class="us">' +
      (U.years  ? '<div><b>' + esc(U.years)  + '</b><span>' + esc(T.usYears)  + '</span></div>' : '') +
      (U.tours  ? '<div><b>' + esc(U.tours)  + '</b><span>' + esc(T.usTours)  + '</span></div>' : '') +
      (U.people ? '<div><b>' + esc(U.people) + '</b><span>' + esc(T.usPeople) + '</span></div>' : '') + '</div></div>';
  }

  function renderHost() {
    var H = window.HOST || {}, host = $('#host');
    if (!H.name || !H.quote || !H.quote[lang]) { host.hidden = true; return; }
    host.hidden = false;
    host.innerHTML = '<div class="wrap"><div class="sec__head"><h2>' + esc(T.hostTitle) + '</h2></div>' +
      '<div class="host" id="hostBox"><div><blockquote>' + esc(H.quote[lang]) + '</blockquote><cite>' +
      esc(H.name) + (H.role && H.role[lang] ? ' · ' + esc(H.role[lang]) : '') + '</cite></div></div></div>';
    var hb = $('#hostBox');
    hb.insertBefore(photo('host'), hb.firstChild);
  }

  function renderReviews() {
    var list = (window.REVIEWS || []).filter(function (r) { return r && r.text && r.text[lang]; });
    var rev = $('#reviews'), nr = $('#navReviews');
    /* Немає справжніх відгуків — блока немає. Вигадувати їх не можна. */
    if (!list.length) { rev.hidden = true; if (nr) nr.hidden = true; return; }
    rev.hidden = false; if (nr) nr.hidden = false;
    rev.innerHTML = '<div class="wrap"><div class="sec__head"><span class="tag">' + esc(T.nav.reviews) +
      '</span><h2 style="margin-top:16px">' + esc(T.reviewsTitle) + '</h2><p>' + esc(T.reviewsLead) + '</p></div><div class="revs">' +
      list.map(function (r) {
        var pl = (r.place && (r.place[lang] || r.place.ua || r.place.en)) || '';
        return '<article class="rev"><div class="rev__s" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div>' +
          '<p>' + esc(r.text[lang]) + '</p><div class="rev__f">' +
          (r.photo ? '<img class="rev__a" src="' + esc(r.photo) + '" alt="" loading="lazy">'
                   : '<div class="rev__a">' + esc((r.name || '?').charAt(0).toUpperCase()) + '</div>') +
          '<div><b>' + esc(r.name || '') + '</b><span>' + esc(pl) + '</span></div></div></article>';
      }).join('') + '</div></div>';
  }

  function renderFaq() {
    $('#faq').innerHTML = '<div class="wrap"><div class="sec__head"><span class="tag">' + esc(T.nav.faq) +
      '</span><h2 style="margin-top:16px">' + esc(T.faqTitle) + '</h2></div><div class="faq" id="faqL"></div></div>';
    var fq = $('#faqL');
    T.faq.forEach(function (q, i) {
      var w = el('div', 'faq__i');
      var id = 'faq-' + i;
      w.innerHTML = '<button class="faq__b" type="button" aria-expanded="false" aria-controls="' + id + '">' +
        '<span>' + esc(q.q) + '</span>' + ic('plus') + '</button>' +
        '<div class="faq__a" id="' + id + '">' + esc(q.a) + '</div>';
      var b = w.querySelector('.faq__b');
      b.addEventListener('click', function () { b.setAttribute('aria-expanded', String(w.classList.toggle('is-open'))); });
      fq.appendChild(w);
    });
  }

  /* ---------- форма ---------- */
  function formMarkup() {
    return '' +
      '<div class="state state--ok" id="stOk" role="status" aria-live="polite"><b></b><span></span></div>' +
      '<div class="state state--err" id="stErr" role="alert"><b></b><span></span></div>' +
      '<div class="f" data-field="name"><label for="fName"></label><input id="fName" type="text" autocomplete="name"><p class="err" data-err="name"></p></div>' +
      '<div class="f" data-field="phone"><label for="fPhone"></label><input id="fPhone" type="tel" inputmode="tel" autocomplete="tel"><p class="err" data-err="phone"></p></div>' +
      '<div class="f" data-field="email"><label for="fEmail"></label><input id="fEmail" type="email" inputmode="email" autocomplete="email"><p class="err" data-err="email"></p></div>' +
      '<div class="f" data-field="from"><label for="fFrom"></label><select id="fFrom"></select></div>' +
      '<div class="f" data-field="note"><label for="fNote"></label><textarea id="fNote" rows="3"></textarea></div>' +
      '<label class="ck" id="ckConsent" for="fConsent"><input id="fConsent" type="checkbox"><span id="consentText"></span></label>' +
      '<p class="err err--ck" data-err="consent"></p>' +
      '<label class="ck" for="fMarketing"><input id="fMarketing" type="checkbox"><span id="mkText"></span></label>' +
      '<button class="btn btn--primary btn--block" type="submit" id="submitBtn"></button>';
  }

  var formState = null;

  function renderForm() {
    var f = $('#form');
    if (!$('#leadForm')) {
      f.innerHTML = '<div class="wrap"><div class="form__g">' +
        '<div><div class="sec__head"><span class="tag" id="fTag"></span><h2 id="fTtl" style="margin-top:16px"></h2><p id="fLead"></p></div>' +
        '<form class="form__card" id="leadForm" novalidate>' + formMarkup() + '</form></div>' +
        '<div><h3 id="cTtl"></h3><p id="cLead" style="margin-top:10px;color:var(--ink2)"></p><ul class="cl" id="cl"></ul></div>' +
        '</div></div>';
      wireForm($('#leadForm'));
    }
    $('#fTag').textContent = T.nav.form;
    $('#fTtl').textContent = T.formTitle;
    $('#fLead').textContent = T.formLead;
    $('#cTtl').textContent = T.contactsTitle;
    $('#cLead').textContent = T.contactsLead;

    $('[data-field="name"] label').innerHTML  = esc(T.fName) + ' <span class="req">*</span>';
    $('[data-field="phone"] label').innerHTML = esc(T.fPhone) + ' <span class="req">*</span>';
    $('[data-field="email"] label').textContent = T.fEmail + ' · ' + T.fOptional;
    $('[data-field="from"] label').textContent  = T.fFrom;
    $('[data-field="note"] label').textContent  = T.fNote + ' · ' + T.fOptional;
    $('#fName').placeholder  = T.fNameP;
    $('#fPhone').placeholder = T.fPhoneP;
    $('#fEmail').placeholder = T.fEmailP;
    $('#fNote').placeholder  = T.fNoteP;
    $('#submitBtn').textContent = T.fSubmit;
    $('#mkText').textContent = T.fMarketing;
    $('#stOk').querySelector('b').textContent = T.okTitle;
    $('#stOk').querySelector('span').textContent = T.okText;
    $('#stErr').querySelector('b').textContent = T.errTitle;

    var sel = $('#fFrom'), keep = sel.value;
    sel.innerHTML = '';
    T.fFromOpts.forEach(function (o) { var op = el('option', null, o[1]); op.value = o[0]; sel.appendChild(op); });
    if (keep) sel.value = keep;

    $('#consentText').innerHTML = T.fConsent
      .replace('{privacy}', '<a href="privacy.html" target="_blank" rel="noopener">' + esc(T.fConsentPrivacy) + '</a>')
      .replace('{consent}', '<a href="consent.html" target="_blank" rel="noopener">' + esc(T.fConsentDoc) + '</a>');

    $$('.err').forEach(function (n) { if (n.textContent) n.textContent = errText(n.getAttribute('data-err')); });

    var cs = contacts();
    $('#cl').innerHTML = cs.length ? cs.map(function (c) {
      var ext = c.href.indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '';
      return '<li><a href="' + esc(c.href) + '" aria-label="' + esc(c.label) + '"' + ext + '>' + ic(c.ic) + '<span>' + esc(c.text) + '</span></a></li>';
    }).join('') : '<li class="cl--empty">' + esc(T.contactsEmpty) + '</li>';

    setState(formState);
  }

  function errText(k) { return { name:T.errName, phone:T.errPhone, email:T.errEmail, consent:T.errConsent }[k] || ''; }
  function fbox(n) { return n === 'consent' ? $('#ckConsent') : $('[data-field="' + n + '"]'); }
  function showError(n, on) {
    var b = fbox(n), m = $('.err[data-err="' + n + '"]');
    if (b) b.classList.toggle('has-error', on);
    if (m) { m.textContent = on ? errText(n) : ''; m.style.display = on ? 'block' : 'none'; }
  }
  function okName()  { return $('#fName').value.trim().length >= 2; }
  function okPhone() { return /^\+?\d{9,15}$/.test($('#fPhone').value.replace(/[^\d+]/g, '')); }
  function okEmail() { var v = $('#fEmail').value.trim(); return !v || /^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/.test(v); }
  function okCons()  { return $('#fConsent').checked; }

  function setState(kind) {
    formState = kind;
    var isErr = kind && kind.indexOf('err') === 0;
    $('#stOk').classList.toggle('is-on', kind === 'ok');
    $('#stErr').classList.toggle('is-on', !!isErr);
    if (isErr) $('#stErr').querySelector('span').textContent =
      (kind === 'err:endpoint') ? T.errNoEndpoint : T.errText;
  }

  function wireForm(form) {
    $('#fName').addEventListener('blur',   function () { showError('name', !okName()); });
    $('#fPhone').addEventListener('blur',  function () { showError('phone', !okPhone()); });
    $('#fEmail').addEventListener('blur',  function () { showError('email', !okEmail()); });
    $('#fName').addEventListener('input',  function () { if (okName()) showError('name', false); });
    $('#fPhone').addEventListener('input', function () { if (okPhone()) showError('phone', false); });
    $('#fEmail').addEventListener('input', function () { if (okEmail()) showError('email', false); });
    $('#fConsent').addEventListener('change', function () { if (okCons()) showError('consent', false); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = false;
      [['name', okName()], ['phone', okPhone()], ['email', okEmail()], ['consent', okCons()]].forEach(function (p) {
        showError(p[0], !p[1]); if (!p[1]) bad = true;
      });
      if (bad) { setState(null); var first = $('.has-error input'); if (first) first.focus(); return; }
      if (!CFG.formEndpoint) { setState('err:endpoint'); return; }

      var btn = $('#submitBtn');
      var payload = {
        name: $('#fName').value.trim(),
        phone: $('#fPhone').value.trim(),
        email: $('#fEmail').value.trim(),
        from: $('#fFrom').value,
        fromLabel: $('#fFrom').options[$('#fFrom').selectedIndex].textContent,
        note: $('#fNote').value.trim(),
        marketing: $('#fMarketing').checked,
        /* фіксація факту згоди — вимога Закону №2297-VI */
        consent: true,
        consentVersion: CONSENT_VERSION,
        consentAt: new Date().toISOString(),
        lang: lang,
        tour: 'madeira-2026-10-27',
        page: location.href
      };
      btn.disabled = true; btn.textContent = T.fSending; setState(null);

      fetch(CFG.formEndpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
      .then(function (r) { if (!r.ok) throw new Error('http'); return r.json().catch(function () { return {}; }); })
      .then(function () {
        setState('ok');
        /* дані стираємо тільки після підтвердженого успіху */
        form.reset();
        ['name', 'phone', 'email', 'consent'].forEach(function (k) { showError(k, false); });
        renderForm();
        $('#stOk').scrollIntoView({ block: 'center', behavior: 'smooth' });
      })
      .catch(function () { setState('err:generic'); })
      .then(function () { btn.disabled = false; btn.textContent = T.fSubmit; });
    });
  }

  /* ---------- підвал і шапка ---------- */
  function renderChrome() {
    document.documentElement.lang = T.htmlLang;
    document.title = T.metaTitle;
    var md = $('#metaDesc'); if (md) md.content = T.metaDesc;
    var ot = $('#ogTitle');  if (ot) ot.content = T.metaTitle;
    var od = $('#ogDesc');   if (od) od.content = T.metaDesc;

    $$('.nav a').forEach(function (a) { a.textContent = T.nav[a.getAttribute('data-nav')]; });
    $('#datePill').innerHTML = ic('cal') + '<span>' + esc(T.heroBadge) + '</span>';
    $('#navCta').textContent = T.navCta;
    $('#barCta').textContent = T.navCta;
    $$('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });

    var cs = contacts();
    $('#ftrAbout').textContent = T.ftrAbout;
    $('#ftrDocsT').textContent = T.ftrDocs;
    $('#ftrPrivacy').textContent = T.ftrPrivacy;
    $('#ftrConsent').textContent = T.ftrConsent;
    $('#ftrContactsT').textContent = T.ftrContacts;
    $('#ftrNote').textContent = T.ftrNote;
    $('#ftrRights').textContent = T.ftrRights;
    $('#ftrCl').innerHTML = cs.map(function (c) {
      var ext = c.href.indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '';
      return '<li><a href="' + esc(c.href) + '"' + ext + '>' + esc(c.text) + '</a></li>';
    }).join('');
  }

  function render() {
    renderChrome();
    renderHero();
    renderWhy();
    renderSpots();
    renderProgram();
    renderIncludes();
    renderUs();
    renderHost();
    renderReviews();
    renderFaq();
    renderForm();
  }

  render();

  $$('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.lang); });
  });

  var hdr = $('#hdr'), bar = $('#ctaBar'), formSec = $('#form');
  function onScroll() {
    hdr.classList.toggle('is-stuck', window.scrollY > 8);
    var passed = window.scrollY > window.innerHeight * 0.6;
    var atForm = formSec.getBoundingClientRect().top < window.innerHeight;
    bar.classList.toggle('is-on', passed && !atForm);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
