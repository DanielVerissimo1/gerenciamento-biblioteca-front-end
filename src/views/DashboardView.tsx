import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BookCheck,
  BookOpen,
  Library,
  Plus,
  ScrollText,
  Shapes,
  Sparkles,
} from "lucide-react";
import { Layout } from "@/components/library/Layout";
import { StatCard } from "@/components/library/StatCard";
import { Loading } from "@/components/library/Loading";
import { SectionCard } from "@/components/library/SectionCard";
import { ScreenState } from "@/components/library/ScreenState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookForm, type BookFormValues } from "@/components/library/BookForm";
import { useDashboardViewModel } from "@/viewmodels/useDashboardViewModel";
import { useLivrosViewModel } from "@/viewmodels/useLivrosViewModel";

export function DashboardView() {
  const vm = useDashboardViewModel();
  const livrosVm = useLivrosViewModel();
  const [bookDialogOpen, setBookDialogOpen] = useState(false);

  const handleCreateBook = (values: BookFormValues) => {
    livrosVm.criar.mutate(values, { onSuccess: () => setBookDialogOpen(false) });
  };

  return (
    <>
      <Layout
        title="Visão geral"
        description="Indicadores e movimentos recentes da sua biblioteca."
        actions={
          <Button className="gap-2" onClick={() => setBookDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Adicionar livro</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        }
      >
        {vm.isLoading ? (
          <Loading label="Preparando a visão geral..." />
        ) : (
          <div className="space-y-6 md:space-y-8">
            <section
              aria-label="Indicadores do acervo"
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
              <StatCard
                icon={Library}
                tone="wine"
                label="Livros no acervo"
                value={vm.totalLivros}
                hint="Total catalogado"
              />
              <StatCard
                icon={BookCheck}
                tone="forest"
                label="Disponíveis"
                value={vm.disponiveis}
                hint="Prontos para empréstimo"
                delay={60}
              />
              <StatCard
                icon={BookOpen}
                tone="wood"
                label="Emprestados"
                value={vm.emprestados}
                hint="Obras em circulação"
                delay={120}
              />
              <StatCard
                icon={ScrollText}
                tone="gold"
                label="Empréstimos ativos"
                value={vm.ativosEmprestimos}
                hint="Registros em andamento"
                delay={180}
              />
            </section>

            <div className="grid gap-6 xl:grid-cols-3">
              <SectionCard
                title="Últimas aquisições"
                description="Os títulos adicionados mais recentemente ao catálogo."
                icon={Sparkles}
                className="animate-enter xl:col-span-2"
                action={
                  <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                    <Link to="/livros">
                      Ver acervo <ArrowRight />
                    </Link>
                  </Button>
                }
              >
                {vm.livrosRecentes.length === 0 ? (
                  <ScreenState
                    title="Seu acervo começa aqui"
                    description="Cadastre o primeiro livro para acompanhar as aquisições recentes."
                    icon={BookOpen}
                    compact
                  />
                ) : (
                  <ul className="divide-y divide-border/70">
                    {vm.livrosRecentes.map((livro, index) => (
                      <li
                        key={livro.id}
                        className="group flex items-center gap-4 py-3.5 first:pt-0 last:pb-0"
                      >
                        <div className="grid h-11 w-9 shrink-0 place-items-center rounded-md bg-gradient-to-br from-primary to-wood text-primary-foreground shadow-sm">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-foreground">{livro.titulo}</p>
                          <p className="truncate text-sm text-muted-foreground">{livro.autor}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className="hidden border-wood/25 bg-wood/5 text-wood sm:inline-flex"
                        >
                          {livro.genero}
                        </Badge>
                        <span className="w-5 text-right text-xs tabular-nums text-muted-foreground">
                          {index + 1}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </SectionCard>

              <SectionCard
                title="Gêneros em destaque"
                description="Distribuição dos temas mais presentes."
                icon={Shapes}
                className="animate-enter animation-delay-1"
              >
                {vm.generosPopulares.length === 0 ? (
                  <ScreenState
                    title="Sem gêneros ainda"
                    description="Os dados aparecem após o primeiro cadastro."
                    icon={Shapes}
                    compact
                  />
                ) : (
                  <ul className="space-y-4">
                    {vm.generosPopulares.map(([genero, qtd], index) => {
                      const percent = Math.min(100, (qtd / Math.max(1, vm.totalLivros)) * 100);
                      return (
                        <li key={genero}>
                          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                            <span className="truncate font-semibold">{genero}</span>
                            <span className="rounded-md bg-secondary px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
                              {qtd}
                            </span>
                          </div>
                          <div
                            className="h-2 overflow-hidden rounded-full bg-secondary"
                            aria-label={`${genero}: ${qtd} livros`}
                          >
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary to-wood transition-[width] duration-700"
                              style={{ width: `${percent}%`, transitionDelay: `${index * 60}ms` }}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </SectionCard>
            </div>
          </div>
        )}
      </Layout>

      <Dialog open={bookDialogOpen} onOpenChange={setBookDialogOpen}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-xl">
          <DialogHeader className="border-b border-border/70 bg-secondary/30 p-6 text-left">
            <div className="mb-2 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <BookOpen />
            </div>
            <DialogTitle className="font-display text-2xl">Cadastrar novo livro</DialogTitle>
            <DialogDescription>Inclua um novo título no catálogo da biblioteca.</DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <BookForm
              onSubmit={handleCreateBook}
              submitting={livrosVm.criar.isPending}
              submitLabel="Cadastrar livro"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
