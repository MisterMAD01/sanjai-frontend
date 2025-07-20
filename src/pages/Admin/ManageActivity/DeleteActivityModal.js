import React from "react";

const DeleteActivityModal = ({
  selectedActivityName,
  onConfirm,
  onCancel,
  deleting,
}) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>ยืนยันลบกิจกรรม</h3>
        <p>คุณแน่ใจว่าต้องการลบกิจกรรม "{selectedActivityName}" หรือไม่?</p>
        <button
          className="activity-btn delete"
          onClick={onConfirm}
          disabled={deleting}
        >
          {deleting ? "กำลังลบ..." : "ลบกิจกรรม"}
        </button>
        <button onClick={onCancel}>ยกเลิก</button>
      </div>
    </div>
  );
};

export default DeleteActivityModal;
