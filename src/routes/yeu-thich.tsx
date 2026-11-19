import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { HOTELS, formatVnd, loadFavs } from "@/lib/hotels";

export const Route = createFileRoute("/yeu-thich")({ component: Favs });

function Favs() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    setIds(loadFavs());
  }, []);
  const hotels = HOTELS.filter((hotel) => ids.includes(hotel.id));

  return (
    <Shell>
      <h1 className="display text-4xl">Yêu thích</h1>
      {hotels.length === 0 ? (
        <div className="mt-4 rounded-card border border-line bg-surface p-5">
          <p className="text-lg">Chưa thả tim khách sạn nào trên máy này.</p>
          <Link
            to="/kham-pha"
            className="mt-5 flex h-14 w-full items-center justify-center rounded-full bg-brand text-lg font-semibold text-on-brand"
          >
            Xem khách sạn
          </Link>
        </div>
      ) : (
        <ul className="mt-4 space-y-4">
          {hotels.map((hotel) => (
            <li key={hotel.id} className="rounded-card bg-surface p-5">
              <p className="text-xl font-semibold">{hotel.name}</p>
              <p className="mt-1 text-base text-muted">
                {hotel.city} · {formatVnd(hotel.price)} / đêm
              </p>
              <Link
                to="/khach-san/$id"
                params={{ id: hotel.id }}
                className="mt-4 flex h-14 w-full items-center justify-center rounded-full bg-brand text-lg font-semibold text-on-brand"
              >
                Giữ phòng
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Shell>
  );
}
