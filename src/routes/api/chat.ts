import { createFileRoute } from "@tanstack/react-router";
import { STK_SYSTEM_PROMPT } from "../../lib/stk-knowledge";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/responses";
const MODEL = "openai/gpt-6-astra";
const MAX_HISTORY = 40;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function sanitizeMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input)) return null;
  const messages: ChatMessage[] = [];
  for (const item of input.slice(-MAX_HISTORY)) {
    if (
      item &&
      typeof item === "object" &&
      ((item as ChatMessage).role === "user" || (item as ChatMessage).role === "assistant") &&
      typeof (item as ChatMessage).content === "string" &&
      (item as ChatMessage).content.trim().length > 0
    ) {
      messages.push({
        role: (item as ChatMessage).role,
        content: (item as ChatMessage).content.slice(0, 4000),
      });
    }
  }
  const last = messages[messages.length - 1];
  return last && last.role === "user" ? messages : null;
}

async function callGateway(apiKey: string, messages: ChatMessage[]): Promise<Response> {
  return fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      instructions: STK_SYSTEM_PROMPT,
      input: messages.map((m) => ({ role: m.role, content: m.content })),
      store: false,
      stream: true,
      reasoning: { effort: "low" },
    }),
  });
}

// Consume the SSE stream and return the assembled assistant text.
async function readStreamedText(response: Response): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const event = JSON.parse(payload) as {
          type?: string;
          delta?: string;
          response?: { output_text?: string };
        };
        if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
          text += event.delta;
        } else if (event.type === "response.completed" && !text && event.response?.output_text) {
          text = event.response.output_text;
        }
      } catch {
        // Ignore non-JSON keep-alive lines.
      }
    }
  }
  return text.trim();
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { messages?: unknown };
        try {
          body = (await request.json()) as { messages?: unknown };
        } catch {
          return json({ error: "Некорректный запрос." }, 400);
        }

        const messages = sanitizeMessages(body.messages);
        if (!messages) return json({ error: "Пустое сообщение." }, 400);

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return json({ error: "Ассистент временно недоступен. Позвоните нам: 8 904 347-03-77." }, 500);
        }

        let upstream: Response;
        try {
          upstream = await callGateway(apiKey, messages);
        } catch {
          return json({ error: "Не удалось связаться с ассистентом. Попробуйте ещё раз." }, 502);
        }

        if (!upstream.ok) {
          console.error("chat gateway error", upstream.status, await upstream.text().catch(() => ""));
          if (upstream.status === 429) {
            return json({ error: "Ассистент сейчас перегружен. Попробуйте через минуту." }, 429);
          }
          return json(
            { error: "Ассистент временно недоступен. Позвоните нам: 8 904 347-03-77 или 8 918 556-54-16." },
            502,
          );
        }

        const reply = await readStreamedText(upstream);
        if (!reply) {
          return json({ error: "Ассистент не смог ответить. Попробуйте переформулировать вопрос." }, 502);
        }
        return json({ reply });
      },
    },
  },
});
