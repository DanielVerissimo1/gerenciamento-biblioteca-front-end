import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
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
import { EmptyState } from "@/components/library/EmptyState";
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
        { onSuccess: () => { setOpen(false); setEditing(null); } },
      );
    } else {
      vm.criar.mutate(values, { onSuccess: () => setOpen(false) });
    }
  };

  const openCriar = () => { setEditing(null); setOpen(true); };
  const openEditar = (l: Livro) => { setEditing(l); setOpen(true); };

  return (
    <Layout
      title="Acervo"
      description="Catalogue, atualize e cuide de cada volume da biblioteca."
      actions={
        <Button onClick={openCriar} className="gap-2">
          <Plus className="h-4 w-4" /> Novo livro
        </Button>
      }
    >
      <div className="mb-6 flex flex-col gap-3 rounded-lg border border-border bg-card/60 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por título, autor ou gênero..."
            className="pl-9"
          />
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => { e.preventDefault(); vm.setGenero(generoInput.trim()); }}
        >
          <Input
            value={generoInput}
            onChange={(e) => setGeneroInput(e.target.value)}
            placeholder="Filtrar por gênero (API)"
            className="sm:w-56"
          />
          <Button type="submit" variant="secondary">Filtrar</Button>
          {vm.genero && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => { setGeneroInput(""); vm.setGenero(""); }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </form>
      </div>

      {vm.isLoading ? (
        <Loading />
      ) : vm.isError ? (
        <EmptyState
          title="Não foi possível carregar o acervo"
          description={vm.error?.message ?? "Verifique se a API está em execução em http://localhost:3000."}
          action={<Button onClick={() => vm.refetch()}>Tentar novamente</Button>}
        />
      ) : livrosFiltrados.length === 0 ? (
        <EmptyState
          title="Nenhum livro encontrado"
          description="Cadastre o primeiro título do acervo para começar."
          action={
            <Button onClick={openCriar} className="gap-2">
              <Plus className="h-4 w-4" /> Cadastrar livro
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {livrosFiltrados.map((l) => (
            <BookCard
              key={l.id}
              livro={l}
              onEdit={() => openEditar(l)}
              onDelete={() => setExcluir(l)}
            />
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editing ? "Editar livro" : "Cadastrar novo livro"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Atualize as informações deste volume do acervo."
                : "Inclua um novo título no acervo da biblioteca."}
            </DialogDescription>
          </DialogHeader>
          <BookForm
            initial={editing}
            onSubmit={handleSubmit}
            submitting={vm.criar.isPending || vm.atualizar.isPending}
            submitLabel={editing ? "Salvar alterações" : "Cadastrar livro"}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!excluir} onOpenChange={(o) => !o && setExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir "{excluir?.titulo}"?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O livro será removido do acervo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (excluir) {
                  vm.excluir.mutate(excluir.id, { onSuccess: () => setExcluir(null) });
                }
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}