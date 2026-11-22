import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadBookings, removeBooking } from "@/lib/bookings";
import { formatVnd, getHotel } from "@/lib/hotels";
import { formatVnd as money, loadHolds, removeHold, tableById } from "@/lib/services";
import { createPayment, paymentByRef } from "@/lib/payment";
import { listTours, loadTourHolds, removeTourHold } from "@/lib/tours";
import { pageTitle, seoHead } from "@/lib/seo";
import { Reveal } from "@/components/fx/effects";

export const Route = createFileRoute("/dat-cho")({
  loader: () => listTours(),
  head: () =>
    seoHead({
      title: pageTitle("Đặt chỗ"),
      description: "Chỗ phòng và vé sự kiện đang giữ trên máy này.",
      path: "/dat-cho",
      noindex: true,
    }),
  component: HoldsPage,
});

function HoldsPage() {
  const catalog = Route.useLoaderData();
  const [stays, setStays] = useState(loadBookings());
  const [holds, setHolds] = useState(loadHolds());
  const [tours, setTours] = useState(loadTourHolds());

  useEffect(() => {
    setStays(loadBookings());
    setHolds(loadHolds());
    setTours(loadTourHolds());
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:px-6">
      <Reveal variant="swipe">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Đặt chỗ <span className="italic text-primary">trên máy</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Chưa phải phòng, tour hay vé đã xác nhận.</p>
      </Reveal>

      <Reveal as="section" className="mt-8" delay={60} variant="toss">
      <h2 className="font-display text-2xl font-bold">Phòng</h2>
      {stays.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Chưa giữ phòng.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {stays.map((stay) => {
            const hotel = getHotel(stay.hotelId);
            return (
              <li key={stay.code} className="rounded-3xl border bg-card p-4">
                <p className="font-semibold">{hotel?.name ?? stay.hotelId}</p>
                <p className="text-sm text-muted-foreground">
                  {stay.roomName} · {stay.checkIn} – {stay.checkOut} · {stay.guests} khách
                </p>
                <p className="mt-1 font-semibold text-primary">{formatVnd(stay.total)}</p>
                <PayLink
                  refId={stay.code}
                  title={`${hotel?.name ?? "Phòng"} · ${stay.roomName}`}
                  amount={stay.total}
                  kind="stay"
                />
                <button
                  type="button"
                  className="mt-3 text-sm font-semibold text-primary"
                  onClick={() => setStays(removeBooking(stay.code))}
                >
                  Bỏ giữ chỗ {stay.code}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      </Reveal>

      <Reveal as="section" className="mt-8" delay={120} variant="toss">
      <h2 className="font-display text-2xl font-bold">Tour</h2>
      {tours.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Chưa giữ tour.{" "}
          <Link to="/tour" className="font-semibold text-primary">
            Xem lịch trình
          </Link>
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {tours.map((hold) => {
            const tour = catalog.find((item) => item.slug === hold.slug);
            return (
              <li key={hold.id} className="rounded-3xl border bg-card p-4">
                <p className="font-semibold">{tour?.name ?? hold.slug}</p>
                <p className="text-sm text-muted-foreground">
                  {hold.guestName} · {hold.guests} khách{hold.slot ? ` · ${hold.slot}` : ""}
                </p>
                <p className="mt-1 font-semibold text-primary">{formatVnd(hold.total)}</p>
                <PayLink refId={hold.id} title={tour?.name ?? "Tour"} amount={hold.total} kind="tour" />
                <button
                  type="button"
                  className="mt-3 text-sm font-semibold text-primary"
                  onClick={() => setTours(removeTourHold(hold.id))}
                >
                  Bỏ giữ chỗ {hold.id}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      </Reveal>

      <Reveal as="section" className="mt-8" delay={180} variant="swipe">
      <h2 className="font-display text-2xl font-bold">Vé Symphony of the Sea</h2>
      {holds.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Chưa giữ vé.{" "}
          <Link to="/ve" className="font-semibold text-primary">
            Xem sự kiện Phú Quốc
          </Link>
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {holds.map((hold) => {
            const table = tableById(hold.tableId);
            return (
              <li key={hold.id} className="rounded-3xl border bg-card p-4">
                <p className="font-semibold">{hold.name}</p>
                <p className="text-sm text-muted-foreground">
                  {hold.date} · {hold.adults} người lớn · {hold.kids} trẻ · {table ? table.label : "Chưa chọn bàn"}
                </p>
                <p className="mt-1 font-semibold text-primary">{money(hold.total)}</p>
                <PayLink refId={hold.id} title="Symphony of the Sea" amount={hold.total} kind="ticket" />
                <button
                  type="button"
                  className="mt-3 text-sm font-semibold text-primary"
                  onClick={() => setHolds(removeHold(hold.id))}
                >
                  Bỏ giữ vé {hold.id}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      </Reveal>
    </div>
  );
}

function PayLink({
  refId,
  title,
  amount,
  kind,
}: {
  refId: string;
  title: string;
  amount: number;
  kind: "ticket" | "stay" | "tour";
}) {
  const [payment, setPayment] = useState(() => paymentByRef(refId));
  if (!payment) {
    return (
      <button
        type="button"
        className="mt-3 text-sm font-semibold text-primary"
        onClick={() => setPayment(createPayment({ kind, ref: refId, title, amount }))}
      >
        Tạo mã chuyển khoản
      </button>
    );
  }
  return (
    <Link
      to="/thanh-toan/$code"
      params={{ code: payment.code }}
      className="mt-3 inline-block text-sm font-semibold text-primary"
    >
      {payment.status === "reported" ? "Đã báo chuyển khoản" : "Mở mã chuyển khoản"}
    </Link>
  );
}
