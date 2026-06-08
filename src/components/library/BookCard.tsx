import { BookOpen, Pencil, Trash2, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import type { Livro } from "@/models/Livro";

export function BookCard({
  livro,
  onEdit,
  onDelete,
}: {
  livro: Livro;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const disponivel = livro.disponivel === 1;
  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/70 transition-shadow hover:shadow-md">
      <div className="relative h-28 bg-gradient-to-br from-wine via-wood to-forest">
        <div className="absolute inset-0 opacity-25" style={{ background: "repeating-linear-gradient(90deg, transparent 0, transparent 8px, rgba(0,0,0,0.15) 9px)" }} />
        <BookOpen className="absolute right-4 top-4 h-8 w-8 text-primary-foreground/80" />
        <span className="absolute bottom-3 left-4 rounded-sm bg-background/85 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-foreground/80">
          {livro.genero}
        </span>
      </div>
      <CardContent className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl leading-tight">{livro.titulo}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <User className="h-3.5 w-3.5" /> {livro.autor}
        </p>
        <div className="mt-4">
          <StatusBadge disponivel={disponivel} />
        </div>
        <div className="mt-auto flex items-center justify-end gap-2 pt-5">
          <Button variant="ghost" size="sm" onClick={onEdit} className="gap-1.5">
            <Pencil className="h-3.5 w-3.5" /> Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={!disponivel}
            title={!disponivel ? "Livro emprestado não pode ser excluído" : undefined}
            className="gap-1.5 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" /> Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}