import { useTranslation } from "react-i18next";

const BRANDS = [
  { name: "Chevrolet", logo: "images/chevrolet.png" },
  { name: "GMC", logo: "images/gmc.png" },
  { name: "Land Rover", logo: "images/landrover.png" },
  { name: "Ford", logo: "images/ford.png" },
  // dark artwork: inverted so it reads on the dark page
  { name: "Leadbox", logo: "images/leadboxLogo.png", invert: true },
  { name: "Valdusoft", logo: "images/valdusoft.webp" },
  { name: "Vulister", logo: "images/vulister.png" },
];

export default function BrandsCarousel() {
  const { t } = useTranslation();
  const loop = [...BRANDS, ...BRANDS];

  return (
    <section aria-label={t("brands_worked")}>
      <p className="mb-6 text-center font-mono text-xs uppercase tracking-widest text-fg/40">
        {t("brands_worked")}
      </p>
      <div className="fade-mask carousel-container" aria-hidden="true">
        <div className="carousel-track">
          {loop.map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="carousel-item flex items-center justify-center px-10"
            >
              <img
                src={brand.logo}
                alt=""
                decoding="async"
                width="160"
                height="64"
                className={`h-10 w-auto object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 md:h-12 ${brand.invert ? "invert" : ""}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
