import { Fragment } from "react";

/**
 * A heading whose words fade up one after another the first time it scrolls
 * into view.
 *
 * There is no JavaScript here: the words carry `data-fx-rise`, which the shared
 * ScrollFX engine already watches, and the stagger is a CSS transition-delay
 * driven by the --fx-i index on each word (see .fx-words in globals.css). That
 * also means it inherits the engine's guarantees for free — the words are plain
 * visible text when JavaScript never arrives, and the whole thing is off under
 * prefers-reduced-motion.
 */
export function WordReveal({
  text,
  className = "",
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  /** Heading level. Pick it for the document outline, not for the size. */
  as?: "h1" | "h2" | "h3";
}) {
  const words = text.split(" ");

  return (
    <Tag className={`fx-words ${className}`} data-fx-rise="">
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span style={{ "--fx-i": index } as React.CSSProperties}>{word}</span>
          {/* A real whitespace node between the inline-block words, so they
              still space and wrap the way the browser would break plain text. */}
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
