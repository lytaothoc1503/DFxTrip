import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { TOURS, TOUR_CATEGORY_LABEL, formatVnd } from "@/lib/hotels";

export const Route = createFileRoute("/tour/")({ component: ToursPage });

function ToursPage() {
  return (
    <Shell>
      <h1 className="display text-4xl">Tour</h1>
      <p className="mt-2 text-base text-muted">Dữ liệu mẫu từ catalogue DFxTrip. Giữ chỗ tour sẽ bổ sung sau.</p>
      <ul className="mt-5 space-y-4">
        {TOURS.map((tour) => (
          <li key={tour.id} className="overflow-hidden rounded-card bg-surface">
            <img src={tour.image} alt="" className="h-44 w-full object-cover" />
            <div className="space-y-2 p-4">
              <p className="text-sm font-semibold text-brand">
                {TOUR_CATEGORY_LABEL[tour.category]}
                {tour.badge ? ` · ${tour.badge}` : ""}
              </p>
              <p className="text-xl font-semibold leading-snug">{tour.name}</p>
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
