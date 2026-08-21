/* Напрям B — «Тепла подорож». */
(function () {
  'use strict';
  var G = window.GT, el = G.el, ic = G.icon, CFG = G.CFG;
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;'})[c]; }); }
  function tmP(t) {
    var m = t.match(/^(\d{2}:\d{2})\s*—\s*/);
    return m ? '<p><span class="tm">' + m[1] + '</span> ' + esc(t.slice(m[0].length)) + '</p>' : '<p>' + esc(t) + '</p>';
  }
  var PT = ['mount', 'leaf', 'glass', 'wave', 'table'];

  /* Підсвічуємо останнє слово першого рядка заголовка коралевим підкресленням */
  function heading(txt) {
    var i = txt.indexOf(':');
    if (i > 0) return '<span class="mark">' + esc(txt.slice(0, i)) + '</span>' + esc(txt.slice(i));
    var w = txt.split(' ');
    return esc(w.slice(0, -1).join(' ')) + ' <span class="mark">' + esc(w[w.length - 1]) + '</span>';
  }

  function render(T) {
    document.querySelectorAll('.nav a').forEach(function (a) { a.textContent = T.nav[a.getAttribute('data-nav')]; });
    G.$('#navCta').textContent = T.navCta;
    G.$('#barCta').textContent = T.navCta;

    /* герой */
    G.$('#hero').innerHTML = '<div class="wrap heroB__g"><div>' +
      '<span class="tagB">' + esc(T.heroBadge) + '</span>' +
      '<h1>' + heading(T.heroTitle) + '</h1>' +
      '<p class="lead">' + esc(T.heroLead) + '</p>' +
      '<div class="heroB__cta"><a class="btn btn--primary" href="#form">' + esc(T.heroCta) + '</a>' +
      '<a class="btn btn--ghost" href="#program">' + esc(T.heroCta2) + '</a></div>' +
      '<p class="heroB__note">' + esc(T.heroNote) + '</p></div>' +
      '<div class="heroB__col" id="heroCol"></div></div>';
    var col = G.$('#heroCol');
    ['hero', 'peak', 'beach'].forEach(function (s) { col.appendChild(G.photo(s)); });

    /* смуга фактів */
    G.$('#marq').innerHTML = '<div class="wrap"><div class="marq__t">' + T.facts.map(function (f) {
      return '<div class="factB"><b>' + esc(f.b) + '</b><span>' + esc(f.s) + '</span></div>';
    }).join('') + '</div></div>';

    /* про тур */
    G.$('#about').innerHTML = '<div class="wrap aboutB__g"><div>' +
      '<span class="tagB">' + esc(T.nav.about) + '</span>' +
      '<h2 style="margin:16px 0">' + esc(T.aboutTitle) + '</h2>' +
      '<p class="lead">' + esc(T.aboutText1) + '</p><p>' + esc(T.aboutText2) + '</p>' +
      '<ul class="aboutB__pts">' + T.aboutPoints.map(function (p, i) {
        return '<li><i>' + ic(PT[i % PT.length]) + '</i><div><b>' + esc(p.b) + '</b><span>' + esc(p.s) + '</span></div></li>';
      }).join('') + '</ul></div>' +
      '<div class="aboutB__cards" id="abC"></div></div>';
    var ab = G.$('#abC');
    [['funchal', T.aboutPoints[2].b], ['west', T.aboutPoints[0].b], ['peak', T.aboutPoints[1].b], ['beach', T.aboutPoints[3].b]]
      .forEach(function (pair) {
        var c = el('div', 'aboutB__c');
        c.appendChild(G.photo(pair[0]));
        c.appendChild(el('p', null, pair[1]));
        ab.appendChild(c);
      });

    /* програма — таймлайн */
    G.$('#program').innerHTML = '<div class="wrap"><div class="sec__head"><span class="tagB">' + esc(T.nav.program) +
      '</span><h2 style="margin-top:16px">' + esc(T.programTitle) + '</h2><p>' + esc(T.programLead) + '</p></div><div id="days"></div></div>';
    var days = G.$('#days');
    T.days.forEach(function (d, i) {
      var w = el('div', 'dayB' + (i === 0 ? ' is-open' : ''));
      w.innerHTML = '<div class="dayB__rail"><span class="dayB__dot">' + (i + 1) + '</span><span class="dayB__ln"></span></div>' +
        '<div class="dayB__card"><div class="dayB__d">' + esc(d.d) + '</div><h3>' + esc(d.t) + '</h3>' +
        '<button class="dayB__more" type="button" aria-expanded="' + (i === 0) + '"><span></span>' + ic('chev') + '</button>' +
        '<div class="dayB__body">' + d.p.map(tmP).join('') + '</div></div>';
      var b = w.querySelector('.dayB__more'), lbl = b.querySelector('span');
      function sync() {
        var open = w.classList.contains('is-open');
        lbl.textContent = open ? T.dayHide : T.dayShow;
        b.setAttribute('aria-expanded', String(open));
      }
      b.addEventListener('click', function () { w.classList.toggle('is-open'); sync(); });
      sync();
      days.appendChild(w);
    });

    /* що входить */
    G.$('#includes').innerHTML = '<div class="wrap"><div class="sec__head"><span class="tagB">' + esc(T.nav.includes) +
      '</span><h2 style="margin-top:16px">' + esc(T.inclTitle) + '</h2></div><div class="inclB">' +
      '<div class="inclB__c inclB__c--yes"><h3><i>' + ic('check') + '</i>' + esc(T.inclYes) + '</h3><ul>' +
        T.inclYesList.map(function (x) { return '<li>' + ic('check') + '<span>' + esc(x) + '</span></li>'; }).join('') + '</ul></div>' +
      '<div class="inclB__c inclB__c--no"><h3><i>' + ic('minus') + '</i>' + esc(T.inclNo) + '</h3><ul>' +
        T.inclNoList.map(function (x) { return '<li>' + ic('minus') + '<span>' + esc(x) + '</span></li>'; }).join('') + '</ul></div>' +
      '</div><p class="noteB">' + esc(T.inclNote) + '</p>' +
      (CFG.price ? '<div class="priceB"><span>' + esc(T.priceTitle) + '</span><b>' + esc(CFG.price) +
        '</b><p>' + esc(T.priceNote) + '</p></div>' : '') + '</div>';

    /* про нас */
    var U = window.ABOUT_US || {}, us = G.$('#us');
    if (U.text && U.text[G.lang]) {
      us.hidden = false;
      us.innerHTML = '<div class="wrap"><div class="sec__head"><span class="tagB">' + esc(T.nav.us) +
        '</span><h2 style="margin-top:16px">' + esc(T.usTitle) + '</h2><p>' + esc(U.text[G.lang]) + '</p></div><div class="usB">' +
        (U.years  ? '<div><b>' + esc(U.years)  + '</b><span>' + esc(T.usYears)  + '</span></div>' : '') +
        (U.tours  ? '<div><b>' + esc(U.tours)  + '</b><span>' + esc(T.usTours)  + '</span></div>' : '') +
        (U.people ? '<div><b>' + esc(U.people) + '</b><span>' + esc(T.usPeople) + '</span></div>' : '') + '</div></div>';
    } else us.hidden = true;

    /* автор */
    var H = window.HOST || {}, host = G.$('#host');
    if (H.name && H.quote && H.quote[G.lang]) {
      host.hidden = false;
      host.innerHTML = '<div class="wrap"><div class="sec__head"><h2>' + esc(T.hostTitle) + '</h2></div>' +
        '<div class="hostB" id="hostBox"><div><blockquote>' + esc(H.quote[G.lang]) + '</blockquote><cite>' +
        esc(H.name) + (H.role && H.role[G.lang] ? ' &middot; ' + esc(H.role[G.lang]) : '') + '</cite></div></div></div>';
      var hb = G.$('#hostBox'); hb.insertBefore(G.photo('host'), hb.firstChild);
    } else host.hidden = true;

    /* відгуки */
    var list = (window.REVIEWS || []).filter(function (r) { return r && r.text && r.text[G.lang]; });
    var rev = G.$('#reviews'), nr = G.$('#navReviews');
    if (!list.length) { rev.hidden = true; if (nr) nr.hidden = true; }
    else {
      rev.hidden = false; if (nr) nr.hidden = false;
      rev.innerHTML = '<div class="wrap"><div class="sec__head"><span class="tagB">' + esc(T.nav.reviews) +
        '</span><h2 style="margin-top:16px">' + esc(T.reviewsTitle) + '</h2><p>' + esc(T.reviewsLead) + '</p></div><div class="revB">' +
        list.map(function (r) {
          var pl = (r.place && (r.place[G.lang] || r.place.ua || r.place.en)) || '';
          return '<article class="revB__c"><div class="revB__s" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div>' +
            '<p>' + esc(r.text[G.lang]) + '</p><div class="revB__f">' +
            (r.photo ? '<img class="revB__a" src="' + esc(r.photo) + '" alt="" loading="lazy">'
                     : '<div class="revB__a">' + esc((r.name || '?').charAt(0).toUpperCase()) + '</div>') +
            '<div><b>' + esc(r.name || '') + '</b><span>' + esc(pl) + '</span></div></div></article>';
        }).join('') + '</div></div>';
    }

    /* FAQ */
    G.$('#faq').innerHTML = '<div class="wrap"><div class="sec__head"><span class="tagB">' + esc(T.nav.faq) +
      '</span><h2 style="margin-top:16px">' + esc(T.faqTitle) + '</h2></div><div id="faqL"></div></div>';
    var fq = G.$('#faqL');
    T.faq.forEach(function (q) {
      var w = el('div', 'faqB__i');
      w.innerHTML = '<button class="faqB__b" type="button" aria-expanded="false"><span>' + esc(q.q) + '</span>' +
        ic('plus') + '</button><div class="faqB__a">' + esc(q.a) + '</div>';
      var b = w.querySelector('.faqB__b');
      b.addEventListener('click', function () { b.setAttribute('aria-expanded', String(w.classList.toggle('is-open'))); });
      fq.appendChild(w);
    });

    /* форма */
    if (!G.$('#leadForm')) {
      G.$('#form').innerHTML = '<div class="wrap"><div class="formB__g">' +
        '<div><div class="sec__head"><span class="tagB" id="fTag"></span><h2 id="fTtl" style="margin-top:16px"></h2><p id="fLead"></p></div>' +
        '<form class="formB__card" id="leadForm" novalidate>' + G.formMarkup() + '</form></div>' +
        '<div><h3 id="cTtl"></h3><p id="cLead" style="margin-top:10px;color:var(--ink2)"></p><ul class="clB" id="cl"></ul></div>' +
        '</div></div>';
      G.wireForm(G.$('#leadForm'));
    }
    G.$('#fTag').textContent = T.nav.form;
    G.$('#fTtl').textContent = T.formTitle;
    G.$('#fLead').textContent = T.formLead;
    G.$('#cTtl').textContent = T.contactsTitle;
    G.$('#cLead').textContent = T.contactsLead;

    var cs = G.contacts(T);
    G.$('#cl').innerHTML = cs.length ? cs.map(function (c) {
      var ext = c.href.indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '';
      return '<li><a href="' + c.href + '" aria-label="' + esc(c.label) + '"' + ext + '>' + ic(c.ic) + '<span>' + esc(c.text) + '</span></a></li>';
    }).join('') : '<li class="clBEmpty">' + esc(T.contactsEmpty) + '</li>';

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
