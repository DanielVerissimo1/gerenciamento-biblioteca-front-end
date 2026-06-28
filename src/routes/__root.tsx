import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { AlertTriangle, ArrowLeft, Home, Library } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import logoHorizontal from "@/assets/Logo horizontal.png";
import logoVertical from "@/assets/logo vertical.png";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="surface-panel relative w-full max-w-lg overflow-hidden p-8 text-center md:p-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/8 to-transparent" />
        <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
          <Library className="h-7 w-7" />
        </div>
        <p className="relative mt-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Erro 404
        </p>
        <h1 className="relative mt-2 font-display text-4xl font-semibold text-foreground">
          Página não encontrada
        </h1>
        <p className="relative mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          O endereço acessado não existe ou foi movido para outro lugar da biblioteca.
        </p>
        <div className="relative mt-7">
          <Link
            to="/"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90"
          >
            <Home className="h-4 w-4" /> Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="surface-panel w-full max-w-lg p-8 text-center md:p-12">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-destructive/10 text-destructive ring-1 ring-destructive/20">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-foreground">
          Não foi possível abrir esta página
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Ocorreu um erro inesperado. Tente carregar novamente ou volte à visão geral.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Biblioteca" },
      { name: "description", content: "Sistema elegante de gerenciamento de biblioteca." },
      { name: "author", content: "Biblioteca" },
      { property: "og:title", content: "Biblioteca" },
      { property: "og:description", content: "Sistema elegante de gerenciamento de biblioteca." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: logoHorizontal },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Biblioteca" },
      { name: "twitter:description", content: "Sistema elegante de gerenciamento de biblioteca." },
      { name: "twitter:image", content: logoHorizontal },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", href: logoVertical },
      { rel: "apple-touch-icon", href: logoVertical },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
