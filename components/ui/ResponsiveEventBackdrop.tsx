import { getImageProps } from "next/image";

interface ResponsiveEventBackdropProps {
  alt: string;
  className?: string;
}

const LANDSCAPE_BACKGROUND = "/assets/images/bg_image_sunset_2026.webp";
const PORTRAIT_BACKGROUND = "/assets/images/bg_image_sunset_portrait_2026.webp";
const PORTRAIT_MEDIA = "(max-width: 1023px) and (orientation: portrait)";

export default function ResponsiveEventBackdrop({
  alt,
  className = "",
}: ResponsiveEventBackdropProps) {
  const common = {
    alt,
    fill: true,
    quality: 100,
    sizes: "100vw",
  } as const;
  const { props: landscape } = getImageProps({
    ...common,
    src: LANDSCAPE_BACKGROUND,
    priority: true,
  });
  const { props: portrait } = getImageProps({
    ...common,
    src: PORTRAIT_BACKGROUND,
  });

  return (
    <picture>
      <source
        media={PORTRAIT_MEDIA}
        srcSet={portrait.srcSet}
        sizes={portrait.sizes}
      />
      <img
        {...landscape}
        className={`object-cover object-center pointer-events-none ${className}`}
      />
    </picture>
  );
}
