import { Loader2 } from "lucide-react";

export function Loading({ label = "Carregando o acervo..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin text-wine" />
      <span className="font-display text-lg">{label}</span>
    </div>
  );
}