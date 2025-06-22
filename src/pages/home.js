// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import api from "../api";
import MemberOverview from "../components/home/MemberOverview";
import MemberChartBar from "../components/home/MemberChartBar";
import MemberTable from "../components/home/MemberTable";

/**
 * Home page component
 * แสดงสรุปสถิติสมาชิกและตารางสมาชิกทั้งหมด
 */
const Home = () => {
  const [selectedType, setSelectedType] = useState("ทั้งหมด");
  const [stats, setStats] = useState({
    total: 0,
    honorary: 0,
    regular: 0,
    general: 0,
  });
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsRes, membersRes] = await Promise.all([
          api.get("/api/dashboard/stats"),
          api.get("/api/members"),
        ]);
        setStats(statsRes.data);
        setMembers(membersRes.data);
      } catch (error) {
        console.error("โหลดข้อมูลล้มเหลว:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const filteredMembers =
    selectedType === "ทั้งหมด"
      ? members
      : members.filter((m) => m.type === selectedType);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px", color: "#b0001c" }}>
        หน้าหลัก - สรุปข้อมูลสมาชิก
      </h1>

      {loading ? (
        <p>กำลังโหลดข้อมูล...</p>
      ) : (
        <>
          <MemberOverview
            stats={stats}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />
          <MemberChartBar members={filteredMembers} />
          <MemberTable members={members} selectedType={selectedType} />
        </>
      )}
    </div>
  );
};

export default Home;
