import { createFileRoute, notFound } from "@tanstack/react-router";
import { pageTitle, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/$")({
  loader: () => {
    throw notFound();
  },
  head: () =>
    seoHead({
      title: pageTitle("Không tìm thấy trang"),
      description: "Trang này không có trên DFxTrip.",
      path: "/",
      noindex: true,
    }),
});
