import Image from "next/image";

type LockupVariant = "horizontal" | "vertical";

export function CasaBrandLockup({
  variant = "horizontal",
  className = "",
  priority = false,
}: {
  variant?: LockupVariant;
  className?: string;
  priority?: boolean;
}) {
  const isHorizontal = variant === "horizontal";

  return (
    <Image
      src={
        isHorizontal
          ? "/assets/branding/logo-horizontal.png"
          : "/assets/branding/logo-vertical.png"
      }
      alt="Casa de Bloom - Where connections become opportunities"
      width={isHorizontal ? 2172 : 1254}
      height={isHorizontal ? 724 : 1254}
      quality={100}
      priority={priority}
      sizes={isHorizontal ? "(max-width: 768px) 180px, 260px" : "180px"}
      className={`object-contain ${className}`}
    />
  );
}

export function CasaMonogram({
  variant = "seal",
  className = "",
  decorative = false,
}: {
  variant?: "seal" | "tile";
  className?: string;
  decorative?: boolean;
}) {
  return (
    <Image
      src={
        variant === "seal"
          ? "/assets/branding/monogram-seal.png"
          : "/assets/branding/monogram-tile.png"
      }
      alt={decorative ? "" : "Casa de Bloom"}
      width={1254}
      height={1254}
      quality={100}
      sizes="(max-width: 768px) 72px, 96px"
      className={`object-contain ${className}`}
    />
  );
}

export function FloralFrame({
  variant = "corner",
  className = "",
}: {
  variant?: "corner" | "garland";
  className?: string;
}) {
  const isGarland = variant === "garland";

  return (
    <Image
      src={
        isGarland
          ? "/assets/branding/floral-garland.png"
          : "/assets/branding/floral-corner.png"
      }
      alt=""
      aria-hidden="true"
      width={isGarland ? 2172 : 1254}
      height={isGarland ? 724 : 1254}
      quality={100}
      sizes={isGarland ? "(max-width: 768px) 520px, 1000px" : "440px"}
      className={`pointer-events-none select-none object-contain ${className}`}
    />
  );
}
