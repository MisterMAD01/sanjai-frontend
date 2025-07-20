import React from "react";

const ActivityItem = ({
  activity,
  isRegistered,
  isRegistering,
  onRegisterClick,
  onOpenModal,
}) => {
  const formattedDate = (() => {
    const dateObj = new Date(activity.date);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  })();

  return (
    <li className="activity-item">
      <div className="activity-info">
        <h3>{activity.name}</h3>
        <p>วันที่จัด: {formattedDate}</p>
        <p>สถานที่: {activity.location}</p>
        <p>{activity.detail}</p>

        <div className="button-group">
          <button
            disabled={isRegistering || isRegistered}
            onClick={() => onRegisterClick(activity.id)}
          >
            {isRegistered
              ? "สมัครแล้ว"
              : isRegistering
              ? "กำลังลงทะเบียน..."
              : "สมัครกิจกรรม"}
          </button>
          <button onClick={() => onOpenModal("schedule", activity)}>
            กำหนดการ
          </button>
          {isRegistered && (
            <button onClick={() => onOpenModal("qr", activity)}>
              QR code เข้าไลน์กลุ่ม
            </button>
          )}
        </div>
      </div>

      {activity.image_path && (
        <img
          src={`${process.env.REACT_APP_API.replace("/api", "")}/uploads/${
            activity.image_path
          }`}
          alt={activity.name}
          className="activity-image"
        />
      )}
    </li>
  );
};

export default ActivityItem;
