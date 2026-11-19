import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { formatVnd as money, getHotel, loadStays, removeStay, type Stay } from "@/lib/hotels";
import { formatVnd, loadHolds, removeHold, tableById, type Hold } from "@/lib/services";

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
      <p className="mt-2 text-base text-muted">Chỉ lưu trên máy này. Không phải vé hay phòng đã xác nhận.</p>

      <h2 className="mt-8 text-2xl font-semibold">Phòng</h2>
      {stays.length === 0 ? (
        <div className="mt-4 rounded-card border border-line bg-surface p-5">
          <p className="text-lg">Chưa giữ phòng trên máy này.</p>
          <Link
            to="/kham-pha"
            className="mt-5 flex h-14 w-full items-center justify-center rounded-full bg-brand text-lg font-semibold text-on-brand"
          >
            Giữ phòng
          </Link>
        </div>
      ) : (
        <ul className="mt-4 space-y-4">
          {stays.map((stay) => (
            <li key={stay.id} className="rounded-card border border-line bg-surface p-5">
              <p className="text-base font-semibold text-brand">{stay.id}</p>
              <p className="mt-2 text-xl font-medium">{getHotel(stay.hotelId)?.name}</p>
              <p className="mt-1 text-base text-muted">
                {stay.room} · {stay.checkIn} – {stay.checkOut} · {stay.nights} đêm · {stay.guests} khách
              </p>
              <p className="mt-1 text-base">
                {stay.name} · {stay.phone}
              </p>
              <p className="mt-3 text-2xl font-semibold">{money(stay.total)}</p>
              <button
                type="button"
                className="mt-4 h-14 w-full rounded-full border border-line text-lg font-semibold"
                onClick={() => setStays(removeStay(stay.id))}
              >
                Xóa giữ chỗ phòng
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-8 text-2xl font-semibold">Vé show</h2>
      {holds.length === 0 ? (
        <div className="mt-4 rounded-card border border-line bg-surface p-5">
          <p className="text-lg">Chưa giữ vé trên máy này.</p>
          <Link
            to="/ve"
            className="mt-5 flex h-14 w-full items-center justify-center rounded-full bg-brand text-lg font-semibold text-on-brand"
          >
            Giữ vé
          </Link>
        </div>
      ) : (
        <ul className="mt-4 space-y-4">
          {holds.map((hold) => {
            const table = tableById(hold.tableId);
            return (
              <li key={hold.id} className="rounded-card border border-line bg-surface p-5">
                <p className="text-base font-semibold text-brand">{hold.id}</p>
                <p className="mt-2 text-xl font-medium">
                  {hold.name} · {hold.phone}
                </p>
                <p className="mt-1 text-base text-muted">
                  {hold.date} · {hold.adults} người lớn · {hold.kids} trẻ · {hold.infants} dưới 1m
                </p>
                <p className="mt-1 text-base">{table ? table.label : "Chưa chọn bàn sát biển"}</p>
                <p className="mt-3 text-2xl font-semibold">{formatVnd(hold.total)}</p>
                <button
                  type="button"
                  className="mt-4 h-14 w-full rounded-full border border-line text-lg font-semibold"
                  onClick={() => setHolds(removeHold(hold.id))}
                >
                  Xóa giữ chỗ vé
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Shell>
  );
}
