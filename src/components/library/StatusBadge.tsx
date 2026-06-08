import { Badge } from "@/components/ui/badge";
import { BookOpen, BookCheck } from "lucide-react";

export function StatusBadge({ disponivel }: { disponivel: boolean }) {
  if (disponivel) {
    return (
      <Badge className="gap-1 border border-forest/30 bg-forest/10 text-forest hover:bg-forest/10">
        <BookCheck className="h-3 w-3" /> Disponível
      </Badge>
    );
  }
  return (
    <Badge className="gap-1 border border-wine/30 bg-wine/10 text-wine hover:bg-wine/10">
      <BookOpen className="h-3 w-3" /> Emprestado
    </Badge>
  );
}