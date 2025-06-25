import React from "react";
import PropTypes from "prop-types";
import "./DocumentTable.css";

const DocumentTable = ({ documents, onDetail, onDownload }) => (
  <div className="dt-table-wrapper">
    <table className="dt-table">
      <thead>
        <tr>
          <th>ลำดับ</th>
          <th>ชื่อเอกสาร</th>
          <th>ผู้ส่ง</th>
          <th>วันที่ส่ง</th>
          <th>การจัดการ</th>
        </tr>
      </thead>
      <tbody>
        {documents.length > 0 ? (
          documents.map((doc, idx) => (
            <tr key={doc.id}>
              <td>{idx + 1}</td>
              <td>{doc.title}</td>
              <td>{doc.sender || "-"}</td>
              <td>{new Date(doc.uploadDate).toLocaleDateString("th-TH")}</td>
              <td className="dt-action-group">
                <button
                  className="dt-action-btn dt-detail-btn"
                  onClick={() => onDetail(doc)}
                  title="ดูรายละเอียด"
                >
                  ดูรายละเอียด
                </button>
                <button
                  className="dt-action-btn dt-download-btn"
                  onClick={() => onDownload(doc)}
                  title="ดาวน์โหลด"
                >
                  ดาวน์โหลด
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="dt-no-doc">
              ไม่มีเอกสาร
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

DocumentTable.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      sender: PropTypes.string,
      uploadDate: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDetail: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
};

export default DocumentTable;
