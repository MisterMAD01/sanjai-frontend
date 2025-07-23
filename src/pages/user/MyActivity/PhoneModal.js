import React, { useState } from "react";

const PhoneModal = ({
  open,
  onClose,
  phoneNumber,
  setPhoneNumber,
  onConfirm,
}) => {
  const [error, setError] = useState("");

  if (!open) return null;

  const handleConfirm = () => {
    if (phoneNumber.length !== 10) {
      setError("กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก");
      return;
    }
    setError("");
    onConfirm();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>
        <h2>กรอกเบอร์โทรสำหรับลงทะเบียน</h2>
        <input
          type="text"
          placeholder="เบอร์โทรศัพท์"
          value={phoneNumber}
          maxLength={10}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              setPhoneNumber(value);
              if (value.length === 10) {
                setError("");
              }
            }
          }}
          style={{ width: "100%", padding: "8px", fontSize: "16px" }}
        />
        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

        <div style={{ marginTop: "1rem", textAlign: "right" }}>
          <button onClick={handleConfirm}>ยืนยันการลงทะเบียน</button>
        </div>
      </div>
    </div>
  );
};

export default PhoneModal;
