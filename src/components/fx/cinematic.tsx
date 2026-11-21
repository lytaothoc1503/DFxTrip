import { useEffect, useRef, useState, type CSSProperties } from "react";
import { MapPin, Search, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { HOTELS, formatVnd } from "@/lib/hotels";
import { imgProps } from "@/lib/images";

/** Starts true once the element enters the viewport (one-shot). */
function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

/** Text that resolves out of scattered pixel noise, word by word. */
export function PixelResolve({
  text,
  active,
  delay = 0,
  className,
}: {
  text: string;
  active: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline", className)}>
      {text.split(" ").map((w, i) => (
        <span
          key={i}
          className={cn("pixel-resolve", active && "is-on")}
          style={{ "--d": `${delay + i * 70}ms` } as CSSProperties}
        >
          {w}
          {"\u00a0"}
        </span>
      ))}
    </span>
  );
}

/** Types text key by key once active. */
function useTyping(text: string, active: boolean, cps = 20, startDelay = 500) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      i += 1;
      setN(i);
      if (i < text.length) t = setTimeout(tick, 1000 / cps + Math.random() * 25);
    };
    t = setTimeout(tick, startDelay);
    return () => clearTimeout(t);
  }, [text, active, cps, startDelay]);
  return text.slice(0, n);
}

const COMMAND = "Resort ven hồ Đà Lạt, 2 khách, cuối tuần này";

/**
 * Linear-style cinematic showcase: black void, UI plane in steep perspective,
 * slow camera drift, a narrow focus band walking down result rows,
 * pixel-resolving text and a glowing wordmark close.
 */
export function CinematicShowcase() {
  const [ref, active] = useInView<HTMLDivElement>();
  const typed = useTyping(COMMAND, active);
  const done = typed.length === COMMAND.length;
  const [focus, setFocus] = useState(0);
  const rows = HOTELS.slice(0, 4);

  useEffect(() => {
    if (!done) return;
    const id = setInterval(() => setFocus((f) => (f + 1) % rows.length), 1600);
    return () => clearInterval(id);
  }, [done, rows.length]);

  return (
    <div ref={ref} className="cine-void relative overflow-hidden rounded-3xl">
      <div className="cine-stage">
        <div className={cn("cine-plane", active && "is-on")}>
          {/* command composer */}
          <div className="cine-panel flex items-center gap-3 rounded-2xl px-4 py-3">
            <Search className="size-4 shrink-0 text-cine-muted" />
            <span className="font-mono text-sm text-cine-text sm:text-base">
              {typed}
              <span className="cine-caret" />
            </span>
            <span
              className={cn(
                "ml-auto rounded-lg px-2.5 py-1 text-xs font-semibold transition-all duration-500",
                done ? "cine-send-on" : "cine-send",
              )}
            >
              Tìm
            </span>
          </div>

          <p className="mt-5 text-sm text-cine-muted">
            <PixelResolve
              active={done}
              text={`Đang xem ${rows.length} chỗ nghỉ đầu danh sách`}
            />
          </p>

          {/* result rows with a walking focus band */}
          <div className="mt-3 flex flex-col gap-2.5">
            {rows.map((h, i) => (
              <div
                key={h.id}
                className={cn(
                  "cine-row flex items-center gap-3 rounded-xl p-2.5",
                  done && "is-on",
                  done && focus === i && "is-focus",
                )}
                style={{ "--d": `${400 + i * 160}ms` } as CSSProperties}
              >
                <img
                  {...imgProps(h.image, "48px")}
                  alt={h.name}
                  loading="lazy"
                  decoding="async"
                  className="size-12 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-cine-text">{h.name}</p>
                  <p className="flex items-center gap-1 text-xs text-cine-muted">
                    <MapPin className="size-3" /> {h.city}
                  </p>
                </div>
                <div className="text-right">
                  <p className="flex items-center justify-end gap-1 text-xs text-cine-text">
                    <Star className="size-3 fill-current text-primary-glow" /> {h.rating}
                  </p>
                  <p className="text-xs font-semibold text-primary-glow">{formatVnd(h.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cine-vignette pointer-events-none absolute inset-0" />

      {/* wordmark close */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 text-center">
        <p className={cn("cine-wordmark font-display text-3xl font-bold sm:text-5xl", done && "is-on")}>
          DFxTrip
        </p>
        <p className="mt-1 text-xs text-cine-muted sm:text-sm">
          <PixelResolve active={done} delay={1400} text="Đặt nhanh. Ở sang." />
        </p>
      </div>
    </div>
  );
}
