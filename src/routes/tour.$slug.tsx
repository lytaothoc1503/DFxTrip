import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HeartButton } from "@/components/site/hotel-card";
import { createPayment } from "@/lib/payment";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { recordServiceBooking } from "@/lib/service-bookings";
import { formatVnd, getTourBySlug, saveTourHold, tourTotal } from "@/lib/tours";

export const Route = createFileRoute("/tour/$slug")({
  loader: async ({ params }) => {
    const tour = await getTourBySlug({ data: params.slug });
    if (!tour) throw notFound();
    return { tour };
  },
  head: ({ loaderData }) => {
    const tour = loaderData?.tour;
    const title = tour ? `${tour.name} — DFxTrip` : "Tour — DFxTrip";
    const description = tour?.short ?? "Chi tiết tour trên DFxTrip.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="font-display text-2xl font-bold">Không tìm thấy tour</p>
      <Button asChild variant="hero" className="mt-6">
        <Link to="/tour">Về danh sách tour</Link>
      </Button>
    </div>
  ),
  component: TourDetail,
});

function TourDetail() {
  const { tour } = Route.useLoaderData();
  const navigate = useNavigate();
  const { user } = useCurrentUserState();
  const [guests, setGuests] = useState(1);
  const [slot, setSlot] = useState(tour.slots?.[0] ?? "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const total = tourTotal(tour, guests);

  async function hold() {
    if (name.trim().length < 2 || phone.trim().length < 8) {
      setError("Cần tên và số điện thoại để giữ chỗ trên máy này.");
      return;
    }
    setBusy(true);
    setError("");
    const row = saveTourHold({
      slug: tour.slug,
      guests,
      total,
      guestName: name.trim(),
      guestPhone: phone.trim(),
      slot,
    });
    if (user && !user.isDevFallback) {
      try {
        await recordServiceBooking({
          data: {
            serviceType: "tour",
            productId: tour.code,
            adults: guests,
            children: 0,
            basePrice: tour.price,
            guestName: name.trim(),
            guestPhone: phone.trim(),
          },
        });
      } catch {
        // Giữ chỗ trên máy vẫn tiếp tục khi SQL chưa ghi được.
      }
    }
    const payment = createPayment({
      kind: "tour",
      ref: row.id,
      title: tour.name,
      amount: total,
    });
    navigate({ to: "/thanh-toan/$code", params: { code: payment.code } });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:px-6">
      <Link to="/tour" className="text-sm font-semibold text-primary">
        Tất cả tour
      </Link>
      <div className="relative mt-3 overflow-hidden rounded-3xl">
        <img
          src={tour.image}
          alt={tour.imageAlt}
          width={1400}
          height={933}
          decoding="async"
          className="aspect-[16/10] w-full object-cover"
        />
        <HeartButton id={tour.slug} className="absolute right-3 top-3" />
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
        {tour.code} · {tour.kind === "ticket" ? "Vé xe" : "Tour"}
      </p>
      <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">{tour.name}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{tour.short}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Fact label="Thời lượng" value={tour.duration} />
        <Fact label="Khởi hành" value={tour.departure} />
        <Fact label="Đi từ" value={tour.from} />
        <Fact label="Điểm đến" value={tour.destination} />
        <Fact label="Di chuyển" value={tour.transport} />
        <Fact label="Giá mỗi khách" value={formatVnd(tour.price)} />
      </dl>
      {tour.season ? <p className="mt-3 text-sm font-medium text-primary">{tour.season}</p> : null}
      {tour.oldPrice > tour.price ? (
        <p className="mt-2 text-sm text-muted-foreground line-through">
          Giá gốc {formatVnd(tour.oldPrice)} / khách
        </p>
      ) : null}

      <h2 className="mt-8 font-display text-2xl font-bold">Lịch trình</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {tour.itinerary.map((line) => (
          <li key={line} className="rounded-2xl border bg-card p-3">
            {line}
          </li>
        ))}
      </ul>
      <h2 className="mt-8 font-display text-2xl font-bold">Giá gồm và không gồm</h2>
      <p className="mt-3 text-sm">
        <span className="font-semibold">Gồm: </span>
        {tour.included}
      </p>
      <p className="mt-2 text-sm">
        <span className="font-semibold">Không gồm: </span>
        {tour.excluded}
      </p>
      <div className="mt-4 space-y-3 text-sm text-muted-foreground">
        {tour.long.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <section className="mt-8 space-y-4 rounded-3xl border bg-card p-4">
        <h2 className="font-display text-2xl font-bold">Giữ chỗ</h2>
        <p className="text-sm text-muted-foreground">
          Giá nhân theo số khách, không tách giá trẻ em. Giữ chỗ lưu trên máy này, chưa phải xác nhận.
        </p>
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium">Số khách</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="grid size-12 place-items-center rounded-full border text-2xl"
              onClick={() => setGuests((value) => Math.max(1, value - 1))}
              aria-label="Giảm số khách"
            >
              −
            </button>
            <span className="w-8 text-center text-xl font-semibold">{guests}</span>
            <button
              type="button"
              className="grid size-12 place-items-center rounded-full bg-primary text-2xl text-primary-foreground"
              onClick={() => setGuests((value) => Math.min(12, value + 1))}
              aria-label="Tăng số khách"
            >
              +
            </button>
          </div>
        </div>
        {tour.slots ? (
          <div className="flex gap-2">
            {tour.slots.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={slot === item}
                onClick={() => setSlot(item)}
                className={`h-12 flex-1 rounded-full border text-sm font-semibold ${slot === item ? "border-primary bg-accent" : "bg-background"}`}
              >
                {item}
              </button>
            ))}
          </div>
        ) : null}
        <label className="block text-sm font-medium">
          Tên
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 h-12 w-full rounded-2xl border bg-background px-3"
          />
        </label>
        <label className="block text-sm font-medium">
          Số điện thoại
          <input
            inputMode="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="mt-1 h-12 w-full rounded-2xl border bg-background px-3"
          />
        </label>
        <p className="flex justify-between text-lg font-semibold">
          <span>Tổng</span>
          <span className="text-primary">{formatVnd(total)}</span>
        </p>
        {error ? <p className="text-sm font-medium text-primary">{error}</p> : null}
        <button
          type="button"
          disabled={busy}
          onClick={() => void hold()}
          className="flex h-14 w-full items-center justify-center rounded-full bg-[image:var(--gradient-primary)] text-base font-semibold text-primary-foreground"
        >
          Giữ chỗ và hiện mã chuyển khoản
        </button>
      </section>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}
