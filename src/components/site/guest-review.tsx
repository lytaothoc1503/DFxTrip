import type { GuestReview } from "@/lib/content";

export function GuestReviewCard({ review }: { review: GuestReview }) {
  return (
    <article className="overflow-hidden rounded-3xl border bg-card text-center shadow-[var(--shadow-soft)]">
      <img
        src={review.image}
        alt={review.imageAlt}
        width={500}
        height={500}
        loading="lazy"
        decoding="async"
        className="aspect-square w-full object-cover"
      />
      <div className="px-4 py-4">
        <h3 className="font-display text-lg font-semibold">{review.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/80">“{review.text}”</p>
      </div>
    </article>
  );
}
