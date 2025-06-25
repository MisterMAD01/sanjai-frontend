// src/components/Admin/managemembers/MemberTable.jsx

import React, { useState } from "react";
import PropTypes from "prop-types";
import MemberViewModal from "./MemberViewModal";
import MemberEditModal from "./MemberEditModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import "./MemberTable.css";

const getInitials = (name) => {
  if (!name) return "";
  return name.trim().charAt(0).toUpperCase();
};

export default function MemberTable({ members, onView, onEdit, onDelete }) {
  const [viewMember, setViewMember] = useState(null);
  const [deleteMember, setDeleteMember] = useState(null);

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 13;
  const totalPages = Math.ceil(members.length / membersPerPage);
  const startIndex = (currentPage - 1) * membersPerPage;
  const currentMembers = members.slice(startIndex, startIndex + membersPerPage);

  // ✅ Short Pagination Logic
  const getPaginationButtons = () => {
    const maxVisibleButtons = 5;
    const buttons = [];

    if (totalPages <= maxVisibleButtons) {
      for (let i = 1; i <= totalPages; i++) buttons.push(i);
    } else {
      if (currentPage <= 3) {
        buttons.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        buttons.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        buttons.push(1, "...", currentPage, "...", totalPages);
      }
    }

    return buttons;
  };

  return (
    <div className="mmt-container">
      <h3 className="mmt-title">สมาชิกทั้งหมด</h3>
      <table className="mmt-table">
        <thead>
          <tr>
            <th>#</th>
            <th>รหัสสมาชิก</th>
            <th>ชื่อ-นามสกุล</th>
            <th>ชื่อเล่น</th>
            <th>รุ่น</th>
            <th>อำเภอ</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {currentMembers.length > 0 ? (
            currentMembers.map((m, idx) => (
              <tr key={m.member_id || idx}>
                <td>
                  <div className="mmt-avatar">{getInitials(m.full_name)}</div>
                </td>
                <td>{m.member_id || "-"}</td>
                <td>{`${m.prefix ?? ""}${m.full_name ?? "-"}`.trim()}</td>
                <td>{m.nickname || "-"}</td>
                <td>{m.graduation_year || "-"}</td>
                <td>{m.district || "-"}</td>
                <td className="mmt-actions">
                  <button
                    onClick={() => setViewMember(m)}
                    className="mmt-btn view"
                    title="ดู"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => onEdit(m)}
                    className="mmt-btn edit"
                    title="แก้ไข"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => setDeleteMember(m)}
                    className="mmt-btn delete"
                    title="ลบ"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="mmt-no-data-cell">
                ไม่มีข้อมูลสมาชิก
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Short Pagination */}
      <div className="mmt-pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ก่อนหน้า
        </button>

        {getPaginationButtons().map((btn, index) =>
          btn === "..." ? (
            <span key={index} className="ellipsis">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => setCurrentPage(btn)}
              className={currentPage === btn ? "active" : ""}
            >
              {btn}
            </button>
          )
        )}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          ถัดไป
        </button>
      </div>

      {/* View Modal */}
      {viewMember && (
        <MemberViewModal
          member={viewMember}
          onClose={() => setViewMember(null)}
        />
      )}

      {/* Confirm Delete Modal */}
      {deleteMember && (
        <ConfirmDeleteModal
          isOpen={!!deleteMember}
          title={deleteMember.full_name}
          onConfirm={() => {
            onDelete(deleteMember.member_id);
            setDeleteMember(null);
          }}
          onCancel={() => setDeleteMember(null)}
        />
      )}
    </div>
  );
}

MemberTable.propTypes = {
  members: PropTypes.array.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
