import React, { useState, useEffect } from "react";
import api from "../../../api";
import "./ApplicantsModal.css";

const ApplicantsModal = ({ applicants, onClose, activityId }) => {
  const [search, setSearch] = useState("");
  const [filteredApplicants, setFilteredApplicants] = useState(
    applicants || []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const filtered = applicants.filter((applicant) =>
      applicant.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredApplicants(filtered);
    setCurrentPage(1); // reset page when search changes
  }, [search, applicants]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentApplicants = filteredApplicants.slice(indexOfFirst, indexOfLast);

  const handleDownload = async () => {
    if (!activityId) {
      alert("ไม่พบข้อมูลกิจกรรมสำหรับดาวน์โหลด");
      return;
    }
    try {
      const response = await api.get(
        `/api/admin/activities/${activityId}/applicants/download`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const contentDisposition = response.headers["content-disposition"];

      let filename = "รายชื่อผู้เข้าร่วมกิจกรรม.xlsx";

      if (contentDisposition) {
        const utf8Match = contentDisposition.match(
          /filename\*=UTF-8''([^;]+)/i
        );
        if (utf8Match && utf8Match[1]) {
          filename = decodeURIComponent(utf8Match[1]);
        } else {
          const normalMatch = contentDisposition.match(
            /filename="?([^";]+)"?/i
          );
          if (normalMatch && normalMatch[1]) filename = normalMatch[1];
        }
      }

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("ดาวน์โหลดไม่สำเร็จ", error);
      alert("ดาวน์โหลดไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="applicant-modal-overlay" onClick={onClose}>
      <div
        className="applicant-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="applicant-modal-close" onClick={onClose}>
          &times;
        </button>
        <h3>รายชื่อผู้สมัครกิจกรรม</h3>

        <input
          type="text"
          placeholder="ค้นหาชื่อผู้สมัคร"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="applicant-modal-search"
        />

        <button
          className="applicant-modal-download-btn"
          onClick={handleDownload}
        >
          ดาวน์โหลดรายชื่อ (Excel)
        </button>

        {currentApplicants.length > 0 ? (
          <ul>
            {currentApplicants.map((applicant) => (
              <li key={applicant.id}>
                {applicant.name} (เลขที่สมาชิก: {applicant.member_id}) -{" "}
                {applicant.phone}
              </li>
            ))}
          </ul>
        ) : (
          <p>ไม่พบชื่อผู้สมัคร</p>
        )}

        <div className="applicant-modal-pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt; ก่อนหน้า
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            ถัดไป &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsModal;
