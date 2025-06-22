// src/components/MyProfileUsername.jsx
import React, { useEffect, useState } from "react";
import { FaUser, FaUserCheck, FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-toastify";

import api from "../../api";
import MemberEditModal from "./MyProfileuserEditModal";
import "react-toastify/dist/ReactToastify.css";
import "./MyProfileuser.css";

export default function ProfileUsername() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/api/user/me");
        setProfile(res.data.profile);
      } catch (err) {
        console.error("Error loading profile:", err);
        toast.error("ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Update profile fields
  const handleUpdate = async (updatedFields) => {
    try {
      const res = await api.put("/api/user/me", updatedFields);
      setProfile(res.data.profile);
      toast.success("อัปเดตข้อมูลเรียบร้อยแล้ว");
    } catch (err) {
      console.error("Update error:", err);
      toast.error(
        err.response?.data?.message || "ไม่สามารถอัปเดตข้อมูลได้ กรุณาลองใหม่"
      );
    }
  };

  if (loading) return <div className="pgu-loading">กำลังโหลด...</div>;
  if (!profile) return null;

  const avatarInitial = (profile.full_name?.charAt(0) || "-").toUpperCase();
  const createdAt = profile.created_at
    ? new Date(profile.created_at).toLocaleString("th-TH")
    : "-";
  const updatedAt = profile.updated_at
    ? new Date(profile.updated_at).toLocaleString("th-TH")
    : "-";

  return (
    <div className="pgu-page">
      <h1 className="pgu-page-title">โปรไฟล์ของฉัน</h1>
      <div className="pgu-card">
        {/* Header */}
        <header className="pgu-header">
          <div className="pgu-avatar">{avatarInitial}</div>
          <div className="pgu-header-info">
            <h2 className="pgu-name">{profile.full_name}</h2>
            <p className="pgu-id">USER ID: {profile.user_id}</p>
          </div>
        </header>

        {/* Body */}
        <div className="pgu-body">
          <section className="pgu-section">
            <h2>
              <FaUser className="pgu-icon" /> ข้อมูลบัญชี
            </h2>
            <p>
              <strong>ชื่อผู้ใช้:</strong> {profile.username}
            </p>
            <p>
              <strong>บทบาท:</strong> {profile.role}
            </p>
            <p>
              <strong>อีเมล:</strong> {profile.email || "-"}
            </p>
          </section>

          <section className="pgu-section">
            <h2>
              <FaUserCheck className="pgu-icon" /> ข้อมูลสมาชิก
            </h2>
            <p>
              <strong>รหัสสมาชิก:</strong> {profile.member_id || "-"}
            </p>
            <p>
              <strong>อนุมัติ:</strong> {profile.approved ? "ใช่" : "ไม่ใช่"}
            </p>
          </section>

          <section className="pgu-section">
            <h2>
              <FaCalendarAlt className="pgu-icon" /> ประวัติเวลา
            </h2>
            <p>
              <strong>สร้างเมื่อ:</strong> {createdAt}
            </p>
            <p>
              <strong>อัปเดตเมื่อ:</strong> {updatedAt}
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pgu-footer">
          <button className="pgu-edit-btn" onClick={() => setIsEditOpen(true)}>
            แก้ไขข้อมูล
          </button>
        </div>

        {isEditOpen && (
          <MemberEditModal
            profile={profile}
            onClose={() => setIsEditOpen(false)}
            onSave={async (fields) => {
              await handleUpdate(fields);
              setIsEditOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
