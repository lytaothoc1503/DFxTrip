import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, HeadContent, Link, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteFooter, SiteHeader, TabBar } from "@/components/site/chrome";
import { useViewTransitionFallback } from "@/components/fx/effects";
import { resolvePageScene } from "@/lib/page-scene";
import { Toaster } from "@/components/ui/sonner";
import appCss from "../styles.css?url";

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,500..800;1,9..144,500..800&display=swap";

export const Route = createRootRoute({
  head: ({ matches }) => {
    const missing = matches.some((match) => match.status === "notFound" || match._notFound);
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          title: missing
            ? "Không tìm thấy trang — DFxTrip"
            : "DFxTrip — Khám phá khách sạn tuyệt vời",
        },
        ...(missing
          ? [
              { name: "robots", content: "noindex, follow" },
              { name: "description", content: "Trang này không có trên DFxTrip." },
            ]
          : []),
        { name: "theme-color", content: "#fbf6ef" },
      ],
      links: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        { rel: "preload", as: "style", href: FONT_HREF },
        { rel: "stylesheet", href: appCss },
        { rel: "manifest", href: "/__grok/manifest.webmanifest" },
        { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      ],
    };
  },
  notFoundComponent: NotFoundPage,
  component: Root,
});

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">404</p>
      <h1 className="mt-2 font-display text-4xl font-bold">Không tìm thấy trang</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Đường dẫn này không có trên DFxTrip. Xem khách sạn, tour, hoặc về trang chủ.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="inline-flex h-11 items-center rounded-full bg-[image:var(--gradient-primary)] px-5 text-sm font-semibold text-primary-foreground"
        >
          Trang chủ
        </Link>
        <Link
          to="/khach-san"
          className="inline-flex h-11 items-center rounded-full border bg-card px-5 text-sm font-semibold"
        >
          Khách sạn
        </Link>
        <Link
          to="/tour"
          className="inline-flex h-11 items-center rounded-full border bg-card px-5 text-sm font-semibold"
        >
          Tour
        </Link>
      </div>
    </div>
  );
}

function Root() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <HeadContent />
        <link
          rel="stylesheet"
          href={FONT_HREF}
          media="print"
          ref={(node) => {
            if (node && node.media !== "all") node.media = "all";
          }}
        />
        <noscript>
          <link rel="stylesheet" href={FONT_HREF} />
        </noscript>
      </head>
      <body>
        <PreviewHostBridge />
        <a className="skip-link" href="#noi-dung">
          Bỏ qua điều hướng
        </a>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <Frame />
          </QueryClientProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

function Frame() {
  useViewTransitionFallback();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const scene = resolvePageScene(pathname);
  return (
    <>
      <SiteHeader />
      <main
        id="noi-dung"
        key={pathname}
        data-scene={scene}
        className="page-enter page-scene min-h-[70vh]"
      >
        <Outlet />
      </main>
      <SiteFooter />
      <TabBar />
      <Toaster position="top-center" richColors />
    </>
  );
}
