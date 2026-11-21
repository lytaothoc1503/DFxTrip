import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, MapPin, Minus, Plus, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { DESTINATIONS, HOTELS, foldVi } from "@/lib/hotels";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const DEFAULT_STAY = {
  checkIn: "2026-11-20",
  checkOut: "2026-11-22",
  adults: 2,
  rooms: 1,
};

function addDays(iso: string, days: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y!, (m ?? 1) - 1, d);
  date.setDate(date.getDate() + days);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function canonicalDest(raw: string) {
  const q = foldVi(raw);
  if (!q) return "";
  const tight = q.replace(/\s/g, "");
  return (
    DESTINATIONS.find((name) => {
      const folded = foldVi(name);
      return folded === q || folded.replace(/\s/g, "") === tight;
    }) ?? raw.trim()
  );
}

function Field({
  icon: Icon,
  label,
  children,
  className,
  labelled = true,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
  className?: string;
  labelled?: boolean;
}) {
  const Label = labelled ? "label" : "div";
  return (
    <div className={cn("flex min-h-14 min-w-0 items-center gap-3 rounded-xl px-3 py-2", className)}>
      <Icon className="size-5 shrink-0 text-primary" aria-hidden />
      <Label className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-foreground">{label}</span>
        {children}
      </Label>
    </div>
  );
}

const inputCls =
  "w-full truncate bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground";

export function SearchBox({
  defaultDest = "",
  defaultCheckIn = DEFAULT_STAY.checkIn,
  defaultCheckOut = DEFAULT_STAY.checkOut,
  defaultAdults = DEFAULT_STAY.adults,
  defaultRooms = DEFAULT_STAY.rooms,
  tone = "glass",
}: {
  defaultDest?: string;
  defaultCheckIn?: string;
  defaultCheckOut?: string;
  defaultAdults?: number;
  defaultRooms?: number;
  tone?: "glass" | "card";
}) {
  const navigate = useNavigate();
  const [dest, setDest] = useState(defaultDest);
  const [focused, setFocused] = useState(false);
  const [adults, setAdults] = useState(defaultAdults);
  const [roomsN, setRoomsN] = useState(defaultRooms);
  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(
    defaultCheckOut > defaultCheckIn ? defaultCheckOut : addDays(defaultCheckIn, 2),
  );

  const places = useMemo(() => {
    return DESTINATIONS.map((name) => ({
      name,
      count: HOTELS.filter((hotel) => hotel.city === name).length,
    }));
  }, []);

  const query = foldVi(dest);
  const suggestions = (
    query
      ? places.filter((place) => foldVi(place.name).includes(query) || query.includes(foldVi(place.name)))
      : places.filter((place) => place.count > 0)
  ).slice(0, 6);

  const go = (nextDest = dest) => {
    const name = canonicalDest(nextDest);
    const out = checkOut > checkIn ? checkOut : addDays(checkIn, 1);
    navigate({
      to: "/khach-san",
      search: {
        ...(name ? { dest: name } : {}),
        in: checkIn,
        out,
        adults,
        rooms: roomsN,
      },
    });
  };

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        go();
      }}
      className={cn(
        "rounded-3xl p-2",
        tone === "card" ? "border bg-card shadow-[var(--shadow-soft)]" : "glass border-beam",
      )}
    >
      <div className="lg:flex lg:items-center lg:gap-1">
        <div className="lg:flex-[1.4]">
          <Field icon={MapPin} label="Điểm đến">
            <input
              value={dest}
              onChange={(e) => setDest(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => window.setTimeout(() => setFocused(false), 160)}
              placeholder="Đà Lạt, Sapa, Nha Trang..."
              className={inputCls}
              autoComplete="off"
              aria-autocomplete="list"
              aria-expanded={focused}
              suppressHydrationWarning
            />
          </Field>
        </div>

        <div className="mx-3 h-px bg-border lg:mx-0 lg:h-10 lg:w-px" />
        <div className="grid grid-cols-2 lg:flex lg:flex-[2]">
          <Field icon={CalendarDays} label="Nhận phòng" className="lg:flex-1">
            <input
              type="date"
              value={checkIn}
              max={checkOut}
              onChange={(e) => {
                const next = e.target.value || DEFAULT_STAY.checkIn;
                setCheckIn(next);
                if (checkOut <= next) setCheckOut(addDays(next, 1));
              }}
              className={inputCls}
              suppressHydrationWarning
            />
          </Field>
          <Field icon={CalendarDays} label="Trả phòng" className="lg:flex-1">
            <input
              type="date"
              value={checkOut}
              min={addDays(checkIn, 1)}
              onChange={(e) => setCheckOut(e.target.value || addDays(checkIn, 1))}
              className={inputCls}
              suppressHydrationWarning
            />
          </Field>
        </div>
        <div className="mx-3 h-px bg-border lg:mx-0 lg:h-10 lg:w-px" />

        <Popover>
          <PopoverTrigger asChild>
            <button type="button" className="w-full text-left lg:flex-1" aria-label="Số khách và số phòng">
              <Field icon={Users} label="Khách và phòng" labelled={false}>
                <p className="truncate text-sm text-foreground">
                  {adults} khách · {roomsN} phòng
                </p>
              </Field>
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="glass w-64 rounded-2xl p-4">
            {[
              { label: "Khách", v: adults, set: setAdults, min: 1, max: 8 },
              { label: "Phòng", v: roomsN, set: setRoomsN, min: 1, max: 6 },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">{row.label}</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label={`Giảm ${row.label}`}
                    onClick={() => row.set(Math.max(row.min, row.v - 1))}
                    className="grid size-11 place-items-center rounded-full border transition-colors hover:border-primary hover:text-primary"
                  >
                    <Minus className="size-4" aria-hidden />
                  </button>
                  <span className="w-4 text-center font-semibold tabular-nums">{row.v}</span>
                  <button
                    type="button"
                    aria-label={`Tăng ${row.label}`}
                    onClick={() => row.set(Math.min(row.max, row.v + 1))}
                    className="grid size-11 place-items-center rounded-full border transition-colors hover:border-primary hover:text-primary"
                  >
                    <Plus className="size-4" aria-hidden />
                  </button>
                </div>
              </div>
            ))}
          </PopoverContent>
        </Popover>

        <Button type="submit" variant="hero" size="lg" className="mt-2 h-12 w-full lg:mt-0 lg:w-auto">
          <Search className="!size-5" aria-hidden /> Tìm
        </Button>
      </div>

      {focused && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 px-2 pb-2" role="listbox" aria-label="Điểm đến gợi ý">
          {suggestions.map((place) => (
            <button
              key={place.name}
              type="button"
              role="option"
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => {
                setDest(place.name);
                setFocused(false);
                go(place.name);
              }}
              className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
            >
              {place.name}
              <span className="text-xs font-normal text-muted-foreground">
                {place.count > 0 ? `${place.count} chỗ` : "chưa có phòng"}
              </span>
            </button>
          ))}
        </div>
      )}
    </form>
  );
}