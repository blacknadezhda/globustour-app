/* Напрям C — «Океан». */
(function () {
  'use strict';
  var G = window.GT, el = G.el, ic = G.icon, CFG = G.CFG;
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;'})[c]; }); }
  function tmP(t) {
    var m = t.match(/^(\d{2}:\d{2})\s*—\s*/);
    return m ? '<p><span class="tm">' + m[1] + '</span> ' + esc(t.slice(m[0].length)) + '</p>' : '<p>' + esc(t) + '</p>';
  }
  var PT = ['mount', 'leaf', 'glass', 'wave', 'table'];

  function render(T) {
    document.querySelectorAll('.nav a').forEach(function (a) { a.textContent = T.nav[a.getAttribute('data-nav')]; });
    G.$('#navCta').textContent = T.navCta;
    G.$('#barCta').textContent = T.navCta;

    /* герой на весь екран */
    var hero = G.$('#hero');
    hero.innerHTML = '';
    var img = G.photo('hero', 'heroC__img');
    hero.appendChild(img);
    var over = el('div', 'heroC__over');
    over.innerHTML = '<div class="wrap">' +
      '<span class="heroC__date">' + esc(T.heroBadge) + '</span>' +
      '<div class="heroC__word">' + esc(T.heroWord) + '</div>' +
      '<p class="heroC__sub">' + esc(T.heroLead) + '</p>' +
      '<div class="heroC__cta"><a class="btn btn--primary" href="#form">' + esc(T.heroCta) + '</a>' +
      '<a class="btn btn--ghost" href="#program">' + esc(T.heroCta2) + '</a></div></div>';
    hero.appendChild(over);
    if (img.classList.contains('ph--empty')) {
      hero.appendChild(el('div', 'heroC__hint', T.photoHint + ' \u00b7 ' + T.photoSlots.hero));
    }

    /* цифри */
    var stats = [T.facts[0], T.facts[1], T.facts[4], T.facts[5]];
    G.$('#marq').innerHTML = '<div class="wrap"><div class="marq__t">' + stats.map(function (f) {
      return '<div class="statC"><b>' + esc(f.b) + '</b><span>' + esc(f.s) + '</span></div>';
    }).join('') + '</div></div>';

    /* чому їдуть з нами + картки місць */
    G.$('#about').innerHTML = '<div class="wrap"><div class="whyC"><div>' +
      '<span class="tagC">' + esc(T.nav.about) + '</span>' +
      '<h2 style="margin:16px 0">' + esc(T.aboutTitle) + '</h2>' +
      '<p class="lead">' + esc(T.aboutText1) + '</p><p>' + esc(T.aboutText2) + '</p></div>' +
      '<div class="whyC__cards">' + T.aboutPoints.map(function (p, i) {
        return '<div class="whyC__c"><i>' + ic(PT[i % PT.length]) + '</i><div><b>' + esc(p.b) + '</b><span>' + esc(p.s) + '</span></div></div>';
      }).join('') + '</div></div><div class="spotsC" id="spots"></div></div>';

    var sp = G.$('#spots');
    [['funchal', T.aboutPoints[2].b], ['west', T.aboutPoints[0].b], ['peak', T.aboutPoints[1].b], ['beach', T.aboutPoints[3].b]]
      .forEach(function (pair, i) {
        var c = el('div', 'spotC');
        c.appendChild(G.photo(pair[0]));
        var t = el('div', 'spotC__t');
        t.appendChild(el('b', null, pair[1]));
        t.appendChild(el('span', null, T.days[[1, 2, 4, 5][i]].d));
        c.appendChild(t);
        sp.appendChild(c);
      });

    /* програма */
    G.$('#program').innerHTML = '<div class="wrap"><div class="sec__head"><span class="tagC">' + esc(T.nav.program) +
      '</span><h2 style="margin-top:16px">' + esc(T.programTitle) + '</h2><p>' + esc(T.programLead) + '</p></div><div class="daysC" id="days"></div></div>';
    var days = G.$('#days');
    T.days.forEach(function (d, i) {
      var w = el('div', 'dayC' + (i === 0 ? ' is-open' : ''));
      w.innerHTML = '<button class="dayC__b" type="button" aria-expanded="' + (i === 0) + '">' +
        '<span class="dayC__n">' + esc(T.dayWord + ' ' + (i + 1)) + '</span>' +
        '<span class="dayC__t"><b>' + esc(d.t) + '</b><span>' + esc(d.d) + '</span></span>' +
        '<span class="dayC__c">' + ic('chev') + '</span></button>' +
        '<div class="dayC__body">' + d.p.map(tmP).join('') + '</div>';
      var b = w.querySelector('.dayC__b');
      b.addEventListener('click', function () { b.setAttribute('aria-expanded', String(w.classList.toggle('is-open'))); });
      days.appendChild(w);
    });

    /* у вартість входить — сітка іконок */
    G.$('#includes').innerHTML = '<div class="wrap"><div class="sec__head"><span class="tagC">' + esc(T.nav.includes) +
      '</span><h2 style="margin-top:16px">' + esc(T.inclYes) + '</h2></div>' +
      '<div class="gridC">' + T.inclCards.map(function (c) {
        return '<div class="gridC__i"><i>' + ic(c.ic) + '</i><b>' + esc(c.b) + '</b><p>' + esc(c.s) + '</p></div>';
      }).join('') + '</div>' +
      '<div class="extraC"><h3>' + ic('minus') + esc(T.inclNo) + '</h3><ul>' +
        T.inclNoList.map(function (x) { return '<li><i></i><span>' + esc(x) + '</span></li>'; }).join('') + '</ul></div>' +
      '<p class="noteC">' + esc(T.inclNote) + '</p>' +
      (CFG.price ? '<div class="priceC"><span>' + esc(T.priceTitle) + '</span><b>' + esc(CFG.price) +
        '</b><p>' + esc(T.priceNote) + '</p></div>' : '') + '</div>';

    /* про нас */
    var U = window.ABOUT_US || {}, us = G.$('#us');
    if (U.text && U.text[G.lang]) {
      us.hidden = false;
      us.innerHTML = '<div class="wrap"><div class="sec__head"><span class="tagC">' + esc(T.nav.us) +
        '</span><h2 style="margin-top:16px">' + esc(T.usTitle) + '</h2><p>' + esc(U.text[G.lang]) + '</p></div><div class="usC">' +
        (U.years  ? '<div><b>' + esc(U.years)  + '</b><span>' + esc(T.usYears)  + '</span></div>' : '') +
        (U.tours  ? '<div><b>' + esc(U.tours)  + '</b><span>' + esc(T.usTours)  + '</span></div>' : '') +
        (U.people ? '<div><b>' + esc(U.people) + '</b><span>' + esc(T.usPeople) + '</span></div>' : '') + '</div></div>';
    } else us.hidden = true;

    /* автор */
    var H = window.HOST || {}, host = G.$('#host');
    if (H.name && H.quote && H.quote[G.lang]) {
      host.hidden = false;
      host.innerHTML = '<div class="wrap"><div class="sec__head"><h2>' + esc(T.hostTitle) + '</h2></div>' +
        '<div class="hostC" id="hostBox"><div><blockquote>' + esc(H.quote[G.lang]) + '</blockquote><cite>' +
        esc(H.name) + (H.role && H.role[G.lang] ? ' &middot; ' + esc(H.role[G.lang]) : '') + '</cite></div></div></div>';
      var hb = G.$('#hostBox'); hb.insertBefore(G.photo('host'), hb.firstChild);
    } else host.hidden = true;

    /* відгуки */
    var list = (window.REVIEWS || []).filter(function (r) { return r && r.text && r.text[G.lang]; });
    var rev = G.$('#reviews'), nr = G.$('#navReviews');
    if (!list.length) { rev.hidden = true; if (nr) nr.hidden = true; }
    else {
      rev.hidden = false; if (nr) nr.hidden = false;
      rev.innerHTML = '<div class="wrap"><div class="sec__head"><span class="tagC">' + esc(T.nav.reviews) +
        '</span><h2 style="margin-top:16px">' + esc(T.reviewsTitle) + '</h2><p>' + esc(T.reviewsLead) + '</p></div><div class="revC">' +
        list.map(function (r) {
          var pl = (r.place && (r.place[G.lang] || r.place.ua || r.place.en)) || '';
          return '<article class="revC__c"><div class="revC__s" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div>' +
            '<p>' + esc(r.text[G.lang]) + '</p><div class="revC__f">' +
            (r.photo ? '<img class="revC__a" src="' + esc(r.photo) + '" alt="" loading="lazy">'
                     : '<div class="revC__a">' + esc((r.name || '?').charAt(0).toUpperCase()) + '</div>') +
            '<div><b>' + esc(r.name || '') + '</b><span>' + esc(pl) + '</span></div></div></article>';
        }).join('') + '</div></div>';
    }

    /* FAQ */
    G.$('#faq').innerHTML = '<div class="wrap"><div class="sec__head"><span class="tagC">' + esc(T.nav.faq) +
      '</span><h2 style="margin-top:16px">' + esc(T.faqTitle) + '</h2></div><div id="faqL"></div></div>';
    var fq = G.$('#faqL');
    T.faq.forEach(function (q) {
      var w = el('div', 'faqC__i');
      w.innerHTML = '<button class="faqC__b" type="button" aria-expanded="false"><span>' + esc(q.q) + '</span>' +
        ic('plus') + '</button><div class="faqC__a">' + esc(q.a) + '</div>';
      var b = w.querySelector('.faqC__b');
      b.addEventListener('click', function () { b.setAttribute('aria-expanded', String(w.classList.toggle('is-open'))); });
      fq.appendChild(w);
    });

    /* форма */
    var f = G.$('#form');
    f.classList.add('formC');
    if (!G.$('#leadForm')) {
      f.innerHTML = '<div class="wrap"><div class="formC__g">' +
        '<div><div class="sec__head"><span class="tagC" id="fTag"></span><h2 id="fTtl" style="margin-top:16px"></h2><p id="fLead"></p></div>' +
        '<form class="formC__card" id="leadForm" novalidate>' + G.formMarkup() + '</form></div>' +
        '<div><h3 id="cTtl"></h3><p id="cLead" style="margin-top:10px;color:var(--ink2)"></p><ul class="clC" id="cl"></ul></div>' +
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
    }).join('') : '<li class="clCEmpty">' + esc(T.contactsEmpty) + '</li>';

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
