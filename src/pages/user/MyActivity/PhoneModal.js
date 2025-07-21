import React from "react";

const PhoneModal = ({
  open,
  onClose,
  phoneNumber,
  setPhoneNumber,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>
        <h2>กรอกเบอร์โทรสำหรับลงทะเบียน</h2>
        <input
          type="tel"
          placeholder="เบอร์โทรศัพท์"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={{ width: "100%", padding: "8px", fontSize: "16px" }}
        />
        <div style={{ marginTop: "1rem", textAlign: "right" }}>
          <button onClick={onConfirm}>ยืนยันการลงทะเบียน</button>
        </div>
      </div>
    </div>
  );
};

export default PhoneModal;
