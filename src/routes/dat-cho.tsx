import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { formatVnd as money, getHotel, loadStays, type Stay } from "@/lib/hotels";
import { formatVnd, loadHolds, tableById, type Hold } from "@/lib/tickets";

export const Route = createFileRoute("/dat-cho")({ component: HoldsPage });

function HoldsPage() {
  const [holds, setHolds] = useState<Hold[]>([]);
  const [stays, setStays] = useState<Stay[]>([]);

  useEffect(() => {
    setHolds(loadHolds());
    setStays(loadStays());
  }, []);

  return (
    <Shell>
      <h1 className="display text-4xl">Đặt chỗ</h1>
      <p className="mt-1 text-sm text-muted">Chỉ lưu trên máy này. Không phải vé hay phòng đã xác nhận.</p>

      <h2 className="mt-6 text-lg font-semibold">Phòng</h2>
      {stays.length === 0 ? (
        <p className="mt-2 text-sm text-muted">Chưa giữ phòng.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {stays.map((stay) => (
            <li key={stay.id} className="rounded-card border border-line bg-surface p-4">
              <p className="text-sm font-semibold text-brand">{stay.id}</p>
              <p className="mt-1 font-medium">{getHotel(stay.hotelId)?.name}</p>
              <p className="text-sm text-muted">
                {stay.room} · {stay.checkIn} – {stay.checkOut} · {stay.nights} đêm · {stay.guests} khách
              </p>
              <p className="text-sm">{stay.name} · {stay.phone}</p>
              <p className="mt-2 text-lg font-semibold">{money(stay.total)}</p>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-6 text-lg font-semibold">Vé show</h2>
      {holds.length === 0 ? (
        <div className="mt-3 rounded-card border border-line bg-surface p-5">
          <p>Chưa có vé nào được giữ.</p>
          <Link to="/ve" className="mt-4 inline-flex h-12 items-center rounded-full bg-brand px-5 font-semibold text-on-brand">
            Chọn vé
          </Link>
        </div>
      ) : (
        <ul className="mt-3 space-y-3">
          {holds.map((hold) => {
            const table = tableById(hold.tableId);
            return (
              <li key={hold.id} className="rounded-card border border-line bg-surface p-4">
                <p className="text-sm font-semibold text-brand">{hold.id}</p>
                <p className="mt-1 font-medium">{hold.name} · {hold.phone}</p>
                <p className="text-sm text-muted">
                  {hold.date} · {hold.adults} người lớn · {hold.kids} trẻ · {hold.infants} dưới 1m
                </p>
                <p className="text-sm">{table ? table.label : "Chưa chọn bàn sát biển"}</p>
                <p className="mt-2 text-lg font-semibold">{formatVnd(hold.total)}</p>
              </li>
            );
          })}
        </ul>
      )}
    </Shell>
  );
}
