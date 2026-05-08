const BRANDS = [
  { name: "Chevrolet", logo: "images/chevrolet.png" },
  { name: "GMC", logo: "images/gmc.png" },
  { name: "Land Rover", logo: "images/landrover.png" },
  { name: "Ford", logo: "images/ford.png" },
  { name: "Leadbox", logo: "images/leadboxLogo.png" },
  { name: "Valdusoft", logo: "images/valdusoft.webp" },
  { name: "Vulister", logo: "images/vulister.png" },
];

export default function BrandsCarousel() {
  const loop = [...BRANDS, ...BRANDS];

  return (
    <div className="w-full overflow-hidden py-8 my-8" aria-hidden="true">
      <div className="carousel-container">
        <div className="carousel-track">
          {loop.map((brand, index) => (
            <div key={`${brand.name}-${index}`} className="carousel-item flex items-center justify-center px-8">
              <img
                src={brand.logo}
                alt={brand.name}
                loading="lazy"
                decoding="async"
                width="160"
                height="64"
                className="h-12 md:h-16 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
