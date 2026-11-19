import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/shell";
import { HOTELS, formatVnd } from "@/lib/hotels";

export const Route = createFileRoute("/kham-pha")({ component: Explore });

function Explore() {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const hotels = HOTELS.filter((hotel) => {
    if (!needle) return true;
    return hotel.name.toLowerCase().includes(needle) || hotel.city.toLowerCase().includes(needle);
  });

  return (
    <Shell>
      <h1 className="display text-4xl">Khám phá</h1>
      <p className="mt-2 text-base text-muted">Chọn khách sạn mẫu rồi giữ phòng trên máy này.</p>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Tìm tên hoặc thành phố"
        className="mt-4 h-14 w-full rounded-full border border-line bg-surface px-5 text-lg"
      />
      <ul className="mt-4 space-y-4">
        {hotels.map((hotel) => (
          <li key={hotel.id} className="overflow-hidden rounded-card bg-surface">
            <img src={hotel.image} alt="" className="h-44 w-full object-cover" />
            <div className="space-y-2 p-4">
              <p className="text-xl font-semibold leading-snug">{hotel.name}</p>
              <p className="text-base text-muted">
                {hotel.city} · {hotel.stars} sao · {hotel.score}
              </p>
              <p className="text-lg font-semibold">{formatVnd(hotel.price)} / đêm</p>
              <Link
                to="/khach-san/$id"
                params={{ id: hotel.id }}
                className="mt-1 flex h-14 w-full items-center justify-center rounded-full bg-brand text-lg font-semibold text-on-brand"
              >
                Giữ phòng
              </Link>
            </div>
          </li>
        ))}
      </ul>
      {hotels.length === 0 ? <p className="mt-4 text-base text-muted">Không có khách sạn khớp.</p> : null}
    </Shell>
  );
}
