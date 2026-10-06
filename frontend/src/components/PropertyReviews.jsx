import { Star } from "lucide-react";
import reviews from "virtual:property-reviews";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const PropertyReviews = ({ propertyId }) => {
  const propertyReviews = reviews
    .filter((review) => review.propertyId === propertyId)
    .sort((first, second) => second.date.localeCompare(first.date));
  const reviewCount = propertyReviews.length;
  const averageRating = reviewCount
    ? propertyReviews.reduce((total, review) => total + review.rating, 0) / reviewCount
    : 0;

  return (
    <section
      aria-labelledby="property-reviews-heading"
      className="border-t border-line-strong pt-12"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="property-reviews-heading"
          className="text-[28px] font-bold leading-tight text-ink sm:text-[32px]"
        >
          Reviews
        </h2>
        {reviewCount > 0 && (
          <span className="rounded-full border border-line bg-surface-muted px-3 py-1 text-sm text-ink-muted">
            Reviews
          </span>
        )}
      </div>

      {reviewCount > 0 ? (
        <>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-ink">
            <Star
              size={24}
              fill="currentColor"
              aria-hidden="true"
              className="text-pine-700"
            />
            <span
              aria-label={`Average rating: ${averageRating.toFixed(2)} out of 5 stars`}
              className="text-[26px] font-semibold tabular-nums"
            >
              {averageRating.toFixed(2)}
            </span>
            <span className="text-lg text-ink-muted">out of 5</span>
            <span aria-hidden="true" className="text-ink-subtle">·</span>
            <span className="text-lg font-medium">
              {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
            {propertyReviews.map((review) => (
              <article key={review.id}>
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-pine-50 text-lg font-semibold text-pine-700"
                  >
                    {review.userName
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((name) => name.charAt(0))
                      .join("")
                      .toUpperCase()}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-ink">
                      {review.userName}
                    </h3>
                    <time dateTime={review.date} className="text-sm text-ink-muted">
                      {dateFormatter.format(new Date(`${review.date}T00:00:00Z`))}
                    </time>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span
                    role="img"
                    aria-label={`${review.rating} out of 5 stars`}
                    className="flex gap-1"
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        fill={star <= review.rating ? "currentColor" : "none"}
                        aria-hidden="true"
                        className={star <= review.rating ? "text-pine-700" : "text-ink-subtle"}
                      />
                    ))}
                  </span>
                  <span aria-hidden="true" className="text-sm font-medium text-ink-muted">
                    {review.rating}/5
                  </span>
                </div>

                <p className="mt-3 wrap-break-word text-lg leading-7 text-ink-muted">
                  {review.comment}
                </p>
              </article>
            ))}
          </div>
        </>
      ) : (
        <p className="mt-3 text-lg leading-7 text-ink-muted">No reviews yet.</p>
      )}
    </section>
  );
};

export default PropertyReviews;
