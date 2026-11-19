import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { HOTELS } from "@/lib/hotels";
import { useFavorites } from "@/lib/favorites";
import { HotelCard } from "@/components/site/hotel-card";
import { Reveal } from "@/components/fx/effects";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/yeu-thich")({
  head: () => ({
    meta: [
      { title: "Yêu thích — DFxTrip" },
      { name: "description", content: "Danh sách khách sạn bạn đã lưu trên DFxTrip." },
      { property: "og:title", content: "Yêu thích — DFxTrip" },
      { property: "og:description", content: "Danh sách khách sạn bạn đã lưu trên DFxTrip." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const favs = useFavorites();
  const list = HOTELS.filter((h) => favs.includes(h.id));
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">
        Đã <span className="italic text-primary">yêu thích</span>
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{list.length} chỗ nghỉ đã lưu</p>

      {list.length === 0 ? (
        <Reveal className="mt-8 rounded-3xl border border-dashed bg-card p-10 text-center">
          <div className="mx-auto grid size-16 animate-float place-items-center rounded-full bg-accent">
            <Heart className="size-7 fill-primary text-primary" />
          </div>
          <p className="mt-4 font-display text-xl font-semibold">Chưa có khách sạn nào</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Nhấn vào biểu tượng trái tim trên ảnh để lưu lại.
          </p>
          <Button asChild variant="hero" className="mt-6">
            <Link to="/khach-san">Khám phá ngay</Link>
          </Button>
        </Reveal>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((h, i) => (
            <Reveal key={h.id} delay={i * 80}>
              <HotelCard hotel={h} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
