import { Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Star, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { formatVnd, HOTELS, ratingLabel, type Hotel } from "@/lib/hotels";
import { HeartButton, imgTransition } from "@/components/site/hotel-card";
import { imgProps } from "@/lib/images";

/* ------------------------------------------------------------------ */
/* Segmented progress bars (shared by hero + stories)                  */
/* ------------------------------------------------------------------ */
function ProgressBars({
  count,
  active,
  duration,
  paused,
  onDone,
  onPick,
  className,
}: {
  count: number;
  active: number;
  duration: number;
  paused?: boolean;
  onDone: () => void;
  onPick?: (i: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-1.5", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Ảnh ${i + 1}`}
          onClick={(e) => {
            e.stopPropagation();
            onPick?.(i);
          }}
          className="relative h-1 flex-1 overflow-hidden rounded-full bg-on-image/30"
        >
          <span
            key={i === active ? `a-${active}` : `i-${i}`}
            onAnimationEnd={i === active ? onDone : undefined}
            className={cn(
              "absolute inset-0 origin-left rounded-full bg-on-image",
              i < active && "scale-x-100",
              i > active && "scale-x-0",
              i === active && "animate-[progress-fill_linear_forwards]",
            )}
            style={
              i === active
                ? ({
                    animationDuration: `${duration}ms`,
                    animationPlayState: paused ? "paused" : "running",
                  } as CSSProperties)
                : undefined
            }
          />
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero background slider — crossfade + ken burns + progress bars      */
/* ------------------------------------------------------------------ */
export type HeroSlide = { img: string; city: string; caption: string };

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const next = useCallback(() => setI((v) => (v + 1) % slides.length), [slides.length]);
  const prev = () => setI((v) => (v - 1 + slides.length) % slides.length);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const s = slides[i]!;
  return (
    <>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {slides.map((sl, idx) => (
          <img
            key={sl.img}
            {...imgProps(sl.img, "100vw")}
            alt=""
            aria-hidden
            decoding="async"
            fetchPriority={idx === 0 ? "high" : "low"}
            loading={idx === 0 ? "eager" : "lazy"}
            className={cn(
              "absolute inset-0 size-full object-cover transition-[opacity,transform,filter] duration-[1400ms] ease-[var(--ease-out-expo)]",
              idx === i ? "animate-kenburns opacity-100 blur-0" : "scale-110 opacity-0 blur-sm",
            )}
          />
        ))}
        <div className="absolute inset-0 bg-[image:var(--gradient-hero-fade)]" />
      </div>

      <div
        className="mx-auto mt-6 flex max-w-md items-center gap-3 md:mt-8"
        role="group"
        aria-label="Ảnh điểm đến"
        onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        <button
          type="button"
          onClick={prev}
          aria-label="Ảnh trước"
          className="glass-dark grid size-8 shrink-0 place-items-center rounded-full transition-transform active:scale-90"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        <div className="min-w-0 flex-1">
          <p
            key={s.city}
            className="word-reveal mb-2 flex items-center justify-center gap-1 truncate text-xs font-semibold text-on-image"
          >
            <MapPin className="size-3.5 shrink-0" aria-hidden /> {s.caption}
          </p>
          <ProgressBars
            count={slides.length}
            active={i}
            duration={6000}
            paused={paused}
            onDone={next}
            onPick={setI}
          />
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Ảnh tiếp"
          className="glass-dark grid size-8 shrink-0 place-items-center rounded-full transition-transform active:scale-90"
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Coverflow hotel slider (Embla + scale/opacity tween)                */
/* ------------------------------------------------------------------ */
const clamp = (n: number, a: number, b: number) => Math.min(Math.max(n, a), b);

function useCoverflowTween(api: EmblaCarouselType | undefined) {
  const factor = useRef(0);
  const nodes = useRef<HTMLElement[]>([]);

  const setup = useCallback((e: EmblaCarouselType) => {
    nodes.current = e.slideNodes().map((n) => n.querySelector<HTMLElement>("[data-tween]")!);
    factor.current = 0.6 * e.scrollSnapList().length;
  }, []);

  const tween = useCallback((e: EmblaCarouselType, evt?: string) => {
    const engine = e.internalEngine();
    const progress = e.scrollProgress();
    const inView = e.slidesInView();
    e.scrollSnapList().forEach((snap, snapIndex) => {
      let diff = snap - progress;
      engine.slideRegistry[snapIndex]?.forEach((slideIndex) => {
        if (evt === "scroll" && !inView.includes(slideIndex)) return;
        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((lp) => {
            const t = lp.target();
            if (slideIndex === lp.index && t !== 0) {
              diff = Math.sign(t) === -1 ? snap - (1 + progress) : snap + (1 - progress);
            }
          });
        }
        const v = clamp(1 - Math.abs(diff * factor.current), 0, 1);
        const node = nodes.current[slideIndex];
        if (!node) return;
        node.style.transform = `scale(${0.84 + 0.16 * v})`;
        node.style.opacity = String(0.45 + 0.55 * v);
        node.style.setProperty("--focus", String(v));
      });
    });
  }, []);

  useEffect(() => {
    if (!api) return;
    setup(api);
    tween(api);
    api.on("reInit", setup).on("reInit", tween).on("scroll", tween).on("slideFocus", tween);
    return () => {
      api.off("reInit", setup).off("reInit", tween).off("scroll", tween).off("slideFocus", tween);
    };
  }, [api, setup, tween]);
}

function CoverSlide({ hotel }: { hotel: Hotel }) {
  const off = hotel.oldPrice ? Math.round((1 - hotel.price / hotel.oldPrice) * 100) : 0;
  return (
    <div
      data-tween
      className="h-full transition-[transform,opacity] duration-150 ease-out will-change-transform"
    >
      <Link
        to="/khach-san/$id"
        params={{ id: hotel.id }}
        className="group relative block aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-lift)]"
      >
        <img
          {...imgProps(hotel.image, "(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 76vw")}
          alt={hotel.name}
          decoding="async"
          loading="lazy"
          draggable={false}
          style={imgTransition(hotel.id)}
          className="absolute inset-0 size-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-[image:var(--gradient-image-fade)]" />

        <div className="absolute inset-x-3 top-3 flex items-start justify-between">
          <div className="flex flex-col items-start gap-1.5">
            {hotel.badge && (
              <span className="glass-dark rounded-full px-3 py-1 text-[11px] font-semibold">
                {hotel.badge}
              </span>
            )}
            {off > 0 && (
              <span className="rounded-full bg-[image:var(--gradient-primary)] px-2.5 py-0.5 text-[11px] font-bold text-primary-foreground shadow-[var(--shadow-glow)]">
                -{off}%
              </span>
            )}
          </div>
          <HeartButton id={hotel.id} />
        </div>

        <div className="glass-dark absolute inset-x-3 bottom-3 rounded-2xl p-3.5">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold opacity-90">
            <Star className="size-3.5 fill-star text-star" aria-hidden />
            {hotel.rating.toFixed(1)} · {ratingLabel(hotel.rating)}
            <span className="opacity-70">({hotel.reviews.toLocaleString("vi-VN")})</span>
          </div>
          <h3 className="mt-1 line-clamp-1 font-display text-lg font-semibold leading-tight">
            {hotel.name}
          </h3>
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs opacity-80">
            <MapPin className="size-3 shrink-0" aria-hidden /> {hotel.area}
          </p>
          <div className="mt-2.5 flex items-end justify-between">
            <p className="text-lg font-bold">
              {formatVnd(hotel.price)}
              <span className="text-[11px] font-medium opacity-75"> /đêm</span>
            </p>
            <span className="shine grid size-9 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-500 group-hover:-rotate-45">
              <ArrowRight className="size-4" aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export function CoverflowSlider({ hotels }: { hotels: Hotel[] }) {
  const [ref, api] = useEmblaCarousel({ loop: true, align: "center" });
  const [sel, setSel] = useState(0);
  useCoverflowTween(api);

  useEffect(() => {
    if (!api) return;
    const on = () => setSel(api.selectedScrollSnap());
    on();
    api.on("select", on).on("reInit", on);
    return () => {
      api.off("select", on).off("reInit", on);
    };
  }, [api]);

  return (
    <div className="relative" role="region" aria-roledescription="băng chuyền" aria-label="Khách sạn được yêu thích">
      <div ref={ref} className="overflow-hidden py-4">
        <div className="-ml-3 flex touch-pan-y">
          {hotels.map((h) => (
            <div
              key={h.id}
              className="min-w-0 shrink-0 grow-0 basis-[76%] pl-3 sm:basis-[46%] lg:basis-[30%]"
            >
              <CoverSlide hotel={h} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Khách sạn trước"
          onClick={() => api?.scrollPrev()}
          className="grid size-10 place-items-center rounded-full border bg-card shadow-[var(--shadow-soft)] transition-all hover:border-primary hover:text-primary active:scale-90"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <div className="flex items-center gap-1.5">
          {hotels.map((h, i) => (
            <button
              key={h.id}
              type="button"
              aria-label={`Đến ${h.name}`}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-500 ease-[var(--ease-out-expo)]",
                i === sel ? "w-7 bg-[image:var(--gradient-primary)]" : "w-2 bg-border",
              )}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Khách sạn tiếp"
          onClick={() => api?.scrollNext()}
          className="grid size-10 place-items-center rounded-full border bg-card shadow-[var(--shadow-soft)] transition-all hover:border-primary hover:text-primary active:scale-90"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Destination stories — ring avatars + full-screen viewer             */
/* ------------------------------------------------------------------ */
type StorySlide = { img: string; hotel: Hotel };
type Story = { city: string; cover: string; slides: StorySlide[] };

function buildStories(): Story[] {
  const byCity = new Map<string, Hotel[]>();
  HOTELS.forEach((h) => byCity.set(h.city, [...(byCity.get(h.city) ?? []), h]));
  const stories: Story[] = [];
  byCity.forEach((hotels, city) => {
    stories.push({
      city,
      cover: hotels[0]!.image,
      slides: hotels.flatMap((h) => h.gallery.slice(0, 2).map((img) => ({ img, hotel: h }))),
    });
  });
  const deals = HOTELS.filter((h) => h.oldPrice);
  stories.unshift({
    city: "Ưu đãi",
    cover: deals[0]?.gallery[1] ?? HOTELS[0]!.image,
    slides: deals.map((h) => ({ img: h.image, hotel: h })),
  });
  return stories;
}

const STORIES = buildStories();

export function StoriesRow() {
  const [open, setOpen] = useState<number | null>(null);
  const [seen, setSeen] = useState<string[]>([]);
  return (
    <>
      <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="list">
        {STORIES.map((s, i) => {
          const isSeen = seen.includes(s.city);
          return (
            <button
              key={s.city}
              type="button"
              onClick={() => setOpen(i)}
              className="group flex w-[72px] shrink-0 flex-col items-center gap-1.5"
              role="listitem"
            >
              <span
                className={cn(
                  "grid size-[68px] place-items-center rounded-full p-[3px] transition-transform duration-500 ease-[var(--ease-out-expo)] group-active:scale-90",
                  isSeen ? "bg-border" : "story-ring",
                )}
              >
                <span className="block size-full overflow-hidden rounded-full border-[3px] border-background">
                  <img
                    {...imgProps(s.cover, "68px")}
                    alt={s.city}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </span>
              </span>
              <span
                className={cn(
                  "w-full truncate text-center text-[11px] font-semibold",
                  isSeen ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {s.city}
              </span>
            </button>
          );
        })}
      </div>
      {open !== null && (
        <StoryViewer
          start={open}
          onSeen={(c) => setSeen((v) => (v.includes(c) ? v : [...v, c]))}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}

function StoryViewer({
  start,
  onClose,
  onSeen,
}: {
  start: number;
  onClose: () => void;
  onSeen: (city: string) => void;
}) {
  const [si, setSi] = useState(start);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const story = STORIES[si]!;
  const slide = story.slides[i]!;

  useEffect(() => {
    onSeen(story.city);
  }, [story.city, onSeen]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  });

  function next() {
    if (i < story.slides.length - 1) return setI(i + 1);
    if (si < STORIES.length - 1) {
      setSi(si + 1);
      setI(0);
      return;
    }
    onClose();
  }
  function prev() {
    if (i > 0) return setI(i - 1);
    if (si > 0) {
      setSi(si - 1);
      setI(0);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Story ${story.city}`}
      className="story-backdrop fixed inset-0 z-[70] grid place-items-center bg-secondary/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        key={si}
        className="story-enter relative h-full w-full overflow-hidden bg-secondary text-on-image sm:h-[86vh] sm:max-w-[420px] sm:rounded-[2rem] sm:shadow-[var(--shadow-lift)]"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerCancel={() => setPaused(false)}
      >
        {story.slides.map((sl, idx) =>
          idx === i || idx === Math.min(story.slides.length - 1, i + 1) ? (
            <img
              key={`${sl.img}-${idx}`}
              {...imgProps(sl.img, "(min-width: 640px) 420px, 100vw")}
              alt={idx === i ? sl.hotel.name : ""}
              decoding="async"
              fetchPriority={idx === i ? "high" : "low"}
              className={cn(
                "absolute inset-0 size-full object-cover transition-opacity duration-500",
                idx === i ? "animate-kenburns opacity-100" : "opacity-0",
              )}
            />
          ) : null,
        )}
        <div className="absolute inset-0 bg-[image:var(--gradient-image-fade)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-secondary/70 to-transparent" />

        {/* tap zones */}
        <button
          type="button"
          aria-label="Trước"
          className="absolute inset-y-0 left-0 z-10 w-1/3"
          onClick={prev}
        />
        <button
          type="button"
          aria-label="Tiếp"
          className="absolute inset-y-0 right-0 z-10 w-2/3"
          onClick={next}
        />

        <div className="absolute inset-x-0 top-0 z-20 p-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <ProgressBars
            count={story.slides.length}
            active={i}
            duration={4500}
            paused={paused}
            onDone={next}
            onPick={setI}
          />
          <div className="mt-3 flex items-center gap-2.5">
            <img
              {...imgProps(story.cover, "36px")}
              alt=""
              decoding="async"
              className="size-9 rounded-full border-2 border-on-image object-cover"
            />
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-sm font-bold">{story.city}</p>
              <p className="text-[11px] opacity-80">
                {i + 1}/{story.slides.length} · DFxTrip Stories
              </p>
            </div>
            <button
              type="button"
              aria-label="Đóng"
              onClick={onClose}
              className="glass-dark grid size-9 place-items-center rounded-full"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
        </div>

        <div
          key={slide.hotel.id + i}
          className="word-reveal glass-dark absolute inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-20 rounded-3xl p-4"
        >
          <p className="flex items-center gap-1 text-xs opacity-85">
            <MapPin className="size-3.5" aria-hidden /> {slide.hotel.area}
          </p>
          <h3 className="mt-1 font-display text-2xl font-semibold leading-tight">
            {slide.hotel.name}
          </h3>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] opacity-75">Chỉ từ</p>
              <p className="text-xl font-bold">
                {formatVnd(slide.hotel.price)}
                <span className="text-xs font-medium opacity-75"> /đêm</span>
              </p>
            </div>
            <Link
              to="/khach-san/$id"
              params={{ id: slide.hotel.id }}
              className="shine inline-flex h-11 items-center gap-1.5 rounded-full bg-[image:var(--gradient-primary)] px-5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
            >
              Xem phòng <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
