import { useState } from "react";
import {
  MAX_PHOTOS,
  MAX_PHOTO_FILE_SIZE_MB,
  MAX_PHOTO_DESCRIPTION_LENGTH,
  ALLOWED_PHOTO_TYPES,
  validatePhotoFile,
  imageToText,
  newPhotoKey,
} from "../utils/imageUtils";

// Lets the user add, remove and describe listing photos and choose the main one.
// Used by both the "create listing" and the "edit listing" forms.
//
// Props:
//   photos       - [{ key, url, description, isMain }] in the order they're shown
//   onChange     - called with the new photo list
//   listingTitle - used in the description placeholder
const PhotoManager = ({ photos, onChange, listingTitle }) => {
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const isFull = photos.length >= MAX_PHOTOS;

  const handlePhotoChange = async (event) => {
    const chosenFiles = Array.from(event.target.files);
    event.target.value = ""; // lets the user choose the same file again later

    const problems = [];
    const freeSlots = MAX_PHOTOS - photos.length;

    if (chosenFiles.length > freeSlots) {
      problems.push(
        `You can have up to ${MAX_PHOTOS} photos, so only ${freeSlots} more can be added.`,
      );
    }

    // Check the type and size before reading anything
    const usableFiles = chosenFiles.slice(0, freeSlots).filter((file) => {
      const problem = validatePhotoFile(file);

      if (problem) {
        problems.push(problem);
      }

      return !problem;
    });

    setIsAdding(true);

    const newPhotos = [];

    for (const file of usableFiles) {
      try {
        newPhotos.push({
          key: newPhotoKey(),
          url: await imageToText(file),
          description: "",
          isMain: false,
        });
      } catch (error) {
        problems.push(error.message);
      }
    }

    setIsAdding(false);
    setError(problems.join(" "));

    if (newPhotos.length === 0) {
      return;
    }

    // Add the new photos AFTER the ones already chosen.
    // The first photo becomes the main photo if there isn't one yet.
    const allPhotos = [...photos, ...newPhotos];

    if (!allPhotos.some((photo) => photo.isMain)) {
      allPhotos[0] = { ...allPhotos[0], isMain: true };
    }

    onChange(allPhotos);
  };

  const removePhoto = (keyToRemove) => {
    const remainingPhotos = photos.filter((photo) => photo.key !== keyToRemove);

    // Removing the main photo makes the first remaining photo the main one
    if (
      remainingPhotos.length > 0 &&
      !remainingPhotos.some((photo) => photo.isMain)
    ) {
      remainingPhotos[0] = { ...remainingPhotos[0], isMain: true };
    }

    setError("");
    onChange(remainingPhotos);
  };

  const setMainPhoto = (mainKey) => {
    onChange(
      photos.map((photo) => ({ ...photo, isMain: photo.key === mainKey })),
    );
  };

  const changeDescription = (key, description) => {
    onChange(
      photos.map((photo) => (photo.key === key ? { ...photo, description } : photo)),
    );
  };

  return (
    <div>
      <label
        className={` mt-4 flex items-center justify-center rounded-control border-2 border-dashed border-line py-6 text-sm text-ink focus-within:ring-2 focus-within:ring-pine-700 ${
          isFull || isAdding ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-surface-muted"
        }  `}
      >
        {isAdding
          ? "Adding photos..."
          : isFull
            ? `Maximum of ${MAX_PHOTOS} photos reached`
            : `+ Add photos (${photos.length}/${MAX_PHOTOS})`}
        <input
          type="file"
          accept={ALLOWED_PHOTO_TYPES.join(",")}
          multiple
          disabled={isFull || isAdding}
          onChange={handlePhotoChange}
          className="ks-file sr-only"
        />
      </label>

      <p className="mt-2 text-xs text-ink-muted">
        Up to {MAX_PHOTOS} JPEG, PNG, or WebP photos, max {MAX_PHOTO_FILE_SIZE_MB} MB
        each. Choose which photo is the main photo, and describe each photo for
        people using screen readers.
      </p>

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-control bg-danger-soft px-4 py-3 text-sm text-danger"
        >
          {error}
        </p>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {photos.length > 0 ? (
          photos.map((photo, index) => (
            <div key={photo.key}>
              <div className="relative">
                <img
                  src={photo.url}
                  alt={photo.description || `Property photo ${index + 1}`}
                  className={` aspect-4/3 w-full rounded-control object-cover ${
                    photo.isMain ? "ring-2 ring-pine-700" : ""
                  }  `}
                />

                {photo.isMain ? (
                  <span className="absolute left-2 top-2 rounded-full bg-pine-700 px-2 py-0.5 text-xs font-medium text-white">
                    Main photo
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMainPhoto(photo.key)}
                    className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-pine-700 shadow hover:bg-surface"
                  >
                    Set as main
                  </button>
                )}

                <button
                  type="button"
                  aria-label={`Remove photo ${index + 1}`}
                  onClick={() => removePhoto(photo.key)}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-sm text-ink-muted shadow hover:bg-red-50 hover:text-red-600"
                >
                  ×
                </button>
              </div>

              <label className="mt-2 block text-xs font-medium text-ink-muted">
                Photo {index + 1} description
                <input
                  type="text"
                  value={photo.description}
                  maxLength={MAX_PHOTO_DESCRIPTION_LENGTH}
                  onChange={(event) =>
                    changeDescription(photo.key, event.target.value)
                  }
                  placeholder={`${listingTitle?.trim() || "Property"} - photo ${index + 1}`}
                  className="ks-input mt-1 w-full border text-sm font-normal"
                />
              </label>
            </div>
          ))
        ) : (
          <>
            {[1, 2, 3, 4].map((placeholder) => (
              <div
                key={placeholder}
                className="flex h-24 items-center justify-center rounded-control bg-surface-muted text-xs text-ink-subtle"
              >
                Image placeholder
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default PhotoManager;
