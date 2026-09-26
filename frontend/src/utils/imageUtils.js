// Turns a picture file into a text string (a "data URL") that can be sent
// to the backend inside JSON and saved in MongoDB.
//
// The picture is also made smaller (max 1280px) so it doesn't take too
// much space in the database.
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

        // Step 4: turn the canvas into a JPEG text string
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };

      img.onerror = () => reject(new Error("Could not read the picture."));
      img.src = reader.result;
    };

    reader.onerror = () => reject(new Error("Could not read the picture."));
    reader.readAsDataURL(file);
  });
};

export { imageToText };
