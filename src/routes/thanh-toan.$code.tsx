import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { formatVnd } from "@/lib/services";
import {
  BANKS,
  envPayeeLocked,
  loadPayee,
  markReported,
  paymentByCode,
  savePayee,
  vietQrUrl,
  type Payee,
} from "@/lib/payment";

export const Route = createFileRoute("/thanh-toan/$code")({
  head: () => ({
    meta: [
      { title: "Thanh toán chuyển khoản — DFxTrip" },
      {
        name: "description",
        content: "Chuyển khoản đúng số tiền và nội dung. Báo đã chuyển chưa có nghĩa là vé đã được xác nhận.",
      },
    ],
  }),
  component: PayPage,
});

function PayPage() {
  const { code } = Route.useParams();
  const [payment, setPayment] = useState(() => paymentByCode(code));
  const [payee, setPayee] = useState<Payee>(() => loadPayee());
  const [draft, setDraft] = useState<Payee>(() => loadPayee());
  const [copied, setCopied] = useState("");
  const locked = envPayeeLocked();
  const qr = payment ? vietQrUrl(payee, payment.amount, payment.memo) : "";

  async function copy(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
    } catch {
      setCopied("");
    }
  }

  if (!payment) {
    return (
      <div className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:px-6">
        <h1 className="font-display text-3xl font-bold">Không thấy mã thanh toán</h1>
        <Link to="/dat-cho" className="mt-4 inline-block font-semibold text-primary">
          Về chỗ đang giữ
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Chuyển khoản VietQR</p>
      <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">{payment.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Quét mã trong ứng dụng ngân hàng. Số tiền và nội dung phải đúng từng ký tự. Báo đã chuyển khoản chưa có nghĩa là
        vé hoặc phòng đã được xác nhận.
      </p>

      <section className="mt-5 rounded-3xl border bg-card p-4">
        <p className="text-sm text-muted-foreground">Số tiền</p>
        <p className="font-display text-4xl font-bold text-primary">{formatVnd(payment.amount)}</p>
        <p className="mt-4 text-sm text-muted-foreground">Nội dung chuyển khoản</p>
        <p className="text-2xl font-semibold tracking-wide">{payment.memo}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="h-12 rounded-full border px-4 font-semibold"
            onClick={() => copy("tiền", String(payment.amount))}
          >
            {copied === "tiền" ? "Đã chép số tiền" : "Chép số tiền"}
          </button>
          <button
            type="button"
            className="h-12 rounded-full border px-4 font-semibold"
            onClick={() => copy("nội dung", payment.memo)}
          >
            {copied === "nội dung" ? "Đã chép nội dung" : "Chép nội dung"}
          </button>
        </div>
      </section>

      {qr ? (
        <section className="mt-4 rounded-3xl border bg-card p-4 text-center">
          <img
            src={qr}
            alt={`Mã VietQR ${formatVnd(payment.amount)}, nội dung ${payment.memo}`}
            width={320}
            height={320}
            className="mx-auto w-full max-w-xs"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            {payee.bank} · {payee.account} · {payee.name}
          </p>
        </section>
      ) : (
        <p className="mt-4 rounded-3xl border bg-card p-4 text-sm">
          Chưa gắn tài khoản nhận nên chưa có mã trừ tiền. Khách chưa thể quét để chuyển khoản.
        </p>
      )}

      {payment.status === "reported" ? (
        <p className="mt-4 rounded-3xl bg-accent p-4 text-sm font-medium">
          Đã ghi nhận bạn báo chuyển khoản. Quán chưa đối soát với ngân hàng.
        </p>
      ) : (
        <button
          type="button"
          className="mt-4 flex h-14 w-full items-center justify-center rounded-full bg-[image:var(--gradient-primary)] text-base font-semibold text-primary-foreground"
          onClick={() => setPayment(markReported(payment.code))}
        >
          Tôi đã chuyển khoản
        </button>
      )}

      {!locked ? (
        <section className="mt-6 rounded-3xl border bg-card p-4">
          <h2 className="font-semibold">Dành cho chủ quán</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Khách không nhập thẻ ở đây. Gắn số tài khoản nhận để mã VietQR hiện ra trên máy này.
          </p>
          <label className="mt-3 block text-sm font-medium">
            Ngân hàng
            <select
              value={draft.bank}
              onChange={(event) => setDraft({ ...draft, bank: event.target.value })}
              className="mt-1 h-12 w-full rounded-2xl border bg-background px-3"
            >
              <option value="">Chọn ngân hàng</option>
              {BANKS.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.label}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-3 block text-sm font-medium">
            Số tài khoản
            <input
              inputMode="numeric"
              value={draft.account}
              onChange={(event) => setDraft({ ...draft, account: event.target.value })}
              className="mt-1 h-12 w-full rounded-2xl border bg-background px-3"
            />
          </label>
          <label className="mt-3 block text-sm font-medium">
            Tên chủ tài khoản
            <input
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              className="mt-1 h-12 w-full rounded-2xl border bg-background px-3"
            />
          </label>
          <button
            type="button"
            className="mt-3 h-12 rounded-full bg-secondary px-4 font-semibold text-secondary-foreground"
            onClick={() => {
              savePayee(draft);
              setPayee(loadPayee());
            }}
          >
            Tạo mã VietQR
          </button>
        </section>
      ) : null}

      <Link to="/dat-cho" className="mt-6 inline-block text-sm font-semibold text-primary">
        Xem chỗ đang giữ
      </Link>
    </div>
  );
}
