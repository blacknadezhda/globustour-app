/* ==========================================================================
   Спільна логіка трьох візуальних напрямів: мова, форма заявки, фото-слоти.
   Контент — у ../content.js. Верстка й оформлення — у файлі кожного напряму.
   ========================================================================== */
window.GT = (function () {
  'use strict';

  var CFG = window.CONFIG || {};
  var I18N = window.I18N || {};
  var CONSENT_VERSION = '2026-08-21';
  var listeners = [];

  function $(s, r) { return (r || document).querySelector(s); }
  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function dig(o, p) { return p.split('.').reduce(function (a, k) { return a == null ? a : a[k]; }, o); }

  var ICONS = {
    check:  '<path d="M20 6L9 17l-5-5"/>',
    minus:  '<path d="M5 12h14"/>',
    clock:  '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    chev:   '<path d="M6 9l6 6 6-6"/>',
    plus:   '<path d="M12 5v14M5 12h14"/>',
    arrow:  '<path d="M7 17 17 7"/><path d="M9 7h8v8"/>',
    bed:    '<path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/><path d="M3 18h18"/><path d="M7 10V7h10v3"/>',
    fork:   '<path d="M7 3v8a2 2 0 0 0 4 0V3"/><path d="M9 11v10"/><path d="M17 3c-1.7 1.2-2.5 3-2.5 5.5S15.3 13 17 14v7"/>',
    bus:    '<rect x="3" y="5" width="18" height="12" rx="3"/><path d="M3 11h18"/><circle cx="7.5" cy="19" r="1.5"/><circle cx="16.5" cy="19" r="1.5"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.4 8.2-8 9-4.6-.8-8-4-8-9V6z"/>',
    camera: '<rect x="3" y="6" width="18" height="14" rx="3"/><circle cx="12" cy="13" r="3.5"/><path d="M8 6l1.5-2h5L16 6"/>',
    users:  '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6"/><path d="M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
    plane:  '<path d="M21 15.5 3 9.8l3-2.3 4.6 1.2L15 4.5l2.6.7-2.6 4.6 5.7 1.6z"/><path d="M8 19h9"/>',
    mount:  '<path d="m3 19 6.5-11 4 6.5 2.5-4L21 19z"/>',
    leaf:   '<path d="M11 20A7 7 0 0 1 4 13c0-6 7-9 16-9 0 9-3 16-9 16z"/><path d="M4 21c3-5 6-8 11-10"/>',
    glass:  '<path d="M8 21h8"/><path d="M12 15v6"/><path d="M5 3h14l-1.5 7a5.5 5.5 0 0 1-11 0z"/>',
    wave:   '<path d="M2 9c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/><path d="M2 15c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/>',
    table:  '<path d="M3 11h18"/><path d="M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/><path d="M5 11v8"/><path d="M19 11v8"/>',
    phone:  '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    mail:   '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/>',
    send:   '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/>',
    chat:   '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5a8.4 8.4 0 0 1-.9-3.9 8.4 8.4 0 0 1 8.4-9 8.4 8.4 0 0 1 8.6 8.4z"/>',
    insta:  '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    image:  '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8.5" cy="9.5" r="1.8"/><path d="m4 18 5-5 4 4 3-2.5 4 3.5"/>'
  };

  function icon(name, size) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' +
      (size ? ' width="' + size + '" height="' + size + '"' : '') + '>' + (ICONS[name] || '') + '</svg>';
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

  var API = { lang: pick(), CFG: CFG, el: el, $: $, icon: icon, ICONS: ICONS };
  API.T = I18N[API.lang];

  API.setLang = function (next) {
    if (!I18N[next] || next === API.lang) return;
    API.lang = next;
    API.T = I18N[next];
    try { localStorage.setItem('gt_lang', next); } catch (e) {}
    API.render();
  };

  API.onRender = function (fn) { listeners.push(fn); };
  API.render = function () {
    document.documentElement.lang = API.T.htmlLang;
    document.title = API.T.metaTitle;
    var md = $('#metaDesc'); if (md) md.content = API.T.metaDesc;
    listeners.forEach(function (fn) { fn(API.T, API.lang); });
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === API.lang));
    });
  };

  API.wireLang = function () {
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      b.addEventListener('click', function () { API.setLang(b.dataset.lang); });
    });
  };

  /* ---------- фото-слот: справжнє фото або акуратна заглушка з підписом ---------- */
  API.photo = function (slot, cls) {
    var src = (CFG.photos || {})[slot] || '';
    var box = el('div', 'ph ' + (cls || ''));
    box.dataset.slot = slot;
    if (src) {
      var img = el('img');
      img.src = src; img.alt = ''; img.loading = 'lazy';
      box.appendChild(img);
    } else {
      box.classList.add('ph--empty');
      var cap = el('div', 'ph__cap');
      cap.innerHTML = icon('image', 20) +
        '<span class="ph__hint"></span><span class="ph__txt"></span>';
      box.appendChild(cap);
    }
    return box;
  };
  API.fillPhotos = function (T) {
    document.querySelectorAll('.ph--empty').forEach(function (b) {
      var h = b.querySelector('.ph__hint'), t = b.querySelector('.ph__txt');
      if (h) h.textContent = T.photoHint;
      if (t) t.textContent = (T.photoSlots || {})[b.dataset.slot] || '';
    });
  };

  /* ---------- контакти ---------- */
  API.contacts = function (T) {
    var c = CFG.contacts || {}, out = [];
    if (c.phoneUa)   out.push({ ic:'phone',  label:T.cPhoneUa,   text:c.phoneUa,  href:'tel:' + c.phoneUa.replace(/[^\d+]/g,'') });
    if (c.phoneUs)   out.push({ ic:'phone',  label:T.cPhoneUs,   text:c.phoneUs,  href:'tel:' + c.phoneUs.replace(/[^\d+]/g,'') });
    if (c.email)     out.push({ ic:'mail',   label:T.cEmail,     text:c.email,    href:'mailto:' + c.email });
    if (c.telegram)  out.push({ ic:'send',   label:T.cTelegram,  text:'Telegram', href:c.telegram });
    if (c.whatsapp)  out.push({ ic:'chat',   label:T.cWhatsapp,  text:'WhatsApp', href:c.whatsapp });
    if (c.instagram) out.push({ ic:'insta',  label:T.cInstagram, text:'Instagram',href:c.instagram });
    return out;
  };

  /* ---------- форма заявки ---------- */
  var formState = null;

  API.formMarkup = function () {
    return '' +
      '<div class="fm__state fm__state--ok" id="stOk" role="status" aria-live="polite"><b></b><span></span></div>' +
      '<div class="fm__state fm__state--err" id="stErr" role="alert"><b></b><span></span></div>' +
      '<div class="fm__f" data-field="name"><label for="fName"></label>' +
        '<input id="fName" name="name" type="text" autocomplete="name"><p class="fm__err" data-err="name"></p></div>' +
      '<div class="fm__f" data-field="phone"><label for="fPhone"></label>' +
        '<input id="fPhone" name="phone" type="tel" inputmode="tel" autocomplete="tel"><p class="fm__err" data-err="phone"></p></div>' +
      '<div class="fm__f" data-field="email"><label for="fEmail"></label>' +
        '<input id="fEmail" name="email" type="email" inputmode="email" autocomplete="email"><p class="fm__err" data-err="email"></p></div>' +
      '<div class="fm__f" data-field="from"><label for="fFrom"></label><select id="fFrom" name="from"></select></div>' +
      '<div class="fm__f" data-field="note"><label for="fNote"></label><textarea id="fNote" name="note" rows="3"></textarea></div>' +
      '<label class="fm__ck" id="ckConsent" for="fConsent"><input id="fConsent" type="checkbox"><span id="consentText"></span></label>' +
      '<p class="fm__err fm__err--ck" data-err="consent"></p>' +
      '<label class="fm__ck" for="fMarketing"><input id="fMarketing" type="checkbox"><span id="mkText"></span></label>' +
      '<button class="btn btn--primary btn--block" type="submit" id="submitBtn"></button>';
  };

  function link(href, text) { return '<a href="' + href + '" target="_blank" rel="noopener">' + text + '</a>'; }

  API.fillForm = function (T) {
    var q = function (s) { return $(s); };
    q('[data-field="name"] label').textContent  = T.fName;
    q('[data-field="phone"] label').textContent = T.fPhone;
    q('[data-field="email"] label').textContent = T.fEmail + ' · ' + T.fOptional;
    q('[data-field="from"] label').textContent  = T.fFrom;
    q('[data-field="note"] label').textContent  = T.fNote + ' · ' + T.fOptional;
    q('#fName').placeholder  = T.fNameP;
    q('#fPhone').placeholder = T.fPhoneP;
    q('#fEmail').placeholder = T.fEmailP;
    q('#fNote').placeholder  = T.fNoteP;
    q('#submitBtn').textContent = T.fSubmit;
    q('#mkText').textContent = T.fMarketing;
    q('#stOk').querySelector('b').textContent = T.okTitle;
    q('#stOk').querySelector('span').textContent = T.okText;
    q('#stErr').querySelector('b').textContent = T.errTitle;

    var sel = q('#fFrom'), keep = sel.value;
    sel.innerHTML = '';
    T.fFromOpts.forEach(function (o) { var op = el('option', null, o[1]); op.value = o[0]; sel.appendChild(op); });
    if (keep) sel.value = keep;

    q('#consentText').innerHTML = T.fConsent
      .replace('{privacy}', link('../privacy.html', T.fConsentPrivacy))
      .replace('{consent}', link('../consent.html', T.fConsentDoc));

    document.querySelectorAll('.fm__err').forEach(function (n) {
      if (n.textContent) n.textContent = errText(n.getAttribute('data-err'), T);
    });
    setState(formState);
  };

  function errText(k, T) {
    T = T || API.T;
    return { name:T.errName, phone:T.errPhone, email:T.errEmail, consent:T.errConsent }[k] || '';
  }
  function box(name) {
    return name === 'consent' ? $('#ckConsent') : $('[data-field="' + name + '"]');
  }
  function showError(name, on) {
    var b = box(name), m = $('.fm__err[data-err="' + name + '"]');
    if (b) b.classList.toggle('has-error', on);
    if (m) { m.textContent = on ? errText(name) : ''; m.style.display = on ? 'block' : 'none'; }
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
      (kind === 'err:endpoint') ? API.T.errNoEndpoint : API.T.errText;
  }

  API.wireForm = function (form) {
    $('#fName').addEventListener('blur',  function () { showError('name', !okName()); });
    $('#fPhone').addEventListener('blur', function () { showError('phone', !okPhone()); });
    $('#fEmail').addEventListener('blur', function () { showError('email', !okEmail()); });
    $('#fName').addEventListener('input', function () { if (okName()) showError('name', false); });
    $('#fPhone').addEventListener('input',function () { if (okPhone()) showError('phone', false); });
    $('#fEmail').addEventListener('input',function () { if (okEmail()) showError('email', false); });
    $('#fConsent').addEventListener('change', function () { if (okCons()) showError('consent', false); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = false;
      [['name', okName()], ['phone', okPhone()], ['email', okEmail()], ['consent', okCons()]].forEach(function (p) {
        showError(p[0], !p[1]); if (!p[1]) bad = true;
      });
      if (bad) { setState(null); var f = $('.has-error input'); if (f) f.focus(); return; }

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
        consent: true,
        consentVersion: CONSENT_VERSION,
        consentAt: new Date().toISOString(),
        lang: API.lang,
        tour: 'madeira-2026-10-27',
        page: location.href
      };
      btn.disabled = true; btn.textContent = API.T.fSending; setState(null);

      fetch(CFG.formEndpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
      .then(function (r) { if (!r.ok) throw new Error('http'); return r.json().catch(function () { return {}; }); })
      .then(function () {
        setState('ok');
        form.reset();
        ['name','phone','email','consent'].forEach(function (k) { showError(k, false); });
        API.fillForm(API.T);
        $('#stOk').scrollIntoView({ block: 'center', behavior: 'smooth' });
      })
      .catch(function () { setState('err:generic'); })
      .then(function () { btn.disabled = false; btn.textContent = API.T.fSubmit; });
    });
  };

  return API;
})();
