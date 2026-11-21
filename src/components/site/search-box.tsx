import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, MapPin, Minus, Plus, Search, Users } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DESTINATIONS } from "@/lib/hotels";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
    <div
      className={cn(
        "flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/70",
        className,
      )}
    >
      <Icon className="size-5 shrink-0 text-primary" aria-hidden />
      <Label className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-foreground">{label}</span>
        {children}
      </Label>
    </div>
  );
}

const inputCls =
  "w-full truncate bg-transparent text-sm text-muted-foreground outline-none placeholder:text-muted-foreground";

export function SearchBox({ defaultDest = "" }: { defaultDest?: string }) {
  const navigate = useNavigate();
  const [dest, setDest] = useState(defaultDest);
  const [open, setOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [roomsN, setRoomsN] = useState(1);
  const [checkIn, setCheckIn] = useState("2026-11-20");
  const [checkOut, setCheckOut] = useState("2026-11-22");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/khach-san", search: dest ? { dest } : {} });
  };

  return (
    <form
      onSubmit={submit}
      className="glass border-beam rounded-3xl p-2 lg:flex lg:items-center lg:gap-1"
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="lg:flex-[1.4]">
            <Field icon={MapPin} label="Điểm đến">
              <input
                value={dest}
                onChange={(e) => setDest(e.target.value)}
                onFocus={() => setOpen(true)}
                placeholder="Ví dụ: Sapa, Đà Lạt, Hội An..."
                className={inputCls}
                autoComplete="off"
                suppressHydrationWarning
              />
            </Field>
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="glass w-[min(92vw,360px)] rounded-2xl p-3"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <p className="mb-2 text-xs font-semibold text-muted-foreground">Điểm đến phổ biến</p>
          <div className="flex flex-wrap gap-2">
            {DESTINATIONS.map((d) => (
              <button
                type="button"
                key={d}
                onClick={() => {
                  setDest(d);
                  setOpen(false);
                }}
                className="rounded-full border bg-card px-3 py-1.5 text-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                {d}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <div className="mx-3 h-px bg-border lg:mx-0 lg:h-10 lg:w-px" />
      <div className="grid grid-cols-2 lg:flex lg:flex-[2]">
        <Field icon={CalendarDays} label="Nhận phòng" className="lg:flex-1">
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className={inputCls}
            suppressHydrationWarning
          />
        </Field>
        <Field icon={CalendarDays} label="Trả phòng" className="lg:flex-1">
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className={inputCls}
            suppressHydrationWarning
          />
        </Field>
      </div>
      <div className="mx-3 h-px bg-border lg:mx-0 lg:h-10 lg:w-px" />

      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="w-full text-left lg:flex-1">
            <Field icon={Users} label="Khách & Phòng" labelled={false}>
              <p className="truncate text-sm text-muted-foreground">
                {adults} người lớn · {roomsN} phòng
              </p>
            </Field>
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="glass w-64 rounded-2xl p-4">
          {[
            { label: "Người lớn", v: adults, set: setAdults, min: 1 },
            { label: "Phòng", v: roomsN, set: setRoomsN, min: 1 },
          ].map((r) => (
            <div key={r.label} className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">{r.label}</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label={`Giảm ${r.label}`}
                  onClick={() => r.set(Math.max(r.min, r.v - 1))}
                  className="grid size-8 place-items-center rounded-full border transition-colors hover:border-primary hover:text-primary"
                >
                  <Minus className="size-4" aria-hidden />
                </button>
                <span className="w-4 text-center font-semibold tabular-nums">{r.v}</span>
                <button
                  type="button"
                  aria-label={`Tăng ${r.label}`}
                  onClick={() => r.set(r.v + 1)}
                  className="grid size-8 place-items-center rounded-full border transition-colors hover:border-primary hover:text-primary"
                >
                  <Plus className="size-4" aria-hidden />
                </button>
              </div>
            </div>
          ))}
        </PopoverContent>
      </Popover>

      <Button type="submit" variant="hero" size="lg" className="mt-2 w-full lg:mt-0 lg:w-auto">
        <Search className="!size-5" aria-hidden /> Tìm khách sạn
      </Button>
    </form>
  );
}
