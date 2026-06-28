import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronRight,
  ExternalLink,
  FileCode2,
  LayoutDashboard,
  Library,
  Menu,
  ScrollText,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import logoVertical from "@/assets/logo vertical.png";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const nav = [
  { to: "/", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { to: "/livros", label: "Acervo", icon: BookOpen, exact: false },
  { to: "/emprestimos", label: "Empréstimos", icon: ScrollText, exact: false },
] as const;

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      aria-label="Ir para a visão geral da biblioteca"
      className="flex h-20 items-center gap-3 px-5"
    >
      <img src={logoVertical} alt="" className="h-10 w-10 shrink-0 object-contain" />
      {!compact && (
        <div className="min-w-0">
          <p className="font-display text-xl font-semibold leading-none text-foreground">
            Athenaeum
          </p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Gestão de acervo
          </p>
        </div>
      )}
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav aria-label="Navegação principal" className="flex flex-col gap-1.5 px-3">
      <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        Menu principal
      </p>
      {nav.map((item) => {
        const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/65 hover:bg-secondary/80 hover:text-foreground",
            )}
          >
            <item.icon className="h-[18px] w-[18px]" />
            <span className="flex-1">{item.label}</span>
            <ChevronRight
              className={cn("h-3.5 w-3.5 opacity-0 transition-opacity", active && "opacity-70")}
            />
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <Brand />
      <div className="mx-5 mb-5 border-t border-border/70" />
      <NavList onNavigate={onNavigate} />
      <div className="mt-auto p-4">
        <a
          href="http://localhost:3000/api-docs"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/60 p-3 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-foreground">
            <FileCode2 className="h-4 w-4" />
          </span>
          <span className="flex-1">
            <strong className="block text-sm font-semibold text-foreground">Documentação</strong>
            Swagger da API
          </span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <p className="mt-4 px-2 text-[11px] leading-relaxed text-muted-foreground">
          Organize histórias. Preserve conhecimento.
        </p>
      </div>
    </>
  );
}

function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border/70 bg-card/75 backdrop-blur-xl md:flex md:flex-col">
      <SidebarContent />
    </aside>
  );
}

export function Layout({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex min-h-[76px] w-full max-w-[1480px] items-center gap-3 px-4 md:px-8 lg:px-10">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                  aria-label="Abrir menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex w-72 flex-col p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menu principal</SheetTitle>
                </SheetHeader>
                <SidebarContent onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary md:hidden">
              <Library className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1 py-3">
              <p className="mb-0.5 hidden text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground sm:block">
                Biblioteca / {title}
              </p>
              <h1 className="truncate font-display text-2xl font-semibold leading-tight md:text-[1.75rem]">
                {title}
              </h1>
              {description && (
                <p className="hidden truncate text-sm text-muted-foreground sm:block">
                  {description}
                </p>
              )}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
          </div>
        </header>
        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1480px] px-4 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
