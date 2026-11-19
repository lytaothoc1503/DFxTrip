import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarCheck, Compass, Heart, Home, Ticket } from "lucide-react";

const tabs = [
  { to: "/", label: "Trang chủ", icon: Home },
  { to: "/kham-pha", label: "Khám phá", icon: Compass },
  { to: "/ve", label: "Vé show", icon: Ticket },
  { to: "/yeu-thich", label: "Yêu thích", icon: Heart },
  { to: "/dat-cho", label: "Đặt chỗ", icon: CalendarCheck },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link to="/" className="grid h-11 w-11 place-items-center rounded-full bg-brand text-lg font-semibold text-on-brand">
            V
          </Link>
          <span>
            <span className="block text-lg font-semibold leading-none">VinaStay</span>
            <span className="text-sm text-muted">Khám phá. Đặt chỗ. Trải nghiệm.</span>
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-28 pt-4">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 backdrop-blur">
        <ul className="mx-auto grid max-w-3xl grid-cols-5">
          {tabs.map((tab) => {
            const active = path === tab.to;
            const Icon = tab.icon;
            return (
              <li key={tab.to}>
                <Link
                  to={tab.to}
                  className={`flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium ${
                    active ? "text-brand" : "text-muted"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
