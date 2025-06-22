// src/components/User/myprofile/MemberEditModal.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { FaTimes, FaUser } from "react-icons/fa";
import Cropper from "react-easy-crop";
import { toast } from "react-toastify";
import api from "../../api";
// **ตรวจสอบให้แน่ใจ่ว่า helper อยู่ใน src/utils/**
import getCroppedImg from "../../components/cropImage";
import "react-toastify/dist/ReactToastify.css";
import "./MyProfileuserEditModal.css";

export default function MemberEditModal({ profile, onClose, onSave }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    avatarFile: null,
    avatarPreview: "",
  });

  // สเตตครอป
  const [rawImage, setRawImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropping, setCropping] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef();

  // โหลดข้อมูลเดิม
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        email: profile.email || "",
        password: "",
        confirm_password: "",
        avatarFile: null,
        avatarPreview: profile.avatarUrl || "",
      });
    }
  }, [profile]);

  // เลือกไฟล์ใหม่
  const handleAvatarClick = () => {
    if (!submitting) fileInputRef.current.click();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setRawImage(ev.target.result);
      setCropping(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  // กดใช้รูปที่ครอป
  const completeCrop = async () => {
    if (!croppedAreaPixels) return;
    setSubmitting(true);
    try {
      const blob = await getCroppedImg(rawImage, croppedAreaPixels);
      const previewUrl = URL.createObjectURL(blob);
      setFormData((f) => ({
        ...f,
        avatarFile: blob,
        avatarPreview: previewUrl,
      }));
    } catch (err) {
      console.error(err);
      toast.error("ไม่สามารถตัดรูปได้");
    } finally {
      setCropping(false);
      setRawImage(null);
      setSubmitting(false);
    }
  };

  // ฟอร์มทั่วไป
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  // ส่งข้อมูล
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      return toast.warn("กรุณากรอกชื่อผู้ใช้");
    }
    if (formData.password && formData.password !== formData.confirm_password) {
      return toast.warn("รหัสผ่านใหม่ไม่ตรงกัน");
    }
    setSubmitting(true);
    const payload = new FormData();
    payload.append("username", formData.username);
    payload.append("email", formData.email);
    if (formData.password) {
      payload.append("password", formData.password);
    }
    if (formData.avatarFile) {
      payload.append("avatar", formData.avatarFile);
    }

    try {
      const res = await api.put("/api/user/me", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("อัปเดตโปรไฟล์สำเร็จ");
      onSave(res.data.profile);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "อัปเดตโปรไฟล์ไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mem-edit-overlay" onClick={submitting ? null : onClose}>
      <div className="mem-edit-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="mem-edit-close"
          onClick={onClose}
          disabled={submitting}
        >
          <FaTimes />
        </button>
        <h2>แก้ไขโปรไฟล์</h2>

        {/* Cropper Overlay */}
        {cropping && (
          <div className="cropper-overlay">
            <div className="cropper-container">
              <Cropper
                image={rawImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="cropper-controls">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(e.target.value)}
                disabled={submitting}
              />
              <button
                className="cropper-btn"
                onClick={completeCrop}
                disabled={submitting}
              >
                {submitting ? "กำลังตัดรูป..." : "ใช้รูปนี้"}
              </button>
              <button
                className="cropper-cancel"
                onClick={() => {
                  setCropping(false);
                  setRawImage(null);
                }}
                disabled={submitting}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        )}

        {/* Avatar Preview */}
        <div className="mem-avatar-wrapper" onClick={handleAvatarClick}>
          {formData.avatarPreview ? (
            <img
              src={formData.avatarPreview}
              alt="avatar"
              className="mem-avatar-img"
            />
          ) : (
            <div className="mem-avatar-placeholder">
              <FaUser />
            </div>
          )}
          <div className="mem-avatar-overlay">คลิกเพื่อเปลี่ยนรูป</div>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="mem-file-input"
          onChange={handleFileChange}
          disabled={submitting}
        />

        {/* Form */}
        <form onSubmit={handleSubmit} className="mem-edit-form">
          <label>
            ชื่อผู้ใช้:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </label>
          <label>
            อีเมล:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </label>
          <label>
            รหัสผ่านใหม่:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="เว้นว่างถ้าไม่เปลี่ยน"
              disabled={submitting}
            />
          </label>
          <label>
            ยืนยันรหัสผ่าน:
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder="เว้นว่างถ้าไม่เปลี่ยน"
              disabled={submitting}
            />
          </label>
          <div className="mem-edit-buttons">
            <button
              type="submit"
              className="mem-save-btn"
              disabled={submitting}
            >
              {submitting ? "กำลังบันทึก..." : "บันทึก"}
            </button>
            <button
              type="button"
              className="mem-cancel-btn"
              onClick={onClose}
              disabled={submitting}
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

MemberEditModal.propTypes = {
  profile: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
