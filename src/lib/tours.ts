import { createServerFn } from "@tanstack/react-start";
import { formatVnd } from "@/lib/hotels";

export type TourKind = "tour" | "ticket";

export type Tour = {
  slug: string;
  code: string;
  name: string;
  short: string;
  long: string[];
  duration: string;
  transport: string;
  departure: string;
  from: string;
  destination: string;
  price: number;
  oldPrice: number;
  itinerary: string[];
  included: string;
  excluded: string;
  featured: boolean;
  kind: TourKind;
  image: string;
  imageAlt: string;
  slots: string[] | null;
  season: string;
  groups: string[];
};

type TourRow = {
  slug: string;
  code: string;
  name: string;
  short: string;
  long_parts: string[] | null;
  duration: string;
  transport: string;
  departure: string;
  origin: string;
  destination: string;
  price: number;
  old_price: number;
  itinerary: string[] | null;
  included: string;
  excluded: string;
  featured: boolean;
  kind: string;
  image: string;
  image_alt: string;
  slots: string[] | null;
  season: string;
  groups: string[] | null;
};

function textList(value: string[] | null | undefined): string[] {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}

function mapTour(row: TourRow): Tour {
  return {
    slug: row.slug,
    code: row.code,
    name: row.name,
    short: row.short,
    long: textList(row.long_parts),
    duration: row.duration,
    transport: row.transport,
    departure: row.departure,
    from: row.origin,
    destination: row.destination,
    price: Number(row.price),
    oldPrice: Number(row.old_price),
    itinerary: textList(row.itinerary),
    included: row.included,
    excluded: row.excluded,
    featured: Boolean(row.featured),
    kind: row.kind === "ticket" ? "ticket" : "tour",
    image: row.image,
    imageAlt: row.image_alt,
    slots: textList(row.slots).length ? textList(row.slots) : null,
    season: row.season ?? "",
    groups: textList(row.groups),
  };
}

export const listTours = createServerFn({ method: "GET" }).handler(async (): Promise<Tour[]> => {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql<TourRow>`
    select slug, code, name, short, long_parts, duration, transport, departure,
      origin, destination, price, old_price, itinerary, included, excluded,
      featured, kind, image, image_alt, slots, season, groups
    from tours
    order by sort_order
  `;
  return rows.map(mapTour);
});

export const getTourBySlug = createServerFn({ method: "GET" })
  .validator((slug: string) => {
    if (typeof slug !== "string" || !/^[a-z0-9-]{1,80}$/.test(slug)) {
      throw new Error("Không tìm thấy tour");
    }
    return slug;
  })
  .handler(async ({ data }): Promise<Tour | null> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<TourRow>`
      select slug, code, name, short, long_parts, duration, transport, departure,
        origin, destination, price, old_price, itinerary, included, excluded,
        featured, kind, image, image_alt, slots, season, groups
      from tours
      where slug = ${data}
      limit 1
    `;
    return rows[0] ? mapTour(rows[0]) : null;
  });

export const TOUR_GROUPS = [
  {
    id: "tet",
    title: "Đến Tết",
    text: "Từ cuối tháng 11/2026 đến Tết Đinh Mùi 6/2/2027: tam giác mạch, Sapa rét, Đà Lạt hoa, Vân Nam và Nhật Bản mùa đông.",
  },
  {
    id: "world",
    title: "Nhật Bản & Vân Nam",
    text: "Hai lịch Nhật do DFxTrip niêm yết. Vân Nam đi đường bộ qua Hà Khẩu, không phải tour bay.",
  },
  {
    id: "north",
    title: "Phía Bắc",
    text: "Tà Xùa, Hà Giang, Mù Cang Chải, Sapa và Hà Khẩu.",
  },
  {
    id: "island",
    title: "Cát Bà",
    text: "Tour 2 ngày có vịnh và kayak, hoặc chỉ vé xe bus cộng cáp treo.",
  },
] as const;

export function toursInGroup(tours: Tour[], groupId: string) {
  return tours.filter((tour) => tour.groups.includes(groupId));
}

export function tourTotal(tour: Tour, guests: number) {
  return tour.price * guests;
}

export { formatVnd };

export type TourHold = {
  id: string;
  slug: string;
  guests: number;
  total: number;
  guestName: string;
  guestPhone: string;
  slot: string;
  createdAt: string;
};

const HOLD_KEY = "dfxtrip:tour-holds";

function readHolds(): TourHold[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(HOLD_KEY) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function loadTourHolds() {
  return readHolds();
}

export function saveTourHold(hold: Omit<TourHold, "id" | "createdAt">) {
  const row: TourHold = {
    ...hold,
    id: `T-${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(HOLD_KEY, JSON.stringify([row, ...readHolds()]));
  return row;
}

export function removeTourHold(id: string) {
  const next = readHolds().filter((item) => item.id !== id);
  localStorage.setItem(HOLD_KEY, JSON.stringify(next));
  return next;
}
