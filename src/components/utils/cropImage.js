// src/utils/cropImage.js
/**
 * This function was adapted from https://github.com/ricardo-ch/react-easy-crop
 * It crops an image react-easy-crop's croppedAreaPixels
 *
 * @param {string} imageSrc - The image URL
 * @param {Object} croppedAreaPixels - Object with x, y, width, and height of the cropped area
 * @param {number} rotation - Rotation in degrees
 * @returns {Promise<Blob>} - Promise that resolves with the cropped image as a Blob
 */
import "./cropImage.css";
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // Needed for cross-origin images
    image.src = url;
  });

async function getCroppedImg(imageSrc, croppedAreaPixels, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  // set canvas size to match the clipping area
  canvas.width = safeArea;
  canvas.height = safeArea;

  // translate canvas origin to center to rotate image
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // draw rotated image and then crop
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5,
    image.width,
    image.height
  );

  const data = ctx.getImageData(
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  // set canvas width to final desired crop size - this will clear the canvas
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  // paste generated image data into the new canvas
  ctx.putImageData(data, 0, 0);

  // As a blob
  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(file);
    }, "image/png"); // สามารถเปลี่ยนเป็น 'image/jpeg' ได้
  });
}

export default getCroppedImg;
