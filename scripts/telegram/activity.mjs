// Обновляет src/content/activity.json по событиям Telegram Bot API (getUpdates).
// Записывается только дата последнего сообщения в чате, контент не копируется
// (advisory: Telegram — источник событий, а не хранилище).
// Нужен секрет TELEGRAM_BOT_TOKEN; бот должен быть админом канала/группы из activity.json.
// Выход: печатает changed=true|false для GitHub Actions.
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';

const FILE = 'src/content/activity.json';
const token = process.env.TELEGRAM_BOT_TOKEN;
const setOutput = (k, v) => process.env.GITHUB_OUTPUT && appendFileSync(process.env.GITHUB_OUTPUT, `${k}=${v}\n`);

if (!token) {
  console.log('TELEGRAM_BOT_TOKEN не задан: пропускаю.');
  setOutput('changed', 'false');
  process.exit(0);
}

const api = async (method, params = {}) => {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(params),
    signal: AbortSignal.timeout(20000),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(`${method}: ${json.description}`);
  return json.result;
};

const activity = JSON.parse(readFileSync(FILE, 'utf8'));
const byChat = new Map(Object.entries(activity).map(([id, v]) => [v.chat.toLowerCase(), id]));

const updates = await api('getUpdates', {
  timeout: 0,
  allowed_updates: ['message', 'edited_message', 'channel_post', 'edited_channel_post'],
});

let changed = false;
let lastUpdateId;
for (const u of updates) {
  lastUpdateId = u.update_id;
  const msg = u.message ?? u.edited_message ?? u.channel_post ?? u.edited_channel_post;
  const username = msg?.chat?.username?.toLowerCase();
  const id = username && byChat.get(username);
  if (!id) continue;
  const date = new Date((msg.edit_date ?? msg.date) * 1000).toISOString();
  if (!activity[id].lastActivity || date > activity[id].lastActivity) {
    activity[id].lastActivity = date;
    changed = true;
  }
}

// Подтверждаем обработанные события, чтобы очередь Telegram не росла.
if (lastUpdateId !== undefined) await api('getUpdates', { offset: lastUpdateId + 1, timeout: 0 });

if (changed) writeFileSync(FILE, JSON.stringify(activity, null, 2) + '\n');
console.log(`updates=${updates.length} changed=${changed}`);
setOutput('changed', String(changed));
