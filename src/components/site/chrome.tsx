import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, CalendarCheck, Globe, Heart, Home, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { BRAND, phoneHref } from "@/lib/brand";
import { Button } from "@/components/ui/button";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2" aria-label="DFxTrip trang chủ">
      <span className="grid size-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] font-display text-lg font-black italic text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-105">
        D
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block text-lg font-extrabold tracking-[0.12em]",
            light ? "text-on-image" : "text-foreground",
          )}
        >
          DFxTrip
        </span>
        <span
          className={cn(
            "hidden text-[10px] font-medium tracking-wide sm:block",
            light ? "text-on-image/80" : "text-muted-foreground",
          )}
        >
          Khám phá. Đặt chỗ. Trải nghiệm.
        </span>
      </span>
    </Link>
  );
}

const NAV = [
  { to: "/", label: "Trang chủ" },
  { to: "/khach-san", label: "Khách sạn" },
  { to: "/tour", label: "Tour" },
  { to: "/dat-cho", label: "Đặt chỗ" },
  { to: "/yeu-thich", label: "Yêu thích" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled
          ? "glass border-x-0 border-t-0"
          : "border-b border-transparent bg-background/40 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Menu chính">
          {NAV.map((n) => {
            const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active ? "text-primary" : "text-foreground/80 hover:text-foreground",
                )}
              >
                {n.label}
                <span
                  className={cn(
                    "absolute inset-x-4 -bottom-0.5 h-0.5 origin-left rounded-full bg-primary transition-transform duration-500 ease-[var(--ease-out-expo)]",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/tour" className="rounded-full px-3 py-2 text-sm font-semibold text-primary md:hidden">
            Tour
          </Link>
          <button
            type="button"
            className="hidden items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted sm:flex"
          >
            <Globe className="size-4" aria-hidden /> VN
          </button>
          <button
            type="button"
            aria-label="Thông báo"
            className="relative grid size-10 place-items-center rounded-full text-foreground/80 hover:bg-muted md:hidden"
          >
            <Bell className="size-5" aria-hidden />
            <span className="absolute right-2.5 top-2.5 size-2 animate-pulse rounded-full bg-primary" />
          </button>
          <Button asChild variant="hero" className="hidden md:inline-flex">
            <Link to="/ve">Vé Phú Quốc</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

const TABS = [
  { to: "/", label: "Trang chủ", icon: Home },
  { to: "/khach-san", label: "Khám phá", icon: Search },
  { to: "/yeu-thich", label: "Yêu thích", icon: Heart },
  { to: "/dat-cho", label: "Đặt chỗ", icon: CalendarCheck },
  { to: "/tai-khoan", label: "Tài khoản", icon: User },
] as const;

export function TabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isDetail = /^\/khach-san\/[^/]+/.test(pathname);
  const idx = TABS.findIndex((t) => (t.to === "/" ? pathname === "/" : pathname.startsWith(t.to)));
  if (isDetail) return null;

  return (
    <nav
      style={{ viewTransitionName: "tab-bar" }}
      className="fixed inset-x-3 bottom-3 z-50 md:hidden"
      aria-label="Điều hướng chính"
    >
      <div className="glass relative grid grid-cols-5 rounded-3xl p-1.5">
        {idx >= 0 && (
          <span
            className="absolute bottom-1.5 left-1.5 top-1.5 rounded-2xl bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)]"
            style={{
              width: "calc((100% - 0.75rem) / 5)",
              transform: `translateX(${idx * 100}%)`,
            }}
          >
            <span className="absolute bottom-1 left-1/2 size-1.5 -translate-x-1/2 animate-pulse rounded-full bg-[image:var(--gradient-primary)] shadow-[0_0_10px_2px_color-mix(in_oklab,var(--primary-glow)_70%,transparent)]" />
          </span>
        )}
        {TABS.map((t, i) => {
          const Icon = t.icon;
          const active = i === idx;
          return (
            <Link
              key={t.to}
              to={t.to}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative z-10 flex flex-col items-center gap-0.5 rounded-2xl py-2 text-[11px] font-medium transition-colors",
                active ? "text-accent-foreground" : "text-muted-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-5 transition-transform duration-500 ease-[var(--ease-out-expo)]",
                  active && "-translate-y-0.5 scale-110",
                )}
                strokeWidth={active ? 2.4 : 1.8}
                aria-hidden
              />
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

const FOOTER_PRODUCTS = [
  { to: "/khach-san", label: "Khách sạn" },
  { to: "/tour", label: "Tour" },
  { to: "/ve", label: "Vé Phú Quốc" },
  { to: "/dat-cho", label: "Đặt chỗ" },
] as const;

const FOOTER_DESTINATIONS = [
  { to: "/khach-san", search: { dest: "Đà Lạt" }, label: "Đà Lạt" },
  { to: "/khach-san", search: { dest: "Nha Trang" }, label: "Nha Trang" },
  { to: "/khach-san", search: { dest: "Sapa" }, label: "Sapa" },
  { to: "/khach-san", search: { dest: "Hà Nội" }, label: "Hà Nội" },
  { to: "/ve", label: "Phú Quốc · vé show" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t bg-card pb-28 pt-10 md:pb-12">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">
            DFxTrip giữ chỗ trên máy này, chưa phải xác nhận. Gọi{" "}
            <a href={phoneHref()} className="font-semibold text-primary">
              {BRAND.phoneDisplay}
            </a>
            .
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Sản phẩm</p>
          <ul className="mt-3 space-y-2 text-sm">
            {FOOTER_PRODUCTS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-muted-foreground transition-colors hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Điểm đến</p>
          <ul className="mt-3 space-y-2 text-sm">
            {FOOTER_DESTINATIONS.map((item) => (
              <li key={item.label}>
                {"search" in item ? (
                  <Link
                    to={item.to}
                    search={item.search}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link to={item.to} className="text-muted-foreground transition-colors hover:text-primary">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Hỗ trợ</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              Hotline{" "}
              <a href={phoneHref()} className="font-semibold text-primary">
                {BRAND.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={BRAND.zaloUrl}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-primary"
              >
                Zalo hỗ trợ
              </a>
            </li>
            <li>{BRAND.supportNote}</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
