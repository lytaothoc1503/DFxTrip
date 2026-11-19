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
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Tìm tên hoặc thành phố"
        className="mt-4 h-12 w-full rounded-full border border-line bg-surface px-4"
      />
      <ul className="mt-4 space-y-3">
        {hotels.map((hotel) => (
          <li key={hotel.id}>
            <Link to="/khach-san/$id" params={{ id: hotel.id }} className="flex gap-3 rounded-card bg-surface p-3">
              <img src={hotel.image} alt="" className="h-24 w-24 rounded-2xl object-cover" />
              <span>
                <span className="block font-semibold">{hotel.name}</span>
                <span className="block text-sm text-muted">{hotel.city} · {hotel.stars} sao · {hotel.score}</span>
                <span className="mt-1 block font-semibold">{formatVnd(hotel.price)} / đêm</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {hotels.length === 0 ? <p className="mt-4 text-muted">Không có khách sạn khớp.</p> : null}
    </Shell>
  );
}