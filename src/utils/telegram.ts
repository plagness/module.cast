const BOT_TOKEN = import.meta.env.VITE_TG_BOT_TOKEN as string | undefined
const CHAT_ID = import.meta.env.VITE_TG_CHAT_ID as string | undefined

export interface BookingData {
  name: string
  phone: string
  telegram: string
  date: string
  services: string
  total: string
  message: string
}

export async function sendBooking(data: BookingData): Promise<boolean> {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn('Telegram bot not configured')
    return false
  }

  const text = [
    `🎙 <b>Новая заявка module.cast</b>`,
    ``,
    `<b>Имя:</b> ${esc(data.name)}`,
    `<b>Телефон:</b> ${esc(data.phone)}`,
    `<b>Telegram:</b> ${esc(data.telegram)}`,
    `<b>Дата:</b> ${esc(data.date)}`,
    `<b>Услуги:</b> ${esc(data.services)}`,
    `<b>Сумма:</b> ${esc(data.total)} ₽`,
    data.message ? `<b>Комментарий:</b> ${esc(data.message)}` : '',
  ].filter(Boolean).join('\n')

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' }),
  })
  return res.ok
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
