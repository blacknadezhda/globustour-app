/* ==========================================================================
   ЄДИНИЙ ФАЙЛ КОНТЕНТУ. Тут правиться все: налаштування, контакти, тексти,
   програма, відгуки. Код чіпати не потрібно.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. НАЛАШТУВАННЯ
   -------------------------------------------------------------------------- */
window.CONFIG = {

  /* Куди йде заявка. Поки порожньо — форма НЕ працює і чесно про це скаже.
     Як за 10 хвилин отримати цю адресу — див. README.md, крок 1.
     Приклад: 'https://madeira-form.ваш-акаунт.workers.dev' */
  formEndpoint: '',

  /* Контакти. Порожній рядок = пункт не показується. */
  contacts: {
    phoneUa:   '',                 /* '+380 XX XXX XX XX' */
    phoneUs:   '',                 /* '+1 XXX XXX XXXX'   */
    email:     '',                 /* 'hello@example.com' */
    telegram:  '',                 /* 'https://t.me/...'  */
    whatsapp:  '',                 /* 'https://wa.me/...' */
    instagram: ''                  /* 'https://instagram.com/...' */
  },

  /* Реквізити володільця даних — підставляються в політику і згоду.
     Без них юридичні сторінки показують попередження. */
  legal: {
    ownerUa: '',                   /* 'ФОП Прізвище Ім'я По батькові'    */
    ownerEn: '',                   /* 'Individual entrepreneur Name'     */
    regNo:   '',                   /* ЄДРПОУ / РНОКПП                    */
    addressUa: '',                 /* юридична адреса                    */
    addressEn: '',
    email:   '',                   /* пошта для запитів щодо даних       */
    storageMonths: 24              /* строк зберігання заявок, місяців   */
  },

  /* Фото. Порожньо — показується намальована ілюстрація узбережжя.
     Покладіть файл поруч і впишіть ім'я: 'hero.jpg' */
  photos: {
    hero: '',
    host: ''
  }
};

/* --------------------------------------------------------------------------
   2. ВІДГУКИ
   Порожній масив = блок відгуків на сайті не показується взагалі.
   Додавайте ТІЛЬКИ справжні відгуки ваших туристів.
   Формат:
   { name:'Оксана', place:{ua:'Київ',en:'Kyiv'}, photo:'',
     text:{ ua:'текст українською', en:'text in English' } }
   -------------------------------------------------------------------------- */
window.REVIEWS = [];

/* --------------------------------------------------------------------------
   3. АВТОР ТУРУ
   Поки name порожнє — блок не показується.
   -------------------------------------------------------------------------- */
window.HOST = {
  name:  '',                                   /* 'Ніко' */
  role:  { ua:'', en:'' },                     /* 'керівник групи, Globustour' */
  quote: { ua:'', en:'' }                      /* 1–3 речення від першої особи */
};

/* --------------------------------------------------------------------------
   4. ТЕКСТИ САЙТУ — українська і англійська
   -------------------------------------------------------------------------- */
