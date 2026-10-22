import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE = 'stk-chat-session';
function signature(value: string) {
  const key = process.env['STK_CHAT_SESSION_SECRET'];
  if (!key) throw new Error('Chat session unavailable');
  return createHmac('sha256', key).update(value).digest('hex');
}
export function createChatCookie(request: Request): string {
  const value = `${crypto.randomUUID()}.${Date.now() + 86400000}`;
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${COOKIE}=${value}.${signature(value)}; Path=/api/chat; HttpOnly; SameSite=Strict; Max-Age=86400${secure}`;
}
export function verifyChatSession(request: Request): string | null {
  const cookie = request.headers.get('cookie')?.split(';').map(x => x.trim()).find(x => x.startsWith(`${COOKIE}=`));
  if (!cookie) return null;
  const [id, expiry, sig] = cookie.slice(COOKIE.length + 1).split('.');
  if (!id || !expiry || !sig || !/^[0-9a-f-]{36}$/.test(id) || !/^[0-9a-f]{64}$/.test(sig) || Number(expiry) <= Date.now()) return null;
  const expected = signature(`${id}.${expiry}`);
  return timingSafeEqual(Buffer.from(sig), Buffer.from(expected)) ? id : null;
}