import React from "react";
import {
  UserGroupIcon,
  StarIcon,
  CheckCircleIcon,
  UserIcon,
} from "@heroicons/react/solid";
import "./MemberOverview.css";

const Card = ({ icon: Icon, label, value, colorClass, active, onClick }) => (
  <div
    className={`stat-card ${active ? "active-card" : ""}`}
    onClick={onClick}
    style={{ cursor: "pointer" }}
  >
    <div className="card-header">
      <div className={`icon ${colorClass}-bg`}>
        <Icon className={`icon-size ${colorClass}`} />
      </div>
      <div>
        <h3 className="label">{label}</h3>
        <p className="value">{value}</p>
      </div>
    </div>
  </div>
);

const MemberOverview = ({ stats, selectedType, setSelectedType }) => {
  return (
    <div className="dashboard-grid">
      <Card
        icon={UserGroupIcon}
        label="สมาชิกทั้งหมด"
        value={stats.total || 0}
        colorClass="blue"
        active={selectedType === "ทั้งหมด"}
        onClick={() => setSelectedType("ทั้งหมด")}
      />
      <Card
        icon={StarIcon}
        label="สมาชิกกิติมศักดิ์"
        value={stats.honorary || 0}
        colorClass="yellow"
        active={selectedType === "กิติมศักดิ์"}
        onClick={() => setSelectedType("กิติมศักดิ์")}
      />
      <Card
        icon={CheckCircleIcon}
        label="สมาชิกสามัญ"
        value={stats.regular || 0}
        colorClass="green"
        active={selectedType === "สามัญ"}
        onClick={() => setSelectedType("สามัญ")}
      />
      <Card
        icon={UserIcon}
        label="สมาชิกทั่วไป"
        value={stats.general || 0}
        colorClass="red"
        active={selectedType === "ทั่วไป"}
        onClick={() => setSelectedType("ทั่วไป")}
      />
    </div>
  );
};

export default MemberOverview;
