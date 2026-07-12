import { getImageProps } from "next/image";

export default function CasaVillaBackdrop({
  alt = "",
  className = "",
  priority = false,
}: {
  alt?: string;
  className?: string;
  priority?: boolean;
}) {
  const common = {
    alt,
    fill: true,
    quality: 100,
    sizes: "100vw",
  } as const;
  const { props: landscape } = getImageProps({
    ...common,
    src: "/assets/branding/villa-landscape.png",
    priority,
  });
  const { props: portrait } = getImageProps({
    ...common,
    src: "/assets/branding/villa-portrait.png",
  });

  return (
    <picture>
      <source
        media="(max-width: 1023px) and (orientation: portrait)"
        srcSet={portrait.srcSet}
        sizes={portrait.sizes}
      />
      <img
        {...landscape}
        alt={alt}
        className={`pointer-events-none object-cover object-center ${className}`}
      />
    </picture>
  );
}
