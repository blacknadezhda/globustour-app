/* Рендер юридичних сторінок: підставляє реквізити з content.js і перемикає мову. */
(function () {
  'use strict';
  var CFG = window.CONFIG || {};
  var L = (CFG.legal || {});
  var DOC = window.LEGAL_DOC;               /* 'privacy' | 'consent' */
  var UPDATED = '2026-08-21';

  function pickLang() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q === 'ua' || q === 'en') return q;
    var saved; try { saved = localStorage.getItem('gt_lang'); } catch (e) {}
    if (saved === 'ua' || saved === 'en') return saved;
    var n = (navigator.language || 'en').toLowerCase();
    return (n.indexOf('uk') === 0 || n.indexOf('ru') === 0) ? 'ua' : 'en';
  }
  var lang = pickLang();

  function owner() {
    return (lang === 'ua' ? L.ownerUa : L.ownerEn) || (lang === 'ua' ? L.ownerUa : L.ownerUa) || '';
  }
  function address() { return (lang === 'ua' ? L.addressUa : L.addressEn) || L.addressUa || ''; }
  function months()  { return L.storageMonths || 24; }

  function esc(s) {
    return String(s).replace(/[&<>]/g, function (c) { return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' })[c]; });
  }

  var UI = {
    ua: { back:'На головну', updated:'Оновлено', priv:'Політика конфіденційності', cons:'Згода на обробку персональних даних',
          gap:'Реквізити володільця даних ще не заповнені у файлі content.js (розділ legal). Поки вони порожні, документ не має юридичної сили — заповніть їх до запуску сайту.' },
    en: { back:'Back to the homepage', updated:'Updated', priv:'Privacy Policy', cons:'Consent to Personal Data Processing',
          gap:'The data controller\'s details are not filled in yet in content.js (the legal section). Until they are, this document has no legal force — complete them before launching the site.' }
  }[lang];

  /* ---------------------------- Тексти документів ---------------------------- */
  var O = owner() || (lang === 'ua' ? '[володілець даних не вказаний]' : '[data controller not specified]');
  var A = address() || (lang === 'ua' ? '[адреса не вказана]' : '[address not specified]');
  var E = L.email || (lang === 'ua' ? '[пошта не вказана]' : '[email not specified]');
  var R = L.regNo ? (lang === 'ua' ? ', код ' + L.regNo : ', reg. no. ' + L.regNo) : '';
  var M = months();

  var DOCS = {
    privacy: {
      ua: { title:'Політика конфіденційності', body:
        '<h2>1. Хто обробляє ваші дані</h2>' +
        '<p>Володільцем персональних даних, зібраних через цей сайт, є ' + esc(O) + esc(R) + ', адреса: ' + esc(A) + ', електронна пошта: ' + esc(E) + '. Далі — «ми».</p>' +
        '<p>Політику складено відповідно до Закону України «Про захист персональних даних» №2297-VI. Для відвідувачів зі США вона також виконує роль privacy policy у розумінні каліфорнійського CalOPPA.</p>' +
        '<h2>2. Які дані ми збираємо</h2><ul>' +
        '<li>Ім\'я та номер телефону — обов\'язкові поля форми заявки.</li>' +
        '<li>Місто чи країна вильоту, кількість осіб, коментар — якщо ви їх вказали.</li>' +
        '<li>Мова сайту, дата й час заявки, версія тексту згоди — технічні дані заявки.</li></ul>' +
        '<p>Ми не збираємо платіжні дані, дані документів і будь-які чутливі категорії даних. Оплата на сайті не приймається.</p>' +
        '<h2>3. Навіщо ми їх обробляємо</h2><ul>' +
        '<li>Зв\'язатися з вами, надіслати програму туру, вартість і умови бронювання.</li>' +
        '<li>Відповісти на ваші питання щодо туру.</li>' +
        '<li>Окремо, і лише за вашою окремою згодою, — надсилати новини про нові тури та акції.</li></ul>' +
        '<h2>4. Правова підстава</h2><p>Єдина підстава обробки — ваша згода, надана позначенням чекбокса під формою заявки. Факт згоди фіксується разом із заявкою: дата, час і версія тексту згоди.</p>' +
        '<h2>5. Кому передаються дані</h2><p>Дані заявки передаються месенджеру Telegram (Telegram FZ-LLC), через який ми отримуємо сповіщення про нові заявки, і сервісу Cloudflare, Inc., який приймає форму. Обидва сервіси розташовані за межами України; передача здійснюється з дотриманням статті 29 Закону №2297-VI. Ми не продаємо ваші дані і не передаємо їх рекламним платформам.</p>' +
        '<h2>6. Скільки зберігаємо</h2><p>Дані заявки зберігаються ' + M + ' місяців з дати звернення або до відкликання згоди — залежно від того, що настане раніше. Після цього вони видаляються.</p>' +
        '<h2>7. Ваші права</h2><ul>' +
        '<li>Знати, які ваші дані ми обробляємо, і отримати їхню копію.</li>' +
        '<li>Вимагати виправлення неточних даних.</li>' +
        '<li>Вимагати видалення даних і відкликати згоду в будь-який момент.</li>' +
        '<li>Заперечувати проти обробки та звернутися зі скаргою до Уповноваженого Верховної Ради України з прав людини.</li></ul>' +
        '<p>Щоб скористатися будь-яким із прав, напишіть на ' + esc(E) + '. Ми відповідаємо протягом 30 днів.</p>' +
        '<h2>8. Cookie та аналітика</h2><p>Сайт не використовує рекламні чи аналітичні cookie і не встановлює лічильників. Шрифти та всі файли оформлення завантажуються з нашого сервера, тому при відкритті сторінки ваші дані не передаються стороннім сервісам. У браузері зберігається лише обрана вами мова сторінки — це технічна необхідність, і згоди вона не потребує. Якщо ми додамо аналітику, ми оновимо цю політику і покажемо банер згоди.</p>' +
        '<h2>9. Зміни політики</h2><p>Актуальна редакція завжди опублікована на цій сторінці. Дата оновлення вказана вище.</p>' },
      en: { title:'Privacy Policy', body:
        '<h2>1. Who processes your data</h2>' +
        '<p>The controller of personal data collected through this website is ' + esc(O) + esc(R) + ', address: ' + esc(A) + ', email: ' + esc(E) + ' ("we").</p>' +
        '<p>This policy follows the Law of Ukraine "On Personal Data Protection" No. 2297-VI. For visitors in the United States it also serves as the privacy policy required by the California CalOPPA.</p>' +
        '<h2>2. What we collect</h2><ul>' +
        '<li>Your name and phone number — the required fields of the request form.</li>' +
        '<li>Departure country, number of travellers and your comment — if you provide them.</li>' +
        '<li>Site language, date and time of the request, and the version of the consent text — technical details of the request.</li></ul>' +
        '<p>We do not collect payment details, identity document data or any sensitive categories of data. No payments are taken on this site.</p>' +
        '<h2>3. Why we process it</h2><ul>' +
        '<li>To contact you and send the tour itinerary, the price and the booking terms.</li>' +
        '<li>To answer your questions about the tour.</li>' +
        '<li>Separately, and only with your separate consent, to send news about new tours and offers.</li></ul>' +
        '<h2>4. Legal basis</h2><p>The only basis for processing is your consent, given by ticking the checkbox under the request form. The fact of consent is recorded together with the request: date, time and the version of the consent text.</p>' +
        '<h2>5. Who we share it with</h2><p>Request data is delivered to Telegram (Telegram FZ-LLC), where we receive notifications about new requests, and to Cloudflare, Inc., which receives the form submission. Both are located outside Ukraine; the transfer complies with Article 29 of Law No. 2297-VI. We do not sell your data and do not share it with advertising platforms.</p>' +
        '<h2>6. How long we keep it</h2><p>Request data is kept for ' + M + ' months from the date of your enquiry, or until you withdraw consent, whichever comes first. After that it is deleted.</p>' +
        '<h2>7. Your rights</h2><ul>' +
        '<li>To know what data we process and receive a copy of it.</li>' +
        '<li>To have inaccurate data corrected.</li>' +
        '<li>To have your data deleted and to withdraw consent at any time.</li>' +
        '<li>To object to processing and to lodge a complaint with the Ukrainian Parliament Commissioner for Human Rights.</li></ul>' +
        '<p>To exercise any of these rights, write to ' + esc(E) + '. We respond within 30 days.</p>' +
        '<h2>8. Cookies and analytics</h2><p>This site uses no advertising or analytics cookies and runs no trackers. Fonts and all styling files are served from our own server, so opening the page sends no data to third parties. Your browser stores only the page language you selected — a technical necessity that does not require consent. If we add analytics, we will update this policy and show a consent banner.</p>' +
        '<h2>9. Changes to this policy</h2><p>The current version is always published on this page. The update date is shown above.</p>' }
    },
    consent: {
      ua: { title:'Згода на обробку персональних даних', body:
        '<p>Позначаючи чекбокс під формою заявки на сайті, я, як суб\'єкт персональних даних, вільно, конкретно та усвідомлено надаю згоду ' + esc(O) + esc(R) + ', адреса: ' + esc(A) + ' (володілець), на обробку моїх персональних даних на умовах, викладених нижче.</p>' +
        '<h2>1. Перелік даних</h2><p>Ім\'я, номер телефону, а також — за моїм бажанням — країна вильоту, кількість осіб і текст коментаря. Разом із заявкою фіксуються дата, час і версія тексту цієї згоди.</p>' +
        '<h2>2. Мета обробки</h2><p>Опрацювання моєї заявки на участь у турі, зв\'язок зі мною, надсилання програми туру, вартості та умов бронювання, відповіді на мої питання.</p>' +
        '<h2>3. Дії з даними</h2><p>Збір, запис, систематизація, зберігання, уточнення, використання, передача (у межах, описаних у Політиці конфіденційності), знеособлення, видалення. Обробка здійснюється автоматизовано.</p>' +
        '<h2>4. Строк дії</h2><p>Згода діє ' + M + ' місяців з дати надання або до моменту її відкликання.</p>' +
        '<h2>5. Порядок відкликання</h2><p>Я можу відкликати цю згоду в будь-який момент, надіславши лист на ' + esc(E) + '. Після відкликання дані видаляються, крім випадків, коли їх зберігання вимагає закон.</p>' +
        '<h2>6. Рекламна розсилка</h2><p>Згода на отримання новин про нові тури та акції надається окремим необов\'язковим чекбоксом і не є умовою опрацювання заявки. Її можна відкликати окремо тим самим листом.</p>' },
      en: { title:'Consent to Personal Data Processing', body:
        '<p>By ticking the checkbox under the request form on this website, I, as the data subject, freely, specifically and knowingly give my consent to ' + esc(O) + esc(R) + ', address: ' + esc(A) + ' (the controller), to process my personal data on the terms set out below.</p>' +
        '<h2>1. Data covered</h2><p>My name and phone number and, at my option, departure country, number of travellers and the text of my comment. The date, time and version of this consent text are recorded together with the request.</p>' +
        '<h2>2. Purpose</h2><p>Handling my request to join the tour, contacting me, sending the tour itinerary, the price and the booking terms, and answering my questions.</p>' +
        '<h2>3. Operations performed</h2><p>Collection, recording, organisation, storage, correction, use, transfer (within the limits described in the Privacy Policy), anonymisation and deletion. Processing is automated.</p>' +
        '<h2>4. Duration</h2><p>This consent is valid for ' + M + ' months from the date it is given, or until it is withdrawn.</p>' +
        '<h2>5. Withdrawal</h2><p>I may withdraw this consent at any time by writing to ' + esc(E) + '. After withdrawal the data is deleted, except where the law requires it to be retained.</p>' +
        '<h2>6. Marketing messages</h2><p>Consent to receive news about new tours and offers is given by a separate optional checkbox and is not a condition for handling the request. It can be withdrawn separately in the same email.</p>' }
    }
  };

  var d = DOCS[DOC][lang];
  var needsData = !L.ownerUa && !L.ownerEn;

  document.documentElement.lang = (lang === 'ua' ? 'uk' : 'en');
  document.title = d.title + ' · Globustour';

  var root = document.getElementById('doc');
  root.innerHTML =
    '<a class="doc__back" href="index.html">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>' +
      UI.back + '</a>' +
    '<h1>' + d.title + '</h1>' +
    '<p class="doc__date">' + UI.updated + ': ' + UPDATED + '</p>' +
    (needsData ? '<div class="todo"><b>' + (lang === 'ua' ? 'Документ не готовий до публікації' : 'Document is not ready to publish') + '</b>' + UI.gap + '</div>' : '') +
    d.body +
    '<p style="margin-top:32px"><a href="' + (DOC === 'privacy' ? 'consent.html' : 'privacy.html') + '">' +
      (DOC === 'privacy' ? UI.cons : UI.priv) + '</a></p>';

  document.querySelectorAll('.lang button').forEach(function (b) {
    b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    b.addEventListener('click', function () {
      try { localStorage.setItem('gt_lang', b.dataset.lang); } catch (e) {}
      location.search = '?lang=' + b.dataset.lang;
    });
  });
})();
