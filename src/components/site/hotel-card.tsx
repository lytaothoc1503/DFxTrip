import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart, MapPin, Star } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { formatVnd, ratingLabel, type Hotel } from "@/lib/hotels";
import { toggleFavorite, useFavorites } from "@/lib/favorites";
import { DepthCard } from "@/components/fx/effects";
import { imgProps } from "@/lib/images";

export function Stars({
  n,
  className,
  iconClassName,
  decorative = false,
}: {
  n: number;
  className?: string;
  iconClassName?: string;
  decorative?: boolean;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      {...(decorative
        ? { "aria-hidden": true }
        : { role: "img" as const, "aria-label": `${n} trên 5 sao` })}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden
          className={cn(
            "size-3.5",
            i < n ? "fill-star text-star" : "fill-muted text-muted",
            iconClassName,
          )}
        />
      ))}
    </span>
  );
}

export function HeartButton({ id, className }: { id: string; className?: string }) {
  const favs = useFavorites();
  const active = favs.includes(id);
  const [burst, setBurst] = useState(0);
  return (
    <button
      type="button"
      aria-label={active ? "Bỏ yêu thích" : "Thêm yêu thích"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(id);
        setBurst((b) => b + 1);
      }}
      className={cn(
        "glass grid size-9 place-items-center rounded-full transition-transform active:scale-90",
        className,
      )}
    >
      <Heart
        key={burst}
        className={cn(
          "size-[18px] transition-colors",
          burst > 0 && "animate-pop",
          active ? "fill-primary text-primary" : "text-foreground",
        )}
      />
    </button>
  );
}

export function imgTransition(id: string): CSSProperties {
  return { viewTransitionName: `hotel-${id}`, viewTransitionClass: "hotel-img" } as CSSProperties;
}

export function HotelCard({ hotel, eager }: { hotel: Hotel; eager?: boolean }) {
  return (
    <DepthCard className="h-full rounded-2xl">
      <Link
        to="/khach-san/$id"
        params={{ id: hotel.id }}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-soft)] transition-shadow duration-500 hover:shadow-[var(--shadow-lift)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            {...imgProps(hotel.image, "(min-width: 1280px) 360px, (min-width: 768px) 46vw, 92vw")}
            alt={hotel.name}
            decoding="async"
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "auto"}
            style={imgTransition(hotel.id)}
            className="size-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-110"
          />
          <div className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-image-fade)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {hotel.badge && (
            <span className="glass-dark absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold">
              {hotel.badge}
            </span>
          )}
          <HeartButton id={hotel.id} className="absolute right-3 top-3" />
          <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-secondary px-2 py-1 text-xs font-bold text-secondary-foreground">
            {hotel.rating.toFixed(1)}
            <span className="font-medium opacity-80">{ratingLabel(hotel.rating)}</span>
          </span>
        </div>
        <div className="relative z-10 flex flex-1 flex-col gap-2 p-4">
          <h3 className="line-clamp-1 font-display text-lg font-semibold">{hotel.name}</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Stars n={hotel.stars} />
            <span>({hotel.reviews.toLocaleString("vi-VN")} đánh giá)</span>
          </div>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" aria-hidden /> {hotel.area}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {hotel.tags.map((t) => (
              <span key={t} className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-auto flex items-end justify-between pt-3">
            <div>
              <p className="text-xs text-muted-foreground">Từ</p>
              <p className="text-xl font-bold text-primary">
                {formatVnd(hotel.price)}
                <span className="text-xs font-medium text-muted-foreground"> /đêm</span>
              </p>
              {hotel.oldPrice && (
                <p className="text-xs text-muted-foreground line-through">
                  {formatVnd(hotel.oldPrice)}
                </p>
              )}
            </div>
            <span className="shine inline-flex h-10 items-center gap-1.5 rounded-lg bg-[image:var(--gradient-primary)] px-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]">
              Xem phòng
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    </DepthCard>
  );
}

/** Compact horizontal card used on mobile lists. */
export function HotelRow({ hotel }: { hotel: Hotel }) {
  const off = hotel.oldPrice ? Math.round((1 - hotel.price / hotel.oldPrice) * 100) : 0;
  return (
    <Link
      to="/khach-san/$id"
      params={{ id: hotel.id }}
      className="group flex gap-3 rounded-2xl border bg-card p-2.5 shadow-[var(--shadow-soft)] transition-transform active:scale-[0.98]"
    >
      <div className="relative w-32 shrink-0 overflow-hidden rounded-xl">
        <img
          {...imgProps(hotel.image, "128px")}
          alt={hotel.name}
          loading="lazy"
          decoding="async"
          style={imgTransition(hotel.id)}
          className="size-full object-cover"
        />
        {off > 0 && (
          <span className="absolute left-1.5 top-1.5 rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-secondary-foreground">
            -{off}%
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col py-0.5">
        <h3 className="line-clamp-1 font-display text-base font-semibold">{hotel.name}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-star text-star" aria-hidden />
          <span className="font-semibold text-foreground">{hotel.rating.toFixed(1)}</span>(
          {hotel.reviews.toLocaleString("vi-VN")})
        </p>
        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
          <MapPin className="size-3 shrink-0" aria-hidden /> {hotel.area}
        </p>
        <div className="mt-auto flex items-end justify-between pt-1">
          <p className="text-base font-bold text-primary">
            {formatVnd(hotel.price)}
            <span className="text-[10px] font-medium text-muted-foreground"> /đêm</span>
          </p>
          <span className="inline-flex items-center gap-0.5 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground">
            Xem <ArrowRight className="size-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
