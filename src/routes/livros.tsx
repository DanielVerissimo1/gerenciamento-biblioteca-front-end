import { createFileRoute } from "@tanstack/react-router";
import { LivrosView } from "@/views/LivrosView";

export const Route = createFileRoute("/livros")({
  head: () => ({
    meta: [
      { title: "Acervo — Athenaeum" },
      { name: "description", content: "Catalogue e gerencie os livros da biblioteca." },
    ],
  }),
  component: LivrosView,
});
