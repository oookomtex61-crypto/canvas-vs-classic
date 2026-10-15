import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ href: "/stk/main.html#home" });
  },
  head: () => ({
    meta: [
      { title: "СТК — техника в рабочем ритме" },
      { name: "description", content: "СТК — ремонт оргтехники, заправка картриджей и обслуживание кассовой техники." },
      { property: "og:title", content: "СТК — техника в рабочем ритме" },
      { property: "og:description", content: "Ремонт оргтехники, заправка картриджей и обслуживание кассовой техники." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
