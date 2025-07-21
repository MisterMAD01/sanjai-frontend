import React from "react";

const DetailModal = ({ open, type, activity, onClose }) => {
  if (!open || !activity) return null;

  const getContent = () => {
    const filePath =
      type === "schedule"
        ? activity.image_path_schedule
        : activity.image_path_qr;

    if (!filePath) return <p>ไม่มีข้อมูล</p>;

    const fileUrl = `${process.env.REACT_APP_API.replace(
      "/api",
      ""
    )}/uploads/${filePath}`;
    const ext = filePath.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) {
      return <img src={fileUrl} alt={type} style={{ maxWidth: "100%" }} />;
    } else if (ext === "pdf") {
      return (
        <embed
          src={fileUrl}
          type="application/pdf"
          width="100%"
          height="600px"
        />
      );
    } else {
      return <p>ไม่รองรับไฟล์ประเภทนี้</p>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>
        <h2>
          {type === "schedule" ? "กำหนดการกิจกรรม" : "QR code เข้าไลน์กลุ่ม"}:{" "}
          {activity.name}
        </h2>
        {getContent()}
      </div>
    </div>
  );
};

export default DetailModal;
