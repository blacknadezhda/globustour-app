/**
 * Приймач заявок з лендингу Мадейри → повідомлення в Telegram.
 * Cloudflare Worker, безкоштовний тариф. Розгортання — див. README.md, крок 1.
 *
 * Змінні оточення (Settings → Variables, обидві як Secret):
 *   BOT_TOKEN  — токен бота від @BotFather
 *   CHAT_ID    — ваш chat_id або id групи менеджерів
 *   ALLOW_ORIGIN — домен сайту, наприклад https://globustourniko.com.ua
 *                  (можна не задавати — тоді приймаються заявки з будь-якого домену)
 */

const RATE = new Map();          // проста заслінка від спаму: 5 заявок з IP за 10 хвилин
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allow = env.ALLOW_ORIGIN || '*';
    const cors = {
      'Access-Control-Allow-Origin': allow === '*' ? '*' : (origin === allow ? origin : allow),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, cors);

    if (!env.BOT_TOKEN || !env.CHAT_ID) return json({ error: 'not_configured' }, 500, cors);

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (isRateLimited(ip)) return json({ error: 'too_many_requests' }, 429, cors);

    let data;
    try { data = await request.json(); } catch { return json({ error: 'bad_json' }, 400, cors); }

    // Мінімальна перевірка на боку сервера — браузерній валідації не можна вірити.
    const name = str(data.name, 80);
    const phone = str(data.phone, 40);
    if (name.length < 2 || !/^\+?[\d\s()-]{9,20}$/.test(phone)) return json({ error: 'bad_input' }, 400, cors);
    if (data.consent !== true) return json({ error: 'no_consent' }, 400, cors);

    const lines = [
      '<b>Нова заявка · Мадейра 27.10–03.11.2026</b>',
      '',
      `<b>Ім'я:</b> ${esc(name)}`,
      `<b>Телефон:</b> ${esc(phone)}`
    ];
    if (data.fromLabel) lines.push(`<b>Виліт:</b> ${esc(str(data.fromLabel, 60))}`);
    if (data.people)    lines.push(`<b>Осіб:</b> ${esc(str(data.people, 40))}`);
    if (data.note)      lines.push(`<b>Коментар:</b> ${esc(str(data.note, 1000))}`);
    lines.push('');
    lines.push(`<b>Мова сайту:</b> ${data.lang === 'en' ? 'англійська' : 'українська'}`);
    lines.push(`<b>Розсилка:</b> ${data.marketing ? 'згоден отримувати' : 'ні'}`);
    lines.push(`<b>Згода на обробку ПД:</b> так, ${esc(str(data.consentAt, 40))} (версія ${esc(str(data.consentVersion, 20))})`);

    const tg = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.CHAT_ID,
        text: lines.join('\n'),
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    if (!tg.ok) return json({ error: 'delivery_failed' }, 502, cors);
    return json({ ok: true }, 200, cors);
  }
};

function isRateLimited(ip) {
  const now = Date.now();
  const hits = (RATE.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS);
  hits.push(now);
  RATE.set(ip, hits);
  return hits.length > RATE_MAX;
}

function str(v, max) { return typeof v === 'string' ? v.trim().slice(0, max) : ''; }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' }
  });
}
