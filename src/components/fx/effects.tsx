import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RevealVariant = "rise" | "toss" | "swipe";

/** Fade + blur + rise (or toss / swipe) when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
  variant = "rise",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
  variant?: RevealVariant;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={cn(
        "reveal",
        variant === "toss" && "reveal-toss",
        variant === "swipe" && "reveal-swipe",
        visible && "is-visible",
        className,
      )}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** Horizontal touch-friendly rail with scroll snap (lướt). */
export function SwipeRail({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("no-scrollbar swipe-rail flex gap-2 overflow-x-auto pb-1", className)}>
      {children}
    </div>
  );
}

/** Words blur in one after another. */
export function TextReveal({
  text,
  className,
  wordClassName,
  startDelay = 0,
  step = 70,
}: {
  text: string;
  className?: string;
  wordClassName?: (i: number) => string | undefined;
  startDelay?: number;
  step?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          className={cn("word-reveal", wordClassName?.(i))}
          style={{ "--delay": `${startDelay + i * step}ms` } as CSSProperties}
        >
          {w}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}

/** Counts up to a value when visible. */
export function NumberTicker({ value, duration = 1400 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 4);
        setN(Math.round(value * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);
  return (
    <span ref={ref} className="tabular-nums" data-count={value}>
      {n.toLocaleString("vi-VN")}
    </span>
  );
}

/** Shared reduced-motion flag for depth / throw interactions. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

/**
 * Shared depth card: cursor spotlight + subtle 3D tilt (pointer devices).
 * Honors prefers-reduced-motion. Prefer this over one-off transforms.
 */
export function DepthCard({
  children,
  className,
  tilt = true,
}: {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    if (tilt) {
      const ny = y / r.height - 0.5;
      const nx = x / r.width - 0.5;
      el.style.transform = `perspective(var(--depth-perspective)) rotateX(calc(${-ny * 2} * var(--tilt-max-x))) rotateY(calc(${nx * 2} * var(--tilt-max-y))) translateY(-4px)`;
    }
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn(
        "depth-card spotlight transition-[transform,box-shadow] duration-500 ease-[var(--ease-throw)] will-change-transform",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** @deprecated Prefer DepthCard — kept as a thin alias for existing call sites. */
export function SpotlightCard(props: {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
}) {
  return <DepthCard {...props} />;
}

/** Infinite horizontal marquee. */
export function Marquee({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mask-fade-x overflow-hidden", className)}>
      <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
        {children}
        {children}
      </div>
    </div>
  );
}

/** Adds .no-vt to <html> when the browser lacks View Transitions. */
export function useViewTransitionFallback() {
  useEffect(() => {
    if (
      typeof (document as Document & { startViewTransition?: unknown }).startViewTransition !==
      "function"
    ) {
      document.documentElement.classList.add("no-vt");
    }
  }, []);
}
