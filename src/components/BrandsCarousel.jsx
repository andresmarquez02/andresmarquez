import React from "react";

export default function BrandsCarousel() {
  const brands = [
    { name: "Chevrolet", logo: "images/chevrolet.png" },
    { name: "GMC", logo: "images/gmc.png" },
    { name: "Land Rover", logo: "images/landrover.png" },
    { name: "Ford", logo: "images/ford.png" },
    { name: "Leadbox", logo: "images/leadboxLogo.png" },
    { name: "Valdusoft", logo: "images/valdusoft.webp" },
    { name: "Vulister", logo: "images/vulister.png" },
    
  ];

  return (
    <div className="w-full overflow-hidden py-8 my-8">
      <div className="carousel-container">
        <div className="carousel-track">
          {[...brands, ...brands].map((brand, index) => (
            <div
              key={index}
              className="carousel-item flex items-center justify-center px-8"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-12 md:h-16 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

