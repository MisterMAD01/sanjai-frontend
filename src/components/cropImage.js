// src/components/cropImage.js
import React, { useState, useCallback, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Cropper from "react-easy-crop";
import "./cropImage.css";

/**
 * Helper: ครอปภาพจาก pixelCrop และคืนเป็น Blob
 */
async function getCroppedImg(imageSrc, pixelCrop, resolution = null) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    image.onload = () => {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const cropWidthPx = Math.round(pixelCrop.width * scaleX);
      const cropHeightPx = Math.round(pixelCrop.height * scaleY);

      const outputWidth = resolution?.width ?? cropWidthPx;
      const outputHeight = resolution?.height ?? cropHeightPx;

      const canvas = document.createElement("canvas");
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        image,
        Math.round(pixelCrop.x * scaleX),
        Math.round(pixelCrop.y * scaleY),
        cropWidthPx,
        cropHeightPx,
        0,
        0,
        outputWidth,
        outputHeight
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return reject(new Error("Failed to generate cropped image blob"));
          }
          blob.name = "cropped-image.jpeg";
          resolve(blob);
        },
        "image/jpeg",
        0.9
      );
    };

    image.onerror = () => {
      reject(new Error("Failed to load image for cropping"));
    };
  });
}

/**
 * React component: แสดง UI ครอปภาพ พร้อมปุ่ม “ใช้รูป” และ “ยกเลิก”
 */
export default function CropImage({
  imageSrc,
  onComplete,
  onCancel,
  aspect = 1,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleUseImage = useCallback(async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onComplete(blob);
    } catch (err) {
      console.error("Crop error:", err);
      // แสดงข้อความเตือนถ้าต้องการ
    } finally {
      setProcessing(false);
    }
  }, [croppedAreaPixels, imageSrc, onComplete]);

  return (
    <div className="cropper-overlay" onClick={processing ? null : onCancel}>
      <div className="cropper-container" onClick={(e) => e.stopPropagation()}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
        <div className="cropper-controls">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            disabled={processing}
          />
          <button
            className="cropper-btn"
            onClick={handleUseImage}
            disabled={processing}
          >
            {processing ? "กำลังประมวลผล..." : "ใช้รูป"}
          </button>
          <button
            className="cropper-cancel"
            onClick={onCancel}
            disabled={processing}
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}

CropImage.propTypes = {
  /** แหล่งภาพ (base64 หรือ URL) */
  imageSrc: PropTypes.string.isRequired,
  /** รับ Blob เมื่อกดใช้รูป */
  onComplete: PropTypes.func.isRequired,
  /** ปิด modal ครอป */
  onCancel: PropTypes.func.isRequired,
  /** อัตราส่วนกว้าง/สูง (default 1:1) */
  aspect: PropTypes.number,
};
