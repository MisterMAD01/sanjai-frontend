import React from "react";
import ActivityItem from "./ActivityItem";

const ActivityList = ({
  activities,
  registeredActivityIds,
  registering,
  onRegisterClick,
  onOpenModal,
}) => {
  if (activities.length === 0) return <p>ยังไม่มีกิจกรรม</p>;

  // เรียงกิจกรรมตามวันที่ (ใหม่สุดอยู่บน)
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <ul>
      {sortedActivities.map((activity) => (
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
