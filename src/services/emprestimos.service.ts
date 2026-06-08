import type { CriarEmprestimoInput, Emprestimo } from "@/models/Emprestimo";
import { apiFetch } from "./api";

export const EmprestimosService = {
  listar(): Promise<Emprestimo[]> {
    return apiFetch<Emprestimo[]>(`/emprestimos`);
  },
  
  criar(input: CriarEmprestimoInput): Promise<Emprestimo> {
    return apiFetch<Emprestimo>(`/emprestimos`, { method: "POST", body: JSON.stringify(input) });
  },

  devolver(id: number): Promise<Emprestimo> {
    return apiFetch<Emprestimo>(`/emprestimos/${id}/devolver`, { method: "PATCH" });
  },
};