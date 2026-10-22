import { createFileRoute } from "@tanstack/react-router";
import html from "../../public/stk/main.html?raw";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: 'СТК — сервис техники в Таганроге' },
    { name: 'description', content: 'СТК: ремонт оргтехники, кассовой техники и заправка картриджей в Таганроге. Консультация Фиксика и заявки специалисту.' },
    { property: 'og:title', content: 'СТК — сервис техники в Таганроге' },
    { property: 'og:description', content: 'Ремонт оргтехники, обслуживание касс и заправка картриджей. Свяжитесь со специалистом СТК.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  server: {
    handlers: {
      GET: () => new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } }),
    },
  },
});
