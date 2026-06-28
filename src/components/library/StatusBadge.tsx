import { Badge } from "@/components/ui/badge";
import { BookCheck, BookOpen, CheckCircle2, Clock3 } from "lucide-react";

export function StatusBadge({ disponivel }: { disponivel: boolean }) {
  return disponivel ? (
    <Badge className="gap-1.5 border border-forest/20 bg-forest/10 text-forest shadow-none hover:bg-forest/10">
      <BookCheck className="h-3 w-3" /> Disponível
    </Badge>
  ) : (
    <Badge className="gap-1.5 border border-primary/20 bg-primary/10 text-primary shadow-none hover:bg-primary/10">
      <BookOpen className="h-3 w-3" /> Emprestado
    </Badge>
  );
}

export function LoanStatusBadge({ returned = false }: { returned?: boolean }) {
  return returned ? (
    <Badge className="gap-1.5 border border-forest/20 bg-forest/10 text-forest shadow-none hover:bg-forest/10">
      <CheckCircle2 /> Devolvido
    </Badge>
  ) : (
    <Badge className="gap-1.5 border border-gold/30 bg-gold/15 text-[oklch(0.42_0.1_75)] shadow-none hover:bg-gold/15">
      <Clock3 /> Em curso
    </Badge>
  );
}
