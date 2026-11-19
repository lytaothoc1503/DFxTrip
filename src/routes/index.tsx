import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { CITIES, HOTELS, formatVnd, loadFavs, toggleFav } from "@/lib/hotels";
import { TABLES } from "@/lib/tickets";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [favs, setFavs] = useState<string[]>([]);
  const [city, setCity] = useState("Tất cả");

  useEffect(() => {
    setFavs(loadFavs());
  }, []);

  const shown = HOTELS.filter((hotel) => city === "Tất cả" || hotel.city === city);

  return (
    <Shell>
      <p className="text-base text-muted">Giá phòng là dữ liệu mẫu, chưa phải phòng trống thật.</p>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {["Tất cả", ...CITIES].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCity(item)}
            className={`h-12 shrink-0 rounded-full px-5 text-base ${
              city === item ? "bg-brand text-on-brand" : "bg-surface text-ink"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="mt-6">
        <div className="flex items-end justify-between gap-3">
          <h2 className="display text-3xl leading-tight">Khách sạn được yêu thích</h2>
          <Link to="/kham-pha" className="shrink-0 text-base font-semibold text-brand">
            Xem tất cả
          </Link>
        </div>

        <ul className="mt-4 space-y-4">
          {shown.map((hotel) => (
            <li key={hotel.id} className="overflow-hidden rounded-card bg-surface">
              <div className="relative">
                <img src={hotel.image} alt="" className="h-48 w-full object-cover" />
                <button
                  type="button"
                  aria-label="Yêu thích"
                  onClick={() => setFavs(toggleFav(hotel.id))}
                  className="absolute right-3 top-3 grid h-12 w-12 place-items-center rounded-full bg-surface"
                >
                  <Heart size={20} className={favs.includes(hotel.id) ? "fill-brand text-brand" : "text-ink"} />
                </button>
              </div>
              <div className="space-y-2 p-4">
                <p className="text-xl font-semibold leading-snug">{hotel.name}</p>
                <p className="text-base text-muted">
                  {hotel.score} · {hotel.city} · {hotel.stars} sao
                </p>
                <p className="text-lg">
                  <span className="font-semibold">{formatVnd(hotel.price)}</span>
                  <span className="ml-2 text-base text-muted line-through">{formatVnd(hotel.oldPrice)}</span>
                  <span className="ml-1 text-base text-muted">/ đêm</span>
                </p>
                <Link
                  to="/khach-san/$id"
                  params={{ id: hotel.id }}
                  className="mt-2 flex h-14 w-full items-center justify-center rounded-full bg-brand text-lg font-semibold text-on-brand"
                >
                  Giữ phòng
                </Link>
              </div>
            </li>
          ))}
        </ul>
        {shown.length === 0 ? <p className="mt-4 text-base text-muted">Không có khách sạn ở thành phố này.</p> : null}
      </section>

      <section className="mt-8 overflow-hidden rounded-card border border-line bg-surface">
        <img src="/photos/terrace.jpg" alt="Bàn sát biển lúc hoàng hôn" className="h-48 w-full object-cover" />
        <div className="space-y-3 p-5">
          <p className="text-sm font-semibold tracking-wide text-brand">THÊM · SUN BAVARIA</p>
          <h2 className="display text-3xl leading-tight">Phụ thu bàn sát biển</h2>
          <p className="text-base text-muted">
            Đang chạy thử, chưa có thông báo chính thức. Phụ thu tính theo loại bàn, không theo số khách ngồi.
          </p>
          <ul>
            {TABLES.map((table) => (
              <li key={table.id} className="flex justify-between border-t border-line py-3 text-base">
                <span>{table.label}</span>
                <span className="font-semibold text-rose-ink">{formatVnd(table.fee)}</span>
              </li>
            ))}
          </ul>
          <p className="text-base">2 khách chọn bàn 4: phụ thu 800.000đ. Chọn bàn 6: phụ thu 1.200.000đ.</p>
          <Link
            to="/ve"
            className="flex h-14 w-full items-center justify-center rounded-full bg-navy text-lg font-semibold text-on-navy"
          >
            Giữ vé và chọn bàn
          </Link>
        </div>
      </section>
    </Shell>
  );
}
