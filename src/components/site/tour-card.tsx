import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { HeartButton } from "@/components/site/hotel-card";
import { SpotlightCard } from "@/components/fx/effects";
import { formatVnd, type Tour } from "@/lib/tours";

export function TourCard({ tour }: { tour: Tour }) {
  return (
    <SpotlightCard className="h-full rounded-2xl">
      <Link
        to="/tour/$slug"
        params={{ slug: tour.slug }}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-soft)] transition-shadow duration-500 hover:shadow-[var(--shadow-lift)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={tour.image}
            alt={tour.imageAlt}
            width={1400}
            height={933}
            decoding="async"
            loading="lazy"
            className="size-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105"
          />
          <span className="glass-dark absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold">
            {tour.kind === "ticket" ? "Vé xe" : tour.code}
          </span>
          <HeartButton id={tour.slug} className="absolute right-3 top-3" />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="line-clamp-2 font-display text-lg font-semibold">{tour.name}</h3>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            {tour.from} → {tour.destination}
          </p>
          <p className="text-sm text-muted-foreground">
            {tour.duration} · {tour.departure}
          </p>
          {tour.season ? <p className="text-xs font-medium text-primary">{tour.season}</p> : null}
          <div className="mt-auto flex items-end justify-between pt-3">
            <div>
              <p className="text-xs text-muted-foreground">Mỗi khách</p>
              <p className="text-xl font-bold text-primary">{formatVnd(tour.price)}</p>
              {tour.oldPrice > tour.price ? (
                <p className="text-xs text-muted-foreground line-through">{formatVnd(tour.oldPrice)}</p>
              ) : null}
            </div>
            <span className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[image:var(--gradient-primary)] px-4 text-sm font-semibold text-primary-foreground">
              Xem lịch
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </SpotlightCard>
  );
}
