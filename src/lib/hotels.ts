const hotel1 = "/photos/hotel-1.webp";
const hotel2 = "/photos/hotel-2.webp";
const hotel3 = "/photos/hotel-3.webp";
const hotel4 = "/photos/hotel-4.webp";
const hotel5 = "/photos/hotel-5.webp";
const hotel6 = "/photos/hotel-6.webp";
const room1 = "/photos/room-1.webp";
const room2 = "/photos/room-2.webp";
const room3 = "/photos/room-3.webp";
const bathroom = "/photos/bathroom.webp";
const breakfast = "/photos/breakfast.webp";

export type Room = {
  id: string;
  name: string;
  size: number;
  image: string;
  features: string[];
  price: number;
  oldPrice?: number;
};

export type Hotel = {
  id: string;
  name: string;
  city: string;
  area: string;
  address: string;
  stars: number;
  rating: number;
  reviews: number;
  price: number;
  oldPrice?: number;
  image: string;
  gallery: string[];
  badge?: string;
  tags: string[];
  amenities: string[];
  description: string;
};

const rooms: Room[] = [
  {
    id: "deluxe",
    name: "Deluxe Room",
    size: 28,
    image: room1,
    features: ["Giường đôi hoặc 2 giường đơn", "Điều hoà không khí", "WiFi miễn phí"],
    price: 1590000,
    oldPrice: 1890000,
  },
  {
    id: "superior",
    name: "Superior Room",
    size: 32,
    image: room3,
    features: ["Giường đôi lớn", "Bàn làm việc", "View thành phố"],
    price: 1990000,
    oldPrice: 2350000,
  },
  {
    id: "suite",
    name: "Signature Suite",
    size: 45,
    image: room2,
    features: ["Phòng khách riêng", "Bồn tắm & vòi sen", "View biển toàn cảnh"],
    price: 2790000,
    oldPrice: 3200000,
  },
];

export const ROOMS = rooms;

export const HOTELS: Hotel[] = [
  {
    id: "dalat-wonder",
    name: "Dalat Wonder Resort & Spa",
    city: "Đà Lạt",
    area: "Hồ Tuyền Lâm, Đà Lạt",
    address: "Khu du lịch Hồ Tuyền Lâm, Phường 4, Đà Lạt, Lâm Đồng",
    stars: 5,
    rating: 9.2,
    reviews: 1248,
    price: 1250000,
    oldPrice: 1520000,
    image: hotel1,
    gallery: [hotel1, room1, bathroom, room2, breakfast],
    badge: "Ưu đãi hôm nay",
    tags: ["View núi", "Spa", "Hồ bơi"],
    amenities: ["Wi-Fi miễn phí", "Bữa sáng", "Spa", "Đỗ xe miễn phí"],
    description:
      "Khu nghỉ dưỡng phong cách Pháp nằm trên đồi thông, nhìn ra hồ Tuyền Lâm và những dãy núi mờ sương mỗi sáng.",
  },
  {
    id: "swiss-belresort",
    name: "Swiss-Belresort Tuyền Lâm",
    city: "Đà Lạt",
    area: "Tuyền Lâm, Đà Lạt",
    address: "Khu 7, 8 Hồ Tuyền Lâm, Phường 3, Đà Lạt, Lâm Đồng",
    stars: 5,
    rating: 9.3,
    reviews: 982,
    price: 1450000,
    oldPrice: 1780000,
    image: hotel2,
    gallery: [hotel2, room2, breakfast, room1, bathroom],
    badge: "Free breakfast",
    tags: ["Hồ bơi", "Sân golf", "Gần hồ"],
    amenities: ["Wi-Fi miễn phí", "Hồ bơi", "Bữa sáng", "Nhà hàng"],
    description:
      "Hồ bơi rực sáng về đêm giữa vườn hoa giấy, kiến trúc châu Âu cổ điển và dịch vụ chuẩn quốc tế.",
  },
  {
    id: "azurea-cam-ranh",
    name: "Azurea Resort & Spa",
    city: "Nha Trang",
    area: "Bãi Dài, Cam Ranh",
    address: "Bãi Dài, Cam Ranh, Khánh Hòa, Việt Nam",
    stars: 5,
    rating: 9.4,
    reviews: 2103,
    price: 2450000,
    oldPrice: 2800000,
    image: hotel3,
    gallery: [hotel3, room2, room1, bathroom, breakfast],
    badge: "Đẳng cấp 5 sao",
    tags: ["Hồ bơi vô cực", "Bãi biển riêng", "Villas"],
    amenities: ["Wi-Fi miễn phí", "Hồ bơi", "Spa", "Bữa sáng"],
    description:
      "Tuyệt tác bên bờ biển Bãi Dài với hồ bơi vô cực hòa vào đại dương, kiến trúc hiện đại hòa quyện thiên nhiên.",
  },
  {
    id: "banla-sapa",
    name: "Banla Boutique Hotel",
    city: "Sapa",
    area: "Sapa, Lào Cai",
    address: "25 Fansipan, Thị xã Sapa, Lào Cai, Việt Nam",
    stars: 4,
    rating: 9.1,
    reviews: 756,
    price: 1290000,
    oldPrice: 1520000,
    image: hotel4,
    gallery: [hotel4, room1, room3, bathroom, breakfast],
    tags: ["View núi", "Boutique", "Lò sưởi"],
    amenities: ["Wi-Fi miễn phí", "Bữa sáng", "Nhà hàng"],
    description:
      "Khách sạn boutique ấm cúng phủ đầy cây xanh, ngắm trọn thung lũng Mường Hoa và đỉnh Fansipan.",
  },
  {
    id: "lava-dalat",
    name: "Lava Hotel Dalat",
    city: "Đà Lạt",
    area: "Phường 10, Đà Lạt",
    address: "12 Trần Hưng Đạo, Phường 10, Đà Lạt, Lâm Đồng",
    stars: 4,
    rating: 9.0,
    reviews: 634,
    price: 1150000,
    oldPrice: 1350000,
    image: hotel5,
    gallery: [hotel5, room3, room1, breakfast, bathroom],
    badge: "Bán chạy",
    tags: ["Đồi lavender", "Gia đình", "Gần chợ"],
    amenities: ["Wi-Fi miễn phí", "Đỗ xe miễn phí", "Bữa sáng"],
    description:
      "Toà lâu đài sáng đèn phía sau cánh đồng oải hương tím, chỉ vài phút tới trung tâm Đà Lạt.",
  },
  {
    id: "metropole-hanoi",
    name: "Hanoi Emerald Tower",
    city: "Hà Nội",
    area: "Hoàn Kiếm, Hà Nội",
    address: "15 Ngô Quyền, Hoàn Kiếm, Hà Nội, Việt Nam",
    stars: 5,
    rating: 8.9,
    reviews: 1856,
    price: 1890000,
    oldPrice: 2250000,
    image: hotel6,
    gallery: [hotel6, room3, room1, bathroom, breakfast],
    tags: ["Trung tâm", "Rooftop bar", "Gym"],
    amenities: ["Wi-Fi miễn phí", "Nhà hàng", "Spa"],
    description: "Toà tháp hiện đại giữa lòng phố cổ, rooftop ngắm hoàng hôn trên hồ Hoàn Kiếm.",
  },
];

