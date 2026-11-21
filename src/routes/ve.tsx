import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SHOW_SCHEDULE, TABLES, formatVnd, priceDays, quote, saveHold, todayIso, type TableId } from "@/lib/services";
import { symphonyEventJsonLd } from "@/lib/event-schema";
import { pageTitle, seoHead } from "@/lib/seo";
import { imgProps } from "@/lib/images";
import { createPayment } from "@/lib/payment";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { recordServiceBooking } from "@/lib/service-bookings";

export const Route = createFileRoute("/ve")({
  head: () =>
    seoHead({
      title: "Symphony of the Sea — vé Phú Quốc — DFxTrip",
      description:
        "Giữ vé Symphony of the Sea tại Sun Bavaria, Phú Quốc. Người lớn 1.200.000đ hoặc 1.300.000đ. Phụ thu bàn sát biển tính theo bàn.",
      path: "/ve",
      jsonLd: symphonyEventJsonLd(),
    }),
  component: TicketPage,
});

function Stepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-base font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="grid size-12 place-items-center rounded-full border bg-card text-2xl"
          onClick={() => onChange(Math.max(0, value - 1))}
          aria-label={`Giảm ${label}`}
        >
          −
        </button>
        <span className="w-8 text-center text-xl font-semibold">{value}</span>
        <button
          type="button"
          className="grid size-12 place-items-center rounded-full bg-primary text-2xl text-primary-foreground"
          onClick={() => onChange(value + 1)}
          aria-label={`Tăng ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

function TicketPage() {
  const navigate = useNavigate();
  const { user } = useCurrentUserState();
  const [date, setDate] = useState(todayIso);
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [infants, setInfants] = useState(0);
  const [tableId, setTableId] = useState<TableId>("none");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const price = quote({ date, adults, kids, infants, tableId });

  async function hold() {
    if (name.trim().length < 2 || phone.trim().length < 8) {
      setError("Cần tên và số điện thoại để giữ chỗ trên máy này.");
      return;
    }
    if (price.empty) {
      setError("Chọn ít nhất một khách.");
      return;
    }
    if (price.tooSmall) {
      setError("Số người đông hơn chỗ ngồi của bàn đã chọn. Chọn bàn lớn hơn.");
      return;
    }
    const hold = saveHold({
      id: `SB-${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`,
      date,
      adults,
      kids,
      infants,
      tableId,
      name: name.trim(),
      phone: phone.trim(),
      ticketTotal: price.ticket,
      tableFee: price.fee,
      total: price.total,
      createdAt: new Date().toISOString(),
    })[0];
    if (!hold) return;
    if (user && !user.isDevFallback) {
      try {
        await recordServiceBooking({
          data: {
            serviceType: "show",
            productId: "symphony-of-the-sea",
            adults,
            children: kids,
            tableId,
            showDate: date,
            guestName: name.trim(),
            guestPhone: phone.trim(),
          },
        });
      } catch {
        // Giữ chỗ trên máy vẫn tiếp tục khi SQL chưa ghi được.
      }
    }
    const payment = createPayment({
      kind: "ticket",
      ref: hold.id,
      title: "Symphony of the Sea",
      amount: hold.total,
    });
    navigate({ to: "/thanh-toan/$code", params: { code: payment.code } });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Sự kiện Phú Quốc</p>
      <h1 className="mt-1 font-display text-4xl font-bold leading-tight">Symphony of the Sea</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sun Bavaria, Thị trấn Hoàng Hôn. Phụ thu bàn sát biển đang chạy thử, chưa có thông báo chính thức. Khách đăng ký
        nâng cấp tại nhà hàng.
      </p>

      <section className="mt-5 overflow-hidden rounded-3xl border bg-card">
        <h2 className="bg-secondary px-4 py-3 text-center font-semibold text-secondary-foreground">
          Lịch trình buổi tối
        </h2>
        <ul>
          {SHOW_SCHEDULE.map((item) => (
            <li key={item.time} className="flex gap-3 border-t p-4">
              <img
                {...imgProps(item.image, "64px")}
                alt=""
                loading="lazy"
                decoding="async"
                className="size-16 shrink-0 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-primary">{item.time}</p>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-5 overflow-hidden rounded-3xl border bg-card">
        <h2 className="bg-secondary px-4 py-3 text-center font-semibold text-secondary-foreground">
          Phụ thu theo loại bàn
        </h2>
        <button
          type="button"
          onClick={() => setTableId("none")}
          className={`grid w-full grid-cols-2 px-4 py-4 text-left ${tableId === "none" ? "bg-accent" : ""}`}
        >
          <span>Chưa chọn bàn</span>
          <span className="text-right font-semibold">0đ</span>
        </button>
        {TABLES.map((table) => (
          <button
            key={table.id}
            type="button"
            onClick={() => setTableId(table.id)}
            className={`grid w-full grid-cols-2 border-t px-4 py-4 text-left ${tableId === table.id ? "bg-accent" : ""}`}
          >
            <span>{table.label}</span>
            <span className="text-right font-semibold text-primary">{formatVnd(table.fee)}</span>
          </button>
        ))}
      </section>

      <section className="mt-6 space-y-4 rounded-3xl border bg-card p-4">
        <label className="block">
          <span className="font-medium">Ngày đến</span>
          <span className="mt-1 block text-sm text-muted-foreground">
            Bấm một ngày để so giá người lớn. Thứ Sáu và thứ Bảy là 1.300.000đ, các ngày khác 1.200.000đ.
          </span>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {priceDays(todayIso()).map((day) => {
              const selected = day.iso === date;
              return (
                <button
                  key={day.iso}
                  type="button"
                  aria-pressed={selected}
                  aria-label={`${day.weekday} ${day.day}, người lớn ${formatVnd(day.adult)}`}
                  onClick={() => setDate(day.iso)}
                  className={`w-20 shrink-0 rounded-2xl border px-2 py-2 text-center ${selected ? "border-primary bg-accent" : "bg-background"}`}
                >
                  <span className="block text-xs text-muted-foreground">{day.weekday}</span>
                  <span className="block text-lg font-semibold">{day.day}</span>
                  <span className="block text-[11px] font-semibold text-primary">
                    {day.weekend ? "1,3 tr" : "1,2 tr"}
                  </span>
                </button>
              );
            })}
          </div>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="mt-2 h-12 w-full rounded-2xl border bg-background px-3"
          />
          <span className="mt-1 block text-sm text-muted-foreground">
            {price.weekend ? "Thứ Sáu hoặc thứ Bảy" : "Chủ nhật đến thứ Năm"} · người lớn {formatVnd(price.adult)} · trẻ
            1m–1,4m {formatVnd(price.kid)}
          </span>
        </label>
        <Stepper label="Người lớn" value={adults} onChange={setAdults} />
        <Stepper label="Trẻ 1m–1,4m" value={kids} onChange={setKids} />
        <Stepper label="Trẻ dưới 1m" value={infants} onChange={setInfants} />
        <p className="text-sm text-muted-foreground">Trẻ dưới 1m miễn phí và không tính vào chỗ ngồi của bàn.</p>
        <label className="block">
          <span className="font-medium">Tên của quý khách</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 h-12 w-full rounded-2xl border bg-background px-3"
          />
        </label>
        <label className="block">
          <span className="font-medium">Số điện thoại</span>
          <input
            inputMode="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="mt-1 h-12 w-full rounded-2xl border bg-background px-3"
          />
        </label>
        {error ? <p className="text-sm font-medium text-primary">{error}</p> : null}
        <p className="flex justify-between text-sm">
          <span>Vé</span>
          <span>{formatVnd(price.ticket)}</span>
        </p>
        <p className="flex justify-between text-sm">
          <span>Phụ thu bàn</span>
          <span>{formatVnd(price.fee)}</span>
        </p>
        <p className="flex justify-between text-lg font-semibold">
          <span>Tổng</span>
          <span>{formatVnd(price.total)}</span>
        </p>
        <button
          type="button"
          onClick={hold}
          className="flex h-14 w-full items-center justify-center rounded-full bg-[image:var(--gradient-primary)] text-base font-semibold text-primary-foreground"
        >
          Giữ vé và hiện mã chuyển khoản
        </button>
      </section>
    </div>
  );
}
