import { TOUR_CATEGORY_LABEL, TOURS, formatVnd, type Tour } from "@/lib/hotels";

export function tourPageTitle(tour: Tour) {
  return `${tour.name} | Tour ${TOUR_CATEGORY_LABEL[tour.category]} | VinaStay`;
}

export function tourMetaDescription(tour: Tour) {
  const raw = `${tour.subtitle}. ${tour.duration}, khởi hành từ ${tour.departFrom}. Giá mẫu từ ${formatVnd(tour.price)}.`;
  return raw.length > 160 ? `${raw.slice(0, 157)}...` : raw;
}

export const TOUR_LIST_TITLE = "Tour du lịch trong nước, nước ngoài và du thuyền | VinaStay";
export const TOUR_LIST_DESCRIPTION = `Danh sách ${TOURS.length} tour mẫu: trong nước, nước ngoài và du thuyền. Có lịch trình, điểm khởi hành và giá. Chưa phải chỗ đã xác nhận.`;

export function tourJsonLd(tour: Tour) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.name,
    description: tour.subtitle,
    image: tour.image,
    touristType: TOUR_CATEGORY_LABEL[tour.category],
    itinerary: {
      "@type": "ItemList",
      itemListElement: tour.itinerary.map((day, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: day.title,
        description: day.desc,
      })),
    },
    offers: {
      "@type": "Offer",
      price: tour.price,
      priceCurrency: "VND",
      url: `/tour/${tour.id}`,
    },
  };
}
