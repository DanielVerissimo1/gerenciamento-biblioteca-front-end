import { useQuery } from "@tanstack/react-query";
import { LivrosService } from "@/services/livros.service";
import { EmprestimosService } from "@/services/emprestimos.service";

export function useDashboardViewModel() {
  const livros = useQuery({
    queryKey: ["dashboard", "livros"],
    queryFn: () => LivrosService.listar(),
  });
  const emprestimos = useQuery({
    queryKey: ["dashboard", "emprestimos"],
    queryFn: () => EmprestimosService.listar(),
  });

  const totalLivros = livros.data?.length ?? 0;

  const disponiveis = livros.data?.filter((l) => l.disponivel === 1).length ?? 0;
  const emprestados = totalLivros - disponiveis;
  const ativosEmprestimos =
    emprestimos.data?.filter((e) => e.devolvido === 0).length ?? 0;

  const generos = new Map<string, number>();
  livros.data?.forEach((l) => generos.set(l.genero, (generos.get(l.genero) ?? 0) + 1));

  return {
    isLoading: livros.isLoading || emprestimos.isLoading,
    totalLivros,
    disponiveis,
    emprestados,
    ativosEmprestimos,
    generosPopulares: Array.from(generos.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5),
    livrosRecentes: (livros.data ?? []).slice(-4).reverse(),
  };
}