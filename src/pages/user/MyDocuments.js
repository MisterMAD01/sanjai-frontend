// src/pages/user/MyDocuments.jsx

import React, { useEffect, useState, useContext } from "react";
import DocumentDetailModal from "../../components/User/mydocuments/DocumentDetailModal";
import DocumentTable from "../../components/User/mydocuments/DocumentTable";
import { UserContext } from "../../contexts/UserContext";
import { toast } from "react-toastify";
import "./MyDocuments.css";

const API = process.env.REACT_APP_API;

const MyDocuments = () => {
  const { accessToken, loadingUser } = useContext(UserContext);
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch docs
  useEffect(() => {
    if (!accessToken && !loadingUser) {
      setError("ไม่พบสิทธิ์การเข้าถึง กรุณาเข้าสู่ระบบ.");
      setLoading(false);
      return;
    }
    if (!accessToken) return;

    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/api/my-documents`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            `Error ${res.status}: ${errorData.message || res.statusText}`
          );
        }
        const data = await res.json();
        const raw = data.documents || data;
        const normalized = raw.map((doc) => ({
          id: doc.id || doc.document_id,
          title: doc.title,
          description: doc.description ?? "-",
          sender: doc.sender,
          uploadDate: doc.uploadDate ?? doc.upload_date,
          filePath: doc.filePath ?? doc.file_path,
        }));
        setDocuments(normalized);
      } catch (err) {
        console.error("Error fetching documents:", err);
        toast.error("ไม่สามารถโหลดรายการเอกสารได้ กรุณาลองใหม่อีกครั้ง");
        setError("ไม่สามารถโหลดรายการเอกสารได้");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [accessToken, loadingUser]);

  // Filter by search term
  const filteredDocs = documents.filter((doc) => {
    const term = searchTerm.toLowerCase();
    return (
      doc.title.toLowerCase().includes(term) ||
      doc.description.toLowerCase().includes(term) ||
      (doc.sender || "").toLowerCase().includes(term)
    );
  });

  const handleDownload = async (doc) => {
    if (!doc.filePath) {
      toast.warn("ไม่พบไฟล์สำหรับดาวน์โหลด.");
      return;
    }
    try {
      const res = await fetch(`${API}/api/my-documents/${doc.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      const ext = doc.filePath.split(".").pop();
      a.href = url;
      a.download = `${doc.title || `document-${doc.id}`}.${ext}`;
      window.document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("ดาวน์โหลดเอกสารสำเร็จ!");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("เกิดข้อผิดพลาดในการดาวน์โหลดเอกสาร.");
    }
  };

  if (loading) {
    return <p className="loading-message">กำลังโหลดเอกสารของฉัน…</p>;
  }
  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="my-documents-container">
      <h2 className="page-title">เอกสารของฉัน</h2>

      <div className="md-search-container">
        <input
          type="text"
          className="md-search-input"
          placeholder=" ค้นหาเอกสาร..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <DocumentTable
        documents={filteredDocs}
        onDetail={setSelectedDoc}
        onDownload={handleDownload}
      />

      {selectedDoc && (
        <DocumentDetailModal
          doc={{
            ...selectedDoc,
            fileUrl: selectedDoc.filePath
              ? `${API}/api/my-documents/${selectedDoc.id}`
              : null,
          }}
          accessToken={accessToken}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </div>
  );
};

export default MyDocuments;
