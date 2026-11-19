import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { TOURS, TOUR_CATEGORY_LABEL, formatVnd } from "@/lib/hotels";
import { TOUR_LIST_DESCRIPTION, TOUR_LIST_TITLE } from "@/lib/tour-seo";

export const Route = createFileRoute("/tour/")({
  head: () => ({
    meta: [
      { title: TOUR_LIST_TITLE },
      { name: "description", content: TOUR_LIST_DESCRIPTION },
      { property: "og:title", content: TOUR_LIST_TITLE },
      { property: "og:description", content: TOUR_LIST_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "vi_VN" },
    ],
  }),
  component: ToursPage,
});

function ToursPage() {
  return (
    <Shell>
      <h1 className="display text-4xl">Tour</h1>
      <p className="mt-2 text-base text-muted">{TOUR_LIST_DESCRIPTION}</p>
      <ul className="mt-5 space-y-4">
        {TOURS.map((tour) => (
          <li key={tour.id} className="overflow-hidden rounded-card bg-surface">
            <img src={tour.image} alt={tour.name} className="h-44 w-full object-cover" />
            <div className="space-y-2 p-4">
              <p className="text-sm font-semibold text-brand">
                {TOUR_CATEGORY_LABEL[tour.category]}
                {tour.badge ? ` · ${tour.badge}` : ""}
              </p>
              <h2 className="text-xl font-semibold leading-snug">
                <Link to="/tour/$id" params={{ id: tour.id }}>
                  {tour.name}
                </Link>
              </h2>
              <p className="text-base text-muted">
                {tour.duration} · từ {tour.departFrom} · {tour.rating}
              </p>
              <p className="text-lg font-semibold">
                {formatVnd(tour.price)}
                {tour.oldPrice ? (
                  <span className="ml-2 text-base font-normal text-muted line-through">{formatVnd(tour.oldPrice)}</span>
                ) : null}
              </p>
              <Link
                to="/tour/$id"
                params={{ id: tour.id }}
                className="flex h-14 w-full items-center justify-center rounded-full bg-brand text-lg font-semibold text-on-brand"
              >
                Xem chi tiết
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
