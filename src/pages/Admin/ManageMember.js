// src/pages/Admin/ManageMember.jsx
import React, { useState, useEffect } from "react";
import {
  faUserPlus,
  faFileImport,
  faFileExport,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

import api from "../../api";
import MemberFormModal from "../../components/Admin/managemembers/MemberFormModal";
import ImportExcelModal from "./ImportExcelModal";
import MemberTable from "../../components/Admin/managemembers/MemberTable";
import MemberViewModal from "../../components/Admin/managemembers/MemberViewModal";
import MemberEditModal from "../../components/Admin/managemembers/MemberEditModal";
import "./ManageMember.css";

export default function ManageMember() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
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
      setMembers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("ไม่สามารถโหลดข้อมูลสมาชิกได้");
    } finally {
      setLoading(false);
    }
  };

  const filtered = members.filter((m) =>
    m.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    if (filtered.length === 0) {
      toast.info("ไม่มีข้อมูลสำหรับส่งออก");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(filtered, {
      header: [
        "member_id",
        "prefix",
        "full_name",
        "nickname",
        "id_card",
        "birthday",
        "age",
        "gender",
        "religion",
        "medical_conditions",
        "allergy_history",
        "address",
        "phone",
        "facebook",
        "instagram",
        "line_id",
        "school",
        "graduation_year",
        "gpa",
        "type",
        "district",
      ],
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Members");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "members_export.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("ส่งออกข้อมูลสำเร็จ");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("คุณแน่ใจว่าต้องการลบสมาชิกนี้?")) return;

    try {
      await api.delete(`/api/members/${id}`);
      toast.success("ลบสมาชิกสำเร็จ");
      fetchMembers();
    } catch (err) {
      console.error(err);
      toast.error("ไม่สามารถลบสมาชิกได้");
    }
  };

  return (
    <div className="manage-member-page">
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
              type="button"
              className="action-button add-member"
              onClick={() => setShowAddModal(true)}
            >
              <FontAwesomeIcon icon={faUserPlus} /> เพิ่มสมาชิก
            </button>

            <button
              type="button"
              className="action-button export"
              onClick={handleExport}
            >
              <FontAwesomeIcon icon={faFileExport} /> ส่งออกข้อมูล
            </button>
          </div>
        </div>

        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : (
          <div className="table-wrapper">
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
          </div>
        )}
      </div>

      {showAddModal && (
        <MemberFormModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchMembers();
          }}
        />
      )}

      {showImportModal && (
        <ImportExcelModal
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false);
            fetchMembers();
          }}
        />
      )}

      {showViewModal && selectedMember && (
        <MemberViewModal
          member={selectedMember}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {showEditModal && selectedMember && (
        <MemberEditModal
          member={selectedMember}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            fetchMembers();
          }}
        />
      )}
    </div>
  );
}
