import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { AtualizarLivroInput, CriarLivroInput, Livro } from "@/models/Livro";
import { LivrosService } from "@/services/livros.service";
import { ApiError } from "@/services/api";

export function useLivrosViewModel() {
  const qc = useQueryClient();
  const [genero, setGenero] = useState<string>("");

  const query = useQuery({
    queryKey: ["livros", genero || "todos"],
    queryFn: () => LivrosService.listar(genero || undefined),
  });

  const criar = useMutation({
    mutationFn: (input: CriarLivroInput) => LivrosService.criar(input),
    onSuccess: () => {
      toast.success("Livro cadastrado com sucesso");
      qc.invalidateQueries({ queryKey: ["livros"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: ApiError) => toast.error(e.message),
  });

  const atualizar = useMutation({
    mutationFn: ({ id, input }: { id: number; input: AtualizarLivroInput }) =>
      LivrosService.atualizar(id, input),
    onSuccess: () => {
      toast.success("Livro atualizado");
      qc.invalidateQueries({ queryKey: ["livros"] });
    },
    onError: (e: ApiError) => toast.error(e.message),
  });

  const excluir = useMutation({
    mutationFn: (id: number) => LivrosService.excluir(id),
    onSuccess: () => {
      toast.success("Livro excluído");
      qc.invalidateQueries({ queryKey: ["livros"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: ApiError) =>
      toast.error(
        e.status === 400 || e.status === 409
          ? "Não é possível excluir um livro que está emprestado."
          : e.message,
      ),
  });

  return {
    livros: (query.data ?? []) as Livro[],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    genero,
    setGenero,
    criar,
    atualizar,
    excluir,
  };
}