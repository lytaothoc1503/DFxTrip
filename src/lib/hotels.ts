import { BRAND } from "./brand.ts";

export type Room = {
  id: string;
  name: string;
  size: number;
  image: string;
  features: string[];
};

export type Hotel = {
  id: string;
  name: string;
  city: string;
  area: string;
  address: string;
  stars: number;
  score: number;
  reviews: number;
  price: number;
  oldPrice: number;
  image: string;
  gallery: string[];
  badge?: string;
  tags: string[];
  amenities: string[];
  description: string;
};

export const ROOMS: Room[] = [
  {
    id: "deluxe",
    name: "Deluxe Room",
    size: 28,
    image: "/photos/room-1.jpg",
    features: ["Giường đôi hoặc 2 giường đơn", "Điều hoà không khí", "WiFi miễn phí"],
  },
  {
    id: "superior",
    name: "Superior Room",
    size: 32,
    image: "/photos/room-3.jpg",
    features: ["Giường đôi lớn", "Bàn làm việc", "View thành phố"],
  },
  {
    id: "suite",
    name: "Signature Suite",
    size: 45,
    image: "/photos/room-2.jpg",
    features: ["Phòng khách riêng", "Bồn tắm & vòi sen", "View biển toàn cảnh"],
  },
];

/** Hệ số hạng phòng: Deluxe ×1, Superior ×1,28, Signature Suite ×1,8. */
export const ROOM_TIER_MULTIPLIERS = [1, 1.28, 1.8] as const;

export const HOTELS: Hotel[] = [
  {
    id: "dalat-wonder",
    name: "Dalat Wonder Resort & Spa",
    city: "Đà Lạt",
    area: "Hồ Tuyền Lâm, Đà Lạt",
    address: "Khu du lịch Hồ Tuyền Lâm, Phường 4, Đà Lạt, Lâm Đồng",
    stars: 5,
    score: 9.2,
    reviews: 1248,
    price: 1_250_000,
    oldPrice: 1_520_000,
    image: "/photos/hotel-1.jpg",
    gallery: ["/photos/hotel-1.jpg", "/photos/room-1.jpg", "/photos/bathroom.jpg", "/photos/room-2.jpg", "/photos/breakfast.jpg"],
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
    score: 9.3,
    reviews: 982,
    price: 1_450_000,
    oldPrice: 1_780_000,
    image: "/photos/hotel-2.jpg",
    gallery: ["/photos/hotel-2.jpg", "/photos/room-2.jpg", "/photos/breakfast.jpg", "/photos/room-1.jpg", "/photos/bathroom.jpg"],
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
    score: 9.4,
    reviews: 2103,
    price: 2_450_000,
    oldPrice: 2_800_000,
    image: "/photos/hotel-3.jpg",
    gallery: ["/photos/hotel-3.jpg", "/photos/room-2.jpg", "/photos/room-1.jpg", "/photos/bathroom.jpg", "/photos/breakfast.jpg"],
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
    score: 9.1,
    reviews: 756,
    price: 1_290_000,
    oldPrice: 1_520_000,
    image: "/photos/hotel-4.jpg",
    gallery: ["/photos/hotel-4.jpg", "/photos/room-1.jpg", "/photos/room-3.jpg", "/photos/bathroom.jpg", "/photos/breakfast.jpg"],
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
    score: 9.0,
    reviews: 634,
    price: 1_150_000,
    oldPrice: 1_350_000,
    image: "/photos/hotel-5.jpg",
    gallery: ["/photos/hotel-5.jpg", "/photos/room-3.jpg", "/photos/room-1.jpg", "/photos/breakfast.jpg", "/photos/bathroom.jpg"],
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
    score: 8.9,
    reviews: 1856,
    price: 1_890_000,
    oldPrice: 2_250_000,
    image: "/photos/hotel-6.jpg",
    gallery: ["/photos/hotel-6.jpg", "/photos/room-3.jpg", "/photos/room-1.jpg", "/photos/bathroom.jpg", "/photos/breakfast.jpg"],
    tags: ["Trung tâm", "Rooftop bar", "Gym"],
    amenities: ["Wi-Fi miễn phí", "Nhà hàng", "Spa"],
    description: "Toà tháp hiện đại giữa lòng phố cổ, rooftop ngắm hoàng hôn trên hồ Hoàn Kiếm.",
  },
];