export const DESTINATIONS = [
  "Đà Lạt",
  "Nha Trang",
  "Sapa",
  "Hà Nội",
  "Hội An",
  "Phú Quốc",
  "Đà Nẵng",
  "Hạ Long",
  "Huế",
  "Quy Nhơn",
];

/** Bỏ dấu để so khớp "da lat" với "Đà Lạt". */
export function foldVi(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function hotelMatchesQuery(hotel: Hotel, query: string) {
  const q = foldVi(query);
  if (!q) return true;
  const hay = foldVi(`${hotel.city} ${hotel.area} ${hotel.name} ${hotel.tags.join(" ")}`);
  const tight = q.replace(/\s/g, "");
  return hay.includes(q) || hay.replace(/\s/g, "").includes(tight);
}

export function getHotel(id: string) {
  return HOTELS.find((h) => h.id === id);
}

export function formatVnd(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

/** Room tier multipliers over the hotel's base nightly price (Deluxe, Superior, Suite). */
export const ROOM_TIER_MULTIPLIERS = [1, 1.28, 1.8] as const;

/** Nightly price of the room at `tierIndex`, rounded to the nearest 10.000đ. */
export function roomPrice(base: number, tierIndex: number) {
  const m = ROOM_TIER_MULTIPLIERS[tierIndex] ?? 1;
  return Math.round((base * m) / 10000) * 10000;
}

/** Booking total: nightly price × nights, minus the 10% DFxTrip discount. */
export const BRAND_DISCOUNT = 0.1;
export function bookingTotal(pricePerNight: number, nights: number) {
  return Math.round(pricePerNight * nights * (1 - BRAND_DISCOUNT));
}

export function ratingLabel(r: number) {
  if (r >= 9) return "Tuyệt vời";
  if (r >= 8) return "Rất tốt";
  return "Tốt";
}

export type BookingStatus = "upcoming" | "completed";

export type Booking = {
  code: string;
  hotelId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: number;
  status: BookingStatus;
};

/** Sample bookings shown on the "Đặt chỗ" page (mockup data). */
export const BOOKINGS: Booking[] = [
  {
    code: "DFX-24117",
    hotelId: "azurea-cam-ranh",
    roomName: "Signature Suite",
    checkIn: "20/11/2026",
    checkOut: "22/11/2026",
    nights: 2,
    guests: 2,
    total: 7938000,
    status: "upcoming",
  },
  {
    code: "DFX-24089",
    hotelId: "dalat-wonder",
    roomName: "Deluxe Room",
    checkIn: "24/12/2026",
    checkOut: "27/12/2026",
    nights: 3,
    guests: 2,
    total: 3375000,
    status: "upcoming",
  },
  {
    code: "DFX-23561",
    hotelId: "banla-sapa",
    roomName: "Superior Room",
    checkIn: "05/09/2026",
    checkOut: "07/09/2026",
    nights: 2,
    guests: 3,
    total: 2970000,
    status: "completed",
  },
  {
    code: "DFX-23102",
    hotelId: "metropole-hanoi",
    roomName: "Deluxe Room",
    checkIn: "14/06/2026",
    checkOut: "15/06/2026",
    nights: 1,
    guests: 1,
    total: 1701000,
    status: "completed",
  },
];
