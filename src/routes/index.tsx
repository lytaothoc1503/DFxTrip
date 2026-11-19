import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { BRAND } from "@/lib/brand";
import {
  CITIES,
  HOTELS,
  TOURS,
  discountPercent,
  formatVnd,
  loadFavs,
  ratingLabel,
  toggleFav,
} from "@/lib/hotels";
import { TABLES, formatVnd as money } from "@/lib/services";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [favs, setFavs] = useState<string[]>([]);
  const [city, setCity] = useState("Tất cả");

  useEffect(() => {
    setFavs(loadFavs());
  }, []);

  const shown = HOTELS.filter((hotel) => city === "Tất cả" || hotel.city === city);
  const featuredTours = TOURS.filter((tour) => tour.featured).slice(0, 3);

  return (
    <Shell>
      <div className="flex gap-2 overflow-x-auto pb-2 text-sm">
        {["Đảm bảo giá tốt nhất", "Hỗ trợ 24/7", "Huỷ theo chính sách chỗ nghỉ"].map((item) => (
          <span key={item} className="shrink-0 rounded-full bg-surface px-3 py-2 text-muted">
            {item}
          </span>
        ))}
      </div>

      <p className="mt-3 text-base text-muted">Giá phòng là dữ liệu mẫu, chưa phải phòng trống thật.</p>

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
          {shown.map((hotel) => {
            const off = discountPercent(hotel.price, hotel.oldPrice);
            return (
              <li key={hotel.id} className="overflow-hidden rounded-card bg-surface">
                <div className="relative">
                  <img src={hotel.image} alt="" className="h-48 w-full object-cover" />
                  {hotel.badge ? (
                    <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-sm font-semibold text-on-brand">
                      {hotel.badge}
                    </span>
                  ) : null}
                  {off > 0 ? (
                    <span className="absolute bottom-3 left-3 rounded-full bg-navy px-3 py-1 text-sm font-semibold text-on-navy">
                      −{off}%
                    </span>
                  ) : null}
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
                    {hotel.score} · {ratingLabel(hotel.score)} ({hotel.reviews.toLocaleString("vi-VN")}) · {hotel.city}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">{formatVnd(hotel.price)}</span>
                    <span className="ml-2 text-base text-muted line-through">{formatVnd(hotel.oldPrice)}</span>
                    <span className="ml-1 text-base text-muted">/ đêm</span>
                  </p>
                  <p className="text-sm text-muted">{BRAND.discountLabel} khi giữ phòng.</p>
                  <Link
                    to="/khach-san/$id"
                    params={{ id: hotel.id }}
                    className="mt-2 flex h-14 w-full items-center justify-center rounded-full bg-brand text-lg font-semibold text-on-brand"
                  >
                    Giữ phòng
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
        {shown.length === 0 ? <p className="mt-4 text-base text-muted">Không có khách sạn ở thành phố này.</p> : null}
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-3">
          <h2 className="display text-3xl leading-tight">Tour nổi bật</h2>
          <Link to="/tour" className="shrink-0 text-base font-semibold text-brand">
            Xem tour
          </Link>
        </div>
        <ul className="mt-4 space-y-4">
          {featuredTours.map((tour) => (
            <li key={tour.id} className="overflow-hidden rounded-card bg-surface">
              <img src={tour.image} alt={tour.name} className="h-40 w-full object-cover" />
              <div className="space-y-2 p-4">
                <p className="text-xl font-semibold">{tour.name}</p>
                <p className="text-base text-muted">
                  {tour.duration} · từ {tour.departFrom}
                </p>
                <p className="text-lg font-semibold">{formatVnd(tour.price)}</p>
                <Link
                  to="/tour/$id"
                  params={{ id: tour.id }}
                  className="flex h-14 w-full items-center justify-center rounded-full bg-navy text-lg font-semibold text-on-navy"
                >
                  Xem tour
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 overflow-hidden rounded-card border border-line bg-surface">
        <img src="/photos/terrace.jpg" alt="Bàn sát biển lúc hoàng hôn" className="h-48 w-full object-cover" />
        <div className="space-y-3 p-5">
          <p className="text-sm font-semibold tracking-wide text-brand">THÊM · SUN BAVARIA</p>
          <h2 className="display text-3xl leading-tight">Vé Symphony of the Sea</h2>
          <p className="text-base text-muted">
            Đang chạy thử phụ thu bàn sát biển. Phụ thu tính theo loại bàn, không theo số khách ngồi.
          </p>
          <ul>
            {TABLES.map((table) => (
              <li key={table.id} className="flex justify-between border-t border-line py-3 text-base">
                <span>{table.label}</span>
                <span className="font-semibold text-rose-ink">{money(table.fee)}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/ve"
            className="flex h-14 w-full items-center justify-center rounded-full bg-navy text-lg font-semibold text-on-navy"
          >
            Giữ vé và chọn bàn
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <Link to="/blog" className="flex h-14 w-full items-center justify-center rounded-full border border-line bg-surface text-lg font-semibold">
          Đọc blog du lịch
        </Link>
      </section>
    </Shell>
  );
}
