import { BookCheck, BookOpen, Library, ScrollText, Sparkles } from "lucide-react";
import { Layout } from "@/components/library/Layout";
import { StatCard } from "@/components/library/StatCard";
import { Loading } from "@/components/library/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardViewModel } from "@/viewmodels/useDashboardViewModel";
import { Badge } from "@/components/ui/badge";

export function DashboardView() {
  const vm = useDashboardViewModel();
  return (
    <Layout
      title="Bem-vindo ao acervo"
      description="Uma visão geral da biblioteca, dos livros e dos empréstimos ativos."
    >
      {vm.isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Library} tone="wine" label="Livros no acervo" value={vm.totalLivros} />
            <StatCard icon={BookCheck} tone="forest" label="Disponíveis" value={vm.disponiveis} />
            <StatCard icon={BookOpen} tone="wood" label="Emprestados" value={vm.emprestados} />
            <StatCard icon={ScrollText} tone="gold" label="Empréstimos ativos" value={vm.ativosEmprestimos} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-2xl">
                  <Sparkles className="h-5 w-5 text-gold" /> Últimas aquisições
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vm.livrosRecentes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    O acervo ainda está vazio. Cadastre o primeiro livro.
                  </p>
                ) : (
                  <ul className="divide-y divide-border">
                    {vm.livrosRecentes.map((l) => (
                      <li key={l.id} className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-display text-lg leading-tight">{l.titulo}</p>
                          <p className="text-sm text-muted-foreground">{l.autor}</p>
                        </div>
                        <Badge variant="outline" className="border-wood/30 text-wood">
                          {l.genero}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-2xl">Gêneros em destaque</CardTitle>
              </CardHeader>
              <CardContent>
                {vm.generosPopulares.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sem dados de gênero.</p>
                ) : (
                  <ul className="space-y-3">
                    {vm.generosPopulares.map(([genero, qtd]) => (
                      <li key={genero}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{genero}</span>
                          <span className="text-muted-foreground">{qtd}</span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full bg-wine"
                            style={{ width: `${Math.min(100, (qtd / Math.max(1, vm.totalLivros)) * 100)}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </Layout>
  );
}