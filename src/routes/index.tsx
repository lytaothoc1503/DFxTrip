import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { CITIES, HOTELS, formatVnd, loadFavs, toggleFav } from "@/lib/hotels";
import { TABLES } from "@/lib/tickets";

export const Route = createFileRoute("/")({ component: Home });

const stories = [
  { src: "/photos/terrace.jpg", label: "Sun Bavaria" },
  { src: "/photos/hotel-1.jpg", label: "Đà Lạt" },
  { src: "/photos/hotel-3.jpg", label: "Nha Trang" },
  { src: "/photos/hotel-4.jpg", label: "Sapa" },
  { src: "/photos/hotel-6.jpg", label: "Hà Nội" },
];

function Home() {
  const [favs, setFavs] = useState<string[]>([]);
  const [city, setCity] = useState("Tất cả");

  useEffect(() => {
    setFavs(loadFavs());
  }, []);

  const shown = HOTELS.filter((hotel) => city === "Tất cả" || hotel.city === city);

  return (
    <Shell>
      <div className="flex gap-2 overflow-x-auto pb-2 text-sm">
        {["Giá phòng là mẫu", "Vé show đã có bảng", "Phụ thu tính theo bàn"].map((item) => (
          <span key={item} className="shrink-0 rounded-full bg-surface px-3 py-2 text-muted">
            {item}
          </span>
        ))}
      </div>

      <section className="mt-4">
        <p className="text-xs font-semibold tracking-wide text-brand">STORIES ĐIỂM ĐẾN</p>
        <ul className="mt-3 flex gap-4 overflow-x-auto pb-1">
          {stories.map((story) => (
            <li key={story.label} className="w-20 shrink-0 text-center text-sm">
              <img src={story.src} alt="" className="mx-auto h-16 w-16 rounded-full border-2 border-brand object-cover" />
              <span className="mt-2 block">{story.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {["Tất cả", ...CITIES].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCity(item)}
            className={`h-11 shrink-0 rounded-full px-4 text-sm ${
              city === item ? "bg-brand text-on-brand" : "bg-surface text-ink"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="mt-6">
        <div className="flex items-end justify-between">
          <h2 className="display text-3xl">Khách sạn được yêu thích</h2>
          <Link to="/kham-pha" className="text-sm font-medium text-brand">
            Xem tất cả
          </Link>
        </div>
        <ul className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {shown.map((hotel) => (
            <li key={hotel.id} className="relative w-64 shrink-0 overflow-hidden rounded-card bg-surface">
              <Link to="/khach-san/$id" params={{ id: hotel.id }} className="block">
                <img src={hotel.image} alt="" className="h-40 w-full object-cover" />
                <div className="space-y-1 p-3 pr-14">
                  <p className="font-semibold leading-snug">{hotel.name}</p>
                  <p className="text-sm text-muted">{hotel.score} · {hotel.city}</p>
                  <p className="text-sm">
                    <span className="font-semibold">{formatVnd(hotel.price)}</span>
                    <span className="ml-2 text-muted line-through">{formatVnd(hotel.oldPrice)}</span>
                  </p>
                </div>
              </Link>
              <button
                type="button"
                aria-label="Yêu thích"
                onClick={() => setFavs(toggleFav(hotel.id))}
                className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-surface"
              >
                <Heart size={18} className={favs.includes(hotel.id) ? "fill-brand text-brand" : "text-ink"} />
              </button>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted">Giá phòng là dữ liệu mẫu, chưa phải phòng trống thật.</p>
      </section>

      <section className="mt-8 overflow-hidden rounded-card border border-line bg-surface">
        <img src="/photos/terrace.jpg" alt="Bàn sát biển lúc hoàng hôn" className="h-44 w-full object-cover" />
        <div className="space-y-3 p-4">
          <p className="text-sm font-semibold text-brand">THÊM · SUN BAVARIA</p>
          <h2 className="display text-3xl leading-tight">Phụ thu bàn sát biển</h2>
          <p className="text-sm text-muted">
            Đang chạy thử, chưa có thông báo chính thức. Phụ thu tính theo loại bàn, không theo số khách ngồi.
          </p>
          <ul>
            {TABLES.map((table) => (
              <li key={table.id} className="flex justify-between border-t border-line py-2">
                <span>{table.label}</span>
                <span className="font-semibold text-rose-ink">{formatVnd(table.fee)}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm">2 khách chọn bàn 4: phụ thu 800.000đ. Chọn bàn 6: phụ thu 1.200.000đ.</p>
          <Link to="/ve" className="inline-flex h-12 items-center rounded-full bg-navy px-5 font-semibold text-on-navy">
            Giữ vé và chọn bàn
          </Link>
        </div>
      </section>
    </Shell>
  );
}
