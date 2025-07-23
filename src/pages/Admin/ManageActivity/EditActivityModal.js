import React from "react";

const EditActivityModal = ({ formData, setFormData, onSubmit, onClose }) => {
  // ฟังก์ชันช่วยแยกชื่อไฟล์จาก URL
  const getFileNameFromUrl = (url) => {
    if (!url) return "";
    return url.split("/").pop();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 600 }}
      >
        <h2>{formData.id ? "แก้ไขกิจกรรม" : "สร้างกิจกรรมใหม่"}</h2>
        <form onSubmit={onSubmit} className="activity-form">
          <label>ชื่อกิจกรรม</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <label>วันที่จัด</label>
          <input
            type="date"
            name="date"
            value={formData.date || ""}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          <label>รายละเอียด</label>
          <textarea
            name="detail"
            value={formData.detail || ""}
            onChange={(e) =>
              setFormData({ ...formData, detail: e.target.value })
            }
            rows={4}
          />

          <label>สถานที่</label>
          <input
            type="text"
            name="location"
            value={formData.location || ""}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          />

          <label>แนบไฟล์กำหนดการ (PDF/PNG)</label>
          <input
            type="file"
            name="schedule"
            accept="application/pdf,image/png,image/jpeg"
            onChange={(e) =>
              setFormData({ ...formData, schedule: e.target.files[0] })
            }
          />
          {/* แสดงชื่อไฟล์เก่า ถ้า schedule เป็น URL */}
          {formData.schedule && typeof formData.schedule === "string" && (
            <p style={{ marginTop: 4, fontSize: 14 }}>
              ไฟล์กำหนดการเดิม:{" "}
              <a
                href={formData.schedule}
                target="_blank"
                rel="noopener noreferrer"
              >
                {getFileNameFromUrl(formData.schedule)}
              </a>
            </p>
          )}
          {/* แสดงชื่อไฟล์ที่เลือกใหม่ ถ้า schedule เป็น File Object */}
          {formData.schedule && formData.schedule.name && (
            <p style={{ marginTop: 4, fontSize: 14 }}>
              ไฟล์ที่เลือก: {formData.schedule.name}
            </p>
          )}

          <label>แนบไฟล์ QR Code (PNG)</label>
          <input
            type="file"
            name="qr"
            accept="image/png"
            onChange={(e) =>
              setFormData({ ...formData, qr: e.target.files[0] })
            }
          />
          {/* แสดงชื่อไฟล์ QR เก่า ถ้าเป็น URL */}
          {formData.qr && typeof formData.qr === "string" && (
            <p style={{ marginTop: 4, fontSize: 14 }}>
              QR Code เดิม:{" "}
              <a href={formData.qr} target="_blank" rel="noopener noreferrer">
                {getFileNameFromUrl(formData.qr)}
              </a>
            </p>
          )}
          {/* แสดงชื่อไฟล์ QR ที่เลือกใหม่ */}
          {formData.qr && formData.qr.name && (
            <p style={{ marginTop: 4, fontSize: 14 }}>
              ไฟล์ที่เลือก: {formData.qr.name}
            </p>
          )}

          <button type="submit" className="activity-btn create">
            {formData.id ? "บันทึกการแก้ไข" : "สร้างกิจกรรม"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="activity-btn create"
          >
            ยกเลิก
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditActivityModal;
