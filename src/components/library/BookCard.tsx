import { BookOpen, MoreHorizontal, Pencil, Trash2, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_16px_40px_oklch(0.24_0.035_40/0.09)]">
      <div className="relative h-24 overflow-hidden bg-gradient-to-br from-primary via-wood to-forest">
        <div className="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(90deg,transparent_0,transparent_9px,rgba(255,255,255,0.18)_10px)]" />
        <div className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/10 blur-xl transition-transform duration-500 group-hover:scale-150" />
        <BookOpen className="absolute bottom-4 right-4 h-7 w-7 text-primary-foreground/85" />
        <span className="absolute bottom-3 left-4 max-w-[70%] truncate rounded-md border border-white/15 bg-black/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
          {livro.genero}
        </span>
      </div>
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 font-display text-xl font-semibold leading-tight">
              {livro.titulo}
            </h3>
            <p className="mt-1.5 flex items-center gap-1.5 truncate text-sm text-muted-foreground">
              <User className="h-3.5 w-3.5" /> {livro.autor}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="-mr-2 -mt-2 h-9 w-9"
                aria-label={`Ações para ${livro.titulo}`}
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil /> Editar livro
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                disabled={!disponivel}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 /> Excluir livro
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <StatusBadge disponivel={disponivel} />
          <span className="text-xs tabular-nums text-muted-foreground">ID #{livro.id}</span>
        </div>
      </CardContent>
    </Card>
  );
}
