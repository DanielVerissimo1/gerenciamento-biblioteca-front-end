import { useMemo, useState } from "react";
import { BookOpen, Filter, Library, Plus, Search, X } from "lucide-react";
import { Layout } from "@/components/library/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { BookCard } from "@/components/library/BookCard";
import { BookForm, type BookFormValues } from "@/components/library/BookForm";
import { ErrorState, ScreenState } from "@/components/library/ScreenState";
import { Loading } from "@/components/library/Loading";
import { useLivrosViewModel } from "@/viewmodels/useLivrosViewModel";
import type { Livro } from "@/models/Livro";

export function LivrosView() {
  const vm = useLivrosViewModel();
  const [busca, setBusca] = useState("");
  const [generoInput, setGeneroInput] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Livro | null>(null);
  const [excluir, setExcluir] = useState<Livro | null>(null);

  const livrosFiltrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return vm.livros;
    return vm.livros.filter(
      (l) =>
        l.titulo.toLowerCase().includes(q) ||
        l.autor.toLowerCase().includes(q) ||
        l.genero.toLowerCase().includes(q),
    );
  }, [vm.livros, busca]);

  const handleSubmit = (values: BookFormValues) => {
    if (editing) {
      vm.atualizar.mutate(
        { id: editing.id, input: values },
        {
          onSuccess: () => {
            setOpen(false);
            setEditing(null);
          },
        },
      );
    } else {
      vm.criar.mutate(values, { onSuccess: () => setOpen(false) });
    }
  };

  const openCriar = () => {
    setEditing(null);
    setOpen(true);
  };
  const openEditar = (livro: Livro) => {
    setEditing(livro);
    setOpen(true);
  };
  const clearFilters = () => {
    setBusca("");
    setGeneroInput("");
    vm.setGenero("");
  };
  const hasFilters = Boolean(busca || vm.genero);

  return (
    <Layout
      title="Acervo"
      description="Catalogue, encontre e gerencie cada obra da biblioteca."
      actions={
        <Button onClick={openCriar}>
          <Plus />
          <span className="hidden sm:inline">Novo livro</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      }
    >
      <div className="space-y-6">
        <section aria-label="Busca e filtros" className="surface-panel animate-enter p-4 md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Buscar por título, autor ou gênero..."
                aria-label="Buscar no acervo"
                className="pl-10 pr-10"
              />
              {busca && (
                <button
                  type="button"
                  onClick={() => setBusca("")}
                  aria-label="Limpar busca"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <form
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                vm.setGenero(generoInput.trim());
              }}
            >
              <div className="relative sm:w-60">
                <Filter className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={generoInput}
                  onChange={(event) => setGeneroInput(event.target.value)}
                  placeholder="Filtrar por gênero"
                  aria-label="Filtrar por gênero"
                  className="pl-10"
                />
              </div>
              <Button type="submit" variant="secondary">
                Aplicar filtro
              </Button>
              {hasFilters && (
                <Button type="button" variant="ghost" onClick={clearFilters}>
                  <X /> Limpar
                </Button>
              )}
            </form>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-4 text-sm text-muted-foreground">
            <p>
              <strong className="font-semibold text-foreground">{livrosFiltrados.length}</strong>{" "}
              {livrosFiltrados.length === 1 ? "livro encontrado" : "livros encontrados"}
            </p>
            {vm.genero && (
              <p className="rounded-lg bg-primary/8 px-3 py-1.5 text-xs font-semibold text-primary">
                Gênero: {vm.genero}
              </p>
            )}
          </div>
        </section>

        {vm.isLoading ? (
          <Loading label="Consultando o acervo..." />
        ) : vm.isError ? (
          <ErrorState
            title="Não foi possível carregar o acervo"
            description={
              vm.error?.message ?? "Verifique a conexão com o servidor e tente novamente."
            }
            action={<Button onClick={() => vm.refetch()}>Tentar novamente</Button>}
          />
        ) : livrosFiltrados.length === 0 ? (
          <ScreenState
            title={hasFilters ? "Nenhum resultado encontrado" : "Seu acervo está vazio"}
            description={
              hasFilters
                ? "Revise os termos da busca ou remova os filtros aplicados."
                : "Cadastre o primeiro título para começar a organizar a biblioteca."
            }
            icon={hasFilters ? Search : Library}
            action={
              hasFilters ? (
                <Button variant="outline" onClick={clearFilters}>
                  <X /> Limpar filtros
                </Button>
              ) : (
                <Button onClick={openCriar}>
                  <Plus /> Cadastrar livro
                </Button>
              )
            }
          />
        ) : (
          <section
            aria-label="Livros do acervo"
            className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
          >
            {livrosFiltrados.map((livro, index) => (
              <div
                key={livro.id}
                className="animate-enter"
                style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
              >
                <BookCard
                  livro={livro}
                  onEdit={() => openEditar(livro)}
                  onDelete={() => setExcluir(livro)}
                />
              </div>
            ))}
          </section>
        )}
      </div>

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) setEditing(null);
        }}
      >
        <DialogContent className="overflow-hidden p-0 sm:max-w-xl">
          <DialogHeader className="border-b border-border/70 bg-secondary/30 p-6 text-left">
            <div className="mb-2 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <BookOpen />
            </div>
            <DialogTitle className="font-display text-2xl">
              {editing ? "Editar livro" : "Cadastrar novo livro"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Atualize as informações deste volume do acervo."
                : "Inclua um novo título no catálogo da biblioteca."}
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <BookForm
              initial={editing}
              onSubmit={handleSubmit}
              submitting={vm.criar.isPending || vm.atualizar.isPending}
              submitLabel={editing ? "Salvar alterações" : "Cadastrar livro"}
            />
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(excluir)}
        onOpenChange={(nextOpen) => !nextOpen && setExcluir(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir “{excluir?.titulo}”?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O livro será removido permanentemente do acervo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (excluir) vm.excluir.mutate(excluir.id, { onSuccess: () => setExcluir(null) });
              }}
            >
              Excluir livro
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
