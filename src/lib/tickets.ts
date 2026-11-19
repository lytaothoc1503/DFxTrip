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
