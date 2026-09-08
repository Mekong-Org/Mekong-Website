/** Running text band. The track is duplicated so the loop has no seam. */
export function Marquee({
  text,
  reverse = false,
  overlap = false,
  tilt,
}: {
  text: string;
  reverse?: boolean;
  /** Pull the band up over the block above it, so it crosses the seam. */
  overlap?: boolean;
  /** Tilt in degrees. Opposite signs on two bands read as a cross-hatch. */
  tilt?: number;
}) {
  return (
    <div
      className={`kt-marquee-slot${overlap ? " kt-marquee-slot--overlap" : ""}`}
      aria-hidden="true"
    >
      <div
        className={`kt-marquee${reverse ? " kt-marquee--reverse" : ""}`}
        style={
          tilt === undefined
            ? undefined
            : ({ "--kt-marquee-tilt": `${tilt}deg` } as React.CSSProperties)
        }
      >
        <div className="kt-marquee__track">
          {[0, 1].map((copy) => (
            <span key={copy} className="kt-marquee__text">
              {Array.from({ length: 4 }, () => text).join(" · ")} ·{" "}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
