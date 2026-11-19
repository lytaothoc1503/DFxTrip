import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteFooter, SiteHeader, TabBar } from "@/components/site/chrome";
import { useViewTransitionFallback } from "@/components/fx/effects";
import { Toaster } from "@/components/ui/sonner";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DFxTrip — Khám phá khách sạn tuyệt vời" },
      { name: "theme-color", content: "#fbf6ef" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,500..800;1,9..144,500..800&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: Root,
});

function Root() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
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
  return (
    <>
      <SiteHeader />
      <main key={pathname} className="page-enter min-h-[70vh]">
        <Outlet />
      </main>
      <SiteFooter />
      <TabBar />
      <Toaster position="top-center" richColors />
    </>
  );
}
