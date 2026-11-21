import type { Booking } from "@/lib/hotels";

const KEY = "dfxtrip:stays";

type Stored = Booking & { checkInIso: string; checkOutIso: string };

function read(): Stored[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function loadBookings() {
  return read();
}

export function removeBooking(code: string) {
  const next = read().filter((item) => item.code !== code);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export async function createBooking(input: {
  hotelId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: number;
}) {
  const code = `DFX-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
  const [iy, im, id] = input.checkIn.split("-");
  const [oy, om, od] = input.checkOut.split("-");
  const stay: Stored = {
    code,
    hotelId: input.hotelId,
    roomName: input.roomName,
    checkIn: `${id}/${im}/${iy}`,
    checkOut: `${od}/${om}/${oy}`,
    checkInIso: input.checkIn,
    checkOutIso: input.checkOut,
    nights: input.nights,
    guests: input.guests,
    total: input.total,
    status: "upcoming",
  };
  localStorage.setItem(KEY, JSON.stringify([stay, ...read()]));
  return code;
}