export const CITIES = [
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

export type TourCategory = "domestic" | "international" | "cruise";

export type TourDay = { title: string; desc: string };

export type Tour = {
  id: string;
  name: string;
  subtitle: string;
  category: TourCategory;
  featured: boolean;
  season?: string;
  duration: string;
  departFrom: string;
  departures: string[];
  price: number;
  oldPrice?: number;
  image: string;
  gallery: string[];
  rating: number;
  reviews: number;
  seatsLeft: number;
  badge?: string;
  highlights: string[];
  itinerary: TourDay[];
  includes: string[];
};

export const TOUR_CATEGORY_LABEL: Record<TourCategory, string> = {
  domestic: "Trong nước",
  international: "Nước ngoài",
  cruise: "Du thuyền",
};

export const TOURS: Tour[] = [
  {
    id: "ha-giang-dong-van",
    name: "Hà Giang – Cao nguyên đá Đồng Văn",
    subtitle: "Đèo Mã Pì Lèng · Sông Nho Quế · Lũng Cú",
    category: "domestic",
    featured: true,
    season: "Mùa hoa tam giác mạch",
    duration: "3 ngày 2 đêm",
    departFrom: "Hà Nội",
    departures: ["14/11/2026", "21/11/2026", "28/11/2026"],
    price: 2_490_000,
    oldPrice: 2_990_000,
    image: "/tours/tour-ha-giang.jpg",
    gallery: ["/tours/tour-ha-giang.jpg", "/tours/tour-mu-cang-chai.jpg", "/tours/tour-xe-cabin.jpg"],
    rating: 9.4,
    reviews: 836,
    seatsLeft: 6,
    badge: "Bán chạy",
    highlights: [
      "Chinh phục đèo Mã Pì Lèng, ngắm sông Nho Quế",
      "Check-in cột cờ Lũng Cú – cực Bắc Tổ quốc",
      "Đi thuyền hẻm Tu Sản",
      "Xe cabin giường nằm khứ hồi",
    ],
    itinerary: [
      { title: "Hà Nội – Quản Bạ – Yên Minh", desc: "Khởi hành sáng sớm, dừng Cổng trời Quản Bạ và núi đôi Cô Tiên, nghỉ đêm Yên Minh." },
      { title: "Lũng Cú – Đồng Văn – Mã Pì Lèng", desc: "Thăm cột cờ Lũng Cú, dinh thự họ Vương, đi thuyền sông Nho Quế, tối dạo phố cổ Đồng Văn." },
      { title: "Đồng Văn – Hà Nội", desc: "Ăn sáng chợ phiên, mua đặc sản, xe đưa đoàn về Hà Nội buổi tối." },
    ],
    includes: ["Xe cabin khứ hồi", "2 đêm homestay", "6 bữa ăn", "Vé tham quan", "Hướng dẫn viên", "Bảo hiểm du lịch"],
  },
  {
    id: "du-thuyen-ha-long",
    name: "Du thuyền 5 sao Vịnh Hạ Long – Lan Hạ",
    subtitle: "Hang Sửng Sốt · Chèo kayak · Tiệc hoàng hôn",
    category: "cruise",
    featured: true,
    duration: "2 ngày 1 đêm",
    departFrom: "Hà Nội",
    departures: ["15/11/2026", "22/11/2026", "06/12/2026"],
    price: 3_290_000,
    oldPrice: 3_890_000,
    image: "/tours/tour-ha-long.jpg",
    gallery: ["/tours/tour-ha-long.jpg", "/tours/tour-lan-ha.jpg", "/tours/tour-ninh-binh.jpg"],
    rating: 9.6,
    reviews: 1412,
    seatsLeft: 4,
    badge: "Du thuyền 5 sao",
    highlights: [
      "Ngủ đêm trên du thuyền 5 sao giữa vịnh",
      "Chèo kayak vịnh Lan Hạ, tắm biển đảo Ba Trái Đào",
      "Lớp nấu ăn và tiệc hoàng hôn trên boong",
      "Tập Thái Cực Quyền lúc bình minh",
    ],
    itinerary: [
      { title: "Hà Nội – Hạ Long – Lan Hạ", desc: "Limousine đón tại phố cổ, lên du thuyền dùng bữa trưa, chèo kayak, tiệc hoàng hôn và câu mực đêm." },
      { title: "Hang Sửng Sốt – Hà Nội", desc: "Tập Thái Cực Quyền, thăm hang Sửng Sốt, brunch trên tàu và về Hà Nội buổi chiều." },
    ],
    includes: ["Limousine khứ hồi", "1 đêm cabin ban công", "4 bữa ăn", "Kayak", "Vé thắng cảnh", "Bảo hiểm du lịch"],
  },
  {
    id: "mu-cang-chai-lua-chin",
    name: "Mù Cang Chải mùa lúa chín",
    subtitle: "Đồi Mâm Xôi · Đèo Khau Phạ · Tú Lệ",
    category: "domestic",
    featured: false,
    season: "Mùa lúa chín",
    duration: "2 ngày 1 đêm",
    departFrom: "Hà Nội",
    departures: ["13/11/2026", "20/11/2026"],
    price: 1_890_000,
    oldPrice: 2_190_000,
    image: "/tours/tour-mu-cang-chai.jpg",
    gallery: ["/tours/tour-mu-cang-chai.jpg", "/tours/tour-ha-giang.jpg", "/tours/tour-xe-cabin.jpg"],
    rating: 9.2,
    reviews: 524,
    seatsLeft: 9,
    highlights: [
      "Săn ảnh ruộng bậc thang đồi Mâm Xôi",
      "Vượt đèo Khau Phạ – một trong tứ đại đỉnh đèo",
      "Thưởng thức xôi nếp Tú Lệ, gà đồi nướng",
    ],
    itinerary: [
      { title: "Hà Nội – Tú Lệ – Mù Cang Chải", desc: "Dừng thung lũng Tú Lệ, vượt đèo Khau Phạ, ngắm hoàng hôn trên ruộng bậc thang." },
      { title: "Đồi Mâm Xôi – Hà Nội", desc: "Bình minh đồi Mâm Xôi, giao lưu bản người Mông, về Hà Nội buổi tối." },
    ],
    includes: ["Xe giường nằm khứ hồi", "1 đêm homestay", "3 bữa ăn", "Hướng dẫn viên", "Bảo hiểm du lịch"],
  },
  {
    id: "ninh-binh-trang-an",
    name: "Ninh Bình – Tràng An – Hang Múa",
    subtitle: "Đi thuyền Tràng An · Chùa Bái Đính · 500 bậc Hang Múa",
    category: "domestic",
    featured: true,
    duration: "1 ngày",
    departFrom: "Hà Nội",
    departures: ["Hằng ngày"],
    price: 890_000,
    oldPrice: 1_090_000,
    image: "/tours/tour-ninh-binh.jpg",
    gallery: ["/tours/tour-ninh-binh.jpg", "/tours/tour-ha-long.jpg", "/tours/tour-lan-ha.jpg"],
    rating: 9.1,
    reviews: 2280,
    seatsLeft: 12,
    badge: "Khởi hành hằng ngày",
    highlights: [
      "Ngồi thuyền xuyên hang động Tràng An",
      "Leo 500 bậc Hang Múa ngắm Tam Cốc",
      "Viếng chùa Bái Đính",
    ],
    itinerary: [
      {
        title: "Hà Nội – Bái Đính – Tràng An – Hang Múa",
        desc: "Limousine đón sáng, viếng Bái Đính, ăn trưa buffet, đi thuyền Tràng An, leo Hang Múa, về Hà Nội lúc 19h.",
      },
    ],
    includes: ["Limousine khứ hồi", "Bữa trưa buffet", "Vé thuyền & tham quan", "Hướng dẫn viên", "Nước suối"],
  },
  {
    id: "van-nam-le-giang",
    name: "Vân Nam – Côn Minh – Đại Lý – Lệ Giang",
    subtitle: "Cổ trấn Lệ Giang · Núi tuyết Ngọc Long · Hồ Nhĩ Hải",
    category: "international",
    featured: true,
    season: "Mùa thu vàng",
    duration: "6 ngày 5 đêm",
    departFrom: "Hà Nội",
    departures: ["18/11/2026", "02/12/2026", "16/12/2026"],
    price: 12_990_000,
    oldPrice: 14_990_000,
    image: "/tours/tour-van-nam.jpg",
    gallery: ["/tours/tour-van-nam.jpg", "/tours/tour-han-quoc.jpg", "/tours/tour-ha-giang.jpg"],
    rating: 9.3,
    reviews: 418,
    seatsLeft: 5,
    badge: "Giảm 2 triệu",
    highlights: [
      "Cáp treo lên núi tuyết Ngọc Long 4.506m",
      "Dạo cổ trấn Lệ Giang & Đại Lý về đêm",
      "Xem show Ấn tượng Lệ Giang",
      "Tàu cao tốc Côn Minh – Đại Lý",
    ],
    itinerary: [
      { title: "Hà Nội – Hà Khẩu – Côn Minh", desc: "Qua cửa khẩu Lào Cai, tàu cao tốc tới Côn Minh, nghỉ đêm." },
      { title: "Côn Minh – Đại Lý", desc: "Thạch Lâm, tàu cao tốc đi Đại Lý, dạo cổ thành về đêm." },
      { title: "Hồ Nhĩ Hải – Lệ Giang", desc: "Du thuyền hồ Nhĩ Hải, di chuyển Lệ Giang, tối tự do cổ trấn." },
      { title: "Núi tuyết Ngọc Long", desc: "Cáp treo lên núi tuyết, Lam Nguyệt Cốc, xem show Ấn tượng Lệ Giang." },
      { title: "Lệ Giang – Côn Minh", desc: "Thúc Hà cổ trấn, tàu về Côn Minh, mua sắm." },
      { title: "Côn Minh – Hà Nội", desc: "Tàu cao tốc về Hà Khẩu, xe đưa đoàn về Hà Nội." },
    ],
    includes: ["Visa đoàn", "Tàu cao tốc", "Khách sạn 4 sao", "Ăn theo chương trình", "Vé cáp treo & show", "Hướng dẫn viên suốt tuyến"],
  },
  {
    id: "han-quoc-mua-thu",
    name: "Hàn Quốc mùa thu lá đỏ – Seoul – Nami",
    subtitle: "Cung Gyeongbok · Đảo Nami · Mặc Hanbok",
    category: "international",
    featured: false,
    season: "Mùa lá đỏ",
    duration: "5 ngày 4 đêm",
    departFrom: "TP. Hồ Chí Minh",
    departures: ["10/11/2026", "17/11/2026"],
    price: 15_990_000,
    oldPrice: 17_490_000,
    image: "/tours/tour-han-quoc.jpg",
    gallery: ["/tours/tour-han-quoc.jpg", "/tours/tour-van-nam.jpg", "/tours/tour-ninh-binh.jpg"],
    rating: 9.0,
    reviews: 367,
    seatsLeft: 3,
    badge: "Sắp hết chỗ",
    highlights: [
      "Mặc Hanbok dạo cung Gyeongbok mùa lá đỏ",
      "Đảo Nami và vườn Morning Calm",
      "Tháp Namsan và phố Myeongdong",
    ],
    itinerary: [
      { title: "TP.HCM – Seoul", desc: "Bay đêm tới Incheon." },
      { title: "Seoul – Đảo Nami", desc: "Đảo Nami, vườn Morning Calm, tối nghỉ Seoul." },
      { title: "Cung Gyeongbok – Bukchon", desc: "Mặc Hanbok tham quan cung điện, làng Bukchon Hanok." },
      { title: "Namsan – Myeongdong", desc: "Tháp Namsan, mua sắm Myeongdong." },
      { title: "Seoul – TP.HCM", desc: "Làm kimbap, ra sân bay về Việt Nam." },
    ],
    includes: ["Vé máy bay khứ hồi", "Visa", "Khách sạn 4 sao", "Ăn theo chương trình", "Thuê Hanbok", "Hướng dẫn viên"],
  },
];

/** Trẻ 2–11 tuổi = 75% giá người lớn tour (làm tròn 1.000đ). */
export const TOUR_CHILD_RATE = 0.75;

export function tourTotal(price: number, adults: number, children: number) {
  const childPrice = Math.round((price * TOUR_CHILD_RATE) / 1000) * 1000;
  return price * adults + childPrice * children;
}

export function getTour(id: string) {
  return TOURS.find((tour) => tour.id === id);
}

export function formatVnd(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
}

export function roomPrice(base: number, factorOrTier: number) {
  const factor =
    factorOrTier <= 2 && Number.isInteger(factorOrTier)
      ? (ROOM_TIER_MULTIPLIERS[factorOrTier] ?? 1)
      : factorOrTier;
  return Math.round((base * factor) / 10_000) * 10_000;
}

export function stayTotal(nightly: number, nights: number) {
  return Math.round(nightly * nights * (1 - BRAND.discountRate));
}

export const bookingTotal = stayTotal;

export function nightsBetween(checkIn: string, checkOut: string) {
  const ms = new Date(`${checkOut}T12:00:00`).getTime() - new Date(`${checkIn}T12:00:00`).getTime();
  return Math.round(ms / 86_400_000);
}

const HOTEL_ALIASES: Record<string, string> = {
  azurea: "azurea-cam-ranh",
  banla: "banla-sapa",
  emerald: "metropole-hanoi",
  lava: "lava-dalat",
};

export function getHotel(id: string) {
  const resolved = HOTEL_ALIASES[id] ?? id;
  return HOTELS.find((hotel) => hotel.id === resolved);
}

export function ratingLabel(score: number) {
  if (score >= 9) return "Tuyệt vời";
  if (score >= 8) return "Rất tốt";
  return "Tốt";
}

export function discountPercent(price: number, oldPrice: number) {
  if (oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

const FAVS = "vinastay:favs";
const STAYS = "vinastay:stays";

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

export function removeStay(id: string) {
  const next = loadStays().filter((stay) => stay.id !== id);
  localStorage.setItem(STAYS, JSON.stringify(next));
  return next;
}

/** Đặt chỗ mẫu (khớp công thức tài liệu DFxTrip). */
export const SAMPLE_BOOKINGS = [
  {
    code: "DFX-24117",
    hotelId: "azurea-cam-ranh",
    roomName: "Signature Suite",
    checkIn: "20/11/2026",
    checkOut: "22/11/2026",
    nights: 2,
    guests: 2,
    total: 7_938_000,
  },
  {
    code: "DFX-24089",
    hotelId: "dalat-wonder",
    roomName: "Deluxe Room",
    checkIn: "24/12/2026",
    checkOut: "27/12/2026",
    nights: 3,
    guests: 2,
    total: 3_375_000,
  },
  {
    code: "DFX-23561",
    hotelId: "banla-sapa",
    roomName: "Superior Room",
    checkIn: "05/09/2026",
    checkOut: "07/09/2026",
    nights: 2,
    guests: 3,
    total: 2_970_000,
  },
  {
    code: "DFX-23102",
    hotelId: "metropole-hanoi",
    roomName: "Deluxe Room",
    checkIn: "14/06/2026",
    checkOut: "15/06/2026",
    nights: 1,
    guests: 1,
    total: 1_701_000,
  },
] as const;
