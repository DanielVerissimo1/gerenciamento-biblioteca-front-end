import type { AtualizarLivroInput, CriarLivroInput, Livro } from "@/models/Livro";
import { apiFetch } from "./api";

export const LivrosService = {
  listar(genero?: string): Promise<Livro[]> {
    const qs = genero ? `?genero=${encodeURIComponent(genero)}` : "";
    return apiFetch<Livro[]>(`/livros${qs}`);
  },
  obter(id: number): Promise<Livro> {
    return apiFetch<Livro>(`/livros/${id}`);
  },
  criar(input: CriarLivroInput): Promise<Livro> {
    return apiFetch<Livro>(`/livros`, { method: "POST", body: JSON.stringify(input) });
  },
  atualizar(id: number, input: AtualizarLivroInput): Promise<Livro> {
    return apiFetch<Livro>(`/livros/${id}`, { method: "PATCH", body: JSON.stringify(input) });
  },
  excluir(id: number): Promise<void> {
    return apiFetch<void>(`/livros/${id}`, { method: "DELETE" });
  },
};