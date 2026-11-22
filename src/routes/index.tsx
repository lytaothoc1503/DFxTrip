import { createFileRoute, Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { ArrowRight, BadgePercent, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { formatVnd, HOTELS, ratingLabel, type Hotel } from "@/lib/hotels";
import { listTours } from "@/lib/tours";
import { TourCard } from "@/components/site/tour-card";
import { GuestReviewCard } from "@/components/site/guest-review";
import { GUEST_REVIEWS } from "@/lib/content";
import { HotelRow } from "@/components/site/hotel-card";
import { nextWeekendStay, SearchBox } from "@/components/site/search-box";
import { Marquee, NumberTicker, Reveal, TextReveal } from "@/components/fx/effects";
import { CoverflowSlider, HeroSlider, StoriesRow, type HeroSlide } from "@/components/fx/sliders";
import { CinematicShowcase } from "@/components/fx/cinematic";
import { imgProps } from "@/lib/images";
import { BRAND } from "@/lib/brand";
import { pageTitle, seoHead, siteJsonLd } from "@/lib/seo";

const HERO = "/photos/hero-dalat.webp";
const CITIES_WITH_STAYS = ["Đà Lạt", "Nha Trang", "Sapa", "Hà Nội"] as const;

export const Route = createFileRoute("/")({
  loader: () => listTours(),
  head: () =>
    seoHead({
      title: pageTitle("Khám phá khách sạn tuyệt vời"),
      description:
        "Sáu chỗ nghỉ tại Đà Lạt, Nha Trang, Sapa và Hà Nội. Giá phòng và vé Phú Quốc hiện trước khi giữ chỗ.",
      path: "/",
      jsonLd: siteJsonLd(),
    }),
  component: Index,
});

const HERO_SLIDES: HeroSlide[] = [
  { img: HERO, city: "Đà Lạt", caption: "Hồ Tuyền Lâm · Đà Lạt" },
  { img: HOTELS[2]!.image, city: "Nha Trang", caption: "Bãi Dài Cam Ranh · Nha Trang" },
  { img: HOTELS[3]!.image, city: "Sapa", caption: "Thung lũng Mường Hoa · Sapa" },
  { img: HOTELS[5]!.image, city: "Hà Nội", caption: "Phố cổ · Hà Nội" },
];

function cityStats(city: string) {
  const list = HOTELS.filter((hotel) => hotel.city === city);
  const from = list.reduce((min, hotel) => Math.min(min, hotel.price), Number.POSITIVE_INFINITY);
  return {
    city,
    count: list.length,
    from: Number.isFinite(from) ? from : 0,
    img: list[0]?.image ?? HERO,
  };
}

const WEEKEND_TILES = CITIES_WITH_STAYS.map(cityStats);
const DEAL_HOTELS = [...HOTELS]
  .filter((hotel): hotel is Hotel & { oldPrice: number } => typeof hotel.oldPrice === "number")
  .sort((a, b) => b.oldPrice / b.price - a.oldPrice / a.price)
  .slice(0, 6);
/** List view under the coverflow — skip the first two hero picks. */
const SUGGESTED = HOTELS.slice(2, 6);

function dealOff(hotel: Hotel & { oldPrice: number }) {
  return Math.round((1 - hotel.price / hotel.oldPrice) * 100);
}

function Index() {
  const featured = Route.useLoaderData().filter((tour) => tour.featured).slice(0, 4);
  const weekend = nextWeekendStay();
  return (
    <div>
      {/* HERO */}
      <section className="relative -mt-16 overflow-hidden pt-16">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6 md:pb-16 md:pt-24">
          <div className="text-center text-on-image">
            <span className="glass-dark mx-auto mb-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
              <Sparkles className="size-3.5" /> Giảm 10% tiền phòng
            </span>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight drop-shadow-sm sm:text-5xl md:text-7xl">
              <TextReveal
                text="Khám phá khách sạn tuyệt vời"
                wordClassName={(i) => (i >= 3 ? "italic text-primary-glow" : undefined)}
              />
            </h1>
            <p
              className="word-reveal mx-auto mt-4 max-w-xl text-sm text-on-image/90 sm:text-lg"
              style={{ "--delay": "450ms" } as CSSProperties}
            >
              Sáu chỗ nghỉ tại Đà Lạt, Nha Trang, Sapa và Hà Nội. Giá hiện trên từng thẻ.
            </p>
          </div>

          <HeroSlider slides={HERO_SLIDES} />

          <div
            className="word-reveal mt-6 block md:mt-10"
            style={{ "--delay": "600ms" } as CSSProperties}
          >
            <SearchBox showTabs showRecent />
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {[
              { icon: ShieldCheck, t: "Giá hiện trên thẻ" },
              { icon: Phone, t: `Gọi ${BRAND.phoneDisplay}` },
              { icon: BadgePercent, t: "Giảm 10% tiền phòng" },
            ].map(({ icon: Icon, t }, i) => (
              <span
                key={t}
                className="glass word-reveal inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-accent-foreground"
                style={{ "--delay": `${800 + i * 90}ms` } as CSSProperties}
              >
                <Icon className="size-4" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-2 max-w-7xl px-4 sm:px-6">
        <Reveal>
          <Link
            to="/ve"
            className="group relative block overflow-hidden rounded-3xl bg-secondary text-secondary-foreground"
          >
            <img
              {...imgProps("/photos/fireworks.webp", "(min-width: 1280px) 1152px, 100vw")}
              alt="Pháo hoa Symphony of the Sea trên biển Phú Quốc"
              loading="lazy"
              decoding="async"
              className="h-56 w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105 sm:h-72"
            />
            <div className="absolute inset-0 bg-[image:var(--gradient-image-fade)]" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-glow">
                Sự kiện Phú Quốc · Sun Bavaria
              </p>
              <h2 className="mt-1 font-display text-3xl font-bold sm:text-5xl">
                Symphony of the Sea
              </h2>
              <p className="mt-2 max-w-xl text-sm text-on-image/90 sm:text-base">
                Buffet và show pháo hoa. Người lớn 1.200.000đ từ Chủ nhật đến thứ Năm, 1.300.000đ thứ Sáu và thứ Bảy.
                Phụ thu bàn sát biển tính theo bàn.
              </p>
              <span className="mt-4 inline-flex h-12 items-center rounded-full bg-[image:var(--gradient-primary)] px-5 text-sm font-semibold text-primary-foreground">
                Giữ vé sự kiện
              </span>
            </div>
          </Link>
        </Reveal>
      </section>

      {/* STORIES */}
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
        <Reveal>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Stories điểm đến
          </p>
          <StoriesRow />
        </Reveal>
      </section>

      {/* MARQUEE — only cities with inventory */}
      <section className="py-6">
        <Marquee>
          {CITIES_WITH_STAYS.map((d) => (
            <Link
              key={d}
              to="/khach-san"
              search={{ dest: d, in: weekend.checkIn, out: weekend.checkOut }}
              className="shrink-0 rounded-full border bg-card px-5 py-2 text-sm font-medium shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
            >
              {d}
            </Link>
          ))}
        </Marquee>
      </section>

      {/* DEALS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Ưu đãi hôm nay</p>
            <h2 className="mt-1 font-display text-2xl font-bold sm:text-4xl">
              Giá <span className="italic text-primary">đang giảm</span>
            </h2>
          </div>
          <Link
            to="/khach-san"
            className="group flex shrink-0 items-center gap-1 text-sm font-semibold text-primary"
          >
            Xem tất cả
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-6">
          {DEAL_HOTELS.map((hotel, index) => {
            const off = dealOff(hotel);
            return (
              <Reveal key={hotel.id} delay={index * 50} className="w-44 shrink-0 sm:w-auto">
                <Link
                  to="/khach-san/$id"
                  params={{ id: hotel.id }}
                  className="group block overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      {...imgProps(hotel.image, "(min-width: 1024px) 180px, 176px")}
                      alt={hotel.name}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-2 top-2 rounded-md bg-secondary px-2 py-0.5 text-[11px] font-bold text-secondary-foreground">
                      -{off}%
                    </span>
                  </div>
                  <div className="space-y-1 p-3">
                    <p className="line-clamp-1 text-sm font-semibold">{hotel.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {hotel.rating.toFixed(1)} · {ratingLabel(hotel.rating)}
                    </p>
                    <p className="text-sm font-bold text-primary">
                      {formatVnd(hotel.price)}
                      <span className="ml-1 text-xs font-medium text-muted-foreground line-through">
                        {formatVnd(hotel.oldPrice)}
                      </span>
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* FEATURED SLIDER */}
      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-2 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              01 · Nổi bật
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold sm:text-4xl">
              Khách sạn <span className="italic text-primary">được yêu thích</span>
            </h2>
          </div>
          <Link
            to="/khach-san"
            className="group flex shrink-0 items-center gap-1 text-sm font-semibold text-primary"
          >
            Xem tất cả
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <Reveal delay={120} className="-mx-4 sm:mx-0">
          <CoverflowSlider hotels={HOTELS} />
        </Reveal>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Tour nổi bật</p>
            <h2 className="mt-1 font-display text-2xl font-bold sm:text-4xl">
              Lịch trình <span className="italic text-primary">đang mở</span>
            </h2>
          </div>
          <Link to="/tour" className="group flex shrink-0 items-center gap-1 text-sm font-semibold text-primary">
            Xem 15 tour
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
          Giá mỗi khách như niêm yết trong hệ thống. Giữ chỗ trên máy này, chưa phải xác nhận. Nhật Bản và mùa hoa là lịch DFxTrip, không hứa còn chỗ.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((tour, index) => (
            <Reveal key={tour.slug} delay={index * 70}>
              <TourCard tour={tour} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Khách đã đi</p>
          <h2 className="mt-1 font-display text-2xl font-bold sm:text-4xl">
            Đánh giá <span className="italic text-primary">khách hàng</span>
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Mỗi thẻ là một lời và một ảnh chuyến đi. Không phải điểm sao tổng hợp.
          </p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {GUEST_REVIEWS.map((review, index) => (
            <Reveal key={review.id} delay={index * 60}>
              <GuestReviewCard review={review} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* CINEMATIC SHOWCASE */}
      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Cách tìm
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold sm:text-4xl">
            Gõ nơi ở, số khách <span className="italic text-primary">và ngày đi</span>
          </h2>
        </Reveal>
        <CinematicShowcase />
      </section>

      {/* SUGGESTIONS */}
      <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-display text-xl font-bold sm:text-3xl">
            Gợi ý <span className="italic text-primary">cho bạn</span>
          </h2>
          <Link
            to="/khach-san"
            className="group flex shrink-0 items-center gap-1 text-sm font-semibold text-primary"
          >
            Xem thêm
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2">
          {SUGGESTED.map((h, i) => (
            <Reveal key={h.id} delay={i * 90}>
              <HotelRow hotel={h} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* DESTINATIONS — inventory cities + Phú Quốc tickets */}
      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">02 · Điểm đến</p>
          <h2 className="mt-1 font-display text-2xl font-bold sm:text-4xl">
            Đi đâu <span className="italic text-primary">cuối tuần này?</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ngày {weekend.checkIn.slice(8)}/{weekend.checkIn.slice(5, 7)} –{" "}
            {weekend.checkOut.slice(8)}/{weekend.checkOut.slice(5, 7)}. Chỉ nơi đang có chỗ nghỉ hoặc vé.
          </p>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {WEEKEND_TILES.map((t, i) => (
            <Reveal
              key={t.city}
              delay={i * 80}
              className={i === 0 ? "col-span-2 md:col-span-1 md:row-span-2" : ""}
            >
              <Link
                to="/khach-san"
                search={{
                  dest: t.city,
                  in: weekend.checkIn,
                  out: weekend.checkOut,
                  adults: 2,
                  rooms: 1,
                }}
                className={
                  "group relative block overflow-hidden rounded-2xl " +
                  (i === 0 ? "min-h-56 md:h-full md:min-h-[28rem]" : "min-h-40")
                }
              >
                <img
                  {...imgProps(
                    t.img,
                    i === 0 ? "(min-width: 768px) 33vw, 100vw" : "(min-width: 768px) 33vw, 50vw",
                  )}
                  alt={t.city}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[image:var(--gradient-image-fade)]" />
                <div className="absolute inset-x-3 bottom-3 flex items-end justify-between text-on-image">
                  <div>
                    <p className="font-display text-xl font-bold sm:text-2xl">{t.city}</p>
                    <p className="text-xs opacity-90">
                      {t.count} chỗ nghỉ · từ {formatVnd(t.from)}
                    </p>
                  </div>
                  <span className="glass-dark grid size-9 place-items-center rounded-full transition-transform duration-500 group-hover:-rotate-45">
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
          <Reveal delay={320} className="col-span-2 md:col-span-2">
            <Link
              to="/ve"
              className="group relative block min-h-40 overflow-hidden rounded-2xl"
            >
              <img
                {...imgProps("/photos/fireworks.webp", "(min-width: 768px) 66vw, 100vw")}
                alt="Vé Symphony of the Sea Phú Quốc"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[image:var(--gradient-image-fade)]" />
              <div className="absolute inset-x-3 bottom-3 flex items-end justify-between text-on-image">
                <div>
                  <p className="font-display text-xl font-bold sm:text-2xl">Phú Quốc</p>
                  <p className="text-xs opacity-90">Vé Symphony of the Sea · từ 1.200.000đ</p>
                </div>
                <span className="glass-dark grid size-9 place-items-center rounded-full transition-transform duration-500 group-hover:-rotate-45">
                  <ArrowRight className="size-4" />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* STATS / DEALS */}
      <section id="uu-dai" className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-secondary p-6 text-secondary-foreground sm:p-10">
            <div className="absolute -right-20 -top-20 size-72 animate-float rounded-full bg-primary/40 blur-3xl" />
            <div className="absolute -bottom-24 left-10 size-64 rounded-full bg-primary-glow/20 blur-3xl" />
            <div className="relative grid gap-8 md:grid-cols-[1.2fr_2fr] md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-glow">
                  03 · Vì sao chọn DFxTrip
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
                  Đặt nhanh, <span className="italic text-primary-glow">ở sang.</span>
                </h2>
                <p className="mt-3 text-sm opacity-80">
                  Giá phòng và vé hiện trước khi giữ chỗ. Giữ chỗ lưu trên máy này, chưa phải xác nhận.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { v: HOTELS.length, s: "", l: "Chỗ nghỉ đang mở" },
                  { v: 4, s: "", l: "Điểm đến" },
                  { v: 10, s: "%", l: "Giảm tiền phòng" },
                ].map((x) => (
                  <div
                    key={x.l}
                    className="rounded-2xl border border-secondary-foreground/15 bg-secondary-foreground/5 p-4 backdrop-blur"
                  >
                    <p className="font-display text-2xl font-bold sm:text-4xl">
                      <NumberTicker value={x.v} />
                      <span className="text-primary-glow">{x.s}</span>
                    </p>
                    <p className="mt-1 text-xs opacity-75">{x.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
