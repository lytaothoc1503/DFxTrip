import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { authClient, GROK_PROVIDERS, signIn, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listMyBookings, type AccountBooking } from "@/lib/service-bookings";
import { formatVnd } from "@/lib/services";

export const Route = createFileRoute("/tai-khoan")({
  head: () => ({
    meta: [
      { title: "Tài khoản — DFxTrip" },
      { name: "description", content: "Đăng nhập để lưu phòng và vé vào tài khoản." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState<AccountBooking[]>([]);

  useEffect(() => {
    if (!user || user.isDevFallback) return;
    let alive = true;
    listMyBookings()
      .then((list) => {
        if (alive) setRows(list);
      })
      .catch(() => {
        if (alive) setRows([]);
      });
    return () => {
      alive = false;
    };
  }, [user]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!email.includes("@") || password.length < 8) {
      setError("Cần email hợp lệ và mật khẩu từ 8 ký tự.");
      return;
    }
    setBusy(true);
    const result =
      mode === "up"
        ? await authClient.signUp.email({ name: name.trim() || "Khách", email: email.trim(), password })
        : await authClient.signIn.email({ email: email.trim(), password });
    setBusy(false);
    if (result.error) {
      setError(mode === "up" ? "Chưa tạo được tài khoản. Email này có thể đã dùng." : "Email hoặc mật khẩu chưa đúng.");
    }
  }

  if (isPending) {
    return (
      <div className="mx-auto max-w-xl px-4 pb-28 pt-8 sm:px-6">
        <h1 className="font-display text-3xl font-bold">Tài khoản</h1>
        <p className="mt-3 text-muted-foreground">Đang kiểm tra phiên đăng nhập.</p>
      </div>
    );
  }

  if (!user || user.isDevFallback) {
    return (
      <div className="mx-auto max-w-xl px-4 pb-28 pt-8 sm:px-6">
        <h1 className="font-display text-3xl font-bold">{mode === "up" ? "Tạo tài khoản" : "Đăng nhập"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Đăng nhập để đơn phòng và vé được ghi vào cơ sở dữ liệu, gắn với email này.
        </p>
        <div className="mt-6 space-y-2">
          {GROK_PROVIDERS.map((provider) => (
            <button
              key={provider.providerId}
              type="button"
              disabled={busy}
              onClick={() => {
                setError("");
                setBusy(true);
                void signIn(provider.providerId, { callbackURL: "/tai-khoan" })
                  .catch(() => setError("Chưa đăng nhập được. Thử email hoặc cho phép cửa sổ đăng nhập."))
                  .finally(() => setBusy(false));
              }}
              className="flex h-12 w-full items-center justify-center rounded-full border text-sm font-semibold"
            >
              Tiếp tục với {provider.label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">hoặc email</p>
        <form onSubmit={submit} className="mt-3 space-y-3">
          {mode === "up" ? (
            <label className="block text-sm font-medium">
              Tên
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1 h-12 w-full rounded-2xl border bg-background px-3"
              />
            </label>
          ) : null}
          <label className="block text-sm font-medium">
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 h-12 w-full rounded-2xl border bg-background px-3"
            />
          </label>
          <label className="block text-sm font-medium">
            Mật khẩu
            <input
              type="password"
              autoComplete={mode === "up" ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 h-12 w-full rounded-2xl border bg-background px-3"
            />
          </label>
          {error ? <p className="text-sm font-medium text-primary">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="flex h-12 w-full items-center justify-center rounded-full bg-[image:var(--gradient-primary)] text-sm font-semibold text-primary-foreground"
          >
            {busy ? "Đang xử lý" : mode === "up" ? "Tạo tài khoản" : "Đăng nhập"}
          </button>
        </form>
        <button
          type="button"
          className="mt-4 text-sm font-semibold text-primary"
          onClick={() => {
            setMode(mode === "up" ? "in" : "up");
            setError("");
          }}
        >
          {mode === "up" ? "Đã có tài khoản? Đăng nhập" : "Chưa có tài khoản? Tạo mới"}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 pb-28 pt-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold">{user.displayName || "Tài khoản"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{user.primaryEmail}</p>
      <h2 className="mt-8 font-display text-2xl font-bold">Đơn đã ghi</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Chưa có đơn trong cơ sở dữ liệu.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {rows.map((row) => (
            <li key={row.code} className="rounded-3xl border bg-card p-4">
              <p className="font-semibold">{row.code}</p>
              <p className="text-sm text-muted-foreground">
                {row.service_type === "show" ? "Vé show" : row.service_type === "hotel" ? "Phòng" : "Tour"} ·{" "}
                {row.product_id}
              </p>
              <p className="mt-1 font-semibold text-primary">{formatVnd(row.total)}</p>
            </li>
          ))}
        </ul>
      )}
      <Link to="/ve" className="mt-6 inline-block text-sm font-semibold text-primary">
        Giữ vé Symphony of the Sea
      </Link>
      <button
        type="button"
        className="mt-4 block text-sm font-semibold text-primary"
        onClick={() => void signOut("/tai-khoan")}
      >
        Đăng xuất
      </button>
    </div>
  );
}
