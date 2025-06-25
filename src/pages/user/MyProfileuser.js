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

  const handleUpdate = async (updatedProfileData) => {
    try {
      setProfile(updatedProfileData);
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

  const {
    full_name,
    member_id,
    username,
    role,
    email,
    approved,
    created_at,
    updated_at,
  } = profile;

  const avatarInitial = (full_name?.trim().charAt(0) || "-").toUpperCase();
  const formattedCreatedAt = created_at
    ? new Date(created_at).toLocaleString("th-TH")
    : "-";
  const formattedUpdatedAt = updated_at
    ? new Date(updated_at).toLocaleString("th-TH")
    : "-";

  return (
    <div className="pgu-page">
      <h1 className="pgu-page-title">โปรไฟล์ของฉัน</h1>
      <div className="pgu-card">
        {/* Header */}
        <header className="pgu-header">
          <div className="pgu-avatar">{avatarInitial}</div>
          <div className="pgu-header-info">
            <h2 className="pgu-name">{full_name}</h2>
            <p className="pgu-id">
              <strong>รหัสสมาชิก:</strong> {member_id || "-"}
            </p>
          </div>
        </header>

        {/* Body */}
        <div className="pgu-body">
          <section className="pgu-section">
            <h2>
              <FaUser className="pgu-icon" /> ข้อมูลบัญชี
            </h2>
            <p>
              <strong>ชื่อผู้ใช้:</strong> {username}
            </p>
            <p>
              <strong>สิทธ์การใช้งาน:</strong> {role}
            </p>
            <p>
              <strong>อีเมล:</strong> {email || "-"}
            </p>
          </section>

          <section className="pgu-section">
            <h2>
              <FaUserCheck className="pgu-icon" /> ข้อมูลสมาชิก
            </h2>
            <p>
              <strong>สถานะการอนุมัติใช้บัญชี้:</strong>{" "}
              {approved ? "อนุมัติแล้ว" : "ยังไม่อนุมัติ"}
            </p>
          </section>

          <section className="pgu-section">
            <h2>
              <FaCalendarAlt className="pgu-icon" /> ประวัติเวลา
            </h2>
            <p>
              <strong>สร้างเมื่อ:</strong> {formattedCreatedAt}
            </p>
            <p>
              <strong>อัปเดตเมื่อ:</strong> {formattedUpdatedAt}
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
