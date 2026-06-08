import { createFileRoute } from "@tanstack/react-router";
import { DashboardView } from "@/views/DashboardView";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Biblioteca" },
      { name: "description", content: "Sistema elegante de gerenciamento de biblioteca." },
      { property: "og:title", content: "Biblioteca" },
      { property: "og:description", content: "Sistema elegante de gerenciamento de biblioteca." },
    ],
  }),
  component: DashboardView,
});
