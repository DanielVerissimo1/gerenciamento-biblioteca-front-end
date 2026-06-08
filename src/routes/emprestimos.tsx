import { createFileRoute } from "@tanstack/react-router";
import { EmprestimosView } from "@/views/EmprestimosView";

export const Route = createFileRoute("/emprestimos")({
  head: () => ({
    meta: [
      { title: "Empréstimos — Athenaeum" },
      { name: "description", content: "Registre empréstimos e devoluções da biblioteca." },
    ],
  }),
  component: EmprestimosView,
});