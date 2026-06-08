import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CriarEmprestimoInput, Emprestimo } from "@/models/Emprestimo";
import { EmprestimosService } from "@/services/emprestimos.service";
import { ApiError } from "@/services/api";

export function useEmprestimosViewModel() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["emprestimos"],
    queryFn: () => EmprestimosService.listar(),
  });

  const criar = useMutation({
    mutationFn: (input: CriarEmprestimoInput) => EmprestimosService.criar(input),
    onSuccess: () => {
      toast.success("Empréstimo registrado");
      qc.invalidateQueries({ queryKey: ["emprestimos"] });
      qc.invalidateQueries({ queryKey: ["livros"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: ApiError) => toast.error(e.message),
  });

  const devolver = useMutation({
    mutationFn: (id: number) => EmprestimosService.devolver(id),
    onSuccess: () => {
      toast.success("Livro devolvido. Obrigado!");
      qc.invalidateQueries({ queryKey: ["emprestimos"] });
      qc.invalidateQueries({ queryKey: ["livros"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: ApiError) => toast.error(e.message),
  });

  return {
    emprestimos: (query.data ?? []) as Emprestimo[],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    criar,
    devolver,
  };
}