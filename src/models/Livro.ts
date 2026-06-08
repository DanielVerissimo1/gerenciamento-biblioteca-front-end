export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  disponivel: number;
  created_at: string;
  updated_at: string;
}

export interface CriarLivroInput {
  titulo: string;
  autor: string;
  genero: string;
}

export type AtualizarLivroInput = CriarLivroInput;