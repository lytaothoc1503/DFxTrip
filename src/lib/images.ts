import { IMAGE_META } from "@/lib/image-meta";

const STEPS = [160, 480, 800] as const;

/** src + srcset cho ảnh public đã có bản nhỏ cạnh file gốc. */
export function imgProps(src: string, sizes: string) {
  const meta = IMAGE_META[src];
  if (!meta) return { src };
  const base = src.replace(/\.webp$/, "");
  const parts = STEPS.filter((w) => meta.w > w + 24).map((w) => `${base}-${w}.webp ${w}w`);
  parts.push(`${src} ${meta.w}w`);
  return {
    src,
    width: meta.w,
    height: meta.h,
    srcSet: parts.length > 1 ? parts.join(", ") : undefined,
    sizes: parts.length > 1 ? sizes : undefined,
  };
}
