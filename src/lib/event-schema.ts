import { TABLES, adultPrice, kidPrice } from "./services.ts";

const WEEKDAY = "2026-11-19";
const WEEKEND = "2026-11-20";

/** Ngày diễn kế tiếp theo giờ Việt Nam, để schema không gắn một ngày đã qua. */
export function nextShowDay(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function origin() {
  const host = String(import.meta.env?.VITE_PUBLIC_HOSTNAME ?? "").trim();
  if (!host) return "";
  return host.startsWith("http") ? host.replace(/\/$/, "") : `https://${host}`;
}

/**
 * Schema Event cho trang vé. Giá lấy từ cùng hàm tính tiền với form.
 * Không gắn đánh giá, số ghế còn lại, hay tình trạng "còn vé" vì trang chỉ giữ chỗ trên máy.
 */
export function symphonyEventJsonLd(now = new Date()) {
  const day = nextShowDay(now);
  const base = origin();
  const page = base ? `${base}/ve` : undefined;
  const adultWeek = adultPrice(WEEKDAY);
  const adultEnd = adultPrice(WEEKEND);

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Symphony of the Sea",
    description:
      "Show pháo hoa trên biển tại Sun Bavaria, Thị trấn Hoàng Hôn, Phú Quốc. 16:00 lên Cầu Hôn (vé tặng). 16:30 nhà hàng mở cửa. 17:30 buffet. 19:40 show. 20:10 kết thúc. Người lớn 1.200.000đ từ Chủ nhật đến thứ Năm, 1.300.000đ thứ Sáu và thứ Bảy. Trẻ từ 1m đến 1,4m bằng 70% giá người lớn. Trẻ dưới 1m miễn phí. Phụ thu bàn sát biển cộng thêm theo bàn. Giữ chỗ trên trang này lưu ở máy khách, chưa phải vé đã xác nhận.",
    inLanguage: "vi",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    startDate: `${day}T19:40:00+07:00`,
    endDate: `${day}T20:10:00+07:00`,
    doorTime: `${day}T16:30:00+07:00`,
    eventSchedule: {
      "@type": "Schedule",
      startDate: day,
      repeatFrequency: "P1D",
      scheduleTimezone: "Asia/Ho_Chi_Minh",
      startTime: "19:40:00",
      endTime: "20:10:00",
      byDay: [
        "https://schema.org/Monday",
        "https://schema.org/Tuesday",
        "https://schema.org/Wednesday",
        "https://schema.org/Thursday",
        "https://schema.org/Friday",
        "https://schema.org/Saturday",
        "https://schema.org/Sunday",
      ],
    },
    location: {
      "@type": "Place",
      name: "Sun Bavaria, Thị trấn Hoàng Hôn",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Phú Quốc",
        addressRegion: "Kiên Giang",
        addressCountry: "VN",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Sun Bavaria",
    },
    ...(page
      ? { url: page, image: [`${base}/photos/fireworks.webp`] }
      : { image: ["/photos/fireworks.webp"] }),
    offers: [
      {
        "@type": "Offer",
        name: "Người lớn, Chủ nhật đến thứ Năm",
        price: adultWeek,
        priceCurrency: "VND",
        ...(page ? { url: page } : {}),
        description: "Giá niêm yết một khách. Giữ chỗ chưa phải vé đã xác nhận.",
      },
      {
        "@type": "Offer",
        name: "Người lớn, thứ Sáu và thứ Bảy",
        price: adultEnd,
        priceCurrency: "VND",
        ...(page ? { url: page } : {}),
        description: "Giá niêm yết một khách. Giữ chỗ chưa phải vé đã xác nhận.",
      },
      {
        "@type": "Offer",
        name: "Trẻ từ 1m đến 1,4m, Chủ nhật đến thứ Năm",
        price: kidPrice(WEEKDAY),
        priceCurrency: "VND",
        ...(page ? { url: page } : {}),
        description: "Bằng 70% giá người lớn cùng ngày. Trẻ dưới 1m miễn phí.",
      },
      {
        "@type": "Offer",
        name: "Trẻ từ 1m đến 1,4m, thứ Sáu và thứ Bảy",
        price: kidPrice(WEEKEND),
        priceCurrency: "VND",
        ...(page ? { url: page } : {}),
        description: "Bằng 70% giá người lớn cùng ngày. Trẻ dưới 1m miễn phí.",
      },
      ...TABLES.map((table) => ({
        "@type": "Offer" as const,
        name: `Phụ thu ${table.label}, không gồm vé`,
        price: table.fee,
        priceCurrency: "VND",
        ...(page ? { url: page } : {}),
        description: `Cộng thêm vào giá vé, tính một lần cho bàn ${table.seats} khách. Đang chạy thử, chưa có thông báo chính thức.`,
      })),
    ],
  };
}
