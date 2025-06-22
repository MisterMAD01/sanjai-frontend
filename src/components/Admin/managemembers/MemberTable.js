// src/components/Member/MemberTable.jsx
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

function MemberTable({ members, onDelete, onView, onEdit }) {
  const [viewMember, setViewMember] = useState(null);
  const [deleteMember, setDeleteMember] = useState(null);

  if (!members || members.length === 0) {
    return <p className="mmt-no-data">ไม่มีสมาชิกในระบบ</p>;
  }

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
          {members.map((m) => (
            <tr key={m.member_id}>
              <td>
                <div className="mmt-avatar">{getInitials(m.full_name)}</div>
              </td>
              <td>{m.member_id}</td>
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
          ))}
        </tbody>
      </table>

      {/* View Modal */}
      {viewMember && (
        <MemberViewModal
          member={viewMember}
          onClose={() => setViewMember(null)}
        />
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteMember}
        title={deleteMember?.full_name}
        onConfirm={() => {
          onDelete(deleteMember.member_id);
          setDeleteMember(null);
        }}
        onCancel={() => setDeleteMember(null)}
      />
    </div>
  );
}

MemberTable.propTypes = {
  members: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default MemberTable;
