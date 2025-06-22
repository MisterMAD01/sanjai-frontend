// src/pages/user/ManageDocuments.js
import React, { useEffect, useState } from "react";
import { FaPaperPlane, FaCog } from "react-icons/fa";
import { toast } from "react-toastify";

import api from "../../api";
import UploadFormModal from "../../components/Admin/managedocuments/UploadFormModal";
import ManageAllModal from "../../components/Admin/managedocuments/ManageAllModal";
import DocumentTable from "../../components/Admin/managedocuments/DocumentTable";
import "react-toastify/dist/ReactToastify.css";
import "./ManageDocuments.css";

export default function ManageDocuments() {
  const [documents, setDocuments] = useState([]);
  const [members, setMembers] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch documents and members on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [docsRes, membersRes] = await Promise.all([
          api.get("/api/documents"),
          api.get("/api/members"),
        ]);
        setDocuments(
          docsRes.data.map((doc) => ({
            ...doc,
            uploadDate: doc.uploadDate ?? doc.upload_date,
          }))
        );
        setMembers(membersRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("ไม่สามารถโหลดข้อมูลเอกสารหรือสมาชิกได้");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Upload handler
  const handleUpload = async (formData) => {
    try {
      const res = await api.post("/api/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newDoc = res.data;
      setDocuments((prev) => [
        { ...newDoc, uploadDate: newDoc.uploadDate ?? newDoc.upload_date },
        ...prev,
      ]);
      toast.success("อัปโหลดเอกสารสำเร็จ");
      setShowUploadModal(false);
    } catch (err) {
      console.error("Error uploading document:", err);
      const msg =
        err.response?.data?.message || "อัปโหลดไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
      toast.error(msg);
    }
  };

  // Single-delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าจะลบเอกสารนี้?")) return;
    try {
      await api.delete(`/api/documents/${id}`);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      toast.success("ลบเอกสารสำเร็จ");
    } catch (err) {
      console.error("Error deleting document:", err);
      toast.error("ไม่สามารถลบเอกสารได้");
    }
  };

  // Bulk-delete handler
  const handleDeleteSelected = async (ids) => {
    if (ids.length === 0) return;
    if (!window.confirm(`ลบเอกสารที่เลือก (${ids.length} รายการ)?`)) {
      return;
    }
    try {
      // Delete each in parallel
      await Promise.all(ids.map((id) => api.delete(`/api/documents/${id}`)));
      setDocuments((prev) => prev.filter((doc) => !ids.includes(doc.id)));
      toast.success(`ลบเอกสาร ${ids.length} รายการสำเร็จ`);
    } catch (err) {
      console.error("Bulk delete error:", err);
      toast.error("ไม่สามารถลบเอกสารที่เลือกได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setShowManageModal(false);
    }
  };

  // Modal open/close helpers
  const openUploadModal = () => setShowUploadModal(true);
  const closeUploadModal = () => setShowUploadModal(false);
  const openManageModal = () => setShowManageModal(true);
  const closeManageModal = () => setShowManageModal(false);

  // Filter by title
  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTitle.toLowerCase())
  );

  if (loading) {
    return <p className="loading">กำลังโหลดเอกสาร...</p>;
  }

  return (
    <div className="manage-documents-page">
      <h2 className="manage-documents-title">จัดการเอกสาร</h2>

      <div className="manage-documents-card">
        <div className="controls-row">
          <input
            type="text"
            className="search-input"
            placeholder="ค้นหาชื่อเอกสาร..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />

          <div className="button-group">
            <button
              className="manage-all-button"
              onClick={openManageModal}
              title="จัดการเอกสารทั้งหมด"
            >
              <FaCog /> จัดการเอกสาร
            </button>
            <button className="upload-button" onClick={openUploadModal}>
              <FaPaperPlane /> ส่งเอกสาร
            </button>
          </div>
        </div>

        <div className="document-table-wrapper">
          <DocumentTable
            documents={filteredDocuments}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {showUploadModal && (
        <UploadFormModal
          members={members}
          onClose={closeUploadModal}
          onSubmit={handleUpload}
        />
      )}

      {showManageModal && (
        <ManageAllModal
          documents={documents}
          onClose={closeManageModal}
          onDeleteSelected={handleDeleteSelected}
        />
      )}
    </div>
  );
}
