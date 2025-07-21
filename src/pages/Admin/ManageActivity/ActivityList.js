import React from "react";

const ActivityList = ({
  activities,
  onEdit,
  onDelete,
  onToggleRegister,
  onViewApplicants,
}) => {
  return (
    <>
      {activities.map((activity) => (
        <div key={activity.id} className="activity-card">
          <h3>{activity.name}</h3>
          <p>
            <strong>วันที่:</strong>{" "}
            {activity.date &&
              activity.date.substring(0, 10).split("-").reverse().join("/")}
          </p>

          <p>
            <strong>สถานที่:</strong> {activity.location}
          </p>
          <p>{activity.detail}</p>
          {activity.image && (
            <img
              src={`${process.env.REACT_APP_API}/api/user/uploads/${activity.image}`}
              alt="กิจกรรม"
              width={250}
            />
          )}
          <p>
            <strong>สถานะ:</strong>{" "}
            {activity.register_open ? "เปิดรับสมัคร" : "ปิดรับสมัคร"}
          </p>

          <button
            className="activity-btn toggle"
            onClick={() =>
              onToggleRegister(activity.id, activity.register_open)
            }
          >
            {activity.register_open ? "ปิดรับสมัคร" : "เปิดรับสมัคร"}
          </button>

          <button
            className="activity-btn edit"
            onClick={() => onEdit(activity)}
          >
            แก้ไขกิจกรรม
          </button>

          <button
            className="activity-btn applicants"
            onClick={() => onViewApplicants(activity.id)}
          >
            ดูผู้สมัคร
          </button>

          <button
            className="activity-btn delete"
            style={{ backgroundColor: "red", color: "white" }}
            onClick={() => onDelete(activity.id, activity.name)}
          >
            ลบกิจกรรม
          </button>
        </div>
      ))}
    </>
  );
};

export default ActivityList;
