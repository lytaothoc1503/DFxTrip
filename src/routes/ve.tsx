import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/shell";
import {
  SHOW_SCHEDULE,
  TABLES,
  formatVnd,
  quote,
  saveHold,
  type TableId,
} from "@/lib/services";

export const Route = createFileRoute("/ve")({ component: TicketPage });

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
      <span className="text-lg font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="h-14 w-14 rounded-full border border-line bg-surface text-2xl"
          onClick={() => onChange(Math.max(0, value - 1))}
          aria-label={`Giảm ${label}`}
        >
          −
        </button>
        <span className="w-10 text-center text-2xl font-semibold">{value}</span>
        <button
          type="button"
          className="h-14 w-14 rounded-full bg-brand text-2xl text-on-brand"
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
  const [date, setDate] = useState("2026-11-19");
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [infants, setInfants] = useState(0);
  const [tableId, setTableId] = useState<TableId>("none");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const price = quote({ date, adults, kids, infants, tableId });

  function hold() {
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
    saveHold({
      id: `SB-${Date.now().toString().slice(-6)}`,
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
    });
    navigate({ to: "/dat-cho" });
  }

  return (
    <Shell>
      <p className="text-sm font-semibold text-brand">SUN BAVARIA</p>
      <h1 className="display mt-1 text-4xl leading-tight">Giữ vé và chọn bàn sát biển</h1>

      <div className="mt-4 rounded-card border border-brand/30 bg-note p-4 text-base">
        Phụ thu bàn sát biển đang chạy thử, chưa có thông báo chính thức. Khách đăng ký nâng cấp trực tiếp tại nhà hàng.
      </div>

      <section className="mt-5 overflow-hidden rounded-card border border-line bg-surface">
        <h2 className="bg-navy px-4 py-3 text-center text-lg font-semibold text-on-navy">
          Lịch trình xem show Symphony of the Sea
        </h2>
        <ul>
          {SHOW_SCHEDULE.map((item) => (
            <li key={item.time} className="flex gap-3 border-t border-line p-4">
              <img src={item.image} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover" />
              <div>
                <p className="text-lg font-semibold text-brand">{item.time}</p>
                <p className="text-base font-medium">{item.title}</p>
                <p className="text-sm text-muted">{item.detail}</p>
              </div>
            </li>
          ))}
        </ul>
        <img
          src="/photos/symphony-schedule.jpg"
          alt="Poster lịch trình Symphony of the Sea tại Sun Bavaria"
          className="w-full border-t border-line object-cover"
        />
      </section>

      <section className="mt-5 overflow-hidden rounded-card border border-line bg-surface">
        <h2 className="bg-navy px-4 py-3 text-center font-semibold text-on-navy">Mức phụ thu theo loại bàn</h2>
        <div className="grid grid-cols-2 bg-rose px-4 py-2 text-sm font-semibold">
          <span>Loại bàn</span>
          <span className="text-right">Phụ thu</span>
        </div>
        <button
          type="button"
          onClick={() => setTableId("none")}
          className={`grid w-full grid-cols-2 px-4 py-4 text-left text-lg ${tableId === "none" ? "bg-example" : ""}`}
        >
          <span>Chưa chọn bàn</span>
          <span className="text-right font-semibold">0đ</span>
        </button>
        {TABLES.map((table) => (
          <button
            key={table.id}
            type="button"
            onClick={() => setTableId(table.id)}
            className={`grid w-full grid-cols-2 border-t border-line px-4 py-4 text-left text-lg ${
              tableId === table.id ? "bg-example" : ""
            }`}
          >
            <span>{table.label}</span>
            <span className="text-right text-lg font-semibold text-rose-ink">{formatVnd(table.fee)}</span>
          </button>
        ))}
      </section>

      <section className="mt-6 space-y-4 rounded-card border border-line bg-surface p-4">
        <label className="block">
          <span className="text-base font-medium">Ngày đến</span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="mt-1 h-14 w-full rounded-2xl border border-line bg-bg px-3 text-lg"
          />
          <span className="mt-1 block text-base text-muted">
            {price.weekend ? "Thứ Sáu hoặc thứ Bảy" : "Chủ nhật đến thứ Năm"} · người lớn {formatVnd(price.adult)} ·
            trẻ 1m–1,4m {formatVnd(price.kid)}
          </span>
        </label>
        <Stepper label="Người lớn" value={adults} onChange={setAdults} />
        <Stepper label="Trẻ 1m–1,4m" value={kids} onChange={setKids} />
        <Stepper label="Trẻ dưới 1m" value={infants} onChange={setInfants} />
        <p className="text-base text-muted">Trẻ dưới 1m miễn phí và không tính vào chỗ ngồi của bàn.</p>
        <label className="block">
          <span className="text-base font-medium">Tên của quý khách</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 h-14 w-full rounded-2xl border border-line bg-bg px-3 text-lg"
          />
        </label>
        <label className="block">
          <span className="text-base font-medium">Số điện thoại</span>
          <input
            inputMode="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="mt-1 h-14 w-full rounded-2xl border border-line bg-bg px-3 text-lg"
          />
        </label>
        {error ? <p className="text-base font-medium text-brand">{error}</p> : null}
        <div className="space-y-1 text-base">
          <p className="flex justify-between">
            <span>Vé</span>
            <span>{formatVnd(price.ticket)}</span>
          </p>
          <p className="flex justify-between">
            <span>Phụ thu bàn</span>
            <span>{formatVnd(price.fee)}</span>
          </p>
          <p className="flex justify-between text-xl font-semibold">
            <span>Tổng</span>
            <span>{formatVnd(price.total)}</span>
          </p>
        </div>
        <button type="button" onClick={hold} className="h-14 w-full rounded-full bg-brand text-lg font-semibold text-on-brand">
          Giữ vé trên máy này
        </button>
        <p className="text-base text-muted">
          Chưa trừ tiền và chưa giữ bàn thật. Nâng cấp bàn sát biển vẫn đăng ký tại nhà hàng.
        </p>
      </section>
    </Shell>
  );
}
