import { createFileRoute } from "@tanstack/react-router";
import html from "../../public/stk/main.html?raw";

export const Route = createFileRoute("/")({
  server: {
    handlers: {
      GET: () => new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } }),
    },
  },
});
