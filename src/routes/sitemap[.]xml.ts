import { createFileRoute } from "@tanstack/react-router";
import { PUBLIC_PATHS } from "@/lib/public-paths";

function xml(value: string) {
  return value
    .replaceAll("&", "&" + "amp;")
    .replaceAll("<", "&" + "lt;")
    .replaceAll(">", "&" + "gt;")
    .replaceAll('"', "&" + "quot;");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        let paths = PUBLIC_PATHS;
        try {
          const { getSql } = await import("@/lib/db");
          const sql = await getSql();
          const rows = await sql<{ slug: string }>`select slug from tours order by sort_order`;
          if (rows.length) {
            paths = [
              ...PUBLIC_PATHS.filter((path) => !path.startsWith("/tour/")),
              ...rows.map((row) => `/tour/${row.slug}`),
            ];
          }
        } catch {
          paths = PUBLIC_PATHS;
        }
        const urls = paths
          .map((path) => `  <url><loc>${xml(origin + path)}</loc></url>`)
          .join("\n");
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
        return new Response(body, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
