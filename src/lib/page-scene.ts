/** Atmospheric scene id for main category pages. */
export type PageScene =
  | "home"
  | "hotels"
  | "tours"
  | "tickets"
  | "holds"
  | "favorites"
  | "pay"
  | "account"
  | "default";

export function resolvePageScene(pathname: string): PageScene {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/khach-san")) return "hotels";
  if (pathname.startsWith("/tour")) return "tours";
  if (pathname.startsWith("/ve")) return "tickets";
  if (pathname.startsWith("/dat-cho")) return "holds";
  if (pathname.startsWith("/yeu-thich")) return "favorites";
  if (pathname.startsWith("/thanh-toan")) return "pay";
  if (pathname.startsWith("/tai-khoan") || pathname.startsWith("/login")) return "account";
  return "default";
}
