import { describe, expect, it, vi } from 'vitest';
import { formatLead, leadSchema, sendLeadToMax } from '../lib/stk-leads';

const lead = { type: 'Ремонт оргтехники', name: 'Тест подключения', contact: 'test@example.com', date: 'Без предпочтений', address: 'Привезу в СТК', description: 'Тестовая заявка — выполнять не нужно', comment: 'Без дополнительных пожеланий' };
describe('MAX lead delivery', () => {
  it('requires every collected application detail', () => {
    for (const field of Object.keys(lead)) expect(leadSchema.safeParse({ ...lead, [field]: '' }).success).toBe(false);
  });
  it('formats the requested MAX fields with actual Moscow date', () => {
    expect(formatLead(lead, new Date('2026-10-22T01:47:00Z'))).toBe('Новая заявка\n\nТип: Ремонт оргтехники\n\nКлиент: Тест подключения\n\nКонтакт: test@example.com\n\nДата: 22.10.2026, 04:47:00\n\nМесто/адрес: Привезу в СТК\n\nЧто нужно: Тестовая заявка — выполнять не нужно\n\nКомментарий: Желаемая дата: Без предпочтений. Без дополнительных пожеланий');
  });
  it('only confirms delivery when MAX returns a message ID', async () => {
    const fake = vi.fn().mockResolvedValue(Response.json({ message: { body: { mid: 'test-message' } } }));
    await expect(sendLeadToMax('test-only', lead, fake)).resolves.toBe('test-message');
    expect(fake.mock.calls[0]?.[0]).toBe('https://platform-api.max.ru/messages?user_id=170773285');
  });
  it('does not claim success for a failed or unconfirmed response', async () => {
    await expect(sendLeadToMax('test-only', lead, vi.fn().mockResolvedValue(Response.json({ success: true })))).rejects.toThrow('unconfirmed');
    await expect(sendLeadToMax('test-only', lead, vi.fn().mockResolvedValue(new Response(null, { status: 403 })))).rejects.toThrow('rejected');
  });
});