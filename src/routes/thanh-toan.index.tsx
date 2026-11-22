import { createFileRoute, Link } from "@tanstack/react-router";
import { pageTitle, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/thanh-toan/")({
  head: () =>
    seoHead({
      title: pageTitle("Thanh toán"),
      description: "Mở mã chuyển khoản từ chỗ đang giữ trên máy này.",
      path: "/thanh-toan",
      noindex: true,
    }),
  component: ThanhToanIndex,
});

function ThanhToanIndex() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Chuyển khoản</p>
      <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
        Cần mã <span className="italic text-primary">thanh toán</span>
      </h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Trang thanh toán mở bằng mã riêng sau khi giữ phòng, tour hoặc vé. Chưa có mã thì xem chỗ đang giữ trên
        máy này, hoặc chọn dịch vụ để giữ chỗ mới.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/dat-cho"
          className="inline-flex h-12 items-center rounded-full bg-[image:var(--gradient-primary)] px-5 text-sm font-semibold text-primary-foreground"
        >
          Xem chỗ đang giữ
        </Link>
        <Link
          to="/tour"
          className="inline-flex h-12 items-center rounded-full border bg-card px-5 text-sm font-semibold"
        >
          Tour
        </Link>
        <Link
          to="/khach-san"
          className="inline-flex h-12 items-center rounded-full border bg-card px-5 text-sm font-semibold"
        >
          Khách sạn
        </Link>
        <Link
          to="/ve"
          className="inline-flex h-12 items-center rounded-full border bg-card px-5 text-sm font-semibold"
        >
          Vé Phú Quốc
        </Link>
      </div>
    </div>
  );
}
