import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  icon: LucideIcon;
  label: string;
  value: number | string;
  hint?: string;
  tone?: "wine" | "forest" | "gold" | "wood";
}

const toneMap = {
  wine: "from-wine/15 to-wine/0 text-wine",
  forest: "from-forest/15 to-forest/0 text-forest",
  gold: "from-gold/25 to-gold/0 text-[oklch(0.45_0.1_82)]",
  wood: "from-wood/15 to-wood/0 text-wood",
} as const;

export function StatCard({ icon: Icon, label, value, hint, tone = "wine" }: Props) {
  return (
    <Card className="relative overflow-hidden border-border/70 shadow-sm">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${toneMap[tone]}`} />
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
            <p className="mt-3 font-display text-4xl font-semibold text-foreground">{value}</p>
            {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
          </div>
          <div className="rounded-full bg-background/60 p-3 ring-1 ring-border">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}