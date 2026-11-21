import type { GuestReview } from "@/lib/content";

export function GuestReviewCard({ review }: { review: GuestReview }) {
  const small = review.image.replace(/\.webp$/, "-400.webp");
  return (
    <article className="overflow-hidden rounded-3xl border bg-card text-center shadow-[var(--shadow-soft)]">
      <img
        src={review.image}
        srcSet={`${small} 400w, ${review.image} 640w`}
        sizes="(min-width: 1280px) 220px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
        alt={review.imageAlt}
        width={640}
        height={640}
        loading="lazy"
        decoding="async"
        className="aspect-square w-full object-cover"
      />
      <div className="px-4 py-4">
        <h3 className="font-display text-lg font-semibold">{review.name}</h3>
        <blockquote className="mt-2 text-sm leading-relaxed text-foreground/80">
          <p>“{review.text}”</p>
        </blockquote>
      </div>
    </article>
  );
}
