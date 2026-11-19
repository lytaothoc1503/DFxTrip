export type Hotel = {
  id: string;
  name: string;
  city: string;
  stars: number;
  score: number;
  price: number;
  oldPrice: number;
  image: string;
};

export const HOTELS: Hotel[] = [
  { id: "dalat-wonder", name: "Dalat Wonder Resort & Spa", city: "Đà Lạt", stars: 5, score: 9.2, price: 1_250_000, oldPrice: 1_520_000, image: "/photos/hotel-1.jpg" },
  { id: "swiss-belresort", name: "Swiss-Belresort Tuyền Lâm", city: "Đà Lạt", stars: 5, score: 9.3, price: 1_450_000, oldPrice: 1_780_000, image: "/photos/hotel-2.jpg" },
  { id: "azurea", name: "Azurea Resort & Spa", city: "Nha Trang", stars: 5, score: 9.4, price: 2_450_000, oldPrice: 2_800_000, image: "/photos/hotel-3.jpg" },
  { id: "banla", name: "Banla Boutique Hotel", city: "Sapa", stars: 4, score: 9.1, price: 1_290_000, oldPrice: 1_520_000, image: "/photos/hotel-4.jpg" },
  { id: "lava", name: "Lava Hotel Dalat", city: "Đà Lạt", stars: 4, score: 9.0, price: 1_150_000, oldPrice: 1_350_000, image: "/photos/hotel-5.jpg" },
  { id: "emerald", name: "Hanoi Emerald Tower", city: "Hà Nội", stars: 5, score: 8.9, price: 1_890_000, oldPrice: 2_250_000, image: "/photos/hotel-6.jpg" },
];

export const CITIES = ["Đà Lạt", "Nha Trang", "Sapa", "Hà Nội", "Hội An", "Phú Quốc", "Đà Nẵng", "Hạ Long"];

export const ROOMS = [
  { name: "Deluxe Room", factor: 1 },
  { name: "Superior Room", factor: 1.28 },
  { name: "Signature Suite", factor: 1.8 },
] as const;

const FAVS = "vinastay:favs";
const STAYS = "vinastay:stays";

export function formatVnd(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
}

export function roomPrice(base: number, factor: number) {
  return Math.round((base * factor) / 10_000) * 10_000;
}

export function stayTotal(nightly: number, nights: number) {
  return Math.round(nightly * nights * 0.9);
}

export function nightsBetween(checkIn: string, checkOut: string) {
  const ms = new Date(`${checkOut}T12:00:00`).getTime() - new Date(`${checkIn}T12:00:00`).getTime();
  return Math.round(ms / 86_400_000);
}

export function getHotel(id: string) {
  return HOTELS.find((hotel) => hotel.id === id);
}

export function loadFavs(): string[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVS);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function toggleFav(id: string) {
  const current = loadFavs();
  const next = current.includes(id) ? current.filter((item) => item !== id) : [id, ...current];
  localStorage.setItem(FAVS, JSON.stringify(next));
  return next;
}

export type Stay = {
  id: string;
  hotelId: string;
  room: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  name: string;
  phone: string;
  total: number;
};

export function loadStays(): Stay[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STAYS);
    return raw ? (JSON.parse(raw) as Stay[]) : [];
  } catch {
    return [];
  }
}

export function saveStay(stay: Stay) {
  const next = [stay, ...loadStays()];
  localStorage.setItem(STAYS, JSON.stringify(next));
  return next;
}
