import { BRAND } from "@/lib/brand";
import { formatVnd, type Hotel } from "@/lib/hotels";

type Meta = { title?: string; name?: string; content?: string; property?: string };
type HeadLink = { rel: string; href: string };
type HeadScript = { type: string; children: string };

export function clip(text: string, max = 158) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const last = cut.lastIndexOf(" ");
  return `${(last > 80 ? cut.slice(0, last) : cut).trimEnd()}…`;
}

/** Title hiển thị trên tab. Giữ hậu tố thương hiệu khi còn đủ ngắn. */
export function pageTitle(name: string) {
  const branded = `${name} — DFxTrip`;
  if (branded.length <= 60) return branded;
  return name.length <= 60 ? name : clip(name, 60);
}

export function seoHead(opts: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  jsonLd?: unknown;
}): { meta: Meta[]; links: HeadLink[]; scripts?: HeadScript[] } {
  const meta: Meta[] = [
    { title: opts.title },
    { name: "description", content: clip(opts.description) },
  ];
  if (opts.noindex) meta.push({ name: "robots", content: "noindex, follow" });
  const links = [{ rel: "canonical", href: opts.path }];
  const scripts = opts.jsonLd
    ? [{ type: "application/ld+json", children: JSON.stringify(opts.jsonLd) }]
    : undefined;
  return { meta, links, scripts };
}

export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "DFxTrip",
        url: "/",
        slogan: "Khám phá. Đặt chỗ. Trải nghiệm.",
        telephone: `+84${BRAND.phoneTel.slice(1)}`,
        areaServed: "VN",
      },
      {
        "@type": "WebSite",
        name: "DFxTrip",
        url: "/",
        inLanguage: "vi",
        potentialAction: {
          "@type": "SearchAction",
          target: "/khach-san?dest={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

export function hotelJsonLd(hotel: Hotel) {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: hotel.name,
    description: hotel.description,
    url: `/khach-san/${hotel.id}`,
    image: hotel.image,
    address: {
      "@type": "PostalAddress",
      streetAddress: hotel.address,
      addressLocality: hotel.city,
      addressCountry: "VN",
    },
    starRating: { "@type": "Rating", ratingValue: String(hotel.stars) },
    priceRange: `Từ ${formatVnd(hotel.price)} mỗi đêm`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: hotel.rating.toFixed(1),
      bestRating: "10",
      reviewCount: hotel.reviews,
    },
  };
}

export function hotelListJsonLd(hotels: Hotel[], name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: hotels.length,
    itemListElement: hotels.map((hotel, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `/khach-san/${hotel.id}`,
      name: hotel.name,
    })),
  };
}

type TripSeo = {
  slug: string;
  name: string;
  short: string;
  price: number;
  image: string;
  itinerary: string[];
};

export function tourJsonLd(tour: TripSeo) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.name,
    description: tour.short,
    url: `/tour/${tour.slug}`,
    image: tour.image,
    itinerary: {
      "@type": "ItemList",
      numberOfItems: tour.itinerary.length,
      itemListElement: tour.itinerary.map((step, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: step,
      })),
    },
    offers: {
      "@type": "Offer",
      price: tour.price,
      priceCurrency: "VND",
      url: `/tour/${tour.slug}`,
      description: "Giá mỗi khách. Giữ chỗ chưa phải xác nhận.",
    },
  };
}

export function tourListJsonLd(tours: TripSeo[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tour và vé xe DFxTrip",
    numberOfItems: tours.length,
    itemListElement: tours.map((tour, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `/tour/${tour.slug}`,
      name: tour.name,
    })),
  };
}
