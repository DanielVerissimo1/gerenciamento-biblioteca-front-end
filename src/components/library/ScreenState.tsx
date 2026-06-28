import { AlertTriangle, BookOpen, Inbox, RefreshCw, type LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ScreenState({
  title,
  description,
  action,
  icon: Icon = Inbox,
  tone = "empty",
  compact = false,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: LucideIcon;
  tone?: "empty" | "error";
  compact?: boolean;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "relative isolate flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed px-6 text-center",
        compact ? "py-10" : "py-14 md:py-16",
        tone === "error"
          ? "border-destructive/30 bg-destructive/[0.035]"
          : "border-border bg-card/60",
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,oklch(0.36_0.12_25/0.08),transparent_45%)]" />
      <div
        className={cn(
          "mb-4 grid h-14 w-14 place-items-center rounded-2xl ring-1",
          tone === "error"
            ? "bg-destructive/10 text-destructive ring-destructive/20"
            : "bg-primary/10 text-primary ring-primary/15",
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-display text-xl font-semibold md:text-2xl">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export const EmptyState = ScreenState;

export function ErrorState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <ScreenState
      title={title}
      description={description}
      action={action}
      icon={AlertTriangle}
      tone="error"
    />
  );
}

export function DefaultEmptyState(props: Omit<ComponentProps<typeof ScreenState>, "icon">) {
  return <ScreenState {...props} icon={BookOpen} />;
}

export function RetryIcon({ pending = false }: { pending?: boolean }) {
  return <RefreshCw className={cn("h-4 w-4", pending && "animate-spin")} />;
}
