import { useTranslation } from "react-i18next";

const BRANDS = [
  { name: "Chevrolet", logo: "/images/chevrolet.png" },
  { name: "GMC", logo: "/images/gmc.png" },
  { name: "Land Rover", logo: "/images/landrover.png" },
  { name: "Ford", logo: "/images/ford.png" },
  // dark artwork: inverted on the dark theme so it stays readable
  { name: "Leadbox", logo: "/images/leadboxLogo.png", invert: true },
  { name: "Valdusoft", logo: "/images/valdusoft.webp" },
  { name: "Vulister", logo: "/images/vulister.png" },
];

// Rendered twice so the marquee can loop seamlessly at -50%.
const LOOP = [...BRANDS, ...BRANDS];

export default function Brands() {
  const { t } = useTranslation();

  return (
    <section className="brands" aria-label={t("brands_worked")}>
      <p>{t("brands_worked")}</p>
      <div className="carousel-container" aria-hidden>
        <div className="carousel-track">
          {LOOP.map((b, i) => (
            <div key={`${b.name}-${i}`} className="carousel-item">
              <img src={b.logo} alt="" decoding="async" width="160" height="64" {...(b.invert && { "data-invert": true })} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
