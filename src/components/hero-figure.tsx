import Image from "next/image";
import { site } from "@/lib/site";

type HeroFigureProps = {
  className?: string;
};

/**
 * The hero subject: DJ Lethal Skillz as a transparent cutout,
 * positioned independently so typography can live behind and around him.
 */
export function HeroFigure({ className = "" }: HeroFigureProps) {
  const img = site.heroImage;

  if (!img.src) {
    return <div className={`bg-elevated ${className}`} aria-hidden="true" />;
  }

  return (
    <div className={className}>
      <Image
        src={img.src}
        alt={img.alt}
        width={800}
        height={800}
        priority
        sizes="(max-width: 768px) 92vw, 42vw"
        className="h-auto w-full"
      />
    </div>
  );
}
