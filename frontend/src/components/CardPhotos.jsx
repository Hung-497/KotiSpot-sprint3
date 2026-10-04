import houseImage from "../assets/house1.jpg";
import darkHouseImage from "../assets/house1_dark.png";

import { getCardPhotos } from "../utils/cardPhotos";

const CardPhotos = ({ property, index, hasHovered, photoRef, mediaClassName = "ks-media" }) => {
  const photos = getCardPhotos(property);
  const fallbackAlt = property.title || "Property photo";

  return (
    <div className="relative overflow-hidden bg-surface-muted">
      <div
        className="flex transition-transform duration-450 ease-standard motion-reduce:transition-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {photos.map((photo, photoIndex) =>
          photoIndex === 0 || hasHovered ? (
            <div key={photo.id ?? photoIndex} className="w-full shrink-0">
              <img
                ref={photoIndex === index ? photoRef : null}
                src={photo.url || houseImage}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = document.documentElement.classList.contains("dark") ? darkHouseImage : houseImage;
                }}
                alt={photoIndex === index ? photo.description || fallbackAlt : ""}
                aria-hidden={photoIndex !== index}
                style={{ objectPosition: photo.position }}
                className={`${mediaClassName}${photo.darkUrl ? " dark:hidden" : ""}`}
              />
              {photo.darkUrl && (
                <img
                  src={photo.darkUrl}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = darkHouseImage;
                  }}
                  alt={photoIndex === index ? fallbackAlt : ""}
                  aria-hidden={photoIndex !== index}
                  className={`${mediaClassName} hidden dark:block`}
                />
              )}
            </div>
          ) : null,
        )}
      </div>

      {photos.length > 1 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-2.5 flex justify-center gap-1"
        >
          {photos.map((photo, photoIndex) => (
            <span
              key={photo.id ?? photoIndex}
              className={`h-1 rounded-full shadow-[0_0_2px_rgb(0_0_0/45%)] transition-[width,background-color] duration-300 ${
                photoIndex === index ? "w-4 bg-white" : "w-1.5 bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CardPhotos;
