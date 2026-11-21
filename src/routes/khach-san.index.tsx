import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { HOTELS, DESTINATIONS, hotelMatchesQuery, foldVi } from "@/lib/hotels";
import { HotelCard, HotelRow } from "@/components/site/hotel-card";
import { DEFAULT_FILTERS, Filters, type FilterState } from "@/components/site/filters";
import { NumberTicker, Reveal } from "@/components/fx/effects";
import { SearchBox, DEFAULT_STAY } from "@/components/site/search-box";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { hotelListJsonLd, pageTitle, seoHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

type Search = {
  dest?: string;
  in?: string;
  out?: string;
  adults?: number;
  rooms?: number;
};

function readIso(value: unknown, fallback: string) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : fallback;
}

function readCount(value: unknown, fallback: number, max: number) {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(1, Math.round(n)));
}

function stayLine(checkIn: string, checkOut: string, adults: number, rooms: number) {
  const part = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    const date = new Date(y!, (m ?? 1) - 1, d);
    return `${date.getDate()} Th${date.getMonth() + 1}`;
  };
  const [ay, am, ad] = checkIn.split("-").map(Number);
  const [by, bm, bd] = checkOut.split("-").map(Number);
  const nights = Math.max(
    1,
    Math.round(
      (new Date(by!, (bm ?? 1) - 1, bd).getTime() - new Date(ay!, (am ?? 1) - 1, ad).getTime()) /
        86_400_000,
    ),
  );
  return `${part(checkIn)} – ${part(checkOut)} · ${nights} đêm · ${adults} khách · ${rooms} phòng`;
}

export const Route = createFileRoute("/khach-san/")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const raw = typeof s["dest"] === "string" ? s["dest"].trim() : "";
    const checkIn = readIso(s["in"], DEFAULT_STAY.checkIn);
    let checkOut = readIso(s["out"], DEFAULT_STAY.checkOut);
    if (checkOut <= checkIn) checkOut = DEFAULT_STAY.checkOut;
    return {
      ...(raw ? { dest: raw } : {}),
      in: checkIn,
      out: checkOut,
      adults: readCount(s["adults"], DEFAULT_STAY.adults, 8),
      rooms: readCount(s["rooms"], DEFAULT_STAY.rooms, 6),
    };
  },
  head: ({ match }) => {
    const dest = typeof match.search.dest === "string" ? match.search.dest : "";
    const known = (DESTINATIONS as readonly string[]).includes(dest);
    const listed = dest
      ? HOTELS.filter((hotel) => hotelMatchesQuery(hotel, dest) && (known ? hotel.city === dest : true))
      : HOTELS;
    const title = known ? pageTitle(`Khách sạn ${dest}`) : pageTitle("Tìm khách sạn");
    const description = known
      ? `${listed.length} chỗ nghỉ tại ${dest}. Giá niêm yết mỗi đêm, lọc theo hạng sao và tiện ích.`
      : "Lọc khách sạn Đà Lạt, Nha Trang, Sapa và Hà Nội theo giá, hạng sao và tiện ích.";
    return seoHead({
      title,
      description,
      path: known ? `/khach-san?dest=${encodeURIComponent(dest)}` : "/khach-san",
      jsonLd: hotelListJsonLd(listed, title),
    });
  },
  component: SearchPage,
});

const SORTS = [
  { id: "rec", label: "Đề xuất" },
  { id: "price-asc", label: "Giá thấp" },
  { id: "price-desc", label: "Giá cao" },
  { id: "rating", label: "Đánh giá" },
] as const;

