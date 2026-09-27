// Photo limits (the backend checks the same numbers)
const MAX_PHOTOS = 8;
const MAX_PHOTO_FILE_SIZE_MB = 10;
const MAX_PHOTO_DESCRIPTION_LENGTH = 200;
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

// A saved photo must be under this many characters (about 750 KB)
const MAX_SAVED_PHOTO_LENGTH = 1_000_000;

// Returns an error message for a file we can't use, or "" when it's fine.
const validatePhotoFile = (file) => {
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return `"${file.name}" is not a JPEG, PNG, or WebP image.`;
  }

  if (file.size > MAX_PHOTO_FILE_SIZE_MB * 1024 * 1024) {
    return `"${file.name}" is larger than ${MAX_PHOTO_FILE_SIZE_MB} MB.`;
  }

  return "";
};

// Turns a picture file into a text string (a "data URL") that can be sent
// to the backend inside JSON and saved in MongoDB.
//
// The picture is also made smaller (max 1280px) so it doesn't take too
// much space in the database. If it's still too big, the quality is lowered.
//
// Usage:  const text = await imageToText(file);
const imageToText = (file) => {
  return new Promise((resolve, reject) => {
    // Step 1: read the file
    const reader = new FileReader();

    reader.onload = () => {
      // Step 2: load the file into an <img> so we know its width and height
      const img = new Image();

      img.onload = () => {
        // Step 3: draw the picture smaller on a canvas
        const scale = Math.min(1, 1280 / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);

        // Step 4: turn the canvas into a JPEG text string that is small enough
        for (const quality of [0.8, 0.6, 0.4]) {
          const text = canvas.toDataURL("image/jpeg", quality);

          if (text.length <= MAX_SAVED_PHOTO_LENGTH) {
            resolve(text);
            return;
          }
        }

        reject(new Error(`"${file.name}" is too detailed to save. Try a smaller photo.`));
      };

      img.onerror = () => reject(new Error(`Could not read "${file.name}".`));
      img.src = reader.result;
    };

    reader.onerror = () => reject(new Error(`Could not read "${file.name}".`));
    reader.readAsDataURL(file);
  });
};

// Gives every photo in a form its own key, so React keeps the right
// description box with the right photo when one is removed
let nextPhotoKey = 1;
const newPhotoKey = () => nextPhotoKey++;

// Turns saved listing images into photos a form can edit
const toEditablePhotos = (images = []) =>
  images.map((image) => ({
    key: newPhotoKey(),
    url: image.url,
    description: image.description || "",
    isMain: Boolean(image.isMain),
  }));

// Turns the photos in a form ([{ url, description, isMain }]) into the
// images the backend saves: ordered, numbered, one main photo, and a
// description for every photo (used as its alternative text).
const toPropertyImages = (photos, listingTitle) => {
  const hasMain = photos.some((photo) => photo.isMain);

  return photos.map((photo, index) => ({
    id: index + 1,
    url: photo.url,
    description:
      photo.description?.trim() ||
      `${listingTitle?.trim() || "Property"} - photo ${index + 1}`,
    isMain: hasMain ? Boolean(photo.isMain) : index === 0,
  }));
};

// The main photo of a listing, or null when it has none
const getMainImage = (property) =>
  property.images?.find((image) => image.isMain) || property.images?.[0] || null;

export {
  MAX_PHOTOS,
  MAX_PHOTO_FILE_SIZE_MB,
  MAX_PHOTO_DESCRIPTION_LENGTH,
  ALLOWED_PHOTO_TYPES,
  validatePhotoFile,
  imageToText,
  newPhotoKey,
  toEditablePhotos,
  toPropertyImages,
  getMainImage,
};
