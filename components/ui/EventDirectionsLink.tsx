import { ExternalLink, MapPinned } from "lucide-react";

export default function EventDirectionsLink({
  href,
  className = "",
}: {
  href?: string | null;
  className?: string;
}) {
  if (!href) return null;

  let safeHref: string;
  try {
    const url = new URL(href);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    safeHref = url.toString();
  } catch {
    return null;
  }

  return (
    <a
      href={safeHref}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-11 items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-light/45 px-3 py-2 text-left text-brand-primary transition hover:border-brand-primary/40 hover:bg-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 ${className}`}
      aria-label="Open event location in Google Maps"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
        <MapPinned size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-extrabold leading-tight">
          Open in Google Maps
        </span>
        <span className="mt-0.5 block text-xs font-semibold text-brand-dark">
          Get Directions
        </span>
      </span>
      <ExternalLink size={15} className="shrink-0" aria-hidden="true" />
    </a>
  );
}
