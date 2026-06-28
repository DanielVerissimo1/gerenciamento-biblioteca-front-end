import { useMemo, useState } from "react";
import {
  BookCheck,
  BookOpen,
  CalendarDays,
  History,
  Plus,
  RotateCcw,
  ScrollText,
  User,
} from "lucide-react";
import { Layout } from "@/components/library/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScreenState, ErrorState } from "@/components/library/ScreenState";
import { Loading } from "@/components/library/Loading";
import { LoanForm, type LoanFormValues } from "@/components/library/LoanForm";
import { StatCard } from "@/components/library/StatCard";
import { LoanStatusBadge } from "@/components/library/StatusBadge";
import { SectionCard } from "@/components/library/SectionCard";
import { useEmprestimosViewModel } from "@/viewmodels/useEmprestimosViewModel";
import { useLivrosViewModel } from "@/viewmodels/useLivrosViewModel";
import type { Emprestimo } from "@/models/Emprestimo";

function formatDate(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export function EmprestimosView() {
  const vm = useEmprestimosViewModel();
  const livrosVm = useLivrosViewModel();
  const [open, setOpen] = useState(false);
  const [returning, setReturning] = useState<Emprestimo | null>(null);

  const livrosMap = useMemo(
    () => new Map(livrosVm.livros.map((livro) => [livro.id, livro.titulo])),
    [livrosVm.livros],
  );
  const disponiveis = useMemo(
    () => livrosVm.livros.filter((livro) => livro.disponivel === 1),
    [livrosVm.livros],
  );
  const ativos = vm.emprestimos.filter((emprestimo) => emprestimo.devolvido === 0);
  const historico = vm.emprestimos.filter((emprestimo) => emprestimo.devolvido === 1);

  const handleSubmit = (values: LoanFormValues) =>
    vm.criar.mutate(values, { onSuccess: () => setOpen(false) });

  return (
    <Layout
      title="Empréstimos"
      description="Acompanhe obras em circulação e registre devoluções."
      actions={
        <Button onClick={() => setOpen(true)}>
          <Plus />
          <span className="hidden sm:inline">Novo empréstimo</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      }
    >
      {vm.isLoading || livrosVm.isLoading ? (
        <Loading label="Reunindo os registros de empréstimo..." />
      ) : vm.isError ? (
        <ErrorState
          title="Não foi possível carregar os empréstimos"
          description={vm.error?.message ?? "Verifique a conexão com o servidor e tente novamente."}
        />
      ) : (
        <div className="space-y-6 md:space-y-8">
          <section aria-label="Resumo dos empréstimos" className="grid gap-4 sm:grid-cols-3">
            <StatCard
              icon={ScrollText}
              label="Em circulação"
              value={ativos.length}
              hint="Empréstimos ativos"
            />
            <StatCard
              icon={BookCheck}
              tone="forest"
              label="Disponíveis"
              value={disponiveis.length}
              hint="Livros liberados"
              delay={60}
            />
            <StatCard
              icon={BookOpen}
              tone="wood"
              label="Total no acervo"
              value={livrosVm.livros.length}
              hint="Livros catalogados"
              delay={120}
            />
          </section>

          <SectionCard
            title="Empréstimos ativos"
            description={`${ativos.length} ${ativos.length === 1 ? "obra em circulação" : "obras em circulação"}`}
            icon={BookOpen}
            className="animate-enter"
            contentClassName={ativos.length ? "p-0" : undefined}
          >
            {ativos.length === 0 ? (
              <ScreenState
                title="Nenhum empréstimo ativo"
                description="Todos os livros estão em dia. Registre um empréstimo quando uma obra sair do acervo."
                icon={BookCheck}
                compact
                action={
                  <Button onClick={() => setOpen(true)}>
                    <Plus /> Registrar empréstimo
                  </Button>
                }
              />
            ) : (
              <div className="grid divide-y divide-border/70 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-3">
                {ativos.map((emprestimo) => (
                  <article
                    key={emprestimo.id}
                    className="flex min-w-0 flex-col p-5 transition-colors hover:bg-secondary/25 md:p-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                          Empréstimo #{emprestimo.id}
                        </p>
                        <h3 className="mt-1.5 line-clamp-2 font-display text-xl font-semibold leading-tight">
                          {livrosMap.get(emprestimo.livro_id) ?? `Livro #${emprestimo.livro_id}`}
                        </h3>
                      </div>
                      <LoanStatusBadge />
                    </div>
                    <dl className="mt-5 space-y-2.5 text-sm">
                      <div className="flex items-center gap-2.5">
                        <User className="h-4 w-4 text-primary" />
                        <div>
                          <dt className="sr-only">Aluno</dt>
                          <dd className="font-medium">{emprestimo.nome_aluno}</dd>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 text-muted-foreground">
                        <CalendarDays className="h-4 w-4 text-wood" />
                        <div>
                          <dt className="sr-only">Data do empréstimo</dt>
                          <dd>{formatDate(emprestimo.data_emprestimo)}</dd>
                        </div>
                      </div>
                    </dl>
                    <Button
                      onClick={() => setReturning(emprestimo)}
                      disabled={vm.devolver.isPending}
                      className="mt-5 w-full"
                      variant="secondary"
                    >
                      <RotateCcw /> Registrar devolução
                    </Button>
                  </article>
                ))}
              </div>
            )}
          </SectionCard>

          {historico.length > 0 && (
            <SectionCard
              title="Histórico"
              description="Empréstimos concluídos e devolvidos ao acervo."
              icon={History}
              className="animate-enter animation-delay-1"
              contentClassName="p-0"
            >
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/45 hover:bg-secondary/45">
                      <TableHead className="pl-6">Livro</TableHead>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Data do empréstimo</TableHead>
                      <TableHead className="pr-6 text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historico.map((emprestimo) => (
                      <TableRow key={emprestimo.id}>
                        <TableCell className="pl-6 font-semibold">
                          {livrosMap.get(emprestimo.livro_id) ?? `Livro #${emprestimo.livro_id}`}
                          <span className="ml-2 text-xs font-normal text-muted-foreground">
                            #{emprestimo.id}
                          </span>
                        </TableCell>
                        <TableCell>{emprestimo.nome_aluno}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(emprestimo.data_emprestimo)}
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <LoanStatusBadge returned />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="divide-y divide-border/70 md:hidden">
                {historico.map((emprestimo) => (
                  <article key={emprestimo.id} className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">
                          {livrosMap.get(emprestimo.livro_id) ?? `Livro #${emprestimo.livro_id}`}
                        </h3>
                        <p className="text-sm text-muted-foreground">{emprestimo.nome_aluno}</p>
                      </div>
                      <LoanStatusBadge returned />
                    </div>
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays /> {formatDate(emprestimo.data_emprestimo)}
                    </p>
                  </article>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-xl">
          <DialogHeader className="border-b border-border/70 bg-secondary/30 p-6 text-left">
            <div className="mb-2 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <ScrollText />
            </div>
            <DialogTitle className="font-display text-2xl">Novo empréstimo</DialogTitle>
            <DialogDescription>
              Selecione um livro disponível e identifique o aluno responsável.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <LoanForm
              livrosDisponiveis={disponiveis}
              onSubmit={handleSubmit}
              submitting={vm.criar.isPending}
            />
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(returning)}
        onOpenChange={(nextOpen) => !nextOpen && setReturning(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar devolução?</AlertDialogTitle>
            <AlertDialogDescription>
              O livro “
              {returning ? (livrosMap.get(returning.livro_id) ?? `#${returning.livro_id}`) : ""}”
              voltará a ficar disponível no acervo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (returning)
                  vm.devolver.mutate(returning.id, { onSuccess: () => setReturning(null) });
              }}
            >
              <RotateCcw /> Confirmar devolução
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
