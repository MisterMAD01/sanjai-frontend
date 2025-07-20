import React from "react";
import ActivityItem from "./ActivityItem";

const ActivityList = ({
  activities,
  registeredActivityIds,
  registering,
  onRegisterClick,
  onOpenModal,
}) => {
  if (activities.length === 0) return <p>ไม่มีกิจกรรมเปิดรับสมัครในขณะนี้</p>;

  return (
    <ul>
      {activities.map((activity) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          isRegistered={registeredActivityIds.includes(activity.id)}
          isRegistering={registering === activity.id}
          onRegisterClick={onRegisterClick}
          onOpenModal={onOpenModal}
        />
      ))}
    </ul>
  );
};

export default ActivityList;
