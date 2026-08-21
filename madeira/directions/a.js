/* Напрям A — «Редакційний». Рендер секцій; логіка форми — у shared.js. */
(function () {
  'use strict';
  var G = window.GT, el = G.el, ic = G.icon, CFG = G.CFG;

  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;'})[c]; }); }
  function tmP(text) {
    var m = text.match(/^(\d{2}:\d{2})\s*—\s*/);
    return m ? '<p><span class="tm">' + m[1] + '</span> ' + esc(text.slice(m[0].length)) + '</p>'
             : '<p>' + esc(text) + '</p>';
  }
  var PT = ['mount', 'leaf', 'glass', 'wave', 'table'];

  function render(T) {
    document.querySelectorAll('.nav a').forEach(function (a) { a.textContent = T.nav[a.getAttribute('data-nav')]; });
    G.$('#navCta').textContent = T.navCta;
    G.$('#barCta').textContent = T.navCta;
    G.$('#hdrLbl').textContent = T.heroBadge;

    /* герой */
    G.$('#hero').innerHTML =
      '<div class="wrap heroA__g"><div>' +
        '<div class="pills">' + T.aboutPoints.slice(0, 3).map(function (p, i) {
          return '<span class="pill' + (i === 0 ? ' pill--on' : '') + '">' + esc(p.b) + '</span>'; }).join('') + '</div>' +
        '<h1>' + esc(T.heroTitle) + '</h1>' +
        '<p class="lead">' + esc(T.heroLead) + '</p>' +
        '<div class="heroA__meta"><span>' + ic('plane') + esc(T.facts[1].b) + '</span>' +
          '<span>' + ic('bed') + esc(T.facts[3].b) + '</span>' +
          '<span>' + ic('users') + esc(T.facts[5].b) + '</span></div>' +
        '<div class="heroA__cta"><a class="btn btn--primary" href="#form">' + esc(T.heroCta) + ic('arrow') + '</a>' +
          '<a class="btn btn--ghost" href="#program">' + esc(T.heroCta2) + '</a></div>' +
      '</div><div class="heroA__art" id="heroArt"></div></div>';

    var art = G.$('#heroArt');
    art.appendChild(G.photo('hero'));
    var fl = el('div', 'heroA__float');
    fl.appendChild(G.photo('peak'));
    fl.appendChild(el('p', null, T.aboutPoints[0].b));
    art.appendChild(fl);
    art.appendChild(el('div', 'heroA__badge', T.heroBadge));

    /* біжучий рядок */
    var run = T.facts.map(function (f) { return f.b; }).concat(['Madeira 2026'])
      .map(function (w) { return '<span>' + esc(w) + '</span><i>&#10022;</i>'; }).join('');
    G.$('#marq').innerHTML = '<div class="marq__t">' + run + run + '</div>';

    /* про тур */
    G.$('#about').innerHTML = '<div class="wrap aboutA">' +
      '<div class="aboutA__card" id="abCard"><p>' + esc(T.aboutText1.split('. ')[0] + '.') + '</p></div>' +
      '<div><span class="pill">' + esc(T.nav.about) + '</span>' +
      '<h2 style="margin:16px 0">' + esc(T.aboutTitle) + '</h2>' +
      '<p class="lead">' + esc(T.aboutText2) + '</p><ul class="aboutA__pts">' +
      T.aboutPoints.map(function (p, i) {
        return '<li>' + ic(PT[i % PT.length]) + '<div><b>' + esc(p.b) + '</b><span>' + esc(p.s) + '</span></div></li>';
      }).join('') + '</ul></div></div>';
    var ac = G.$('#abCard'); ac.insertBefore(G.photo('funchal'), ac.firstChild);

    /* програма */
    G.$('#program').innerHTML = '<div class="wrap"><div class="sec__head"><span class="pill">' + esc(T.nav.program) +
      '</span><h2 style="margin-top:16px">' + esc(T.programTitle) + '</h2><p>' + esc(T.programLead) + '</p></div><div id="days"></div></div>';
    var days = G.$('#days');
    T.days.forEach(function (d, i) {
      var w = el('div', 'dayA' + (i === 0 ? ' is-open' : ''));
      w.innerHTML = '<button class="dayA__b" type="button" aria-expanded="' + (i === 0) + '">' +
        '<span class="dayA__n">' + ('0' + (i + 1)).slice(-2) + '</span>' +
        '<span class="dayA__t"><b>' + esc(d.t) + '</b><span>' + esc(d.d) + '</span></span>' +
        '<span class="dayA__c">' + ic('chev') + '</span></button>' +
        '<div class="dayA__body"><div class="dayA__inner">' + d.p.map(tmP).join('') + '</div></div>';
      var b = w.querySelector('.dayA__b');
      b.addEventListener('click', function () { b.setAttribute('aria-expanded', String(w.classList.toggle('is-open'))); });
      days.appendChild(w);
    });

    /* що входить + ціна */
    G.$('#includes').innerHTML = '<div class="wrap"><div class="sec__head"><span class="pill">' + esc(T.nav.includes) +
      '</span><h2 style="margin-top:16px">' + esc(T.inclTitle) + '</h2></div><div class="inclA">' +
      '<div class="inclA__c inclA__c--yes"><h3>' + ic('check') + esc(T.inclYes) + '</h3><ul>' +
        T.inclYesList.map(function (x) { return '<li><i></i><span>' + esc(x) + '</span></li>'; }).join('') + '</ul></div>' +
      '<div class="inclA__c inclA__c--no"><h3>' + ic('minus') + esc(T.inclNo) + '</h3><ul>' +
        T.inclNoList.map(function (x) { return '<li><i></i><span>' + esc(x) + '</span></li>'; }).join('') + '</ul></div>' +
      '</div><p class="noteA">' + esc(T.inclNote) + '</p>' +
      (CFG.price ? '<div class="priceA" style="margin-top:32px"><span class="pill">' + esc(T.priceTitle) +
        '</span><div class="v">' + esc(CFG.price) + '</div><p>' + esc(T.priceNote) + '</p></div>' : '') + '</div>';

    /* про нас */
    var U = window.ABOUT_US || {}, us = G.$('#us');
    if (U.text && U.text[G.lang]) {
      us.hidden = false;
      us.innerHTML = '<div class="wrap"><div class="sec__head"><span class="pill">' + esc(T.nav.us) +
        '</span><h2 style="margin-top:16px">' + esc(T.usTitle) + '</h2><p>' + esc(U.text[G.lang]) + '</p></div><div class="usA__n">' +
        (U.years  ? '<div><b>' + esc(U.years)  + '</b><span>' + esc(T.usYears)  + '</span></div>' : '') +
        (U.tours  ? '<div><b>' + esc(U.tours)  + '</b><span>' + esc(T.usTours)  + '</span></div>' : '') +
        (U.people ? '<div><b>' + esc(U.people) + '</b><span>' + esc(T.usPeople) + '</span></div>' : '') + '</div></div>';
    } else us.hidden = true;

    /* автор туру */
    var H = window.HOST || {}, host = G.$('#host');
    if (H.name && H.quote && H.quote[G.lang]) {
      host.hidden = false;
      host.innerHTML = '<div class="wrap"><div class="sec__head"><h2>' + esc(T.hostTitle) + '</h2></div>' +
        '<div class="hostA" id="hostBox"><div><blockquote>' + esc(H.quote[G.lang]) + '</blockquote><cite>' +
        esc(H.name) + (H.role && H.role[G.lang] ? ' &middot; ' + esc(H.role[G.lang]) : '') + '</cite></div></div></div>';
      var hb = G.$('#hostBox'); hb.insertBefore(G.photo('host'), hb.firstChild);
    } else host.hidden = true;

    /* відгуки */
    var list = (window.REVIEWS || []).filter(function (r) { return r && r.text && r.text[G.lang]; });
    var rev = G.$('#reviews'), nr = G.$('#navReviews');
    if (!list.length) { rev.hidden = true; if (nr) nr.hidden = true; }
    else {
      rev.hidden = false; if (nr) nr.hidden = false;
      rev.innerHTML = '<div class="wrap"><div class="sec__head"><span class="pill">' + esc(T.nav.reviews) +
        '</span><h2 style="margin-top:16px">' + esc(T.reviewsTitle) + '</h2><p>' + esc(T.reviewsLead) + '</p></div><div class="revA">' +
        list.map(function (r) {
          var pl = (r.place && (r.place[G.lang] || r.place.ua || r.place.en)) || '';
          return '<article class="revA__c"><p>&laquo;' + esc(r.text[G.lang]) + '&raquo;</p><div class="revA__f">' +
            (r.photo ? '<img class="revA__a" src="' + esc(r.photo) + '" alt="" loading="lazy">'
                     : '<div class="revA__a">' + esc((r.name || '?').charAt(0).toUpperCase()) + '</div>') +
            '<div><b>' + esc(r.name || '') + '</b><span>' + esc(pl) + '</span></div></div></article>';
        }).join('') + '</div></div>';
    }

    /* FAQ */
    G.$('#faq').innerHTML = '<div class="wrap"><div class="sec__head"><span class="pill">' + esc(T.nav.faq) +
      '</span><h2 style="margin-top:16px">' + esc(T.faqTitle) + '</h2></div><div id="faqL"></div></div>';
    var fq = G.$('#faqL');
    T.faq.forEach(function (q) {
      var w = el('div', 'faqA__i');
      w.innerHTML = '<button class="faqA__b" type="button" aria-expanded="false"><span>' + esc(q.q) + '</span>' +
        ic('plus') + '</button><div class="faqA__a">' + esc(q.a) + '</div>';
      var b = w.querySelector('.faqA__b');
      b.addEventListener('click', function () { b.setAttribute('aria-expanded', String(w.classList.toggle('is-open'))); });
      fq.appendChild(w);
    });

    /* форма */
    if (!G.$('#leadForm')) {
      G.$('#form').innerHTML = '<div class="wrap"><div class="formA"><div class="formA__g">' +
        '<div><div class="sec__head"><h2 id="fTtl"></h2><p id="fLead"></p></div>' +
        '<form class="formA__card" id="leadForm" novalidate>' + G.formMarkup() + '</form></div>' +
        '<div class="formA__side"><h3 id="cTtl"></h3><p id="cLead"></p><ul class="cl" id="cl"></ul></div></div></div></div>';
      G.wireForm(G.$('#leadForm'));
    }
    G.$('#fTtl').textContent = T.formTitle;
    G.$('#fLead').textContent = T.formLead;
    G.$('#cTtl').textContent = T.contactsTitle;
    G.$('#cLead').textContent = T.contactsLead;

    var cs = G.contacts(T);
    G.$('#cl').innerHTML = cs.length ? cs.map(function (c) {
      var ext = c.href.indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '';
      return '<li><a href="' + c.href + '" aria-label="' + esc(c.label) + '"' + ext + '>' + ic(c.ic) + '<span>' + esc(c.text) + '</span></a></li>';
    }).join('') : '<li class="clEmpty">' + esc(T.contactsEmpty) + '</li>';

    /* підвал */
    G.$('#ftrAbout').textContent = T.ftrAbout;
    G.$('#ftrDocsT').textContent = T.ftrDocs;
    G.$('#ftrPrivacy').textContent = T.ftrPrivacy;
    G.$('#ftrConsent').textContent = T.ftrConsent;
    G.$('#ftrContactsT').textContent = T.ftrContacts;
    G.$('#ftrNote').textContent = T.ftrNote;
    G.$('#ftrRights').textContent = T.ftrRights;
    G.$('#ftrCl').innerHTML = cs.map(function (c) {
      var ext = c.href.indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '';
      return '<li><a href="' + c.href + '"' + ext + '>' + esc(c.text) + '</a></li>';
    }).join('');

    G.fillForm(T);
    G.fillPhotos(T);
  }

  G.onRender(render);
  G.render();
  G.wireLang();

  var hdr = G.$('#hdr'), bar = G.$('#ctaBar'), form = G.$('#form');
  function onScroll() {
    hdr.classList.toggle('is-stuck', window.scrollY > 8);
    var passed = window.scrollY > window.innerHeight * 0.6;
    var atForm = form.getBoundingClientRect().top < window.innerHeight;
    bar.classList.toggle('is-on', passed && !atForm);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
