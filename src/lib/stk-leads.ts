import { z } from 'zod';

const field = z.string().trim().min(1).max(500);
export const leadSchema = z.object({
  type: field.max(120), name: field.max(120), contact: field.max(200),
  date: field.max(120), address: field, description: field.max(1500), comment: field,
});
export type StkLead = z.infer<typeof leadSchema>;
export const DELIVERY_CONFIRMATION = 'Спасибо, я собрал заявку и передаю ее нашему специалисту. Он свяжется с вами лично.';
export const DELIVERY_FAILURE = 'Не удалось подтвердить передачу заявки в MAX. Пожалуйста, свяжитесь со специалистом: 8 904 347-03-77 или 8 918 556-54-16.';

export function formatLead(lead: StkLead, now = new Date()): string {
  return `Новая заявка\n\nТип: ${lead.type}\n\nКлиент: ${lead.name}\n\nКонтакт: ${lead.contact}\n\nДата: ${now.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}\n\nМесто/адрес: ${lead.address}\n\nЧто нужно: ${lead.description}\n\nКомментарий: Желаемая дата: ${lead.date}. ${lead.comment}`;
}

export async function sendLeadToMax(token: string, lead: StkLead, fetcher: typeof fetch = fetch): Promise<string> {
  const response = await fetcher('https://platform-api.max.ru/messages?user_id=170773285', {
    method: 'POST', headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: formatLead(lead) }), signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('MAX delivery rejected');
  const result = await response.json() as { message?: { body?: { mid?: string } }; body?: { mid?: string } };
  const mid = result.message?.body?.mid ?? result.body?.mid;
  if (!mid) throw new Error('MAX delivery unconfirmed');
  return mid;
}