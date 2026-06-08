import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, LayoutDashboard, ScrollText, Menu, FileCode2 } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import logoHorizontal from "@/assets/Logo horizontal.png";
import logoVertical from "@/assets/logo vertical.png";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/livros", label: "Livros", icon: BookOpen, exact: false },
  { to: "/emprestimos", label: "Empréstimos", icon: ScrollText, exact: false },
] as const;

function Brand() {
  return (
    <Link
      to="/"
      aria-label="Ir para o dashboard da Biblioteca"
      className="flex min-h-24 items-center px-6 py-5"
    >
      <img
        src={logoHorizontal}
        alt="Biblioteca"
        className="h-24 w-full object-contain object-left"
      />
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1 px-4">
      {nav.map((item) => {
        const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-wine/10 text-wine font-medium"
                : "text-foreground/70 hover:bg-secondary hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
      <a
        href="http://localhost:3000/api-docs"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
      >
        <FileCode2 className="h-4 w-4" />
        API Docs
      </a>
    </nav>
  );
}

function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-border bg-card/60 backdrop-blur md:flex md:flex-col">
      <Brand />
      <div className="mx-6 mb-4 border-t border-border" />
      <NavList />
      <div className="mt-auto p-6 text-xs text-muted-foreground">
        <p className="font-display text-base text-foreground">"Uma sala sem livros</p>
        <p className="font-display text-base text-foreground">é um corpo sem alma."</p>
        <p className="mt-2">— Cícero</p>
      </div>
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
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-4 backdrop-blur md:px-10">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <Brand />
              <NavList onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <img
            src={logoVertical}
            alt="Biblioteca"
            className="h-10 w-10 shrink-0 object-contain md:hidden"
          />
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-2xl md:text-3xl">{title}</h1>
            {description && (
              <p className="truncate text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
        <main className="flex-1 px-4 py-6 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  );
}
