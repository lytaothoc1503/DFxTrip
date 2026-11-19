import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/tai-khoan")({
  head: () => ({
    meta: [
      { title: "Tài khoản — DFxTrip" },
      { name: "description", content: "Tài khoản chưa bật. Chỗ giữ nằm trên máy này." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  return (
    <div className="mx-auto max-w-xl px-4 pb-28 pt-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Tài khoản</h1>
      <p className="mt-3 text-base text-muted-foreground">
        Đăng nhập chưa mở. Phòng và vé sự kiện được giữ trên chính máy này, chưa gửi đi nhà hàng.
      </p>
      <Link
        to="/ve"
        className="mt-6 flex h-12 items-center justify-center rounded-full bg-[image:var(--gradient-primary)] text-sm font-semibold text-primary-foreground"
      >
        Xem vé Symphony of the Sea
      </Link>
    </div>
  );
}