function SearchPage() {
  const { dest, in: checkIn = DEFAULT_STAY.checkIn, out: checkOut = DEFAULT_STAY.checkOut, adults = DEFAULT_STAY.adults, rooms = DEFAULT_STAY.rooms } =
    Route.useSearch();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("rec");
  const [view, setView] = useState<"grid" | "list">("grid");

  const openedCities = useMemo(
    () => DESTINATIONS.filter((city) => HOTELS.some((hotel) => hotel.city === city)),
    [],
  );
  const destKnown = Boolean(dest && openedCities.some((city) => foldVi(city) === foldVi(dest)));

  const results = useMemo(() => {
    let r = HOTELS.filter((h) => {
      if (dest && !hotelMatchesQuery(h, dest)) return false;
      if (h.price > filters.maxPrice) return false;
      if (filters.stars.length && !filters.stars.includes(h.stars)) return false;
      if (filters.amenities.some((a) => !h.amenities.includes(a))) return false;
      return true;
    });
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [dest, filters, sort]);

  const activeCount =
    filters.stars.length + filters.amenities.length + (filters.maxPrice < 3000000 ? 1 : 0);
  // Re-key the grid so cards re-stagger whenever filters/sort change.
  const gridKey = JSON.stringify([filters, sort, dest, view]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6">
      {/* Title row */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          aria-label="Quay lại"
          className="grid size-10 place-items-center rounded-full border bg-card text-primary transition-transform active:scale-90 md:hidden"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-bold sm:text-4xl">
            {dest ? `Khách sạn ${dest}` : "Tất cả điểm đến"}
          </h1>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              <NumberTicker key={results.length} value={results.length} duration={700} />
            </span>{" "}
            chỗ nghỉ · {stayLine(checkIn, checkOut, adults, rooms)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <SearchBox
          key={`${dest ?? ""}-${checkIn}-${checkOut}-${adults}-${rooms}`}
          tone="card"
          defaultDest={dest ?? ""}
          defaultCheckIn={checkIn}
          defaultCheckOut={checkOut}
          defaultAdults={adults}
          defaultRooms={rooms}
        />
      </div>

      {/* Toolbar */}
      <div className="no-scrollbar sticky top-16 z-30 -mx-4 mt-4 flex items-center gap-2 overflow-x-auto bg-background/80 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="shrink-0 rounded-full lg:hidden">
              <SlidersHorizontal /> Bộ lọc
              {activeCount > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {activeCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
            <SheetHeader>
              <SheetTitle>Bộ lọc</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-8">
              <Filters value={filters} onChange={setFilters} />
            </div>
          </SheetContent>
        </Sheet>
        {SORTS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSort(s.id)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
              sort === s.id
                ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                : "bg-card hover:border-primary hover:text-primary",
            )}
          >
            {s.label}
          </button>
        ))}
        {dest && (
          <Link
            to="/khach-san"
            search={{ in: checkIn, out: checkOut, adults, rooms }}
            className="flex shrink-0 items-center gap-1 rounded-full bg-accent px-3 py-2 text-sm font-medium text-accent-foreground"
          >
            {dest} <X className="size-3.5" />
          </Link>
        )}
        <div className="ml-auto hidden shrink-0 gap-1 rounded-full border bg-card p-1 md:flex">
          {(["grid", "list"] as const).map((v) => {
            const Icon = v === "grid" ? LayoutGrid : List;
            return (
              <button
                key={v}
                aria-label={v === "grid" ? "Dạng lưới" : "Dạng danh sách"}
                onClick={() => setView(v)}
                className={cn(
                  "grid size-8 place-items-center rounded-full transition-colors",
                  view === v ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="size-4" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-2 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-36 rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold">Bộ lọc</p>
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="text-xs font-semibold text-primary"
              >
                Xoá tất cả
              </button>
            </div>
            <Filters value={filters} onChange={setFilters} />
          </div>
        </aside>

        <div key={gridKey}>
          {results.length === 0 ? (
            <Reveal className="rounded-3xl border border-dashed bg-card p-10 text-center">
              <p className="font-display text-xl font-semibold">
                {dest && !destKnown ? `Chưa có chỗ nghỉ tại ${dest}` : "Không có chỗ nghỉ khớp bộ lọc"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {dest && !destKnown
                  ? "Đang mở bán tại các điểm dưới đây."
                  : "Nới giá, sao hoặc tiện ích để xem thêm."}
              </p>
              {dest && !destKnown ? (
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {openedCities.map((city) => (
                    <Link
                      key={city}
                      to="/khach-san"
                      search={{ dest: city, in: checkIn, out: checkOut, adults, rooms }}
                      className="rounded-full border bg-card px-4 py-2 text-sm font-semibold text-primary"
                    >
                      {city}
                    </Link>
                  ))}
                </div>
              ) : (
                <Button variant="hero" className="mt-5" onClick={() => setFilters(DEFAULT_FILTERS)}>
                  Xoá bộ lọc
                </Button>
              )}
            </Reveal>
          ) : (
            <>
              <div
                className={cn(
                  "hidden gap-5 md:grid",
                  view === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
                )}
              >
                {results.map((h, i) => (
                  <Reveal key={h.id} delay={i * 80}>
                    {view === "grid" ? (
                      <HotelCard hotel={h} eager={i < 3} />
                    ) : (
                      <HotelRow hotel={h} />
                    )}
                  </Reveal>
                ))}
              </div>
              <div className="flex flex-col gap-4 md:hidden">
                {results.map((h, i) => (
                  <Reveal key={h.id} delay={i * 70}>
                    <HotelCard hotel={h} eager={i < 2} />
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
