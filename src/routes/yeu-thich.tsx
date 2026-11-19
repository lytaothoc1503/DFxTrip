import { createFileRoute } from "@tanstack/react-router";
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
        <p className="mt-4 text-muted">Chưa thả tim khách sạn nào trên máy này.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {hotels.map((hotel) => (
            <li key={hotel.id} className="rounded-card bg-surface p-4">
              <p className="font-semibold">{hotel.name}</p>
              <p className="text-sm text-muted">{hotel.city} · {formatVnd(hotel.price)} / đêm</p>
            </li>
          ))}
        </ul>
      )}
    </Shell>
  );
}
