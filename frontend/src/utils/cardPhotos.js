import house1 from "../assets/house1.jpg";
import darkHouse1 from "../assets/house1_dark.png";
import house2 from "../assets/house2.jpg";
import darkHouse2 from "../assets/house2_dark.jpg";
import house3 from "../assets/house3.jpg";
import darkHouse3 from "../assets/house3_dark.jpg";
import house4 from "../assets/house4.jpg";
import darkHouse4 from "../assets/house4_dark.jpg";

const darkPhotos = [darkHouse1, darkHouse2, darkHouse3, darkHouse4];
const demoPhotos = [house1, house2, house3, house4].map((url, index) => ({
  id: `demo-house-${index + 1}`,
  url,
  darkUrl: darkPhotos[index],
}));

export const MAX_CARD_PHOTOS = 5;
export const getPropertyPhotos = (property) => {
  const images = property.images || [];
  const photos = [...images.filter(image => image.isMain), ...images.filter(image => !image.isMain)];
  if (photos.length === 0) return demoPhotos;
  if (photos.length === 1) return [...photos, ...demoPhotos.slice(1)];
  return photos;
};

export const getCardPhotos = (property) => getPropertyPhotos(property).slice(0, MAX_CARD_PHOTOS);
