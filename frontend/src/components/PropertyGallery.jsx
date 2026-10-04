import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import houseImage from "../assets/house1.jpg";
import darkHouseImage from "../assets/house1_dark.png";
import { getPropertyPhotos } from "../utils/cardPhotos";

const GalleryPhoto = ({ photo, alt, className, loading }) => (
  <div className={`overflow-hidden bg-surface-muted ${className}`}>
    <img
      src={photo.url || houseImage}
      alt={alt}
      loading={loading}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = houseImage;
      }}
      className={`h-full w-full object-cover${photo.darkUrl ? " dark:hidden" : ""}`}
    />
    {photo.darkUrl && (
      <img
        src={photo.darkUrl}
        alt={alt}
        loading={loading}
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = darkHouseImage;
        }}
        className="hidden h-full w-full object-cover dark:block"
      />
    )}
  </div>
);

const PropertyGallery = ({ property }) => {
  const photos = getPropertyPhotos(property);
  const [currentImage, setCurrentImage] = useState(0);
  const shownImage = photos[currentImage];
  const fallbackAlt = property.title || "Property photo";

  const showPreviousImage = () => {
    setCurrentImage((current) => (current + photos.length - 1) % photos.length);
  };

  const showNextImage = () => {
    setCurrentImage((current) => (current + 1) % photos.length);
  };

  return (
    <section aria-label="Property photos" className="min-w-0">
      <div className="relative">
        <GalleryPhoto
          photo={shownImage}
          alt={shownImage.description || fallbackAlt}
          className="h-64 w-full rounded-card sm:h-105"
        />

        {photos.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={showPreviousImage}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/95 text-ink shadow transition hover:bg-surface"
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={showNextImage}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/95 text-ink shadow transition hover:bg-surface"
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
              {currentImage + 1} / {photos.length}
            </span>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div aria-label="Choose a property photo" className="-mx-1 mt-3 flex gap-3 overflow-x-auto p-1 sm:mt-4">
          {photos.map((photo, index) => (
            <button
              key={photo.id ?? index}
              type="button"
              onClick={() => setCurrentImage(index)}
              aria-label={`Show image ${index + 1}`}
              aria-pressed={index === currentImage}
              className={`w-[calc((100%-2.25rem)/4)] min-w-16 shrink-0 rounded-control transition-[opacity,box-shadow] ${
                index === currentImage
                  ? "ring-2 ring-pine-700 ring-offset-2 ring-offset-canvas"
                  : "opacity-65 hover:opacity-100 focus-visible:opacity-100"
              }`}
            >
              <GalleryPhoto
                photo={photo}
                alt=""
                loading="lazy"
                className="h-16 w-full rounded-control sm:h-24"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default PropertyGallery;
