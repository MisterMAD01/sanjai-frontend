// src/pages/user/MyMemberInfo.jsx
import React, { useEffect, useState } from "react";
import { FaUser, FaHeartbeat, FaPhone, FaSchool } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../api";
import "./MyMemberInfo.css";
import MemberEditModal from "../../components/User/mymember/MemberEditModal";

export default function MyMemberInfo() {
  const [member, setMember] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [error, setError] = useState(null);

  const display = (val) =>
    val !== null && val !== undefined && val !== "" ? val : "-";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/my-member");
        // API returns { member: {...} }
        setMember(res.data.member || {});
      } catch (e) {
        console.error(e);
        setError("ไม่สามารถโหลดข้อมูลสมาชิกได้");
        toast.error("ไม่สามารถโหลดข้อมูลสมาชิกได้");
      }
    };
    load();
  }, []);

  const handleUpdate = async (updatedFields) => {
    try {
      const res = await api.put("/api/my-member", updatedFields);
      // API returns { member: {...}, message: ... }
      setMember(res.data.member);
      toast.success(res.data.message || "อัปเดตข้อมูลสำเร็จ");
    } catch (e) {
      console.error("Update error:", e);
      const msg = e.response?.data?.message || "อัปเดตข้อมูลล้มเหลว";
      setError(msg);
      toast.error(msg);
    }
  };

  const formatDateThai = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="mmi-page">
      <h1 className="mmi-title">ข้อมูลสมาชิกของฉัน</h1>
      {error && <p className="mmi-error">{error}</p>}

      <div className="mmi-card">
        {/* Header */}
        <header className="mmi-header">
          <div className="mmi-avatar">
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt="avatar"
                className="mmi-avatar-img"
              />
            ) : (
              (member.full_name?.charAt(0) || "-").toUpperCase()
            )}
          </div>
          <div className="mmi-header-info">
            <h2 className="mmi-name">
              {display(member.full_name)}
              {member.graduation_year
                ? ` (รุ่นที่ ${member.graduation_year})`
                : ""}
            </h2>
            <p className="mmi-id">เลขที่สมาชิก : {display(member.member_id)}</p>
          </div>
        </header>

        {/* Body sections */}
        <div className="mmi-body">
          {/* General Info */}
          <section className="mmi-section">
            <h3>
              <FaUser className="mmi-icon" /> ข้อมูลทั่วไป
            </h3>
            <p>
              <strong>ชื่อ–นามสกุล:</strong>{" "}
              {display(
                member.prefix && member.full_name
                  ? `${member.prefix}${member.full_name}`
                  : "-"
              )}
            </p>
            <p>
              <strong>ประเภทสมาชิก:</strong> {display(member.type)}
            </p>
            <p>
              <strong>ชื่อเล่น:</strong> {display(member.nickname)}
            </p>
            <p>
              <strong>บัตรประชาชน:</strong> {display(member.id_card)}
            </p>
            <p>
              <strong>วันเกิด:</strong> {formatDateThai(member.birthday)}
            </p>
            <p>
              <strong>อายุ:</strong>{" "}
              {member.age != null && member.age !== ""
                ? `${member.age} ปี`
                : "-"}
            </p>
            <p>
              <strong>เพศ:</strong> {display(member.gender)}
            </p>
            <p>
              <strong>ศาสนา:</strong> {display(member.religion)}
            </p>
          </section>

          {/* Health Info */}
          <section className="mmi-section">
            <h3>
              <FaHeartbeat className="mmi-icon" /> ข้อมูลสุขภาพ
            </h3>
            <p>
              <strong>โรคประจำตัว:</strong> {display(member.medical_conditions)}
            </p>
            <p>
              <strong>ประวัติแพ้ยา:</strong> {display(member.allergy_history)}
            </p>
          </section>

          {/* Contact Info */}
          <section className="mmi-section">
            <h3>
              <FaPhone className="mmi-icon" /> ข้อมูลติดต่อ
            </h3>
            <p>
              <strong>ที่อยู่:</strong> {display(member.address)}
            </p>
            <p>
              <strong>อำเภอ:</strong> {display(member.district)}
            </p>
            <p>
              <strong>โทรศัพท์:</strong> {display(member.phone)}
            </p>
            <p>
              <strong>Facebook:</strong> {display(member.facebook)}
            </p>
            <p>
              <strong>Instagram:</strong> {display(member.instagram)}
            </p>
            <p>
              <strong>Line ID:</strong> {display(member.line_id)}
            </p>
          </section>

          {/* Education Info */}
          <section className="mmi-section">
            <h3>
              <FaSchool className="mmi-icon" /> ข้อมูลสถานศึกษา/ทำงาน
            </h3>
            <p>
              <strong>สถาบัน/ที่ทำงาน:</strong> {display(member.school)}
            </p>
            <p>
              <strong>GPA:</strong> {display(member.gpa)}
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mmi-footer">
          <button className="mmi-edit-btn" onClick={() => setIsEditOpen(true)}>
            แก้ไขข้อมูล
          </button>
          {isEditOpen && (
            <MemberEditModal
              member={member}
              onClose={() => setIsEditOpen(false)}
              onSave={async (formData) => {
                await handleUpdate(formData);
                setIsEditOpen(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
