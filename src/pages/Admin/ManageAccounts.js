// src/pages/Admin/ManageAccounts.jsx

import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import api from "../../api";
import { UserContext } from "../../contexts/UserContext";
import UserFormModal from "../../components/Admin/manageusers/UserFormModal";
import UserEditFormModal from "../../components/Admin/manageusers/UserEditFormModal";
import UserViewModal from "../../components/Admin/manageusers/UserViewModal";
import UserTable from "../../components/Admin/manageusers/UserTable";
import ImportExcelModal from "../../components/Admin/manageusers/ImportCsvModal";
import "react-toastify/dist/ReactToastify.css";
import "./ManageAccounts.css";

export default function ManageAccounts() {
  const { user: currentUser, loadingUser } = useContext(UserContext);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const resp = await api.get("/api/admin/users");
      setAccounts(resp.data || []);
    } catch (err) {
      console.error(err);
      toast.error("ไม่สามารถดึงข้อมูลบัญชีได้");
    } finally {
      setLoading(false);
    }
  };

  if (loadingUser) {
    return <p className="loading">กำลังโหลดข้อมูลผู้ใช้...</p>;
  }

  // 1) กรองตามคำค้นหา (username)
  const searched = accounts.filter((u) =>
    (u.username || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2) ตัดบัญชีของตัวเองออก
  const myUserId =
    currentUser.user_id?.toString() || currentUser.id?.toString() || "";
  const filtered = searched.filter((u) => u.user_id.toString() !== myUserId);

  const handleDelete = async (id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีนี้?")) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      toast.success("ลบบัญชีสำเร็จ");
      fetchAccounts();
    } catch (err) {
      console.error(err);
      toast.error("ไม่สามารถลบบัญชีได้");
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/api/admin/users/${id}/approve`);
      toast.success("อนุมัติผู้ใช้เรียบร้อยแล้ว");
      fetchAccounts();
    } catch (err) {
      console.error(err);
      toast.error("ไม่สามารถอนุมัติผู้ใช้ได้");
    }
  };

  const handleRevoke = async (id) => {
    try {
      await api.put(`/api/admin/users/${id}/reject`);
      toast.success("ยกเลิกการอนุมัติเรียบร้อยแล้ว");
      fetchAccounts();
    } catch (err) {
      console.error(err);
      toast.error("ไม่สามารถยกเลิกการอนุมัติได้");
    }
  };

  return (
    <div className="manage-accounts-page">
      <h2 className="manage-accounts-title">จัดการบัญชีผู้ใช้</h2>

      <div className="manage-accounts-card">
        <div className="controls-row">
          <input
            type="text"
            className="search-input"
            placeholder="ค้นหาบัญชีผู้ใช้..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="button-group">
            <button
              className="action-button add-user"
              onClick={() => setIsAdding(true)}
            >
              <FontAwesomeIcon icon={faUserPlus} /> เพิ่มผู้ใช้
            </button>
            {/* ปุ่มส่งออกถูกลบออกแล้ว */}
          </div>
        </div>

        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : (
          <div className="table-wrapper">
            <UserTable
              users={filtered}
              handleView={(u) => setViewing(u)}
              handleEdit={(u) => setEditing(u)}
              handleDelete={handleDelete}
              handleApprove={handleApprove}
              handleRevoke={handleRevoke}
            />
          </div>
        )}
      </div>

      {isAdding && (
        <UserFormModal
          handleSave={() => {
            setIsAdding(false);
            fetchAccounts();
          }}
          handleCancel={() => setIsAdding(false)}
        />
      )}

      {showImport && (
        <ImportExcelModal
          onClose={() => setShowImport(false)}
          onSuccess={() => {
            setShowImport(false);
            fetchAccounts();
          }}
        />
      )}

      {editing && (
        <UserEditFormModal
          user={editing}
          handleSave={() => {
            setEditing(null);
            fetchAccounts();
          }}
          handleCancel={() => setEditing(null)}
        />
      )}

      {viewing && (
        <UserViewModal
          user={viewing}
          onClose={() => setViewing(null)}
          onEdit={(u) => {
            setViewing(null);
            setEditing(u);
          }}
          onApprove={handleApprove}
          onRevoke={handleRevoke}
        />
      )}
    </div>
  );
}
