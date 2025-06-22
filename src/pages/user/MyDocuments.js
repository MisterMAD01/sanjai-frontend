// src/components/user/MyDocuments.jsx
import React, { useEffect, useState, useContext } from "react";
import DocumentDetailModal from "../../components/User/mydocuments/DocumentDetailModal";
import DocumentTable from "../../components/User/mydocuments/DocumentTable";
import { UserContext } from "../../contexts/UserContext";
import "./MyDocuments.css";

const API = process.env.REACT_APP_API;

const MyDocuments = () => {
  const { accessToken, loadingUser } = useContext(UserContext);
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;

    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/my-documents`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        const normalized = data.map((doc) => ({
          id: doc.id,
          title: doc.title,
          sender: doc.sender,
          uploadDate: doc.uploadDate ?? doc.upload_date,
          filePath: doc.filePath ?? doc.file_path,
        }));
        setDocuments(normalized);
      } catch (err) {
        console.error("Error fetching documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [accessToken]);

  const handleDownload = async (doc) => {
    try {
      const res = await fetch(`${API}/api/my-documents/${doc.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error(`Download failed: ${res.status}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const ext = doc.filePath.split(".").pop();
      a.download = `${doc.title || doc.id}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("ดาวน์โหลดไม่สำเร็จ");
    }
  };

  if (loadingUser || loading) {
    return <p className="loading">กำลังโหลดเอกสาร...</p>;
  }

  return (
    <div className="my-documents-container">
      <h2 className="page-title">เอกสารของฉัน</h2>

      <DocumentTable
        documents={documents}
        onDetail={setSelectedDoc}
        onDownload={handleDownload}
      />

      {selectedDoc && (
        <DocumentDetailModal
          document={{
            ...selectedDoc,
            fileUrl: `${API}/uploads/${selectedDoc.filePath}`,
          }}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </div>
  );
};

export default MyDocuments;
