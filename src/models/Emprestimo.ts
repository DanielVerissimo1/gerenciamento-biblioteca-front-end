export interface Emprestimo {
  id: number;
  livro_id: number;
  nome_aluno: string;
  data_emprestimo: string;
  devolvido: number;
  created_at: string;
  updated_at: string;
}

export interface CriarEmprestimoInput {
  livroId: number;
  nomeAluno: string;
}