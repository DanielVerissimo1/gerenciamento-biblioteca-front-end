import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  icon: LucideIcon;
  label: string;
  value: number | string;
  hint?: string;
  tone?: "wine" | "forest" | "gold" | "wood";
  delay?: number;
}

const toneMap = {
  wine: "bg-primary/10 text-primary ring-primary/15",
  forest: "bg-forest/10 text-forest ring-forest/15",
  gold: "bg-gold/15 text-[oklch(0.45_0.1_82)] ring-gold/20",
  wood: "bg-wood/10 text-wood ring-wood/15",
} as const;

export function StatCard({ icon: Icon, label, value, hint, tone = "wine", delay = 0 }: Props) {
  return (
    <Card
      className="animate-enter group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_16px_45px_oklch(0.24_0.035_40/0.09)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-primary/[0.035] blur-2xl transition-transform duration-500 group-hover:scale-150" />
      <CardContent className="relative p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-3 font-display text-4xl font-semibold tabular-nums text-foreground">
              {value}
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {hint ?? "Atualizado com o acervo"}
            </p>
          </div>
          <div
            className={cn(
              "grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1",
              toneMap[tone],
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <ArrowUpRight className="absolute bottom-5 right-5 h-4 w-4 text-muted-foreground/0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-muted-foreground/50" />
      </CardContent>
    </Card>
  );
}
