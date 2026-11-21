import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  DoorOpen,
  Expand,
  Images,
  Loader2,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  bookingTotal,
  formatVnd,
  getHotel,
  ratingLabel,
  roomPrice,
  ROOMS,
  type Room,
} from "@/lib/hotels";
import { createBooking } from "@/lib/bookings";
import { createPayment } from "@/lib/payment";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { recordServiceBooking } from "@/lib/service-bookings";
import { HeartButton, imgTransition, Stars } from "@/components/site/hotel-card";
import { Reveal, SpotlightCard } from "@/components/fx/effects";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/khach-san/$id")({
  loader: ({ params }) => {
    const hotel = getHotel(params.id);
    if (!hotel) throw notFound();
    return { hotel };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.hotel.name} — DFxTrip` : "Khách sạn — DFxTrip";
    const desc = loaderData?.hotel.description ?? "Chi tiết khách sạn trên DFxTrip.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="font-display text-2xl font-bold">Không tìm thấy khách sạn</p>
      <Button asChild variant="hero" className="mt-6">
        <Link to="/khach-san">Quay lại tìm kiếm</Link>
      </Button>
    </div>
  ),
  component: HotelDetail,
});


/** Demo stay shown on the page ("20 – 22 Th11 · 2 khách"). */
const STAY = { checkIn: "2026-11-20", checkOut: "2026-11-22", guests: 2 };

function HotelDetail() {
  const { hotel } = Route.useLoaderData();
  const navigate = useNavigate();
  const { user } = useCurrentUserState();
  const [lightbox, setLightbox] = useState(false);
  const [slide, setSlide] = useState(0);
  const [booking, setBooking] = useState<{ room: Room; price: number } | null>(null);
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const nights = 2;

  return (
    <div className="mx-auto max-w-7xl pb-32 md:px-6 md:pb-10 md:pt-4">
      {/* Mobile gallery: swipe carousel */}
      <div className="relative md:hidden">
        <div
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          onScroll={(e) => {
            const el = e.currentTarget;
            setSlide(Math.round(el.scrollLeft / el.clientWidth));
          }}
        >
          {hotel.gallery.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${hotel.name} ảnh ${i + 1}`}
              width={1024}
              height={768}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              style={i === 0 ? imgTransition(hotel.id) : undefined}
              className="aspect-[4/3] w-full shrink-0 snap-center object-cover"
            />
          ))}
        </div>
        <Link
          to="/khach-san"
          aria-label="Quay lại"
          className="glass absolute left-4 top-4 grid size-10 place-items-center rounded-full"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <HeartButton id={hotel.id} className="absolute right-4 top-4 size-10" />
        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5">
          {hotel.gallery.map((_, i) => (
            <span
              key={i}
              className={
                "h-1.5 rounded-full bg-on-image transition-all duration-500 " +
                (i === slide ? "w-6" : "w-1.5 opacity-60")
              }
            />
          ))}
        </div>
      </div>

      {/* Desktop gallery: bento */}
      <div className="hidden h-[460px] grid-cols-4 grid-rows-2 gap-3 md:grid">
        <button
          onClick={() => setLightbox(true)}
          className="group relative col-span-2 row-span-2 overflow-hidden rounded-3xl"
        >
          <img
            src={hotel.gallery[0]}
            alt={hotel.name}
            width={1024}
            height={768}
            style={imgTransition(hotel.id)}
            className="size-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105"
          />
          <span className="glass-dark absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold">
            <Images className="size-4" /> Xem tất cả ảnh
          </span>
          <span className="glass absolute bottom-4 right-4 grid size-10 place-items-center rounded-xl">
            <Expand className="size-4" />
          </span>
        </button>
        {hotel.gallery.slice(1, 5).map((src, i) => (
          <button
            key={i}
            onClick={() => setLightbox(true)}
            className="group overflow-hidden rounded-2xl"
            style={{ animation: `vt-in 0.8s var(--ease-out-expo) ${200 + i * 90}ms both` }}
          >
            <img
              src={src}
              alt={`${hotel.name} ảnh ${i + 2}`}
              loading="lazy"
              width={1024}
              height={768}
              className="size-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-110"
            />
          </button>
        ))}
      </div>

      <div className="px-4 md:px-0">
        {/* Info */}
        <div className="-mt-6 relative z-10 rounded-t-3xl bg-background pt-6 md:mt-0 md:grid md:grid-cols-[1fr_auto] md:gap-8 md:pt-8">
          <Reveal>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Khách sạn {hotel.stars} sao</span>
              <Stars n={hotel.stars} />
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-5xl">
              {hotel.name}
            </h1>
            <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0" /> {hotel.address}
              <span className="ml-1 shrink-0 font-semibold text-primary">Xem bản đồ</span>
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/80 sm:text-base">
              {hotel.description}
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-5 md:mt-0">
            <div className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-[var(--shadow-soft)]">
              <span className="grid size-16 place-items-center rounded-full bg-secondary font-display text-2xl font-bold text-secondary-foreground">
                {hotel.rating.toFixed(1)}
              </span>
              <div>
                <p className="font-display text-lg font-semibold text-primary">
                  {ratingLabel(hotel.rating)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {hotel.reviews.toLocaleString("vi-VN")} đánh giá từ khách hàng
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Highlights */}
        <div className="no-scrollbar -mx-4 mt-6 flex gap-3 overflow-x-auto px-4 md:mx-0 md:px-0">
          {[
            { icon: ShieldCheck, t: "Miễn phí huỷ", s: "Trong 24 giờ" },
            { icon: Clock, t: "Nhận phòng từ", s: "14:00" },
            { icon: DoorOpen, t: "Trả phòng trước", s: "12:00" },
            { icon: Star, t: "Tiện ích", s: hotel.amenities.slice(0, 2).join(", ") },
          ].map(({ icon: Icon, t, s }, i) => (
            <Reveal key={t} delay={i * 80} className="shrink-0">
              <div className="flex items-center gap-3 rounded-2xl border bg-card px-4 py-3">
                <Icon className="size-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold">{t}</p>
                  <p className="text-xs text-muted-foreground">{s}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Rooms */}
        <section id="phong" className="mt-10 scroll-mt-20">
          <Reveal className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Chọn <span className="italic text-primary">loại phòng</span>
            </h2>
            <p className="text-sm text-muted-foreground">20 – 22 Th11 · {nights} đêm</p>
          </Reveal>
          <div className="grid gap-4 lg:grid-cols-3">
            {ROOMS.map((room, i) => {
              const price = roomPrice(hotel.price, i);
              return (
                <Reveal key={room.id} delay={i * 110}>
                  <SpotlightCard tilt={false} className="h-full rounded-2xl">
                    <div className="group flex h-full gap-3 rounded-2xl border bg-card p-3 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)] sm:flex-col lg:flex-col">
                      <div className="w-28 shrink-0 overflow-hidden rounded-xl sm:w-full">
                        <img
                          src={room.image}
                          alt={room.name}
                          loading="lazy"
                          width={1024}
                          height={768}
                          className="aspect-square size-full object-cover transition-transform duration-[1.2s] group-hover:scale-110 sm:aspect-[16/10]"
                        />
                      </div>
                      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-lg font-semibold">{room.name}</h3>
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
                            {room.size} m²
                          </span>
                        </div>
                        <ul className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
                          {room.features.map((f) => (
                            <li key={f}>• {f}</li>
                          ))}
                        </ul>
                        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                          <div>
                            <p className="text-lg font-bold text-primary">
                              {formatVnd(price)}
                              <span className="text-xs font-medium text-muted-foreground">
                                {" "}
                                /đêm
                              </span>
                            </p>
                            <p className="flex items-center gap-1 text-[11px] text-success">
                              <CheckCircle2 className="size-3" /> Bao gồm bữa sáng
                            </p>
                          </div>
                          <Button
                            variant="hero"
                            size="sm"
                            className="h-9 px-3"
                            onClick={() => {
                              setConfirmed(null);
                              setBooking({ room, price });
                            }}
                          >
                            Chọn phòng <ArrowRight />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </section>
      </div>

      {/* Mobile sticky booking bar */}
      <div className="fixed inset-x-3 bottom-3 z-50 md:hidden">
        <div className="glass flex items-center justify-between gap-3 rounded-3xl p-3 pl-5">
          <div>
            <p className="text-[11px] text-muted-foreground">Giá từ</p>
            <p className="text-lg font-bold text-primary">
              {formatVnd(hotel.price)}
              <span className="text-xs font-medium text-muted-foreground"> /đêm</span>
            </p>
          </div>
          <Button variant="hero" size="lg" asChild>
            <a href="#phong">Chọn phòng</a>
          </Button>
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={lightbox} onOpenChange={setLightbox}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display">{hotel.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            {hotel.gallery.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${hotel.name} ảnh ${i + 1}`}
                loading="lazy"
                width={1024}
                height={768}
                className={"w-full rounded-2xl object-cover " + (i === 0 ? "sm:col-span-2" : "")}
                style={{ animation: `vt-in 0.7s var(--ease-out-expo) ${i * 80}ms both` }}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking dialog */}
      <Dialog open={!!booking} onOpenChange={(o) => !o && setBooking(null)}>
        <DialogContent className="max-w-md rounded-3xl">
          {booking && !confirmed && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Xác nhận đặt phòng</DialogTitle>
              </DialogHeader>
              <div className="flex gap-3">
                <img
                  src={booking.room.image}
                  alt={booking.room.name}
                  width={1024}
                  height={768}
                  className="size-20 rounded-xl object-cover"
                />
                <div>
                  <p className="font-semibold">{booking.room.name}</p>
                  <p className="text-sm text-muted-foreground">{hotel.name}</p>
                  <p className="text-sm text-muted-foreground">
                    20 – 22 Th11 · {nights} đêm · 2 khách
                  </p>
                </div>
              </div>
              <div className="space-y-2 rounded-2xl bg-muted p-4 text-sm">
                <div className="flex justify-between">
                  <span>
                    {formatVnd(booking.price)} × {nights} đêm
                  </span>
                  <span>{formatVnd(booking.price * nights)}</span>
                </div>
                <div className="flex justify-between text-success">
                  <span>Ưu đãi DFxTrip</span>
                  <span>-{formatVnd(booking.price * nights - bookingTotal(booking.price, nights))}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatVnd(bookingTotal(booking.price, nights))}</span>
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Giữ chỗ lưu trên máy này, chưa phải phòng đã xác nhận.
              </p>
              <Button
                variant="hero"
                size="lg"
                className="w-full"
                disabled={saving}
                onClick={async () => {
                  if (!booking) return;
                  setSaving(true);
                  try {
                    const code = await createBooking({
                      hotelId: hotel.id,
                      roomName: booking.room.name,
                      checkIn: STAY.checkIn,
                      checkOut: STAY.checkOut,
                      nights,
                      guests: STAY.guests,
                      total: bookingTotal(booking.price, nights),
                    });
                    const payment = createPayment({
                      kind: "stay",
                      ref: code,
                      title: `${hotel.name} · ${booking.room.name}`,
                      amount: bookingTotal(booking.price, nights),
                    });
                    if (user && !user.isDevFallback) {
                      try {
                        await recordServiceBooking({
                          data: {
                            serviceType: "hotel",
                            productId: hotel.id,
                            roomTier: Math.max(0, ROOMS.findIndex((room) => room.name === booking.room.name)),
                            nights,
                            guests: STAY.guests,
                            basePrice: hotel.price,
                          },
                        });
                      } catch {
                        // Mã chuyển khoản vẫn mở khi SQL chưa ghi được.
                      }
                    }
                    navigate({ to: "/thanh-toan/$code", params: { code: payment.code } });
                  } catch {
                    toast.error("Chưa giữ được chỗ, thử lại nhé");
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                {saving && <Loader2 className="animate-spin" />}
                Giữ chỗ và hiện mã chuyển khoản
              </Button>
            </>
          )}
          {booking && confirmed && (
            <div className="py-6 text-center">
              <div className="mx-auto grid size-20 animate-pop place-items-center rounded-full bg-success/15">
                <CheckCircle2 className="size-11 text-success" />
              </div>
              <DialogTitle className="mt-4 font-display text-2xl">
                Đặt phòng thành công!
              </DialogTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {booking.room.name} · {hotel.name}
              </p>
              <p className="mt-1 text-xs font-semibold text-primary">Mã đặt chỗ {confirmed}</p>
              <div className="mt-6 flex justify-center gap-2">
                <Button asChild variant="hero">
                  <Link to="/dat-cho">Xem đặt chỗ</Link>
                </Button>
                <Button asChild variant="soft">
                  <Link to="/khach-san">Tiếp tục khám phá</Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
