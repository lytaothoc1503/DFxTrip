import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { TourCard } from "@/components/site/tour-card";
import { Reveal } from "@/components/fx/effects";
import { listTours, TOUR_GROUPS, toursInGroup } from "@/lib/tours";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tour/")({
  loader: () => listTours(),
  head: () => ({
    meta: [
      { title: "Tour — DFxTrip" },
      {
        name: "description",
        content:
          "Mười lăm lịch trình: phía Bắc, Cát Bà, Vân Nam và Nhật Bản từ cuối tháng 11 đến Tết. Giá niêm yết mỗi khách, giữ chỗ chưa phải xác nhận.",
      },
    ],
  }),
  component: TourIndex,
});

function TourIndex() {
  const tours = Route.useLoaderData();
  const [group, setGroup] = useState<(typeof TOUR_GROUPS)[number]["id"] | "all">("all");
  const current = TOUR_GROUPS.find((item) => item.id === group);
  const list = current ? toursInGroup(tours, current.id) : tours;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Lịch trình</p>
      <h1 className="mt-1 font-display text-3xl font-bold sm:text-5xl">
        Tour và <span className="italic text-primary">vé xe</span>
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        {tours.length} sản phẩm đang niêm yết trong hệ thống. Giá là mỗi khách. Giữ chỗ lưu trên máy này, chưa phải chỗ đã xác nhận. Lịch Nhật và mùa hoa là lịch DFxTrip, ngày chốt khi xác nhận.
      </p>
      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
        <FilterChip active={group === "all"} onClick={() => setGroup("all")}>
          {`Tất cả · ${tours.length}`}
        </FilterChip>
        {TOUR_GROUPS.map((item) => (
          <FilterChip key={item.id} active={group === item.id} onClick={() => setGroup(item.id)}>
            {item.title}
          </FilterChip>
        ))}
      </div>
      {current ? <p className="mt-3 text-sm text-muted-foreground">{current.text}</p> : null}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((tour, index) => (
          <Reveal key={tour.slug} delay={index * 60}>
            <TourCard tour={tour} />
          </Reveal>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        Vé show Phú Quốc nằm riêng.{" "}
        <Link to="/ve" className="font-semibold text-primary">
          Symphony of the Sea
        </Link>
      </p>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2 text-sm font-medium",
        active ? "border-primary bg-accent text-accent-foreground" : "bg-card",
      )}
    >
      {children}
    </button>
  );
}
