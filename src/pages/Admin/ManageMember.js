import React, { useState, useEffect, useContext } from "react";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../api";
import { UserContext } from "../../contexts/UserContext";
import AlertBanner from "../../components/common/AlertBanner";
import MemberFormModal from "../../components/Admin/managemembers/MemberFormModal";
import ImportExcelModal from "./ImportExcelModal";
import MemberTable from "../../components/Admin/managemembers/MemberTable";
import MemberViewModal from "../../components/Admin/managemembers/MemberViewModal";
import MemberEditModal from "../../components/Admin/managemembers/MemberEditModal";
import "react-toastify/dist/ReactToastify.css";
import "./ManageMember.css";

export default function ManageMember() {
  const { user: currentUser, loadingUser } = useContext(UserContext);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/members");
      setMembers(res.data || []);
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: "ไม่สามารถโหลดข้อมูลสมาชิกได้ กรุณาลองใหม่",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingUser) return <p className="loading">กำลังโหลดข้อมูลผู้ใช้...</p>;

  const searched = members.filter((m) => {
    const txt = (m.full_name || m.member_id || "").toLowerCase();
    return txt.includes(searchTerm.toLowerCase());
  });

  const myId = (currentUser.member_id || currentUser.memberId || "").toString();
  const filtered = searched.filter((m) => m.member_id.toString() !== myId);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/members/${id}`);
      setAlert({ type: "success", message: "ลบสมาชิกสำเร็จ" });
      fetchMembers();
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.error ||
        "ไม่สามารถลบสมาชิกได้ กรุณาลองใหม่อีกครั้ง";
      setAlert({ type: "error", message: msg });
    }
  };

  return (
    <div className="manage-member-page">
      <AlertBanner
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: "", message: "" })}
      />
      <h2 className="manage-member-title">จัดการสมาชิก</h2>
      <div className="manage-member-card">
        <div className="controls-row">
          <input
            type="text"
            className="search-input"
            placeholder="ค้นหาสมาชิก..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="button-group">
            <button
              className="action-button add-member"
              onClick={() => setShowAddModal(true)}
            >
              <FontAwesomeIcon icon={faUserPlus} /> เพิ่มสมาชิก
            </button>
          </div>
        </div>

        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : (
          <MemberTable
            members={filtered}
            onView={(m) => {
              setSelectedMember(m);
              setShowViewModal(true);
            }}
            onEdit={(m) => {
              setSelectedMember(m);
              setShowEditModal(true);
            }}
            onDelete={handleDelete}
          />
        )}
      </div>
      {showAddModal && (
        <MemberFormModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            setAlert({ type: "success", message: "เพิ่มสมาชิกสำเร็จ" });
            fetchMembers();
          }}
        />
      )}
      {showImportModal && (
        <ImportExcelModal
          onClose={() => setShowImportModal(false)}
          onSuccess={(count) => {
            setShowImportModal(false);
            setAlert({
              type: "success",
              message: `นำเข้า ${count} รายการสำเร็จ`,
            });
            fetchMembers();
          }}
        />
      )}
      {showViewModal && selectedMember && (
        <MemberViewModal
          member={selectedMember}
          onClose={() => setShowViewModal(false)}
          onEdit={(m) => {
            console.log("🔁 เปิด Edit modal สำหรับ:", m);
            setShowViewModal(false);
            setSelectedMember(m);
            setShowEditModal(true);
          }}
        />
      )}

      {showEditModal && selectedMember && (
        <MemberEditModal
          member={selectedMember}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            setAlert({ type: "success", message: "แก้ไขสมาชิกสำเร็จ" });
            fetchMembers();
          }}
        />
      )}
    </div>
  );
}
