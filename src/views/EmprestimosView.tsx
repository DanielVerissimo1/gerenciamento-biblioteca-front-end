import { useMemo, useState } from "react";
import { CalendarDays, Plus, RotateCcw, User } from "lucide-react";
import { Layout } from "@/components/library/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/library/EmptyState";
import { Loading } from "@/components/library/Loading";
import { LoanForm, type LoanFormValues } from "@/components/library/LoanForm";
import { useEmprestimosViewModel } from "@/viewmodels/useEmprestimosViewModel";
import { useLivrosViewModel } from "@/viewmodels/useLivrosViewModel";

function formatDate(value: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export function EmprestimosView() {
  const vm = useEmprestimosViewModel();
  const livrosVm = useLivrosViewModel();
  const [open, setOpen] = useState(false);

  const livrosMap = useMemo(() => {
    const m = new Map<number, string>();
    livrosVm.livros.forEach((l) => m.set(l.id, l.titulo));
    return m;
  }, [livrosVm.livros]);

  const disponiveis = useMemo(
    () => livrosVm.livros.filter((l) => l.disponivel === 1),
    [livrosVm.livros],
  );

  const ativos = vm.emprestimos.filter((e) => e.devolvido === 0);
  const historico = vm.emprestimos.filter((e) => e.devolvido === 1);

  const handleSubmit = (values: LoanFormValues) => {
    vm.criar.mutate(values, { onSuccess: () => setOpen(false) });
  };

  return (
    <Layout
      title="Empréstimos"
      description="Acompanhe quem está com cada obra e registre devoluções."
      actions={
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Novo empréstimo
        </Button>
      }
    >
      {vm.isLoading ? (
        <Loading label="Reunindo registros..." />
      ) : vm.isError ? (
        <EmptyState
          title="Não foi possível carregar os empréstimos"
          description={vm.error?.message ?? "Verifique se a API está disponível."}
        />
      ) : (
        <div className="space-y-10">
          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-display text-2xl">Ativos</h2>
              <span className="text-sm text-muted-foreground">{ativos.length} em circulação</span>
            </div>
            {ativos.length === 0 ? (
              <EmptyState
                title="Nenhum empréstimo ativo"
                description="Quando um livro for emprestado, ele aparecerá aqui."
                action={
                  <Button onClick={() => setOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" /> Registrar empréstimo
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {ativos.map((e) => (
                  <Card key={e.id} className="border-border/70">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Empréstimo #{e.id}
                          </p>
                          <p className="mt-1 truncate font-display text-xl">
                            {livrosMap.get(e.livro_id) ?? `Livro #${e.livro_id}`}
                          </p>
                        </div>
                        <Badge className="border border-wine/30 bg-wine/10 text-wine hover:bg-wine/10">
                          Em curso
                        </Badge>
                      </div>
                      <div className="mt-4 space-y-1.5 text-sm text-foreground/80">
                        <p className="flex items-center gap-2">
                          <User className="h-4 w-4 text-wood" /> {e.nome_aluno}
                        </p>
                        <p className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-wood" />
                          Emprestado em {formatDate(e.data_emprestimo)}
                        </p>
                      </div>
                      <Button
                        onClick={() => vm.devolver.mutate(e.id)}
                        disabled={vm.devolver.isPending}
                        className="mt-5 w-full gap-2"
                        variant="secondary"
                      >
                        <RotateCcw className="h-4 w-4" /> Registrar devolução
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {historico.length > 0 && (
            <section>
              <h2 className="mb-3 font-display text-2xl">Histórico</h2>
              <div className="overflow-hidden rounded-lg border border-border bg-card/60">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Livro</th>
                      <th className="px-4 py-3">Aluno</th>
                      <th className="px-4 py-3">Data</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {historico.map((e) => (
                      <tr key={e.id}>
                        <td className="px-4 py-3 text-muted-foreground">{e.id}</td>
                        <td className="px-4 py-3 font-medium">
                          {livrosMap.get(e.livro_id) ?? `Livro #${e.livro_id}`}
                        </td>
                        <td className="px-4 py-3">{e.nome_aluno}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatDate(e.data_emprestimo)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge className="border border-forest/30 bg-forest/10 text-forest hover:bg-forest/10">
                            Devolvido
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Novo empréstimo</DialogTitle>
            <DialogDescription>
              Selecione um livro disponível e informe o nome do aluno.
            </DialogDescription>
          </DialogHeader>
          <LoanForm
            livrosDisponiveis={disponiveis}
            onSubmit={handleSubmit}
            submitting={vm.criar.isPending}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
}