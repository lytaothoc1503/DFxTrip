/**
 * Dịch vụ ngoài khách sạn: vé show Sun Bavaria / Symphony of the Sea,
 * phụ thu bàn sát biển, lịch trình buổi tối (theo poster).
 */

export const TABLES = [
  { id: "4", seats: 4, fee: 800_000, label: "Bàn 4 khách" },
  { id: "6", seats: 6, fee: 1_200_000, label: "Bàn 6 khách" },
  { id: "8", seats: 8, fee: 1_600_000, label: "Bàn 8 khách" },
] as const;

export type TableId = (typeof TABLES)[number]["id"] | "none";

export type Hold = {
  id: string;
  date: string;
  adults: number;
  kids: number;
  infants: number;
  tableId: TableId;
  name: string;
  phone: string;
  ticketTotal: number;
  tableFee: number;
  total: number;
  createdAt: string;
};

const KEY = "vinastay:holds";

/** Lịch trình show — theo poster Sun Bavaria / Tuấn Review Phú Quốc. */
export const SHOW_SCHEDULE = [
  {
    time: "16:00",
    title: "Lên Cầu Hôn (vé tặng)",
    detail: "Tham quan Cầu Hôn",
    image: "/photos/bridge.webp",
  },
  {
    time: "16:30",
    title: "Nhà hàng mở cửa đón khách",
    detail: "Sun Bavaria chào đón",
    image: "/photos/terrace.webp",
  },
  {
    time: "17:30",
    title: "Phục vụ ăn buffet",
    detail: "Tiệc buffet tại nhà hàng",
    image: "/photos/buffet.webp",
  },
  {
    time: "19:40",
    title: "Show pháo bông Symphony of the Sea",
    detail: "Chương trình chính",
    image: "/photos/fireworks.webp",
  },
  {
    time: "20:10",
    title: "Kết thúc",
    detail: "Chúc anh chị xem show vui vẻ",
    image: "/photos/fireworks.webp",
  },
] as const;

export function isWeekend(date: string) {
  const day = new Date(`${date}T12:00:00`).getDay();
  return day === 5 || day === 6;
}

export function adultPrice(date: string) {
  return isWeekend(date) ? 1_300_000 : 1_200_000;
}

export function kidPrice(date: string) {
  return Math.round(adultPrice(date) * 0.7);
}

const WEEKDAY = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"] as const;

/** Cộng ngày trên lịch, không phụ thuộc múi giờ của máy. */
export function addIsoDays(iso: string, days: number) {
  const [year, month, day] = iso.split("-").map(Number);
  const next = new Date(Date.UTC(year ?? 2026, (month ?? 1) - 1, (day ?? 1) + days));
  const y = next.getUTCFullYear();
  const m = String(next.getUTCMonth() + 1).padStart(2, "0");
  const d = String(next.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayIso(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** 14 ngày tới, mỗi ô một giá người lớn để so thứ Sáu–thứ Bảy với ngày thường. */
export function priceDays(startIso: string, count = 14) {
  return Array.from({ length: count }, (_, index) => {
    const iso = addIsoDays(startIso, index);
    const [year, month, day] = iso.split("-").map(Number);
    const weekday = new Date(Date.UTC(year ?? 2026, (month ?? 1) - 1, day ?? 1)).getUTCDay();
    return {
      iso,
      weekday: WEEKDAY[weekday] ?? "",
      day: day ?? 1,
      adult: adultPrice(iso),
      weekend: isWeekend(iso),
    };
  });
}

export function ticketTotal(date: string, adults: number, kids: number) {
  return adults * adultPrice(date) + kids * kidPrice(date);
}

export function tableById(id: TableId) {
  if (id === "none") return null;
  return TABLES.find((table) => table.id === id) ?? null;
}

export function quote(input: {
  date: string;
  adults: number;
  kids: number;
  infants: number;
  tableId: TableId;
}) {
  const seatsNeeded = input.adults + input.kids;
  const table = tableById(input.tableId);
  const ticket = ticketTotal(input.date, input.adults, input.kids);
  const fee = table?.fee ?? 0;
  const tooSmall = Boolean(table && seatsNeeded > table.seats);
  const empty = input.adults + input.kids + input.infants < 1;
  return {
    ticket,
    fee,
    total: ticket + fee,
    seatsNeeded,
    tooSmall,
    empty,
    weekend: isWeekend(input.date),
    adult: adultPrice(input.date),
    kid: kidPrice(input.date),
  };
}

export function formatVnd(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
}

export function loadHolds(): Hold[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Hold[]) : [];
  } catch {
    return [];
  }
}

export function saveHold(hold: Hold) {
  const next = [hold, ...loadHolds()];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function removeHold(id: string) {
  const next = loadHolds().filter((hold) => hold.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