window.I18N = {

/* ======================= У К Р А Ї Н С Ь К А ============================= */
ua: {
  htmlLang: 'uk',
  metaTitle: 'Авторський тур на Мадейру · 27 жовтня — 3 листопада 2026 · Globustour',
  metaDesc:  'Вісім днів на Мадейрі з невеликою українською групою: Фуншал, Порту-Моніш, Пік Арейро, левади, Камара-де-Лобуш, океан і дегустації. Виліт з Катовіце 27.10.2026.',

  nav: { about:'Про тур', program:'Програма', includes:'Що входить', reviews:'Відгуки', faq:'Питання', form:'Заявка' },
  navCta: 'Залишити заявку',

  heroBadge: '27 жовтня — 3 листопада 2026',
  heroTitle: 'Мадейра: 8 днів на острові вічної весни з невеликою українською групою',
  heroLead:  'Океан у листопаді, гори над хмарами, левади в лавровому лісі й вечері всією групою. Ми беремо на себе переліт, готель, трансфери й маршрут — вам лишається зібрати валізу.',
  heroCta:   'Залишити заявку на тур',
  heroCta2:  'Подивитися програму по днях',
  heroNote:  'Група невелика. Менеджер зв\'яжеться з вами й надішле повну програму, вартість і умови бронювання.',
  heroTagT:  'Фуншал, Мадейра',
  heroTagS:  '7 ночей у готелі · сніданки щодня',

  facts: [
    { b:'8 днів',            s:'7 ночей на острові' },
    { b:'Катовіце — Фуншал', s:'груповий переліт' },
    { b:'Фуншал',            s:'готель на весь тур' },
    { b:'2–3 місні номери',  s:'розміщення' },
    { b:'4 виїзні дні',      s:'і 2 вільні дні' },
    { b:'Українська група',  s:'супровід весь тур' }
  ],

  aboutTitle: 'Мадейра за вісім днів — без гонки і без «галопом по Європах»',
  aboutText1: 'Мадейра — португальський острів в Атлантиці за 500 км від Марокко. Тут +22 у листопаді, вулкани заросли лавровим лісом, а вздовж гірських каналів-левад проклали стежки, якими можна йти годинами.',
  aboutText2: 'Ми зібрали маршрут так, щоб ви побачили обидва узбережжя й гори, але не жили в автобусі: чотири дні з виїздами, два вільних дні біля океану і один спокійний день на прощання з островом.',
  aboutPoints: [
    { b:'Захід і схід острова',     s:'Порту-Моніш зі скляним оглядовим майданчиком на висоті 580 м і Пік Арейро — одна з найвищих вершин Мадейри.' },
    { b:'Левади і лавровий ліс',    s:'Прогулянка однією з наймальовничіших левад острова — тією самою зеленню, за яку ліс Мадейри внесли до спадщини ЮНЕСКО.' },
    { b:'Смаки острова',            s:'Мадейрське вино у винному залі Фуншала, поншу в Камара-де-Лобуш, ром у Порту-да-Круж, маракуя й манго на міському ринку.' },
    { b:'Океан і пляжі',            s:'Прайя-Формоза, природні лавові басейни Порту-Моніша і два вільних дні, щоб просто лежати на сонці.' },
    { b:'Вечері всією групою',      s:'За бажанням — спільні вечері в ресторанах міста, зокрема на вулиці розписаних дверей і на прощальному вечорі.' }
  ],

  programTitle: 'Програма по днях',
  programLead:  'Виїзні екскурсії проходять групою з супроводом. Вечері — за бажанням усієї групи, оплачуються окремо.',
  days: [
    { d:'27.10.2026, вівторок', t:'Виліт і зустріч з островом', p:[
      '07:10 — виліт на Мадейру. 11:25 — приліт, індивідуальний трансфер до готелю. Розміщення у 2- або 3-місних номерах після 14:00.',
      'Другу половину дня можна провести біля басейну або вирушити на міський пляж Фуншала (вхід за додаткову плату).',
      'Вечеря для знайомства — за бажанням усієї групи, у ресторані в місті.'
    ]},
    { d:'28.10.2026, середа', t:'Фуншал: набережна, ринок і мадейрське вино', p:[
      'Сніданок у готелі. Знайомимося зі столицею Мадейри: прогуляємося набережною, пройдемося затишними вуличками старого міста й завітаємо до знаменитого міського ринку.',
      'На ринку скуштуємо екзотичні фрукти острова — різні види маракуї, ананаси, манго, банани, папаю та інші місцеві смаколики. Саме тут найкраще відчути колорит острова і його щоденне життя.',
      'Далі — дегустація місцевих вин у винному залі, де познайомимося з традиціями виноробства Мадейри.',
      'Другу половину дня можна провести на пляжі або відпочити біля океану. За бажанням — комплекс басейнів Лідо (вхід додатково оплачується). Вечеря за бажанням усієї групи — у ресторані в місті.'
    ]},
    { d:'29.10.2026, четвер', t:'Західне узбережжя: Порту-Моніш і скляний майданчик', p:[
      'Сніданок у готелі. Одразу після сніданку вирушаємо на західне узбережжя острова. Ви дізнаєтеся, чому саме це рибальське селище обрав для відпочинку Вінстон Черчилль, познайомитеся з традиціями вилову знаменитої риби ешпада та побачите унікальну рибальську каплицю.',
      'Під час прогулянки пройдемося знаменитою «вулицею чоловіків», побачимо незвичайний артпроєкт із переробленого сміття і скуштуємо один із найкращих ранкових коктейлів острова.',
      'Далі — найвища західна точка Європи: оглядовий майданчик зі скляною підлогою на висоті 580 метрів над рівнем моря, звідки відкриваються краєвиди на океан і стрімкі скелі.',
      'Після цього прогуляємося казковим лавровим лісом і скупаємося в природних лавових басейнах Порту-Моніша. На обід зупинимося в ресторані просто на березі океану, де можна скуштувати свіжі морепродукти.',
      'На зворотному шляху загадаємо бажання в одному з місць сили острова і зробимо світлини біля водоспаду. Вечеря за бажанням усієї групи — у ресторані на знаменитій вулиці розписаних дверей.'
    ]},
    { d:'30.10.2026, п\'ятниця', t:'Вільний день біля океану', p:[
      'Сніданок у готелі. Вільний день.',
      'За бажанням вирушимо на один із пляжів поблизу Фуншала — вхід на деякі пляжні комплекси оплачується додатково. Або залишаємося в готелі: сонце й басейн нікуди не подінуться.',
      'Вечеря за бажанням усієї групи — у ресторані.'
    ]},
    { d:'31.10.2026, субота', t:'Схід острова: Пік Арейро, левада і Сантана', p:[
      'Сніданок у готелі. Сьогодні — подорож східною частиною Мадейри. Спочатку піднімемося на Пік Арейро, одну з найвищих вершин острова, звідки відкриваються панорамні краєвиди на гірські хребти та хмари, що пливуть під ногами.',
      'Потім вирушимо на прогулянку однією з наймальовничіших левад острова — з унікальною природою Мадейри, густою зеленню та гірськими пейзажами.',
      'Далі відвідаємо Сантану — містечко, відоме традиційними будиночками з солом\'яними дахами, які стали символом острова. Після цього завітаємо до Порту-да-Круж на дегустацію місцевого рому та знайомство з традиціями його виробництва.',
      'На завершення дня побуваємо на оглядовому майданчику Понта-ду-Рошту — одному з найкрасивіших місць Мадейри, звідки видно стрімкі скелі, Атлантику та східне узбережжя. Повернення до готелю, вечеря за бажанням усією групою.'
    ]},
    { d:'01.11.2026, неділя', t:'Камара-де-Лобуш і пляж Прайя-Формоза', p:[
      'Сніданок у готелі. Після сніданку вирушимо до мальовничого рибальського селища Камара-де-Лобуш. Тут відчуємо атмосферу традиційної Мадейри, завітаємо до родичів Кріштіану Роналду та скуштуємо справжню «поншу» — знаменитий місцевий напій.',
      'Потім — відпочинок на одному з найкращих пляжів Мадейри, у пляжному комплексі Прайя-Формоза, де можна поповнити запаси вітаміну D.',
      'Вечеря за бажанням усієї групи — у ресторані.'
    ]},
    { d:'02.11.2026, понеділок', t:'Вільний день і прощальна вечеря', p:[
      'Сніданок у готелі. Вільний день: за бажанням вирушаємо на пляж, щоб ще раз насолодитися теплим океаном, сонцем і атмосферою Мадейри.',
      'Увечері — прощальна вечеря для всієї групи: нагода поділитися враженнями, згадати найяскравіші моменти й провести останній вечір на острові в приємній компанії.'
    ]},
    { d:'03.11.2026, вівторок', t:'Повернення додому', p:[
      'Сніданок у готелі. Після цього — звільнення номерів і трансфер до аеропорту. Настав час прощатися з островом.',
      '12:05 — виліт до Катовіце. 18:05 — приліт до Катовіце.',
      'До нових подорожей.'
    ]}
  ],

  inclTitle: 'Що входить у тур',
  inclYes: 'Входить у вартість',
  inclNo:  'Оплачується окремо',
  inclYesList: [
    'Груповий переліт Катовіце — Фуншал — Катовіце',
    'Індивідуальний трансфер аеропорт — готель — аеропорт',
    '7 ночей у готелі у Фуншалі, розміщення у 2- або 3-місних номерах',
    'Сніданки щодня в готелі',
    'Виїзні екскурсії за програмою: захід острова, схід острова, Фуншал, Камара-де-Лобуш',
    'Супровід керівника групи протягом усього туру'
  ],
  inclNoList: [
    'Обіди та вечері (вечері — за бажанням усієї групи, у ресторанах міста)',
    'Вхід до пляжних комплексів: басейни Лідо, міський пляж Фуншала, окремі пляжі',
    'Страхування, особисті витрати й сувеніри',
    'Дегустації та напої понад програму'
  ],
  inclNote: 'Точний перелік послуг, вартість і умови бронювання менеджер надсилає у відповідь на заявку — щоб порахувати саме під ваш склад групи й тип номера.',

  hostTitle: 'Хто веде тур',

  reviewsTitle: 'Що кажуть наші туристи',
  reviewsLead:  'Відгуки людей, які вже їздили з нами.',

  faqTitle: 'Часті питання',
  faq: [
    { q:'Звідки виліт і чи можна приєднатися з іншого міста?',
      a:'Груповий переліт — з Катовіце (Польща): виліт 27 жовтня о 07:10, повернення 3 листопада о 18:05. Якщо ви летите зі США або з іншого міста, напишіть про це у формі — менеджер підбере стикування й підкаже, як приєднатися до групи.' },
    { q:'Який документ потрібен для в\'їзду?',
      a:'Мадейра — автономний регіон Португалії, тобто Шенгенська зона. Потрібен закордонний паспорт, дійсний щонайменше 3 місяці після дати повернення. Актуальні візові вимоги для вашого громадянства менеджер перевірить під час бронювання.' },
    { q:'Яка погода наприкінці жовтня?',
      a:'Мадейру називають островом вічної весни: наприкінці жовтня — початку листопада тут зазвичай тепло, океан ще придатний для купання. У горах, зокрема на Піку Арейро, помітно прохолодніше й вітряно, тож знадобиться вітрівка.' },
    { q:'Наскільки фізично складна програма?',
      a:'Тур розрахований на звичайний рівень підготовки. Найактивніша частина — прогулянка левадою та підйом на оглядові майданчики; це рівні або пологі стежки, без альпіністських навичок. Потрібне лише зручне взуття.' },
    { q:'Як розміщують у номерах, якщо я їду сам або сама?',
      a:'Розміщення — у 2- або 3-місних номерах. Якщо ви їдете без пари, ми підбираємо сусіда чи сусідку з групи; варіант одномісного розміщення менеджер прорахує окремо.' },
    { q:'Що робити у вільні дні?',
      a:'У програмі два вільних дні — 30 жовтня і 2 листопада. Можна поїхати на пляж, залишитися біля басейну готелю або взяти додаткову активність: керівник групи підкаже варіанти на місці.' },
    { q:'Що буде після того, як я залишу заявку?',
      a:'Менеджер зв\'яжеться з вами зручним каналом, надішле повну програму з вартістю, розповість про умови бронювання і відповість на питання. Заявка ні до чого вас не зобов\'язує.' }
  ],

  formTitle: 'Залишити заявку на тур',
  formLead:  'Заповніть форму — менеджер зв\'яжеться з вами, надішле повну програму з вартістю та умовами бронювання. Заявка ні до чого не зобов\'язує.',
  fName:  'Ім\'я',
  fNameP: 'Як до вас звертатися',
  fPhone: 'Телефон',
  fPhoneP:'+380 або +1',
  fFrom:  'Звідки плануєте летіти',
  fFromOpts: [ ['','Оберіть варіант'], ['ua','З України'], ['us','Зі США'], ['pl','Уже буду в Польщі'], ['other','Інше — напишу в коментарі'] ],
  fPeople:'Скільки осіб',
  fPeopleP:'Наприклад: 2 дорослих',
  fNote:  'Коментар',
  fNoteP: 'Питання, побажання щодо номера, дати вильоту',
  fOptional: 'необов\'язково',
  fConsent:'Даю згоду на обробку моїх персональних даних відповідно до {privacy} та {consent}.',
  fConsentPrivacy:'Політики конфіденційності',
  fConsentDoc:'Згоди на обробку персональних даних',
  fMarketing:'Хочу отримувати новини про нові тури та акції (необов\'язково).',
  fSubmit:'Надіслати заявку',
  fSending:'Надсилаємо…',

  errName:  'Напишіть, будь ласка, ім\'я',
  errPhone: 'Вкажіть телефон із кодом країни, наприклад +380671234567',
  errConsent:'Без згоди на обробку даних ми не можемо прийняти заявку',
  okTitle:  'Заявка прийнята',
  okText:   'Менеджер зв\'яжеться з вами найближчим робочим днем і надішле повну програму з вартістю.',
  errTitle: 'Заявка не відправилася',
  errText:  'Схоже, пропав зв\'язок. Спробуйте ще раз за хвилину або напишіть нам у месенджер — ваші дані у формі збереглися.',
  errNoEndpoint: 'Форма ще не підключена до отримувача заявок. Напишіть нам, будь ласка, у месенджер або на пошту — контакти поруч із формою.',

  contactsTitle: 'Або напишіть напряму',
  contactsLead:  'Відповідаємо в робочі години. Розкажемо про тур, порахуємо вартість і допоможемо з перельотом.',
  cPhoneUa:'Телефон, Україна',
  cPhoneUs:'Телефон, США',
  cEmail:'Пошта',
  cTelegram:'Telegram',
  cWhatsapp:'WhatsApp',
  cInstagram:'Instagram',
  contactsEmpty:'Контакти зараз оновлюються. Скористайтеся, будь ласка, формою заявки.',

  ftrAbout:'Авторські тури для невеликих груп. Мадейра, 27 жовтня — 3 листопада 2026.',
  ftrDocs:'Документи',
  ftrPrivacy:'Політика конфіденційності',
  ftrConsent:'Згода на обробку персональних даних',
  ftrContacts:'Контакти',
  ftrRights:'Усі права захищені.',
  ftrNote:'Сайт не є публічною офертою. Вартість і умови туру менеджер надсилає у відповідь на заявку.',

  backHome:'На головну'
},

/* ============================ E N G L I S H ============================== */
en: {
  htmlLang: 'en',
  metaTitle: 'Madeira Small-Group Tour · October 27 — November 3, 2026 · Globustour',
  metaDesc:  'Eight days on Madeira with a small Ukrainian-speaking group: Funchal, Porto Moniz, Pico do Arieiro, levada walks, Câmara de Lobos, the ocean and tastings. Group flight from Katowice on Oct 27, 2026.',

  nav: { about:'The tour', program:'Itinerary', includes:'What\'s included', reviews:'Reviews', faq:'FAQ', form:'Request' },
  navCta: 'Request a spot',

  heroBadge: 'October 27 — November 3, 2026',
  heroTitle: 'Madeira: 8 days on the island of eternal spring with a small Ukrainian-speaking group',
  heroLead:  'The Atlantic in November, mountains above the clouds, levada trails through laurel forest and dinners with the whole group. We handle the flight, the hotel, the transfers and the route — you pack the suitcase.',
  heroCta:   'Request a spot on the tour',
  heroCta2:  'See the day-by-day itinerary',
  heroNote:  'The group is small. A manager will get in touch and send you the full itinerary, the price and the booking terms.',
  heroTagT:  'Funchal, Madeira',
  heroTagS:  '7 nights at the hotel · breakfast every day',

  facts: [
    { b:'8 days',           s:'7 nights on the island' },
    { b:'Katowice — Funchal',s:'group flight' },
    { b:'Funchal',          s:'one hotel for the whole tour' },
    { b:'Twin & triple rooms',s:'accommodation' },
    { b:'4 excursion days', s:'and 2 free days' },
    { b:'Ukrainian-speaking',s:'guide with the group throughout' }
  ],

  aboutTitle: 'Madeira in eight days — without the rush',
  aboutText1: 'Madeira is a Portuguese island in the Atlantic, some 500 km off Morocco. It is around 22 °C in November, the volcanoes are covered in laurel forest, and footpaths run for hours alongside the mountain irrigation channels known as levadas.',
  aboutText2: 'The route is built so that you see both coasts and the mountains without living on a bus: four days with excursions, two free days by the ocean and one calm day to say goodbye to the island.',
  aboutPoints: [
    { b:'The west and the east',   s:'Porto Moniz with its glass-floor viewpoint 580 m above the ocean, and Pico do Arieiro, one of the island\'s highest peaks.' },
    { b:'Levadas and laurel forest',s:'A walk along one of the most scenic levadas — through the same greenery that put Madeira\'s laurisilva on the UNESCO list.' },
    { b:'The taste of the island', s:'Madeira wine in a Funchal wine cellar, poncha in Câmara de Lobos, rum in Porto da Cruz, passion fruit and mango at the city market.' },
    { b:'Ocean and beaches',       s:'Praia Formosa, the natural lava pools of Porto Moniz and two free days to simply lie in the sun.' },
    { b:'Dinners with the group',  s:'Optional group dinners in town, including on the famous painted-doors street and a farewell dinner on the last evening.' }
  ],

  programTitle: 'Day-by-day itinerary',
  programLead:  'Excursions run as a group with a guide. Dinners are optional, decided by the group, and paid separately.',
  days: [
    { d:'Tue, Oct 27, 2026', t:'Flight out and first meeting with the island', p:[
      '07:10 — departure for Madeira. 11:25 — arrival, private transfer to the hotel. Check-in to twin or triple rooms after 14:00.',
      'The afternoon is yours: stay by the pool or head to Funchal city beach (entry paid separately).',
      'A welcome dinner in a restaurant in town — optional, decided by the group.'
    ]},
    { d:'Wed, Oct 28, 2026', t:'Funchal: the promenade, the market and Madeira wine', p:[
      'Breakfast at the hotel. Today we get to know the capital of Madeira: a walk along the promenade, through the quiet streets of the old town and into the famous city market.',
      'At the market we taste the island\'s exotic fruit — several kinds of passion fruit, pineapple, mango, banana, papaya and other local produce. This is the best place to feel the island\'s everyday life.',
      'Then a tasting of local wines in a wine cellar, with an introduction to Madeira\'s winemaking traditions.',
      'The afternoon can be spent on the beach or by the ocean. Optionally, the Lido pool complex (entry paid separately). Dinner in a restaurant in town — optional, decided by the group.'
    ]},
    { d:'Thu, Oct 29, 2026', t:'The west coast: Porto Moniz and the glass viewpoint', p:[
      'Breakfast at the hotel. Straight after breakfast we head for the west coast. You will learn why Winston Churchill chose this fishing village for his holidays, hear about the traditional hunt for the espada fish and see a unique fishermen\'s chapel.',
      'On the walk we pass the famous "street of men", see an unusual art project built from recycled waste and try one of the island\'s best morning cocktails.',
      'Next comes the westernmost point of Europe: a viewing platform with a glass floor 580 metres above sea level, looking out over the ocean and the sheer cliffs.',
      'After that we walk through the laurel forest and swim in the natural lava pools of Porto Moniz. Lunch is at a restaurant right on the ocean, with fresh seafood on the table.',
      'On the way back we make a wish at one of the island\'s places of power and stop for photos by a waterfall. Dinner — optional, decided by the group — on the famous painted-doors street.'
    ]},
    { d:'Fri, Oct 30, 2026', t:'A free day by the ocean', p:[
      'Breakfast at the hotel. The day is free.',
      'If you like, we head to one of the beaches near Funchal — entry to some beach complexes is paid separately. Or stay at the hotel: the sun and the pool are not going anywhere.',
      'Dinner in a restaurant — optional, decided by the group.'
    ]},
    { d:'Sat, Oct 31, 2026', t:'The east: Pico do Arieiro, a levada walk and Santana', p:[
      'Breakfast at the hotel. Today we travel through the eastern part of Madeira. First we climb Pico do Arieiro, one of the island\'s highest peaks, with panoramic views over the ridges and the clouds drifting below your feet.',
      'Then a walk along one of the most scenic levadas on the island, through Madeira\'s dense greenery and mountain landscapes.',
      'Next we visit Santana, a small town known for its traditional triangular houses with thatched roofs — one of the island\'s symbols. After that, Porto da Cruz for a tasting of local rum and the story of how it is made.',
      'We finish the day at the Ponta do Rosto viewpoint, one of the most beautiful spots on Madeira, looking over the cliffs, the Atlantic and the eastern coast. Back to the hotel; dinner with the group is optional.'
    ]},
    { d:'Sun, Nov 1, 2026', t:'Câmara de Lobos and Praia Formosa beach', p:[
      'Breakfast at the hotel. After breakfast we head to the picturesque fishing village of Câmara de Lobos. Here we feel the atmosphere of traditional Madeira, visit relatives of Cristiano Ronaldo and try real poncha, the famous local drink.',
      'Then time on one of Madeira\'s best beaches, the Praia Formosa complex, to top up on sunshine and vitamin D.',
      'Dinner in a restaurant — optional, decided by the group.'
    ]},
    { d:'Mon, Nov 2, 2026', t:'A free day and the farewell dinner', p:[
      'Breakfast at the hotel. A free day: if you like, we go to the beach to enjoy the warm ocean, the sun and the atmosphere of Madeira one more time.',
      'In the evening — a farewell dinner for the whole group: a chance to share impressions, remember the brightest moments and spend the last evening on the island in good company.'
    ]},
    { d:'Tue, Nov 3, 2026', t:'Heading home', p:[
      'Breakfast at the hotel. Then check-out and the transfer to the airport. Time to say goodbye to the island.',
      '12:05 — departure for Katowice. 18:05 — arrival in Katowice.',
      'Until the next trip.'
    ]}
  ],

  inclTitle: 'What the tour includes',
  inclYes: 'Included in the price',
  inclNo:  'Paid separately',
  inclYesList: [
    'Group flight Katowice — Funchal — Katowice',
    'Private transfer airport — hotel — airport',
    '7 nights at a hotel in Funchal, twin or triple rooms',
    'Breakfast every day at the hotel',
    'Excursions per the itinerary: the west of the island, the east, Funchal, Câmara de Lobos',
    'A group leader with you throughout the tour'
  ],
  inclNoList: [
    'Lunches and dinners (dinners are optional, in restaurants in town)',
    'Entry to beach complexes: Lido pools, Funchal city beach, some other beaches',
    'Insurance, personal expenses and souvenirs',
    'Tastings and drinks beyond the itinerary'
  ],
  inclNote: 'The exact list of services, the price and the booking terms are sent by a manager in reply to your request — so the numbers match your group and room type.',

  hostTitle: 'Who leads the tour',

  reviewsTitle: 'What our travellers say',
  reviewsLead:  'Reviews from people who have already travelled with us.',

  faqTitle: 'Frequently asked questions',
  faq: [
    { q:'Where does the flight leave from, and can I join from another city?',
      a:'The group flight departs from Katowice, Poland: out on October 27 at 07:10, back on November 3 at 18:05. If you are flying from the US or from another city, say so in the form — a manager will look for connections and explain how to join the group.' },
    { q:'What documents do I need?',
      a:'Madeira is an autonomous region of Portugal, so it is inside the Schengen area. You need a passport valid for at least 3 months beyond your return date. A manager will check the current visa requirements for your citizenship when you book.' },
    { q:'What is the weather like in late October?',
      a:'Madeira is called the island of eternal spring: in late October and early November it is usually warm and the ocean is still comfortable for swimming. In the mountains, and on Pico do Arieiro in particular, it is noticeably cooler and windy, so bring a windbreaker.' },
    { q:'How physically demanding is the itinerary?',
      a:'The tour is built for an ordinary fitness level. The most active parts are the levada walk and the viewpoints; these are flat or gently sloping paths with no climbing skills required. Comfortable shoes are all you need.' },
    { q:'How are rooms arranged if I travel alone?',
      a:'Accommodation is in twin or triple rooms. If you travel without a partner, we match you with someone from the group; a single-room option can be quoted separately.' },
    { q:'What is there to do on the free days?',
      a:'There are two free days — October 30 and November 2. You can go to the beach, stay by the hotel pool, or add an activity: the group leader will suggest options on the spot.' },
    { q:'What happens after I send the request?',
      a:'A manager will contact you through your preferred channel, send the full itinerary with the price, explain the booking terms and answer your questions. Sending the request does not commit you to anything.' }
  ],

  formTitle: 'Request a spot on the tour',
  formLead:  'Fill in the form and a manager will get in touch, send the full itinerary with the price and the booking terms. Sending the request commits you to nothing.',
  fName:  'Name',
  fNameP: 'What should we call you',
  fPhone: 'Phone',
  fPhoneP:'+380 or +1',
  fFrom:  'Where will you fly from',
  fFromOpts: [ ['','Choose an option'], ['ua','From Ukraine'], ['us','From the US'], ['pl','I will already be in Poland'], ['other','Other — I will explain in the comment'] ],
  fPeople:'How many people',
  fPeopleP:'For example: 2 adults',
  fNote:  'Comment',
  fNoteP: 'Questions, room preferences, departure date',
  fOptional: 'optional',
  fConsent:'I consent to the processing of my personal data in accordance with the {privacy} and the {consent}.',
  fConsentPrivacy:'Privacy Policy',
  fConsentDoc:'Consent to Personal Data Processing',
  fMarketing:'I would like to receive news about new tours and offers (optional).',
  fSubmit:'Send the request',
  fSending:'Sending…',

  errName:  'Please tell us your name',
  errPhone: 'Enter a phone number with the country code, for example +380671234567',
  errConsent:'Without consent to data processing we cannot accept the request',
  okTitle:  'Request received',
  okText:   'A manager will contact you on the next working day and send the full itinerary with the price.',
  errTitle: 'The request did not go through',
  errText:  'The connection seems to have dropped. Try again in a minute or message us — everything you typed is still in the form.',
  errNoEndpoint: 'The form is not connected to a recipient yet. Please message us or send an email — the contacts are next to the form.',

  contactsTitle: 'Or write to us directly',
  contactsLead:  'We reply during working hours. We will tell you about the tour, quote the price and help with the flight.',
  cPhoneUa:'Phone, Ukraine',
  cPhoneUs:'Phone, US',
  cEmail:'Email',
  cTelegram:'Telegram',
  cWhatsapp:'WhatsApp',
  cInstagram:'Instagram',
  contactsEmpty:'Our contact details are being updated. Please use the request form.',

  ftrAbout:'Small-group author-led tours. Madeira, October 27 — November 3, 2026.',
  ftrDocs:'Documents',
  ftrPrivacy:'Privacy Policy',
  ftrConsent:'Consent to Personal Data Processing',
  ftrContacts:'Contacts',
  ftrRights:'All rights reserved.',
  ftrNote:'This website is not a public offer. The price and terms of the tour are sent by a manager in reply to your request.',

  backHome:'Back to the homepage'
}
};
