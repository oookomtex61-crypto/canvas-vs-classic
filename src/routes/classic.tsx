import { createFileRoute } from "@tanstack/react-router";
import html from "../../public/stk/classic/main.html?raw";

export const Route = createFileRoute("/classic")({
  server: {
    handlers: {
      GET: () => new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } }),
    },
  },
});
