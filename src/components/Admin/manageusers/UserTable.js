import React, { useState } from "react";
import PropTypes from "prop-types";
import "./UserTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const getInitials = (name) => {
  if (!name) return "";
  return name.trim().charAt(0).toUpperCase();
};

const UserTable = ({
  users,
  handleView,
  handleEdit,
  handleDelete,
  handleApprove,
  handleRevoke,
}) => {
  const [deleteUser, setDeleteUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 13;

  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = users.slice(startIndex, startIndex + usersPerPage);

  const confirmDelete = () => {
    handleDelete(deleteUser.user_id);
    setDeleteUser(null);
  };

  return (
    <div className="table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>ชื่อผู้ใช้</th>
            <th>อีเมล</th>
            <th>สิทธิ์การใช้งาน</th>
            <th>สถานะ</th>
            <th>รหัสสมาชิก</th>
            <th>อัปเดตเมื่อ</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((u) => (
            <tr key={u.user_id}>
              <td>
                <div className="avatar-circle">{getInitials(u.username)}</div>
              </td>
              <td>{u.username}</td>
              <td>{u.email || "-"}</td>
              <td>{u.role}</td>
              <td>
                <span
                  className={`status-badge ${
                    u.approved ? "approved" : "pending"
                  }`}
                >
                  {u.approved ? "อนุมัติแล้ว" : "รออนุมัติ"}
                </span>
              </td>
              <td>{u.member_id || "-"}</td>
              <td>
                {u.updated_at ? new Date(u.updated_at).toLocaleString() : "-"}
              </td>
              <td className="action-group">
                <button
                  onClick={() => handleView(u)}
                  title="ดูรายละเอียด"
                  className="action-btn view"
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button
                  onClick={() => handleEdit(u)}
                  title="แก้ไข"
                  className="action-btn edit"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => setDeleteUser(u)}
                  title="ลบ"
                  className="action-btn delete"
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ก่อนหน้า
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          ถัดไป
        </button>
      </div>

      {deleteUser && (
        <div className="modal-overlay">
          <div className="modal small">
            <div className="modal-icon warning">⚠️</div>
            <h3>ยืนยันการลบผู้ใช้</h3>
            <p>
              คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ "{deleteUser.username}"?
              การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setDeleteUser(null)}
                className="cancel-btn"
              >
                ยกเลิก
              </button>
              <button onClick={confirmDelete} className="delete-btn confirm">
                ลบผู้ใช้
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  handleView: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleApprove: PropTypes.func.isRequired,
  handleRevoke: PropTypes.func.isRequired,
};

export default UserTable;
