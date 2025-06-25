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
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          senderType: doc.senderType ?? doc.sender_type ?? "",
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

  const handleDownload = async (doc) => {
    if (!doc.filePath) {
      toast.warn("ไม่พบไฟล์สำหรับดาวน์โหลด.");
      return;
    }

    try {
      const res = await fetch(`${API}/api/my-documents/${doc.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        let message = `Download failed (${res.status})`;
        if (contentType && contentType.includes("application/json")) {
          const err = await res.json();
          message += `: ${err.message || res.statusText}`;
        }
        throw new Error(message);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const ext = doc.filePath.split(".").pop();
      a.href = url;
      a.download = `${doc.title || `document-${doc.id}`}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("ดาวน์โหลดเอกสารสำเร็จ!");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("เกิดข้อผิดพลาดในการดาวน์โหลดเอกสาร.");
    }
  };

  if (error) {
    return <p className="error-message">{error}</p>;
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
            fileUrl: selectedDoc.filePath
              ? `${API}/uploads/${selectedDoc.filePath}`
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
