import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { HOTELS } from "@/lib/hotels";
import { listTours } from "@/lib/tours";
import { useFavorites } from "@/lib/favorites";
import { HotelCard } from "@/components/site/hotel-card";
import { TourCard } from "@/components/site/tour-card";
import { Reveal } from "@/components/fx/effects";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/yeu-thich")({
  loader: () => listTours(),
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
  const hotels = HOTELS.filter((hotel) => favs.includes(hotel.id));
  const tours = Route.useLoaderData().filter((tour) => favs.includes(tour.slug));
  const empty = hotels.length + tours.length === 0;
  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">
        Đã <span className="italic text-primary">yêu thích</span>
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {hotels.length} chỗ nghỉ · {tours.length} tour
      </p>

      {empty ? (
        <Reveal className="mt-8 rounded-3xl border border-dashed bg-card p-10 text-center">
          <div className="mx-auto grid size-16 animate-float place-items-center rounded-full bg-accent">
            <Heart className="size-7 fill-primary text-primary" />
          </div>
          <p className="mt-4 font-display text-xl font-semibold">Chưa lưu mục nào</p>
          <p className="mt-1 text-sm text-muted-foreground">Nhấn trái tim trên ảnh khách sạn hoặc tour.</p>
          <Button asChild variant="hero" className="mt-6">
            <Link to="/tour">Xem tour</Link>
          </Button>
        </Reveal>
      ) : (
        <>
          {tours.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {tours.map((tour, index) => (
                <Reveal key={tour.slug} delay={index * 80}>
                  <TourCard tour={tour} />
                </Reveal>
              ))}
            </div>
          ) : null}
          {hotels.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {hotels.map((hotel, index) => (
                <Reveal key={hotel.id} delay={index * 80}>
                  <HotelCard hotel={hotel} />
                </Reveal>
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
