import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadBookings, removeBooking } from "@/lib/bookings";
import { formatVnd, getHotel } from "@/lib/hotels";
import { formatVnd as money, loadHolds, removeHold, tableById } from "@/lib/services";

export const Route = createFileRoute("/dat-cho")({
  head: () => ({
    meta: [
      { title: "Đặt chỗ — DFxTrip" },
      { name: "description", content: "Chỗ phòng và vé sự kiện đang giữ trên máy này." },
    ],
  }),
  component: HoldsPage,
});

function HoldsPage() {
  const [stays, setStays] = useState(loadBookings());
  const [holds, setHolds] = useState(loadHolds());

  useEffect(() => {
    setStays(loadBookings());
    setHolds(loadHolds());
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:px-6">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">
        Đặt chỗ <span className="italic text-primary">trên máy</span>
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Chưa phải phòng hay vé đã xác nhận.</p>

      <h2 className="mt-8 font-display text-2xl font-bold">Phòng</h2>
      {stays.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Chưa giữ phòng.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {stays.map((stay) => {
            const hotel = getHotel(stay.hotelId);
            return (
              <li key={stay.code} className="rounded-3xl border bg-card p-4">
                <p className="font-semibold">{hotel?.name ?? stay.hotelId}</p>
                <p className="text-sm text-muted-foreground">
                  {stay.roomName} · {stay.checkIn} – {stay.checkOut} · {stay.guests} khách
                </p>
                <p className="mt-1 font-semibold text-primary">{formatVnd(stay.total)}</p>
                <button
                  type="button"
                  className="mt-3 text-sm font-semibold text-primary"
                  onClick={() => setStays(removeBooking(stay.code))}
                >
                  Bỏ giữ chỗ {stay.code}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <h2 className="mt-8 font-display text-2xl font-bold">Vé Symphony of the Sea</h2>
      {holds.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Chưa giữ vé.{" "}
          <Link to="/ve" className="font-semibold text-primary">
            Xem sự kiện Phú Quốc
          </Link>
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {holds.map((hold) => {
            const table = tableById(hold.tableId);
            return (
              <li key={hold.id} className="rounded-3xl border bg-card p-4">
                <p className="font-semibold">{hold.name}</p>
                <p className="text-sm text-muted-foreground">
                  {hold.date} · {hold.adults} người lớn · {hold.kids} trẻ · {table ? table.label : "Chưa chọn bàn"}
                </p>
                <p className="mt-1 font-semibold text-primary">{money(hold.total)}</p>
                <button
                  type="button"
                  className="mt-3 text-sm font-semibold text-primary"
                  onClick={() => setHolds(removeHold(hold.id))}
                >
                  Bỏ giữ vé {hold.id}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
