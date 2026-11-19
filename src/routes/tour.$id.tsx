import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { TOUR_CATEGORY_LABEL, formatVnd, getTour, tourTotal } from "@/lib/hotels";
import { tourJsonLd, tourMetaDescription, tourPageTitle } from "@/lib/tour-seo";

export const Route = createFileRoute("/tour/$id")({
  head: ({ params }) => {
    const tour = getTour(params.id);
    if (!tour) {
      return { meta: [{ title: "Không thấy tour | VinaStay" }, { name: "robots", content: "noindex" }] };
    }
    const title = tourPageTitle(tour);
    const description = tourMetaDescription(tour);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "vi_VN" },
        { property: "og:image", content: tour.image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: tour.image },
      ],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(tourJsonLd(tour)) }],
    };
  },
  component: TourDetail,
});

function TourDetail() {
  const { id } = useParams({ from: "/tour/$id" });
  const tour = getTour(id);

  if (!tour) {
    return (
      <Shell>
        <p className="text-lg">Không thấy tour này.</p>
        <Link to="/tour" className="mt-5 flex h-14 w-full items-center justify-center rounded-full bg-brand text-lg font-semibold text-on-brand">
          Về danh sách tour
        </Link>
      </Shell>
    );
  }

  const sample = tourTotal(tour.price, 2, 1);

  return (
    <Shell>
      <img src={tour.image} alt={tour.name} className="h-56 w-full rounded-card object-cover" />
      <p className="mt-4 text-sm font-semibold text-brand">
        {TOUR_CATEGORY_LABEL[tour.category]}
        {tour.season ? ` · ${tour.season}` : ""}
      </p>
      <h1 className="display text-4xl leading-tight">{tour.name}</h1>
      <p className="mt-2 text-base text-muted">{tour.subtitle}</p>
      <p className="mt-3 text-lg font-semibold">
        {formatVnd(tour.price)}
        {tour.oldPrice ? <span className="ml-2 text-base font-normal text-muted line-through">{formatVnd(tour.oldPrice)}</span> : null}
      </p>
      <p className="mt-1 text-base text-muted">
        {tour.duration} · khởi hành từ {tour.departFrom} · còn {tour.seatsLeft} chỗ (mẫu)
      </p>
      <p className="mt-3 text-base">
        Ví dụ 2 người lớn + 1 trẻ (75%): <span className="font-semibold">{formatVnd(sample)}</span>
      </p>

      <h2 className="mt-6 text-2xl font-semibold">Điểm nổi bật</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-base">
        {tour.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 className="mt-6 text-2xl font-semibold">Lịch trình</h2>
      <ol className="mt-3 space-y-3">
        {tour.itinerary.map((day, index) => (
          <li key={day.title} className="rounded-card border border-line bg-surface p-4">
            <p className="font-semibold">
              Ngày {index + 1}: {day.title}
            </p>
            <p className="mt-1 text-base text-muted">{day.desc}</p>
          </li>
        ))}
      </ol>

      <h2 className="mt-6 text-2xl font-semibold">Bao gồm</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-base">
        {tour.includes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <p className="mt-6 text-base text-muted">
        Giữ tour trên máy chưa mở — liên hệ Zalo/hotline để được tư vấn. Không phải chỗ đã xác nhận.
      </p>
      <Link to="/tour" className="mt-4 flex h-14 w-full items-center justify-center rounded-full border border-line bg-surface text-lg font-semibold">
        Quay lại tour
      </Link>
    </Shell>
  );
}
